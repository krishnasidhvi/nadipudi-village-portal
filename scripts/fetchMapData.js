// Downloads map features around Nadipudi from OpenStreetMap (via Overpass)
// and writes src/data/map/osm.json. Run occasionally with `npm run fetch-map`,
// e.g. after villagers add the temple, schools or canals to OpenStreetMap.
// Data © OpenStreetMap contributors, ODbL.

import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "src", "data", "map", "osm.json");
const ENDPOINTS = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter"];

// Area drawn on the map (matches scripts/fetch_buildings.py) and a wider area
// for neighbouring villages.
const AREA = "16.632,81.818,16.664,81.852";
const NEARBY = "16.610,81.790,16.690,81.880";
const REGION = "16.30,81.40,17.20,82.00";

const QUERY = `
[out:json][timeout:120];
(
  way["waterway"~"^(river|canal|drain|stream)$"](${AREA});
  way["natural"="water"](${AREA});
  way["highway"~"^(primary|secondary|tertiary|unclassified|residential|track|service)$"](${AREA});
  nwr["amenity"](${AREA});
  nwr["building"~"^(temple|church|mosque|school)$"](${AREA});
  nwr["historic"](${AREA});
)->.local;
.local out geom;
node["place"~"^(village|hamlet)$"](${NEARBY});
out;
(
  node["place"~"^(town|city)$"](${REGION});
  // Mandal headquarters, tagged as a village in OpenStreetMap.
  node["place"]["name"="Penugonda"](${REGION});
  node["railway"="station"](${REGION});
  nwr["aeroway"="aerodrome"](${REGION});
);
out center;
`;

async function overpass() {
  let lastError;
  for (const url of ENDPOINTS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "User-Agent": "nadipudi-village-portal-map/1.0", "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ data: QUERY }),
        signal: AbortSignal.timeout(180000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} from ${new URL(url).host}`);
      return await res.json();
    } catch (err) {
      lastError = err;
      console.warn(`[osm] ${err.message}, trying next server`);
    }
  }
  throw lastError;
}

const r6 = (n) => Math.round(n * 1e6) / 1e6;
const line = (geometry) => geometry.map((p) => [r6(p.lon), r6(p.lat)]);
const point = (e) => (e.type === "node" ? [r6(e.lon), r6(e.lat)] : [r6(e.center.lon), r6(e.center.lat)]);

const { elements } = await overpass();

const features = [];
const places = [];
const towns = [];
const stations = [];
const airports = [];

for (const e of elements) {
  const t = e.tags || {};
  const names = { name: t.name || null, nameTe: t["name:te"] || null };

  if (t.place === "village" || t.place === "hamlet") {
    places.push({ ...names, kind: t.place, coord: point(e) });
  } else if (t.place === "town" || t.place === "city" || t.name === "Penugonda") {
    towns.push({ ...names, kind: t.place, coord: point(e) });
  } else if (t.railway === "station") {
    stations.push({ ...names, coord: point(e) });
  } else if (t.aeroway === "aerodrome") {
    airports.push({ ...names, iata: t.iata || null, coord: point(e) });
  } else if (e.type === "way" && e.geometry) {
    const coords = line(e.geometry);
    const closed = coords.length > 3 && coords[0][0] === coords.at(-1)[0] && coords[0][1] === coords.at(-1)[1];
    const kind = t.waterway ? "water-line" : t.natural === "water" ? "water-area" : t.highway ? "road" : "poi";
    features.push({
      type: "Feature",
      properties: { kind, ...names, highway: t.highway || null, waterway: t.waterway || null, amenity: t.amenity || null },
      geometry: kind === "water-area" && closed ? { type: "Polygon", coordinates: [coords] } : kind === "poi" ? { type: "Point", coordinates: point({ type: "way", center: { lat: e.geometry[0].lat, lon: e.geometry[0].lon } }) } : { type: "LineString", coordinates: coords },
    });
  } else if (e.type === "node" && (t.amenity || t.historic || t.building)) {
    features.push({
      type: "Feature",
      properties: { kind: "poi", ...names, amenity: t.amenity || t.historic || t.building },
      geometry: { type: "Point", coordinates: point(e) },
    });
  }
}

const byName = (a, b) => (a.name || "").localeCompare(b.name || "");
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(
  OUT,
  JSON.stringify({
    source: "© OpenStreetMap contributors (ODbL)",
    fetchedAt: new Date().toISOString(),
    area: AREA.split(",").map(Number),
    features: { type: "FeatureCollection", features },
    places: places.sort(byName),
    towns: towns.sort(byName),
    stations: stations.sort(byName),
    airports: airports.sort(byName),
  }) + "\n",
  "utf8"
);

const count = (kind) => features.filter((f) => f.properties.kind === kind).length;
console.log(
  `[osm] ${count("road")} roads, ${count("water-line")} waterways, ${count("water-area")} water bodies, ${count("poi")} points of interest, ` +
    `${places.length} villages/hamlets, ${towns.length} towns, ${stations.length} stations, ${airports.length} airports`
);

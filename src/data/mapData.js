// Map page data. Points come from OpenStreetMap (src/data/map/osm.json, made by
// scripts/fetchMapData.js) and building outlines from Overture Maps
// (src/data/map/buildings.json, made by scripts/fetch_buildings.py).
//
// No village boundary is drawn: no openly licensed official boundary exists
// for Nadipudi. Do not draw one by hand.

import osm from "./map/osm.json";
import { templeInfo } from "./templeData";
import { distanceKm, distanceToLineKm } from "../utils/geo";

export { osm };

const villageNode = osm.places.find((p) => p.nameTe === "నడిపూడి");

// [lon, lat]
export const VILLAGE = villageNode ? villageNode.coord : [81.833763, 16.648554];
export const TEMPLE = [templeInfo.coords[1], templeInfo.coords[0]];

// The area covered by the building outlines: [west, south, east, north].
export const LAYOUT_BBOX = [81.818, 16.632, 81.852, 16.664];

export const GODAVARI_KM = (() => {
  const river = osm.features.features.filter((f) => f.properties.kind === "water-line" && f.properties.name === "Godavari");
  if (!river.length) return null;
  return Math.min(...river.map((f) => distanceToLineKm(VILLAGE, f.geometry.coordinates)));
})();

const withDistance = (list) =>
  list.map((p) => ({ ...p, km: distanceKm(VILLAGE, p.coord) })).sort((a, b) => a.km - b.km);

export const neighbours = withDistance(osm.places.filter((p) => p !== villageNode)).filter((p) => p.km <= 4.5);

// Towns people actually travel to, nearest first.
const TOWN_NAMES = ["Palakollu", "Tanuku", "Narasapuram", "Bhimavaram", "Rajamahendravaram", "Ravulapalem", "Tadepallegudem"];
export const towns = withDistance(osm.towns.filter((t) => TOWN_NAMES.includes(t.name)));
export const stations = withDistance(osm.stations).slice(0, 3);
export const airport = withDistance(osm.airports)[0] || null;

// Penugonda (mandal headquarters) is not mapped as a place in OpenStreetMap
// near the village, so its distance comes from the census village directory.
export const PENUGONDA_KM = { km: 12, sourceUrl: "https://villageinfo.in/andhra-pradesh/west-godavari/penugonda/nadipudi/" };

export const ELEVATION_M = "12–14";

export const ATTRIBUTION = {
  osm: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
  buildings:
    'Buildings: <a href="https://sites.research.google/open-buildings/" target="_blank" rel="noopener">Google Open Buildings</a> via <a href="https://overturemaps.org/" target="_blank" rel="noopener">Overture Maps</a>',
  esri: 'Imagery © <a href="https://www.esri.com/" target="_blank" rel="noopener">Esri</a>, Maxar, Earthstar Geographics',
};

export const TILES = {
  street: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
};

export const OSM_EDIT_URL = `https://www.openstreetmap.org/edit#map=17/${VILLAGE[1]}/${VILLAGE[0]}`;

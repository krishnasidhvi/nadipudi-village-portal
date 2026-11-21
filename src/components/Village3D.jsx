import React, { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?url";
import "maplibre-gl/dist/maplibre-gl.css";
import { RotateCw, RotateCcw, Satellite, Map as MapIcon, Pause } from "lucide-react";
import { osm, VILLAGE, TEMPLE, LAYOUT_BBOX, ATTRIBUTION, TILES } from "../data/mapData";
import { templeInfo } from "../data/templeData";
import { useBuildings } from "../utils/useBuildings";

// The worker is loaded from a URL that the bundler cannot see on its own.
maplibregl.setWorkerUrl(workerUrl);

// Footprints have no height data, so every building is drawn at the same
// height. This is a layout model, not a picture of the real buildings.
export const BUILDING_HEIGHT_M = 5;

const START = { center: VILLAGE, zoom: 16.2, pitch: 62, bearing: -25 };

function markerElement(html, className) {
  const el = document.createElement("div");
  el.className = className;
  el.innerHTML = html;
  return el;
}

export default function Village3D({ lang }) {
  const isTe = lang === "te";
  const container = useRef(null);
  const mapRef = useRef(null);
  const spinRef = useRef(null);
  const buildings = useBuildings();
  const [base, setBase] = useState("satellite");
  const [spinning, setSpinning] = useState(false);
  const [ready, setReady] = useState(false);
  const [webglError, setWebglError] = useState(false);

  // Create the map once the building outlines have arrived.
  useEffect(() => {
    if (buildings.status !== "ok" || !container.current) return;
    setSpinning(false);

    let map;
    try {
      map = new maplibregl.Map({
        container: container.current,
        style: {
          version: 8,
          sources: {
            satellite: { type: "raster", tiles: [TILES.satellite], tileSize: 256, maxzoom: 17, attribution: ATTRIBUTION.esri },
            street: { type: "raster", tiles: [TILES.street], tileSize: 256, maxzoom: 19, attribution: ATTRIBUTION.osm },
            buildings: { type: "geojson", data: buildings.data, attribution: ATTRIBUTION.buildings },
            osm: { type: "geojson", data: osm.features, attribution: ATTRIBUTION.osm },
          },
          layers: [
            { id: "satellite", type: "raster", source: "satellite" },
            { id: "street", type: "raster", source: "street", layout: { visibility: "none" } },
            {
              id: "water",
              type: "line",
              source: "osm",
              filter: ["==", ["get", "kind"], "water-line"],
              paint: { "line-color": "#38bdf8", "line-width": 4, "line-opacity": 0.85 },
            },
            {
              id: "roads",
              type: "line",
              source: "osm",
              filter: ["==", ["get", "kind"], "road"],
              paint: {
                "line-color": ["match", ["get", "highway"], ["primary", "secondary", "tertiary"], "#f59e0b", "#fde68a"],
                "line-width": ["match", ["get", "highway"], ["primary", "secondary", "tertiary"], 4, 2],
                "line-opacity": 0.85,
              },
            },
            {
              id: "buildings-3d",
              type: "fill-extrusion",
              source: "buildings",
              paint: {
                "fill-extrusion-color": ["case", ["get", "temple"], "#f97316", "#f5e9d3"],
                "fill-extrusion-height": BUILDING_HEIGHT_M,
                "fill-extrusion-base": 0,
                "fill-extrusion-opacity": 0.92,
              },
            },
          ],
        },
        ...START,
        maxBounds: [
          [LAYOUT_BBOX[0] - 0.02, LAYOUT_BBOX[1] - 0.02],
          [LAYOUT_BBOX[2] + 0.02, LAYOUT_BBOX[3] + 0.02],
        ],
        maxPitch: 75,
        attributionControl: { compact: true },
      });
    } catch {
      setWebglError(true);
      return;
    }

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");
    map.on("load", () => setReady(true));

    new maplibregl.Marker({
      element: markerElement(`<span>${isTe ? "నడిపూడి" : "Nadipudi"}</span>`, "map3d-label map3d-label-village"),
      anchor: "bottom",
    })
      .setLngLat(VILLAGE)
      .addTo(map);

    new maplibregl.Marker({
      element: markerElement(`<span>🛕 ${isTe ? "శ్రీ సుబ్రహ్మణ్యేశ్వర స్వామి ఆలయం" : "Subramanyeswara Temple"}</span>`, "map3d-label map3d-label-temple"),
      anchor: "bottom",
      offset: [0, -14],
    })
      .setLngLat(TEMPLE)
      .setPopup(new maplibregl.Popup({ offset: 24 }).setText(isTe ? templeInfo.nameTe : templeInfo.nameEn))
      .addTo(map);

    // Stop the slow rotation as soon as someone grabs the map.
    const stopSpin = () => setSpinning(false);
    map.on("mousedown", stopSpin);
    map.on("touchstart", stopSpin);

    mapRef.current = map;
    return () => {
      cancelAnimationFrame(spinRef.current);
      setReady(false);
      map.remove();
      mapRef.current = null;
    };
    // Re-created when the language changes so the labels follow it.
  }, [buildings.status, buildings.data, isTe]);

  // Satellite / street base layer (applied once the style has loaded, and
  // again whenever the map is re-created).
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    map.setLayoutProperty("satellite", "visibility", base === "satellite" ? "visible" : "none");
    map.setLayoutProperty("street", "visibility", base === "street" ? "visible" : "none");
  }, [base, ready]);

  // Slow orbit around the village.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !spinning) return;
    let last = performance.now();
    const step = (now) => {
      map.setBearing(map.getBearing() + (now - last) * 0.006);
      last = now;
      spinRef.current = requestAnimationFrame(step);
    };
    spinRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(spinRef.current);
  }, [spinning]);

  const reset = () => {
    setSpinning(false);
    mapRef.current?.flyTo({ ...START, duration: 1500 });
  };

  if (webglError) {
    return (
      <div className="map3d-message">
        {isTe
          ? "ఈ పరికరం లేదా బ్రౌజర్ 3D పటాన్ని చూపించలేదు (WebGL అందుబాటులో లేదు). దయచేసి 2D పటం చూడండి."
          : "This device or browser can't show the 3D view (WebGL is unavailable). Please use the 2D map."}
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <div ref={container} className="map3d-canvas" />

      {buildings.status === "loading" && <div className="map3d-message map3d-overlay">{isTe ? "3D పటం లోడ్ అవుతోంది…" : "Loading 3D view…"}</div>}
      {buildings.status === "error" && (
        <div className="map3d-message map3d-overlay">
          {isTe ? "భవనాల సమాచారం లోడ్ కాలేదు. ఇంటర్నెట్ కనెక్షన్ చూసి మళ్ళీ ప్రయత్నించండి." : "Couldn't load the building data. Check your connection and try again."}
        </div>
      )}

      {buildings.status === "ok" && (
        <div className="map3d-toolbar">
          <button className="btn-toggle" onClick={() => setSpinning((s) => !s)}>
            {spinning ? <Pause size={15} /> : <RotateCw size={15} />}
            <span>{spinning ? (isTe ? "ఆపు" : "Stop") : isTe ? "తిప్పి చూపించు" : "Fly around"}</span>
          </button>
          <button className="btn-toggle" onClick={reset}>
            <RotateCcw size={15} />
            <span>{isTe ? "మొదటి దృశ్యం" : "Reset view"}</span>
          </button>
          <button className="btn-toggle" onClick={() => setBase((b) => (b === "satellite" ? "street" : "satellite"))}>
            {base === "satellite" ? <MapIcon size={15} /> : <Satellite size={15} />}
            <span>{base === "satellite" ? (isTe ? "వీధి పటం" : "Street map") : isTe ? "ఉపగ్రహ చిత్రం" : "Satellite"}</span>
          </button>
        </div>
      )}
    </div>
  );
}

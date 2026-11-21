import React from "react";
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Marker, Tooltip, Popup, LayersControl, LayerGroup, Rectangle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { osm, VILLAGE, TEMPLE, LAYOUT_BBOX, ATTRIBUTION, TILES, neighbours } from "../data/mapData";
import { templeInfo } from "../data/templeData";
import { useBuildings } from "../utils/useBuildings";
import { directionsUrl } from "../utils/geo";

const ll = ([lon, lat]) => [lat, lon];

const templeIcon = L.divIcon({
  className: "map-emoji-icon",
  html: '<span style="font-size:26px;line-height:26px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.8))">🛕</span>',
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

const roadStyle = (feature) => {
  const major = ["primary", "secondary", "tertiary"].includes(feature.properties.highway);
  return { color: major ? "#f59e0b" : "#fde68a", weight: major ? 4 : 2, opacity: 0.9 };
};

const waterStyle = { color: "#38bdf8", weight: 5, opacity: 0.9 };

const buildingStyle = (feature) =>
  feature.properties.temple
    ? { color: "#f97316", weight: 2, fillColor: "#f97316", fillOpacity: 0.85 }
    : { color: "#fef3c7", weight: 1, fillColor: "#fef3c7", fillOpacity: 0.35 };

export default function VillageMap2D({ lang }) {
  const isTe = lang === "te";
  const buildings = useBuildings();
  const name = (p) => (isTe && p.nameTe ? p.nameTe : p.name);

  const roads = { type: "FeatureCollection", features: osm.features.features.filter((f) => f.properties.kind === "road") };
  const water = { type: "FeatureCollection", features: osm.features.features.filter((f) => f.properties.kind.startsWith("water")) };

  return (
    <MapContainer center={ll(VILLAGE)} zoom={15} scrollWheelZoom={false} style={{ height: "520px", width: "100%", borderRadius: "12px" }}>
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name={isTe ? "ఉపగ్రహ చిత్రం" : "Satellite"}>
          <TileLayer url={TILES.satellite} attribution={ATTRIBUTION.esri} maxNativeZoom={17} maxZoom={19} />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name={isTe ? "వీధి పటం" : "Street map"}>
          <TileLayer url={TILES.street} attribution={ATTRIBUTION.osm} maxZoom={19} />
        </LayersControl.BaseLayer>

        <LayersControl.Overlay checked name={isTe ? "భవనాలు" : "Buildings"}>
          <LayerGroup>
            {buildings.status === "ok" && <GeoJSON data={buildings.data} style={buildingStyle} attribution={ATTRIBUTION.buildings} />}
          </LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name={isTe ? "రోడ్లు & గోదావరి" : "Roads & Godavari"}>
          <GeoJSON data={{ type: "FeatureCollection", features: [...water.features, ...roads.features] }} style={(f) => (f.properties.kind === "road" ? roadStyle(f) : waterStyle)} attribution={ATTRIBUTION.osm} />
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name={isTe ? "పొరుగు గ్రామాలు" : "Neighbouring villages"}>
          <LayerGroup>
            {neighbours.map((p) => (
              <CircleMarker key={`${p.name}-${p.coord}`} center={ll(p.coord)} radius={5} pathOptions={{ color: "#fff", weight: 1.5, fillColor: "#a855f7", fillOpacity: 0.9 }}>
                <Tooltip direction="top" offset={[0, -4]}>
                  {name(p)} · {p.km.toFixed(1)} km
                </Tooltip>
              </CircleMarker>
            ))}
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>

      <Rectangle
        bounds={[
          [LAYOUT_BBOX[1], LAYOUT_BBOX[0]],
          [LAYOUT_BBOX[3], LAYOUT_BBOX[2]],
        ]}
        pathOptions={{ color: "#ffffff", weight: 1, dashArray: "6 6", fill: false, opacity: 0.6 }}
        interactive={false}
      />

      <CircleMarker center={ll(VILLAGE)} radius={9} pathOptions={{ color: "#fff", weight: 2, fillColor: "#22c55e", fillOpacity: 1 }}>
        <Tooltip permanent direction="right" offset={[10, 0]}>
          <strong>{isTe ? "నడిపూడి" : "Nadipudi"}</strong>
        </Tooltip>
        <Popup>
          <strong>{isTe ? "నడిపూడి గ్రామం" : "Nadipudi village"}</strong>
          <br />
          {VILLAGE[1].toFixed(5)}° N, {VILLAGE[0].toFixed(5)}° E
          <br />
          <a href={directionsUrl(VILLAGE)} target="_blank" rel="noopener noreferrer">
            {isTe ? "దారి చూపించు" : "Get directions"}
          </a>
        </Popup>
      </CircleMarker>

      <Marker position={ll(TEMPLE)} icon={templeIcon}>
        <Popup>
          <strong>{isTe ? templeInfo.nameTe : templeInfo.nameEn}</strong>
          <br />
          <a href={directionsUrl(TEMPLE)} target="_blank" rel="noopener noreferrer">
            {isTe ? "ఆలయానికి దారి" : "Directions to the temple"}
          </a>
        </Popup>
      </Marker>
    </MapContainer>
  );
}

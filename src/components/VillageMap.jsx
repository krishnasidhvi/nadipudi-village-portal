import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { MapPin, Waves, Droplets, Compass, CheckCircle2, Shield, PieChart, Layers, Eye, ExternalLink } from "lucide-react";
import { mapConfig, nadipudiBoundaryPolygon, waterBodies, villageLandmarks, canalLines } from "../data/mapData";
import { landUseData } from "../data/analyticsData";

ChartJS.register(ArcElement, ChartTooltip, Legend);

// Tile Layer URLs
const TILE_LAYERS = {
  satellite: {
    nameTe: "🛰️ శాటిలైట్ వ్యూ (Real Field & HD Aerial View)",
    nameEn: "🛰️ Satellite HD View",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  },
  carto: {
    nameTe: "🗺️ స్పష్టమైన వీధుల పటం (Clean Street & Canal View)",
    nameEn: "🗺️ Clean Street View",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> &copy; <a href='https://carto.com/'>CARTO</a>",
  },
  osm: {
    nameTe: "🌐 ఓపెన్ స్ట్రీట్ మ్యాప్ (Standard Map)",
    nameEn: "🌐 Standard Map",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }
};

// Rich Badge Icons for Leaflet Markers
const createBadgeIcon = (color, textSymbol) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="38" height="38">
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.4"/>
    </filter>
    <path filter="url(#shadow)" fill="${color}" stroke="#ffffff" stroke-width="2" d="M18 3C11.37 3 6 8.37 6 15c0 8.25 12 20 12 20s12-11.75 12-20c0-6.63-5.37-12-12-12z"/>
    <circle cx="18" cy="15" r="5.5" fill="#ffffff"/>
  </svg>`;
  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -34],
  });
};

const lakeIcon = createBadgeIcon("#0284c7");
const canalIcon = createBadgeIcon("#0369a1");
const landmarkIcon = createBadgeIcon("#0e5e38");
const pondIcon = createBadgeIcon("#0891b2");

export default function VillageMap({ lang, t }) {
  const isTe = lang === "te";
  const [filter, setFilter] = useState("all");
  const [mapType, setMapType] = useState("satellite"); // Default to Satellite HD View for maximum clarity!
  const [showGoogleEmbed, setShowGoogleEmbed] = useState(false);

  const filteredWaterBodies = waterBodies.filter((wb) => {
    if (filter === "all") return true;
    if (filter === "canals") return wb.iconType === "canal";
    if (filter === "lakes") return wb.iconType === "lake" || wb.iconType === "pond";
    return true;
  });

  const doughnutChartData = {
    labels: isTe ? landUseData.labelsTe : landUseData.labelsEn,
    datasets: [
      {
        data: landUseData.acres,
        backgroundColor: landUseData.colors,
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  return (
    <div className="village-map-container">
      {/* Header & Extent Summary */}
      <div className="grid-2" style={{ marginBottom: "20px" }}>
        <div className="card">
          <div className="card-title-group">
            <div className="card-icon-box" style={{ background: "rgba(22, 163, 74, 0.1)", color: "var(--primary-emerald)" }}>
              <Compass size={22} />
            </div>
            <div>
              <h2>
                {isTe
                  ? "నడిపూడి గ్రామ HD శాటిలైట్ పటం & జలాశయాలు (Penugonda Mandal Map)"
                  : "Nadipudi HD Satellite Geographic Map & Hydrography"}
              </h2>
              <p style={{ fontSize: "0.88rem", opacity: 0.8 }}>
                {isTe
                  ? "పశ్చిమ గోదావరి జిల్లా, పెనుగొండ మండలం నడిపూడి గ్రామ పంట పొలాలు, చెరువులు & కాలువల నిఖార్సైన వీక్షణ"
                  : "High-definition satellite aerial map showing paddy fields, Pedda Cheruvu, and canals"}
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "12px" }}>
            <div style={{ background: "rgba(14, 94, 56, 0.06)", padding: "10px", borderRadius: "10px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block" }}>
                {isTe ? "మొత్తం విస్తీర్ణం (ఎకరాలు)" : "Total Land Area"}
              </span>
              <strong style={{ color: "var(--primary-emerald)", fontSize: "1.15rem" }}>
                {mapConfig.totalAreaAcres}
              </strong>
            </div>
            <div style={{ background: "rgba(2, 132, 199, 0.06)", padding: "10px", borderRadius: "10px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block" }}>
                {isTe ? "చదరపు కిలోమీటర్లు" : "Sq. Kilometers"}
              </span>
              <strong style={{ color: "var(--sky-blue)", fontSize: "1.15rem" }}>
                {mapConfig.totalAreaSqKm}
              </strong>
            </div>
          </div>
        </div>

        {/* Land Use Graphic Chart Card */}
        <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ width: "52%" }}>
            <h3 style={{ fontSize: "1.02rem", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <PieChart size={18} style={{ color: "var(--primary-emerald)" }} />
              {isTe ? "భూ వినియోగ వర్గీకరణ" : "Land Use Extent"}
            </h3>
            <ul style={{ fontSize: "0.8rem", listStyle: "none", padding: 0 }}>
              {landUseData.labelsTe.map((label, idx) => (
                <li key={idx} style={{ marginBottom: "3px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: landUseData.colors[idx], display: "inline-block" }}></span>
                  <span>{isTe ? label : landUseData.labelsEn[idx]}: <strong>{landUseData.acres[idx]} ఎకరాలు ({landUseData.percentages[idx]}%)</strong></span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ width: "45%", maxHeight: "150px" }}>
            <Doughnut data={doughnutChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </div>
      </div>

      {/* Main Map Box with Layer Switcher & Mode Toggles */}
      <div
        className="card"
        style={{
          padding: "12px",
          marginBottom: "24px",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          border: "2px solid var(--primary-emerald)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", padding: "4px 8px 12px 8px" }}>
          {/* Map Layer Mode Selection Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Layers size={18} style={{ color: "var(--primary-emerald)" }} />
            <button
              className={`filter-btn ${mapType === "satellite" && !showGoogleEmbed ? "active" : ""}`}
              onClick={() => { setMapType("satellite"); setShowGoogleEmbed(false); }}
            >
              🛰️ {isTe ? "శాటిలైట్ HD" : "Satellite HD"}
            </button>
            <button
              className={`filter-btn ${mapType === "carto" && !showGoogleEmbed ? "active" : ""}`}
              onClick={() => { setMapType("carto"); setShowGoogleEmbed(false); }}
            >
              🗺️ {isTe ? "వీధులు & కాలువలు" : "Street Map"}
            </button>
            <button
              className={`filter-btn ${showGoogleEmbed ? "active" : ""}`}
              onClick={() => setShowGoogleEmbed(!showGoogleEmbed)}
            >
              🌐 {isTe ? "గూగుల్ మ్యాప్స్ HD" : "Google Maps HD"}
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="filter-bar" style={{ margin: 0 }}>
            <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
              {isTe ? "అన్నీ" : "All"}
            </button>
            <button className={`filter-btn ${filter === "canals" ? "active" : ""}`} onClick={() => setFilter("canals")}>
              🌊 {isTe ? "కాలువలు" : "Canals"}
            </button>
            <button className={`filter-btn ${filter === "lakes" ? "active" : ""}`} onClick={() => setFilter("lakes")}>
              💧 {isTe ? "చెరువులు" : "Lakes"}
            </button>
          </div>
        </div>

        {/* Dynamic Map Display (Leaflet Satellite/Street or Google Maps Embed) */}
        {showGoogleEmbed ? (
          <div style={{ height: "500px", width: "100%", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--card-border)" }}>
            <iframe
              title="Google Maps Nadipudi HD View"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${mapConfig.center[0]},${mapConfig.center[1]}&t=k&z=16&ie=UTF8&iwloc=&output=embed`}
            ></iframe>
          </div>
        ) : (
          <div style={{ height: "500px", width: "100%", borderRadius: "12px", overflow: "hidden" }}>
            <MapContainer
              center={mapConfig.center}
              zoom={mapConfig.zoom}
              maxBounds={mapConfig.bounds}
              maxBoundsViscosity={1.0}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution={TILE_LAYERS[mapType].attribution}
                url={TILE_LAYERS[mapType].url}
              />

              {/* Nadipudi Official Village Boundary Polygon */}
              <Polygon
                positions={nadipudiBoundaryPolygon}
                pathOptions={{
                  color: "#22c55e",
                  weight: 3.5,
                  fillColor: "#22c55e",
                  fillOpacity: 0.18,
                  dashArray: "6, 6",
                }}
              >
                <Tooltip permanent sticky>
                  {isTe ? "నడిపూడి గ్రామ సరిహద్దు (Nadipudi Village Boundary)" : "Nadipudi Village Boundary"}
                </Tooltip>
              </Polygon>

              {/* Render Canals as Blue Polylines */}
              {canalLines.map((line) => (
                <Polyline key={line.id} positions={line.positions} pathOptions={{ color: line.color, weight: 5, opacity: 0.9 }}>
                  <Tooltip sticky>{line.name}</Tooltip>
                </Polyline>
              ))}

              {/* Render Water Bodies Markers with Permanent Labels */}
              {filteredWaterBodies.map((wb) => {
                let iconToUse = lakeIcon;
                if (wb.iconType === "canal") iconToUse = canalIcon;
                if (wb.iconType === "pond") iconToUse = pondIcon;

                return (
                  <Marker key={wb.id} position={wb.coords} icon={iconToUse}>
                    <Tooltip permanent direction="top" offset={[0, -32]} className="custom-map-label">
                      <span>{isTe ? wb.nameTe.split("(")[0] : wb.nameEn.split("(")[0]}</span>
                    </Tooltip>
                    <Popup>
                      <div style={{ padding: "4px" }}>
                        <strong style={{ color: "var(--primary-emerald)", fontSize: "1rem" }}>
                          {isTe ? wb.nameTe : wb.nameEn}
                        </strong>
                        <div style={{ fontSize: "0.8rem", color: "var(--sky-blue)", fontWeight: 600, margin: "2px 0" }}>
                          {isTe ? wb.typeTe : wb.typeEn} ({isTe ? wb.sizeTe : wb.sizeEn})
                        </div>
                        <p style={{ fontSize: "0.85rem", margin: "4px 0 0", color: "#334155" }}>
                          {isTe ? wb.descTe : wb.descEn}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* Render Village Secretariat Landmarks */}
              {villageLandmarks.map((lm) => (
                <Marker key={lm.id} position={lm.coords} icon={landmarkIcon}>
                  <Tooltip permanent direction="top" offset={[0, -32]}>
                    <strong>🏛️ {isTe ? lm.nameTe.split("(")[0] : lm.nameEn.split("(")[0]}</strong>
                  </Tooltip>
                  <Popup>
                    <div>
                      <strong style={{ color: "var(--primary-emerald)" }}>
                        🏛️ {isTe ? lm.nameTe : lm.nameEn}
                      </strong>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "2px 0 0" }}>
                        {isTe ? lm.typeTe : lm.typeEn}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>

      {/* Detailed Hydrography & Water Bodies Catalog */}
      <h3 style={{ marginBottom: "16px", fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "8px" }}>
        🌊 {isTe ? "నడిపూడి గ్రామ జలాశయాలు, కాలువలు & చెరువుల వివరాలు" : "Detailed Hydrography & Water Bodies Directory"}
      </h3>

      <div className="grid-2">
        {waterBodies.map((wb) => (
          <div key={wb.id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <span className="badge-normal" style={{ background: wb.iconType === "canal" ? "rgba(2, 132, 199, 0.12)" : "rgba(22, 163, 74, 0.12)", color: wb.iconType === "canal" ? "var(--sky-blue)" : "var(--primary-emerald)" }}>
                  {isTe ? wb.typeTe : wb.typeEn}
                </span>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--primary-emerald)" }}>
                  {isTe ? wb.sizeTe : wb.sizeEn}
                </span>
              </div>

              <h4 style={{ fontSize: "1.05rem", marginBottom: "6px", color: "var(--text-main)" }}>
                {isTe ? wb.nameTe : wb.nameEn}
              </h4>

              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "12px", lineHeight: "1.5" }}>
                {isTe ? wb.descTe : wb.descEn}
              </p>
            </div>

            <div style={{ fontSize: "0.82rem", background: "rgba(14, 94, 56, 0.04)", padding: "8px 12px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle2 size={14} style={{ color: "var(--primary-green)" }} />
              <span>
                {isTe
                  ? `స్థానం: పెనుగొండ మండలం, నడిపూడి గ్రామ ఆయకట్టు (గ్రిడ్: ${wb.coords[0]}, ${wb.coords[1]})`
                  : `Location: Penugonda Mandal Ayacut (Coords: ${wb.coords[0]}, ${wb.coords[1]})`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

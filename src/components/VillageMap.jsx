import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Waves, Droplets, Landmark, Compass, Info, CheckCircle2 } from "lucide-react";
import { mapConfig, waterBodies, villageLandmarks, canalLines } from "../data/mapData";

// Custom Leaflet Icons using standard SVG data URLs
const createCustomIcon = (color, symbol) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
    <path fill="${color}" stroke="#ffffff" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="3.5" fill="#ffffff"/>
  </svg>`;
  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30],
  });
};

const lakeIcon = createCustomIcon("#0284c7", "💧");
const canalIcon = createCustomIcon("#0369a1", "🌊");
const landmarkIcon = createCustomIcon("#0e5e38", "🏛️");
const pondIcon = createCustomIcon("#0891b2", "🐟");

export default function VillageMap({ lang, t }) {
  const isTe = lang === "te";
  const [filter, setFilter] = useState("all");

  const filteredWaterBodies = waterBodies.filter((wb) => {
    if (filter === "all") return true;
    if (filter === "canals") return wb.iconType === "canal";
    if (filter === "lakes") return wb.iconType === "lake" || wb.iconType === "pond";
    return true;
  });

  return (
    <div className="village-map-container">
      {/* Top Header Card */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <div className="card-title-group">
          <div className="card-icon-box" style={{ background: "rgba(2, 132, 199, 0.1)", color: "var(--sky-blue)" }}>
            <Compass size={22} />
          </div>
          <div>
            <h2>
              {isTe
                ? "నడిపూడి భౌగోళిక పటం & జలాశయాల ప్లాన్ (Penugonda Mandal Map)"
                : "Geographic Map & Hydrography of Nadipudi (Penugonda Mandal)"}
            </h2>
            <p style={{ fontSize: "0.88rem", opacity: 0.8 }}>
              {isTe
                ? "పశ్చిమ గోదావరి జిల్లా, పెనుగొండ మండలం నడిపూడి గ్రామం చెరువులు, కాలువలు & పంట పొలాల మ్యాప్"
                : "Interactive spatial map displaying Nadipudi Pedda Cheruvu, Godavari West Delta Canals, and water bodies"}
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="filter-bar" style={{ marginTop: "12px", marginBottom: "0" }}>
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            {isTe ? "అన్నీ (All Features)" : "All Features"}
          </button>
          <button
            className={`filter-btn ${filter === "canals" ? "active" : ""}`}
            onClick={() => setFilter("canals")}
          >
            🌊 {isTe ? "గోదావరి కాలువలు (Canals)" : "Irrigation Canals"}
          </button>
          <button
            className={`filter-btn ${filter === "lakes" ? "active" : ""}`}
            onClick={() => setFilter("lakes")}
          >
            💧 {isTe ? "చెరువులు & పెంపకం కుంటలు (Lakes & Ponds)" : "Lakes & Ponds"}
          </button>
        </div>
      </div>

      {/* Main Interactive Leaflet Map Box */}
      <div
        className="card"
        style={{
          padding: "12px",
          marginBottom: "24px",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          border: "2px solid var(--card-border)",
        }}
      >
        <div style={{ height: "460px", width: "100%", borderRadius: "12px", overflow: "hidden" }}>
          <MapContainer
            center={mapConfig.center}
            zoom={mapConfig.zoom}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Render Canals as Blue Polylines */}
            {canalLines.map((line) => (
              <Polyline
                key={line.id}
                positions={line.positions}
                pathOptions={{ color: line.color, weight: 5, opacity: 0.85 }}
              >
                <Tooltip sticky>{line.name}</Tooltip>
              </Polyline>
            ))}

            {/* Render Water Bodies Markers */}
            {filteredWaterBodies.map((wb) => {
              let iconToUse = lakeIcon;
              if (wb.iconType === "canal") iconToUse = canalIcon;
              if (wb.iconType === "pond") iconToUse = pondIcon;

              return (
                <Marker key={wb.id} position={wb.coords} icon={iconToUse}>
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
      </div>

      {/* Detailed Hydrography & Water Bodies Cards */}
      <h3 style={{ marginBottom: "16px", fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "8px" }}>
        🌊 {isTe ? "నడిపూడి గ్రామ జలాశయాలు, కాలువలు & చెరువుల సమగ్ర వివరాలు" : "Detailed Hydrography & Water Bodies Catalog"}
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

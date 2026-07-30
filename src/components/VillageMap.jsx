import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { MapPin, Waves, Droplets, Compass, CheckCircle2, Shield, PieChart } from "lucide-react";
import { mapConfig, nadipudiBoundaryPolygon, waterBodies, villageLandmarks, canalLines } from "../data/mapData";
import { landUseData } from "../data/analyticsData";

ChartJS.register(ArcElement, ChartTooltip, Legend);

// Custom Leaflet Icons using standard SVG data URLs
const createCustomIcon = (color) => {
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

const lakeIcon = createCustomIcon("#0284c7");
const canalIcon = createCustomIcon("#0369a1");
const landmarkIcon = createCustomIcon("#0e5e38");
const pondIcon = createCustomIcon("#0891b2");

export default function VillageMap({ lang, t }) {
  const isTe = lang === "te";
  const [filter, setFilter] = useState("all");

  const filteredWaterBodies = waterBodies.filter((wb) => {
    if (filter === "all") return true;
    if (filter === "canals") return wb.iconType === "canal";
    if (filter === "lakes") return wb.iconType === "lake" || wb.iconType === "pond";
    return true;
  });

  // Chart Data for Land Use Extent Doughnut Chart
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
      {/* Top Extent & Geographic Summary Banner */}
      <div className="grid-2" style={{ marginBottom: "20px" }}>
        <div className="card">
          <div className="card-title-group">
            <div className="card-icon-box" style={{ background: "rgba(22, 163, 74, 0.1)", color: "var(--primary-emerald)" }}>
              <Shield size={22} />
            </div>
            <div>
              <h2>
                {isTe
                  ? "నడిపూడి గ్రామ పరిధి & భౌగోళిక విస్తీర్ణం (Nadipudi Boundary & Extent)"
                  : "Nadipudi Village Boundary & Geographic Area of Extent"}
              </h2>
              <p style={{ fontSize: "0.88rem", opacity: 0.8 }}>
                {isTe
                  ? "పెనుగొండ మండలం, పశ్చిమ గోదావరి జిల్లా - గ్రామ సర్వే పరిమితి"
                  : "Official Gram Panchayat Revenue Survey Extent & Boundaries"}
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "12px" }}>
            <div style={{ background: "rgba(14, 94, 56, 0.06)", padding: "12px", borderRadius: "10px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block" }}>
                {isTe ? "మొత్తం విస్తీర్ణం (ఎకరాలు)" : "Total Land Area"}
              </span>
              <strong style={{ color: "var(--primary-emerald)", fontSize: "1.2rem" }}>
                {mapConfig.totalAreaAcres}
              </strong>
            </div>
            <div style={{ background: "rgba(2, 132, 199, 0.06)", padding: "12px", borderRadius: "10px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block" }}>
                {isTe ? "చదరపు కిలోమీటర్లు" : "Sq. Kilometers"}
              </span>
              <strong style={{ color: "var(--sky-blue)", fontSize: "1.2rem" }}>
                {mapConfig.totalAreaSqKm}
              </strong>
            </div>
          </div>
        </div>

        {/* Land Use Graphic Doughnut Chart Card */}
        <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ width: "50%" }}>
            <h3 style={{ fontSize: "1.05rem", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <PieChart size={18} style={{ color: "var(--primary-emerald)" }} />
              {isTe ? "భూ వినియోగ వర్గీకరణ" : "Land Use Extent"}
            </h3>
            <ul style={{ fontSize: "0.82rem", listStyle: "none", padding: 0 }}>
              {landUseData.labelsTe.map((label, idx) => (
                <li key={idx} style={{ marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: landUseData.colors[idx], display: "inline-block" }}></span>
                  <span>{isTe ? label : landUseData.labelsEn[idx]}: <strong>{landUseData.acres[idx]} ఎకరాలు ({landUseData.percentages[idx]}%)</strong></span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ width: "45%", maxHeight: "160px" }}>
            <Doughnut data={doughnutChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </div>
      </div>

      {/* Main Interactive Leaflet Map Bounded Strictly to Nadipudi Extent */}
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 8px 12px 8px" }}>
          <span className="badge-normal" style={{ background: "rgba(22, 163, 74, 0.15)", color: "var(--primary-emerald)" }}>
            🟢 {isTe ? "నడిపూడి గ్రామ సరిహద్దు ప్రదర్శన (Strictly Bounded to Nadipudi)" : "Strictly Bounded to Nadipudi Extent"}
          </span>

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

        <div style={{ height: "480px", width: "100%", borderRadius: "12px", overflow: "hidden" }}>
          <MapContainer
            center={mapConfig.center}
            zoom={mapConfig.zoom}
            maxBounds={mapConfig.bounds}
            maxBoundsViscosity={1.0}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Official Nadipudi Village Boundary Polygon */}
            <Polygon
              positions={nadipudiBoundaryPolygon}
              pathOptions={{
                color: "#16a34a",
                weight: 3.5,
                fillColor: "#16a34a",
                fillOpacity: 0.15,
                dashArray: "6, 6",
              }}
            >
              <Tooltip permanent sticky>
                {isTe ? "నడిపూడి గ్రామ సరిహద్దు (Nadipudi Village Boundary)" : "Nadipudi Village Boundary"}
              </Tooltip>
            </Polygon>

            {/* Render Canals as Blue Polylines */}
            {canalLines.map((line) => (
              <Polyline key={line.id} positions={line.positions} pathOptions={{ color: line.color, weight: 5, opacity: 0.85 }}>
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

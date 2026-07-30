import React, { useState } from "react";
import { MapContainer, TileLayer, Polygon, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Shield, Compass, PieChart, Layers } from "lucide-react";
import { mapConfig, nadipudiBoundaryPolygon } from "../data/mapData";
import { landUseData } from "../data/analyticsData";

ChartJS.register(ArcElement, ChartTooltip, Legend);

const TILE_LAYERS = {
  satellite: {
    nameTe: "🛰️ శాటిలైట్ HD వ్యూ (Real Field & Aerial View)",
    nameEn: "🛰️ Satellite HD View",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye",
  },
  carto: {
    nameTe: "🗺️ క్లీన్ వీధుల పటం (Clean Vector Map)",
    nameEn: "🗺️ Clean Street View",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap &copy; CARTO",
  },
  osm: {
    nameTe: "🌐 ఓపెన్ స్ట్రీట్ మ్యాప్ (Standard)",
    nameEn: "🌐 Standard Map",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; OpenStreetMap contributors',
  }
};

export default function VillageMap({ lang, t }) {
  const isTe = lang === "te";
  const [mapType, setMapType] = useState("satellite"); // Default HD Satellite
  const [showGoogleEmbed, setShowGoogleEmbed] = useState(false);

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
      {/* Top Village Extent & Parameters Summary */}
      <div className="grid-2" style={{ marginBottom: "20px" }}>
        <div className="card">
          <div className="card-title-group">
            <div className="card-icon-box" style={{ background: "rgba(22, 163, 74, 0.1)", color: "var(--primary-emerald)" }}>
              <Shield size={22} />
            </div>
            <div>
              <h2>
                {isTe
                  ? "నడిపూడి గ్రామ పరిధి & భౌగోళిక సరిహద్దులు (Nadipudi Boundary & Extent)"
                  : "Nadipudi Village Boundary & Geographic Extent"}
              </h2>
              <p style={{ fontSize: "0.88rem", opacity: 0.8 }}>
                {isTe
                  ? "పెనుగొండ మండలం, పశ్చిమ గోదావరి జిల్లా - గ్రామ సర్వే పరిమితి పటం"
                  : "Official Gram Panchayat Survey Extent & Geographic Limits"}
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

        {/* Land Use Graphic Doughnut Chart Card */}
        <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ width: "52%" }}>
            <h3 style={{ fontSize: "1.02rem", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <PieChart size={18} style={{ color: "var(--primary-emerald)" }} />
              {isTe ? "భూ వినియోగ వర్గీకరణ" : "Land Use Breakdown"}
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

      {/* Main Dedicated Village Boundary Map Container */}
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
          <span className="badge-normal" style={{ background: "rgba(22, 163, 74, 0.15)", color: "var(--primary-emerald)", fontWeight: 700 }}>
            🟢 {isTe ? "నడిపూడి గ్రామ పరిమితి & సరిహద్దు పటం (Nadipudi Village Boundary)" : "Nadipudi Village Boundary Extent Map"}
          </span>

          {/* Map Layer Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Layers size={16} style={{ color: "var(--primary-emerald)" }} />
            <button
              className={`filter-btn ${mapType === "satellite" && !showGoogleEmbed ? "active" : ""}`}
              onClick={() => { setMapType("satellite"); setShowGoogleEmbed(false); }}
            >
              🛰️ శాటిలైట్ HD
            </button>
            <button
              className={`filter-btn ${mapType === "carto" && !showGoogleEmbed ? "active" : ""}`}
              onClick={() => { setMapType("carto"); setShowGoogleEmbed(false); }}
            >
              🗺️ వీధులు
            </button>
            <button
              className={`filter-btn ${showGoogleEmbed ? "active" : ""}`}
              onClick={() => setShowGoogleEmbed(!showGoogleEmbed)}
            >
              🌐 గూగుల్ మ్యాప్స్ HD
            </button>
          </div>
        </div>

        {/* Dynamic Display */}
        {showGoogleEmbed ? (
          <div style={{ height: "520px", width: "100%", borderRadius: "12px", overflow: "hidden" }}>
            <iframe
              title="Google Maps Nadipudi HD View"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${mapConfig.center[0]},${mapConfig.center[1]}&t=k&z=15&ie=UTF8&iwloc=&output=embed`}
            ></iframe>
          </div>
        ) : (
          <div style={{ height: "520px", width: "100%", borderRadius: "12px", overflow: "hidden" }}>
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

              {/* Nadipudi Village Boundary Polygon */}
              <Polygon
                positions={nadipudiBoundaryPolygon}
                pathOptions={{
                  color: "#22c55e",
                  weight: 4,
                  fillColor: "#22c55e",
                  fillOpacity: 0.22,
                  dashArray: "8, 8",
                }}
              >
                <Tooltip permanent sticky>
                  <strong>{isTe ? "నడిపూడి గ్రామ పరిమితి (Nadipudi Village Extent)" : "Nadipudi Village Boundary Extent"}</strong>
                </Tooltip>
              </Polygon>
            </MapContainer>
          </div>
        )}
      </div>

      {/* Village Boundaries & Parameters Cards */}
      <h3 style={{ marginBottom: "16px", fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "8px" }}>
        🧭 {isTe ? "నడిపూడి గ్రామ నలుదిక్కుల సరిహద్దుల వివరాలు" : "Nadipudi Revenue Boundaries & Parameters"}
      </h3>

      <div className="grid-2">
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span className="badge-normal" style={{ background: "rgba(14, 94, 56, 0.12)", color: "var(--primary-emerald)", fontWeight: 700 }}>
              ఉత్తరం (North)
            </span>
            <strong style={{ fontSize: "0.95rem" }}>{isTe ? mapConfig.northBoundaryTe : mapConfig.northBoundaryEn}</strong>
          </div>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
            {isTe
              ? "నడిపూడి గ్రామానికి ఉత్తరాన సిద్ధాంతం గ్రామ రెవెన్యూ పొలాలు మరియు రక్షిత మంచినీటి చెరువు సరిహద్దు కలిగి ఉంది."
              : "Bordering Sidhantam village agricultural ayacut to the North."}
          </p>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span className="badge-normal" style={{ background: "rgba(217, 119, 6, 0.15)", color: "var(--accent-gold)", fontWeight: 700 }}>
              దక్షిణం (South)
            </span>
            <strong style={{ fontSize: "0.95rem" }}>{isTe ? mapConfig.southBoundaryTe : mapConfig.southBoundaryEn}</strong>
          </div>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
            {isTe
              ? "దక్షిణాన పెనుగొండ మెయిన్ కాలువ మరియు విస్తారమైన వరి సాగు భూములు సరిహద్దుగా ఉన్నాయి."
              : "Bordering Penugonda feeder canal and extensive paddy cultivation fields to the South."}
          </p>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span className="badge-normal" style={{ background: "rgba(2, 132, 199, 0.12)", color: "var(--sky-blue)", fontWeight: 700 }}>
              తూర్పు (East)
            </span>
            <strong style={{ fontSize: "0.95rem" }}>{isTe ? mapConfig.eastBoundaryTe : mapConfig.eastBoundaryEn}</strong>
          </div>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
            {isTe
              ? "తూర్పు సరిహద్దుగా వసిష్ఠ గోదావరి పశ్చిమ డెల్టా ప్రధాన ప్రవాహ కాలువ వెళుతుంది."
              : "Bordering Vasishtha Godavari river delta irrigation branch to the East."}
          </p>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span className="badge-normal" style={{ background: "rgba(100, 116, 139, 0.15)", color: "var(--text-main)", fontWeight: 700 }}>
              పడమర (West)
            </span>
            <strong style={{ fontSize: "0.95rem" }}>{isTe ? mapConfig.westBoundaryTe : mapConfig.westBoundaryEn}</strong>
          </div>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
            {isTe
              ? "పశ్చిమాన ఇల్లపర్రు గ్రామ పంచాయతీ పొలాలు మరియు సర్వే లైన్ సరిహద్దుగా ఉంది."
              : "Bordering Illaparru village survey boundary line to the West."}
          </p>
        </div>
      </div>
    </div>
  );
}

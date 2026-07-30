import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Landmark, MapPin, Search, Clock, Compass, PhoneCall, CheckCircle2, ExternalLink } from "lucide-react";
import { mapConfig, nadipudiBoundaryPolygon } from "../data/mapData";
import { keyLandmarks } from "../data/landmarksData";

// Custom Leaflet Markers by Category
const createMarkerIcon = (color, emoji) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="34" height="34">
    <path fill="${color}" stroke="#ffffff" stroke-width="2" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="4" fill="#ffffff"/>
  </svg>`;
  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -32],
  });
};

const govtIcon = createMarkerIcon("#0e5e38", "🏛️");
const templeIcon = createMarkerIcon("#d97706", "🛕");
const schoolIcon = createMarkerIcon("#0284c7", "🏫");
const healthIcon = createMarkerIcon("#e11d48", "🏥");
const defaultIcon = createMarkerIcon("#16a34a", "📍");

export default function KeyPlacesMap({ lang, t }) {
  const isTe = lang === "te";
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLandmarks = keyLandmarks.filter((item) => {
    const matchesFilter = filter === "all" || item.category === filter;
    const name = isTe ? item.nameTe : item.nameEn;
    const type = isTe ? item.typeTe : item.typeEn;
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getMarkerIcon = (iconType) => {
    if (iconType === "govt") return govtIcon;
    if (iconType === "temple") return templeIcon;
    if (iconType === "school") return schoolIcon;
    if (iconType === "health") return healthIcon;
    return defaultIcon;
  };

  return (
    <div className="key-places-container">
      {/* Top Welcome Header */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <div className="card-title-group">
          <div className="card-icon-box" style={{ background: "rgba(217, 119, 6, 0.1)", color: "var(--accent-gold)" }}>
            <MapPin size={22} />
          </div>
          <div>
            <h2>
              {isTe
                ? "నడిపూడి గ్రామ ముఖ్య ప్రాంతాల సమాచార పటం (Key Places Directory)"
                : "Nadipudi Key Places & Landmark Map for New Members"}
            </h2>
            <p style={{ fontSize: "0.88rem", opacity: 0.8 }}>
              {isTe
                ? "సచివాలయం, ప్రసిద్ధ దేవాలయాలు, పాఠశాలలు, ఆసుపత్రి & స్థానిక ముఖ్య కేంద్రాల సులభమైన గుర్తింపు పటం"
                : "Easy identification guide for Secretariat, Temples, Schools, PHC Clinic, and Post Office"}
            </p>
          </div>
        </div>

        {/* Search Input Box */}
        <div className="search-box-container" style={{ marginTop: "12px", marginBottom: "12px" }}>
          <Search className="search-icon-inside" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder={isTe ? "సచివాలయం, రామాలయం, బడి మొదలైనవి వెతకండి..." : "Search Secretariat, Ramalayam, School, Health Center..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Pills */}
        <div className="filter-bar" style={{ margin: 0 }}>
          <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
            {isTe ? "అన్ని ప్రాంతాలు (All Places)" : "All Places"}
          </button>
          <button className={`filter-btn ${filter === "govt" ? "active" : ""}`} onClick={() => setFilter("govt")}>
            🏛️ {isTe ? "సచివాలయం & ప్రభుత్వ శాఖలు" : "Secretariat & Govt"}
          </button>
          <button className={`filter-btn ${filter === "temple" ? "active" : ""}`} onClick={() => setFilter("temple")}>
            🛕 {isTe ? "దేవాలయాలు" : "Temples & Shrines"}
          </button>
          <button className={`filter-btn ${filter === "school" ? "active" : ""}`} onClick={() => setFilter("school")}>
            🏫 {isTe ? "పాఠశాలలు" : "Schools"}
          </button>
          <button className={`filter-btn ${filter === "health" ? "active" : ""}`} onClick={() => setFilter("health")}>
            🏥 {isTe ? "ఆరోగ్య & ఇతర సేవలు" : "Health & Services"}
          </button>
        </div>
      </div>

      {/* Main Detailed Map Container */}
      <div
        className="card"
        style={{
          padding: "12px",
          marginBottom: "24px",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          border: "2px solid var(--accent-gold)",
        }}
      >
        <div style={{ height: "480px", width: "100%", borderRadius: "12px", overflow: "hidden" }}>
          <MapContainer
            center={mapConfig.center}
            zoom={16}
            maxBounds={mapConfig.bounds}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Boundary Polygon */}
            <Polygon
              positions={nadipudiBoundaryPolygon}
              pathOptions={{ color: "#16a34a", weight: 2.5, fillColor: "#16a34a", fillOpacity: 0.08, dashArray: "5, 5" }}
            />

            {/* Render Filtered Landmarks Markers */}
            {filteredLandmarks.map((place) => (
              <Marker key={place.id} position={place.coords} icon={getMarkerIcon(place.iconType)}>
                <Popup>
                  <div style={{ padding: "4px", minWidth: "180px" }}>
                    <strong style={{ color: "var(--primary-emerald)", fontSize: "1rem", display: "block" }}>
                      {isTe ? place.nameTe : place.nameEn}
                    </strong>
                    <div style={{ fontSize: "0.8rem", color: "var(--accent-gold)", fontWeight: 600, margin: "3px 0" }}>
                      {isTe ? place.typeTe : place.typeEn}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                      ⏰ {isTe ? place.timingsTe : place.timingsEn}
                    </div>
                    <p style={{ fontSize: "0.85rem", margin: "4px 0 0", color: "#334155", lineHeight: "1.4" }}>
                      {isTe ? place.descTe : place.descEn}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Grid Directory of All Key Places */}
      <h3 style={{ marginBottom: "16px", fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "8px" }}>
        📌 {isTe ? "నడిపూడి గ్రామ ముఖ్య ప్రాంతాల సంపూర్ణ డైరెక్టరీ" : "Complete Key Places Directory Cards"}
      </h3>

      <div className="grid-2">
        {filteredLandmarks.map((place) => (
          <div key={place.id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <span
                  className="badge-normal"
                  style={{
                    background:
                      place.category === "govt"
                        ? "rgba(14, 94, 56, 0.12)"
                        : place.category === "temple"
                        ? "rgba(217, 119, 6, 0.15)"
                        : place.category === "school"
                        ? "rgba(2, 132, 199, 0.12)"
                        : "rgba(225, 29, 72, 0.12)",
                    color:
                      place.category === "govt"
                        ? "var(--primary-emerald)"
                        : place.category === "temple"
                        ? "var(--accent-gold)"
                        : place.category === "school"
                        ? "var(--sky-blue)"
                        : "#e11d48",
                  }}
                >
                  {isTe ? place.typeTe : place.typeEn}
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${place.coords[0]},${place.coords[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                  style={{ padding: "3px 8px", fontSize: "0.75rem" }}
                >
                  <span>{isTe ? "మ్యాప్ నావిగేషన్" : "Directions"}</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              <h4 style={{ fontSize: "1.1rem", marginBottom: "6px", color: "var(--primary-emerald)" }}>
                {isTe ? place.nameTe : place.nameEn}
              </h4>

              <div style={{ fontSize: "0.85rem", color: "var(--accent-gold)", fontWeight: 600, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Clock size={14} />
                <span>{isTe ? place.timingsTe : place.timingsEn}</span>
              </div>

              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "14px", lineHeight: "1.5" }}>
                {isTe ? place.descTe : place.descEn}
              </p>
            </div>

            <div style={{ fontSize: "0.82rem", background: "rgba(14, 94, 56, 0.04)", padding: "8px 12px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle2 size={14} style={{ color: "var(--primary-green)" }} />
              <span>
                {isTe
                  ? `స్థానం: నడిపూడి గ్రామం (GPS గ్రిడ్: ${place.coords[0]}, ${place.coords[1]})`
                  : `GPS Pin Location: ${place.coords[0]}, ${place.coords[1]}`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

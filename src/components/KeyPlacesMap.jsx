import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Landmark, MapPin, Search, Clock, Compass, PhoneCall, CheckCircle2, ExternalLink, Layers } from "lucide-react";
import { mapConfig, nadipudiBoundaryPolygon } from "../data/mapData";
import { keyLandmarks } from "../data/landmarksData";

const TILE_LAYERS = {
  satellite: {
    nameTe: "🛰️ శాటిలైట్ HD వ్యూ",
    nameEn: "🛰️ Satellite HD View",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
  },
  carto: {
    nameTe: "🗺️ క్లీన్ వీధుల పటం",
    nameEn: "🗺️ Clean Street View",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap &copy; CARTO",
  },
};

// Custom Leaflet Markers by Category
const createMarkerIcon = (color) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="38" height="38">
    <filter id="shadow2" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#000" flood-opacity="0.5"/>
    </filter>
    <path filter="url(#shadow2)" fill="${color}" stroke="#ffffff" stroke-width="2" d="M18 3C11.37 3 6 8.37 6 15c0 8.25 12 20 12 20s12-11.75 12-20c0-6.63-5.37-12-12-12z"/>
    <circle cx="18" cy="15" r="5" fill="#ffffff"/>
  </svg>`;
  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -34],
  });
};

const govtIcon = createMarkerIcon("#0e5e38");
const templeIcon = createMarkerIcon("#d97706");
const schoolIcon = createMarkerIcon("#0284c7");
const healthIcon = createMarkerIcon("#e11d48");
const defaultIcon = createMarkerIcon("#16a34a");

export default function KeyPlacesMap({ lang, t }) {
  const isTe = lang === "te";
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [mapType, setMapType] = useState("satellite"); // Default Satellite HD view
  const [showGoogleEmbed, setShowGoogleEmbed] = useState(false);

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
                ? "నడిపూడి గ్రామ ముఖ్య ప్రాంతాల HD శాటిలైట్ పటం (Key Places Directory)"
                : "Nadipudi Key Places & Landmark Map for New Members"}
            </h2>
            <p style={{ fontSize: "0.88rem", opacity: 0.8 }}>
              {isTe
                ? "సచివాలయం, ప్రసిద్ధ దేవాలయాలు, పాఠశాలలు, ఆసుపత్రి & స్థానిక ముఖ్య కేంద్రాల సులభమైన గుర్తింపు పటం"
                : "High-definition map for Secretariat, Temples, Schools, PHC Clinic, and Post Office"}
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

        {/* Filter Pills & Map Type Selector */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div className="filter-bar" style={{ margin: 0 }}>
            <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
              {isTe ? "అన్ని ప్రాంతాలు (All)" : "All Places"}
            </button>
            <button className={`filter-btn ${filter === "govt" ? "active" : ""}`} onClick={() => setFilter("govt")}>
              🏛️ {isTe ? "సచివాలయం" : "Secretariat"}
            </button>
            <button className={`filter-btn ${filter === "temple" ? "active" : ""}`} onClick={() => setFilter("temple")}>
              🛕 {isTe ? "దేవాలయాలు" : "Temples"}
            </button>
            <button className={`filter-btn ${filter === "school" ? "active" : ""}`} onClick={() => setFilter("school")}>
              🏫 {isTe ? "పాఠశాలలు" : "Schools"}
            </button>
            <button className={`filter-btn ${filter === "health" ? "active" : ""}`} onClick={() => setFilter("health")}>
              🏥 {isTe ? "ఆరోగ్యం & సేవలు" : "Health"}
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Layers size={16} style={{ color: "var(--accent-gold)" }} />
            <button
              className={`filter-btn ${mapType === "satellite" && !showGoogleEmbed ? "active" : ""}`}
              onClick={() => { setMapType("satellite"); setShowGoogleEmbed(false); }}
            >
              🛰️ శాటిలైట్ HD
            </button>
            <button
              className={`filter-btn ${showGoogleEmbed ? "active" : ""}`}
              onClick={() => setShowGoogleEmbed(!showGoogleEmbed)}
            >
              🌐 గూగుల్ మ్యాప్స్
            </button>
          </div>
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
        {showGoogleEmbed ? (
          <div style={{ height: "500px", width: "100%", borderRadius: "12px", overflow: "hidden" }}>
            <iframe
              title="Google Maps HD Satellite Embed"
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
              zoom={16}
              maxBounds={mapConfig.bounds}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution={TILE_LAYERS[mapType].attribution}
                url={TILE_LAYERS[mapType].url}
              />

              {/* Boundary Polygon */}
              <Polygon
                positions={nadipudiBoundaryPolygon}
                pathOptions={{ color: "#22c55e", weight: 3, fillColor: "#22c55e", fillOpacity: 0.12, dashArray: "5, 5" }}
              />

              {/* Render Filtered Landmarks Markers with Permanent Text Labels */}
              {filteredLandmarks.map((place) => (
                <Marker key={place.id} position={place.coords} icon={getMarkerIcon(place.iconType)}>
                  <Tooltip permanent direction="top" offset={[0, -32]}>
                    <strong style={{ fontSize: "0.82rem" }}>
                      {place.iconType === "govt" ? "🏛️ " : place.iconType === "temple" ? "🛕 " : place.iconType === "school" ? "🏫 " : "📍 "}
                      {isTe ? place.nameTe.split("(")[0] : place.nameEn.split("(")[0]}
                    </strong>
                  </Tooltip>
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
        )}
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

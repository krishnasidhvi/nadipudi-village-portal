import React, { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Compass, Search, ExternalLink, Info, Layers, Eye, Sparkles, Home, Trees, Waves } from "lucide-react";
import { mapConfig, dioramaLandmarks, surveyLandRecords, nadipudiBoundaryPolygon } from "../data/mapData";
import map3dImage from "../assets/nadipudi_3d_map.png";

export default function VillageMap({ lang, t }) {
  const isTe = lang === "te";
  const [viewMode, setViewMode] = useState("diorama"); // 'diorama' or 'gis'
  const [selectedLandmark, setSelectedLandmark] = useState(dioramaLandmarks[1]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecords = surveyLandRecords.filter(
    (rec) =>
      rec.surveyNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.ownerTe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.ownerEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.classificationTe.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Leaflet custom marker icon
  const defaultCustomIcon = useMemo(() => {
    return L.divIcon({
      className: "custom-leaflet-pin",
      html: `<div style="background:#22c55e; width:24px; height:24px; border-radius:50%; border:3px solid #ffffff; box-shadow:0 0 12px rgba(0,0,0,0.7);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  }, []);

  return (
    <div className="village-map-container">
      {/* Top Header Controls */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div className="diorama-badge" style={{ marginBottom: "8px" }}>
              ✨ {isTe ? "నడిపూడి 3D ఐసోమెట్రిక్ కాగితపు డయోరమా పటం" : "3D Isometric Paper Diorama Map (Palakkad Model)"}
            </div>
            <h2>{isTe ? "నడిపూడి గ్రామ సరిహద్దు మ్యాప్ & 3D డయోరమా" : "Nadipudi Village Boundary & 3D Diorama"}</h2>
            <p style={{ fontSize: "0.88rem", color: "#cbd5e1", marginTop: "4px" }}>
              <strong>{isTe ? "భూభాగాలు:" : "Geography:"}</strong> Nadipudi 3D Extruded Title, Godavari River, Pushkar Ghat, Yetigattu & Subramanyeswara Temple
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              className={`btn-primary ${viewMode === "diorama" ? "" : "btn-outline"}`}
              onClick={() => setViewMode("diorama")}
              style={{ background: viewMode === "diorama" ? "#22c55e" : "rgba(0,0,0,0.4)" }}
            >
              <Layers size={16} />
              <span>{isTe ? "3D డయోరమా మ్యాప్" : "3D Diorama Map"}</span>
            </button>

            <button
              className={`btn-primary ${viewMode === "gis" ? "" : "btn-outline"}`}
              onClick={() => setViewMode("gis")}
              style={{ background: viewMode === "gis" ? "#22c55e" : "rgba(0,0,0,0.4)" }}
            >
              <Compass size={16} />
              <span>{isTe ? "గూగుల్ GIS ఉపగ్రహ పటం" : "Google Satellite GIS"}</span>
            </button>

            <a
              href={mapConfig.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <ExternalLink size={16} />
              <span>{isTe ? "గూగుల్ మ్యాప్స్‌లో చూడండి" : "Open Google Maps"}</span>
            </a>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: 3D Isometric Paper Diorama Map (Palakkad Exact Model) */}
      {viewMode === "diorama" && (
        <div>
          <div className="card diorama-canvas-card" style={{ marginBottom: "24px", position: "relative", overflow: "hidden", background: "rgba(0, 0, 0, 0.45)", border: "1.5px solid rgba(74, 222, 128, 0.4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid rgba(255, 255, 255, 0.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", color: "#4ade80" }}>
                <Sparkles size={20} />
                <span>{isTe ? "నడిపూడి 3D ఐసోమెట్రిక్ కాగితపు డయోరమా పటం (NADIPUDI 3D Diorama Model)" : "Nadipudi 3D Isometric Paper Diorama Map Model"}</span>
              </div>
              <span style={{ fontSize: "0.82rem", color: "#cbd5e1" }}>
                {isTe ? "కాగితపు మ్యాప్ ఓపెనింగ్ నుండి 3D మోడళ్ళు మరియు కాల్-అవుట్ పిన్లు" : "3D miniature model popping from torn paper map with callout label pins"}
              </span>
            </div>

            {/* 3D Diorama Display Canvas */}
            <div style={{ position: "relative", width: "100%", height: "540px", borderRadius: "16px", overflow: "hidden", border: "2px solid rgba(74, 222, 128, 0.4)", background: "#ffffff" }}>
              <img
                src={map3dImage}
                alt="Nadipudi 3D Isometric Paper Diorama Map"
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
              />

              {/* Interactive Diorama Hotspot Pins matching Callout Pins */}
              {dioramaLandmarks.map((pin) => (
                <div
                  key={pin.id}
                  className={`diorama-pin-hotspot ${selectedLandmark.id === pin.id ? "active-pin" : ""}`}
                  style={{ top: pin.topOffset, left: pin.leftOffset }}
                  onClick={() => setSelectedLandmark(pin)}
                >
                  <span className="pin-icon">{pin.icon}</span>
                  <span className="pin-tooltip">{isTe ? pin.nameTe : pin.nameEn}</span>
                </div>
              ))}
            </div>

            {/* Selected Landmark Details Display */}
            {selectedLandmark && (
              <div style={{ marginTop: "20px", padding: "20px", background: "rgba(0, 0, 0, 0.8)", borderRadius: "14px", border: "1.5px solid #22c55e" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <div style={{ fontSize: "0.78rem", fontWeight: "700", color: "#4ade80", textTransform: "uppercase" }}>
                      {selectedLandmark.icon} {isTe ? selectedLandmark.categoryTe : selectedLandmark.categoryEn} • {selectedLandmark.surveyNo}
                    </div>
                    <h3 style={{ fontSize: "1.35rem", color: "#ffffff", marginTop: "4px" }}>
                      {isTe ? selectedLandmark.nameTe : selectedLandmark.nameEn}
                    </h3>
                    <p style={{ fontSize: "0.96rem", color: "#e2e8f0", marginTop: "6px", lineHeight: "1.6" }}>
                      {isTe ? selectedLandmark.detailsTe : selectedLandmark.detailsEn}
                    </p>
                  </div>

                  <div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${selectedLandmark.coords[0]},${selectedLandmark.coords[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{ fontSize: "0.85rem", padding: "8px 16px" }}
                    >
                      <MapPin size={14} />
                      <span>{isTe ? "గూగుల్ మ్యాప్స్‌లో స్థానం" : "Navigate on Maps"}</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: Leaflet GIS Satellite & Boundary Map */}
      {viewMode === "gis" && (
        <div className="card" style={{ marginBottom: "24px" }}>
          <div style={{ marginBottom: "14px" }}>
            <h3 style={{ fontSize: "1.1rem", color: "#ffffff" }}>{isTe ? "లైవ్ గూగుల్ GIS ఉపగ్రహ మ్యాప్ & సరిహద్దు పటం" : "Live GIS Satellite & Revenue Boundary Map"}</h3>
            <p style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>
              {isTe ? "గ్రీన్ లైన్ నడిపూడి అధికారిక రెవెన్యూ సరిహద్దు పాయింట్లను సూచిస్తుంది." : "Green polygon represents official Nadipudi revenue village boundary."}
            </p>
          </div>

          <div style={{ height: "480px", width: "100%", borderRadius: "14px", overflow: "hidden", border: "2px solid rgba(255,255,255,0.2)" }}>
            <MapContainer
              center={mapConfig.center}
              zoom={mapConfig.zoom}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              {/* Esri World Imagery */}
              <TileLayer
                attribution="&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />

              {/* Nadipudi Official Revenue Boundary Line */}
              <Polygon
                positions={nadipudiBoundaryPolygon}
                pathOptions={{ color: "#22c55e", weight: 3, fillColor: "#22c55e", fillOpacity: 0.15 }}
              />

              {/* Landmark Map Pins */}
              {dioramaLandmarks.map((point) => (
                <Marker key={point.id} position={point.coords} icon={defaultCustomIcon}>
                  <Popup>
                    <div style={{ color: "#0f172a", fontSize: "0.85rem" }}>
                      <strong>{isTe ? point.nameTe : point.nameEn}</strong>
                      <br />
                      {point.surveyNo} • {isTe ? point.categoryTe : point.categoryEn}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      )}

      {/* Revenue Land Records & Boundaries Table */}
      <div className="card">
        <div className="card-title-group">
          <div className="card-icon-box">
            <Info size={22} />
          </div>
          <h3>{isTe ? "నడిపూడి భూమి వర్గీకరణ & సర్వే రికార్డులు" : "Revenue Land Classification & Survey Records"}</h3>
        </div>

        {/* Search Input */}
        <div className="search-box-container">
          <Search className="search-icon-inside" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder={isTe ? "సర్వే నంబరు లేదా యజమాని పేరు నమోదు చేయండి..." : "Search survey number or landowner..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>{isTe ? "సర్వే నంబరు" : "Survey No."}</th>
                <th>{isTe ? "భూమి వర్గీకరణ" : "Land Classification"}</th>
                <th>{isTe ? "విస్తీర్ణం (ఎకరాలు)" : "Extent (Acres)"}</th>
                <th>{isTe ? "యజమాని / సంస్థ" : "Owner / Authority"}</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((row, idx) => (
                <tr key={idx}>
                  <td><span className="price-badge">{row.surveyNo}</span></td>
                  <td>{isTe ? row.classificationTe : row.classificationEn}</td>
                  <td>{row.acres} Acres</td>
                  <td style={{ fontWeight: "600" }}>{isTe ? row.ownerTe : row.ownerEn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

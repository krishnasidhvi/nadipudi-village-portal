import React from "react";
import { X, Calendar, User, Tag } from "lucide-react";

export default function TempleMediaLightbox({ item, onClose, lang }) {
  if (!item) return null;

  const isTe = lang === "te";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.94)",
        backdropFilter: "blur(12px)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px"
      }}
      onClick={onClose}
    >
      <div
        style={{
          maxWidth: "860px",
          width: "100%",
          maxHeight: "94vh",
          display: "flex",
          flexDirection: "column",
          background: "#08130e",
          border: "2px solid rgba(234, 88, 12, 0.6)",
          borderRadius: "18px",
          overflow: "hidden",
          boxShadow: "0 25px 70px rgba(0, 0, 0, 0.95)",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 18px",
            background: "rgba(0, 0, 0, 0.6)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                background: "rgba(234, 88, 12, 0.25)",
                color: "#f97316",
                padding: "3px 10px",
                borderRadius: "12px",
                fontSize: "0.75rem",
                fontWeight: "700"
              }}
            >
              {item.type === "video" ? (isTe ? "🎥 వీడియో దర్శనం" : "🎥 Video Darshan") : (isTe ? "📸 ఫోటో దర్శనం" : "📸 Photo Darshan")}
            </span>
            <span style={{ color: "#ffffff", fontWeight: "600", fontSize: "0.95rem" }}>
              {isTe ? item.titleTe : item.titleEn}
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "none",
              borderRadius: "50%",
              width: "34px",
              height: "34px",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Media Frame */}
        <div
          style={{
            background: "#000000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "360px",
            maxHeight: "560px",
            overflow: "hidden"
          }}
        >
          {item.type === "video" ? (
            item.mediaUrl?.includes("youtube.com") || item.mediaUrl?.includes("youtu.be") || item.mediaUrl?.includes("drive.google.com") ? (
              <iframe
                src={item.mediaUrl}
                title={item.titleEn || item.titleTe}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                style={{ width: "100%", height: "460px", border: "none", display: "block" }}
              />
            ) : (
              <video
                src={item.mediaUrl}
                controls
                autoPlay
                playsInline
                style={{ width: "100%", maxHeight: "500px", objectFit: "contain" }}
              />
            )
          ) : (
            <img
              src={item.mediaUrl || item.img}
              alt={item.titleEn || item.titleTe}
              style={{ maxWidth: "100%", maxHeight: "520px", objectFit: "contain", display: "block" }}
            />
          )}
        </div>

        {/* Details Footer */}
        <div style={{ padding: "16px 20px", background: "rgba(0, 0, 0, 0.75)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "0.82rem", color: "#cbd5e1", marginBottom: "8px" }}>
            {item.contributor && (
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <User size={14} color="#f97316" />
                <span>{item.contributor}</span>
              </div>
            )}
            {item.date && (
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Calendar size={14} color="#4ade80" />
                <span>{item.date}</span>
              </div>
            )}
            {item.categoryTe && (
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Tag size={14} color="#fde047" />
                <span>{isTe ? item.categoryTe : item.categoryEn}</span>
              </div>
            )}
          </div>

          {(item.descTe || item.descEn) && (
            <p style={{ fontSize: "0.9rem", color: "#e2e8f0", lineHeight: "1.6" }}>
              {isTe ? item.descTe || item.descEn : item.descEn || item.descTe}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

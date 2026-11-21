import React from "react";
import { ExternalLink, MapPin } from "lucide-react";
import { voterPortals } from "../data/electionData";

export default function ElectionHub({ lang, t }) {
  const isTe = lang === "te";

  return (
    <div className="election-hub-container">
      {/* Official CEO AP Voter Search Cards */}
      <h3 style={{ marginBottom: "16px", fontSize: "1.25rem" }}>
        🗳️ {t.voterTitle}
      </h3>
      <p style={{ marginBottom: "20px", color: "var(--text-muted)", fontSize: "0.92rem" }}>
        {t.voterDesc}
      </p>

      <div className="grid-3" style={{ marginBottom: "28px" }}>
        {voterPortals.map((portal) => (
          <div key={portal.id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ marginBottom: "8px" }}>
                <span className="badge-medium">{portal.badge}</span>
              </div>
              <h4 style={{ fontSize: "1.05rem", marginBottom: "8px" }}>
                {isTe ? portal.titleTe : portal.titleEn}
              </h4>
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "16px" }}>
                {isTe ? portal.descTe : portal.descEn}
              </p>
            </div>
            <a
              href={portal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ alignSelf: "flex-start" }}
            >
              <span>{t.officialLink}</span>
              <ExternalLink size={16} />
            </a>
          </div>
        ))}
      </div>

      {/* Polling station guidance (no booth list until confirmed from the official roll) */}
      <div className="card">
        <div className="card-title-group">
          <div className="card-icon-box" style={{ background: "rgba(217, 119, 6, 0.1)", color: "var(--accent-gold)" }}>
            <MapPin size={22} />
          </div>
          <div>
            <h2>{isTe ? "మీ పోలింగ్ కేంద్రం తెలుసుకోవడం" : "Finding Your Polling Station"}</h2>
          </div>
        </div>
        <p style={{ fontSize: "0.92rem", lineHeight: 1.6 }}>
          {isTe
            ? "మీ ఓటరు కార్డు (EPIC) నంబర్‌తో ఎన్నికల సంఘం అధికారిక శోధన పేజీలో వెతికితే మీ పోలింగ్ కేంద్రం, భాగం సంఖ్య మరియు వరుస సంఖ్య కనిపిస్తాయి. నడిపూడి పోలింగ్ కేంద్రాల జాబితాను అధికారిక ఓటర్ల జాబితా నుండి నిర్ధారించిన తరువాత ఇక్కడ చేర్చుతాము."
            : "Search with your voter ID (EPIC) number on the Election Commission's official search page to see your polling station, part number and serial number. The list of Nadipudi polling stations will be added here once confirmed from the official electoral roll."}
        </p>
        <p style={{ fontSize: "0.92rem", lineHeight: 1.6, marginTop: "8px" }}>
          {isTe
            ? "నియోజకవర్గాలు: ఆచంట (శాసనసభ), నరసాపురం (లోక్‌సభ)."
            : "Constituencies: Achanta (Assembly), Narasapuram (Lok Sabha)."}
        </p>
      </div>
    </div>
  );
}

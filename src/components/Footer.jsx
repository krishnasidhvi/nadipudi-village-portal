import React from "react";
import { Landmark, Heart } from "lucide-react";

const dataCredits = [
  { label: "Open-Meteo (weather, CC BY 4.0)", url: "https://open-meteo.com/" },
  { label: "Agmarknet / data.gov.in (mandi prices)", url: "https://www.data.gov.in/" },
  { label: "Central Water Commission (river level)", url: "https://ffs.india-water.gov.in/" },
  { label: "NDMA SACHET (alerts)", url: "https://sachet.ndma.gov.in/" },
  { label: "Census of India 2011", url: "https://censusindia.gov.in/" },
];

export default function Footer({ lang, t }) {
  const isTe = lang === "te";
  return (
    <footer className="main-footer">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "8px", fontWeight: 700, color: "var(--primary-emerald)" }}>
        <Landmark size={20} />
        <span>నడిపూడి డిజిటల్ గ్రామ సమాచార వేదిక (Nadipudi Digital Village Portal)</span>
      </div>

      <p style={{ maxWidth: "720px", margin: "0 auto 12px", fontSize: "0.85rem" }}>
        <strong>{t.disclaimerTitle}:</strong> {t.disclaimerText}
      </p>

      <p style={{ fontSize: "0.8rem", marginBottom: "6px", opacity: 0.85 }}>{isTe ? "సమాచార మూలాలు" : "Data sources"}</p>
      <div className="footer-links" style={{ marginBottom: "14px" }}>
        {dataCredits.map((credit, i) => (
          <React.Fragment key={credit.url}>
            {i > 0 && <span>•</span>}
            <a href={credit.url} target="_blank" rel="noopener noreferrer">
              {credit.label}
            </a>
          </React.Fragment>
        ))}
      </div>

      <div className="footer-links">
        <a href="https://ap.gov.in/" target="_blank" rel="noopener noreferrer">
          AP Portal (ap.gov.in)
        </a>
        <span>•</span>
        <a href="https://westgodavari.ap.gov.in/" target="_blank" rel="noopener noreferrer">
          West Godavari District Portal
        </a>
        <span>•</span>
        <a href="https://pmkisan.gov.in/" target="_blank" rel="noopener noreferrer">
          PM-Kisan Portal
        </a>
        <span>•</span>
        <a href="https://voters.eci.gov.in/" target="_blank" rel="noopener noreferrer">
          ECI Voters Portal
        </a>
      </div>

      <p style={{ marginTop: "16px", fontSize: "0.8rem", opacity: 0.7 }}>
        Built with <Heart size={14} style={{ display: "inline", color: "#e11d48", verticalAlign: "middle" }} /> for the people of Nadipudi Village, Penugonda Mandal, West Godavari District, AP.
      </p>
    </footer>
  );
}

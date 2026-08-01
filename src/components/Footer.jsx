import React from "react";
import { Landmark, Heart } from "lucide-react";

export default function Footer({ t }) {
  return (
    <footer className="main-footer">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "8px", fontWeight: 700, color: "var(--primary-emerald)" }}>
        <Landmark size={20} />
        <span>నడిపూడి డిజిటల్ గ్రామ సమాచార వేదిక (Nadipudi Digital Village Portal)</span>
      </div>

      <p style={{ maxWidth: "720px", margin: "0 auto 12px", fontSize: "0.85rem" }}>
        <strong>{t.disclaimerTitle}:</strong> {t.disclaimerText}
      </p>

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
        <span>•</span>
        <a href="https://agmarknet.gov.in/" target="_blank" rel="noopener noreferrer">
          Agmarknet Mandi Prices
        </a>
      </div>

      <p style={{ marginTop: "16px", fontSize: "0.8rem", opacity: 0.7 }}>
        Built with <Heart size={14} style={{ display: "inline", color: "#e11d48", verticalAlign: "middle" }} /> for the people of Nadipudi Village, Penugonda Mandal, West Godavari District, AP.
      </p>
    </footer>
  );
}

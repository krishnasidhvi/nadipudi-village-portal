import React from "react";
import { PhoneCall, ShieldAlert, User, MapPin, CheckCircle, ExternalLink } from "lucide-react";
import { sachivalayamStaff, emergencyNumbers } from "../data/directoryData";

export default function Directory({ lang, t }) {
  const isTe = lang === "te";

  return (
    <div className="directory-container">
      {/* Emergency Helplines Top Section */}
      <h3 style={{ marginBottom: "16px", fontSize: "1.25rem", color: "#b91c1c", display: "flex", alignItems: "center", gap: "8px" }}>
        🚨 {t.emergencyHelplinesTitle}
      </h3>

      <div className="grid-3" style={{ marginBottom: "32px" }}>
        {emergencyNumbers.map((item) => (
          <div
            key={item.id}
            className="card"
            style={{
              borderLeft: "4px solid #b91c1c",
              display: "flex",
              flexDirection: "column",
              justify: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div style={{ background: "#fee2e2", color: "#b91c1c", width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ShieldAlert size={20} />
                </div>
                <h4 style={{ fontSize: "1rem" }}>
                  {isTe ? item.serviceTe : item.serviceEn}
                </h4>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "12px" }}>
                {isTe ? item.descTe : item.descEn}
              </p>
            </div>

            <a
              href={`tel:${item.number.split("/")[0].trim()}`}
              className="btn-primary"
              style={{ background: "#b91c1c", alignSelf: "flex-start" }}
            >
              <PhoneCall size={16} />
              <span>{item.number}</span>
            </a>
          </div>
        ))}
      </div>

      {/* Nadipudi Grama Sachivalayam Staff Directory */}
      <div className="card">
        <div className="card-title-group">
          <div className="card-icon-box">
            <User size={22} />
          </div>
          <div>
            <h2>{t.sachivalayamTitle}</h2>
            <p style={{ fontSize: "0.88rem", opacity: 0.8 }}>
              {isTe
                ? "నడిపూడి గ్రామ సచివాలయం ప్రభుత్వ ఉద్యోగుల వివరాలు మరియు బాధ్యతలు"
                : "Official contact directory for Nadipudi Village Secretariat officers"}
            </p>
          </div>
        </div>

        <div className="grid-2">
          {sachivalayamStaff.map((staff) => (
            <div
              key={staff.id}
              style={{
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid var(--card-border)",
                background: "rgba(14, 94, 56, 0.03)",
                display: "flex",
                flexDirection: "column",
                justify: "space-between",
              }}
            >
              <div>
                <span className="badge-normal" style={{ marginBottom: "8px", display: "inline-block" }}>
                  {isTe ? staff.roleTe : staff.roleEn}
                </span>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "4px", color: "var(--primary-emerald)" }}>
                  {isTe ? staff.nameTe : staff.nameEn}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <MapPin size={14} /> {isTe ? staff.officeTe : staff.officeEn}
                </p>

                <div style={{ fontSize: "0.88rem", background: "var(--card-bg)", padding: "10px", borderRadius: "8px", marginBottom: "12px" }}>
                  <strong>బాధ్యతలు / Responsibilities:</strong>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    {isTe ? staff.responsibilitiesTe : staff.responsibilitiesEn}
                  </p>
                </div>
              </div>

              <a
                href={`tel:${staff.phone.replace(/\s+/g, "")}`}
                className="btn-outline"
                style={{ alignSelf: "flex-start" }}
              >
                <PhoneCall size={16} />
                <span>{staff.phone}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

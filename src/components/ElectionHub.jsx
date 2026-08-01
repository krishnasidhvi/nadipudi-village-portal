import React from "react";
import { ExternalLink, MapPin, FileText, Bell } from "lucide-react";
import { voterPortals, nadipudiBooths, electionUpdates } from "../data/electionData";

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

      {/* Nadipudi Polling Stations & Wards Table */}
      <div className="card" style={{ marginBottom: "28px" }}>
        <div className="card-title-group">
          <div className="card-icon-box" style={{ background: "rgba(217, 119, 6, 0.1)", color: "var(--accent-gold)" }}>
            <MapPin size={22} />
          </div>
          <div>
            <h2>{t.wardBoothsTitle}</h2>
            <p style={{ fontSize: "0.88rem", opacity: 0.8 }}>
              {isTe
                ? "నడిపూడి గ్రామ పరిధిలోని పోలింగ్ కేంద్రాలు మరియు వార్డుల ప్రాతినిధ్యం"
                : "List of designated polling stations for Nadipudi village electors"}
            </p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>పోలింగ్ కేంద్రం నం (Booth No.)</th>
                <th>{t.boothName}</th>
                <th>కవర్ అయ్యే వార్డులు (Wards)</th>
                <th>ఓటర్ల అంచనా సంఖ్య</th>
              </tr>
            </thead>
            <tbody>
              {nadipudiBooths.map((booth) => (
                <tr key={booth.boothNo}>
                  <td>
                    <span className="price-badge" style={{ background: "rgba(217, 119, 6, 0.15)", color: "var(--accent-gold)" }}>
                      Booth #{booth.boothNo}
                    </span>
                  </td>
                  <td>
                    <strong>{isTe ? booth.locationTe : booth.locationEn}</strong>
                  </td>
                  <td>{isTe ? booth.wardsCoveredTe : booth.wardsCoveredEn}</td>
                  <td>
                    <strong>{booth.voterCount} Voters</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Election Commission Press Updates */}
      <div className="card">
        <div className="card-title-group">
          <div className="card-icon-box">
            <Bell size={22} />
          </div>
          <div>
            <h3>{t.electionNewsTitle}</h3>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {electionUpdates.map((item) => (
            <div
              key={item.id}
              style={{
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid var(--card-border)",
                background: "rgba(14, 94, 56, 0.03)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span className="badge-normal">{item.date}</span>
                <FileText size={16} style={{ opacity: 0.6 }} />
              </div>
              <h4 style={{ fontSize: "1rem", marginBottom: "4px" }}>
                {isTe ? item.titleTe : item.titleEn}
              </h4>
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
                {isTe ? item.descTe : item.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

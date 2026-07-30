import React from "react";
import { Wheat, ExternalLink, CloudSun, Waves, TrendingUp, CheckCircle2 } from "lucide-react";
import { mandiPrices, publicAgriLinks, canalWaterStatus, penugondaWeather } from "../data/agriData";

export default function AgriHub({ lang, t }) {
  const isTe = lang === "te";

  return (
    <div className="agri-hub-container">
      {/* Weather & Canal Status Top Row */}
      <div className="grid-2">
        {/* Weather Card */}
        <div className="card">
          <div className="card-title-group">
            <div className="card-icon-box">
              <CloudSun size={22} />
            </div>
            <div>
              <h3>{t.weatherTitle}</h3>
              <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                {isTe ? penugondaWeather.locationTe : penugondaWeather.locationEn}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "12px 0" }}>
            <div style={{ fontSize: "2.4rem", fontWeight: 700, color: "var(--primary-emerald)" }}>
              {penugondaWeather.temp}
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>
                {isTe ? penugondaWeather.conditionTe : penugondaWeather.conditionEn}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                {isTe ? `ఆర్థరత (Humidity): ${penugondaWeather.humidity}` : `Humidity: ${penugondaWeather.humidity}`}
              </div>
            </div>
          </div>
          <div style={{ background: "rgba(14, 94, 56, 0.06)", padding: "10px 14px", borderRadius: "8px", fontSize: "0.88rem" }}>
            <strong>💡 {isTe ? "పంట సలహా:" : "Agri Advisory:"}</strong>{" "}
            {isTe ? penugondaWeather.rainfallForecastTe : penugondaWeather.rainfallForecastEn}
          </div>
        </div>

        {/* Canal Water Discharge Card */}
        <div className="card">
          <div className="card-title-group">
            <div className="card-icon-box" style={{ background: "rgba(2, 132, 199, 0.1)", color: "var(--sky-blue)" }}>
              <Waves size={22} />
            </div>
            <div>
              <h3>{t.canalTitle}</h3>
              <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                {isTe ? canalWaterStatus.barrageNameTe : canalWaterStatus.barrageNameEn}
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", margin: "12px 0" }}>
            <div style={{ background: "rgba(2, 132, 199, 0.06)", padding: "10px", borderRadius: "8px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block" }}>
                {isTe ? "ఇన్-ఫ్లో (ఇన్‌కమింగ్ నీరు)" : "Inflow"}
              </span>
              <strong style={{ color: "var(--sky-blue)", fontSize: "1.1rem" }}>{canalWaterStatus.inflow}</strong>
            </div>
            <div style={{ background: "rgba(22, 163, 74, 0.06)", padding: "10px", borderRadius: "8px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block" }}>
                {isTe ? "అవుట్-ఫ్లో (విడుదల)" : "Outflow"}
              </span>
              <strong style={{ color: "var(--primary-green)", fontSize: "1.1rem" }}>{canalWaterStatus.outflow}</strong>
            </div>
          </div>

          <div style={{ fontSize: "0.88rem", lineHeight: "1.5" }}>
            <CheckCircle2 size={16} style={{ display: "inline", color: "var(--primary-green)", marginRight: "6px" }} />
            {isTe ? canalWaterStatus.deltaCanalsTe : canalWaterStatus.deltaCanalsEn}
          </div>
        </div>
      </div>

      {/* Mandi Prices Table */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <div className="card-title-group">
          <div className="card-icon-box">
            <Wheat size={22} />
          </div>
          <div>
            <h2>{t.mandiPricesTitle}</h2>
            <p style={{ fontSize: "0.88rem", opacity: 0.8 }}>{t.mandiSubtitle}</p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>{t.cropName}</th>
                <th>{t.variety}</th>
                <th>{t.pricePerQuintal}</th>
                <th>{t.trend}</th>
                <th>{t.marketLocation}</th>
              </tr>
            </thead>
            <tbody>
              {mandiPrices.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{isTe ? item.cropTe : item.cropEn}</strong>
                  </td>
                  <td>{isTe ? item.varietyTe : item.varietyEn}</td>
                  <td>
                    <span className="price-badge">{item.price}</span>
                  </td>
                  <td>
                    <span className="trend-badge">
                      <TrendingUp size={14} style={{ display: "inline", marginRight: "4px" }} />
                      {item.trend}
                    </span>
                  </td>
                  <td>{isTe ? item.locationTe : item.locationEn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Public Agri Digital Links */}
      <h3 style={{ marginBottom: "16px", fontSize: "1.2rem" }}>
        🌐 {isTe ? "ఆంధ్రప్రదేశ్ & కేంద్ర ప్రభుత్వ వ్యవసాయ పోర్టల్స్" : "Public Government Agri Portals"}
      </h3>
      <div className="grid-2">
        {publicAgriLinks.map((link) => (
          <div key={link.id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <span className="badge-normal">{link.tag}</span>
              </div>
              <h4 style={{ fontSize: "1.05rem", marginBottom: "8px" }}>
                {isTe ? link.titleTe : link.titleEn}
              </h4>
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "16px" }}>
                {isTe ? link.descTe : link.descEn}
              </p>
            </div>
            <a
              href={link.url}
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
    </div>
  );
}

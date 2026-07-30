import React, { useState } from "react";
import { Award, Search, ExternalLink, CheckCircle, FileText, Landmark } from "lucide-react";
import { govtSchemes, meesevaServices } from "../data/schemeData";

export default function SchemesHub({ lang, t }) {
  const isTe = lang === "te";
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSchemes = govtSchemes.filter((scheme) => {
    const matchesFilter = filter === "all" || scheme.category === filter;
    const name = isTe ? scheme.nameTe : scheme.nameEn;
    const desc = isTe ? scheme.benefitTe : scheme.benefitEn;
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="schemes-hub-container">
      {/* Header & Search */}
      <h3 style={{ marginBottom: "16px", fontSize: "1.25rem" }}>
        🏛️ {t.schemesCatalogTitle}
      </h3>

      <div className="search-box-container">
        <Search className="search-icon-inside" size={20} />
        <input
          type="text"
          className="search-input"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Filter Pills */}
      <div className="filter-bar">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          {t.filterAll}
        </button>
        <button
          className={`filter-btn ${filter === "farmer" ? "active" : ""}`}
          onClick={() => setFilter("farmer")}
        >
          🌾 {t.filterFarmer}
        </button>
        <button
          className={`filter-btn ${filter === "student" ? "active" : ""}`}
          onClick={() => setFilter("student")}
        >
          🎓 {t.filterStudent}
        </button>
        <button
          className={`filter-btn ${filter === "pension" ? "active" : ""}`}
          onClick={() => setFilter("pension")}
        >
          🤝 {t.filterPension}
        </button>
        <button
          className={`filter-btn ${filter === "housing" ? "active" : ""}`}
          onClick={() => setFilter("housing")}
        >
          🏠 {t.filterHousing}
        </button>
      </div>

      {/* Scheme Cards Grid */}
      <div className="grid-2" style={{ marginBottom: "32px" }}>
        {filteredSchemes.map((scheme) => (
          <div key={scheme.id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div className="card-title-group">
                <div className="card-icon-box">
                  <Award size={22} />
                </div>
                <div>
                  <h4>{isTe ? scheme.nameTe : scheme.nameEn}</h4>
                  <p style={{ fontSize: "0.8rem", color: "var(--primary-emerald)", fontWeight: 600 }}>
                    {isTe ? scheme.deptTe : scheme.deptEn}
                  </p>
                </div>
              </div>

              <div style={{ margin: "12px 0" }}>
                <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--primary-emerald)", marginBottom: "8px" }}>
                  🎁 {isTe ? scheme.benefitTe : scheme.benefitEn}
                </p>
              </div>

              <div style={{ fontSize: "0.88rem", background: "rgba(14, 94, 56, 0.04)", padding: "12px", borderRadius: "10px", marginBottom: "12px" }}>
                <strong style={{ display: "block", marginBottom: "4px" }}>
                  <CheckCircle size={14} style={{ display: "inline", color: "var(--primary-green)", marginRight: "4px" }} />
                  {t.eligibility}:
                </strong>
                <span style={{ color: "var(--text-muted)" }}>
                  {isTe ? scheme.eligibilityTe : scheme.eligibilityEn}
                </span>
              </div>

              <div style={{ fontSize: "0.88rem", background: "rgba(217, 119, 6, 0.06)", padding: "12px", borderRadius: "10px", marginBottom: "16px" }}>
                <strong style={{ display: "block", marginBottom: "4px", color: "var(--accent-gold)" }}>
                  <FileText size={14} style={{ display: "inline", marginRight: "4px" }} />
                  {t.documentsRequired}:
                </strong>
                <span>{isTe ? scheme.docsTe : scheme.docsEn}</span>
              </div>
            </div>

            <a
              href={scheme.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ alignSelf: "flex-start" }}
            >
              <span>{t.applyNow}</span>
              <ExternalLink size={16} />
            </a>
          </div>
        ))}
      </div>

      {/* MeeSeva Services Directory */}
      <div className="card">
        <div className="card-title-group">
          <div className="card-icon-box" style={{ background: "rgba(2, 132, 199, 0.1)", color: "var(--sky-blue)" }}>
            <Landmark size={22} />
          </div>
          <div>
            <h3>{t.meesevaServicesTitle}</h3>
            <p style={{ fontSize: "0.88rem", opacity: 0.8 }}>
              {isTe
                ? "నడిపూడి గ్రామ సచివాలయంలో లభించే ముఖ్యమైన ధృవీకరణ పత్రాలు & సేవలు"
                : "Standard service timelines and statutory fees at Nadipudi Secretariat"}
            </p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>కోడ్ (Service Code)</th>
                <th>సేవ రకం (Service Name)</th>
                <th>పరిష్కార సమయం (SLA Timeline)</th>
                <th>ప్రభుత్వ రుసుము (Govt Fee)</th>
              </tr>
            </thead>
            <tbody>
              {meesevaServices.map((service) => (
                <tr key={service.code}>
                  <td>
                    <span className="price-badge" style={{ background: "rgba(2, 132, 199, 0.15)", color: "var(--sky-blue)" }}>
                      {service.code}
                    </span>
                  </td>
                  <td>
                    <strong>{isTe ? service.nameTe : service.nameEn}</strong>
                  </td>
                  <td>{isTe ? service.timeTe : service.timeEn}</td>
                  <td>
                    <strong style={{ color: "var(--primary-emerald)" }}>{service.fee}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Calendar, ShieldAlert, ExternalLink } from "lucide-react";
import SourceNote from "./SourceNote";
import { panchyatNotices, villageNews } from "../data/noticeData";
import { alerts, alertsAreStale, formatDate, formatDateTime } from "../utils/liveData";

function EmptyState({ children }) {
  return (
    <div className="card" style={{ borderStyle: "dashed", fontSize: "0.9rem", lineHeight: 1.6 }}>
      {children}
    </div>
  );
}

export default function NoticeBoard({ lang, t }) {
  const isTe = lang === "te";

  return (
    <div className="notice-board-container">
      {/* Official disaster alerts for the district */}
      <div className="card" style={{ marginBottom: "24px", borderLeft: "4px solid #b91c1c" }}>
        <div className="card-title-group">
          <div className="card-icon-box" style={{ background: "rgba(185, 28, 28, 0.15)", color: "#f87171" }}>
            <ShieldAlert size={22} />
          </div>
          <div>
            <h3>{isTe ? "పశ్చిమ గోదావరి జిల్లా అధికారిక హెచ్చరికలు" : "Official Alerts for West Godavari District"}</h3>
            <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>
              {isTe ? "తుఫాను, భారీ వర్షం, వరద, పిడుగుల హెచ్చరికలు" : "Cyclone, heavy rain, flood and lightning warnings"}
            </p>
          </div>
        </div>

        {alerts.alerts.length === 0 ? (
          <p style={{ fontSize: "0.92rem" }}>
            ✅{" "}
            {isTe
              ? `చివరిసారి పరిశీలించినప్పుడు (${formatDateTime(alerts.fetchedAt, lang)}) జిల్లా పేరుతో ఏ హెచ్చరికా అమలులో లేదు.`
              : `No alert naming the district was active when last checked (${formatDateTime(alerts.fetchedAt, lang)}).`}
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {alerts.alerts.map((alert) => (
              <div key={alert.link} style={{ background: "rgba(185, 28, 28, 0.08)", padding: "12px", borderRadius: "8px" }}>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                  {formatDateTime(alert.published, lang)}
                  {alert.issuer && ` · ${alert.issuer}`}
                </div>
                <div style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>{alert.title}</div>
                <a href={alert.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.8rem", color: "var(--sky-blue)" }}>
                  {isTe ? "పూర్తి హెచ్చరిక" : "Full alert"} <ExternalLink size={12} style={{ display: "inline" }} />
                </a>
              </div>
            ))}
          </div>
        )}

        <SourceNote
          lang={lang}
          source={isTe ? "NDMA సచేత్ జాతీయ విపత్తు హెచ్చరికల ఫీడ్" : "NDMA SACHET national disaster alert feed"}
          url={alerts.sourceUrl}
          asOf={formatDateTime(alerts.fetchedAt, lang)}
          stale={alertsAreStale}
          note={
            isTe
              ? "రోజుకు రెండుసార్లు పరిశీలిస్తాము; అత్యవసర సమయంలో నేరుగా సచేత్ లేదా 112 ను ఆశ్రయించండి"
              : "checked twice a day; in an emergency go to SACHET directly or call 112"
          }
        />
      </div>

      <div className="grid-2" style={{ marginBottom: "28px" }}>
        {/* Panchayat notices */}
        <div>
          <h3 style={{ marginBottom: "16px", fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "8px" }}>
            📢 {t.panchayatNoticeTitle}
          </h3>

          {panchyatNotices.length === 0 ? (
            <EmptyState>
              {isTe
                ? "ప్రస్తుతం ప్రకటనలు ఏవీ లేవు. పంచాయతీ లేదా సంబంధిత శాఖ నిర్ధారించిన ప్రకటనలు మాత్రమే, వాటి అసలు తేదీతో ఇక్కడ ప్రచురించబడతాయి. మంచినీటి సరఫరా, విద్యుత్ అంతరాయం వంటి సమాచారం కోసం గ్రామ సచివాలయాన్ని సంప్రదించండి."
                : "There are no notices at the moment. Only notices confirmed by the panchayat or the department concerned are published here, with their real date. For water supply or power outage information, contact the Grama Sachivalayam."}
            </EmptyState>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {panchyatNotices.map((notice) => {
                const isHigh = notice.priority === "HIGH";
                const isMedium = notice.priority === "MEDIUM";
                return (
                  <div
                    key={notice.id}
                    className="card"
                    style={{
                      borderLeft: isHigh ? "4px solid #b91c1c" : isMedium ? "4px solid #b45309" : "4px solid var(--primary-emerald)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span className={isHigh ? "badge-high" : isMedium ? "badge-medium" : "badge-normal"}>
                        {isTe ? notice.categoryTe : notice.categoryEn}
                      </span>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Calendar size={14} /> {formatDate(notice.date, lang)}
                      </span>
                    </div>

                    <h4 style={{ fontSize: "1.05rem", marginBottom: "8px" }}>{isTe ? notice.titleTe : notice.titleEn}</h4>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-main)", lineHeight: "1.5" }}>
                      {isTe ? notice.detailsTe : notice.detailsEn}
                    </p>
                    {(notice.sourceTe || notice.sourceEn) && (
                      <SourceNote lang={lang} source={isTe ? notice.sourceTe : notice.sourceEn} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Village news */}
        <div>
          <h3 style={{ marginBottom: "16px", fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "8px" }}>
            📰 {t.newsFeedTitle}
          </h3>

          {villageNews.length === 0 ? (
            <EmptyState>
              {isTe
                ? "గ్రామ వార్తలు ఇంకా చేర్చబడలేదు. నిజంగా జరిగిన కార్యక్రమాలు, వాటి తేదీ మరియు మూలంతో మాత్రమే ఇక్కడ ప్రచురించబడతాయి."
                : "No village news has been added yet. Only events that actually took place are published here, with their date and source."}
            </EmptyState>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {villageNews.map((news) => (
                <div key={news.id} className="card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span className="badge-normal">{isTe ? news.tagTe : news.tagEn}</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{formatDate(news.date, lang)}</span>
                  </div>
                  <h4 style={{ fontSize: "1rem", marginBottom: "6px" }}>{isTe ? news.titleTe : news.titleEn}</h4>
                  <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>{isTe ? news.snippetTe : news.snippetEn}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

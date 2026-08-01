import React from "react";
import { Droplets, Calendar } from "lucide-react";
import { panchyatNotices, villageNews } from "../data/noticeData";
import { getRelativeFormattedDate } from "../utils/dateUtils";

export default function NoticeBoard({ lang, t }) {
  const isTe = lang === "te";
  const todayFormatted = getRelativeFormattedDate(0, lang);

  return (
    <div className="notice-board-container">
      {/* Dynamic Date Header */}
      <div className="card" style={{ marginBottom: "20px", background: "rgba(14, 94, 56, 0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" }}>
            <Calendar size={18} className="text-emerald-600" />
            <span>{t.updatedToday}: <strong>{todayFormatted}</strong></span>
          </div>
          <span className="live-pill">🔴 LIVE AUTO-SYNCED</span>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: "28px" }}>
        {/* Main Panchayat Notice Column */}
        <div>
          <h3 style={{ marginBottom: "16px", fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "8px" }}>
            📢 {t.panchayatNoticeTitle}
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {panchyatNotices.map((notice) => {
              const isHigh = notice.priority === "HIGH";
              const isMedium = notice.priority === "MEDIUM";
              return (
                <div
                  key={notice.id}
                  className="card"
                  style={{
                    borderLeft: isHigh
                      ? "4px solid #b91c1c"
                      : isMedium
                      ? "4px solid #b45309"
                      : "4px solid var(--primary-emerald)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span className={isHigh ? "badge-high" : isMedium ? "badge-medium" : "badge-normal"}>
                      {isTe ? notice.categoryTe : notice.categoryEn}
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Calendar size={14} /> {notice.date}
                    </span>
                  </div>

                  <h4 style={{ fontSize: "1.05rem", marginBottom: "8px" }}>
                    {isTe ? notice.titleTe : notice.titleEn}
                  </h4>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-main)", lineHeight: "1.5" }}>
                    {isTe ? notice.detailsTe : notice.detailsEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Community News & Schedules Column */}
        <div>
          {/* Water & Power Quick Status Card */}
          <div className="card" style={{ marginBottom: "20px" }}>
            <div className="card-title-group">
              <div className="card-icon-box" style={{ background: "rgba(2, 132, 199, 0.1)", color: "var(--sky-blue)" }}>
                <Droplets size={22} />
              </div>
              <div>
                <h3>{t.waterNoticeTitle}</h3>
                <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                  {isTe ? "నడిపూడి రక్షిత మంచినీటి పంపిణీ వేళలు" : "Daily Drinking Water Supply Schedule"}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.9rem" }}>
              <div style={{ background: "rgba(2, 132, 199, 0.05)", padding: "10px", borderRadius: "8px" }}>
                <strong>🌅 {isTe ? "ఉదయం విడత:" : "Morning Timing:"}</strong>{" "}
                {isTe ? "ఉదయం 6:00 - 8:00 (సాధారణ రోజులలో)" : "6:00 AM - 8:00 AM Daily"}
              </div>
              <div style={{ background: "rgba(14, 94, 56, 0.05)", padding: "10px", borderRadius: "8px" }}>
                <strong>🌇 {isTe ? "సాయంత్రం విడత:" : "Evening Timing:"}</strong>{" "}
                {isTe ? "సాయంత్రం 5:30 - 7:00" : "5:30 PM - 7:00 PM Daily"}
              </div>
            </div>
          </div>

          {/* Local News Feed */}
          <h3 style={{ marginBottom: "16px", fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "8px" }}>
            📰 {t.newsFeedTitle}
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {villageNews.map((news) => (
              <div key={news.id} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span className="badge-normal">{isTe ? news.tagTe : news.tagEn}</span>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{news.date}</span>
                </div>
                <h4 style={{ fontSize: "1rem", marginBottom: "6px" }}>
                  {isTe ? news.titleTe : news.titleEn}
                </h4>
                <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
                  {isTe ? news.snippetTe : news.snippetEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

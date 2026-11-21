import React, { useState, useEffect } from "react";
import { Globe, ShieldAlert, MapPin, Users, Clock } from "lucide-react";
import { getLiveTimeString, getRelativeFormattedDate } from "../utils/dateUtils";

export default function Header({ lang, setLang, t }) {
  const [liveTime, setLiveTime] = useState(getLiveTimeString(lang));

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(getLiveTimeString(lang));
    }, 1000);
    return () => clearInterval(timer);
  }, [lang]);

  const currentDate = getRelativeFormattedDate(0, lang);

  return (
    <>
      {/* Emergency numbers bar */}
      <div className="emergency-topbar">
        <div className="pulse-dot"></div>
        <ShieldAlert size={16} />
        <span>{t.emergencyBar}</span>
      </div>

      {/* Main Header Card */}
      <header className="main-header">
        <div className="header-backdrop-pattern"></div>
        <div className="header-content">
          <div className="header-title-group">
            <div className="header-badge-row">
              <div className="brand-badge">
                <Users size={14} />
                <span>{t.communityBadge}</span>
              </div>
            </div>

            <h1>{t.portalTitle}</h1>
            <p className="flex items-center gap-2 subtitle-line">
              <MapPin size={16} style={{ display: "inline", verticalAlign: "middle" }} />{" "}
              {t.subTitle}
            </p>
          </div>

          <div className="header-actions">
            {/* Clock & date */}
            <div className="header-clock-box">
              <div className="clock-date">{currentDate}</div>
              <div className="clock-time flex items-center gap-1">
                <Clock size={14} /> {liveTime}
              </div>
            </div>

            {/* Language Switcher */}
            <button
              className="btn-toggle"
              onClick={() => setLang(lang === "te" ? "en" : "te")}
              title="Switch Language / భాష మార్చండి"
            >
              <Globe size={16} />
              <span>{t.languageSwitch}</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

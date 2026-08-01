import React, { useState, useEffect } from "react";
import { Globe, Moon, Sun, ShieldAlert, MapPin, Landmark, RefreshCw, Clock } from "lucide-react";
import { getLiveTimeString, getRelativeFormattedDate } from "../utils/dateUtils";

export default function Header({ lang, setLang, theme, setTheme, t }) {
  const [liveTime, setLiveTime] = useState(getLiveTimeString(lang));
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(getLiveTimeString(lang));
    }, 1000);
    return () => clearInterval(timer);
  }, [lang]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const currentDate = getRelativeFormattedDate(0, lang);

  return (
    <>
      {/* Top Emergency & Real-Time Marquee */}
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
                <Landmark size={14} />
                <span>ఆంధ్రప్రదేశ్ ప్రభుత్వం | Govt of AP</span>
              </div>
              <div className="live-sync-badge flex items-center gap-1">
                <span className="live-dot-green"></span>
                <span>{t.liveSyncBadge}</span>
              </div>
            </div>

            <h1>{t.portalTitle}</h1>
            <p className="flex items-center gap-2 subtitle-line">
              <MapPin size={16} style={{ display: "inline", verticalAlign: "middle" }} />{" "}
              {t.subTitle}
            </p>
          </div>

          <div className="header-actions">
            {/* Live Clock & Date Badge */}
            <div className="header-clock-box">
              <div className="clock-date">{currentDate}</div>
              <div className="clock-time flex items-center gap-1">
                <Clock size={14} /> {liveTime}
              </div>
            </div>

            {/* Refresh Data Button */}
            <button
              className={`btn-toggle ${isRefreshing ? "spin" : ""}`}
              onClick={handleManualRefresh}
              title={t.refreshTooltip}
            >
              <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            </button>

            {/* Language Switcher */}
            <button
              className="btn-toggle"
              onClick={() => setLang(lang === "te" ? "en" : "te")}
              title="Switch Language / భాష మార్చండి"
            >
              <Globe size={16} />
              <span>{t.languageSwitch}</span>
            </button>

            {/* Dark/Light Theme Toggle */}
            <button
              className="btn-toggle"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              title="Toggle Theme Mode"
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

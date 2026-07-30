import React from "react";
import { Globe, Moon, Sun, ShieldAlert, MapPin, Landmark } from "lucide-react";

export default function Header({ lang, setLang, theme, setTheme, t }) {
  return (
    <>
      {/* Top Emergency Ticker */}
      <div className="emergency-topbar">
        <div className="pulse-dot"></div>
        <ShieldAlert size={16} />
        <span>{t.emergencyBar}</span>
      </div>

      {/* Main Header */}
      <header className="main-header">
        <div className="header-backdrop-pattern"></div>
        <div className="header-content">
          <div className="header-title-group">
            <div className="brand-badge">
              <Landmark size={14} />
              <span>ఆంధ్రప్రదేశ్ ప్రభుత్వం | Govt of AP</span>
            </div>
            <h1>{t.portalTitle}</h1>
            <p className="flex items-center gap-2">
              <MapPin size={16} style={{ display: "inline", verticalAlign: "middle" }} />{" "}
              {t.subTitle}
            </p>
          </div>

          <div className="header-actions">
            {/* Language Switcher */}
            <button
              className="btn-toggle"
              onClick={() => setLang(lang === "te" ? "en" : "te")}
              title="Switch Language / భాష మార్చండి"
            >
              <Globe size={18} />
              <span>{t.languageSwitch}</span>
            </button>

            {/* Dark/Light Mode Switcher */}
            <button
              className="btn-toggle"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              title="Toggle Theme Mode"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

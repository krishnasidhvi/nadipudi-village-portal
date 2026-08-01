import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import AppInstallBanner from "./components/AppInstallBanner";
import HomeHub from "./components/HomeHub";
import TempleHub from "./components/TempleHub";
import AgriHub from "./components/AgriHub";
import AnalyticsHub from "./components/AnalyticsHub";
import ElectionHub from "./components/ElectionHub";
import SchemesHub from "./components/SchemesHub";
import NoticeBoard from "./components/NoticeBoard";
import Directory from "./components/Directory";
import SpandanaHub from "./components/SpandanaHub";
import AiAssistantWidget from "./components/AiAssistantWidget";
import Footer from "./components/Footer";
import { translations } from "./utils/translations";

export default function App() {
  const [lang, setLang] = useState("te");
  const [theme, setTheme] = useState("dark");
  const [activeTab, setActiveTab] = useState("home");

  const t = translations[lang];

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>
      {/* Full Page AI Cinematic Background Backdrop */}
      <div className="app-backdrop-image"></div>

      <div className="app-container">
        {/* Top Header & Emergency Ticker */}
        <Header lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} t={t} />

        {/* Mobile Android PWA Install Banner */}
        <AppInstallBanner lang={lang} t={t} />

        {/* Main Tab Navigation Bar */}
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} t={t} />

        {/* Dynamic Tab Content Routing */}
        <main>
          {activeTab === "home" && <HomeHub lang={lang} t={t} setActiveTab={setActiveTab} />}
          {activeTab === "temple" && <TempleHub lang={lang} t={t} />}
          {activeTab === "agri" && <AgriHub lang={lang} t={t} />}
          {activeTab === "schemes" && <SchemesHub lang={lang} t={t} />}
          {activeTab === "notices" && <NoticeBoard lang={lang} t={t} />}
          {activeTab === "analytics" && <AnalyticsHub lang={lang} t={t} />}
          {activeTab === "elections" && <ElectionHub lang={lang} t={t} />}
          {activeTab === "directory" && <Directory lang={lang} t={t} />}
          {activeTab === "spandana" && <SpandanaHub lang={lang} t={t} />}
        </main>

        {/* Floating AI Citizen & Pilgrim Voice/Text Assistant */}
        <AiAssistantWidget lang={lang} setActiveTab={setActiveTab} />

        {/* Footer */}
        <Footer lang={lang} t={t} />
      </div>
    </>
  );
}

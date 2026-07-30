import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import AgriHub from "./components/AgriHub";
import VillageMap from "./components/VillageMap";
import KeyPlacesMap from "./components/KeyPlacesMap";
import AnalyticsHub from "./components/AnalyticsHub";
import ElectionHub from "./components/ElectionHub";
import SchemesHub from "./components/SchemesHub";
import NoticeBoard from "./components/NoticeBoard";
import Directory from "./components/Directory";
import SpandanaHub from "./components/SpandanaHub";
import Footer from "./components/Footer";
import { translations } from "./utils/translations";

export default function App() {
  const [lang, setLang] = useState("te");
  const [theme, setTheme] = useState("light");
  const [activeTab, setActiveTab] = useState("agri");

  const t = translations[lang];

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="app-container">
      {/* Top Header & Emergency Bar */}
      <Header lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} t={t} />

      {/* Main Tab Navigation Bar */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} t={t} />

      {/* Dynamic Tab Content Routing */}
      <main>
        {activeTab === "agri" && <AgriHub lang={lang} t={t} />}
        {activeTab === "map" && <VillageMap lang={lang} t={t} />}
        {activeTab === "keyplaces" && <KeyPlacesMap lang={lang} t={t} />}
        {activeTab === "analytics" && <AnalyticsHub lang={lang} t={t} />}
        {activeTab === "elections" && <ElectionHub lang={lang} t={t} />}
        {activeTab === "schemes" && <SchemesHub lang={lang} t={t} />}
        {activeTab === "notices" && <NoticeBoard lang={lang} t={t} />}
        {activeTab === "directory" && <Directory lang={lang} t={t} />}
        {activeTab === "spandana" && <SpandanaHub lang={lang} t={t} />}
      </main>

      {/* Footer */}
      <Footer lang={lang} t={t} />
    </div>
  );
}

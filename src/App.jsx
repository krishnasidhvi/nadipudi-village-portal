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
  const [activeTab, setActiveTab] = useState("home");
  const [initialAction, setInitialAction] = useState(null);

  const t = translations[lang];

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  // Support direct deep linking (e.g. ?tab=temple&action=upload when scanned from phone QR)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      const actionParam = params.get("action");
      if (tabParam) {
        setActiveTab(tabParam);
      }
      if (actionParam) {
        setInitialAction(actionParam);
      }
    } catch (e) {
      console.warn("Could not parse URL query parameters:", e);
    }
  }, []);

  return (
    <>
      {/* Full Page AI Cinematic Background Backdrop */}
      <div className="app-backdrop-image"></div>

      <div className="app-container">
        {/* Top Header & Emergency Ticker */}
        <Header lang={lang} setLang={setLang} t={t} />

        {/* Mobile Android PWA Install Banner */}
        <AppInstallBanner lang={lang} t={t} />

        {/* Main Tab Navigation Bar */}
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} t={t} />

        {/* Dynamic Tab Content Routing */}
        <main>
          {activeTab === "home" && <HomeHub lang={lang} t={t} setActiveTab={setActiveTab} />}
          {activeTab === "temple" && <TempleHub lang={lang} t={t} initialAction={initialAction} />}
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

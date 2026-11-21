import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import AppInstallBanner from "./components/AppInstallBanner";
import HomeHub from "./components/HomeHub";
import AiAssistantWidget from "./components/AiAssistantWidget";
import Footer from "./components/Footer";
import { translations } from "./utils/translations";
import { isKnownTab, routeForTab, tabFromPath, urlForTab } from "./utils/routes";

// Each page loads its own code on first visit, so the home page stays light
// on slow mobile connections (charts and the QR library are not needed there).
const TempleHub = lazy(() => import("./components/TempleHub"));
const MapHub = lazy(() => import("./components/MapHub"));
const AgriHub = lazy(() => import("./components/AgriHub"));
const AnalyticsHub = lazy(() => import("./components/AnalyticsHub"));
const ElectionHub = lazy(() => import("./components/ElectionHub"));
const SchemesHub = lazy(() => import("./components/SchemesHub"));
const NoticeBoard = lazy(() => import("./components/NoticeBoard"));
const Directory = lazy(() => import("./components/Directory"));
const SpandanaHub = lazy(() => import("./components/SpandanaHub"));

const BASE = import.meta.env.BASE_URL;

// Reads the page from the address bar. Old links and printed QR codes use
// ?tab=temple&action=upload, so that form keeps working.
function readLocation() {
  const params = new URLSearchParams(window.location.search);
  const legacyTab = params.get("tab");
  const tab = isKnownTab(legacyTab) ? legacyTab : tabFromPath(window.location.pathname, BASE);
  return { tab: tab || "home", action: params.get("action") };
}

export default function App() {
  const [lang, setLang] = useState("te");
  const [activeTab, setActiveTabState] = useState(() => readLocation().tab);
  const [initialAction] = useState(() => readLocation().action);

  const t = translations[lang];

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  // Normalise the address on first load (legacy ?tab= links, unknown paths)
  // and follow the browser's back/forward buttons.
  useEffect(() => {
    const canonical = urlForTab(readLocation().tab, BASE);
    if (window.location.pathname + window.location.search !== canonical) {
      window.history.replaceState(null, "", canonical);
    }
    const onPopState = () => setActiveTabState(readLocation().tab);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const setActiveTab = useCallback((tab) => {
    const target = urlForTab(tab, BASE);
    if (window.location.pathname !== target) {
      window.history.pushState(null, "", target);
    }
    setActiveTabState(tab);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const route = routeForTab(activeTab);
    document.title = lang === "te" ? route.titleTe : route.titleEn;
    document.documentElement.lang = lang;
  }, [activeTab, lang]);

  return (
    <>
      {/* Full-page background image */}
      <div className="app-backdrop-image"></div>

      <div className="app-container">
        <Header lang={lang} setLang={setLang} t={t} />

        {/* Mobile Android PWA Install Banner */}
        <AppInstallBanner lang={lang} t={t} />

        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} t={t} />

        <main>
          <Suspense fallback={<div className="card">{lang === "te" ? "లోడ్ అవుతోంది…" : "Loading…"}</div>}>
          {activeTab === "home" && <HomeHub lang={lang} t={t} setActiveTab={setActiveTab} />}
          {activeTab === "temple" && <TempleHub lang={lang} t={t} initialAction={initialAction} />}
          {activeTab === "map" && <MapHub lang={lang} t={t} />}
          {activeTab === "agri" && <AgriHub lang={lang} t={t} />}
          {activeTab === "schemes" && <SchemesHub lang={lang} t={t} />}
          {activeTab === "notices" && <NoticeBoard lang={lang} t={t} />}
          {activeTab === "analytics" && <AnalyticsHub lang={lang} t={t} />}
          {activeTab === "elections" && <ElectionHub lang={lang} t={t} />}
          {activeTab === "directory" && <Directory lang={lang} t={t} />}
          {activeTab === "spandana" && <SpandanaHub lang={lang} t={t} />}
          </Suspense>
        </main>

        {/* Floating quick-help widget */}
        <AiAssistantWidget lang={lang} setActiveTab={setActiveTab} />

        <Footer lang={lang} t={t} />
      </div>
    </>
  );
}

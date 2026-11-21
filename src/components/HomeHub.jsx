import React from "react";
import { Landmark, Sparkles, Wheat, HeartHandshake, Users, ArrowRight, Home, MapPin, Sprout, Activity } from "lucide-react";
import SourceNote from "./SourceNote";
import { census2011, censusSources } from "../data/censusData";
import { useWeather, describeWeather, WEATHER_SOURCE } from "../utils/useWeather";
import {
  river,
  penugondaPaddy,
  mandiIsStale,
  riverIsStale,
  riverStatus,
  riverStatusLabel,
  formatDate,
  formatDateTime,
  rupees,
} from "../utils/liveData";

export default function HomeHub({ lang, t, setActiveTab }) {
  const isTe = lang === "te";
  const weather = useWeather();
  const status = riverStatusLabel[riverStatus()];
  const today = weather.data?.days[0];

  return (
    <div className="home-hub-container">
      {/* Hero banner */}
      <div className="hero-card card" style={{ marginBottom: "28px" }}>
        <div className="grid-2" style={{ alignItems: "center", gap: "28px" }}>
          {/* Left Column: Headline & Call To Actions */}
          <div>
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>{isTe ? "పశ్చిమ గోదావరి జిల్లా ఆణిముత్యం" : "West Godavari Pride"}</span>
            </div>

            <h2 className="hero-heading">{t.heroTitle}</h2>
            <p className="hero-subheading">{t.heroSubtitle}</p>

            <div className="hero-cta-buttons">
              <button className="btn-primary" onClick={() => setActiveTab("temple")}>
                <Landmark size={18} />
                <span>{isTe ? "శ్రీ సుబ్రహ్మణ్యేశ్వర ఆలయం" : "Explore Temple"}</span>
                <ArrowRight size={16} />
              </button>

              <button className="btn-outline" onClick={() => setActiveTab("agri")}>
                <Wheat size={18} />
                <span>{isTe ? "వాతావరణం & ధాన్యం ధరలు" : "Weather & Paddy Prices"}</span>
              </button>
            </div>
          </div>

          {/* Right Column: real readings, each with its own date and source */}
          <div className="live-farm-insights-widget">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", paddingBottom: "10px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", fontSize: "0.95rem", color: "#4ade80" }}>
                <Activity size={18} />
                <span>{isTe ? "నడిపూడి — తాజా సమాచారం" : "Nadipudi at a glance"}</span>
              </div>
              <button
                onClick={() => setActiveTab("agri")}
                style={{ fontSize: "0.75rem", color: "#22c55e", background: "none", border: "none", cursor: "pointer" }}
              >
                {isTe ? "పూర్తి వివరాలు →" : "Details →"}
              </button>
            </div>

            {/* Weather (Open-Meteo, fetched in the browser) */}
            <div className="insight-row">
              <div className="insight-label">
                {isTe ? "ప్రస్తుత వాతావరణం" : "Weather now"}
                <div style={{ fontSize: "0.72rem", opacity: 0.8 }}>
                  {isTe ? "అంచనా నమూనా · " : "Forecast model · "}
                  {WEATHER_SOURCE.label}
                </div>
              </div>
              <div className="insight-val" style={{ color: "#fde047", textAlign: "right" }}>
                {weather.status === "loading" && (isTe ? "లోడ్ అవుతోంది…" : "Loading…")}
                {weather.status === "error" && (isTe ? "అందుబాటులో లేదు" : "Unavailable")}
                {weather.status === "ok" && (
                  <>
                    {describeWeather(weather.data.code, lang).icon} {Math.round(weather.data.temperature)}°C
                    <div style={{ fontSize: "0.75rem", fontWeight: 500 }}>{describeWeather(weather.data.code, lang).label}</div>
                  </>
                )}
              </div>
            </div>

            {today && (
              <div className="insight-row">
                <div className="insight-label">{isTe ? "ఈ రోజు వర్షం అవకాశం" : "Chance of rain today"}</div>
                <div className="insight-val" style={{ color: "#38bdf8" }}>
                  {today.rainChance ?? 0}% · {Math.round(today.min)}–{Math.round(today.max)}°C
                </div>
              </div>
            )}

            {/* Paddy price at the village's own mandal market */}
            {penugondaPaddy && (
              <div className="insight-row">
                <div className="insight-label">
                  {isTe ? "ధాన్యం ధర — పెనుగొండ మార్కెట్" : "Paddy — Penugonda market"}
                  <div style={{ fontSize: "0.72rem", opacity: 0.8, color: mandiIsStale ? "#fbbf24" : undefined }}>
                    {formatDate(penugondaPaddy.date, lang)} · Agmarknet
                    {mandiIsStale && (isTe ? " · పాత సమాచారం" : " · out of date")}
                  </div>
                </div>
                <div className="insight-val">
                  {rupees(penugondaPaddy.modal)}
                  <span style={{ fontSize: "0.72rem", fontWeight: 500 }}> /{isTe ? "క్వింటాల్" : "quintal"}</span>
                </div>
              </div>
            )}

            {/* Godavari level at the barrage */}
            <div className="insight-row">
              <div className="insight-label">
                {isTe ? "గోదావరి నీటిమట్టం — ధవళేశ్వరం" : "Godavari level — Dowleswaram"}
                <div style={{ fontSize: "0.72rem", opacity: 0.8, color: riverIsStale ? "#fbbf24" : undefined }}>
                  {formatDateTime(river.latest.time, lang)} · CWC
                  {riverIsStale && (isTe ? " · పాత సమాచారం" : " · out of date")}
                </div>
              </div>
              <div className="insight-val" style={{ color: status.color, textAlign: "right" }}>
                {river.latest.level.toFixed(2)} m
                <div style={{ fontSize: "0.72rem", fontWeight: 500 }}>{isTe ? status.te : status.en}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mouse Scroll Indicator */}
        <div className="scroll-indicator">
          <div className="mouse-icon"></div>
          <span>Scroll to explore</span>
        </div>
      </div>

      {/* Statistics bar: Census of India 2011 */}
      <div className="grid-4">
        <div className="stat-card card">
          <div className="stat-icon" style={{ background: "rgba(34, 197, 94, 0.15)", color: "#4ade80" }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-number">{census2011.population.total.toLocaleString("en-IN")}</div>
            <div className="stat-label">{isTe ? "గ్రామ జనాభా (2011)" : "Population (2011)"}</div>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon" style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8" }}>
            <Home size={24} />
          </div>
          <div>
            <div className="stat-number">{census2011.households.toLocaleString("en-IN")}</div>
            <div className="stat-label">{isTe ? "కుటుంబాలు (2011)" : "Households (2011)"}</div>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24" }}>
            <MapPin size={24} />
          </div>
          <div>
            <div className="stat-number">{census2011.land.total} ha</div>
            <div className="stat-label">{isTe ? "గ్రామ విస్తీర్ణం (హెక్టార్లు)" : "Village area (hectares)"}</div>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon" style={{ background: "rgba(168, 85, 247, 0.15)", color: "#c084fc" }}>
            <Sprout size={24} />
          </div>
          <div>
            <div className="stat-number">{Math.round(census2011.land.netSown)} ha</div>
            <div className="stat-label">{isTe ? "సాగు భూమి (కాలువ నీటితో)" : "Net sown area (canal-irrigated)"}</div>
          </div>
        </div>
      </div>
      <SourceNote
        lang={lang}
        source={isTe ? "భారత జనాభా లెక్కలు 2011" : "Census of India 2011"}
        url={censusSources[0].url}
        note={
          <button
            onClick={() => setActiveTab("analytics")}
            style={{ color: "inherit", background: "none", border: "none", textDecoration: "underline", cursor: "pointer", font: "inherit", padding: 0 }}
          >
            {isTe ? "అన్ని గణాంకాలు చూడండి" : "see all figures"}
          </button>
        }
        style={{ marginTop: "8px", marginBottom: "28px" }}
      />

      {/* Main Attraction Spotlight: Sri Subramanyeswara Swamy Temple */}
      <div className="temple-spotlight-card card" style={{ marginBottom: "28px" }}>
        <div className="temple-spotlight-inner">
          <div className="temple-badge-saffron">
            🛕 {isTe ? "నడిపూడి ప్రధాన దివ్య క్షేత్రం" : "Nadipudi Heritage Landmark"}
          </div>
          <h3>{isTe ? "శ్రీ సుబ్రహ్మణ్యేశ్వర స్వామి దేవాలయం" : "Sri Subramanyeswara Swamy Temple, Nadipudi"}</h3>
          <p>
            {isTe
              ? "పశ్చిమ గోదావరి జిల్లా పెనుగొండ ప్రాంతంలో వెలసిన అత్యంత మహిమాన్విత స్వయంభూ క్షేత్రం. కుజ దోషం, సర్ప దోష నివారణ పూజలు మరియు శ్రీ సుబ్రహ్మణ్య షష్ఠి కళ్యాణోత్సవాలు ఇక్కడ విశేషంగా జరుగుతాయి."
              : "Renowned Swayambhu deity shrine in West Godavari district, revered by thousands of devotees for Sarpa Dosha Shanti pujas and Subrahmanya Shashti Kalyanotsavam."}
          </p>
          <div style={{ marginTop: "16px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={() => setActiveTab("temple")}>
              {isTe ? "ఆలయ సమయాలు, పూజలు & విశేషాలు చూడండి" : "Explore Temple Rituals & Timings"}
            </button>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Sri+Subramaneswara+Swami+Temple+Nadipudi+Andhra+Pradesh"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <MapPin size={16} />
              {t.viewGoogleMaps}
            </a>
          </div>
        </div>
      </div>

      {/* About the village */}
      <div className="grid-2">
        <div className="card">
          <div className="card-title-group">
            <div className="card-icon-box">
              <Sparkles size={22} />
            </div>
            <h3>{t.audacityTitle}</h3>
          </div>
          <p style={{ lineHeight: "1.7", fontSize: "0.95rem" }}>{t.audacityDesc}</p>
          <div style={{ marginTop: "16px" }} className="grid-2">
            <div className="feature-pill">🌾 {isTe ? "వరి ప్రధాన పంట" : "Paddy is the main crop"}</div>
            <div className="feature-pill">🌊 {isTe ? "గోదావరి డెల్టా కాలువ సాగునీరు" : "Irrigated by Godavari delta canals"}</div>
            <div className="feature-pill">🛕 {isTe ? "సుబ్రహ్మణ్య షష్ఠి తిరునాళ్ళు" : "Subrahmanya Shashti festival"}</div>
            <div className="feature-pill">🗳️ {isTe ? "ఆచంట శాసనసభ నియోజకవర్గం" : "Achanta assembly constituency"}</div>
          </div>
        </div>

        {/* Quick Launcher Shortcuts Grid */}
        <div className="card">
          <div className="card-title-group">
            <div className="card-icon-box" style={{ background: "rgba(2, 132, 199, 0.15)", color: "var(--sky-blue)" }}>
              <HeartHandshake size={22} />
            </div>
            <h3>{isTe ? "రైతులు & పౌరుల త్వరిత సేవలు" : "Quick Citizen & Farmer Services"}</h3>
          </div>

          <div className="quick-launch-grid">
            <button className="quick-btn" onClick={() => setActiveTab("agri")}>
              🌾 {isTe ? "వాతావరణం & ధాన్యం ధరలు" : "Weather & Paddy Prices"}
            </button>
            <button className="quick-btn" onClick={() => setActiveTab("schemes")}>
              📜 {isTe ? "ప్రభుత్వ పథకాలు" : "Govt Schemes"}
            </button>
            <button className="quick-btn" onClick={() => setActiveTab("notices")}>
              📢 {isTe ? "ప్రకటనలు & హెచ్చరికలు" : "Notices & Alerts"}
            </button>
            <button className="quick-btn" onClick={() => setActiveTab("directory")}>
              📞 {isTe ? "అత్యవసర నంబర్లు" : "Emergency Helplines"}
            </button>
            <button className="quick-btn" onClick={() => setActiveTab("spandana")}>
              💬 {isTe ? "ఫిర్యాదు నమోదు విధానం" : "How to File a Grievance"}
            </button>
            <button className="quick-btn" onClick={() => setActiveTab("analytics")}>
              📊 {isTe ? "గ్రామ గణాంకాలు" : "Village Data"}
            </button>
            <button className="quick-btn" onClick={() => setActiveTab("map")}>
              🗺️ {isTe ? "గ్రామ పటం & 3D దృశ్యం" : "Village Map & 3D View"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

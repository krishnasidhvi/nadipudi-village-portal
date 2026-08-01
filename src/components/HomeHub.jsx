import React, { useState } from "react";
import { Landmark, Sparkles, Wheat, HeartHandshake, Users, ArrowRight, ShieldCheck, MapPin, Calendar, Activity, Layers, Image as ImageIcon } from "lucide-react";
import { getRelativeFormattedDate } from "../utils/dateUtils";
import showcase3dImg from "../assets/nadipudi_3d_diorama_showcase.jpg";
import defaultBgImg from "../assets/nadipudi_full_bg.png";

export default function HomeHub({ lang, t, setActiveTab }) {
  const isTe = lang === "te";
  const currentDate = getRelativeFormattedDate(0, lang);
  const [isBgActive, setIsBgActive] = useState(false);

  // Reliable Dynamic Background Toggle Handler (Works in both Dev & Production)
  const toggleBackground = () => {
    const backdropEl = document.querySelector(".app-backdrop-image");
    if (!backdropEl) return;

    if (!isBgActive) {
      backdropEl.style.backgroundImage = `url('${showcase3dImg}')`;
      setIsBgActive(true);
    } else {
      backdropEl.style.backgroundImage = `url('${defaultBgImg}')`;
      setIsBgActive(false);
    }
  };

  return (
    <div className="home-hub-container">
      {/* ZenZe Style Full Hero Banner Grid */}
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

            <div className="hero-live-date flex items-center gap-2">
              <Calendar size={16} className="text-amber-500" />
              <span>{t.updatedToday}: <strong>{currentDate}</strong></span>
              <span className="live-pill">🔴 LIVE AUTO-SYNCED</span>
            </div>

            <div className="hero-cta-buttons">
              <button className="btn-primary" onClick={() => setActiveTab("temple")}>
                <Landmark size={18} />
                <span>{isTe ? "శ్రీ సుబ్రహ్మణ్యేశ్వర ఆలయం" : "Explore Temple"}</span>
                <ArrowRight size={16} />
              </button>

              <button className="btn-outline" onClick={() => setActiveTab("agri")}>
                <Wheat size={18} />
                <span>{isTe ? "వ్యవసాయం & మార్కెట్ ధరలు" : "Agri & Mandi Prices"}</span>
              </button>
            </div>
          </div>

          {/* Right Column: ZenZe Style "Live Farm & Village Insights" Widget */}
          <div className="live-farm-insights-widget">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", paddingBottom: "10px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", fontSize: "0.95rem", color: "#4ade80" }}>
                <Activity size={18} />
                <span>{isTe ? "గ్రామ & వ్యవసాయ ప్రత్యక్ష దత్తాంశం" : "Live Farm & Village Insights"}</span>
              </div>
              <span style={{ fontSize: "0.75rem", color: "#22c55e" }}>View All →</span>
            </div>

            {/* Soil Moisture */}
            <div className="insight-row">
              <div className="insight-label">{isTe ? "మట్టి తేమ (Soil Moisture)" : "Soil Moisture"}</div>
              <div className="insight-val">72% (Optimal)</div>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: "72%" }}></div>
            </div>

            {/* Godavari Canal Inflow */}
            <div className="insight-row" style={{ marginTop: "12px" }}>
              <div className="insight-label">{isTe ? "గోదావరి బ్యారేజీ ఇన్-ఫ్లో" : "Godavari Barrage Inflow"}</div>
              <div className="insight-val" style={{ color: "#38bdf8" }}>46,800 Cusecs</div>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: "88%", background: "linear-gradient(90deg, #0284c7, #38bdf8)" }}></div>
            </div>

            {/* Temperature & Weather */}
            <div className="insight-row" style={{ marginTop: "12px" }}>
              <div className="insight-label">{isTe ? "పెనుగొండ ఉష్ణోగ్రత" : "Mandal Temperature"}</div>
              <div className="insight-val" style={{ color: "#fde047" }}>31°C (Partly Cloudy)</div>
            </div>

            {/* N-P-K Soil Index */}
            <div className="insight-row" style={{ marginTop: "12px" }}>
              <div className="insight-label">{isTe ? "మట్టి సారవంతమైన స్కోరు" : "N-P-K Soil Health Score"}</div>
              <div className="insight-val" style={{ color: "#a855f7" }}>88 / 100</div>
            </div>
          </div>
        </div>

        {/* Mouse Scroll Indicator */}
        <div className="scroll-indicator">
          <div className="mouse-icon"></div>
          <span>Scroll to explore</span>
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="grid-4" style={{ marginBottom: "28px" }}>
        <div className="stat-card card">
          <div className="stat-icon" style={{ background: "rgba(34, 197, 94, 0.15)", color: "#4ade80" }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-number">3,850+</div>
            <div className="stat-label">{t.statPopulation}</div>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon" style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8" }}>
            <Wheat size={24} />
          </div>
          <div>
            <div className="stat-number">1,420+</div>
            <div className="stat-label">{t.statAgriculture}</div>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24" }}>
            <Landmark size={24} />
          </div>
          <div>
            <div className="stat-number">50,000+</div>
            <div className="stat-label">{t.statTemplePilgrims}</div>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon" style={{ background: "rgba(168, 85, 247, 0.15)", color: "#c084fc" }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="stat-number">10 Wards</div>
            <div className="stat-label">{t.statSecretariat}</div>
          </div>
        </div>
      </div>

      {/* AI FEATURE SPOTLIGHT: 3D Isometric Geographical Model Showcase (Seamlessly Merged) */}
      <div className="card" style={{ marginBottom: "28px", background: "rgba(0, 0, 0, 0.45)", border: "1.5px solid rgba(234, 88, 12, 0.45)" }}>
        <div className="card-title-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="card-icon-box" style={{ background: "rgba(234, 88, 12, 0.25)", color: "var(--divine-saffron)" }}>
              <ImageIcon size={22} />
            </div>
            <div>
              <h3 style={{ color: "var(--divine-saffron)", fontSize: "1.3rem" }}>
                {isTe ? "నడిపూడి గ్రామీణ 3D ఐసోమెట్రిక్ నమూనా & భౌగోళిక విస్తరణ" : "Nadipudi 3D Geographical Topography Diorama Showcase"}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>
                {isTe ? "శ్రీ సుబ్రహ్మణ్యేశ్వర స్వామి దేవాలయం (Centre of Attraction), వసిష్ఠ గోదావరి, పుష్కర ఘాట్ & స్వర్ణ పొలాలు" : "Sri Subramanyeswara Swamy Temple (Centre of Attraction), Godavari River, Pushkar Ghat & Paddy Ayacut"}
              </p>
            </div>
          </div>

          {/* Interactive Background Blending Toggle */}
          <button
            className="btn-primary"
            onClick={toggleBackground}
            style={{
              background: isBgActive ? "linear-gradient(135deg, #0284c7, #38bdf8)" : "linear-gradient(135deg, #ea580c, #f97316)",
              fontSize: "0.88rem",
              padding: "10px 18px"
            }}
          >
            <Layers size={16} />
            <span>
              {isBgActive
                ? (isTe ? "🔄 పాత బ్యాక్‌గ్రౌండ్‌కి మార్చండి" : "Revert Original Background")
                : (isTe ? "🌄 మెయిన్ బ్యాక్‌గ్రౌండ్‌గా మార్చండి" : "Merge as Website Background")}
            </span>
          </button>
        </div>

        {/* Full Uncropped 3D Diorama Image Frame */}
        <div style={{ margin: "18px 0", borderRadius: "16px", overflow: "hidden", background: "rgba(0, 0, 0, 0.5)", position: "relative", border: "1.5px solid rgba(234, 88, 12, 0.35)", padding: "4px" }}>
          <img
            src={showcase3dImg}
            alt="Nadipudi 3D Diorama Map Showcase"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              display: "block",
              borderRadius: "12px",
              boxShadow: "0 12px 36px rgba(0,0,0,0.6)"
            }}
          />
        </div>

        {/* Key Landmarks Tags Grid */}
        <div className="grid-3" style={{ gap: "12px", marginTop: "16px" }}>
          <div style={{ background: "rgba(234, 88, 12, 0.15)", padding: "12px 14px", borderRadius: "10px", borderLeft: "4px solid #ea580c" }}>
            <strong style={{ color: "#fde047", fontSize: "0.9rem" }}>🛕 Sri Subramanyeswara Temple:</strong>
            <p style={{ fontSize: "0.82rem", color: "#cbd5e1", marginTop: "2px" }}>
              {isTe ? "గ్రామ నడిబొడ్డున పవిత్ర కోనేరు ఒడ్డున కొలువై ఉన్న ప్రధాన క్షేత్రం (Centre of Attraction)." : "Primary Swayambhu shrine located beside the sacred temple pond."}
            </p>
          </div>

          <div style={{ background: "rgba(2, 132, 199, 0.15)", padding: "12px 14px", borderRadius: "10px", borderLeft: "4px solid #38bdf8" }}>
            <strong style={{ color: "#38bdf8", fontSize: "0.9rem" }}>🌊 Godavari & Pushkar Ghat:</strong>
            <p style={{ fontSize: "0.82rem", color: "#cbd5e1", marginTop: "2px" }}>
              {isTe ? "వసిష్ఠ గోదావరి నది, పాములూరు కాలువ వంతెన & పుష్కర స్నాన ఘాట్." : "Vasishtha Godavari river bank, Pamuleru canal bridge & Pushkar Ghat."}
            </p>
          </div>

          <div style={{ background: "rgba(34, 197, 94, 0.15)", padding: "12px 14px", borderRadius: "10px", borderLeft: "4px solid #4ade80" }}>
            <strong style={{ color: "#4ade80", fontSize: "0.9rem" }}>🌾 Fertile Paddy Fields & Culture:</strong>
            <p style={{ fontSize: "0.82rem", color: "#cbd5e1", marginTop: "2px" }}>
              {isTe ? "పచ్చని స్వర్ణ వరి పొలాలు, వేంకటేశ్వర స్వామి & మావుళ్ళమ్మ ఆలయాలు, పల్లె జీవనం." : "Lush Swarna paddy fields, Venkateswara & Mavullamma shrines, local life."}
            </p>
          </div>
        </div>
      </div>

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

      {/* Audacity & Pride of Nadipudi Card */}
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
            <div className="feature-pill">🌾 {isTe ? "స్వర్ణ వరి & కొబ్బరి రికార్డు దిగుబడులు" : "High Swarna Paddy & Coconut Yields"}</div>
            <div className="feature-pill">🌊 {isTe ? "గోదావరి కాటన్ డెల్టా కాలువ నీరు" : "Arthur Cotton Canal Delta Water"}</div>
            <div className="feature-pill">🏛️ {isTe ? "డిజిటల్ సచివాలయం సేవలు" : "100% Digital Secretariat Ready"}</div>
            <div className="feature-pill">🤝 {isTe ? "స్పందన వేగవంత పౌర పరిష్కారాలు" : "Fast Spandana Grievance Resolution"}</div>
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
              🌾 {isTe ? "ఈ-క్రాప్ & మండి ధరలు" : "e-Crop & Mandi Prices"}
            </button>
            <button className="quick-btn" onClick={() => setActiveTab("schemes")}>
              📜 {isTe ? "AP ప్రభుత్వ పథకాలు" : "AP Govt Schemes"}
            </button>
            <button className="quick-btn" onClick={() => setActiveTab("notices")}>
              📢 {isTe ? "మంచినీటి & కరెంట్ కోతలు" : "Water & Power Updates"}
            </button>
            <button className="quick-btn" onClick={() => setActiveTab("directory")}>
              📞 {isTe ? "సచివాలయ సిబ్బంది ఫోన్లు" : "Secretariat Directory"}
            </button>
            <button className="quick-btn" onClick={() => setActiveTab("spandana")}>
              💬 {isTe ? "స్పందన దరఖాస్తు" : "Spandana Grievance Form"}
            </button>
            <button className="quick-btn" onClick={() => setActiveTab("analytics")}>
              📊 {isTe ? "గ్రామ గణాంకాలు" : "Village Analytics"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

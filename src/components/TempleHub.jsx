import React, { useState, useEffect } from "react";
import {
  Landmark,
  Clock,
  MapPin,
  Compass,
  ExternalLink,
  Utensils,
  Award,
  Image as ImageIcon,
  Video,
  QrCode,
  Upload,
  Play,
  Trash2,
  Smartphone,
  Calendar,
  User,
  Film
} from "lucide-react";
import { templeInfo } from "../data/templeData";
import seedCommunityMedia from "../data/communityTempleMedia.json";
import { getLocalMediaItems, deleteLocalMediaItem } from "../utils/templeMediaStorage";
import TempleMediaQRModal from "./TempleMediaQRModal";
import TempleMediaUploadModal from "./TempleMediaUploadModal";
import TempleMediaLightbox from "./TempleMediaLightbox";

// Import authentic deity photo and Google Maps photo
import godDeityImg from "../assets/temple_god_deity.jpg";
import googleMapsPhotoImg from "../assets/temple_google_maps_photo.jpg";

export default function TempleHub({ lang, t, initialAction }) {
  const isTe = lang === "te";
  const [activeSubTab, setActiveSubTab] = useState("history");
  const [selectedGalleryImg, setSelectedGalleryImg] = useState(godDeityImg);

  // Dynamic Media & Phone Upload States
  const [localMedia, setLocalMedia] = useState([]);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedLightboxItem, setSelectedLightboxItem] = useState(null);
  const [mediaFilter, setMediaFilter] = useState("all"); // "all", "photo", "video"

  const galleryItems = [
    {
      id: "g1",
      titleTe: "మూలవిరాట్ శ్రీ సుబ్రహ్మణ్యేశ్వర స్వామి నిజరూప దర్శనం",
      titleEn: "Nadipudi Swayambhu Deity Authentic Shrine Darshan",
      img: godDeityImg,
      badgeTe: "పవిత్ర మూలవిరాట్ నిజరూపం",
      badgeEn: "Authentic Shrine Darshan",
      descTe: "నడిపూడి గ్రామంలో స్వయంభూవుగా వెలసిన శ్రీ సుబ్రహ్మణ్యేశ్వర స్వామి వారు (శ్రీ వల్లి, దేవసేన సమేతంగా) సర్ప చత్రాకార ప్రభావళి మరియు స్వర్ణాభరణ దివ్యాభిషేక నిజరూప దర్శనం.",
      descEn: "Authentic shrine photograph of Lord Subramanyeswara Swamy along with Valli and Devasena adorned with golden ornaments and flower garlands at Nadipudi."
    },
    {
      id: "g3",
      titleTe: "గూగుల్ మ్యాప్స్ భక్తుల క్షేత్ర సమర్పణ ఛాయాచిత్రం",
      titleEn: "Google Maps Verified Pilgrim Photo",
      img: googleMapsPhotoImg,
      badgeTe: "గూగుల్ మ్యాప్స్ పబ్లిక్ ఫోటో",
      badgeEn: "Google Maps Verified Photo",
      descTe: "నడిపూడి శ్రీ సుబ్రహ్మణ్యేశ్వర స్వామి ఆలయాన్ని దర్శించిన భక్తులు సమర్పించిన పబ్లిక్ ఛాయాచిత్రం.",
      descEn: "Authentic public photograph contributed by devotees on Google Maps for Sri Subramanyeswara Swami Temple Nadipudi."
    }
  ];

  // Load Locally Saved Media from IndexedDB on mount
  useEffect(() => {
    loadLocalMedia();
    if (initialAction === "upload") {
      setIsUploadModalOpen(true);
      setActiveSubTab("media");
    } else if (initialAction === "qr") {
      setIsQRModalOpen(true);
    }
  }, [initialAction]);

  const loadLocalMedia = async () => {
    try {
      const items = await getLocalMediaItems();
      setLocalMedia(items);
    } catch (e) {
      console.warn("Could not load local media items:", e);
    }
  };

  const handleMediaAdded = (newItem) => {
    setLocalMedia((prev) => [newItem, ...prev]);
    setActiveSubTab("media");
  };

  const handleDeleteLocalMedia = async (id, e) => {
    e.stopPropagation();
    if (window.confirm(isTe ? "ఈ మీడియా అంశాన్ని తొలగించాలనుకుంటున్నారా?" : "Are you sure you want to delete this media item?")) {
      await deleteLocalMediaItem(id);
      setLocalMedia((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Combine seeded community videos with locally uploaded videos/photos
  const allMediaItems = [...localMedia, ...seedCommunityMedia];
  const filteredMedia = allMediaItems.filter((item) => {
    if (mediaFilter === "photo") return item.type === "photo";
    if (mediaFilter === "video") return item.type === "video";
    return true;
  });

  return (
    <div className="temple-hub-container">
      {/* Sacred Divine Hero Banner */}
      <div className="card temple-hero-banner" style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div className="temple-saffron-badge">
              ✨ {isTe ? "పశ్చిమ గోదావరి దివ్య స్వయంభూ క్షేత్రం" : "West Godavari Sacred Swayambhu Shrine"}
            </div>
            <h2 style={{ fontSize: "2rem", color: "#ffffff", marginTop: "4px" }}>{isTe ? templeInfo.nameTe : templeInfo.nameEn}</h2>
            <p className="temple-deity-text" style={{ fontSize: "1.05rem", color: "#fde047", marginTop: "6px" }}>
              <strong>{isTe ? "మూలవిరాట్:" : "Primary Deity:"}</strong> {isTe ? templeInfo.deityTe : templeInfo.deityEn}
            </p>
            <p className="temple-location-text flex items-center gap-1" style={{ fontSize: "0.9rem", color: "#cbd5e1", marginTop: "6px" }}>
              <MapPin size={16} /> {isTe ? templeInfo.locationTe : templeInfo.locationEn}
            </p>
          </div>

          {/* Top Quick Actions: Mobile QR, Upload, Google Maps */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <button
              onClick={() => setIsQRModalOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                borderRadius: "12px",
                background: "rgba(234, 88, 12, 0.25)",
                color: "#ffedd5",
                border: "1.5px solid #ea580c",
                fontWeight: "700",
                fontSize: "0.88rem",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(234, 88, 12, 0.3)"
              }}
            >
              <QrCode size={18} color="#f97316" />
              <span>{isTe ? "📱 మొబైల్ QR కోడ్" : "📱 Scan Mobile QR"}</span>
            </button>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #ea580c, #c2410c)",
                color: "#ffffff",
                border: "none",
                fontWeight: "700",
                fontSize: "0.88rem",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(234, 88, 12, 0.45)"
              }}
            >
              <Upload size={18} />
              <span>{isTe ? "📸 ఫోటో/వీడియో జోడించండి" : "📸 Upload Media"}</span>
            </button>

            <a
              href={templeInfo.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <ExternalLink size={16} />
              <span>{t.viewGoogleMaps}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Authentic Shrine & AI Gopuram Photo Gallery (UNCROPPED FULL IMAGE VISIBILITY) */}
      <div className="card" style={{ marginBottom: "28px", background: "rgba(0, 0, 0, 0.45)", border: "1.5px solid rgba(234, 88, 12, 0.4)" }}>
        <div className="card-title-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="card-icon-box" style={{ background: "rgba(234, 88, 12, 0.25)", color: "var(--divine-saffron)" }}>
              <ImageIcon size={22} />
            </div>
            <div>
              <h3 style={{ color: "var(--divine-saffron)" }}>
                {isTe ? "నడిపూడి సుబ్రహ్మణ్యేశ్వర స్వామి మూలవిరాట్ & క్షేత్ర దర్శన చిత్రమాలిక" : "Nadipudi Shrine Authentic Deity Darshan & Pilgrim Photos"}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>
                {isTe ? "చిత్రాలు ఏమాత్రం కత్తిరించబడకుండా పూర్తి సహజ పరిమాణంలో ప్రదర్శించబడుతున్నాయి" : "Full uncropped view of authentic shrine deity photo and Google Maps photo"}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setActiveSubTab("media")}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#fde047",
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "0.8rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <Film size={15} />
              <span>{isTe ? `వీడియోలు & భక్తుల దృశ్యాలు (${allMediaItems.length})` : `All Videos & Media (${allMediaItems.length})`}</span>
            </button>
          </div>
        </div>

        {/* Selected Large Image Display (UNCROPPED object-fit: contain) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }} className="grid-2">
          {/* Uncropped Image Display Frame */}
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "16px",
              border: "2px solid rgba(234, 88, 12, 0.5)",
              boxShadow: "0 12px 36px rgba(0,0,0,0.7)",
              background: "rgba(0, 0, 0, 0.75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "360px"
            }}
          >
            <img
              src={selectedGalleryImg}
              alt="Selected Nadipudi Temple Visual"
              style={{
                maxWidth: "100%",
                maxHeight: "440px",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                display: "block",
                margin: "0 auto",
                borderRadius: "10px"
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {galleryItems
              .filter((item) => item.img === selectedGalleryImg)
              .map((item) => (
                <div key={item.id}>
                  <div className="temple-saffron-badge" style={{ marginBottom: "14px" }}>
                    {isTe ? item.badgeTe : item.badgeEn}
                  </div>
                  <h4 style={{ fontSize: "1.4rem", color: "#ffffff", marginBottom: "12px", lineHeight: "1.3" }}>
                    {isTe ? item.titleTe : item.titleEn}
                  </h4>
                  <p style={{ fontSize: "0.98rem", color: "#cbd5e1", lineHeight: "1.7", background: "rgba(255,255,255,0.06)", padding: "14px", borderRadius: "12px", borderLeft: "4px solid #ea580c" }}>
                    {isTe ? item.descTe : item.descEn}
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* Thumbnail Selector Row (UNCROPPED Thumbnails) */}
        <div className="grid-2" style={{ gap: "14px" }}>
          {galleryItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedGalleryImg(item.img)}
              style={{
                cursor: "pointer",
                borderRadius: "12px",
                overflow: "hidden",
                border: selectedGalleryImg === item.img ? "2.5px solid #ea580c" : "1.5px solid rgba(255,255,255,0.2)",
                transform: selectedGalleryImg === item.img ? "scale(1.03)" : "scale(1)",
                transition: "all 0.25s ease",
                background: "rgba(0, 0, 0, 0.6)",
                padding: "4px"
              }}
            >
              <div style={{ height: "100px", display: "flex", alignItems: "center", justifyContent: "center", background: "#000" }}>
                <img
                  src={item.img}
                  alt={item.titleEn}
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                />
              </div>
              <div style={{ padding: "6px 8px", background: "rgba(7, 23, 16, 0.95)", fontSize: "0.78rem", fontWeight: "700", textAlign: "center", color: selectedGalleryImg === item.img ? "#f97316" : "#e2e8f0" }}>
                {isTe ? item.badgeTe : item.badgeEn}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Internal Sub-Tabs Navigation */}
      <div className="filter-bar" style={{ marginBottom: "24px" }}>
        <button
          className={`filter-btn ${activeSubTab === "history" ? "active" : ""}`}
          onClick={() => setActiveSubTab("history")}
        >
          🏛️ {t.templeTabsHistory}
        </button>
        <button
          className={`filter-btn ${activeSubTab === "media" ? "active" : ""}`}
          onClick={() => setActiveSubTab("media")}
          style={{ position: "relative" }}
        >
          🎬 {isTe ? "వీడియోలు & భక్తుల సమర్పణలు" : "Videos & Devotee Media"}
          {allMediaItems.length > 0 && (
            <span
              style={{
                marginLeft: "6px",
                background: "#ea580c",
                color: "#ffffff",
                padding: "2px 7px",
                borderRadius: "10px",
                fontSize: "0.72rem",
                fontWeight: "700"
              }}
            >
              {allMediaItems.length}
            </span>
          )}
        </button>
        <button
          className={`filter-btn ${activeSubTab === "pujas" ? "active" : ""}`}
          onClick={() => setActiveSubTab("pujas")}
        >
          🛕 {t.templeTabsPujas}
        </button>
        <button
          className={`filter-btn ${activeSubTab === "festivals" ? "active" : ""}`}
          onClick={() => setActiveSubTab("festivals")}
        >
          🎉 {t.templeTabsFestivals}
        </button>
        <button
          className={`filter-btn ${activeSubTab === "prasadam" ? "active" : ""}`}
          onClick={() => setActiveSubTab("prasadam")}
        >
          🍲 {isTe ? "దివ్య ప్రసాదములు" : "Temple Prasadam"}
        </button>
        <button
          className={`filter-btn ${activeSubTab === "timings" ? "active" : ""}`}
          onClick={() => setActiveSubTab("timings")}
        >
          ⏰ {t.templeTabsTimings}
        </button>
      </div>

      {/* Sub-Tab 1: History & Swayambhu Significance */}
      {activeSubTab === "history" && (
        <div className="grid-2">
          <div className="card">
            <div className="card-title-group">
              <div className="card-icon-box" style={{ background: "rgba(234, 88, 12, 0.25)", color: "var(--divine-saffron)" }}>
                <Landmark size={22} />
              </div>
              <h3>{isTe ? "క్షేత్ర చరిత్ర & స్వయంభూ దివ్య మహిమలు" : "Sacred History & Swayambhu Divinity"}</h3>
            </div>
            <p style={{ lineHeight: "1.8", fontSize: "0.96rem", color: "#f1f5f9" }}>
              {isTe ? templeInfo.significanceTe : templeInfo.significanceEn}
            </p>
            <div style={{ marginTop: "18px", padding: "16px", background: "rgba(234, 88, 12, 0.15)", borderRadius: "12px", borderLeft: "4px solid var(--divine-saffron)" }}>
              <strong style={{ color: "#fde047" }}>{isTe ? "ఆధ్యాత్మిక దోష నివారణ విశ్వాసం:" : "Spiritual Belief & Benefits:"}</strong>{" "}
              <p style={{ fontSize: "0.92rem", marginTop: "4px", color: "#e2e8f0" }}>
                {isTe
                  ? "నడిపూడి సుబ్రహ్మణ్యేశ్వర స్వామి వారిని దర్శించి సర్ప సూక్త హోమం జరిపించుకున్న భక్తులకు జాతకంలో ఉన్న రాహు-కేతు సర్ప దోషాలు, కుజ దోషం మంగళ దోష శమనం కలిగి శీఘ్ర వివాహం మరియు సంతాన సౌభాగ్యం కలుగుతుందని విశ్వసిస్తారు."
                  : "Worshipping Lord Subramanya here with Sarpa Sukta Homam offers relief from Rahu-Ketu astrological afflictions, Kuja Dosha, and brings early marriage & family prosperity."}
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-title-group">
              <div className="card-icon-box" style={{ background: "rgba(34, 197, 94, 0.2)", color: "#4ade80" }}>
                <Compass size={22} />
              </div>
              <h3>{isTe ? "దేవాలయ పరిపాలన & క్షేత్ర వివరాలు" : "Temple Administration & Shrine Details"}</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.92rem" }}>
              <div style={{ background: "rgba(255,255,255,0.06)", padding: "12px 14px", borderRadius: "10px" }}>
                <strong>🏛️ {isTe ? "నిర్వహణ సమతి:" : "Management:"}</strong> {isTe ? templeInfo.trustTe : templeInfo.trustEn}
              </div>
              <div style={{ background: "rgba(255,255,255,0.06)", padding: "12px 14px", borderRadius: "10px" }}>
                <strong>📍 {isTe ? "స్థల చిరునామా:" : "Location Address:"}</strong> {isTe ? templeInfo.locationTe : templeInfo.locationEn}
              </div>
              <div style={{ background: "rgba(255,255,255,0.06)", padding: "12px 14px", borderRadius: "10px" }}>
                <strong>🚩 {isTe ? "ప్రధాన ఉత్సవం:" : "Main Festival:"}</strong> {isTe ? "మార్గశిర సుబ్రహ్మణ్య షష్ఠి కళ్యాణోత్సవం & నాగుల చవితి" : "Subrahmanya Shashti Kalyanotsavam & Nagula Chavithi"}
              </div>
            </div>
            <div style={{ marginTop: "16px" }}>
              <a
                href={templeInfo.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ display: "inline-flex", width: "100%", justifyContent: "center" }}
              >
                <ExternalLink size={18} />
                <span>{t.viewGoogleMaps}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Videos & Devotee Media Gallery Hub */}
      {activeSubTab === "media" && (
        <div>
          {/* Action Callout Bar */}
          <div
            className="card"
            style={{
              marginBottom: "20px",
              background: "linear-gradient(135deg, rgba(234, 88, 12, 0.15), rgba(7, 23, 16, 0.8))",
              border: "1.5px solid rgba(234, 88, 12, 0.4)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "14px",
              padding: "16px 20px"
            }}
          >
            <div>
              <h3 style={{ fontSize: "1.25rem", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                <Film size={20} color="#f97316" />
                <span>{isTe ? "ఆలయ వీడియోలు & భక్తుల దృశ్య మాలిక" : "Temple Video Darshan & Devotee Gallery"}</span>
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#cbd5e1", marginTop: "2px" }}>
                {isTe
                  ? "మీ మొబైల్ ఫోన్ నుండి ఫోటోలు & వీడియోలను నేరుగా జతచేయండి — కంప్యూటర్‌తో పనిలేదు!"
                  : "Directly contribute photos & videos from your phone — no PC needed!"}
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={() => setIsQRModalOpen(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "10px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  color: "#ffffff",
                  fontSize: "0.84rem",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                <QrCode size={16} color="#f97316" />
                <span>{isTe ? "ఫోన్ QR స్కాన్" : "Scan Mobile QR"}</span>
              </button>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: "10px",
                  background: "#ea580c",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "0.84rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(234, 88, 12, 0.4)"
                }}
              >
                <Upload size={16} />
                <span>{isTe ? "ఫోటో / వీడియో జోడించండి" : "Add Photo / Video"}</span>
              </button>
            </div>
          </div>

          {/* Media Filter Tabs */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "18px", flexWrap: "wrap" }}>
            <button
              onClick={() => setMediaFilter("all")}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "0.82rem",
                fontWeight: "600",
                cursor: "pointer",
                background: mediaFilter === "all" ? "#ea580c" : "rgba(255, 255, 255, 0.08)",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.15)"
              }}
            >
              {isTe ? `అన్ని దృశ్యాలు (${allMediaItems.length})` : `All Media (${allMediaItems.length})`}
            </button>
            <button
              onClick={() => setMediaFilter("video")}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "0.82rem",
                fontWeight: "600",
                cursor: "pointer",
                background: mediaFilter === "video" ? "#ea580c" : "rgba(255, 255, 255, 0.08)",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <Video size={14} />
              <span>{isTe ? `వీడియోలు (${allMediaItems.filter(x => x.type === "video").length})` : `Videos (${allMediaItems.filter(x => x.type === "video").length})`}</span>
            </button>
            <button
              onClick={() => setMediaFilter("photo")}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "0.82rem",
                fontWeight: "600",
                cursor: "pointer",
                background: mediaFilter === "photo" ? "#ea580c" : "rgba(255, 255, 255, 0.08)",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <ImageIcon size={14} />
              <span>{isTe ? `ఫోటోలు (${allMediaItems.filter(x => x.type === "photo").length})` : `Photos (${allMediaItems.filter(x => x.type === "photo").length})`}</span>
            </button>
          </div>

          {/* Media Grid */}
          <div className="grid-3" style={{ gap: "20px" }}>
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                className="card"
                onClick={() => setSelectedLightboxItem(item)}
                style={{
                  cursor: "pointer",
                  padding: "0",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  background: "rgba(0, 0, 0, 0.55)",
                  border: item.isLocal ? "1.5px solid #4ade80" : "1.5px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "16px",
                  transition: "all 0.25s ease",
                  position: "relative"
                }}
              >
                {/* Thumbnail / Video Container */}
                <div
                  style={{
                    height: "190px",
                    background: "#050b08",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden"
                  }}
                >
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.titleEn || item.titleTe}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : item.type === "video" ? (
                    <div style={{ textAlign: "center", color: "#f97316" }}>
                      <Video size={44} />
                      <div style={{ fontSize: "0.75rem", color: "#cbd5e1", marginTop: "4px" }}>
                        {isTe ? "వీడియో క్లిప్" : "Video Clip"}
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.mediaUrl}
                      alt={item.titleEn || item.titleTe}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  )}

                  {/* Play Button Overlay for Videos */}
                  {item.type === "video" && (
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: "rgba(234, 88, 12, 0.9)",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.6)"
                      }}
                    >
                      <Play size={24} fill="#ffffff" style={{ marginLeft: "3px" }} />
                    </div>
                  )}

                  {/* Category Badge Top Left */}
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      background: "rgba(0, 0, 0, 0.75)",
                      backdropFilter: "blur(4px)",
                      color: "#fde047",
                      padding: "3px 10px",
                      borderRadius: "12px",
                      fontSize: "0.72rem",
                      fontWeight: "700",
                      border: "1px solid rgba(253, 224, 71, 0.4)"
                    }}
                  >
                    {isTe ? item.categoryTe : item.categoryEn}
                  </div>

                  {/* Delete Button for items added from current device */}
                  {item.isLocal && (
                    <button
                      onClick={(e) => handleDeleteLocalMedia(item.id, e)}
                      title={isTe ? "తొలగించండి" : "Delete Item"}
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        background: "rgba(220, 38, 38, 0.85)",
                        border: "none",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer"
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                {/* Card Content Info */}
                <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <h4 style={{ fontSize: "1.05rem", color: "#ffffff", marginBottom: "8px", lineHeight: "1.4" }}>
                    {isTe ? item.titleTe : item.titleEn}
                  </h4>

                  <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.78rem", color: "#94a3b8" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <User size={13} color="#f97316" />
                      <span style={{ maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.contributor}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Calendar size={13} color="#4ade80" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Add Prompt Card */}
          <div
            className="card"
            style={{
              marginTop: "24px",
              padding: "24px",
              textAlign: "center",
              background: "rgba(0, 0, 0, 0.4)",
              border: "1.5px dashed rgba(234, 88, 12, 0.5)",
              borderRadius: "16px"
            }}
          >
            <div style={{ display: "inline-flex", padding: "12px", background: "rgba(234, 88, 12, 0.2)", borderRadius: "50%", color: "#f97316", marginBottom: "12px" }}>
              <Smartphone size={28} />
            </div>
            <h4 style={{ fontSize: "1.2rem", color: "#ffffff", marginBottom: "6px" }}>
              {isTe ? "మరిన్ని ఫోటోలు & వీడియోలను చేర్చాలనుకుంటున్నారా?" : "Have More Temple Photos or Videos?"}
            </h4>
            <p style={{ fontSize: "0.88rem", color: "#cbd5e1", maxWidth: "600px", margin: "0 auto 16px auto" }}>
              {isTe
                ? "మీ స్మార్ట్‌ఫోన్ కెమెరాతో క్షేత్ర ఉత్సవాలు, రథోత్సవం, అభిషేకం లేదా గోపురం దృశ్యాలను తక్షణమే ఈ వెబ్‌సైట్‌కు సమర్పించండి."
                : "Easily snap temple rituals, Rathotsavam, or architecture videos directly from your mobile camera."}
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={() => setIsQRModalOpen(true)}
                style={{
                  padding: "10px 18px",
                  borderRadius: "10px",
                  background: "rgba(255, 255, 255, 0.12)",
                  color: "#ffffff",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  fontWeight: "600",
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <QrCode size={18} color="#f97316" />
                <span>{isTe ? "QR కోడ్ చూడండి" : "View Mobile QR"}</span>
              </button>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "10px",
                  background: "#ea580c",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: "700",
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 4px 16px rgba(234, 88, 12, 0.5)"
                }}
              >
                <Upload size={18} />
                <span>{isTe ? "ఇప్పుడే అప్‌లోడ్ చేయండి" : "Upload Right Now"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Pujas & Dosha Relief Services */}
      {activeSubTab === "pujas" && (
        <div>
          <div className="grid-3" style={{ marginBottom: "20px" }}>
            {templeInfo.pujas.map((puja) => (
              <div key={puja.id} className="card">
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#fde047", marginBottom: "8px", fontWeight: "700", fontSize: "0.85rem" }}>
                  <Clock size={16} />
                  <span>{isTe ? puja.timingTe : puja.timingEn}</span>
                </div>
                <h3 style={{ fontSize: "1.15rem", color: "#ffffff", marginBottom: "8px" }}>
                  {isTe ? puja.nameTe : puja.nameEn}
                </h3>
                <p style={{ fontSize: "0.92rem", color: "#e2e8f0", lineHeight: "1.6" }}>
                  {isTe ? puja.descTe : puja.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Subrahmanya Shashti & Festival Calendar */}
      {activeSubTab === "festivals" && (
        <div className="grid-2">
          {templeInfo.festivals.map((fest) => (
            <div key={fest.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span className="badge-normal">🎉 {isTe ? fest.monthTe : fest.monthEn}</span>
              </div>
              <h3 style={{ fontSize: "1.2rem", color: "var(--divine-saffron)", marginBottom: "8px" }}>
                {isTe ? fest.nameTe : fest.nameEn}
              </h3>
              <p style={{ fontSize: "0.93rem", color: "#f1f5f9", lineHeight: "1.6" }}>
                {isTe ? fest.descTe : fest.descEn}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Sub-Tab 5: Temple Prasadam & Offerings */}
      {activeSubTab === "prasadam" && (
        <div className="grid-2">
          <div className="card">
            <div className="card-title-group">
              <div className="card-icon-box" style={{ background: "rgba(234, 88, 12, 0.25)", color: "var(--divine-saffron)" }}>
                <Utensils size={22} />
              </div>
              <h3>{isTe ? "స్వామి వారి దివ్య ప్రసాదములు" : "Temple Prasadam Offerings"}</h3>
            </div>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>{isTe ? "ప్రసాదం పేరు" : "Prasadam Name"}</th>
                    <th>{isTe ? "విభాగం" : "Offering Type"}</th>
                  </tr>
                </thead>
                <tbody>
                  {templeInfo.prasadamInfo.map((p, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: "600" }}>{isTe ? p.nameTe : p.nameEn}</td>
                      <td><span className="price-badge" style={{ background: "rgba(234, 88, 12, 0.15)", color: "#f97316", border: "1px solid rgba(249, 115, 22, 0.3)" }}>{isTe ? p.typeTe : p.typeEn}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-title-group">
              <div className="card-icon-box" style={{ background: "rgba(34, 197, 94, 0.2)", color: "#4ade80" }}>
                <Award size={22} />
              </div>
              <h3>{isTe ? "అన్నదానం & శాశ్వత నిత్యాన్నదాన పథకం" : "Nitya Annadanam Trust"}</h3>
            </div>
            <p style={{ fontSize: "0.93rem", color: "#f1f5f9", lineHeight: "1.7" }}>
              {isTe
                ? "మార్గశిర సుబ్రహ్మణ్య షష్ఠి బ్రహ్మోత్సవాలు మరియు ప్రతి మాస షష్ఠి రోజున దేవాలయంలో విచ్చేసిన వేలాది భక్తులకు ఉచిత నిత్యాన్నదానం నిర్వహించబడుతుంది. దాతలు విరాళాల కొరకు సచివాలయం లేదా దేవాదాయ శాఖ ఆలయ అధికారులను సంప్రదించగలరు."
                : "Free Annadanam (sacred food distribution) is conducted for thousands of devotees during Subrahmanya Shashti Brahmotsavam and monthly Shashti days."}
            </p>
          </div>
        </div>
      )}

      {/* Sub-Tab 6: Timings & Pilgrim Transport */}
      {activeSubTab === "timings" && (
        <div className="grid-2">
          <div className="card">
            <div className="card-title-group">
              <div className="card-icon-box" style={{ background: "rgba(234, 88, 12, 0.25)", color: "var(--divine-saffron)" }}>
                <Clock size={22} />
              </div>
              <h3>{isTe ? "స్వామి వారి రోజువారీ దర్శన వేళలు" : "Daily Darshan Schedule"}</h3>
            </div>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>{isTe ? "సమయం / సేవ" : "Session / Seva"}</th>
                    <th>{isTe ? "వేళలు" : "Timings"}</th>
                  </tr>
                </thead>
                <tbody>
                  {templeInfo.timings.map((tm, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: "600" }}>{isTe ? tm.sessionTe : tm.sessionEn}</td>
                      <td><span className="price-badge">{tm.time}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-title-group">
              <div className="card-icon-box">
                <Compass size={22} />
              </div>
              <h3>{isTe ? "నడిపూడి క్షేత్రానికి చేరుకునే మార్గాలు" : "How to Reach Nadipudi Temple"}</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.9rem" }}>
              {templeInfo.howToReach.map((way, idx) => (
                <div key={idx} style={{ background: "rgba(34, 197, 94, 0.12)", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(74, 222, 128, 0.3)" }}>
                  <strong style={{ color: "#4ade80" }}>🚍 {isTe ? way.modeTe : way.modeEn}:</strong>{" "}
                  <span style={{ color: "#f1f5f9" }}>{isTe ? way.descTe : way.descEn}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dynamic QR Code Modal */}
      <TempleMediaQRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        lang={lang}
      />

      {/* Mobile Media Upload Modal */}
      <TempleMediaUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onMediaAdded={handleMediaAdded}
        lang={lang}
      />

      {/* Video / Photo High-Definition Lightbox Player */}
      <TempleMediaLightbox
        item={selectedLightboxItem}
        onClose={() => setSelectedLightboxItem(null)}
        lang={lang}
      />
    </div>
  );
}

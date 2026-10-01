import React, { useState, useRef } from "react";
import {
  X,
  Camera,
  Link as LinkIcon,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Globe,
  Smartphone
} from "lucide-react";
import {
  compressImageFile,
  convertVideoToDataUrl,
  parseMediaUrl,
  saveLocalMediaItem,
  syncMediaToGitHub
} from "../utils/templeMediaStorage";

export default function TempleMediaUploadModal({ isOpen, onClose, onMediaAdded, lang }) {
  const isTe = lang === "te";

  // Tab: "file" (Photo/Video capture/upload) or "link" (YouTube / Drive / Web URL)
  const [activeMode, setActiveMode] = useState("file");
  const [mediaType, setMediaType] = useState("photo"); // "photo" or "video"

  // Form Fields
  const [titleTe, setTitleTe] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [category, setCategory] = useState("darshan");
  const [contributor, setContributor] = useState("");
  const [descTe, setDescTe] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  // Media Data & Previews
  const [mediaDataUrl, setMediaDataUrl] = useState("");
  const [mediaFileName, setMediaFileName] = useState("");
  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const [parsedEmbedUrl, setParsedEmbedUrl] = useState("");

  // UI States
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // GitHub Auto-Publish State
  const [showGitHubSync, setShowGitHubSync] = useState(false);
  const [githubToken, setGithubToken] = useState(() => {
    return typeof window !== "undefined" ? localStorage.getItem("nadipudi_gh_token") || "" : "";
  });
  const [syncStatus, setSyncStatus] = useState("");

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Handle Photo or Video Selection / Camera Capture
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg("");
    setIsProcessing(true);
    setMediaFileName(file.name);

    try {
      if (file.type.startsWith("image/")) {
        setMediaType("photo");
        // Compress client-side for rapid loading & smooth storage
        const compressed = await compressImageFile(file, 1600, 0.85);
        setMediaDataUrl(compressed);
        setPreviewThumbnail(compressed);
      } else if (file.type.startsWith("video/")) {
        setMediaType("video");
        // Limit local video size to ~35MB to prevent memory exhaustion
        if (file.size > 40 * 1024 * 1024) {
          setErrorMsg(
            isTe
              ? "వీడియో పరిమాణం 40MB కన్నా తక్కువగా ఉండాలి. పెద్ద వీడియోలను యూట్యూబ్‌లో అప్‌లోడ్ చేసి ఆ లింక్ ఇక్కడ జతచేయండి."
              : "Video file is larger than 40MB. For large recordings, upload to YouTube and paste the link."
          );
          setIsProcessing(false);
          return;
        }
        const dataUrl = await convertVideoToDataUrl(file);
        setMediaDataUrl(dataUrl);
        setPreviewThumbnail("");
      } else {
        setErrorMsg(isTe ? "దయచేసి ఫోటో లేదా వీడియో ఫైల్‌ను మాత్రమే ఎంచుకోండి." : "Please select an image or video file.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(isTe ? "ఫైల్ ప్రాసెస్ చేయడంలో లోపం సంభవించింది." : "Error processing file: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Link input change (YouTube / Drive / MP4)
  const handleLinkChange = (url) => {
    setLinkUrl(url);
    setErrorMsg("");
    if (!url.trim()) {
      setParsedEmbedUrl("");
      setPreviewThumbnail("");
      return;
    }
    const parsed = parseMediaUrl(url);
    setParsedEmbedUrl(parsed.embedUrl);
    setPreviewThumbnail(parsed.thumbnail || "");
    if (parsed.type === "youtube" || parsed.type === "video_url" || parsed.type === "gdrive") {
      setMediaType("video");
    } else {
      setMediaType("photo");
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const hasMedia = activeMode === "file" ? !!mediaDataUrl : !!parsedEmbedUrl;
    if (!hasMedia) {
      setErrorMsg(
        isTe ? "దయచేసి ఒక ఫోటో లేదా వీడియోను ఎంచుకోండి లేదా లింక్ నమోదు చేయండి." : "Please upload a photo/video or enter a link."
      );
      return;
    }

    if (!titleTe && !titleEn) {
      setErrorMsg(isTe ? "దయచేసి శీర్షికను నమోదు చేయండి." : "Please enter a title.");
      return;
    }

    const categoriesMap = {
      darshan: { te: "మూలవిరాట్ దర్శనం", en: "Deity Darshan" },
      festival: { te: "బ్రహ్మోత్సవాలు & రథోత్సవం", en: "Festivals & Rathotsavam" },
      puja: { te: "పూజలు & అభిషేకాలు", en: "Pujas & Homam" },
      architecture: { te: "ఆలయ ప్రాంగణం & గోపురం", en: "Architecture & Gopuram" }
    };

    const newItem = {
      id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: mediaType,
      titleTe: titleTe.trim() || titleEn.trim(),
      titleEn: titleEn.trim() || titleTe.trim(),
      mediaUrl: activeMode === "file" ? mediaDataUrl : parsedEmbedUrl,
      thumbnail: previewThumbnail || (mediaType === "photo" ? mediaDataUrl : ""),
      category: category,
      categoryTe: categoriesMap[category]?.te || "భక్తుల సమర్పణ",
      categoryEn: categoriesMap[category]?.en || "Devotee Contribution",
      contributor: contributor.trim() || (isTe ? "నడిపూడి భక్తులు" : "Nadipudi Devotees"),
      date: new Date().toISOString().split("T")[0],
      descTe: descTe.trim(),
      descEn: descTe.trim(),
      isLocal: true,
      timestamp: Date.now()
    };

    setIsProcessing(true);

    try {
      // 1. Save directly to IndexedDB (Instant client persistence with full video & photo playback)
      await saveLocalMediaItem(newItem);

      // 2. If GitHub Auto-Publish Token is provided, sync directly to GitHub Pages repository!
      if (githubToken.trim()) {
        setSyncStatus(isTe ? "GitHub కి అప్‌లోడ్ అవుతోంది..." : "Syncing to GitHub Pages...");
        localStorage.setItem("nadipudi_gh_token", githubToken.trim());
        try {
          await syncMediaToGitHub({
            token: githubToken.trim(),
            itemToAdd: newItem
          });
          setSyncStatus(
            isTe
              ? "✅ GitHub కి విజయవంతంగా సింక్ చేయబడింది! 1 నిమిషంలో లైవ్ వెబ్‌సైట్‌లో కనిపిస్తుంది."
              : "✅ Synced to GitHub Pages! Will be live for everyone in ~1 minute."
          );
        } catch (syncErr) {
          console.warn("GitHub sync error:", syncErr);
          setSyncStatus(
            isTe
              ? `⚠️ లోకల్‌గా భద్రపరచబడింది, కానీ GitHub సింక్ విఫలమైంది: ${syncErr.message}`
              : `⚠️ Saved locally, but GitHub sync failed: ${syncErr.message}`
          );
        }
      }

      setSuccessMsg(
        isTe
          ? "✨ మీ ఫోటో/వీడియో విజయవంతంగా ఆలయ మాలికలో చేర్చబడింది!"
          : "✨ Successfully added to Subramanyeswara Temple Gallery!"
      );

      if (onMediaAdded) {
        onMediaAdded(newItem);
      }

      // Reset form after short delay
      setTimeout(() => {
        setIsProcessing(false);
        onClose();
      }, 1600);
    } catch (err) {
      console.error(err);
      setErrorMsg(isTe ? "భద్రపరచడంలో లోపం సంభవించింది: " + err.message : "Failed to save: " + err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.88)",
        backdropFilter: "blur(10px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px"
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          maxWidth: "600px",
          width: "100%",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "linear-gradient(135deg, rgba(10, 25, 18, 0.96), rgba(6, 15, 11, 0.98))",
          border: "2px solid rgba(234, 88, 12, 0.6)",
          boxShadow: "0 24px 70px rgba(0, 0, 0, 0.9)",
          borderRadius: "20px",
          padding: "24px",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "rgba(255, 255, 255, 0.1)",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(234, 88, 12, 0.2)",
              color: "var(--divine-saffron)",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "0.85rem",
              fontWeight: "700",
              marginBottom: "8px",
              border: "1px solid rgba(234, 88, 12, 0.4)"
            }}
          >
            <Smartphone size={16} />
            <span>{isTe ? "మొబైల్ మీడియా స్టూడియో" : "Mobile Media Studio"}</span>
          </div>

          <h3 style={{ fontSize: "1.45rem", color: "#ffffff", marginTop: "2px" }}>
            {isTe ? "శ్రీ సుబ్రహ్మణ్యేశ్వర స్వామి దేవాలయ దృశ్యాల సమర్పణ" : "Upload Temple Photos & Videos"}
          </h3>
          <p style={{ fontSize: "0.86rem", color: "#cbd5e1", marginTop: "4px" }}>
            {isTe
              ? "ఫోన్ కెమెరా నుండి ఫోటోలు, వీడియో క్లిప్‌లు లేదా యూట్యూబ్ లింక్‌లను సులభంగా జతచేయండి"
              : "Directly capture photos, record video clips, or paste YouTube links"}
          </p>
        </div>

        {/* Input Mode Switcher */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            background: "rgba(0, 0, 0, 0.4)",
            padding: "4px",
            borderRadius: "12px",
            marginBottom: "20px",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}
        >
          <button
            type="button"
            onClick={() => setActiveMode("file")}
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              background: activeMode === "file" ? "#ea580c" : "transparent",
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "0.88rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            <Camera size={18} />
            <span>{isTe ? "ఫోన్ కెమెరా / ఫైల్" : "Camera / File"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode("link")}
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              background: activeMode === "link" ? "#ea580c" : "transparent",
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "0.88rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            <LinkIcon size={18} />
            <span>{isTe ? "యూట్యూబ్ / లింక్" : "YouTube / Link"}</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* File Upload Mode */}
          {activeMode === "file" && (
            <div style={{ marginBottom: "20px" }}>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*,video/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: "2px dashed rgba(234, 88, 12, 0.5)",
                  borderRadius: "16px",
                  padding: "24px 16px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: "rgba(0, 0, 0, 0.4)",
                  transition: "all 0.2s ease"
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "rgba(234, 88, 12, 0.2)",
                    color: "var(--divine-saffron)",
                    marginBottom: "12px"
                  }}
                >
                  <Upload size={28} />
                </div>
                <div style={{ fontWeight: "700", color: "#ffffff", fontSize: "1rem", marginBottom: "4px" }}>
                  {isTe ? "ఫోటో లేదా వీడియో ఎంచుకోండి" : "Choose or Snap Photo / Video"}
                </div>
                <p style={{ fontSize: "0.82rem", color: "#cbd5e1" }}>
                  {isTe
                    ? "కెమెరాతో నేరుగా ఫోటో తీయండి లేదా గ్యాలరీ నుండి ఎంచుకోండి (JPG, PNG, MP4, WebM)"
                    : "Tap to capture from camera or browse gallery (Images & Videos)"}
                </p>
                {mediaFileName && (
                  <div
                    style={{
                      marginTop: "12px",
                      display: "inline-block",
                      background: "rgba(34, 197, 94, 0.2)",
                      color: "#4ade80",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      fontWeight: "600"
                    }}
                  >
                    ✓ {mediaFileName}
                  </div>
                )}
              </div>

              {/* Media Preview */}
              {mediaDataUrl && (
                <div style={{ marginTop: "14px", borderRadius: "12px", overflow: "hidden", border: "1.5px solid #ea580c" }}>
                  {mediaType === "photo" ? (
                    <img
                      src={mediaDataUrl}
                      alt="Upload Preview"
                      style={{ width: "100%", maxHeight: "240px", objectFit: "contain", background: "#000", display: "block" }}
                    />
                  ) : (
                    <video
                      src={mediaDataUrl}
                      controls
                      playsInline
                      style={{ width: "100%", maxHeight: "240px", background: "#000", display: "block" }}
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Link Mode (YouTube / Drive) */}
          {activeMode === "link" && (
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "0.86rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px" }}>
                {isTe ? "వీడియో లింక్ (యూట్యూబ్ / గూగుల్ డ్రైవ్ / MP4 లింక్):" : "Video URL (YouTube / Google Drive / MP4 Link):"}
              </label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => handleLinkChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or shorts/..."
                className="input-field"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  background: "rgba(0, 0, 0, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  fontSize: "0.9rem"
                }}
              />
              <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "4px" }}>
                {isTe
                  ? "యూట్యూబ్ వీడియోలు, యూట్యూబ్ షార్ట్స్ లేదా డైరెక్ట్ MP4 లింక్‌లు ఆటోమేటిక్‌గా ప్రదర్శించబడతాయి."
                  : "Supports YouTube standard videos, YouTube Shorts, Google Drive view links, and MP4 URLs."}
              </p>

              {/* Embed Preview */}
              {parsedEmbedUrl && (
                <div style={{ marginTop: "12px", borderRadius: "12px", overflow: "hidden", border: "1.5px solid #ea580c" }}>
                  <iframe
                    src={parsedEmbedUrl}
                    title="Video Preview"
                    allowFullScreen
                    style={{ width: "100%", height: "200px", border: "none", display: "block" }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Metadata Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.84rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "4px" }}>
                {isTe ? "శీర్షిక (తెలుగులో):" : "Title (Telugu):"} *
              </label>
              <input
                type="text"
                value={titleTe}
                onChange={(e) => setTitleTe(e.target.value)}
                placeholder={isTe ? "ఉదా: మార్గశిర షష్ఠి రథోత్సవ దృశ్యం" : "e.g. Margasira Shashti Rathotsavam"}
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  background: "rgba(0, 0, 0, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#ffffff",
                  fontSize: "0.9rem"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.84rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "4px" }}>
                {isTe ? "ఆంగ్ల శీర్షిక (Title in English):" : "Title (English):"}
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Divine Darshan Video"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  background: "rgba(0, 0, 0, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#ffffff",
                  fontSize: "0.9rem"
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.84rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "4px" }}>
                  {isTe ? "విభాగం:" : "Category:"}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: "#071710",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#ffffff",
                    fontSize: "0.88rem"
                  }}
                >
                  <option value="darshan">{isTe ? "మూలవిరాట్ దర్శనం" : "Deity Darshan"}</option>
                  <option value="festival">{isTe ? "ఉత్సవాలు & రథోత్సవం" : "Festivals & Rathotsavam"}</option>
                  <option value="puja">{isTe ? "పూజలు & అభిషేకాలు" : "Pujas & Homam"}</option>
                  <option value="architecture">{isTe ? "ఆలయ నిర్మాణం & గోపురం" : "Architecture & Gopuram"}</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.84rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "4px" }}>
                  {isTe ? "సమర్పించిన వారు:" : "Contributor:"}
                </label>
                <input
                  type="text"
                  value={contributor}
                  onChange={(e) => setContributor(e.target.value)}
                  placeholder={isTe ? "భక్తుని పేరు / కమిటీ" : "Devotee Name / Committee"}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: "rgba(0, 0, 0, 0.5)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#ffffff",
                    fontSize: "0.88rem"
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.84rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "4px" }}>
                {isTe ? "వివరాలు / భక్తి సందేశం (ఐచ్ఛికం):" : "Description (Optional):"}
              </label>
              <textarea
                value={descTe}
                onChange={(e) => setDescTe(e.target.value)}
                rows={2}
                placeholder={isTe ? "పూజ లేదా ఉత్సవ విశేషాలు..." : "Notes about the ritual or celebration..."}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  background: "rgba(0, 0, 0, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#ffffff",
                  fontSize: "0.88rem",
                  resize: "vertical"
                }}
              />
            </div>
          </div>

          {/* Optional GitHub Auto-Publish Settings Toggle */}
          <div
            style={{
              marginBottom: "18px",
              background: "rgba(255, 255, 255, 0.04)",
              borderRadius: "12px",
              padding: "12px 14px",
              border: "1px solid rgba(255, 255, 255, 0.1)"
            }}
          >
            <div
              onClick={() => setShowGitHubSync(!showGitHubSync)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                fontSize: "0.84rem",
                fontWeight: "600",
                color: "#fde047"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Globe size={16} />
                <span>{isTe ? "🌐 GitHub Pages కి నేరుగా పబ్లిష్ చేయాలా? (ఐచ్ఛికం)" : "🌐 Auto-Publish to GitHub Pages (Optional)"}</span>
              </div>
              <span>{showGitHubSync ? "▲" : "▼"}</span>
            </div>

            {showGitHubSync && (
              <div style={{ marginTop: "10px", fontSize: "0.8rem", color: "#cbd5e1" }}>
                <p style={{ marginBottom: "6px" }}>
                  {isTe
                    ? "మీ GitHub Personal Access Token నమోదు చేస్తే, ఈ ఫోన్ నుండే సైట్‌లోకి శాశ్వతంగా అప్‌లోడ్ అవుతుంది (PC తో పనిలేదు)."
                    : "Enter your GitHub Personal Access Token to commit directly from phone without using PC."}
                </p>
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "6px",
                    background: "#000",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "#ffffff",
                    fontSize: "0.82rem"
                  }}
                />
              </div>
            )}
          </div>

          {/* Status & Error Messages */}
          {errorMsg && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 14px",
                background: "rgba(220, 38, 38, 0.2)",
                color: "#f87171",
                borderRadius: "10px",
                fontSize: "0.85rem",
                marginBottom: "14px",
                border: "1px solid rgba(220, 38, 38, 0.4)"
              }}
            >
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 14px",
                background: "rgba(34, 197, 94, 0.2)",
                color: "#4ade80",
                borderRadius: "10px",
                fontSize: "0.85rem",
                marginBottom: "14px",
                border: "1px solid rgba(34, 197, 94, 0.4)"
              }}
            >
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          {syncStatus && (
            <div
              style={{
                fontSize: "0.82rem",
                color: "#fde047",
                padding: "8px 12px",
                background: "rgba(234, 88, 12, 0.15)",
                borderRadius: "8px",
                marginBottom: "14px"
              }}
            >
              {syncStatus}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              style={{
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                background: "rgba(255, 255, 255, 0.08)",
                color: "#ffffff",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              {isTe ? "రద్దు చేయి" : "Cancel"}
            </button>

            <button
              type="submit"
              disabled={isProcessing}
              style={{
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #ea580c, #c2410c)",
                color: "#ffffff",
                fontWeight: "700",
                cursor: isProcessing ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 6px 20px rgba(234, 88, 12, 0.5)"
              }}
            >
              <Sparkles size={18} />
              <span>
                {isProcessing
                  ? (isTe ? "జతచేయబడుతోంది..." : "Saving...")
                  : (isTe ? "ఆలయ మాలికలో చేర్చు" : "Add to Gallery")}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

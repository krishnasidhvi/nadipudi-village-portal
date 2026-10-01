import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Copy, Check, Share2, Smartphone, Sparkles } from "lucide-react";

export default function TempleMediaQRModal({ isOpen, onClose, lang }) {
  const isTe = lang === "te";
  const [copied, setCopied] = useState(false);
  const [urlMode, setUrlMode] = useState("public"); // "public" or "local"

  if (!isOpen) return null;

  const publicUrl = "https://krishnasidhvi.github.io/nadipudi-village-portal/?tab=temple&action=upload";
  const localUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/nadipudi-village-portal/?tab=temple&action=upload` 
    : publicUrl;

  const targetUrl = urlMode === "public" ? publicUrl : localUrl;

  const handleCopy = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `నడిపూడి శ్రీ సుబ్రహ్మణ్యేశ్వర స్వామి దేవాలయ ఫోటోలు మరియు వీడియోలు నేరుగా ఫోన్ నుండి అప్‌లోడ్ చేయడానికి ఈ లింక్ క్లిక్ చేయండి:\n${targetUrl}`
  )}`;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(8px)",
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
          maxWidth: "540px",
          width: "100%",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "linear-gradient(135deg, rgba(14, 30, 22, 0.95), rgba(7, 18, 13, 0.98))",
          border: "2px solid rgba(234, 88, 12, 0.6)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.85)",
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

        {/* Modal Header */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
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
            <span>{isTe ? "మొబైల్ ఫోన్ QR కోడ్" : "Mobile Phone QR Code"}</span>
          </div>

          <h3 style={{ fontSize: "1.45rem", color: "#ffffff", marginTop: "4px" }}>
            {isTe ? "ఫోన్ నుండి ఫోటోలు & వీడియోలు జోడించండి" : "Add Photos & Videos from Phone"}
          </h3>
          <p style={{ fontSize: "0.88rem", color: "#cbd5e1", marginTop: "6px" }}>
            {isTe
              ? "కంప్యూటర్‌తో పనిలేకుండా మీ స్మార్ట్‌ఫోన్ కెమెరాతో నేరుగా ఆలయ దృశ్యాలను అప్‌లోడ్ చేయండి"
              : "Scan this QR code with your mobile camera to snap and upload directly from phone"}
          </p>
        </div>

        {/* QR Code Container with Saffron Glow */}
        <div
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px auto",
            maxWidth: "240px",
            boxShadow: "0 8px 30px rgba(234, 88, 12, 0.45)",
            border: "4px solid #ea580c"
          }}
        >
          <QRCodeSVG
            value={targetUrl}
            size={200}
            level="H"
            includeMargin={true}
          />
          <div style={{ marginTop: "8px", fontSize: "0.75rem", color: "#1e293b", fontWeight: "700", textAlign: "center" }}>
            {urlMode === "public" ? "🌐 Live GitHub Pages Portal" : "💻 Local Dev Server"}
          </div>
        </div>

        {/* URL Target Selector Toggle */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "18px" }}>
          <button
            onClick={() => setUrlMode("public")}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "0.78rem",
              fontWeight: "600",
              cursor: "pointer",
              background: urlMode === "public" ? "#ea580c" : "rgba(255, 255, 255, 0.08)",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.15)"
            }}
          >
            🌐 {isTe ? "పబ్లిక్ వెబ్‌సైట్ లింక్ (సిఫార్సు)" : "Public Live URL"}
          </button>
          <button
            onClick={() => setUrlMode("local")}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "0.78rem",
              fontWeight: "600",
              cursor: "pointer",
              background: urlMode === "local" ? "#ea580c" : "rgba(255, 255, 255, 0.08)",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.15)"
            }}
          >
            💻 {isTe ? "స్థానిక నెట్‌వర్క్ (Local)" : "Local Host"}
          </button>
        </div>

        {/* Action Buttons: WhatsApp & Copy Link */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px",
              borderRadius: "10px",
              background: "#25D366",
              color: "#ffffff",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "0.85rem",
              boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)"
            }}
          >
            <Share2 size={16} />
            <span>{isTe ? "WhatsApp కి పంపండి" : "Share to WhatsApp"}</span>
          </a>

          <button
            onClick={handleCopy}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px",
              borderRadius: "10px",
              background: copied ? "#16a34a" : "rgba(255, 255, 255, 0.12)",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "0.85rem"
            }}
          >
            {copied ? <Check size={16} color="#4ade80" /> : <Copy size={16} />}
            <span>{copied ? (isTe ? "కాపీ చేయబడింది!" : "Copied!") : (isTe ? "లింక్ కాపీ చేయండి" : "Copy Link")}</span>
          </button>
        </div>

        {/* Simple 3-Step Instruction Guide */}
        <div
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            borderRadius: "12px",
            padding: "14px 16px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            fontSize: "0.84rem",
            color: "#e2e8f0"
          }}
        >
          <div style={{ fontWeight: "700", color: "#fde047", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Sparkles size={16} />
            <span>{isTe ? "సులభమైన 3 దశలు (Simple Steps):" : "How to use:"}</span>
          </div>
          <ol style={{ paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "6px", lineHeight: "1.5" }}>
            <li>
              {isTe
                ? "మీ మొబైల్ కెమెరా ఆన్ చేసి పై QR కోడ్ వైపు చూపించండి."
                : "Point your phone camera at the QR code above."}
            </li>
            <li>
              {isTe
                ? "స్క్రీన్‌పై కనిపించిన లింక్‌ను నొక్కి మొబైల్ అప్‌లోడ్ పేజీని తెరవండి."
                : "Tap the link pop-up on your phone to open the uploader."}
            </li>
            <li>
              {isTe
                ? "ఫోటో తీయండి లేదా వీడియో ఎంచుకుని 'సమర్పించు' నొక్కండి. క్షణాల్లో పోర్టల్‌లో ప్రత్యక్షమవుతాయి!"
                : "Snap a photo, choose video, or enter video link and submit!"}
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Download, Smartphone, X, CheckCircle2 } from "lucide-react";

export default function AppInstallBanner({ lang, t }) {
  const isTe = lang === "te";
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setShowBanner(false);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  if (!showBanner || isInstalled) return null;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0e5e38 0%, #15803d 100%)",
        color: "#ffffff",
        padding: "12px 16px",
        borderRadius: "14px",
        marginBottom: "16px",
        display: "flex",
        alignItems: "center",
        justify: "space-between",
        boxShadow: "0 4px 14px rgba(14, 94, 56, 0.3)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ background: "rgba(255, 255, 255, 0.2)", padding: "8px", borderRadius: "10px" }}>
          <Smartphone size={22} />
        </div>
        <div>
          <strong style={{ fontSize: "0.95rem", display: "block" }}>
            📲 {isTe ? "నడిపూడి గ్రామ ఆండ్రాయిడ్ యాప్" : "Nadipudi Village Android App"}
          </strong>
          <span style={{ fontSize: "0.8rem", opacity: 0.9 }}>
            {isTe ? "ఒక్క క్లిక్‌తో మీ ఫోన్‌లో యాప్‌ను ఇన్స్టాల్ చేసుకోండి" : "Install directly onto your home screen"}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          onClick={handleInstallClick}
          className="btn-primary"
          style={{ background: "#ffffff", color: "#0e5e38", padding: "6px 12px", fontSize: "0.82rem", fontWeight: 700 }}
        >
          <Download size={14} />
          <span>{isTe ? "ఇన్‌స్టాల్" : "Install"}</span>
        </button>
        <button
          onClick={() => setShowBanner(false)}
          style={{ background: "transparent", border: "none", color: "white", cursor: "pointer", opacity: 0.8 }}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

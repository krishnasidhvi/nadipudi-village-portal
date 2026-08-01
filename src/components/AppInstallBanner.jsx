import React, { useState, useEffect } from "react";
import { Download, Smartphone, X, Apple } from "lucide-react";

export default function AppInstallBanner({ lang }) {
  const isTe = lang === "te";
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect iOS devices (iPhone / iPad)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone = window.navigator.standalone || window.matchMedia("(display-mode: standalone)").matches;

    if (iosDevice && !isStandalone) {
      setIsIOS(true);
      setShowBanner(true);
    }

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
          {isIOS ? <Apple size={22} /> : <Smartphone size={22} />}
        </div>
        <div>
          <strong style={{ fontSize: "0.95rem", display: "block" }}>
            {isIOS ? " iPhone / iPad యాప్ ఇన్‌స్టాల్" : "📲 నడిపూడి గ్రామ ఆండ్రాయిడ్ యాప్"}
          </strong>
          <span style={{ fontSize: "0.8rem", opacity: 0.9 }}>
            {isIOS
              ? isTe
                ? "Safari లో క్రింద షేర్ 📤 నొక్కి 'Add to Home Screen' ఎంచుకోండి"
                : "Tap Share 📤 in Safari & select 'Add to Home Screen'"
              : isTe
              ? "ఒక్క క్లిక్‌తో మీ ఫోన్‌లో యాప్‌ను ఇన్స్టాల్ చేసుకోండి"
              : "Install directly onto your home screen"}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {!isIOS && (
          <button
            onClick={handleInstallClick}
            className="btn-primary"
            style={{ background: "#ffffff", color: "#0e5e38", padding: "6px 12px", fontSize: "0.82rem", fontWeight: 700 }}
          >
            <Download size={14} />
            <span>{isTe ? "ఇన్‌స్టాల్" : "Install"}</span>
          </button>
        )}
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

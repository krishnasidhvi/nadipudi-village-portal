import React, { useState, useEffect, useRef } from "react";
import { HelpCircle, X, Send, Volume2, VolumeX, ArrowRight } from "lucide-react";
import { penugondaPaddy, river, formatDate, formatDateTime, rupees } from "../utils/liveData";

// A simple keyword-matched help guide (not an AI model). It answers only from
// data the site actually holds, and otherwise points to the right page.
export default function AiAssistantWidget({ lang, setActiveTab }) {
  const isTe = lang === "te";
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);

  const initialGreeting = isTe
    ? "నమస్కారం! ఇది నడిపూడి వేదిక త్వరిత సహాయం. ఆలయం, ధాన్యం ధరలు, అత్యవసర నంబర్లు లేదా ప్రభుత్వ పథకాల గురించి అడగండి — సరైన పేజీకి దారి చూపిస్తాను."
    : "Namaste! This is the Nadipudi portal quick help. Ask about the temple, paddy prices, emergency numbers or government schemes and I will point you to the right page.";

  const [chatHistory, setChatHistory] = useState([
    {
      sender: "ai",
      text: initialGreeting,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      actionTab: null
    }
  ]);

  const quickQuestions = isTe
    ? [
        { label: "🛕 ఆలయ దర్శనం సమయాలు?", query: "స్వామి వారి దర్శనం వేళలు ఏమిటి?", targetTab: "temple" },
        { label: "🌾 ధాన్యం ధర?", query: "ధాన్యం మార్కెట్ ధర ఎంత?", targetTab: "agri" },
        { label: "📞 అత్యవసర నంబర్లు?", query: "అత్యవసర ఫోన్ నంబర్లు కావాలి", targetTab: "directory" },
        { label: "📜 ప్రభుత్వ పథకాలు?", query: "ప్రభుత్వ పథకాల వివరాలు ఏమిటి?", targetTab: "schemes" }
      ]
    : [
        { label: "🛕 Temple timings?", query: "What are the temple darshan timings?", targetTab: "temple" },
        { label: "🌾 Paddy price?", query: "What is the paddy mandi price?", targetTab: "agri" },
        { label: "📞 Emergency numbers?", query: "Show me emergency phone numbers", targetTab: "directory" },
        { label: "📜 Govt schemes?", query: "What are the government schemes?", targetTab: "schemes" }
      ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatHistory, isOpen]);

  // Keyword matching. Answers quote only real, dated data from the site.
  const generateAnswer = (query) => {
    const q = query.toLowerCase();
    const has = (...words) => words.some((w) => q.includes(w));

    if (has("దర్శనం", "ఆలయం", "స్వామి", "పూజ", "temple", "darshan", "timing", "puja", "festival")) {
      return {
        text: isTe
          ? "దర్శన వేళలు, పూజలు, ఉత్సవాలు మరియు ఆలయానికి చేరుకునే మార్గాలు ఆలయం పేజీలో ఉన్నాయి."
          : "Darshan timings, pujas, festivals and how to reach the temple are on the Temple page.",
        actionTab: "temple"
      };
    }

    if (has("ధాన్యం", "వరి", "ధర", "మండి", "మార్కెట్", "paddy", "price", "mandi", "market")) {
      const text = penugondaPaddy
        ? isTe
          ? `పెనుగొండ మార్కెట్‌లో ${formatDate(penugondaPaddy.date, lang)} న నివేదించిన ధాన్యం (${penugondaPaddy.variety}) సాధారణ ధర క్వింటాలుకు ${rupees(penugondaPaddy.modal)} (మూలం: Agmarknet). ఇతర మార్కెట్ల ధరలు వ్యవసాయం పేజీలో ఉన్నాయి.`
          : `Paddy (${penugondaPaddy.variety}) at Penugonda market was reported at a modal price of ${rupees(penugondaPaddy.modal)} per quintal on ${formatDate(penugondaPaddy.date, lang)} (source: Agmarknet). Other markets are on the Agriculture page.`
        : isTe
          ? "పెనుగొండ మార్కెట్ ఇటీవల ధర నివేదించలేదు. సమీప మార్కెట్ల ధరలు వ్యవసాయం పేజీలో చూడండి."
          : "Penugonda market has not reported a recent price. See nearby markets on the Agriculture page.";
      return { text, actionTab: "agri" };
    }

    if (has("వాతావరణ", "వర్షం", "గోదావరి", "నీటిమట్టం", "వరద", "weather", "rain", "river", "godavari", "flood", "barrage")) {
      return {
        text: isTe
          ? `ధవళేశ్వరం బ్యారేజ్ వద్ద గోదావరి నీటిమట్టం ${river.latest.level.toFixed(2)} మీటర్లు (${formatDateTime(river.latest.time, lang)}, మూలం: CWC). వాతావరణ అంచనా వ్యవసాయం పేజీలో ఉంది.`
          : `The Godavari level at Dowleswaram barrage was ${river.latest.level.toFixed(2)} m (${formatDateTime(river.latest.time, lang)}, source: CWC). The weather forecast is on the Agriculture page.`,
        actionTab: "agri"
      };
    }

    if (has("ఫోన్", "నంబర్", "అత్యవసర", "అంబులెన్స్", "ఆంబులెన్స్", "పోలీసు", "అధికారి", "సచివాలయం", "contact", "phone", "number", "emergency", "ambulance", "police", "secretar", "directory")) {
      return {
        text: isTe
          ? "అత్యవసరం: 112 (అన్ని అత్యవసర సేవలు), 108 (ఆంబులెన్స్), 100 (పోలీసు), 1912 (విద్యుత్). సచివాలయ సిబ్బంది పేర్లు, ఫోన్ నంబర్లు ఇంకా నిర్ధారించబడలేదు — ఏ సేవకు ఎవరిని సంప్రదించాలో డైరెక్టరీ పేజీలో ఉంది."
          : "Emergency: 112 (all emergencies), 108 (ambulance), 100 (police), 1912 (electricity). Sachivalayam staff names and phone numbers are not confirmed yet — the Directory page shows who handles which service.",
        actionTab: "directory"
      };
    }

    if (has("పథకం", "పథకాల", "తల్లికి", "పింఛ", "రైతు", "scheme", "welfare", "pension", "annadat")) {
      return {
        text: isTe
          ? "రైతులు, విద్యార్థులు, పింఛన్లు, గృహ నిర్మాణ పథకాల అర్హతలు, కావలసిన పత్రాలు మరియు అధికారిక దరఖాస్తు లింకులు పథకాల పేజీలో ఉన్నాయి. మొత్తాలు మారుతుంటాయి — అధికారిక పోర్టల్‌లో సరిచూసుకోండి."
          : "Eligibility, documents and official application links for farmer, student, pension and housing schemes are on the Schemes page. Amounts change, so confirm on the official portal.",
        actionTab: "schemes"
      };
    }

    if (has("ఫిర్యాదు", "సమస్య", "అర్జీ", "grievance", "complain", "spandana", "pgrs")) {
      return {
        text: isTe
          ? "ఫిర్యాదులు అధికారిక PGRS / మీ కోసం పోర్టల్ ద్వారా లేదా గ్రామ సచివాలయంలో నమోదు చేయాలి. విధానం ఫిర్యాదుల పేజీలో ఉంది."
          : "Grievances are filed on the official PGRS / Mee Kosam portal or at the Grama Sachivalayam. The steps are on the Grievances page.",
        actionTab: "spandana"
      };
    }

    return {
      text: isTe
        ? "క్షమించండి, దీనికి నా దగ్గర సమాధానం లేదు. ఆలయం, ధాన్యం ధరలు, వాతావరణం, అత్యవసర నంబర్లు, పథకాలు లేదా ఫిర్యాదుల గురించి అడగండి."
        : "Sorry, I don't have an answer for that. Try asking about the temple, paddy prices, weather, emergency numbers, schemes or grievances.",
      actionTab: null
    };
  };

  const handleSendMsg = (customText = null, targetTab = null) => {
    const textToSend = customText || inputMsg;
    if (!textToSend.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newHistory = [...chatHistory, { sender: "user", text: textToSend, time: userTime }];
    setChatHistory(newHistory);
    setInputMsg("");

    setTimeout(() => {
      const response = generateAnswer(textToSend);
      const aiTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "ai",
          text: response.text,
          time: aiTime,
          actionTab: targetTab || response.actionTab
        }
      ]);
    }, 400);
  };

  // Text-To-Speech Synthesis Function for Rural Accessibility
  const handleSpeak = (text) => {
    if (!("speechSynthesis" in window)) {
      alert("Text to speech is not supported in your browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isTe ? "te-IN" : "en-US";
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right Corner) */}
      <div className="ai-widget-trigger-wrapper">
        <button
          className="ai-widget-fab"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isTe ? "త్వరిత సహాయం" : "Quick help"}
        >
          <HelpCircle size={26} />
          <span className="ai-fab-pulse"></span>
        </button>
      </div>

      {/* Floating Chat Modal Container */}
      {isOpen && (
        <div className="ai-widget-modal">
          {/* Header */}
          <div className="ai-widget-header">
            <div className="flex items-center gap-2">
              <div className="ai-header-avatar">
                <HelpCircle size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: "1rem", color: "#ffffff", fontWeight: "700" }}>
                  {isTe ? "నడిపూడి త్వరిత సహాయం" : "Nadipudi Quick Help"}
                </h4>
                <p style={{ fontSize: "0.75rem", color: "#4ade80", margin: "0" }}>
                  {isTe ? "సరైన పేజీకి దారి చూపే సహాయం" : "Points you to the right page"}
                </p>
              </div>
            </div>

            <button className="ai-close-btn" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="ai-widget-body">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`ai-chat-bubble-wrapper ${msg.sender === "user" ? "user-bubble" : "ai-bubble"}`}
              >
                <div className="ai-chat-bubble">
                  <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: "1.5" }}>{msg.text}</p>

                  <div className="ai-bubble-footer">
                    <span style={{ fontSize: "0.7rem", opacity: 0.7 }}>{msg.time}</span>

                    {msg.sender === "ai" && (
                      <button
                        className="ai-speak-btn"
                        onClick={() => handleSpeak(msg.text)}
                        title={isTe ? "గొంతుతో వినండి" : "Listen Audio"}
                      >
                        {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      </button>
                    )}
                  </div>

                  {/* One-Click Action Navigation Button */}
                  {msg.actionTab && (
                    <button
                      className="ai-action-nav-btn"
                      onClick={() => {
                        setActiveTab(msg.actionTab);
                        setIsOpen(false);
                      }}
                    >
                      <span>{isTe ? "విభాగానికి వెళ్ళండి" : "Open Tab"}</span>
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Pre-filled Question Chips */}
          <div className="ai-quick-chips">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                className="ai-chip-btn"
                onClick={() => handleSendMsg(q.query, q.targetTab)}
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Chat Input Field */}
          <div className="ai-widget-input-bar">
            <input
              type="text"
              className="ai-input"
              placeholder={isTe ? "మీ ప్రశ్న ఇక్కడ రాయండి..." : "Type your query here..."}
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMsg()}
            />
            <button className="ai-send-btn" onClick={() => handleSendMsg()}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

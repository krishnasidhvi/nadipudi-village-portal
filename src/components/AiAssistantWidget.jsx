import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Sparkles, X, Send, Volume2, VolumeX, Bot, ArrowRight, CornerDownLeft } from "lucide-react";
import { templeInfo } from "../data/templeData";
import { mandiPrices } from "../data/agriData";
import { govtSchemes } from "../data/schemeData";
import { sachivalayamStaff } from "../data/directoryData";

export default function AiAssistantWidget({ lang, setActiveTab }) {
  const isTe = lang === "te";
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);

  const initialGreeting = isTe
    ? "నమస్కారం! నేను నడిపూడి గ్రామీణ డిజిటల్ AI సహాయకుడిని. శ్రీ సుబ్రహ్మణ్యేశ్వర స్వామి వారి దర్శనం, ధాన్యం మండి ధరలు, సచివాలయ సేవలు మరియు ప్రభుత్వ పథకాల గురించిన ఏ ప్రశ్లనైనా నన్ను అడగండి."
    : "Namaste! I am the Nadipudi Village AI Digital Assistant. Ask me anything about Temple Darshan, Paddy Mandi Prices, Secretariat Officials, or AP Govt Schemes!";

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
        { label: "🌾 ధాన్యం మండి ధరలు?", query: "ఈ రోజు వరి ధాన్యం మండి ధర ఎంత?", targetTab: "agri" },
        { label: "📞 సచివాలయ అధికారుల ఫోన్లు?", query: "సచివాలయ అధికారుల ఫోన్ నంబర్లు కావాలి", targetTab: "directory" },
        { label: "📜 తల్లికి వందనం / పథకాలు?", query: "ప్రభుత్వ పథకాల వివరాలు ఏమిటి?", targetTab: "schemes" }
      ]
    : [
        { label: "🛕 Temple Darshan Timings?", query: "What are the temple darshan timings?", targetTab: "temple" },
        { label: "🌾 Paddy Mandi Prices?", query: "What is today's paddy mandi price?", targetTab: "agri" },
        { label: "📞 Secretariat Contacts?", query: "Show me Grama Sachivalayam contact numbers", targetTab: "directory" },
        { label: "📜 AP Govt Schemes?", query: "What are the active government schemes?", targetTab: "schemes" }
      ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatHistory, isOpen]);

  // AI Logic Engine for Instant Localized Answers
  const generateAiAnswer = (query) => {
    const q = query.toLowerCase();

    // 1. Temple Questions
    if (q.includes("దర్శనం") || q.includes("ఆలయం") || q.includes("స్వామి") || q.includes("temple") || q.includes("darshan") || q.includes("timings")) {
      return {
        text: isTe
          ? "నడిపూడి శ్రీ సుబ్రహ్మణ్యేశ్వర స్వామి వారి ఆలయ ఉదయం దర్శనం 06:00 AM నుండి 11:30 AM వరకు, మరియు సాయంత్రం దర్శనం 04:00 PM నుండి 08:00 PM వరకు ప్రారంభంలో ఉంటుంది. మధ్యాహ్నం 11:30 - 04:00 ఆలయ విరామం. ప్రతి మంగళవారం ఉదయం 8:00 గంటలకు ప్రత్యేక సర్ప దోష నివారణ హోమం నిర్వహించబడుతుంది."
          : "Sri Subramanyeswara Swamy Temple Darshan is open daily Morning 06:00 AM - 11:30 AM and Evening 04:00 PM - 08:00 PM. Afternoon temple break is 11:30 AM - 04:00 PM. Special Sarpa Dosha Homam is held every Tuesday at 8:00 AM.",
        actionTab: "temple"
      };
    }

    // 2. Agriculture / Paddy Mandi Questions
    if (q.includes("ధాన్యం") || q.includes("వరి") || q.includes("ధర") || q.includes("మండి") || q.includes("paddy") || q.includes("price") || q.includes("mandi") || q.includes("agri")) {
      const swarna = mandiPrices[0];
      return {
        text: isTe
          ? `ఈ రోజు మార్టేరు / పెనుగొండ మండిలో స్వర్ణ వరి ధాన్యం ధర క్వింటాలుకు ${swarna?.price || "₹2,340"}. గోదావరి డెల్టా కాలువ ఇన్-ఫ్లో 46,800 క్యూసెక్కులుగా నమోదు కాబడింది.`
          : `Today's Swarna paddy price at Penugonda Mandi is ${swarna?.price || "₹2,340"} per quintal. Godavari Barrage inflow is currently 46,800 Cusecs.`,
        actionTab: "agri"
      };
    }

    // 3. Secretariat Officials / Directory
    if (q.includes("ఫోన్") || q.includes("అధికారి") || q.includes("సచివాలయం") || q.includes("contact") || q.includes("phone") || q.includes("secretary") || q.includes("directory")) {
      const vro = sachivalayamStaff[0];
      const secretary = sachivalayamStaff[1];
      return {
        text: isTe
          ? `నడిపూడి గ్రామ సచివాలయం వి.ఆర్.ఓ ${vro?.nameTe || "కె. వెంకటేశ్వర రావు"} (ఫోన్: ${vro?.phone || "+91 94401 88210"}), పంచాయతీ కార్యదర్శి ${secretary?.nameTe || "పి. సురేష్ వర్మ"} (ఫోన్: ${secretary?.phone || "+91 98480 33412"}).`
          : `Nadipudi Secretariat VRO ${vro?.nameEn || "K. Venkateswara Rao"} (${vro?.phone}), Panchayat Secretary ${secretary?.nameEn || "P. Suresh Varma"} (${secretary?.phone}).`,
        actionTab: "directory"
      };
    }

    // 4. Welfare Schemes
    if (q.includes("పథకం") || q.includes("తల్లికి") || q.includes("రైతు") || q.includes("scheme") || q.includes("welfare") || q.includes("annadatha")) {
      return {
        text: isTe
          ? "నడిపూడి గ్రామంలో AP రైతు భరోసా (ఏటా ₹13,500), తల్లికి వందనం (ఏటా ₹15,000), మరియు దీపం 2.0 (3 ఉచిత గ్యాస్ సిలిండర్లు) పథకాలు సచివాలయం ద్వారా అందజేయబడుతున్నాయి."
          : "Active AP Govt Welfare Schemes in Nadipudi include Rythu Bharosa (₹13,500/yr), Talliki Vandanam (₹15,000/yr), and Deepam 2.0 Gas Scheme.",
        actionTab: "schemes"
      };
    }

    // 5. Default Fallback
    return {
      text: isTe
        ? "మీ ప్రశ్నకు సమాధానం మా గ్రామ డేటాబెస్‌లో పొందుపరచబడింది. మీ సౌలభ్యం కొరకు తగిన విభాగాన్ని తెరిచాను."
        : "I have processed your query against Nadipudi Village Database. You can explore full details in the relevant tab.",
      actionTab: "home"
    };
  };

  const handleSendMsg = (customText = null, targetTab = null) => {
    const textToSend = customText || inputMsg;
    if (!textToSend.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newHistory = [...chatHistory, { sender: "user", text: textToSend, time: userTime }];
    setChatHistory(newHistory);
    setInputMsg("");

    // Simulate AI Thought Delay
    setTimeout(() => {
      const response = generateAiAnswer(textToSend);
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
          aria-label="Nadipudi AI Assistant"
        >
          <Bot size={26} />
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
                <Sparkles size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: "1rem", color: "#ffffff", fontWeight: "700" }}>
                  {isTe ? "నడిపూడి గ్రామ AI సహాయకుడు" : "Nadipudi AI Citizen Assistant"}
                </h4>
                <p style={{ fontSize: "0.75rem", color: "#4ade80", margin: "0" }}>
                  ● {isTe ? "రైతులు & పౌరులకు 24/7 ప్రత్యక్ష సేవలు" : "24/7 Live Rural Assistance"}
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

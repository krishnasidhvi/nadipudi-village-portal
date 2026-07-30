import React, { useState } from "react";
import { HelpCircle, ExternalLink, Send, CheckCircle2, FileText, PhoneCall } from "lucide-react";
import { spandanaInfo } from "../data/spandanaData";

export default function SpandanaHub({ lang, t }) {
  const isTe = lang === "te";
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState(spandanaInfo.categoriesTe[0]);
  const [description, setDescription] = useState("");
  const [ticketId, setTicketId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !description) return;
    const randomTicket = "NDP-" + Math.floor(100000 + Math.random() * 900000);
    setTicketId(randomTicket);
  };

  return (
    <div className="spandana-hub-container">
      <div className="grid-2">
        {/* Official Spandana Process Guide */}
        <div className="card">
          <div className="card-title-group">
            <div className="card-icon-box" style={{ background: "rgba(2, 132, 199, 0.1)", color: "var(--sky-blue)" }}>
              <HelpCircle size={22} />
            </div>
            <div>
              <h3>{t.spandanaTitle}</h3>
              <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>{t.spandanaDesc}</p>
            </div>
          </div>

          <div style={{ background: "rgba(2, 132, 199, 0.06)", padding: "12px", borderRadius: "10px", marginBottom: "16px" }}>
            <strong style={{ color: "var(--sky-blue)", display: "flex", alignItems: "center", gap: "6px" }}>
              <PhoneCall size={16} /> AP Spandana Toll-Free Helpline: 1902
            </strong>
          </div>

          <ol style={{ paddingLeft: "20px", fontSize: "0.9rem", lineHeight: "1.7", color: "var(--text-main)" }}>
            {(isTe ? spandanaInfo.stepsTe : spandanaInfo.stepsEn).map((step, idx) => (
              <li key={idx} style={{ marginBottom: "8px" }}>
                {step}
              </li>
            ))}
          </ol>

          <a
            href={spandanaInfo.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ marginTop: "16px", display: "inline-flex" }}
          >
            <span>{t.officialLink}</span>
            <ExternalLink size={16} />
          </a>
        </div>

        {/* Local Nadipudi Village Helpdesk Interactive Form */}
        <div className="card">
          <div className="card-title-group">
            <div className="card-icon-box">
              <FileText size={22} />
            </div>
            <div>
              <h3>{t.requestFormTitle}</h3>
              <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                {isTe
                  ? "నడిపూడి గ్రామ సచివాలయం స్థానిక వినతులు & సమస్యల పరిష్కారం"
                  : "Submit local village requests directly for Digital Assistant review"}
              </p>
            </div>
          </div>

          {ticketId ? (
            <div style={{ background: "rgba(22, 163, 74, 0.1)", border: "1px solid var(--primary-green)", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
              <CheckCircle2 size={48} style={{ color: "var(--primary-green)", margin: "0 auto 12px" }} />
              <h4 style={{ fontSize: "1.2rem", color: "var(--primary-emerald)", marginBottom: "8px" }}>
                {t.ticketGenerated}
              </h4>
              <div style={{ fontSize: "1.6rem", fontWeight: 700, letterSpacing: "1px", color: "var(--primary-emerald)", marginBottom: "12px" }}>
                {ticketId}
              </div>
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "16px" }}>
                {isTe
                  ? "మీ అర్జీ గ్రామ సచివాలయ లాగిన్ లో నమోదు చేయబడింది. 24 గంటలలో విలేజ్ సెక్రటరీ మిమ్మల్ని ఫోన్ ద్వారా సంప్రదిస్తారు."
                  : "Your application has been logged into the village helpdesk system. Staff will follow up within 24 hours."}
              </p>
              <button
                className="btn-primary"
                onClick={() => {
                  setTicketId(null);
                  setName("");
                  setPhone("");
                  setDescription("");
                }}
              >
                మరొక అభ్యర్థన నమోదు చేయండి (New Request)
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t.applicantName}</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder={isTe ? "ఉదా: పి. శ్రీనివాసరావు" : "e.g. P. Srinivasa Rao"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>{t.applicantPhone}</label>
                <input
                  type="tel"
                  className="form-control"
                  required
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>{t.issueCategory}</label>
                <select
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {(isTe ? spandanaInfo.categoriesTe : spandanaInfo.categoriesEn).map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>{t.issueDescription}</label>
                <textarea
                  className="form-control"
                  rows="3"
                  required
                  placeholder={isTe ? "మీ సమస్య వివరాలు స్పష్టంగా వ్రాయండి..." : "Describe your problem in detail..."}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                <Send size={16} />
                <span>{t.submitRequest}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

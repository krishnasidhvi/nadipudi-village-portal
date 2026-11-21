import React from "react";
import { HelpCircle, ExternalLink, ListChecks, PhoneCall, Building2 } from "lucide-react";
import { spandanaInfo } from "../data/spandanaData";

// This page only explains how to use the official grievance system. It does
// not collect grievances itself: nothing typed here would reach any office.
export default function SpandanaHub({ lang, t }) {
  const isTe = lang === "te";

  return (
    <div className="spandana-hub-container">
      <div className="grid-2">
        {/* Official process guide */}
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
            <a href={`tel:${spandanaInfo.helpline}`} style={{ color: "var(--sky-blue)", display: "flex", alignItems: "center", gap: "6px", fontWeight: 700 }}>
              <PhoneCall size={16} /> {isTe ? "PGRS టోల్ ఫ్రీ నంబర్" : "PGRS toll-free helpline"}: {spandanaInfo.helpline}
            </a>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              {isTe
                ? "నంబర్ మారవచ్చు — అధికారిక పోర్టల్‌లో సరిచూసుకోండి."
                : "Numbers change — confirm on the official portal."}
            </span>
          </div>

          <ol style={{ paddingLeft: "20px", fontSize: "0.9rem", lineHeight: "1.7", color: "var(--text-main)", listStyle: "none" }}>
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

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* In person */}
          <div className="card">
            <div className="card-title-group">
              <div className="card-icon-box">
                <Building2 size={22} />
              </div>
              <h3>{isTe ? "నేరుగా ఫిర్యాదు ఇవ్వడం" : "Filing in Person"}</h3>
            </div>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
              {isTe
                ? "నడిపూడి గ్రామ సచివాలయంలో డిజిటల్ అసిస్టెంట్ ద్వారా ఫిర్యాదు నమోదు చేయించుకోవచ్చు. ప్రతి సోమవారం జిల్లా కలెక్టరేట్‌లో జరిగే ప్రజా సమస్యల పరిష్కార వేదికలో కూడా అర్జీ ఇవ్వవచ్చు. ఆధార్ కార్డు, సంబంధిత పత్రాల నకళ్ళు వెంట తీసుకువెళ్ళండి."
                : "You can have a grievance registered by the Digital Assistant at the Nadipudi Grama Sachivalayam, or submit a petition at the weekly Monday grievance day at the district Collectorate. Take your Aadhaar card and copies of any related documents."}
            </p>
          </div>

          {/* What can be raised */}
          <div className="card">
            <div className="card-title-group">
              <div className="card-icon-box" style={{ background: "rgba(217, 119, 6, 0.15)", color: "var(--accent-gold)" }}>
                <ListChecks size={22} />
              </div>
              <h3>{isTe ? "సాధారణంగా నమోదు చేసే సమస్యలు" : "Issues Commonly Raised"}</h3>
            </div>
            <ul style={{ paddingLeft: "20px", fontSize: "0.9rem", lineHeight: 1.7 }}>
              {(isTe ? spandanaInfo.categoriesTe : spandanaInfo.categoriesEn).map((category) => (
                <li key={category}>{category}</li>
              ))}
            </ul>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "12px", lineHeight: 1.5 }}>
              {isTe
                ? "గమనిక: ఈ వెబ్‌సైట్ ఫిర్యాదులను స్వీకరించదు. ఇది గ్రామస్తులు నడిపే సమాచార వేదిక మాత్రమే; ఫిర్యాదులు పై అధికారిక మార్గాల ద్వారా మాత్రమే నమోదవుతాయి."
                : "Note: this website does not accept grievances. It is a community-run information site; grievances are registered only through the official channels above."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

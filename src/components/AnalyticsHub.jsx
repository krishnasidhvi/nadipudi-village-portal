import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { Users, Wheat, BookOpen, Home, Briefcase, Landmark, ExternalLink } from "lucide-react";
import SourceNote from "./SourceNote";
import { census2011, census2001, censusSources, adminFacts, HECTARE_TO_ACRE } from "../data/censusData";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const num = (n) => n.toLocaleString("en-IN");
const AXIS = { ticks: { color: "#e2e8f0" }, grid: { color: "rgba(255,255,255,0.1)" } };
const LEGEND = { labels: { color: "#e2e8f0" } };

export default function AnalyticsHub({ lang }) {
  const isTe = lang === "te";
  const c = census2011;
  const [pca, villageDirectory, teWiki] = censusSources;
  const src = (s) => (isTe ? s.labelTe : s.labelEn);

  const landChartData = {
    labels: isTe
      ? ["నికర సాగు భూమి", "వ్యవసాయేతర వినియోగం", "బీడు భూమి"]
      : ["Net sown area", "Non-agricultural use", "Fallow land"],
    datasets: [
      {
        data: [c.land.netSown, c.land.nonAgricultural, c.land.fallow],
        backgroundColor: ["#22c55e", "#fbbf24", "#94a3b8"],
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.4)",
      },
    ],
  };

  const peopleChartData = {
    labels: isTe ? ["జనాభా", "అక్షరాస్యులు", "పనిచేసేవారు"] : ["Population", "Literates", "Workers"],
    datasets: [
      {
        label: isTe ? "పురుషులు" : "Male",
        data: [c.population.male, c.literates.male, c.workers.male],
        backgroundColor: "#38bdf8",
        borderRadius: 6,
      },
      {
        label: isTe ? "స్త్రీలు" : "Female",
        data: [c.population.female, c.literates.female, c.workers.female],
        backgroundColor: "#f472b6",
        borderRadius: 6,
      },
    ],
  };

  const stats = [
    { icon: Users, color: "#4ade80", value: num(c.population.total), label: isTe ? "మొత్తం జనాభా" : "Total population" },
    { icon: Home, color: "#38bdf8", value: num(c.households), label: isTe ? "కుటుంబాలు" : "Households" },
    { icon: BookOpen, color: "#fbbf24", value: `${c.literacyRate.total}%`, label: isTe ? "అక్షరాస్యత (7+ వయస్సు)" : "Literacy rate (age 7+)" },
    { icon: Users, color: "#c084fc", value: num(c.sexRatio), label: isTe ? "ప్రతి 1000 పురుషులకు స్త్రీలు" : "Females per 1,000 males" },
  ];

  const rows = [
    [isTe ? "పురుషులు / స్త్రీలు" : "Male / Female", `${num(c.population.male)} / ${num(c.population.female)}`],
    [isTe ? "0–6 ఏళ్ళ పిల్లలు" : "Children aged 0–6", `${num(c.children0to6.total)} (${isTe ? "బాలురు" : "boys"} ${c.children0to6.male}, ${isTe ? "బాలికలు" : "girls"} ${c.children0to6.female})`],
    [isTe ? "అక్షరాస్యత: పురుషులు / స్త్రీలు" : "Literacy: male / female", `${c.literacyRate.male}% / ${c.literacyRate.female}%`],
    [isTe ? "షెడ్యూల్డ్ కులాలు" : "Scheduled Castes", num(c.scheduledCastes)],
    [isTe ? "షెడ్యూల్డ్ తెగలు" : "Scheduled Tribes", num(c.scheduledTribes)],
    [isTe ? "మొత్తం పనిచేసేవారు" : "Total workers", `${num(c.workers.total)} (${isTe ? "ప్రధాన" : "main"} ${num(c.workers.main)}, ${isTe ? "ఉపాంత" : "marginal"} ${c.workers.marginal})`],
    [isTe ? "సాగుదారులు (సొంత భూమి)" : "Cultivators (own land)", num(c.cultivators)],
    [isTe ? "వ్యవసాయ కూలీలు" : "Agricultural labourers", num(c.agriculturalLabourers)],
  ];

  return (
    <div className="analytics-hub-container">
      <div className="card hero-card" style={{ marginBottom: "24px" }}>
        <div className="hero-badge">
          <Landmark size={16} />
          <span>{isTe ? "భారత జనాభా లెక్కలు 2011" : "Census of India 2011"}</span>
        </div>
        <h2 className="hero-heading" style={{ fontSize: "1.6rem" }}>
          {isTe ? "నడిపూడి గ్రామ గణాంకాలు" : "Nadipudi Village Data"}
        </h2>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.6, maxWidth: "760px" }}>
          {isTe
            ? `ఈ పేజీలోని అంకెలన్నీ 2011 జనాభా లెక్కల నుండి తీసుకున్నవి (గ్రామ కోడ్ ${c.villageCode}). ఇవి ${new Date().getFullYear() - c.year} ఏళ్ళ నాటివి; తరువాతి జనగణన ఫలితాలు ఇంకా ప్రచురించబడలేదు. అంచనాలు లేదా ఊహించిన అంకెలు ఇక్కడ చూపడం లేదు.`
            : `Every figure on this page is from the 2011 census (village code ${c.villageCode}). They are ${new Date().getFullYear() - c.year} years old; results of the next census have not been published yet. No estimates or projected numbers are shown.`}
        </p>

        <div className="grid-4" style={{ marginTop: "20px" }}>
          {stats.map((s) => (
            <div key={s.label} className="stat-card card">
              <div className="stat-icon" style={{ background: "rgba(255,255,255,0.08)", color: s.color }}>
                <s.icon size={22} />
              </div>
              <div>
                <div className="stat-number">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
        <SourceNote lang={lang} source={src(pca)} url={pca.url} />
      </div>

      <div className="grid-2" style={{ marginBottom: "24px" }}>
        <div className="card">
          <div className="card-title-group">
            <div className="card-icon-box">
              <Wheat size={22} />
            </div>
            <div>
              <h3>{isTe ? "భూమి వినియోగం (హెక్టార్లలో)" : "Land Use (hectares)"}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                {isTe
                  ? `మొత్తం విస్తీర్ణం: ${c.land.total} హెక్టార్లు (సుమారు ${num(Math.round(c.land.total * HECTARE_TO_ACRE))} ఎకరాలు) · సాగు భూమి అంతా కాలువ నీటితో`
                  : `Total area: ${c.land.total} ha (about ${num(Math.round(c.land.total * HECTARE_TO_ACRE))} acres) · all sown land is canal-irrigated`}
              </p>
            </div>
          </div>
          <div style={{ height: "280px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Doughnut data={landChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: LEGEND } }} />
          </div>
          <SourceNote lang={lang} source={src(villageDirectory)} url={villageDirectory.url} />
        </div>

        <div className="card">
          <div className="card-title-group">
            <div className="card-icon-box" style={{ background: "rgba(2, 132, 199, 0.1)", color: "var(--sky-blue)" }}>
              <Users size={22} />
            </div>
            <div>
              <h3>{isTe ? "జనాభా, అక్షరాస్యులు, పనిచేసేవారు" : "Population, Literates and Workers"}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{isTe ? "పురుషులు మరియు స్త్రీల వారీగా" : "By male and female"}</p>
            </div>
          </div>
          <div style={{ height: "280px" }}>
            <Bar
              data={peopleChartData}
              options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: LEGEND }, scales: { x: AXIS, y: AXIS } }}
            />
          </div>
          <SourceNote lang={lang} source={src(pca)} url={pca.url} />
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: "24px" }}>
        <div className="card">
          <div className="card-title-group">
            <div className="card-icon-box" style={{ background: "rgba(217, 119, 6, 0.15)", color: "var(--accent-gold)" }}>
              <Briefcase size={22} />
            </div>
            <h3>{isTe ? "మరిన్ని వివరాలు (2011)" : "More Detail (2011)"}</h3>
          </div>
          <div className="table-responsive">
            <table className="custom-table">
              <tbody>
                {rows.map(([label, value]) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td>
                      <strong>{value}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <SourceNote lang={lang} source={src(pca)} url={pca.url} />
        </div>

        <div className="card">
          <div className="card-title-group">
            <div className="card-icon-box">
              <Landmark size={22} />
            </div>
            <h3>{isTe ? "పరిపాలన & గత జనగణన" : "Administration & Earlier Census"}</h3>
          </div>
          <div className="table-responsive">
            <table className="custom-table">
              <tbody>
                <tr>
                  <td>{isTe ? "మండలం" : "Mandal"}</td>
                  <td><strong>{isTe ? adminFacts.mandalTe : adminFacts.mandalEn}</strong></td>
                </tr>
                <tr>
                  <td>{isTe ? "రెవెన్యూ డివిజన్" : "Revenue division"}</td>
                  <td><strong>{isTe ? adminFacts.revenueDivisionTe : adminFacts.revenueDivisionEn}</strong></td>
                </tr>
                <tr>
                  <td>{isTe ? "జిల్లా" : "District"}</td>
                  <td><strong>{isTe ? adminFacts.districtTe : adminFacts.districtEn}</strong></td>
                </tr>
                <tr>
                  <td>{isTe ? "శాసనసభ నియోజకవర్గం" : "Assembly constituency"}</td>
                  <td><strong>{isTe ? adminFacts.assemblyTe : adminFacts.assemblyEn}</strong></td>
                </tr>
                <tr>
                  <td>{isTe ? "లోక్‌సభ నియోజకవర్గం" : "Lok Sabha constituency"}</td>
                  <td><strong>{isTe ? adminFacts.lokSabhaTe : adminFacts.lokSabhaEn}</strong></td>
                </tr>
                <tr>
                  <td>{isTe ? "2001 జనాభా / కుటుంబాలు" : "2001 population / households"}</td>
                  <td><strong>{num(census2001.population)} / {num(census2001.households)}</strong></td>
                </tr>
                <tr>
                  <td>{isTe ? "2001–2011 జనాభా మార్పు" : "Population change 2001–2011"}</td>
                  <td><strong>{num(c.population.total - census2001.population)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          <SourceNote lang={lang} source={`${adminFacts.sourceLabel}; ${src(teWiki)}`} url={teWiki.url} />
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: "8px" }}>{isTe ? "ఇంకా నిర్ధారించని వివరాలు" : "Not Yet Confirmed"}</h3>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
          {isTe
            ? "వార్డుల సంఖ్య, ఓటర్ల సంఖ్య, పథకాల లబ్ధిదారుల వివరాలు, ప్రస్తుత జనాభా — వీటికి నమ్మదగిన బహిరంగ మూలం దొరకలేదు, అందుకే ఇక్కడ చూపడం లేదు. పంచాయతీ రికార్డుల నుండి నిర్ధారించిన తరువాత చేర్చబడతాయి."
            : "Ward count, voter numbers, scheme beneficiary counts and current population have no reliable public source yet, so they are not shown. They will be added once confirmed from panchayat records."}
        </p>
        <p style={{ fontSize: "0.85rem", marginTop: "8px" }}>
          <a href="https://egramswaraj.gov.in/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--sky-blue)" }}>
            {isTe ? "పంచాయతీ నిధులు & పనులు: eGramSwaraj" : "Panchayat funds and works: eGramSwaraj"} <ExternalLink size={12} style={{ display: "inline" }} />
          </a>
        </p>
      </div>
    </div>
  );
}

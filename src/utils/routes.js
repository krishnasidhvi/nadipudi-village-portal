// One entry per page. Used by the app for URL <-> tab mapping and by
// scripts/postbuild.js to write a real HTML file (and sitemap entry) per page,
// so every page has its own shareable, indexable address on GitHub Pages.
// Keep this file free of browser/Vite-only code: Node imports it too.

export const SITE_URL = "https://krishnasidhvi.github.io/nadipudi-village-portal/";

export const routes = [
  {
    tab: "home",
    path: "",
    titleEn: "Nadipudi Village Portal | Penugonda Mandal, West Godavari",
    titleTe: "నడిపూడి గ్రామ సమాచార వేదిక | పెనుగొండ మండలం, పశ్చిమ గోదావరి",
    descEn:
      "Community-run portal for Nadipudi village, Penugonda mandal, West Godavari, Andhra Pradesh: temple, weather, paddy prices, Godavari level, schemes and helplines.",
  },
  {
    tab: "temple",
    path: "temple",
    titleEn: "Sri Subramanyeswara Swamy Temple, Nadipudi",
    titleTe: "శ్రీ సుబ్రహ్మణ్యేశ్వర స్వామి దేవాలయం, నడిపూడి",
    descEn:
      "Sri Subramanyeswara Swamy Temple at Nadipudi, West Godavari: darshan timings, pujas, Subrahmanya Shashti festival, photos and how to reach.",
  },
  {
    tab: "agri",
    path: "agriculture",
    titleEn: "Weather, Paddy Prices & Godavari Level | Nadipudi",
    titleTe: "వాతావరణం, ధాన్యం ధరలు & గోదావరి నీటిమట్టం | నడిపూడి",
    descEn:
      "Weather forecast for Nadipudi, paddy prices reported by Penugonda and nearby West Godavari markets, and the Godavari level at Dowleswaram barrage.",
  },
  {
    tab: "schemes",
    path: "schemes",
    titleEn: "Government Welfare Schemes | Nadipudi",
    titleTe: "ప్రభుత్వ సంక్షేమ పథకాలు | నడిపూడి",
    descEn:
      "Guide to Andhra Pradesh and central welfare schemes for Nadipudi residents: benefits, eligibility, documents and official application links.",
  },
  {
    tab: "notices",
    path: "notices",
    titleEn: "Notices & Official Alerts | Nadipudi",
    titleTe: "ప్రకటనలు & అధికారిక హెచ్చరికలు | నడిపూడి",
    descEn: "Village notices and official disaster alerts for West Godavari district from the NDMA SACHET feed.",
  },
  {
    tab: "analytics",
    path: "village-data",
    titleEn: "Nadipudi Village Data: Census 2011 Population, Literacy & Land Use",
    titleTe: "నడిపూడి గ్రామ గణాంకాలు: 2011 జనాభా లెక్కలు",
    descEn:
      "Census of India 2011 figures for Nadipudi village (code 588686): population, households, literacy, workers and land use, with sources.",
  },
  {
    tab: "elections",
    path: "elections",
    titleEn: "Voter Services & Electoral Roll Links | Nadipudi",
    titleTe: "ఓటరు సేవలు & ఓటర్ల జాబితా లింకులు | నడిపూడి",
    descEn: "Official Election Commission links for Nadipudi voters: electoral roll search, new registration and corrections.",
  },
  {
    tab: "directory",
    path: "directory",
    titleEn: "Emergency Helplines & Village Secretariat Services | Nadipudi",
    titleTe: "అత్యవసర నంబర్లు & గ్రామ సచివాలయ సేవలు | నడిపూడి",
    descEn: "Emergency helpline numbers and a guide to which Grama Sachivalayam functionary handles which service in Nadipudi.",
  },
  {
    tab: "spandana",
    path: "grievances",
    titleEn: "How to File a Grievance (PGRS / Mee Kosam) | Nadipudi",
    titleTe: "ఫిర్యాదు నమోదు విధానం (PGRS / మీ కోసం) | నడిపూడి",
    descEn: "Step-by-step guide for Nadipudi residents to file a public grievance on the official Andhra Pradesh PGRS (Mee Kosam) portal.",
  },
];

const byTab = new Map(routes.map((r) => [r.tab, r]));
const byPath = new Map(routes.map((r) => [r.path, r]));

export function routeForTab(tab) {
  return byTab.get(tab) || routes[0];
}

export function isKnownTab(tab) {
  return byTab.has(tab);
}

// "/nadipudi-village-portal/temple/" with base "/nadipudi-village-portal/" -> "temple".
// Returns null when the path is not one of ours.
export function tabFromPath(pathname, base) {
  let rest = pathname.startsWith(base) ? pathname.slice(base.length) : pathname.replace(/^\//, "");
  rest = rest.replace(/index\.html$/, "").replace(/\/+$/, "");
  return byPath.has(rest) ? byPath.get(rest).tab : null;
}

export function urlForTab(tab, base) {
  const { path } = routeForTab(tab);
  return path ? `${base}${path}/` : base;
}

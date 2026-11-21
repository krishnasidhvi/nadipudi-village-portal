// Census of India 2011 figures for Nadipudi (Penugonda mandal), village code 588686.
// Every number on the Village Data page comes from here. Do not add estimates:
// if a newer official figure is published, add it with its own source and year.
//
// Note: there is another Nadipudi in Amalapuram mandal (Konaseema). Some
// aggregator sites mix the two, so check the village code before copying figures.

export const censusSources = [
  {
    id: "pca",
    labelEn: "Census of India 2011, Primary Census Abstract (via census2011.co.in)",
    labelTe: "భారత జనాభా లెక్కలు 2011, ప్రాథమిక జనాభా సారాంశం (census2011.co.in ద్వారా)",
    url: "https://www.census2011.co.in/data/village/588686-nadipudi-andhra-pradesh.html",
  },
  {
    id: "vd",
    labelEn: "Census of India 2011, Village Directory (via villageinfo.in)",
    labelTe: "భారత జనాభా లెక్కలు 2011, గ్రామ డైరెక్టరీ (villageinfo.in ద్వారా)",
    url: "https://villageinfo.in/andhra-pradesh/west-godavari/penugonda/nadipudi/",
  },
  {
    id: "tewiki",
    labelEn: "Telugu Wikipedia: Nadipudi (Penugonda), citing the 2001 and 2011 census",
    labelTe: "తెలుగు వికీపీడియా: నడిపూడి (పెనుగొండ), 2001 మరియు 2011 జనగణన ఆధారంగా",
    url: "https://te.wikipedia.org/wiki/నడిపూడి_(పెనుగొండ)",
  },
];

export const census2011 = {
  year: 2011,
  villageCode: "588686",
  population: { total: 3342, male: 1655, female: 1687 },
  households: 925,
  children0to6: { total: 307, male: 145, female: 162 },
  sexRatio: 1019, // females per 1,000 males
  childSexRatio: 1117,
  // Literacy rate is literates divided by population aged 7 and above.
  literacyRate: { total: 71.63, male: 77.02, female: 66.3 },
  literates: { total: 2174, male: 1163, female: 1011 },
  scheduledCastes: 600,
  scheduledTribes: 9,
  workers: { total: 1735, male: 1067, female: 668, main: 1727, marginal: 8 },
  cultivators: 97,
  agriculturalLabourers: 1525,
  // Hectares, from the village directory.
  land: { total: 544, netSown: 365.93, nonAgricultural: 92.07, fallow: 86 },
  irrigation: "canal",
};

export const census2001 = { year: 2001, population: 3447, households: 842 };

export const adminFacts = {
  mandalEn: "Penugonda",
  mandalTe: "పెనుగొండ",
  revenueDivisionEn: "Narasapuram",
  revenueDivisionTe: "నరసాపురం",
  districtEn: "West Godavari",
  districtTe: "పశ్చిమ గోదావరి",
  assemblyEn: "Achanta",
  assemblyTe: "ఆచంట",
  lokSabhaEn: "Narasapuram",
  lokSabhaTe: "నరసాపురం",
  pin: "534326",
  sourceLabel: "Wikipedia: Nadipudi",
  sourceUrl: "https://en.wikipedia.org/wiki/Nadipudi",
};

export const HECTARE_TO_ACRE = 2.471;

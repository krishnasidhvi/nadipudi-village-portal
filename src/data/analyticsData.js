import { getNumericDate } from "../utils/dateUtils";

// Legacy exports for backwards compatibility
export const landUseData = {
  labelsTe: ["వరి పొలాలు (Paddy Ayacut)", "కొబ్బరి తోటలు (Coconut Groves)", "ఆక్వా చెరువులు (Aqua Ponds)", "నివాస గ్రామం (Gram Kantham)", "జలాశయాలు & కాలువలు (Canals)"],
  labelsEn: ["Paddy Cultivation", "Coconut Orchards", "Aqua Prawn Ponds", "Residential Wards", "Canals & Ponds"],
  acres: [840, 260, 140, 110, 70],
  percentages: [59.1, 18.3, 9.9, 7.7, 5.0],
  colors: ["#22c55e", "#10b981", "#38bdf8", "#fbbf24", "#06b6d4"],
};

export const paddyTrendData = {
  labels: ["24-Jul", "25-Jul", "26-Jul", "27-Jul", "28-Jul", "29-Jul", "Today"],
  prices: [2240, 2250, 2260, 2265, 2280, 2300, 2340],
};

export const commodityComparisonData = {
  labelsTe: ["మార్టేరు మార్కెట్", "పెనుగొండ మండి", "తణుకు మార్కెట్", "పాలకొల్లు రైతు బజార్"],
  labelsEn: ["Marteru Market", "Penugonda Mandi", "Tanuku Market", "Palakollu Bazaar"],
  paddyPrices: [2340, 2320, 2310, 2330],
};

export const schemeBeneficiaryData = {
  labelsTe: ["రైతు భరోసా", "ఎన్టీఆర్ పింఛను", "తల్లికి వందనం", "ఇళ్ళ పట్టాలు", "ఉచిత పంటల బీమా"],
  labelsEn: ["Rythu Bharosa", "NTR Pension", "Talliki Vandanam", "Housing Sites", "Free Crop Insurance"],
  beneficiaries: [620, 310, 480, 240, 710],
  totalEligible: [650, 320, 500, 270, 750],
};

export const wardVoterData = {
  labelsTe: ["వార్డు 1", "వార్డు 2", "వార్డు 3", "వార్డు 4", "వార్డు 5", "వార్డు 6", "వార్డు 7", "వార్డు 8", "వార్డు 9", "వార్డు 10"],
  labelsEn: ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5", "Ward 6", "Ward 7", "Ward 8", "Ward 9", "Ward 10"],
  voters: [420, 425, 450, 462, 390, 390, 345, 350, 310, 308],
  male: [210, 215, 225, 230, 195, 190, 170, 175, 155, 155],
  female: [210, 210, 225, 232, 195, 200, 175, 175, 155, 153],
};

export const canalWaterFlowData = {
  labels: ["24-Jul", "25-Jul", "26-Jul", "27-Jul", "28-Jul", "29-Jul", "Today"],
  inflow: [38000, 40200, 42000, 43500, 44100, 45200, 46800],
  outflow: [36000, 38500, 40000, 41200, 42000, 42800, 44500],
};

// Demographics & Census Analytics
export const villageDemographics = {
  totalPopulation: "3,850",
  malePopulation: "1,942",
  femalePopulation: "1,908",
  sexRatio: "982 స్త్రీలు / 1000 పురుషులు",
  literacyRate: "78.4%",
  maleLiteracy: "84.2%",
  femaleLiteracy: "72.6%",
  totalHouseholds: "1,040",
  secretariatWards: 10,

  ageDistribution: {
    labelsTe: ["0-14 ఏళ్ళు (పిల్లలు)", "15-35 ఏళ్ళు (యువత)", "36-60 ఏళ్ళు (నడుము వయస్సు)", "60+ ఏళ్ళు (వయోవృద్ధులు)"],
    labelsEn: ["0-14 Yrs (Children)", "15-35 Yrs (Youth)", "36-60 Yrs (Middle Age)", "60+ Yrs (Seniors)"],
    data: [720, 1310, 1240, 580],
    colors: ["#38bdf8", "#22c55e", "#f59e0b", "#a855f7"]
  },

  occupationBreakdown: {
    labelsTe: ["వరి సాగు రైతులు (Farmers)", "వ్యవసాయ కూలీలు (Agri Labor)", "ఆక్వా రంగం (Aqua Culture)", "వ్యాపారం & చేతివృత్తులు (Trade/Artisans)", "ప్రభుత్వ / ప్రైవేట్ ఉద్యోగాలు (Services)"],
    labelsEn: ["Paddy Farmers", "Agri Laborers", "Aqua Farmers", "Business & Artisans", "Govt & Private Services"],
    data: [42, 28, 14, 10, 6],
    colors: ["#16a34a", "#0284c7", "#d97706", "#9333ea", "#e11d48"]
  }
};

// AI & IoT Agricultural Analytics (ZenZe Style Telemetry)
export const aiAgriTelemetry = {
  soilMoisture: "72% (ఉత్తమం / Optimal)",
  soilMoistureVal: 72,
  temperature: "31°C",
  humidity: "78%",
  npkScore: "88/100 (సారవంతమైన మట్టి)",
  irrigationEfficiency: "94%",
  paddyYieldForecast: "3.8 టన్నులు / హెక్టారుకు (High Yield)",

  landUseData: landUseData
};

// DBT Scheme Disbursement Analytics
export const dbtDisbursementData = {
  totalAmountDisbursed: "₹3.65 కోట్లు",
  totalBeneficiaryCount: "1,870",
  updatedDate: getNumericDate(0),

  schemesBreakdown: {
    labelsTe: ["రైతు భరోసా", "ఎన్టీఆర్ సేవా పింఛను", "తల్లికి వందనం / అమ్మ ఒడి", "ఇళ్ళ పట్టాల సహాయం", "ఉచిత పంటల బీమా"],
    labelsEn: ["Rythu Bharosa", "NTR Pension", "Talliki Vandanam", "Housing Sites", "Crop Insurance"],
    amountLakhs: [185, 92, 48, 25, 15],
    colors: ["#16a34a", "#d97706", "#0284c7", "#7c3aed", "#ec4899"]
  }
};

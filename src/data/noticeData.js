import { getNumericDate } from "../utils/dateUtils";

export const panchyatNotices = [
  {
    id: "n1",
    priority: "HIGH",
    categoryTe: "మంచినీటి సరఫరా",
    categoryEn: "Water Supply",
    date: getNumericDate(0), // Today's auto-updating date
    titleTe: "నడిపూడి రక్షిత మంచినీటి ట్యాంక్ క్లీనింగ్ & పైప్‌లైన్ మరమ్మత్తులు",
    titleEn: "Nadipudi Overhead Water Tank Cleaning & Pipeline Maintenance",
    detailsTe: "గ్రామ ప్రజలకు మనవి: ఈరోజు ఉదయం 9:00 నుండి మధ్యాహ్నం 1:00 వరకు రక్షిత మంచినీటి ట్యాంక్ క్లోరినేషన్ మరియు శుభ్రత పనులు జరుగుతాయి. సాయంత్రం సరఫరా పునరుద్ధరించబడుతుంది.",
    detailsEn: "Overhead water tank chlorination and main pipeline repairs scheduled for today from 9 AM to 1 PM. Evening water supply will resume normally.",
  },
  {
    id: "n2",
    priority: "MEDIUM",
    categoryTe: "విద్యుత్ శాఖ (APEPDCL)",
    categoryEn: "Electricity Alert",
    date: getNumericDate(1), // Yesterday's auto-updating date
    titleTe: "పెనుగొండ ఫీడర్ 11KV కాలువ గట్టు లైన్ అత్యవసర మరమ్మత్తులు",
    titleEn: "11KV Penugonda Feeder Line Substation Maintenance",
    detailsTe: "పెనుగొండ మండల APEPDCL సహాయ ఇంజనీర్ గారి సమాచారం ప్రకారం: నడిపూడి గ్రామ వ్యవసాయ విద్యుత్ కనెక్షన్లకు నిరంతర నిర్వహణ నిర్వహించబడినది.",
    detailsEn: "APEPDCL Penugonda Substation emergency tree trimming & transformer maintenance affecting Nadipudi agriculture feeders.",
  },
  {
    id: "n3",
    priority: "NORMAL",
    categoryTe: "ఆరోగ్య శాఖ",
    categoryEn: "Health Camp",
    date: getNumericDate(2),
    titleTe: "నడిపూడి ప్రాథమిక ఆరోగ్య ఉపకేంద్రంలో ఉచిత బిపి, షుగర్ & వైద్య క్యాంప్",
    titleEn: "Free Health Check-up & NCD Screening Camp at Nadipudi PHC Sub-Center",
    detailsTe: "నడిపూడి ఉప-కేంద్రంలో ఏఎన్‌ఎమ్ (ANM) మరియూ ఆశా కార్యకర్తల ఆధ్వర్యంలో ఉచిత రక్తపోటు, మధుమేహం పరీక్షలు నిర్వహించబడును.",
    detailsEn: "Free Non-Communicable Disease (NCD) screening, blood pressure & sugar tests for adults at Nadipudi Primary Health Sub-Center.",
  },
  {
    id: "n4",
    priority: "NORMAL",
    categoryTe: "పశుసంవర్ధక శాఖ",
    categoryEn: "Veterinary Drive",
    date: getNumericDate(4),
    titleTe: "పాడి పశువులకు ఉచిత గాలికుంటు వ్యాధి నిరోధక టీకాలు (FMD Vaccination)",
    titleEn: "Foot-and-Mouth Disease (FMD) Free Livestock Vaccination",
    detailsTe: "నడిపూడి గ్రామంలోని పాడి గేదెలు, ఆవులు మరియు గొర్రెలకు స్థానిక పశువైద్యుల ద్వారా మంగళవారం ఉదయం నుండి ఇంటింటి టీకా డ్రైవ్ నిర్వహించబడుతుంది.",
    detailsEn: "Veterinary Assistant will conduct doorstep Foot and Mouth Disease vaccination drive for cows and buffaloes in Nadipudi village.",
  }
];

export const villageNews = [
  {
    id: "news1",
    date: getNumericDate(0),
    tagTe: "గోదావరి డెల్టా వ్యవసాయం",
    tagEn: "Delta Agriculture",
    titleTe: "నడిపూడి చేలలో వరి నాట్లు ముమ్మరం - పెనుగొండ కాలువ నీరు సమృద్ధి",
    titleEn: "Swarna Paddy Transplantation Gaining Momentum in Nadipudi Fields",
    snippetTe: "సర్ ఆర్ధర్ కాటన్ బ్యారేజీ నుండి పెనుగొండ కాలువల ద్వారా క్రమం తప్పకుండా సాగునీరు అందడంతో నడిపూడి రైతులు వరి నాట్లు ముమ్మరంగా ప్రారంభించారు.",
    snippetEn: "With adequate water release from Sir Arthur Cotton Barrage through Penugonda canals, farmers across Nadipudi are rapidly completing paddy transplantation.",
  },
  {
    id: "news2",
    date: getNumericDate(2),
    tagTe: "గ్రామ పంచాయతీ",
    tagEn: "Panchayat Event",
    titleTe: "నడిపూడి గ్రామ సచివాలయంలో ప్లాస్టిక్ రహిత గ్రామం పై అవగాహన సభ",
    titleEn: "Plastic-Free Village Campaign Conducted at Nadipudi Secretariat",
    snippetTe: "గ్రామ సర్పంచ్ మరియు డిజిటల్ అసిస్టెంట్ నేతృత్వంలో ఒకసారి వాడే ప్లాస్టిక్ వాడకం నివారణ మరియు చెత్త వేరుచేసే తడి-పొడి చెత్త డబ్బాల పంపిణీ జరిగింది.",
    snippetEn: "Villagers participated in a awareness rally promoting eco-friendly cloth bags and wet/dry waste segregation organized by village secretariat team.",
  }
];

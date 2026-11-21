// Which Grama Sachivalayam functionary handles which service.
// Names and phone numbers are deliberately absent: add them (nameTe, nameEn,
// phone) only after confirming with the person at the Sachivalayam and getting
// their consent to be listed publicly.
export const sachivalayamStaff = [
  {
    id: "st1",
    roleTe: "విలేజ్ రెవెన్యూ ఆఫీసర్ (VRO)",
    roleEn: "Village Revenue Officer (VRO)",
    responsibilitiesTe: "పట్టాదార్ పాస్ పుస్తకాలు, భూమి రికార్డులు, ఆదాయ / నివాస ధృవీకరణ పత్రాలు.",
    responsibilitiesEn: "Pattadar passbooks, land records, income and residence certificates.",
  },
  {
    id: "st2",
    roleTe: "పంచాయతీ కార్యదర్శి",
    roleEn: "Panchayat Secretary",
    responsibilitiesTe: "గ్రామ పాలన, జనన / మరణ ధృవీకరణ పత్రాలు, మంచినీరు, పారిశుధ్యం, పన్నులు, గ్రామ సభలు.",
    responsibilitiesEn: "Panchayat administration, birth and death certificates, drinking water, sanitation, taxes, gram sabhas.",
  },
  {
    id: "st3",
    roleTe: "డిజిటల్ అసిస్టెంట్",
    roleEn: "Digital Assistant",
    responsibilitiesTe: "ఆన్‌లైన్ సేవల దరఖాస్తులు, ఆధార్ అనుసంధానం, ఫిర్యాదుల నమోదు.",
    responsibilitiesEn: "Online service applications, Aadhaar seeding, grievance registration.",
  },
  {
    id: "st4",
    roleTe: "గ్రామ వ్యవసాయ సహాయకులు (VAA)",
    roleEn: "Village Agriculture Assistant (VAA)",
    responsibilitiesTe: "ఈ-క్రాప్ నమోదు, విత్తనాలు & ఎరువులు, మట్టి పరీక్షలు, తెగుళ్ళ నివారణ సలహాలు.",
    responsibilitiesEn: "e-Crop booking, seed and fertiliser supply, soil testing, pest advisories.",
  },
  {
    id: "st5",
    roleTe: "ఆరోగ్య కార్యకర్త (ANM)",
    roleEn: "Auxiliary Nurse Midwife (ANM)",
    responsibilitiesTe: "గర్భిణుల సంరక్షణ, పిల్లల టీకాలు, ఆరోగ్య కార్డులు, ఆరోగ్య పరీక్షలు.",
    responsibilitiesEn: "Maternal care, child vaccinations, health cards, health screening.",
  },
];

// National / state short codes only. Local landlines are left out until verified.
export const emergencyNumbers = [
  {
    id: "em0",
    serviceTe: "112 అత్యవసర సహాయం (పోలీసు, అగ్నిమాపక, వైద్యం)",
    serviceEn: "112 Emergency (Police, Fire, Medical)",
    number: "112",
    descTe: "దేశవ్యాప్త ఏకైక అత్యవసర నంబర్ (24x7)",
    descEn: "Single national emergency number, 24x7.",
  },
  {
    id: "em1",
    serviceTe: "108 ఉచిత ఆంబులెన్స్ సేవ",
    serviceEn: "108 Emergency Ambulance",
    number: "108",
    descTe: "అత్యవసర వైద్య మరియు ప్రమాద రవాణా సేవలు (24x7 ఉచితం)",
    descEn: "24x7 free emergency medical response and hospital transport.",
  },
  {
    id: "em2",
    serviceTe: "పోలీసు (డయల్ 100)",
    serviceEn: "Police (Dial 100)",
    number: "100",
    descTe: "అత్యవసర పోలీసు సహాయం",
    descEn: "Emergency police assistance.",
  },
  {
    id: "em3",
    serviceTe: "విద్యుత్ ఫిర్యాదులు (1912)",
    serviceEn: "Electricity Complaints (1912)",
    number: "1912",
    descTe: "వైర్లు తెగిపడటం, ట్రాన్స్‌ఫార్మర్ సమస్యలు మరియు విద్యుత్ అంతరాయం ఫిర్యాదులు",
    descEn: "Fallen lines, transformer failure and power interruption complaints.",
  },
  {
    id: "em4",
    serviceTe: "కిసాన్ కాల్ సెంటర్ (రైతు సలహాలు)",
    serviceEn: "Kisan Call Centre (Farmer Advisory)",
    number: "1800-180-1551",
    descTe: "వ్యవసాయ నిపుణుల ఉచిత సలహాలు, తెలుగులో",
    descEn: "Toll-free farm advice from agriculture experts, in Telugu.",
  },
  {
    id: "em5",
    serviceTe: "104 ఆరోగ్య సలహా",
    serviceEn: "104 Health Helpline",
    number: "104",
    descTe: "ఆరోగ్య సలహాలు మరియు సమాచారం",
    descEn: "Health advice and information.",
  },
];

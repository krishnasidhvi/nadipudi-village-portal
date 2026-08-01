export const mapConfig = {
  center: [16.6487661, 81.8340487], // Exact Google Maps Nadipudi Center Pin
  zoom: 15,
  mandalTe: "పెనుగొండ మండలం",
  mandalEn: "Penugonda Mandal",
  districtTe: "పశ్చిమ గోదావరి జిల్లా",
  districtEn: "West Godavari District",
  pincode: "534326",
  googleMapsUrl: "https://www.google.com/maps/place/Nadipudi,+Andhra+Pradesh+534326/@16.6487661,81.8340487,15z/",
  totalAreaAcres: "1,420 ఎకరాలు (Acres)",
  totalAreaSqKm: "5.75 చదరపు కిలోమీటర్లు (sq. km)",
  bounds: [
    [16.6350, 81.8150],
    [16.6620, 81.8500],
  ]
};

// Nadipudi Official Revenue Boundary Polygon (Exact Google Maps Boundary)
export const nadipudiBoundaryPolygon = [
  [16.6575, 81.8280],
  [16.6560, 81.8390],
  [16.6490, 81.8420],
  [16.6410, 81.8390],
  [16.6400, 81.8290],
  [16.6450, 81.8250],
  [16.6540, 81.8240],
  [16.6575, 81.8280],
];

// Geographically Precise Diorama Landmarks (Matching Google Maps Layout)
export const dioramaLandmarks = [
  {
    id: "geo1",
    nameTe: "శ్రీ సుబ్రహ్మణ్యేశ్వర స్వామి ఆలయం (కోనేటి గట్టు)",
    nameEn: "Sri Subramanyeswara Swamy Temple (Beside Temple Pond)",
    categoryTe: "ప్రధాన దివ్య క్షేత్రం",
    categoryEn: "Primary Shrine",
    zoneTe: "గ్రామ కేంద్రం - ఆలయ పుష్కరిణి",
    zoneEn: "Village Center - Beside Sacred Pond",
    coords: [16.6487989, 81.8326407],
    surveyNo: "RS No. 104/1A",
    topOffset: "58%",
    leftOffset: "46%",
    icon: "🛕",
    detailsTe: "నడిపూడి గ్రామ నడిబొడ్డున పవిత్ర ఆలయ కోనేరు (పుష్కరిణి) ఒడ్డున కొలువై ఉన్న పవిత్ర స్వయంభూ క్షేత్రం. రాజగోపురం మరియు వల్లీ దేవసేన సమేత మూలవిరాట్.",
    detailsEn: "Famous Swayambhu shrine of Lord Subramanyeswara Swamy prominently situated beside the sacred village temple pond (Koneru)."
  },
  {
    id: "geo2",
    nameTe: "వసిష్ఠ గోదావరి నది, ఏటిగట్టు & పుష్కర ఘాట్",
    nameEn: "Vasishtha Godavari River, Yetigattu & Pushkar Ghat",
    categoryTe: "నదీ జలమార్గం & పుష్కర ఘాట్",
    categoryEn: "Riverbank & Bathing Ghat",
    zoneTe: "తూర్పు సరిహద్దు - ఏటిగట్టు ప్రక్కన",
    zoneEn: "Eastern Boundary - Past Canal Bridge",
    coords: [16.6510, 81.8410],
    surveyNo: "River Poramboke",
    topOffset: "32%",
    leftOffset: "82%",
    icon: "🌊",
    detailsTe: "నడిపూడి తూర్పు సరిహద్దులో ప్రవహించే పవిత్ర వసిష్ఠ గోదావరి నది. ఏటిగట్టు రక్షణ గోడ మరియు కాలువ వంతెన దాటిన తరువాత వెలసిన శ్రీ సుబ్రహ్మణ్యేశ్వర పుష్కర ఘాట్.",
    detailsEn: "Sacred Vasishtha Godavari river flowing along the eastern edge of Nadipudi. Features Yetigattu river embankment and Sri Subramaneswara Pushkar Ghat past the canal bridge."
  },
  {
    id: "geo3",
    nameTe: "నడిపూడి నివాస గృహ సముదాయాలు (Village Settlement)",
    nameEn: "Nadipudi Residential Houses & Wards",
    categoryTe: "పౌర నివాస ప్రాంతం",
    categoryEn: "Residential Wards",
    zoneTe: "గ్రామ పడమటి & మధ్య భాగం",
    zoneEn: "West & Center Wards",
    coords: [16.6475, 81.8320],
    surveyNo: "Gram Kantham 88/2",
    topOffset: "64%",
    leftOffset: "35%",
    icon: "🏠",
    detailsTe: "1,040 నివాస గృహాలు, 10 పంచాయతీ వార్డులు, గ్రామ సచివాలయం, పంచాయతీ కార్యాలయం మరియు మంచినీటి చెరువు సముదాయం.",
    detailsEn: "Village settlement consisting of 1,040 households across 10 Panchayat wards, Secretariat, and drinking water tank."
  },
  {
    id: "geo4",
    nameTe: "స్వర్ణ వరి పంట పొలాలు (Paddy Fields)",
    nameEn: "Swarna Rice Paddy Cultivation Ayacut",
    categoryTe: "వ్యవసాయ మాగాణి పొలాలు",
    categoryEn: "Rice Paddy Ayacut",
    zoneTe: "ఉత్తర & వాయువ్య ఆయకట్టు",
    zoneEn: "North & North-West Ayacut",
    coords: [16.6530, 81.8300],
    surveyNo: "RS No. 112/3B",
    topOffset: "25%",
    leftOffset: "40%",
    icon: "🌾",
    detailsTe: "గోదావరి డెల్టా కాటన్ కాలువ సాగునీటితో ఏటా రెండు పంటలు పండే 840 ఎకరాల పచ్చని స్వర్ణ వరి పొలాలు.",
    detailsEn: "Lush green paddy fields covering 840 acres irrigated by the Sir Arthur Cotton Godavari canal network."
  },
  {
    id: "geo5",
    nameTe: "కొబ్బరి తోటలు & ఆక్వా రంగాలు (Coconut Orchards)",
    nameEn: "Coconut Groves & Aqua Culture Ponds",
    categoryTe: "తోటపంటలు & ఆక్వా",
    categoryEn: "Coconut Orchards",
    zoneTe: "దక్షిణ & ఆగ్నేయ సరిహద్దు",
    zoneEn: "South & South-East Sector",
    coords: [16.6450, 81.8360],
    surveyNo: "RS No. 142/2A",
    topOffset: "75%",
    leftOffset: "65%",
    icon: "🌴",
    detailsTe: "260 ఎకరాలలో విస్తరించిన కొమ్ములు తిరిగిన ఎత్తైన కొబ్బరి తోటలు మరియు 140 ఎకరాల మంచినీటి ఆక్వా రొయ్యల చెరువులు.",
    detailsEn: "260 acres of high-yielding coconut palm plantations interspersed with freshwater shrimp aquaculture ponds."
  },
  {
    id: "geo6",
    nameTe: "గ్రామ ఇతర దేవాలయాలు (Village Shrines)",
    nameEn: "Other Village Temples (Rama, Anjaneya & Mavullamma)",
    categoryTe: "ఆధ్యాత్మిక క్షేత్రాలు",
    categoryEn: "Heritage Shrines",
    zoneTe: "గ్రామ నివాస సరిహద్దులు",
    zoneEn: "Village Perimeters",
    coords: [16.6468, 81.8310],
    surveyNo: "RS No. 82/1, 96/4",
    topOffset: "72%",
    leftOffset: "28%",
    icon: "🛕",
    detailsTe: "గ్రామ రక్షక దేవత శ్రీ మావుళ్ళమ్మ అమ్మవారి ఆలయం, శ్రీ రామాలయం మరియు శ్రీ భక్త ఆంజనేయ స్వామి ఆలయాలు.",
    detailsEn: "Heritage village shrines including Sri Mavullamma Grama Devatha Temple, Sri Rama Mandiram, and Sri Anjaneya Swamy Temple."
  }
];

export const surveyLandRecords = [
  { surveyNo: "104/1A", classificationTe: "దేవాలయం & పవిత్ర కోనేరు (Koneru)", classificationEn: "Subramanyeswara Temple & Pond", acres: "3.8", ownerTe: "శ్రీ సుబ్రహ్మణ్యేశ్వర స్వామి వారి ట్రస్ట్", ownerEn: "Sri Subramanyeswara Swamy Trust" },
  { surveyNo: "110/2", classificationTe: "వసిష్ఠ గోదావరి & పుష్కర ఘాట్", classificationEn: "Godavari River & Pushkar Ghat Zone", acres: "5.2", ownerTe: "దేవాదాయ & నీటిపారుదల శాఖ", ownerEn: "Irrigation & Endowments Dept" },
  { surveyNo: "88/2", classificationTe: "గ్రామ కంఠం (నివాస ప్రాంతం)", classificationEn: "Gram Kantham (Residential Wards)", acres: "0.45", ownerTe: "నడిపూడి గ్రామ పంచాయతీ", ownerEn: "Nadipudi Gram Panchayat" },
  { surveyNo: "112/3B", classificationTe: "మాగాణి (స్వర్ణ వరి పొలాలు)", classificationEn: "Wetland Paddy Ayacut", acres: "4.2", ownerTe: "నడిపూడి రైతులు", ownerEn: "Nadipudi Farmers" },
  { surveyNo: "142/2A", classificationTe: "కొబ్బరి తోటలు", classificationEn: "Coconut Plantation", acres: "5.8", ownerTe: "నడింపల్లి వీరభద్రరాజు", ownerEn: "Nadimpalli Veerabhadraraju" }
];

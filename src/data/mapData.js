export const mapConfig = {
  center: [16.6489764, 81.8284057], // Exact Nadipudi Google Maps Center Pin
  zoom: 16, // High detail zoom for village layout
  mandalTe: "పెనుగొండ మండలం",
  mandalEn: "Penugonda Mandal",
  districtTe: "పశ్చిమ గోదావరి జిల్లా",
  districtEn: "West Godavari District",
  pincode: "534326",
  googleMapsUrl: "https://www.google.com/maps/@16.6489764,81.8284057,16.25z",
  totalAreaAcres: "1,240 ఎకరాలు (Acres)",
  totalAreaSqKm: "5.02 చదరపు కిలోమీటర్లు (sq. km)",
  bounds: [
    [16.6380, 81.8150],
    [16.6600, 81.8420],
  ]
};

// Nadipudi Village Official Geographical Boundary Polygon (Penugonda Mandal)
export const nadipudiBoundaryPolygon = [
  [16.6550, 81.8230],
  [16.6555, 81.8330],
  [16.6510, 81.8370],
  [16.6430, 81.8380],
  [16.6400, 81.8320],
  [16.6410, 81.8230],
  [16.6460, 81.8200],
  [16.6550, 81.8230], // Closed polygon loop
];

export const waterBodies = [
  {
    id: "wb1",
    nameTe: "నడిపూడి పెద్ద చెరువు (Pedda Cheruvu)",
    nameEn: "Nadipudi Main Reservoir (Pedda Cheruvu)",
    typeTe: "గ్రామ రక్షిత మంచినీటి చెరువు (Lake / Reservoir)",
    typeEn: "Drinking Water Lake",
    sizeTe: "సుమారు 14 ఎకరాలు",
    sizeEn: "Approx 14 Acres",
    coords: [16.6515, 81.8268],
    descTe: "నడిపూడి గ్రామానికి రక్షిత మంచినీటిని అందించే ప్రధాన జలాశయం. గ్రామానికి ఉత్తర భాగంలో ఉంది.",
    descEn: "Primary drinking water reservoir supplying filtered water to Nadipudi households.",
    iconType: "lake",
  },
  {
    id: "wb2",
    nameTe: "గోదావరి పశ్చిమ డెల్టా ప్రధాన కాలువ (Godavari Delta Canal)",
    nameEn: "Godavari West Delta Main Canal",
    typeTe: "ప్రధాన సాగునీటి కాలువ (Primary Irrigation Canal)",
    typeEn: "Main Irrigation Canal",
    sizeTe: "పెనుగొండ మండల ఆయకట్టు ద్వారా ప్రవాహం",
    sizeEn: "Main Branch feeding Penugonda Ayacut",
    coords: [16.6495, 81.8270],
    descTe: "ధవళేశ్వరం బ్యారేజీ నుండి నిరంతరం సాగునీటిని అందించే గోదావరి కెనాల్ శాఖ. వరి పొలాలకు నీరందిస్తుంది.",
    descEn: "Major irrigation canal carrying fresh Godavari river water for paddy crops in Nadipudi.",
    iconType: "canal",
  },
  {
    id: "wb3",
    nameTe: "పెనుగొండ ఫిడర్ కాలువ (Penugonda Branch Feeder)",
    nameEn: "Penugonda Feeder Canal",
    typeTe: "శాఖ కాలువ (Feeder Canal)",
    typeEn: "Feeder Irrigation Canal",
    sizeTe: "నడిపూడి దక్షిణం నుండి ప్రవాహం",
    sizeEn: "Southern Agricultural Feeder",
    coords: [16.6485, 81.8335],
    descTe: "పెనుగొండ మెయిన్ రోడ్డుకు సమాంతరంగా నడిపూడి పొలాల గుండా వెళ్ళే రైతు సాగునీటి కాలువ.",
    descEn: "Branch canal feeding the southern agricultural fields and aqua ponds of Nadipudi.",
    iconType: "canal",
  },
  {
    id: "wb4",
    nameTe: "ఊర చెరువు (Oora Cheruvu)",
    nameEn: "Oora Cheruvu Community Pond",
    typeTe: "గ్రామ పంచాయతీ చెరువు (Community Lake)",
    typeEn: "Community Pond",
    sizeTe: "సుమారు 6 ఎకరాలు",
    sizeEn: "Approx 6 Acres",
    coords: [16.6478, 81.8296],
    descTe: "శ్రీ రామాలయం వీధి సమీపంలోని చారిత్రాత్మక గ్రామ చెరువు. భూగర్భ జలాల ఇంకుడు కుంటగా ఉపయోగపడుతుంది.",
    descEn: "Historic village lake near Ramalayam street helping groundwater recharge.",
    iconType: "lake",
  },
  {
    id: "wb5",
    nameTe: "పంట & ఆక్వా చెరువులు (Paddys & Aqua Ponds Cluster)",
    nameEn: "Paddy Inundation & Aqua Culture Ponds",
    typeTe: "సాగు & ఆక్వా చెరువుల సమూహం (Agri & Aqua Ponds)",
    typeEn: "Aqua & Crop Ponds Cluster",
    sizeTe: "గ్రామ పరిసరాలలో విస్తరించి ఉన్నాయి",
    sizeEn: "Widespread Agri Area",
    coords: [16.6440, 81.8230],
    descTe: "వెన్నామి రొయ్యల సాగు మరియు వరి నాట్ల నీటి నిర్వహణకు ఉపయోగపడే పొలాల చెరువులు.",
    descEn: "Vannamei shrimp farming ponds and seasonal water holding tanks.",
    iconType: "pond",
  }
];

export const villageLandmarks = [
  {
    id: "lm1",
    nameTe: "నడిపూడి గ్రామ సచివాలయం (Secretariat)",
    nameEn: "Nadipudi Village Secretariat",
    coords: [16.6489764, 81.8284057], // Exact Google Maps Center
    typeTe: "ప్రభుత్వ కార్యాలయం",
    typeEn: "Government Office",
  },
  {
    id: "lm2",
    nameTe: "మండల పరిషత్ ప్రాథమిక పాఠశాల",
    nameEn: "Mandal Parishad Primary School",
    coords: [16.6501, 81.8282],
    typeTe: "పాఠశాల & పోలింగ్ కేంద్రం",
    typeEn: "School & Polling Booth",
  },
  {
    id: "lm3",
    nameTe: "రైతు భరోసా కేంద్రం (RBK Center)",
    nameEn: "Rythu Bharosa Center (RBK)",
    coords: [16.6485, 81.8298],
    typeTe: "రైతు సేవ కేంద్రం",
    typeEn: "Farmer Service Hub",
  }
];

export const canalLines = [
  {
    id: "c1",
    name: "Godavari West Delta Main Canal",
    positions: [
      [16.6540, 81.8230],
      [16.6495, 81.8270],
      [16.6450, 81.8310],
      [16.6400, 81.8350],
    ],
    color: "#0284c7",
  },
  {
    id: "c2",
    name: "Penugonda Feeder Branch",
    positions: [
      [16.6540, 81.8310],
      [16.6485, 81.8335],
      [16.6420, 81.8370],
    ],
    color: "#0369a1",
  }
];

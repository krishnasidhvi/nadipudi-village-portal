// Dynamic Date & Time helper utilities for Nadipudi Village Portal

/**
 * Returns formatted date string relative to today
 * @param {number} offsetDays - Number of days to subtract (e.g. 0 for today, 1 for yesterday)
 * @param {string} lang - 'te' or 'en'
 */
export function getRelativeFormattedDate(offsetDays = 0, lang = "te") {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);

  const day = String(d.getDate()).padStart(2, "0");
  const monthNum = d.getMonth();
  const year = d.getFullYear();

  const teluguMonths = [
    "జనవరి", "ఫిబ్రవరి", "మార్చి", "ఏప్రిల్", "మే", "జూన్",
    "జూలై", "ఆగస్టు", "సెప్టెంబర్", "అక్టోబర్", "నవంబర్", "డిసెంబర్"
  ];

  const englishMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  if (lang === "te") {
    return `${day} ${teluguMonths[monthNum]} ${year}`;
  } else {
    return `${day} ${englishMonths[monthNum]} ${year}`;
  }
}

/**
 * Returns numeric DD-MM-YYYY format
 */
export function getNumericDate(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Returns live current time string HH:MM:SS AM/PM
 */
export function getLiveTimeString(lang = "te") {
  const d = new Date();
  return d.toLocaleTimeString(lang === "te" ? "te-IN" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

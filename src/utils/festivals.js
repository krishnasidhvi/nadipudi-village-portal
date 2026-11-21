// Picks the next festival date that has not passed yet (India time).
export function nextFestival(dates = [], now = new Date()) {
  const today = new Date(now.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) + "T00:00:00+05:30");
  const upcoming = dates
    .map((f) => ({ ...f, at: new Date(`${f.date}T00:00:00+05:30`) }))
    .filter((f) => f.at >= today)
    .sort((a, b) => a.at - b.at)[0];
  if (!upcoming) return null;
  return { ...upcoming, daysAway: Math.round((upcoming.at - today) / 86400000) };
}

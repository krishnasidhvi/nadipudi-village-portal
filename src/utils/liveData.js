// Read-side helpers for the JSON files written by scripts/fetchLiveData.js.
// The files are bundled at build time, so what the site shows is exactly what
// the last successful fetch saw. Every helper keeps the real observation date
// so the UI can say how old a reading is instead of implying it is live.

import mandi from "../data/live/mandi.json";
import river from "../data/live/river.json";
import alerts from "../data/live/alerts.json";

export { mandi, river, alerts };

const DAY_MS = 24 * 60 * 60 * 1000;

function toDate(value) {
  // Bare dates ("2026-11-21") are market days in India.
  return new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00+05:30` : value);
}

export function ageInDays(value) {
  return (Date.now() - toDate(value).getTime()) / DAY_MS;
}

export function formatDate(value, lang) {
  return toDate(value).toLocaleDateString(lang === "te" ? "te-IN" : "en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

// Day and month only, for forecast columns.
export function formatDayMonth(value, lang) {
  return toDate(value).toLocaleDateString(lang === "te" ? "te-IN" : "en-IN", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  });
}

export function formatDateTime(value, lang) {
  return toDate(value).toLocaleString(lang === "te" ? "te-IN" : "en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}

export const rupees = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

// Markets close on Sundays and holidays, so allow a few days before warning.
const MANDI_STALE_DAYS = 4;
const RIVER_STALE_DAYS = 2;
const ALERTS_STALE_DAYS = 2;

export const mandiDate = mandi.records.reduce((latest, r) => (r.date > latest ? r.date : latest), "");
export const mandiIsStale = ageInDays(mandiDate) > MANDI_STALE_DAYS;

// Penugonda is the village's own mandal market.
export const penugondaPaddy =
  mandi.records.find((r) => /penugonda/i.test(r.market) && /paddy/i.test(r.commodity)) || null;

// Previous reported day at the same market, for an honest day-on-day change.
export function previousModal(record) {
  const earlier = mandi.history
    .filter((h) => h.market === record.market && h.commodity === record.commodity && h.date < record.date)
    .sort((a, b) => b.date.localeCompare(a.date));
  return earlier[0] || null;
}

export const riverIsStale = ageInDays(river.latest.time) > RIVER_STALE_DAYS;

// "normal" | "warning" | "danger" | "unknown", from CWC's own thresholds.
export function riverStatus() {
  const { latest, thresholds } = river;
  if (!thresholds) return "unknown";
  if (latest.level >= thresholds.danger) return "danger";
  if (latest.level >= thresholds.warning) return "warning";
  return "normal";
}

export const riverStatusLabel = {
  normal: { en: "Below warning level", te: "హెచ్చరిక స్థాయి కంటే తక్కువ", color: "#4ade80" },
  warning: { en: "Above warning level", te: "హెచ్చరిక స్థాయి దాటింది", color: "#fbbf24" },
  danger: { en: "Above danger level", te: "ప్రమాద స్థాయి దాటింది", color: "#f87171" },
  unknown: { en: "Thresholds unavailable", te: "స్థాయి వివరాలు అందుబాటులో లేవు", color: "#e2e8f0" },
};

export const alertsAreStale = ageInDays(alerts.fetchedAt) > ALERTS_STALE_DAYS;

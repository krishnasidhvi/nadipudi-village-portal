// Fetches real public data for the portal and writes it to src/data/live/*.json.
// Run by .github/workflows/daily-update.yml, or locally with `npm run fetch-data`.
//
// Each source is independent: if one fails, its existing JSON file is left
// untouched, so the site keeps showing the last good reading with its real date
// (and flags it as out of date) instead of inventing a value.

import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "src", "data", "live");
const USER_AGENT = "Mozilla/5.0 (compatible; village-portal-data-fetch)";
const TIMEOUT_MS = 45000;

// data.gov.in publishes this sample key for trying the API. It is capped at 10
// records per call, which is enough for one district's daily paddy reports.
// Set DATA_GOV_IN_API_KEY (free account on data.gov.in) to lift the cap.
const SAMPLE_KEY = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b";
const MANDI_RESOURCE = "9ef84268-d588-465a-a308-a864a43d0070";
const HISTORY_DAYS = 90;

const CWC_BASE = "https://ffs.india-water.gov.in/iam/api";
const CWC_STATION = "028-LGDHYD"; // Dowlaiswaram (Sir Arthur Cotton Barrage)

const SACHET_FEED = "https://sachet.ndma.gov.in/cap_public_website/rss/rss_india.xml";
const ALERT_PATTERN = /west godavari|పశ్చిమ గోదావరి|dowlaiswaram|dowleswaram|ధవళేశ్వరం/i;

function readExisting(name) {
  try {
    return JSON.parse(fs.readFileSync(path.join(OUT_DIR, name), "utf8"));
  } catch {
    return null;
  }
}

function write(name, data) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, name), JSON.stringify(data, null, 2) + "\n", "utf8");
}

async function get(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json, application/xml, text/xml, */*" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${new URL(url).host}`);
  return res;
}

// "21/11/2026" -> "2026-11-21"
function toIsoDate(ddmmyyyy) {
  const [d, m, y] = String(ddmmyyyy).split("/");
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

async function fetchMandi() {
  const key = process.env.DATA_GOV_IN_API_KEY || SAMPLE_KEY;
  if (key === SAMPLE_KEY) {
    console.warn("[mandi] DATA_GOV_IN_API_KEY not set; using the public sample key (10 records max).");
  }
  const params = new URLSearchParams({
    "api-key": key,
    format: "json",
    limit: key === SAMPLE_KEY ? "10" : "100",
    "filters[state.keyword]": "Andhra Pradesh",
    "filters[district.keyword]": "West Godavari",
  });
  const json = await (await get(`https://api.data.gov.in/resource/${MANDI_RESOURCE}?${params}`)).json();
  if (!Array.isArray(json.records)) throw new Error(json.message || "no records array in response");
  if (json.records.length === 0) throw new Error("no West Godavari markets reported today");

  const records = json.records
    .map((r) => ({
      market: r.market,
      commodity: r.commodity,
      variety: r.variety,
      grade: r.grade,
      date: toIsoDate(r.arrival_date),
      min: Number(r.min_price),
      max: Number(r.max_price),
      modal: Number(r.modal_price),
    }))
    .sort((a, b) => a.market.localeCompare(b.market));

  // The feed only carries the current day, so keep our own history of the
  // modal paddy price at each market.
  const previous = readExisting("mandi.json");
  const history = new Map((previous?.history || []).map((h) => [`${h.date}|${h.market}|${h.commodity}`, h]));
  for (const r of records) {
    history.set(`${r.date}|${r.market}|${r.commodity}`, {
      date: r.date,
      market: r.market,
      commodity: r.commodity,
      modal: r.modal,
    });
  }
  const dates = [...new Set([...history.values()].map((h) => h.date))].sort().slice(-HISTORY_DAYS);
  const keep = new Set(dates);

  write("mandi.json", {
    fetchedAt: new Date().toISOString(),
    source: "Agmarknet daily mandi prices, via data.gov.in",
    sourceUrl: "https://www.data.gov.in/resource/current-daily-price-various-commodities-various-markets-mandi",
    unit: "INR per quintal",
    truncated: Number(json.total) > records.length,
    records,
    history: [...history.values()]
      .filter((h) => keep.has(h.date))
      .sort((a, b) => a.date.localeCompare(b.date) || a.market.localeCompare(b.market)),
  });
  console.log(`[mandi] ${records.length} records for ${records[0].date}`);
}

function cwcUrl(resource, sortField, pageSize, specification) {
  const params = new URLSearchParams({
    "sort-criteria": JSON.stringify({ sortOrderDtos: [{ sortDirection: sortField.dir, field: sortField.field }] }),
    "page-number": "0",
    "page-size": String(pageSize),
    specification: JSON.stringify(specification),
  });
  return `${CWC_BASE}/${resource}/specification/sorted-page?${params}`;
}

const eq = (fieldName, value) => ({ expression: { valueIsRelationField: false, fieldName, operator: "eq", value } });

async function fetchRiver() {
  const previous = readExisting("river.json");

  const readings = await (
    await get(
      cwcUrl("new-entry-data", { dir: "DESC", field: "id.dataTime" }, 48, {
        where: { where: eq("id.stationCode", CWC_STATION), and: eq("id.datatypeCode", "HHS") },
      })
    )
  ).json();
  if (!Array.isArray(readings) || readings.length === 0) throw new Error("no level readings returned");

  // Thresholds rarely change; fall back to the last saved ones if this call fails.
  let thresholds = previous?.thresholds || null;
  try {
    const [s] = await (
      await get(
        cwcUrl("flood-forecast-static", { dir: "ASC", field: "stationCode" }, 1, {
          where: eq("stationCode", CWC_STATION),
        })
      )
    ).json();
    if (s?.warningLevel) {
      thresholds = {
        warning: s.warningLevel,
        danger: s.dangerLevel,
        highestRecorded: s.highestFlowLevel,
        highestRecordedDate: s.highestFlowLevelDate,
      };
    }
  } catch (err) {
    console.warn(`[river] could not refresh thresholds: ${err.message}`);
  }

  const series = readings
    .filter((r) => typeof r.dataValue === "number")
    // CWC timestamps are Indian Standard Time without an offset.
    .map((r) => ({ time: `${r.id.dataTime}+05:30`, level: r.dataValue }))
    .reverse();

  write("river.json", {
    fetchedAt: new Date().toISOString(),
    source: "Central Water Commission flood forecast system",
    sourceUrl: "https://ffs.india-water.gov.in/",
    station: "Dowlaiswaram (Sir Arthur Cotton Barrage), Godavari",
    stationCode: CWC_STATION,
    unit: "metres",
    latest: series[series.length - 1],
    thresholds,
    readings: series,
  });
  console.log(`[river] level ${series[series.length - 1].level} m at ${series[series.length - 1].time}`);
}

function xmlText(block, tag) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  if (!m) return "";
  return m[1]
    .replace(/^<!\[CDATA\[|\]\]>$/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .trim();
}

async function fetchAlerts() {
  const xml = await (await get(SACHET_FEED)).text();
  const items = xml.match(/<item>[\s\S]*?<\/item>/g);
  if (!items) throw new Error("feed had no items (format may have changed)");

  const alerts = items
    .map((block) => ({
      title: xmlText(block, "title"),
      link: xmlText(block, "link"),
      issuer: (xmlText(block, "author").match(/\(([^)]+)\)/) || [])[1] || "",
      published: new Date(xmlText(block, "pubDate")).toISOString(),
    }))
    .filter((a) => ALERT_PATTERN.test(a.title));

  write("alerts.json", {
    fetchedAt: new Date().toISOString(),
    source: "NDMA SACHET national disaster alert feed",
    sourceUrl: "https://sachet.ndma.gov.in/",
    scannedCount: items.length,
    filter: "Alerts whose text names West Godavari district or the Dowleswaram barrage",
    alerts,
  });
  console.log(`[alerts] ${alerts.length} matching of ${items.length} national alerts`);
}

const jobs = { mandi: fetchMandi, river: fetchRiver, alerts: fetchAlerts };
const failed = [];

for (const [name, job] of Object.entries(jobs)) {
  try {
    await job();
  } catch (err) {
    failed.push(name);
    console.error(`[${name}] FAILED: ${err.message} (keeping previous file)`);
  }
}

// Fail the workflow only when nothing could be refreshed, so the owner gets
// an email for a real outage but not for one flaky source.
if (failed.length === Object.keys(jobs).length) {
  console.error("All data sources failed.");
  process.exit(1);
}

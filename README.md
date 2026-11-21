# 🌾 Nadipudi Digital Village Portal (నడిపూడి గ్రామ సమాచార వేదిక)

> **Centralized Public Information Gateway for Nadipudi Village, Penugonda Mandal, West Godavari District, Andhra Pradesh - 534326**

🌐 **Live Website**: [https://krishnasidhvi.github.io/nadipudi-village-portal/](https://krishnasidhvi.github.io/nadipudi-village-portal/)

---

> **This is a volunteer-run community site. It is not an official government website.**

## What the portal shows

Every figure on the site carries its source and the date it was observed. Nothing is estimated or invented; where no reliable public source exists, the page says so.

| Page | Address | Content | Source |
|---|---|---|---|
| Home | `/` | Weather now, paddy price, Godavari level, census headline figures | see below |
| Temple | `/temple/` | Sri Subramanyeswara Swamy Temple: timings, pujas, festivals, photos | community (to be confirmed with the temple priests) |
| Village Map & 3D | `/map/` | 2D map, 3D layout of the village's buildings, directions, distances, neighbouring villages | OpenStreetMap; Google Open Buildings via Overture Maps; Esri imagery |
| Agriculture & Weather | `/agriculture/` | Current weather and 3-day forecast | [Open-Meteo](https://open-meteo.com/), fetched in the browser |
| | | Paddy prices at Penugonda and other West Godavari markets | [Agmarknet via data.gov.in](https://www.data.gov.in/) |
| | | Godavari level at Dowleswaram barrage with warning/danger levels | [Central Water Commission](https://ffs.india-water.gov.in/) |
| Schemes | `/schemes/` | Welfare scheme guide with official application links | scheme portals |
| Notices & Alerts | `/notices/` | Official disaster alerts naming West Godavari; confirmed village notices | [NDMA SACHET](https://sachet.ndma.gov.in/) |
| Village Data | `/village-data/` | Population, literacy, workers, land use | Census of India 2011 (village code 588686) |
| Voter Services | `/elections/` | Links to Election Commission services | ECI |
| Helplines & Secretariat | `/directory/` | Emergency numbers; who handles which service | national short codes |
| Filing a Grievance | `/grievances/` | How to use the official PGRS / Mee Kosam system | AP PGRS |

Telugu and English are both supported throughout.

## How the data stays current

- **Weather** is fetched by the visitor's browser from Open-Meteo each time (cached for 30 minutes). It is a weather-model estimate, not a village measurement.
- **Mandi prices, river level and alerts** are fetched twice a day by `.github/workflows/refresh-live-data.yml`, which runs `scripts/fetchLiveData.js`, commits `src/data/live/*.json` and starts a deploy.
- If a source fails, its previous file is kept and the site marks that reading as out of date. It never shows a made-up value.
- **The refresh runs on a self-hosted runner in India**, because data.gov.in and the CWC site refuse connections from GitHub's own servers. The runner (`nadipudi-home-pc`, label `india`) is installed in `%USERPROFILE%ctions-runner
adipudi-village-portal` and is started at logon by the scheduled task "GitHub runner - Nadipudi portal". If the PC is off, the refresh waits and runs when it is back online (up to 24 hours).
- Because the repository is public, workflow runs from outside contributors' pull requests need the owner's approval (Settings → Actions → General). Keep it that way: a self-hosted runner executes code on that PC.
- To remove the runner: in the runner folder run `config.cmd remove --token <token>` (token from Settings → Actions → Runners → the runner → Remove), then delete the scheduled task.

### One-time setup: data.gov.in API key

Mandi prices need a free API key. Without one the script falls back to data.gov.in's shared sample key, which is rate-limited and often refused.

1. Create a free account at [data.gov.in](https://www.data.gov.in/) and copy the API key from your profile.
2. In the GitHub repository: **Settings → Secrets and variables → Actions → New repository secret**, name `DATA_GOV_IN_API_KEY`.

## Map and 3D layout

- `src/data/map/osm.json`: roads, the Godavari, villages, towns, stations and the airport from OpenStreetMap. Refresh with `npm run fetch-map`.
- `src/data/map/buildings.json`: building outlines from [Overture Maps](https://overturemaps.org/) (here sourced from Google Open Buildings). Refresh with `pip install duckdb` then `python scripts/fetch_buildings.py` (takes a few minutes).
- No height data exists for these buildings, so the 3D view draws them all at the same height. It shows the village's real layout, not what the houses look like.
- No village boundary is drawn because no openly licensed official boundary is available.
- The 3D library loads only when someone opens the 3D tab.
- The easiest way to improve both maps is to add the temple, schools, canals and buildings to OpenStreetMap, then re-run the two fetch commands.

## Adding content

- **Notices and news:** add entries to `src/data/noticeData.js`. Only confirmed notices, each with its real issue date and who issued it.
- **Sachivalayam staff:** `src/data/directoryData.js` lists roles only. Add a name or phone number only after confirming it with that person and getting their consent.
- **Census and admin facts:** `src/data/censusData.js`. Note there is another Nadipudi in Amalapuram mandal; check the village code (588686) before copying figures from aggregator sites.

Not yet available from any open source, and therefore not shown: shrimp and coconut prices, barrage inflow/outflow in cusecs, ward and voter counts, scheme beneficiary numbers.

## 🛠️ Technology Stack

* **Frontend**: React 19 + Vite, plain CSS, Lucide icons, Chart.js
* **Pages**: each page has its own address; `scripts/postbuild.js` writes a real HTML file per page plus `sitemap.xml`
* **Deployment**: GitHub Pages via GitHub Actions
* **Linting**: Oxlint

---

## 🚀 Local Development Setup

To run the project locally on your machine:

```bash
# 1. Clone the repository
git clone https://github.com/krishnasidhvi/nadipudi-village-portal.git

# 2. Navigate to the project directory
cd "Nadipudi village portal"

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev

# 5. Build production bundle (also writes per-page HTML and sitemap.xml)
npm run build

# Optional: refresh mandi prices, river level and alerts locally
npm run fetch-data
```

---

## 📜 Disclaimer

*This is a volunteer-run community information site and is not affiliated with the Government of Andhra Pradesh or the Government of India. It collates publicly available information for community benefit. Confirm with the official source before relying on it for important decisions.*

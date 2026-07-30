# 🌾 Nadipudi Digital Village Portal (నడిపూడి గ్రామ సమాచార వేదిక)

> **Centralized Public Information Gateway for Nadipudi Village, Penugonda Mandal, West Godavari District, Andhra Pradesh - 534326**

🌐 **Live Website**: [https://krishnasidhvi.github.io/nadipudi-village-portal/](https://krishnasidhvi.github.io/nadipudi-village-portal/)

---

## 🎯 Motto of the Portal

> *"Empowering rural citizens with instant, transparent, and seamless digital access to agriculture, welfare schemes, civic governance, and emergency services."*
> 
> **"ప్రజల చెంతకే డిజిటల్ సేవలు - నడిపూడి అభివృద్ధికి సమాచార వేదిక"**

The **Nadipudi Digital Village Portal** serves as a single-window digital hub designed specifically for the residents of Nadipudi village. It bridges the gap between rural citizens and government welfare programs, market commodity rates, crop insurance portals, local administration contacts, and disaster management updates.

---

## 💡 Key Portal Features

* **🌾 Agriculture & Crop Hub**: Real-time market commodity prices (Swarna Paddy, Coconuts, Vannamei Shrimp, Red Chilli, Sugarcane) across Marteru, Penugonda, Tanuku, Bhimavaram & Palakollu mandis. Live Sir Arthur Cotton Barrage canal inflow/outflow data, weather advisories, e-Crop status, and PMFBY links.
* **🏛️ Government Welfare Schemes Directory**: Filterable catalog covering agriculture support (PMFBY, Annadata Sukhibhava / Rythu Bharosa), education (Talliki Vandanam), social security pensions (NTR Bharosa), and affordable housing (PMAY-Gramin) with step-by-step eligibility, document checklists, and verified application links.
* **🗺️ Interactive Village Boundary Map**: GIS-style map highlighting key village landmarks, Grama Sachivalayam, ZP High School, MP Elementary Schools, primary health centers, and agricultural field blocks.
* **🗳️ Elections & Electoral Roll**: EPIC Voter ID search, polling station booth locator (Wards 1 through 8), downloadable ECI Form 6/8 registration guides, and official election notifications.
* **📌 Village Notice Board**: Panchayat announcements, APEPDCL scheduled power outage notifications, drinking water supply timings, and local news feed.
* **📞 Sachivalayam Directory & Helplines**: Contact details for Grama Sachivalayam staff (Panchayat Secretary, Digital Assistant, VRO, ANM, Agriculture Assistant) and 24/7 emergency helplines.
* **🤝 Spandana Grievance Redressal**: Step-by-step guide and local helpdesk form to lodge public grievances directly to Penugonda Tahsildar / West Godavari Collectorate.
* **🌐 Bilingual Support**: Instant language switching between Telugu (తెలుగు) and English for accessibility.

---

## ⚡ Challenges Overcome During Development

Building a centralized digital portal for a rural community presented several unique technical, architectural, and usability challenges:

### 1. Handling Frequent Domain & Scheme Name Changes
* **Challenge**: Government welfare schemes and official portal URLs frequently undergo domain migrations, renames, and server updates (e.g., transition of *Rythu Bharosa* to *Annadata Sukhibhava*, *Amma Vodi* to *Talliki Vandanam*, and *Spandana* to *Mee Kosam*).
* **Solution**: Developed a central data verification workflow and automated link audit scripts. All 15+ external links are continuously verified for HTTP 200 OK status to ensure users are never directed to dead or outdated links.

### 2. Bilingual Script & Localized Terminology
* **Challenge**: Technical government jargon can be difficult for rural citizens to navigate. Providing accurate Telugu script alongside English while keeping the UI clean was critical.
* **Solution**: Implemented a lightweight i18n translation system (`translations.js`) that dynamically updates labels, card details, document requirements, and status badges without re-rendering the app state.

### 3. Low-Bandwidth & Mobile-First Optimization
* **Challenge**: Rural users frequently access the portal on mobile devices over 3G/4G networks with limited bandwidth.
* **Solution**: Built using Vite and React with minimal third-party dependencies, leveraging pure CSS design tokens and Lucide icons. Production bundle size is optimized for fast sub-second loading speeds.

### 4. Cross-Referencing National & State Digital Services
* **Challenge**: Farmers and citizens previously had to navigate multiple disconnected websites (PM-Kisan, AP e-Crop, PMFBY, ECI, Agmarknet).
* **Solution**: Synthesized multi-source data into intuitive tabbed dashboards, consolidating government services into a single click-through portal.

---

## 🛠️ Technology Stack

* **Frontend Framework**: React 18 + Vite
* **Styling**: Modern Vanilla CSS with CSS custom properties (tokens), responsive flex/grid layouts, and glassmorphism cards
* **Iconography**: Lucide React
* **Deployment**: GitHub Pages via GitHub Actions CI/CD pipeline
* **Quality Assurance**: Automated HTTP link diagnostics & Oxlint

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

# 5. Build production bundle
npm run build
```

---

## 📜 Disclaimer

*This portal collates publicly available information published by the Government of Andhra Pradesh, Government of India, and West Godavari District Administration for community welfare and informational purposes.*

# AYPO — Disaster Reunification & Coordination Platform

> **CONNECT. VERIFY. REUNITE.**  
> *National Disaster Management & Civilian Reunification Network • Public Safety Enterprise Platform*

---

## Overview

**AYPO** is a unified emergency management and family reunification platform engineered for disaster response operations. When disasters destroy physical infrastructure, family members become separated and records are scattered across hospitals, municipal shelters, and volunteer teams.

AYPO unites all stakeholders under **ONE platform** with **FOUR role-based portals**:
1. **👨‍👩‍👧 Family Portal**: Search missing persons, file reports, track verified updates with strict medical/operational data isolation, and confirm reunification.
2. **🚑 Public Service Portal**: Hospitals, ambulances, and relief camps manage bed capacity, patient admissions, shelter evacuee rosters, and triage tags (`GREEN`, `YELLOW`, `RED`, `BLACK`).
3. **🤝 Private Organization Portal**: NGOs, Red Cross, and volunteer squads coordinate search sectors, supply logistics, and submit observational field matches.
4. **🏛️ Government Command Portal**: Emergency Operations Center (NDMC) command dashboard, verification certification desk, duplicate detection & merge console, disaster analytics, and tactical GIS map.

---

## Key Features

- **Offline-First Disaster Mode**: Uses local IndexedDB queues so emergency field workers can capture records without cellular towers or internet. Automatic batch synchronization triggers upon uplink restoration.
- **Responsible AI-Assisted Matching**: Evaluates phonetic name similarity, age proximity, gender concordance, physical attributes, and sector radius to present confidence scores (e.g., 91% for Raj Kumar vs Rajkumar). AI only recommends; human authority verification is strictly mandatory.
- **Data Isolation & Least-Privilege Security**: Sensitive medical charts and internal government memos are strictly redacted from family and public views.
- **Interactive Tactical GIS Map**: OpenStreetMap Leaflet integration with emergency tactical pins for shelters, hospitals, found survivors, and missing reports.
- **High-Contrast Emergency SOS Mode**: Instant one-click toggle for low-light, high-stress field conditions.
- **10-Step Interactive Story Runner**: Docked hackathon presentation controller to demonstrate the complete 10-step disaster story from intake to emotional reunification.

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Build for production (TypeScript check & Vite bundling)
npm run build

# 3. Start local development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

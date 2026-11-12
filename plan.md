# Ask Enugu — Implementation Plan & Architecture Specification
**Document Version:** 1.0  
**Target Environment:** Next.js (App Router), Tailwind CSS, Mapbox GL JS, Google Gemini API  
**Brand Identity Alignment:** Ask Enugu Identity Guidelines v1.0 (October 2026)

---

## 1. Project Vision & Overview
**Ask Enugu** is a proposed independent, public-interest platform designed to make Enugu State government information, policies, budgets, and public infrastructure projects easy to find, understand, and verify.

The platform provides two seamless, interconnected ways to access verified public records:
1. **The America.gov-Style AI Copilot:** A minimal, welcoming search and conversational interface for natural language queries (e.g. *"What projects are approved for Nsukka in the 2024 budget?"*) delivering plain-language answers backed strictly by official citations, photos, and evidence-gap disclosures.
2. **The Interactive Mapbox Explorer:** A dedicated, geofenced visual map at the top of the portal, spotlighting all 17 Local Government Areas (LGAs) of Enugu State, allowing users to drill down into wards, view geolocated projects, and inspect physical photo proof.

---

## 2. Brand Identity & Design Tokens

### Color Palette
* **Deep Green (`#082C20`):** Main dark canvas background, high-contrast headings, dark card surfaces.
* **Brand Green (`#068237`):** Primary action buttons, active toggles, verified status badges.
* **Gold (`#E8A812`):** Insight & clarity accents, active map pins, highlighted text (never body copy on white).
* **Light Neutral (`#E8F5E9`):** Card containers, subtle badges, tinted backgrounds.
* **Dark Neutral (`#1F2C35`):** Secondary text and border accents.

### Typography
* **Font Family:** Gotham (Book for body copy, Medium for UI labels/chips, Bold for titles and section headings, Black for wordmark).
* **Tone of Voice:** Helpful, direct, objective, and transparent about sources:
  * *"The available records show..."*
  * *"An explanation is not available in the records reviewed."*

### UI Design Philosophy (Inspired by America.gov)
* Ultra-clean, distraction-free dark layout (`#082C20`).
* Prominent hero greeting: **"Hello, Enugu"**
* Subheading: *"Whatever you need to know from government, start here."*
* Floating pill search/prompt bar with attachment, voice, and send buttons.
* Official civic disclaimer banner at the very top.

---

## 3. Environment & Credentials Configuration

The following credentials are configured for local development in `.env.local`:

```env
# Mapbox Configuration
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoiaXp1Y2h1a3d1am9obmJvc2NvOTUiLCJhIjoiY213YzFzZzJ5MDFjdTJ6cXpyZjhiNTMxOCJ9.SQtJxu1766AJWuQtOjvWLA

# Google Gemini API
GEMINI_API_KEY=AQ.Ab8RN6JrUD6EPXytbKo4w02QjgpP3AXvwj6QxskCNut3DctHOQ
```

---

## 4. Architectural Components & Features

### Component A: Header & Civic Disclaimer Banner
* **Top Banner:** High-contrast bar: *"A proposed independent public-interest platform for Enugu State"*.
* **Navigation Bar:**
  * Left: Ask Enugu Logo (State silhouette + speech curve + gold dot).
  * Right: Map Toggle button (`[🗺️ Show / Hide Map]`), Quick Links (`[Projects]`, `[Budgets]`), and `[Menu]`.

### Component B: The Top Mapbox Explorer (Enugu Geofenced)
* **Geographic Boundary:** Camera strictly locked to the bounding box of Enugu State (Lat: ~6.0 to 7.1° N, Lng: ~6.9 to 7.9° E).
* **Level 1 (State View):**
  * Displays polygon outlines and label markers for all **17 LGAs**:
    * *Aninri, Awgu, Enugu East, Enugu North, Enugu South, Ezeagu, Igbo-Etiti, Igbo-Eze North, Igbo-Eze South, Isi-Uzo, Nkanu East, Nkanu West, Nsukka, Oji River, Udenu, Udi, Uzo-Uwani.*
  * Quick-filter pills at the top of the map to jump directly to any LGA.
* **Level 2 (LGA Zoom & Ward Drill-down):**
  * Clicking an LGA smoothly zooms and bounds the camera to that local council.
  * Shows project clusters and ward-level pins.
* **Level 3 (Project Detail Drawer / Modal):**
  * Clicking any project pin displays a slide-out card with:
    * Project Name, Category (Education, Health, Works, Water, etc.).
    * LGA and Ward/Community.
    * Implementation Status (Completed, Ongoing, Proposed, Stalled).
    * Approved Budget / Amount & Contractor / MDA.
    * Source Document Reference & Verified Inspection Photos.
    * 1-Click Button: **"Ask AI About This Project"** (instantly opens chat with context preloaded).

### Component C: The America.gov Minimal Hero & Query Box
* Centered on the page below the map.
* Large headline: **"Hello, Enugu"**
* Subtitle: *"Whatever you need to know from government, start here."*
* Search container with:
  * Input placeholder: *"Try 'What schools are being built in Udenu?'"*
  * Attachment icon (to upload a budget page or document for verification).
  * Microphone icon (voice search for accessibility).
  * Submit arrow button (`#068237`).
* Quick-prompt suggestion tags:
  * `[📊 2024 State Budget]`
  * `[🏫 Smart Green Schools]`
  * `[🛣️ Urban & Rural Roads]`
  * `[💧 Water Scheme Updates]`

### Component D: AI Answer Engine & Grounded Evidence Card
* Powered by Google Gemini.
* **Strict Grounding:** Responds only using the provided document database and verified project records.
* **Evidence Presentation:**
  * Clean summary answer in plain language.
  * Clickable source badges (e.g., *Enugu State 2024 Appropriation Law, Page 112*).
  * Photo evidence grid.
  * Explicit gap disclaimer if no official records exist.

---

## 5. Implementation Steps

### Phase 1: Environment & Token Setup
1. Create `.env.local` containing the Mapbox token and Gemini API key.
2. Configure Tailwind CSS variables to support brand colors (`#082C20`, `#068237`, `#E8A812`, `#E8F5E9`, `#1F2C35`).

### Phase 2: Data Structures & Mock Seed Data
1. Create `data/enugu-lgas.json`: Coordinates and metadata for the 17 LGAs.
2. Create `data/projects.json`: Curated schema for projects across LGAs (Smart Schools, roads, healthcare centers, water projects, budgets, contractor names, photos).

### Phase 3: Mapbox Component (`components/EnuguMap.jsx`)
1. Integrate `mapbox-gl`.
2. Set initial view centered on Enugu State (`[7.51, 6.44]`, zoom: 8.5).
3. Add LGA click handlers with fly-to camera animations.
4. Add project markers with custom gold/green styling.
5. Create the Project Details slide-out modal.

### Phase 4: America.gov Hero & Search (`components/HeroSearch.jsx`)
1. Build the top disclaimer banner and brand navigation bar.
2. Build the minimalist "Hello, Enugu" hero.
3. Build the floating query input and suggestion chips.

### Phase 5: Gemini API RAG Route (`app/api/ask/route.js`)
1. Create API route integrating `@google/genai` or Gemini REST API.
2. Inject system prompt enforcing the brand voice: direct, grounded in evidence, citing sources, acknowledging missing data.
3. Format output with evidence cards and photo attachments.

---

## 6. What Is Needed Next
1. **Initial Project List / Spreadsheet:** Any preliminary list of projects or official documents you want preloaded into the system.
2. **Photos / Visual Proof:** Project site photos or links to be attached to project pins.


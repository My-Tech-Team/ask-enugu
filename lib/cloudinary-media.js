// Verified media catalog and Cloudinary asset service for AskEnugu
// Fetches live from Cloudinary Media Library with in-memory cache and built-in offline fallback

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "zl99z5t1";
const API_KEY = process.env.CLOUDINARY_API_KEY || "293496597663589";
const API_SECRET = process.env.CLOUDINARY_API_SECRET || "Bz0r8npsXAsEEhfLtsLEkl9DvXk";

import { PROJECTS } from "../data/enugu-data.js";

// Sector metadata for user display
export const SECTOR_INFO = {
  "smart-school": {
    sector: "smart-school",
    title: "Smart Green School Infrastructure",
    description: "Verified field photos of Smart Green School models featuring interactive digital smartboards, solar power, and modern laboratories.",
    keywords: ["school", "education", "smart green", "teacher", "student", "classroom", "enspeb", "owo", "learning", "curriculum"],
  },
  roads: {
    sector: "roads",
    title: "Road Construction & Urban Infrastructure",
    description: "Aerial and ground verification photos of dualization, flyover development, and asphalt paving across Enugu State.",
    keywords: ["road", "roads", "highway", "flyover", "asphalt", "dualization", "bridge", "paving", "street", "new enugu city", "reconstruction"],
  },
  terminal: {
    sector: "terminal",
    title: "Modern Transport Terminals",
    description: "Verified photographs of central transport terminals, passenger boarding facilities, and inter-state transit stations.",
    keywords: ["terminal", "terminals", "transport", "bus", "transit", "holy ghost", "gariki", "nsukka terminal", "abakpa", "logistics"],
  },
  hospital: {
    sector: "hospital",
    title: "Healthcare Centers & General Hospitals",
    description: "Verified photos of 260 Type-2 Primary Healthcare Centers and hospital modernization projects across Enugu State.",
    keywords: ["health", "healthcare", "hospital", "hospitals", "clinic", "phc", "type-2", "parklane", "medical", "maternal", "doctor", "nurse"],
  },
  security: {
    sector: "security",
    title: "Security & Emergency Response Infrastructure",
    description: "Verified equipment photos of the Distress Response Squad (DRS), patrol vehicles, and the CCTV Security Command Centre.",
    keywords: ["security", "police", "drs", "distress response squad", "cctv", "surveillance", "patrol", "crime", "safety", "command centre"],
  },
  water: {
    sector: "water",
    title: "Water Supply & Pumping Infrastructure",
    description: "Photographs of the 9th Mile 24/7 crash programme, industrial solar pumping stations, and regional reticulation lines.",
    keywords: ["water", "9th mile", "ajali", "oji river", "crash program", "borehole", "pumping", "reservoir", "pipeline", "tap"],
  },
  agriculture: {
    sector: "agriculture",
    title: "Agricultural Mechanization & Agro-Processing",
    description: "Photographs of agricultural tractor mechanization schemes, commercial farming investments, and Special Agro-Processing Zones (SAPZ).",
    keywords: ["agriculture", "agric", "farm", "farming", "crop", "tractor", "mechanization", "sapz", "harvest", "agro-processing", "farmer"],
  },
};

// Built-in verified catalog fallback
const DEFAULT_CATALOG = {
  "smart-school": [
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920314/1H1A0613_omzzpx.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920311/1H1A0610_ymtx2w.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920309/1H1A0611_ra3udk.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920308/1H1A0612_csqmtw.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920303/1H1A0607_w3lfam.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920291/1H1A0604_sjipva.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920276/1H1A0597_ywmt2d.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920275/1H1A0598_sslsws.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920274/1H1A0614_cqporn.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920271/1H1A0596_rgzone.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920271/1H1A0599_rigjua.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920264/1H1A0603_nxdk6k.jpg",
  ],
  roads: [
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920983/DJI_0205_fzaesv.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920981/DJI_0204_f0bes4.jpg",
  ],
  terminal: [
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794921329/images_2_umulem.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794921328/images_3_w2yxwj.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794921325/images_4_fhwyrf.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794921325/images_5_uhl4cs.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794921324/images_6_xua2oz.jpg",
  ],
  hospital: [
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920837/DJI_0850_vkbqqw.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920831/DJI_0448_zg3tef.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920824/DJI_0853_pmi1uw.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920821/DJI_0449_u7pif9.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920686/homeoverviewimage-arbcmmkd_1_w3naaq.png",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920686/interestedinpatteringimage-apuz5kix_hyefrg.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920685/homeoverviewimage-arbcmmkd_qcdnje.png",
  ],
  security: [
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794921479/images_7_eu9oe7.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794921478/images_8_idsqdy.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794921476/images_9_x0ntlh.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794921474/images_10_qrcbtd.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794921473/images_11_kbgf9y.jpg",
  ],
  water: [
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794921814/images_15_wmerk3.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794921812/images_16_pope7k.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794921811/images_17_szvqth.jpg",
  ],
  agriculture: [
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794921604/images_12_sgidya.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794921602/images_13_pieejp.jpg",
    "https://res.cloudinary.com/zl99z5t1/image/upload/v1794921601/images_14_gctolf.jpg",
  ],
};

// In-memory cache for live Cloudinary fetch
let memoryCatalog = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Fetch images from Cloudinary's Search API with fallback
 */
export async function getCloudinaryCatalog() {
  const now = Date.now();
  if (memoryCatalog && now - lastFetchTime < CACHE_TTL_MS) {
    return memoryCatalog;
  }

  if (!API_KEY || !API_SECRET || !CLOUD_NAME) {
    return DEFAULT_CATALOG;
  }

  try {
    const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64");
    const postData = JSON.stringify({
      expression: 'folder:"Ask-enugu/images/*"',
      max_results: 100,
    });

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/search`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: postData,
    });

    if (!response.ok) {
      console.warn("Cloudinary Search API returned status:", response.status);
      return memoryCatalog || DEFAULT_CATALOG;
    }

    const data = await response.json();
    const grouped = { ...DEFAULT_CATALOG };

    if (Array.isArray(data.resources)) {
      data.resources.forEach((r) => {
        if (r.resource_type !== "image") return; // exclude video files from photo gallery
        const folder = (r.asset_folder || "").split("/").pop();
        if (folder && folder !== "images") {
          if (!grouped[folder]) grouped[folder] = [];
          if (!grouped[folder].includes(r.secure_url)) {
            grouped[folder].push(r.secure_url);
          }
        }
      });
    }

    memoryCatalog = grouped;
    lastFetchTime = now;
    return grouped;
  } catch (err) {
    console.error("Cloudinary live fetch error:", err);
    return memoryCatalog || DEFAULT_CATALOG;
  }
}

/**
 * Find relevant Cloudinary media gallery for a user query
 */
export async function getRelevantMedia(query, localRecords = []) {
  const catalog = await getCloudinaryCatalog();
  const lowerQuery = (query || "").toLowerCase();

  const sectorScores = {
    "smart-school": 0,
    roads: 0,
    terminal: 0,
    hospital: 0,
    security: 0,
    water: 0,
    agriculture: 0,
  };

  // 1. Give heavy weight to the top matched local knowledge files
  if (localRecords.length > 0) {
    const topFiles = localRecords.slice(0, 3).map((r) => r.file || "");
    topFiles.forEach((file, index) => {
      const weight = (3 - index) * 5;
      if (file.includes("education")) sectorScores["smart-school"] += weight;
      if (file.includes("security")) sectorScores["security"] += weight;
      if (file.includes("water")) sectorScores["water"] += weight;
      if (file.includes("health")) sectorScores["hospital"] += weight;
      if (file.includes("agric")) sectorScores["agriculture"] += weight;
      if (file.includes("infrastructure")) {
        if (lowerQuery.includes("terminal") || lowerQuery.includes("bus")) sectorScores["terminal"] += weight;
        else sectorScores["roads"] += weight;
      }
    });
  }

  // 2. Score keyword matches in user query
  for (const [sec, info] of Object.entries(SECTOR_INFO)) {
    info.keywords.forEach((kw) => {
      if (lowerQuery.includes(kw)) {
        sectorScores[sec] += 6;
      }
    });
  }

  // Find highest scoring sector
  let bestSector = null;
  let maxScore = 0;
  for (const [sec, score] of Object.entries(sectorScores)) {
    if (score > maxScore) {
      maxScore = score;
      bestSector = sec;
    }
  }

  if (bestSector && maxScore >= 4 && catalog[bestSector]?.length > 0) {
    const info = SECTOR_INFO[bestSector];
    return {
      sector: bestSector,
      title: info.title,
      description: info.description,
      images: catalog[bestSector],
    };
  }

  return null;
}

/**
 * Find matching public projects from enugu-data.js
 */
export function getMatchingProjects(query, limit = 2) {
  if (!Array.isArray(PROJECTS) || PROJECTS.length === 0) return [];
  const lower = (query || "").toLowerCase();

  const scored = PROJECTS.map((p) => {
    let score = 0;
    const pTitle = (p.title || "").toLowerCase();
    const pCat = (p.category || "").toLowerCase();
    const pLga = (p.lgaName || "").toLowerCase();

    if (lower.includes(pLga) && pLga.length > 3) score += 10;
    if (lower.includes("school") && pCat.includes("education")) score += 8;
    if ((lower.includes("health") || lower.includes("clinic") || lower.includes("hospital")) && pCat.includes("health")) score += 8;
    if (lower.includes("water") && pCat.includes("water")) score += 8;
    if ((lower.includes("road") || lower.includes("highway") || lower.includes("flyover")) && (pCat.includes("road") || pCat.includes("infrastructure"))) score += 8;
    if ((lower.includes("agric") || lower.includes("farm") || lower.includes("crop") || lower.includes("tractor")) && pCat.includes("agric")) score += 8;
    if ((lower.includes("terminal") || lower.includes("bus")) && (pCat.includes("transport") || pTitle.includes("terminal") || pCat.includes("commerce"))) score += 8;
    if (lower.includes("conference") && pTitle.includes("conference")) score += 12;

    pTitle.split(" ").forEach((word) => {
      if (word.length > 4 && lower.includes(word)) score += 4;
    });

    return { project: p, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((item) => item.project);
}


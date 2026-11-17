import fs from "fs";
import path from "path";

const KNOWLEDGE_DIR = path.join(process.cwd(), "data", "knowledge");

let cachedKnowledge = null;
let lastLoadTime = 0;
const CACHE_TTL_MS = 8000; // Auto-reload if files are edited

function loadKnowledgeFiles() {
  const now = Date.now();
  if (cachedKnowledge && now - lastLoadTime < CACHE_TTL_MS) {
    return cachedKnowledge;
  }

  if (!fs.existsSync(KNOWLEDGE_DIR)) {
    return [];
  }

  const files = fs.readdirSync(KNOWLEDGE_DIR).filter((f) => f.endsWith(".md"));
  const documents = [];

  // Delimiter matches Markdown headings (#, ##, ###), numbered sections (e.g., "1. Title", "2.1 Subtitle"), and horizontal dividers (---)
  const sectionDelimiter = /\n(?=(?:#{1,3}\s+|\d+(?:\.\d+)+\s+[A-Za-z]|\d+\.\s+[A-Za-z]|---))/;

  for (const filename of files) {
    try {
      const fullPath = path.join(KNOWLEDGE_DIR, filename);
      const rawContent = fs.readFileSync(fullPath, "utf-8");
      const friendlyName = filename === "general.md"
        ? "Government House Performance Publication & Independent Review"
        : filename
            .replace(/\.md$/, "")
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

      const sections = rawContent
        .split(sectionDelimiter)
        .map((sec) => sec.trim())
        .filter((sec) => sec.length > 25);

      for (const section of sections) {
        // Extract section title from the first line
        const firstLine = section.split("\n")[0].trim();
        let title = friendlyName;

        const mdMatch = firstLine.match(/^#{1,3}\s+(.+)/);
        const numMatch = firstLine.match(/^(\d+(?:\.\d+)*\.?\s+[A-Za-z0-9\s—–,\-&()'/]+)/);

        if (mdMatch) {
          title = mdMatch[1].trim();
        } else if (numMatch) {
          title = numMatch[1].trim();
        } else if (firstLine.length < 90 && !firstLine.startsWith("•") && !firstLine.startsWith("-")) {
          title = firstLine;
        }

        documents.push({
          file: filename,
          sourceName: `Enugu State Official Records: ${friendlyName} — "${title}"`,
          title,
          category: friendlyName,
          content: section,
        });
      }
    } catch (err) {
      console.error(`Error reading knowledge file ${filename}:`, err);
    }
  }

  cachedKnowledge = documents;
  lastLoadTime = now;
  return documents;
}

export function searchLocalKnowledge(query, limit = 8) {
  const documents = loadKnowledgeFiles();
  if (!documents.length || !query) return [];

  const cleanQuery = query.toLowerCase().replace(/[^a-z0-9\s-]/g, " ");
  const rawTerms = cleanQuery
    .split(/\s+/)
    .filter((t) => t.length >= 3);

  // Common stopwords to filter out
  const stopwords = new Set([
    "what", "when", "where", "which", "about", "tell", "show", "have", "with",
    "from", "that", "this", "state", "enugu", "does", "done", "been", "they",
    "will", "would", "their", "there", "much", "many", "give", "please", "know"
  ]);

  const searchTerms = rawTerms.filter((t) => !stopwords.has(t));
  const termsToUse = searchTerms.length > 0 ? searchTerms : rawTerms;

  const scored = documents.map((doc) => {
    const textLower = doc.content.toLowerCase();
    const titleLower = doc.title.toLowerCase();
    const categoryLower = doc.category.toLowerCase();
    let score = 0;

    // Check exact phrase if query is longer than 1 word
    if (termsToUse.length >= 2 && textLower.includes(cleanQuery.trim())) {
      score += 25;
    }

    for (const term of termsToUse) {
      // Direct category or title hits receive significant weight
      if (categoryLower.includes(term)) score += 6;
      if (titleLower.includes(term)) score += 10;

      // Count term occurrences in content
      if (textLower.includes(term)) {
        score += 3;
        // Extra boost for multiple occurrences
        const matches = textLower.split(term).length - 1;
        score += Math.min(matches, 6);
      }
    }

    return { ...doc, score };
  });

  const matching = scored
    .filter((d) => d.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  if (matching.length > 0) {
    return matching;
  }

  // Fallback to top introductory sections if no keyword matches
  return documents.slice(0, 4);
}

const OFFICIAL_SOURCES = [
  {
    name: "Enugu State Project Monitoring & Accountability Platform",
    url: "https://projects.enugustate.gov.ng/projects",
  },
  {
    name: "Enugu State Government News",
    url: "https://enugustate.gov.ng/news-3/",
  },
];

const decodeHtml = (value) =>
  value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");

const htmlToSections = (html) =>
  decodeHtml(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<\/(p|h[1-6]|li|article|section|div|br)>/gi, "\n")
      .replace(/<[^>]*>/g, " ")
  )
    .split(/\n+/)
    .map((section) => section.replace(/\s+/g, " ").trim())
    .filter((section) => section.length >= 40);

const relevantSections = (sections, query) => {
  const terms = query.toLowerCase().match(/[a-z0-9]+/g)?.filter((term) => term.length > 3) || [];
  const ranked = sections
    .map((section) => ({
      section,
      score: terms.reduce((score, term) => score + (section.toLowerCase().includes(term) ? 1 : 0), 0),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map(({ section }) => section);

  return (ranked.length > 0 ? ranked : sections.slice(0, 8)).join("\n").slice(0, 9000);
};

export async function getOfficialSourceContext(query) {
  const results = await Promise.all(
    OFFICIAL_SOURCES.map(async (source) => {
      try {
        const response = await fetch(source.url, {
          headers: { "User-Agent": "AskEnugu/1.0 public-records reader" },
          signal: AbortSignal.timeout(8000),
          next: { revalidate: 900 },
        });
        if (!response.ok) return null;
        const sections = htmlToSections(await response.text());
        if (sections.length === 0) return null;
        return { ...source, excerpt: relevantSections(sections, query) };
      } catch {
        return null;
      }
    })
  );

  return results.filter(Boolean);
}

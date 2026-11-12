import { PROJECTS, LGAS } from "@/data/enugu-data";

export async function POST(req) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string") {
      return Response.json({ error: "A valid query is required." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Filter relevant projects for grounding
    const lowerQuery = query.toLowerCase();
    const matchedProjects = PROJECTS.filter((p) => {
      return (
        p.title.toLowerCase().includes(lowerQuery) ||
        p.lgaName.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        p.ward.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
      );
    });

    const contextGrounding = `
You are the official intelligence engine for "Ask Enugu" — a proposed independent public-interest platform for finding, understanding, and verifying government information in Enugu State, Nigeria.

BRAND & VOICE GUIDELINES:
1. Ground every statement strictly in the provided records below. Never invent or hallucinate information.
2. Tone: Helpful, direct, objective, and transparent about sources.
3. Language: Clear, everyday plain English.
4. Essential Phrases:
   - Use "The available records show..." when stating facts.
   - Use "An explanation is not available in the records reviewed" if a project, cost, contractor, or detail is not explicitly mentioned in the records.
5. Emphasize that the platform is independent and non-partisan.

OFFICIAL VERIFIED PROJECT RECORDS DATABASE:
${JSON.stringify(PROJECTS, null, 2)}

ENUGU 17 LGAS DIRECTORY:
${JSON.stringify(LGAS.map((l) => ({ id: l.id, name: l.name, hq: l.hq, district: l.senatorialDistrict, stats: l.stats })), null, 2)}

USER QUESTION:
"${query}"

INSTRUCTIONS FOR JSON OUTPUT:
You must reply ONLY in valid JSON format with the following keys:
{
  "summary": "Clear, plain-language 2-3 paragraph answer to the user.",
  "sources": ["Array of specific document citations or gazettes"],
  "evidenceGap": "Explicit statement of what is or isn't verified in the records.",
  "relatedProjectIds": ["Array of project IDs from the database if applicable, e.g. ['prj-001']"]
}
`;

    // If Gemini API key is available, call Gemini API
    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: contextGrounding }],
                },
              ],
              generationConfig: {
                temperature: 0.2,
                responseMimeType: "application/json",
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            try {
              const parsed = JSON.parse(candidateText);
              // Attach resolved project details for display
              const enrichedProjects = (parsed.relatedProjectIds || [])
                .map((id) => PROJECTS.find((p) => p.id === id))
                .filter(Boolean);

              return Response.json({
                summary: parsed.summary,
                sources: parsed.sources || ["Enugu State Public Records"],
                evidenceGap: parsed.evidenceGap || null,
                projects: enrichedProjects.length > 0 ? enrichedProjects : matchedProjects.slice(0, 3),
              });
            } catch {
              // JSON parse fallback
            }
          }
        }
      } catch (err) {
        console.error("Gemini API call failed, falling back to local grounded synthesis:", err);
      }
    }

    // Local Grounded Synthesizer Fallback (ensures 100% reliability)
    let summaryText = "";
    let sourcesList = [];
    let gapNote = "";

    if (matchedProjects.length > 0) {
      const p = matchedProjects[0];
      summaryText = `The available records show that in ${p.lgaName} (${p.ward}), the "${p.title}" was approved under the ${p.category} sector with an allocation of ${p.budget}. The executing agency or designated contractor is ${p.contractor}. Status is officially recorded as ${p.status}. ${p.description}`;
      sourcesList = [p.sourceDocument];
      gapNote = p.gapNote || "Project verified against published capital budget records.";
    } else {
      summaryText = `The available records reviewed for "${query}" do not show an exact indexed match in current approved capital expenditure files. You can inspect the interactive map above to see all verified projects across the 17 Local Government Areas.`;
      sourcesList = ["Enugu State Open Data & 2024 Appropriation Documents"];
      gapNote = "An explanation is not available in the records reviewed for this specific query.";
    }

    return Response.json({
      summary: summaryText,
      sources: sourcesList,
      evidenceGap: gapNote,
      projects: matchedProjects.slice(0, 3),
    });
  } catch (error) {
    console.error("Ask Enugu Route Error:", error);
    return Response.json(
      { error: "Unable to process the inquiry at this moment." },
      { status: 500 }
    );
  }
}


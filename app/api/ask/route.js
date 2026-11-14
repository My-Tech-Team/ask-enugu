import { PROJECTS, LGAS } from "@/data/enugu-data";

const expandLocalGovernmentArea = (text) =>
  typeof text === "string"
    ? text.replace(/\bLGAs\b/gi, "Local Government Areas").replace(/\bLGA\b/gi, "Local Government Area")
    : text;

export async function POST(req) {
  try {
    const { query, history = [] } = await req.json();

    if (!query || typeof query !== "string") {
      return Response.json({ error: "A valid query is required." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const conversationContext = Array.isArray(history)
      ? history
          .filter(
            (message) =>
              message &&
              (message.role === "user" || message.role === "assistant") &&
              typeof message.text === "string"
          )
          .slice(-6)
          .map((message) => `${message.role === "user" ? "User" : "AskEnugu"}: ${message.text}`)
          .join("\n")
      : "";

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
You are the intelligence assistant for "AskEnugu" — an independent public-interest platform for understanding the policies, public services, spending, reforms, and development of Enugu State during Governor Peter Mbah's tenure.

BRAND & VOICE GUIDELINES:
1. Cover the full public-interest picture: policies, taxes and levies, public services, education, health, jobs, infrastructure, budgets, reforms, and development during Governor Peter Mbah's tenure. Do not limit answers to projects.
2. Ground every statement strictly in the provided records below. Never invent or hallucinate information.
3. Tone: Helpful, direct, objective, and transparent about sources.
4. Language: Clear, everyday plain English.
5. Essential Phrases:
   - Use "The available records show..." when stating facts.
   - Use "An explanation is not available in the records reviewed" if a project, cost, contractor, or detail is not explicitly mentioned in the records.
6. Emphasize that the platform is independent and non-partisan.
7. When referring to Enugu State's governor or his administration, use the full name "Governor Peter Mbah". Do not substitute another name.
8. A social-media post or public discussion is not verified evidence by itself. If the records do not contain a verifiable source for it, say so plainly instead of treating it as fact.
9. Always write "Local Government Area" in full. Never use the abbreviation "LGA" in an answer.

OFFICIAL VERIFIED PROJECT RECORDS DATABASE:
${JSON.stringify(PROJECTS, null, 2)}

ENUGU 17 LOCAL GOVERNMENT AREAS DIRECTORY:
${JSON.stringify(LGAS.map((l) => ({ id: l.id, name: l.name, hq: l.hq, district: l.senatorialDistrict, stats: l.stats })), null, 2)}

USER QUESTION:
"${query}"

RECENT CONVERSATION CONTEXT:
${conversationContext || "No previous conversation."}

Use the conversation context only to understand follow-up references such as "this", "that project", or "the source". It is not evidence: facts must remain grounded in the verified records database.

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
                summary: expandLocalGovernmentArea(parsed.summary),
                sources: parsed.sources || ["Enugu State Public Records"],
                evidenceGap: expandLocalGovernmentArea(parsed.evidenceGap) || null,
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
      summaryText = `The available records reviewed for "${query}" do not show an exact verified match in the current AskEnugu database. The database currently has the strongest coverage for capital projects and Local Government Area records, so it cannot yet verify every policy, tax, public-service, or public-discussion question from this source alone.`;
      sourcesList = ["AskEnugu verified records database"];
      gapNote = "A source covering this specific policy, tax, service, or public discussion is not available in the records reviewed.";
    }

    return Response.json({
      summary: summaryText,
      sources: sourcesList,
      evidenceGap: gapNote,
      projects: matchedProjects.slice(0, 3),
    });
  } catch (error) {
    console.error("AskEnugu Route Error:", error);
    return Response.json(
      { error: "Unable to process the inquiry at this moment." },
      { status: 500 }
    );
  }
}


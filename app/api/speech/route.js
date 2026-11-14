const ASSEMBLY_TTS_API = "https://tts.us.assemblyai.com/v1/speech";

export async function POST(request) {
  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  if (!apiKey) return Response.json({ error: "Voice output is not configured." }, { status: 503 });

  try {
    const { text } = await request.json();
    if (!text || typeof text !== "string") {
      return Response.json({ error: "Text is required for voice output." }, { status: 400 });
    }

    const response = await fetch(ASSEMBLY_TTS_API, {
      method: "POST",
      headers: { authorization: apiKey, "content-type": "application/json" },
      body: JSON.stringify({ text, voice_id: "aai-kyla", language: "english", container: "wav" }),
    });
    if (!response.ok) throw new Error("AssemblyAI voice generation failed.");

    return new Response(response.body, {
      headers: { "content-type": response.headers.get("content-type") || "audio/wav" },
    });
  } catch (error) {
    console.error("AssemblyAI speech error:", error);
    return Response.json({ error: error.message || "Unable to generate voice output." }, { status: 500 });
  }
}

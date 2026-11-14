const ASSEMBLY_API = "https://api.assemblyai.com/v2";

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function POST(request) {
  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Voice transcription is not configured." }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const audio = formData.get("audio");
    if (!(audio instanceof File) || audio.size === 0) {
      return Response.json({ error: "A voice recording is required." }, { status: 400 });
    }

    const headers = { authorization: apiKey };
    const uploadResponse = await fetch(`${ASSEMBLY_API}/upload`, {
      method: "POST",
      headers: { ...headers, "content-type": audio.type || "audio/webm" },
      body: await audio.arrayBuffer(),
    });
    if (!uploadResponse.ok) throw new Error("Unable to upload the recording.");
    const { upload_url: audioUrl } = await uploadResponse.json();

    const transcriptResponse = await fetch(`${ASSEMBLY_API}/transcript`, {
      method: "POST",
      headers: { ...headers, "content-type": "application/json" },
      body: JSON.stringify({
        audio_url: audioUrl,
        speech_models: ["universal-3-5-pro", "universal-2"],
        language_code: "en",
        keyterms_prompt: [
          "Enugu",
          "Enugu East",
          "Enugu North",
          "Enugu South",
          "Governor Peter Mbah",
          "Nsukka",
          "Udi",
          "Nkanu East",
          "Nkanu West",
          "Oji River",
          "Igbo-Eze North",
          "Igbo-Eze South",
          "Ezeagu",
          "Awgu",
          "Aninri",
          "Uzo-Uwani",
          "Isi-Uzo",
        ],
      }),
    });
    if (!transcriptResponse.ok) throw new Error("Unable to start transcription.");
    const { id } = await transcriptResponse.json();

    for (let attempt = 0; attempt < 20; attempt += 1) {
      await wait(1200);
      const statusResponse = await fetch(`${ASSEMBLY_API}/transcript/${id}`, { headers });
      if (!statusResponse.ok) throw new Error("Unable to retrieve transcription.");
      const transcript = await statusResponse.json();
      if (transcript.status === "completed") {
        return Response.json({ text: transcript.text || "" });
      }
      if (transcript.status === "error") throw new Error(transcript.error || "Transcription failed.");
    }

    return Response.json({ error: "Transcription is taking longer than expected. Please try again." }, { status: 504 });
  } catch (error) {
    console.error("AssemblyAI transcription error:", error);
    return Response.json({ error: error.message || "Unable to transcribe the recording." }, { status: 500 });
  }
}

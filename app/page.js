"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import MobileBottomNav from "@/components/MobileBottomNav";
import AboutPage from "./about/page";

const suggestedQuestions = [
  "What tax or levy changes affect businesses?",
  "What has changed in education under Governor Peter Mbah?",
  "What public services are available in my Local Government Area?",
];

const formatRecordingTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [voiceRecording, setVoiceRecording] = useState("idle");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceError, setVoiceError] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const mediaStreamRef = useRef(null);
  const welcomeAudioUrlRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const welcomeKey = "askenugu-welcome-attempted";
    if (window.sessionStorage.getItem(welcomeKey)) return undefined;

    // Try the same cloud voice used in chat. Some first-visit browsers will
    // block audible autoplay; the landing page remains fully usable either way.
    window.sessionStorage.setItem(welcomeKey, "true");
    let cancelled = false;

    fetch("/api/speech", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: "Welcome to AskEnugu. What would you like to know?" }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Welcome voice unavailable");
        return response.blob();
      })
      .then((audioBlob) => {
        if (cancelled) return;
        const audioUrl = URL.createObjectURL(audioBlob);
        welcomeAudioUrlRef.current = audioUrl;
        const audio = new Audio(audioUrl);
        audio.volume = 0.9;
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          if (welcomeAudioUrlRef.current === audioUrl) welcomeAudioUrlRef.current = null;
        };
        return audio.play();
      })
      .catch(() => {
        // Autoplay restrictions are expected on some first visits.
      });

    return () => {
      cancelled = true;
      if (welcomeAudioUrlRef.current) URL.revokeObjectURL(welcomeAudioUrlRef.current);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/chat?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSuggestedQuestion = (question) => {
    router.push(`/chat?q=${encodeURIComponent(question)}`);
  };

  useEffect(() => {
    if (voiceRecording !== "recording") return undefined;
    const interval = window.setInterval(() => setRecordingSeconds((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(interval);
  }, [voiceRecording]);

  useEffect(() => () => mediaStreamRef.current?.getTracks().forEach((track) => track.stop()), []);

  const beginVoiceRecording = useCallback(async () => {
    setVoiceError("");
    setRecordingSeconds(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaStreamRef.current = stream;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setVoiceRecording("recording");
    } catch {
      setVoiceError("Microphone access is needed to record your question.");
    }
  }, []);

  const cancelVoiceRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.onstop = null;
      recorder.stop();
    }
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
    setVoiceRecording("idle");
    setRecordingSeconds(0);
  }, []);

  const toggleVoicePause = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    if (voiceRecording === "recording") {
      recorder.pause();
      setVoiceRecording("paused");
    } else if (voiceRecording === "paused") {
      recorder.resume();
      setVoiceRecording("recording");
    }
  }, [voiceRecording]);

  const sendVoiceSearch = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    setVoiceRecording("transcribing");
    recorder.onstop = async () => {
      try {
        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const formData = new FormData();
        formData.append("audio", audioBlob, "question.webm");
        const response = await fetch("/api/transcribe", { method: "POST", body: formData });
        const data = await response.json();
        if (!response.ok || !data.text?.trim()) throw new Error("No transcript");
        router.push(`/chat?q=${encodeURIComponent(data.text.trim())}`);
      } catch {
        setVoiceError("We could not understand that recording. Please try again.");
        setVoiceRecording("idle");
      } finally {
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
        mediaRecorderRef.current = null;
        audioChunksRef.current = [];
      }
    };
    if (recorder.state === "paused") recorder.resume();
    recorder.stop();
  }, [router]);

  return (
    <>
    <section className="body-bg pt-16 flex flex-col justify-between md:min-h-screen relative overflow-hidden selection:bg-[#E8A812] selection:text-[#082C20]">
      <div className="hero-video" aria-hidden="true">
        <video
          autoPlay
          defaultmuted="true"
          loop
          muted
          playsInline
          preload="metadata"
          poster="https://res.cloudinary.com/zl99z5t1/image/upload/v1794646807/images_1_avzcvi.jpg"
          onCanPlay={(event) => {
            event.currentTarget.muted = true;
            event.currentTarget.volume = 0;
          }}
         
        >
          <source
            src="https://res.cloudinary.com/zl99z5t1/video/upload/v1794647345/Government_House_ICC_Enugu-q1080_kbzrux.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      {/* 2. HERO CONTENT AREA (Moved down slightly, smaller title, compact spacing) */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center pt-20 sm:pt-36 z-10">
        {/* Slightly Smaller Title, Brought Down Naturally */}
        <h1 className="text-5xl sm:text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] mb-5 sm:mb-6">
          What would you like to know?
        </h1>
        <p className="text-md text-white font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] mb-6">Ask about policies, taxes, public services, and development during Governor Peter Mbah&apos;s tenure.</p>

        {/* Capsule Search Bar */}
        <form
          onSubmit={handleSearch}
          className="w-[80%] mx-auto bg-white/95 backdrop-blur-sm rounded-full p-1.5 pl-5 sm:pl-6 flex items-center shadow-md border border-[#068237]/60 focus-within:border-[#068237] focus-within:ring-2 focus-within:ring-[#068237]/20 transition mb-5 sm:mb-6"
        >
          {/* Magnifying Glass Icon (Left) */}
          <svg
            className="w-5 h-5 text-gray-400 mr-2.5 sm:mr-3 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          {voiceRecording === "idle" ? (
            <>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions, topics or keywords..."
                className="w-full bg-transparent text-[#1F2C35] placeholder:text-gray-400 text-sm sm:text-base focus:outline-none pr-3"
              />
              <button type="button" onClick={beginVoiceRecording} aria-label="Record a voice question" className="mr-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[#6B7280] transition hover:text-[#D49308]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18a4 4 0 004-4V6a4 4 0 00-8 0v8a4 4 0 004 4zm0 0v3m-4 0h8m4-7a8 8 0 01-16 0" /></svg>
              </button>
            </>
          ) : (
            <div className="flex min-w-0 flex-1 items-center gap-2 pr-2 text-[#1F2C35]">
              {voiceRecording !== "transcribing" && <button type="button" onClick={cancelVoiceRecording} className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-rose-50 text-lg text-rose-700" aria-label="Cancel recording">×</button>}
              <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#D49308] ${voiceRecording === "recording" || voiceRecording === "transcribing" ? "animate-pulse" : ""}`} />
              <span className="whitespace-nowrap text-sm font-semibold">{voiceRecording === "transcribing" ? "Understanding…" : formatRecordingTime(recordingSeconds)}</span>
              {voiceRecording !== "transcribing" && <button type="button" onClick={toggleVoicePause} className="ml-auto rounded-full border border-[#068237]/30 px-3 py-1 text-xs font-semibold text-[#068237]">{voiceRecording === "paused" ? "Continue" : "Pause"}</button>}
            </div>
          )}

          {/* Circular Gold Search Button (Right) */}
          <button
            type="submit"
            aria-label={voiceRecording === "idle" ? "Search" : "Send recording"}
            disabled={voiceRecording === "transcribing"}
            onClick={voiceRecording === "idle" ? undefined : (event) => { event.preventDefault(); sendVoiceSearch(); }}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#D49308] hover:bg-[#b87f05] text-white flex items-center justify-center flex-shrink-0 transition shadow"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>
        {voiceError && <p className="-mt-3 mb-3 text-xs font-medium text-rose-100 drop-shadow">{voiceError}</p>}

        <div className="w-full mt-1 flex flex-wrap items-center justify-center gap-2">

          {suggestedQuestions.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => handleSuggestedQuestion(question)}
              className="rounded-full border border-white/70 bg-[#082C20]/80 px-3 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur-sm transition hover:bg-[#D49308] hover:border-[#D49308] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {question}
            </button>
          ))}
        </div>

      </main>

      {/* Spacer for bottom balance  <div className="w-full" style={{ height: 340 }}>
          <CircularCarousel />
        </div>*/}
      <div />
      <MobileBottomNav active="home" />
    </section>
    <AboutPage />
    </>
  );
}

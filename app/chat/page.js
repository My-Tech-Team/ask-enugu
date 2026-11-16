"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const followUpQuestions = [
  "Which records support this answer?",
  "What information is not verified?",
  "Show related projects in my Local Government Area",
];

const formatRecordingTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

function ChatContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState(() => {
    if (typeof window === "undefined") return [];

    try {
      return JSON.parse(window.localStorage.getItem("ask-enugu-chat-history") || "[]");
    } catch {
      return [];
    }
  });
  const [activeChatId, setActiveChatId] = useState(null);
  const [galleryProject, setGalleryProject] = useState(null);
  const [voiceRecording, setVoiceRecording] = useState("idle");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceInputError, setVoiceInputError] = useState("");
  const [voiceTranscriptReady, setVoiceTranscriptReady] = useState(false);
  const [activeSpeech, setActiveSpeech] = useState(null);
  const chatBottomRef = useRef(null);
  const inputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const mediaStreamRef = useRef(null);
  const speechAudioRef = useRef(null);
  const speechAudioUrlRef = useRef(null);
  const originalQueryRef = useRef("");
  const speechSessionRef = useRef(0);

  const stopSpeaking = useCallback(() => {
    speechSessionRef.current += 1;
    speechAudioRef.current?.pause();
    speechAudioRef.current = null;
    if (speechAudioUrlRef.current) URL.revokeObjectURL(speechAudioUrlRef.current);
    speechAudioUrlRef.current = null;
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    setActiveSpeech(null);
  }, []);

  const speakAnswer = useCallback((message) => {
    if (typeof window === "undefined") return;

    speechSessionRef.current += 1;
    const sessionId = speechSessionRef.current;
    speechAudioRef.current?.pause();
    if (speechAudioUrlRef.current) URL.revokeObjectURL(speechAudioUrlRef.current);
    window.speechSynthesis.cancel();
    const messageId = message.id;
    // Keep the answer hidden until playback actually begins. Cloud audio can take a
    // moment to load, and showing the full response during that gap feels broken.
    setActiveSpeech({ messageId, status: "loading", characters: 0 });
    const speakWithBrowserVoice = () => {
      if (!("speechSynthesis" in window)) return;
    const sentences = message.summary.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [message.summary];
    let sentenceStart = 0;

    const speakNextSentence = (sentenceIndex) => {
      if (speechSessionRef.current !== sessionId) return;
      if (sentenceIndex >= sentences.length) {
        setActiveSpeech({ messageId, status: "finished", characters: message.summary.length });
        return;
      }

      const sentence = sentences[sentenceIndex];
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.lang = "en-NG";
      utterance.rate = 1.15;
      utterance.pitch = 1;
      utterance.onstart = () => {
        if (speechSessionRef.current === sessionId) {
          setActiveSpeech({ messageId, status: "speaking", characters: sentenceStart });
        }
      };
      utterance.onboundary = (event) => {
        if (speechSessionRef.current !== sessionId) return;
        const nextSpace = sentence.indexOf(" ", event.charIndex);
        const spokenCharacters = nextSpace === -1 ? sentence.length : nextSpace + 1;
        setActiveSpeech({ messageId, status: "speaking", characters: sentenceStart + spokenCharacters });
      };
      utterance.onend = () => {
        if (speechSessionRef.current !== sessionId) return;
        sentenceStart += sentence.length;
        speakNextSentence(sentenceIndex + 1);
      };
      utterance.onerror = () => {
        if (speechSessionRef.current !== sessionId) return;
        sentenceStart += sentence.length;
        speakNextSentence(sentenceIndex + 1);
      };
      window.speechSynthesis.speak(utterance);
    };

    window.setTimeout(() => speakNextSentence(0), 75);
    };

    fetch("/api/speech", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: message.summary }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Cloud voice unavailable");
        return response.blob();
      })
      .then((audioBlob) => {
        if (speechSessionRef.current !== sessionId) return;
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        speechAudioRef.current = audio;
        speechAudioUrlRef.current = audioUrl;
        audio.onplay = () => setActiveSpeech({ messageId, status: "speaking", characters: 0 });
        audio.ontimeupdate = () => {
          if (Number.isFinite(audio.duration) && audio.duration > 0) {
            setActiveSpeech({
              messageId,
              status: "speaking",
              characters: Math.min(message.summary.length, Math.ceil((audio.currentTime / audio.duration) * message.summary.length)),
            });
          }
        };
        audio.onpause = () => {
          if (!audio.ended) {
            setActiveSpeech((current) => current?.messageId === messageId
              ? { ...current, status: "paused" }
              : current);
          }
        };
        audio.onended = () => setActiveSpeech({ messageId, status: "finished", characters: message.summary.length });
        audio.onerror = () => speakWithBrowserVoice();
        audio.play().catch(() => {
          setVoiceInputError("Voice playback was blocked by this browser. Tap Listen again to play the response.");
          speakWithBrowserVoice();
        });
      })
      .catch(() => {
        setVoiceInputError("Cloud voice is unavailable right now. Using your device voice instead.");
        speakWithBrowserVoice();
      });
  }, []);

  const toggleSpeechPause = useCallback(() => {
    if (!activeSpeech || typeof window === "undefined") return;

    if (speechAudioRef.current) {
      if (speechAudioRef.current.paused) {
        speechAudioRef.current.play();
      } else {
        speechAudioRef.current.pause();
      }
      return;
    }

    if (activeSpeech.status === "speaking") {
      window.speechSynthesis.pause();
      setActiveSpeech((speech) => speech && { ...speech, status: "paused" });
    } else if (activeSpeech.status === "paused") {
      window.speechSynthesis.resume();
      setActiveSpeech((speech) => speech && { ...speech, status: "speaking" });
    }
  }, [activeSpeech]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    window.localStorage.setItem("ask-enugu-chat-history", JSON.stringify(chatHistory));
  }, [chatHistory]);

  const saveChat = useCallback((chatId, nextMessages, title) => {
    setChatHistory((previousChats) => {
      const existingChat = previousChats.find((chat) => chat.id === chatId);
      const nextChat = {
        id: chatId,
        title: existingChat?.title || title,
        messages: nextMessages,
        updatedAt: Date.now(),
      };

      return [nextChat, ...previousChats.filter((chat) => chat.id !== chatId)].slice(0, 12);
    });
  }, []);

  const executeChat = useCallback(async (textToSearch) => {
    const text = textToSearch || query;
    if (!text.trim() || isLoading) return;

    setQuery("");
    setVoiceTranscriptReady(false);
    const userMsg = { id: crypto.randomUUID(), role: "user", text };
    const chatId = activeChatId || crypto.randomUUID();
    const nextMessages = [...messages, userMsg];
    setActiveChatId(chatId);
    setMessages(nextMessages);
    saveChat(chatId, nextMessages, text);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: text,
          history: messages.slice(-6).map((message) => ({
            role: message.role,
            text: message.role === "user" ? message.text : message.summary,
          })),
        }),
      });

      if (!res.ok) throw new Error("Failed to retrieve public records.");
      const data = await res.json();

      const assistantMsg = {
        id: crypto.randomUUID(),
        role: "assistant",
        summary: data.summary,
        sources: data.sources || [],
        evidenceGap: data.evidenceGap || null,
        projects: data.projects || [],
      };

      const completedMessages = [...nextMessages, assistantMsg];
      setMessages(completedMessages);
      saveChat(chatId, completedMessages, text);
      speakAnswer(assistantMsg);
    } catch (err) {
      console.error(err);
      const failedMessages = [
        ...nextMessages,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          summary:
            "The records service is momentarily unavailable. Please check your connection and try again.",
          sources: ["System Advisory"],
          evidenceGap: "Unable to verify against live database.",
          projects: [],
        },
      ];
      setMessages(failedMessages);
      saveChat(chatId, failedMessages, text);
      speakAnswer(failedMessages[failedMessages.length - 1]);
    } finally {
      setIsLoading(false);
    }
  }, [activeChatId, isLoading, messages, query, saveChat, speakAnswer]);

  const beginVoiceRecording = useCallback(async () => {
    originalQueryRef.current = query;
    setRecordingSeconds(0);
    setVoiceInputError("");
    setVoiceTranscriptReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaStreamRef.current = stream;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      recorder.onstart = () => setVoiceRecording("recording");
      recorder.start();
      mediaRecorderRef.current = recorder;
    } catch {
      setVoiceInputError("Microphone access is required to record a voice question.");
      setVoiceRecording("idle");
    }
  }, [query]);

  const pauseVoiceRecording = useCallback(() => {
    mediaRecorderRef.current?.pause();
    setVoiceRecording("paused");
  }, []);

  const continueVoiceRecording = useCallback(() => {
    setVoiceInputError("");
    mediaRecorderRef.current?.resume();
    setVoiceRecording("recording");
  }, []);

  const cancelVoiceRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    setQuery(originalQueryRef.current);
    setVoiceTranscriptReady(false);
    setVoiceRecording("idle");
    setRecordingSeconds(0);
  }, []);

  const sendVoiceRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") return;
    setVoiceRecording("transcribing");
    recorder.onstop = async () => {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      const audio = new Blob(audioChunksRef.current, { type: recorder.mimeType || "audio/webm" });
      try {
        const formData = new FormData();
        formData.append("audio", audio, "voice-question.webm");
        const response = await fetch("/api/transcribe", { method: "POST", body: formData });
        const data = await response.json();
        if (!response.ok || !data.text) throw new Error(data.error || "No speech was recognised.");
        setQuery("");
        setVoiceTranscriptReady(false);
        setVoiceRecording("idle");
        setRecordingSeconds(0);
        executeChat(data.text);
      } catch (error) {
        setVoiceInputError(error.message || "Unable to transcribe the recording.");
        setVoiceRecording("idle");
      }
    };
    recorder.stop();
  }, [executeChat]);

  useEffect(() => {
    if (voiceRecording !== "recording") return undefined;

    const timer = window.setInterval(() => setRecordingSeconds((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(timer);
  }, [voiceRecording]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  // Execute the landing-page question after hydration.
  useEffect(() => {
    if (!initialQuery || messages.length !== 0) return;

    const timer = window.setTimeout(() => executeChat(initialQuery), 0);
    return () => window.clearTimeout(timer);
  }, [executeChat, initialQuery, messages.length]);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "white", color: "#1F2C35" }}
    >
      <div className="flex flex-1 min-h-0">
        {/* ── 2. CHAT THREAD ── */}
        <main className="flex-1 w-full max-w-[93%] pt-16 mx-auto px-4 sm:px-6 pb-36 flex flex-col">
        {/* Empty state */}
        {messages.length === 0 && !isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-14 gap-4">
            <div
              className=" flex items-center justify-center "
             
            >
              <Image src="/logo1.png" alt="AskEnugu" width={150} height={44} />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: "#082C20" }}>
                Ask anything about Enugu State
              </h2>
              <p className="text-sm max-w-sm mx-auto" style={{ color: "#6B7280" }}>
                Policies, taxes, public services, education, health, jobs, and development grounded in available records.
              </p>
            </div>

            {/* Suggested prompts */}
            <div className="mt-4 flex max-w-2xl flex-wrap items-center justify-center gap-2">
             
              {[
                "What tax or levy changes affect businesses?",
                "What has changed in education?",
                "What public services are available in my Local Government Area?",
                "What are the latest policy announcements?",
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => executeChat(prompt)}
                  className="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.72)",
                    borderColor: "rgba(6,130,55,0.22)",
                    color: "#374151",
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-6 pt-16 md:pt-16">
          {messages.map((msg, index) => (
            <div key={msg.id || index}>
              {msg.role === "user" ? (
                /* ── USER BUBBLE (right-aligned, pill) ── */
                <div className="flex justify-end items-end gap-2 animate-in fade-in duration-200 mb-2">
                  <div
                    className="px-5 py-2.5 rounded text-sm sm:text-base max-w-[82%] shadow-sm"
                    style={{
                      backgroundColor: "white",
                      border: "1px solid rgba(0,0,0,0.1)",
                      color: "#1F2C35",
                    }}
                  >
                    {msg.text}
                  </div>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#082C20" }}
                    aria-label="You"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm4 14a8 8 0 00-16 0" />
                    </svg>
                  </div>
                </div>
              ) : (
                /* ── ASSISTANT REPLY (left, no bubble — Claude style) ── */
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 animate-in fade-in duration-300 pl-1 w-full max-w-3xl">
                  {/* Small avatar dot + label */}
                  <div className="flex items-cente">
                    <div
                      className="md:w-14 md:h-14 h-10 w-10 bg-[#068237] rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      <Image src="/chat.png" alt="AskEnugu" width={150} height={44} />
         
                    </div>
                    
                  </div>

                  <div>
                    {/* Main answer text */}
                  <div
                    className="text-sm sm:text-base leading-relaxed whitespace-pre-line"
                    style={{ color: "#1F2C35" }}
                  >
                    {activeSpeech?.messageId === msg.id && activeSpeech.status === "loading"
                      ? "Preparing voice response…"
                      : activeSpeech?.messageId === msg.id && activeSpeech.status !== "finished"
                        ? `${msg.summary.slice(0, Math.max(1, activeSpeech.characters))}${activeSpeech.characters < msg.summary.length ? "▍" : ""}`
                        : msg.summary}
                  </div>

                  {activeSpeech?.messageId === msg.id && activeSpeech.status !== "finished" ? (
                    <div className="flex items-center gap-3 text-xs">
                      {(activeSpeech.status === "speaking" || activeSpeech.status === "paused") && (
                        <>
                          <button
                            type="button"
                            onClick={toggleSpeechPause}
                            className="font-medium transition hover:underline"
                            style={{ color: "#068237" }}
                          >
                            {activeSpeech.status === "paused" ? "Resume" : "Pause"}
                          </button>
                          <button
                            type="button"
                            onClick={stopSpeaking}
                            className="font-medium transition hover:underline"
                            style={{ color: "#6B7280" }}
                          >
                            Stop
                          </button>
                        </>
                      )}
                      {activeSpeech.status === "speaking" && (
                        <span className="font-medium" style={{ color: "#D49308" }}>Speaking</span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => navigator.clipboard?.writeText(msg.summary)}
                      className="font-medium transition hover:underline"
                      style={{ color: "#068237" }}
                    >
                      Copy answer
                    </button>
                    <button
                      type="button"
                      onClick={() => speakAnswer(msg)}
                      className="font-medium transition hover:underline"
                      style={{ color: "#068237" }}
                    >
                      Listen
                    </button>
                    </div>
                  )}

                  {/* Related Projects */}
                  {!(activeSpeech?.messageId === msg.id && activeSpeech.status !== "finished") && msg.projects && msg.projects.length > 0 && (
                    <div>
                      <span
                        className="text-[11px] font-bold uppercase tracking-wider block mb-2"
                        style={{ color: "#9CA3AF" }}
                      >
                        Matching Evidence on the Ground:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {msg.projects.map((proj) => (
                          <div
                            key={proj.id}
                            className="rounded-xl p-3 flex flex-col justify-between shadow-xs"
                            style={{
                              backgroundColor: "white",
                              border: "1px solid rgba(0,0,0,0.08)",
                            }}
                          >
                            {proj.images?.[0] && (
                              <>
                                <img
                                  src={proj.images[0]}
                                  alt={proj.title}
                                  className="w-full h-56 object-cover rounded-lg mb-2"
                                />
                                <button
                                  type="button"
                                  onClick={() => setGalleryProject(proj)}
                                  className="mb-3 w-full rounded-lg border px-3 py-2 text-xs font-semibold transition hover:bg-[#E8F5E9]"
                                  style={{ borderColor: "rgba(6,130,55,0.3)", color: "#068237" }}
                                >
                                  View gallery
                                </button>
                              </>
                            )}
                            <div className="flex items-center justify-between text-[10px] font-semibold mb-1"
                              style={{ color: "#D49308" }}>
                              <span>{proj.category}</span>
                              <span
                                className="px-2 py-0.5 rounded-full text-[10px]"
                                style={{
                                  backgroundColor: proj.status === "Completed" ? "#E8F5E9" : "#FEF3C7",
                                  color: proj.status === "Completed" ? "#068237" : "#92400E",
                                }}
                              >
                                {proj.status}
                              </span>
                            </div>
                            <h5
                              className="text-xs font-bold mb-1"
                              style={{ color: "#082C20" }}
                            >
                              {proj.title}
                            </h5>
                            <p className="text-[11px] line-clamp-2" style={{ color: "#6B7280" }}>
                              {proj.description}
                            </p>
                            <div className="mt-2 pt-2 border-t text-[10px]" style={{ borderColor: "rgba(0,0,0,0.07)", color: "#9CA3AF" }}>
                              <span>{proj.lgaName}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!(activeSpeech?.messageId === msg.id && activeSpeech.status !== "finished") && <div className="pt-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#9CA3AF" }}>
                      Continue the conversation
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {followUpQuestions.map((question) => (
                        <button
                          key={question}
                          type="button"
                          onClick={() => executeChat(question)}
                          className="rounded-full border px-3 py-1.5 text-xs font-medium transition hover:border-[#068237] hover:text-[#068237]"
                          style={{ backgroundColor: "white", borderColor: "rgba(0,0,0,0.12)", color: "#374151" }}
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>}
                    
                    
                    
                     </div>
                </div>
              )}
            </div>
          ))}

          {/* Thinking indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 pl-1 py-2 animate-in fade-in duration-200">
              <div className="flex items-cente">
                    <div
                      className="w-12 h-12 bg-[#068237] rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      <Image src="/chat.png" alt="AskEnugu" width={150} height={44} />
         
                    </div>
                    
                  </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm italic" style={{ color: "#9CA3AF" }}>Searching public records</span>
                <span className="flex gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full inline-block"
                      style={{
                        backgroundColor: "#068237",
                        animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite`,
                      }}
                    />
                  ))}
                </span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>
        </main>
      </div>

      {/* ── 3. FIXED BOTTOM INPUT BAR ── */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[94%] max-w-2xl z-30">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (voiceRecording !== "idle") {
              sendVoiceRecording();
            } else {
              executeChat();
            }
          }}
          className="flex items-center rounded-full p-2 pl-5 shadow-lg transition-all"
          style={{
            backgroundColor: "white",
            border: "1.5px solid rgba(0,0,0,0.12)",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#068237")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)")}
        >
          {voiceRecording === "idle" ? (
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about Enugu State..."
              className="w-full bg-transparent text-sm sm:text-base focus:outline-none pr-3"
              style={{ color: "#1F2C35" }}
            />
          ) : (
            <div className="flex min-w-0 flex-1 items-center gap-3 pr-2">
              {voiceRecording !== "transcribing" && (
                <button type="button" onClick={cancelVoiceRecording} aria-label="Cancel voice recording" className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: "#FFF1F2", color: "#BE123C" }}>
                  ×
                </button>
              )}
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${voiceRecording === "recording" || voiceRecording === "transcribing" ? "animate-pulse" : ""}`} style={{ backgroundColor: "#D49308" }} />
                <span className="font-mono text-sm font-semibold tabular-nums" style={{ color: "#082C20" }}>{formatRecordingTime(recordingSeconds)}</span>
                <span className="flex items-center gap-1" aria-hidden="true">
                  {[8, 14, 20, 12, 24, 16, 10, 18, 8].map((height, index) => (
                    <span key={index} className={voiceRecording === "recording" ? "animate-pulse" : ""} style={{ width: 3, height, borderRadius: 99, backgroundColor: "#068237", animationDelay: `${index * 80}ms` }} />
                  ))}
                </span>
              </div>
              {voiceRecording === "recording" ? (
                <button type="button" onClick={pauseVoiceRecording} aria-label="Pause recording" className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-white" style={{ backgroundColor: "#068237" }}>
                  Ⅱ
                </button>
              ) : voiceRecording === "paused" ? (
                <button type="button" onClick={continueVoiceRecording} aria-label="Continue recording" className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-white" style={{ backgroundColor: "#068237" }}>
                  ▶
                </button>
              ) : null}
            </div>
          )}

          <div className="flex items-center gap-1.5 pr-1">
            {/* Attachment */}
            {voiceRecording === "idle" && <button
              type="button"
              title="Attach document"
              onClick={() => alert("Cross-check feature: attach budget page or PDF.")}
              className="p-2 rounded-full transition"
              style={{ color: "#9CA3AF" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1F2C35")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>}

            {/* Microphone */}
            {voiceRecording === "idle" && <button
              type="button"
              title="Record a voice question"
              aria-label="Record a voice question"
              onClick={beginVoiceRecording}
              className="p-2 rounded-full transition"
              style={{ color: "#9CA3AF" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1F2C35")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>}

            {/* Send / Stop */}
            <button
              type="submit"
              className="w-10 h-10 rounded-full text-white flex items-center justify-center transition shadow"
              disabled={voiceRecording === "transcribing"}
              style={{ backgroundColor: voiceRecording !== "idle" ? "#D49308" : (query.trim() || isLoading ? "#068237" : "#9CA3AF") }}
            >
              {isLoading ? (
                <span className="w-3.5 h-3.5 bg-white rounded-sm" />
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
                    d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </button>
          </div>
        </form>
        <p className="text-center text-[11px] mt-2" style={{ color: voiceInputError ? "#B45309" : "#6B7280" }}>
          {voiceInputError || (voiceTranscriptReady ? "Transcript ready. Review it, edit if needed, then send." : voiceRecording === "idle" ? "Use the microphone to record a voice question." : voiceRecording === "transcribing" ? "Transcribing your recording with AssemblyAI…" : "Tap the gold arrow when your recording is complete.")}
        </p>
      </div>

      <style jsx global>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }
      `}</style>

      {galleryProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${galleryProject.title} gallery`}
          onClick={() => setGalleryProject(null)}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl bg-white p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#068237" }}>Project gallery</p>
                <h3 className="text-lg font-bold" style={{ color: "#082C20" }}>{galleryProject.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setGalleryProject(null)}
                className="rounded-full px-3 py-1.5 text-sm font-semibold"
                style={{ backgroundColor: "#f3f4f6", color: "#1F2C35" }}
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {galleryProject.images?.map((image, imageIndex) => (
                <img
                  key={image}
                  src={image}
                  alt={`${galleryProject.title} — image ${imageIndex + 1}`}
                  className="h-72 w-full rounded-xl object-cover"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: "white", color: "#1F2C35" }}
        >
          Loading...
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}

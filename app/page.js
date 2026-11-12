"use client";

import { useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import EnuguMap from "@/components/EnuguMap";
import Image from "next/image";
export default function Home() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isMapCollapsed, setIsMapCollapsed] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);

  const samplePrompts = [
    "What Smart Green Schools are being built in Nkanu East?",
    "What is the status of the 9th Mile 24/7 Water Scheme?",
    "List ongoing infrastructure works in Enugu East",
    "How much was allocated to the Type-2 Healthcare Center in Nsukka?",
  ];

  const handleSearch = async (searchQuery) => {
    const textToSearch = searchQuery || query;
    if (!textToSearch.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: textToSearch }),
      });

      if (!res.ok) throw new Error("Failed to retrieve public records.");
      const data = await res.json();
      setResult(data);

      // Scroll to answer
      setTimeout(() => {
        document.getElementById("answer-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error(err);
      setResult({
        summary: "The records service is momentarily unavailable. Please check your network or try again.",
        sources: ["System Advisory"],
        evidenceGap: "Unable to verify against live database.",
        projects: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFromMap = (customQuery) => {
    setQuery(customQuery);
    handleSearch(customQuery);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#082C20]  text-[#1F2C355] relative selection:bg-[#E8A812] selection:text-[#082C20]">
      {/* 1. TOP CIVIC BANNER (Like America.gov official banner) */}
      <div className="w-full bg-white border-b border-[#144f3b] text-center py-1.5 px-4 text-[11px] text-gray-300 flex items-center justify-center gap-1.5">
        <span>A proposed independent public-interest platform for Enugu State</span>
        <button
          onClick={() => setShowInfoModal(true)}
          className="text-[#E8A812] hover:underline font-medium inline-flex items-center gap-0.5 ml-1"
        >
          <span>What this means</span>
          <span className="text-[10px] bg-[#144f3b] text-[#E8A812] rounded-full w-3.5 h-3.5 inline-flex items-center justify-center font-bold">
            i
          </span>
        </button>
      </div>

      {/* 2. MINIMAL NAVIGATION HEADER */}
      <header className="w-full max-w-7xl bg-[#082C20] mx-auto px-4 sm:px-6 py- flex items-center justify-between">
       <Image src='/logo.png' alt='logo' width={120} height={200} />

        <div className="flex items-center gap-3">
          

          <button
            onClick={() => setShowMenuModal(true)}
            className="text-xs font-semibold px-4 py-2 rounded-full bg-[#144f3b] hover:bg-[#068237] transition text-white"
          >
            Menu
          </button>
        </div>
      </header>

      {/* 3. INTERACTIVE MAPBOX AT TOP (As Requested) */}
      <main className="flex-1 flex flex-col">
       {/*
        <EnuguMap
          onSelectProjectForQuery={handleSelectFromMap}
          isMapCollapsed={isMapCollapsed}
          setIsMapCollapsed={setIsMapCollapsed}
        />
 */}
        {/* 4. AMERICA.GOV MINIMAL HERO SECTION */}
        <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-16 flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-4">
            Hello, <span className="text-[#E8A812]">Enugu</span>
          </h1>

          <p className="text-base sm:text-xl max-w-xxl font-normal mb-8">
            Whatever you need to verify or know from government, start here.
          </p>

          {/* FLOATING CAPSULE SEARCH BAR (Styled exactly like America.gov) */}
          <div className="w-full max-w-2xl relative">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="relative flex items-center bg-[#0c3829]/95 border-2 border-[#144f3b] focus-within:border-[#068237] rounded-full p-2 pl-5 sm:pl-6 shadow-2xl transition duration-200"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try 'What schools are being built in Nsukka?'"
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none pr-3"
              />

              <div className="flex items-center gap-1.5 sm:gap-2 pr-1">
                {/* Paperclip / Attach Icon */}
                <button
                  type="button"
                  title="Attach document or budget extract for verification"
                  onClick={() => alert("Upload feature: attach an official budget page, PDF, or gazette to cross-check records.")}
                  className="p-2 text-gray-400 hover:text-[#E8A812] transition rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </button>

                {/* Microphone Icon */}
                <button
                  type="button"
                  title="Voice query"
                  onClick={() => {
                    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
                      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                      const recognition = new SpeechRecognition();
                      recognition.onstart = () => alert("Listening... speak your question about Enugu public services or projects.");
                      recognition.onresult = (event) => {
                        const transcript = event.results[0][0].transcript;
                        setQuery(transcript);
                        handleSearch(transcript);
                      };
                      recognition.start();
                    } else {
                      alert("Voice recognition is not supported in this browser version. You can type your query in the search box.");
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-[#E8A812] transition rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </button>

                {/* Submit Circle Button in Brand Green */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#068237] hover:bg-[#079941] text-white flex items-center justify-center transition shadow-lg disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Suggestions Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-xl">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Try asking:
            </span>
            {samplePrompts.map((promptText, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(promptText);
                  handleSearch(promptText);
                }}
                className="text-xs bg-[#0c3829] hover:bg-[#144f3b] text-gray-200 hover:text-white px-3 py-1.5 rounded-full border border-[#144f3b] transition"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* 5. EVIDENCE ANSWER CARD (Grounded in Records) */}
          {result && (
            <div
              id="answer-section"
              className="w-full max-w-3xl mt-12 text-left bg-[#0c3829] border border-[#144f3b] rounded-2xl p-6 sm:p-8 shadow-2xl animate-in fade-in duration-300"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#144f3b]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E8A812]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#E8A812]">
                    Evidence-Backed Public Record Answer
                  </span>
                </div>
                <span className="text-[11px] text-gray-400">Independent Verification</span>
              </div>

              {/* Main Answer Body */}
              <div className="text-sm sm:text-base text-gray-100 leading-relaxed space-y-3 mb-6">
                <p className="whitespace-pre-line">{result.summary}</p>
              </div>

              {/* Citations & Source Transparency */}
              {result.sources && result.sources.length > 0 && (
                <div className="bg-[#082C20] rounded-xl p-4 border border-[#144f3b] mb-4">
                  <div className="text-xs font-semibold text-[#E8A812] mb-1.5 flex items-center gap-1.5">
                    <span>📑 Document Citations:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.sources.map((src, i) => (
                      <span
                        key={i}
                        className="text-xs font-mono bg-[#0c3829] text-gray-300 px-2.5 py-1 rounded-md border border-[#144f3b]"
                      >
                        {src}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Verification & Evidence Gaps Box */}
              {result.evidenceGap && (
                <div className="bg-[#1F2C35]/80 rounded-xl p-3.5 border-l-4 border-[#E8A812] text-xs text-gray-300 mb-6">
                  <span className="font-semibold text-white">Record Verification Disclosure: </span>
                  {result.evidenceGap}
                </div>
              )}

              {/* Related Verified Projects (Cards with Photos) */}
              {result.projects && result.projects.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">
                    Matching Infrastructure Records on the Ground:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="bg-[#082C20] border border-[#144f3b] rounded-xl p-3 flex flex-col justify-between"
                      >
                        <div>
                          {proj.images?.[0] && (
                            <img
                              src={proj.images[0]}
                              alt={proj.title}
                              className="w-full h-28 object-cover rounded-lg mb-2"
                            />
                          )}
                          <div className="flex items-center justify-between gap-1 text-[10px] text-[#E8A812] font-semibold mb-1">
                            <span>{proj.category}</span>
                            <span>{proj.status}</span>
                          </div>
                          <h5 className="text-xs font-bold text-white mb-1">{proj.title}</h5>
                          <p className="text-[11px] text-gray-300 line-clamp-2">{proj.description}</p>
                        </div>
                        <div className="mt-2 pt-2 border-t border-[#144f3b] flex items-center justify-between text-[10px] text-gray-400">
                          <span>{proj.lgaName}</span>
                          <span className="font-bold text-[#E8F5E9]">{proj.budget}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* 6. INDEPENDENCE INFO MODAL */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0c3829] border border-[#144f3b] rounded-2xl max-w-md w-full p-6 text-left shadow-2xl">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#144f3b]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E8A812]" />
                About Ask Enugu's Independence
              </h3>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed mb-3">
              <strong>Ask Enugu</strong> is a proposed independent public-interest platform. The tagline
              <em> "Your Government Information Hub"</em> describes the information subject—it does not claim government ownership or official endorsement.
            </p>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              Answers are grounded directly in publicly published state budgets, gazettes, whitepapers, and verifiable public records. Where data is incomplete, we explicitly disclose the evidence gap.
            </p>
            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full py-2 bg-[#068237] hover:bg-[#079941] text-white text-xs font-semibold rounded-lg transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* 7. MENU MODAL */}
      {showMenuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0c3829] border border-[#144f3b] rounded-2xl max-w-sm w-full p-6 text-left shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#144f3b]">
              <BrandLogo size="sm" />
              <button
                onClick={() => setShowMenuModal(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-sm text-gray-200">
              <button
                onClick={() => {
                  setShowMenuModal(false);
                  setIsMapCollapsed(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#144f3b] flex items-center justify-between"
              >
                <span>🗺️ 17 LGAs Interactive Map</span>
                <span className="text-xs text-[#E8A812]">Active</span>
              </button>
              <button
                onClick={() => {
                  setShowMenuModal(false);
                  setShowInfoModal(true);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#144f3b] flex items-center justify-between"
              >
                <span>🏛️ Brand & Platform Mission</span>
                <span className="text-xs text-gray-400">Independent</span>
              </button>
              <button
                onClick={() => {
                  setShowMenuModal(false);
                  handleSearch("List all completed Type-2 Primary Healthcare Centers in Enugu State");
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#144f3b] flex items-center justify-between"
              >
                <span>🏥 Healthcare Projects</span>
                <span className="text-xs text-gray-400">Records</span>
              </button>
              <button
                onClick={() => {
                  setShowMenuModal(false);
                  handleSearch("What are the flagship Smart Green Schools?");
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#144f3b] flex items-center justify-between"
              >
                <span>🏫 Smart Green Schools</span>
                <span className="text-xs text-gray-400">Records</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. FOOTER */}
      <footer className="w-full border-t border-[#144f3b] py-6 px-4 text-center text-xs text-gray-400 bg-[#051C14]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Ask Enugu. Grounded in official documents and credible public records.</p>
          <div className="flex items-center gap-4 text-gray-400">
            <span className="hover:text-white cursor-pointer" onClick={() => setShowInfoModal(true)}>
              Positioning & Values
            </span>
            <span>•</span>
            <span className="text-[#E8A812]">Evidence • Clarity • Openness • Access</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

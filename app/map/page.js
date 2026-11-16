"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { LGAS, PROJECTS } from "@/data/enugu-data";

const MAPBOX_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
  "pk.eyJ1IjoiaXp1Y2h1a3d1am9obmJvc2NvOTUiLCJhIjoiY213YzFzZzJ5MDFjdTJ6cXpyZjhiNTMxOCJ9.SQtJxu1766AJWuQtOjvWLA";

const ENUGU_BOUNDS = [
  [6.95, 5.88],
  [7.9, 7.18],
];

export default function FullMapPage() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [selectedLga, setSelectedLga] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [mapReady, setMapReady] = useState(false);
  const [proofProject, setProofProject] = useState(null);

  /* ── Projects for selected LGA ── */
  const lgaProjects = useMemo(() => {
    if (!selectedLga) return [];
    return PROJECTS.filter((p) => p.lgaId === selectedLga.id);
  }, [selectedLga]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") return lgaProjects;
    return lgaProjects.filter((p) =>
      p.category.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  }, [lgaProjects, selectedCategory]);

  /* ── Bootstrap Mapbox ── */
  useEffect(() => {
    let cancelled = false;

    function boot() {
      if (cancelled || !mapContainerRef.current) return;
      const mapboxgl = window.mapboxgl;
      if (!mapboxgl || mapInstanceRef.current) return;

      mapboxgl.accessToken = MAPBOX_TOKEN;

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [7.45, 6.55],
        zoom: 8.2,
        minZoom: 7,
        maxZoom: 16,
        attributionControl: false,
      });

      map.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        "top-right"
      );

      map.on("load", () => {
        if (cancelled) return;
        mapInstanceRef.current = map;
        map.resize();
        map.fitBounds(ENUGU_BOUNDS, { padding: 50 });
        setMapReady(true);
        placeAllLgaPins(map);
      });

      /* Extra resize kicks to handle flex containers */
      [100, 400, 800].forEach((ms) =>
        setTimeout(() => !cancelled && map.resize(), ms)
      );

      window.addEventListener("resize", () => map.resize());
    }

    if (window.mapboxgl) {
      boot();
    } else {
      /* Inject CSS */
      if (!document.getElementById("mbx-css")) {
        const link = document.createElement("link");
        link.id = "mbx-css";
        link.rel = "stylesheet";
        link.href = "https://api.mapbox.com/mapbox-gl-js/v3.4.0/mapbox-gl.css";
        document.head.appendChild(link);
      }
      /* Inject JS */
      const script = document.createElement("script");
      script.src = "https://api.mapbox.com/mapbox-gl-js/v3.4.0/mapbox-gl.js";
      script.async = true;
      script.onload = () => !cancelled && boot();
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  /* Resize map when sidebar opens/closes */
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const t1 = setTimeout(() => map.resize(), 100);
    const t2 = setTimeout(() => map.resize(), 350);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [selectedLga]);

  /* ── Pin helpers ── */
  function placeAllLgaPins(map) {
    const mapboxgl = window.mapboxgl;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    LGAS.forEach((lga) => {
      const el = document.createElement("div");
      el.style.cssText =
        "cursor:pointer;display:flex;flex-direction:column;align-items:center;pointer-events:auto;user-select:none;";

      el.innerHTML = `
        <div class="pin-inner" style="display:flex;flex-direction:column;align-items:center;transition:transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);">
          <div style="position:relative;display:flex;align-items:center;justify-content:center;">
            <span class="pin-pulse" style="position:absolute;width:24px;height:24px;border-radius:50%;background:#068237;opacity:0.25;transition:transform 0.2s ease;"></span>
            <div class="pin-dot" style="width:20px;height:20px;border-radius:50%;background:#068237;border:2.5px solid white;box-shadow:0 2px 8px rgba(6,130,55,0.45);display:flex;align-items:center;justify-content:center;transition:transform 0.2s ease, background 0.2s ease;">
              <span style="width:6px;height:6px;border-radius:50%;background:#E8A812;display:block;"></span>
            </div>
          </div>
          <span class="pin-label" style="margin-top:4px;font-size:11px;font-weight:800;color:#082C20;white-space:nowrap;
            background:rgba(255,255,255,0.92);padding:2px 8px;border-radius:999px;border:1px solid rgba(0,0,0,0.1);
            box-shadow:0 1px 4px rgba(0,0,0,0.12);letter-spacing:-0.2px;transition:all 0.2s ease;">
            ${lga.name}
          </span>
        </div>`;

      // Hover styling applied ONLY to inner container so Mapbox marker positioning is never overwritten
      const inner = el.querySelector(".pin-inner");
      const pulse = el.querySelector(".pin-pulse");
      const dot = el.querySelector(".pin-dot");
      const label = el.querySelector(".pin-label");

      el.addEventListener("mouseenter", () => {
        if (inner) inner.style.transform = "scale(1.12)";
        if (pulse) pulse.style.transform = "scale(1.4)";
        if (dot) dot.style.boxShadow = "0 4px 14px rgba(6,130,55,0.6)";
        if (label) {
          label.style.background = "#068237";
          label.style.color = "#ffffff";
          label.style.borderColor = "#068237";
          label.style.boxShadow = "0 2px 8px rgba(6,130,55,0.3)";
        }
      });

      el.addEventListener("mouseleave", () => {
        if (inner) inner.style.transform = "scale(1)";
        if (pulse) pulse.style.transform = "scale(1)";
        if (dot) dot.style.boxShadow = "0 2px 8px rgba(6,130,55,0.45)";
        if (label) {
          label.style.background = "rgba(255,255,255,0.92)";
          label.style.color = "#082C20";
          label.style.borderColor = "rgba(0,0,0,0.1)";
          label.style.boxShadow = "0 1px 4px rgba(0,0,0,0.12)";
        }
      });

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        handleLgaClick(lga);
      });

      markersRef.current.push(
        new mapboxgl.Marker({ element: el, anchor: "center" })
          .setLngLat(lga.center)
          .addTo(map)
      );
    });
  }

  function placeProjectPins(map, lga) {
    const mapboxgl = window.mapboxgl;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    PROJECTS.filter((p) => p.lgaId === lga.id).forEach((proj) => {
      const el = document.createElement("div");
      el.style.cssText =
        "cursor:pointer;display:flex;flex-direction:column;align-items:center;pointer-events:auto;user-select:none;";
      const pinColor = proj.status === "Completed" ? "#068237" : "#E8A812";
      const icon =
        proj.category === "Education"
          ? "🏫"
          : proj.category === "Healthcare"
          ? "🏥"
          : proj.category === "Water & Utilities"
          ? "💧"
          : "🏗️";

      el.innerHTML = `
        <div class="proj-inner" style="display:flex;flex-direction:column;align-items:center;transition:transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);">
          <div class="proj-pin" style="width:30px;height:30px;border-radius:50%;background:${pinColor};
            border:2.5px solid white;box-shadow:0 2px 10px rgba(0,0,0,0.25);
            display:flex;align-items:center;justify-content:center;font-size:14px;transition:box-shadow 0.2s ease;">
            ${icon}
          </div>
          <span class="proj-label" style="margin-top:4px;font-size:10px;font-weight:700;color:#082C20;
            background:rgba(255,255,255,0.95);padding:2px 8px;border-radius:6px;
            border:1px solid #e5e7eb;box-shadow:0 1px 4px rgba(0,0,0,0.1);
            white-space:nowrap;transition:all 0.2s ease;">
            ${proj.title.length > 24 ? proj.title.slice(0, 24) + "…" : proj.title}
          </span>
        </div>`;

      const inner = el.querySelector(".proj-inner");
      const label = el.querySelector(".proj-label");
      const pin = el.querySelector(".proj-pin");

      el.addEventListener("mouseenter", () => {
        if (inner) inner.style.transform = "scale(1.12)";
        if (pin) pin.style.boxShadow = "0 4px 14px rgba(0,0,0,0.35)";
        if (label) {
          label.style.background = "#082C20";
          label.style.color = "#ffffff";
          label.style.borderColor = "#082C20";
        }
      });

      el.addEventListener("mouseleave", () => {
        if (inner) inner.style.transform = "scale(1)";
        if (pin) pin.style.boxShadow = "0 2px 10px rgba(0,0,0,0.25)";
        if (label) {
          label.style.background = "rgba(255,255,255,0.95)";
          label.style.color = "#082C20";
          label.style.borderColor = "#e5e7eb";
        }
      });

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        setSelectedProject(proj);
        mapInstanceRef.current?.flyTo({
          center: proj.coordinates,
          zoom: 13.5,
          duration: 700,
        });
      });

      markersRef.current.push(
        new mapboxgl.Marker({ element: el, anchor: "center" })
          .setLngLat(proj.coordinates)
          .addTo(map)
      );
    });
  }

  function handleLgaClick(lga) {
    setSelectedLga(lga);
    setSelectedProject(null);
    setSelectedCategory("all");
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo({ center: lga.center, zoom: lga.zoom || 12.2, duration: 900 });
    placeProjectPins(map, lga);
  }

  function handleReset() {
    setSelectedLga(null);
    setSelectedProject(null);
    setSelectedCategory("all");
    const map = mapInstanceRef.current;
    if (!map) return;
    map.fitBounds(ENUGU_BOUNDS, { padding: 50, duration: 900 });
    placeAllLgaPins(map);
  }

  return (
    <div className="map-page mt-20 md:mt-20" style={{ height: "calc(100dvh - 64px)", display: "flex", flexDirection: "column", overflow: "hidden", background: "white" }}>

      <section className="map-hero " style={{ flexShrink: 0, padding: "16px 24px", background: "#ffff", borderBottom: "1px solid #cfe6d3" }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#068237" }}>Explore Enugu State</p>
        <h1 style={{ margin: "4px 0 3px", fontSize: 22, lineHeight: 1.2, color: "#082C20" }}>Find records across all 17 LGAs</h1>
        <p style={{ margin: 0, fontSize: 13, color: "#4B5563" }}>Select an area to explore available projects and public records.</p>
      </section>

      {/* ── LGA TAB STRIP ── */}
      <div className="map-lga-strip" style={{
        height: 44, flexShrink: 0, background: "white",
        borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center",
        gap: 6, padding: "0 16px", overflowX: "auto", zIndex: 20,
        scrollbarWidth: "none", msOverflowStyle: "none",
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase",
          letterSpacing: "0.08em", whiteSpace: "nowrap", marginRight: 4 }}>
          JUMP TO LOCAL GOVERNMENT AREA:
        </span>
        {LGAS.map((lga) => {
          const isSelected = selectedLga?.id === lga.id;
          return (
            <button key={lga.id} onClick={() => handleLgaClick(lga)}
              style={{
                fontSize: 11, whiteSpace: "nowrap", padding: "3px 10px",
                borderRadius: 999, border: `1px solid ${isSelected ? "#068237" : "#e5e7eb"}`,
                background: isSelected ? "#068237" : "#F9FAFB",
                color: isSelected ? "white" : "#374151",
                fontWeight: isSelected ? 700 : 400, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 4,
              }}>
              {lga.name}
              <span style={{
                fontSize: 10, padding: "0 5px", borderRadius: 999,
                background: isSelected ? "rgba(255,255,255,0.22)" : "#E5E7EB",
                color: isSelected ? "white" : "#6B7280", fontWeight: 600,
              }}>
                {lga.stats?.projectsCount ?? PROJECTS.filter(p => p.lgaId === lga.id).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── MAP + SIDEBAR AREA ── */}
      <div className="map-canvas-area" style={{ flex: 1, minHeight: 0, display: "flex", overflow: "hidden", position: "relative" }}>

        {/* MAP CONTAINER */}
        <div style={{ position: "relative", flex: 1, height: "100%", overflow: "hidden" }}>
          {/* Mapbox renders into this div — must be absolutely positioned inside a relatively positioned container */}
          <div
            ref={mapContainerRef}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          />

          {/* Loading overlay */}
          {!mapReady && (
            <div style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center",
              justifyContent: "center", background: "#F3F4F6", zIndex: 10,
            }}>
              <div style={{ textAlign: "center", color: "#6B7280" }}>
                <div style={{
                  width: 32, height: 32, border: "3px solid #068237",
                  borderTopColor: "transparent", borderRadius: "50%",
                  animation: "spin 0.8s linear infinite", margin: "0 auto 10px",
                }} />
                <span style={{ fontSize: 13 }}>Loading Enugu State map…</span>
              </div>
            </div>
          )}

          {/* Status pill */}
          <div style={{ position: "absolute", top: 12, left: 12, zIndex: 10, display: "flex", gap: 8 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)",
              padding: "6px 14px", borderRadius: 999, boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
              border: "1px solid #e5e7eb",
            }}>
              <span style={{ position: "relative", display: "flex", width: 8, height: 8 }}>
                <span style={{
                  position: "absolute", width: "100%", height: "100%",
                  borderRadius: "50%", background: "#068237", opacity: 0.6,
                  animation: "ping 1.2s cubic-bezier(0,0,0.2,1) infinite",
                }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#068237", display: "block" }} />
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#082C20" }}>
                {selectedLga
                  ? `${selectedLga.name} — ${filteredProjects.length} Evidence Records`
                  : "Enugu State — All 17 Local Government Areas"}
              </span>
            </div>
            {selectedLga && (
              <button onClick={handleReset} style={{
                fontSize: 11, fontWeight: 700, padding: "6px 14px", borderRadius: 999,
                background: "#068237", color: "white", border: "none", cursor: "pointer",
                boxShadow: "0 2px 8px rgba(6,130,55,0.3)",
              }}>
                ← All 17 LGAs
              </button>
            )}
          </div>
        </div>

        {/* ── EVIDENCE SIDEBAR (slides in when LGA selected) ── */}
        {selectedLga && (
          <aside className="mt-14 md:mt-0" style={{
            position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 60,
            width: "min(540px, 100vw)", background: "white",
            borderLeft: "1px solid #e5e7eb", display: "flex", flexDirection: "column",
            overflow: "hidden", boxShadow: "-14px 0 36px rgba(0,0,0,0.18)",
            animation: "slideIn 0.25s ease-out",
          }}>
            {/* Sidebar header */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", background: "#FDFBF7", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
                  color: "#068237", background: "#E8F5E9", padding: "2px 10px", borderRadius: 999,
                }}>
                  {selectedLga.senatorialDistrict} District
                </span>
                <button onClick={handleReset} style={{
                  fontSize: 12, fontWeight: 600, color: "#9CA3AF", background: "none",
                  border: "none", cursor: "pointer", padding: "2px 4px",
                }}>
                  ✕ Close
                </button>
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#082C20", margin: "4px 0 2px" }}>
                {selectedLga.name} Evidence Records
              </h2>
              <div style={{ fontSize: 11, color: "#9CA3AF", display: "flex", gap: 8 }}>
                <span>HQ: <strong style={{ color: "#6B7280" }}>{selectedLga.hq}</strong></span>
                <span>•</span>
                <span>{lgaProjects.length} Projects Tracked</span>
              </div>

              {/* Category filter */}
              <div style={{
                display: "flex", gap: 6, marginTop: 10, overflowX: "auto",
                scrollbarWidth: "none", paddingBottom: 2,
              }}>
                {["all", "Education", "Healthcare", "Infrastructure", "Water", "Agriculture"].map((cat) => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
                    fontSize: 11, padding: "3px 10px", borderRadius: 6, whiteSpace: "nowrap",
                    border: `1px solid ${selectedCategory === cat ? "#082C20" : "#e5e7eb"}`,
                    background: selectedCategory === cat ? "#082C20" : "white",
                    color: selectedCategory === cat ? "white" : "#6B7280",
                    fontWeight: selectedCategory === cat ? 700 : 400, cursor: "pointer",
                    textTransform: "capitalize",
                  }}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable project cards */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
              {filteredProjects.length === 0 ? (
                <div style={{ textAlign: "center", color: "#9CA3AF", fontSize: 12, paddingTop: 48 }}>
                  No projects found for this filter in {selectedLga.name}.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {filteredProjects.map((proj) => {
                    const isSelected = selectedProject?.id === proj.id;
                    return (
                      <div key={proj.id} onClick={() => {
                        setSelectedProject(proj);
                        mapInstanceRef.current?.flyTo({ center: proj.coordinates, zoom: 13.5, duration: 700 });
                      }} style={{
                        borderRadius: 16, padding: 16, cursor: "pointer",
                        border: `1px solid ${isSelected ? "#068237" : "#e5e7eb"}`,
                        background: isSelected ? "#F0FBF4" : "white",
                        boxShadow: isSelected ? "0 0 0 3px rgba(6,130,55,0.12)" : "0 1px 4px rgba(0,0,0,0.05)",
                        transition: "all 0.15s",
                      }}>
                        {/* Photo */}
                        {proj.images?.[0] && (
                          <div style={{ width: "100%", height: 320, borderRadius: 10, overflow: "hidden", marginBottom: 10, position: "relative" }}>
                            <img src={proj.images[0]} alt={proj.title}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <span style={{
                              position: "absolute", bottom: 6, right: 6,
                              background: "rgba(0,0,0,0.6)", color: "white",
                              fontSize: 9, padding: "2px 7px", borderRadius: 4, fontWeight: 600,
                            }}>Verified Site Photo</span>
                          </div>
                        )}
                        {((proj.images?.length || 0) + (proj.videos?.length || 0)) > 0 && (
                          <button
                            type="button"
                            onClick={(event) => { event.stopPropagation(); setProofProject(proj); }}
                            style={{ width: "100%", marginBottom: 12, padding: "9px 12px", borderRadius: 9, border: "1px solid rgba(6,130,55,0.28)", background: "#E8F5E9", color: "#068237", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                          >
                            View proof ({(proj.images?.length || 0) + (proj.videos?.length || 0)})
                          </button>
                        )}

                        {/* Sector + status */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: "#E8A812", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                            {proj.category}
                          </span>
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
                            background: proj.status === "Completed" ? "#E8F5E9" : "#FEF3C7",
                            color: proj.status === "Completed" ? "#068237" : "#92400E",
                          }}>
                            ● {proj.status}
                          </span>
                        </div>

                        <h3 style={{ fontSize: 14, fontWeight: 800, color: "#082C20", margin: "0 0 4px", lineHeight: 1.3 }}>
                          {proj.title}
                        </h3>
                        <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 6 }}>
                          {proj.lgaName} • <span style={{ color: "#6B7280", fontWeight: 600 }}>{proj.ward}</span>
                        </div>
                        <p style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.6, marginBottom: 10 }}>
                          {proj.description}
                        </p>

                        {/* Budget grid */}
                        <div style={{
                          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
                          background: "#F9FAFB", borderRadius: 10, padding: 10,
                          border: "1px solid #F3F4F6", marginBottom: 10, fontSize: 11,
                        }}>
                          <div>
                            <span style={{ fontSize: 9, color: "#9CA3AF", textTransform: "uppercase", fontWeight: 700, display: "block" }}>Budget</span>
                            <span style={{ fontWeight: 800, color: "#068237" }}>{proj.budget}</span>
                          </div>
                          <div>
                            <span style={{ fontSize: 9, color: "#9CA3AF", textTransform: "uppercase", fontWeight: 700, display: "block" }}>Agency</span>
                            <span style={{ fontWeight: 600, color: "#374151", fontSize: 10 }}>{proj.contractor}</span>
                          </div>
                        </div>

                        {/* Source doc */}
                        <div style={{
                          background: "#FAF7F2", borderRadius: 8, padding: "7px 10px",
                          border: "1px solid rgba(232,168,18,0.2)", fontSize: 10,
                          fontFamily: "monospace", color: "#6B7280", marginBottom: proj.gapNote ? 8 : 0,
                        }}>
                          <span style={{ color: "#D49308", fontWeight: 700, display: "block", marginBottom: 2 }}>📄 Document Source:</span>
                          {proj.sourceDocument}
                        </div>

                        {proj.gapNote && (
                          <div style={{
                            fontSize: 10, color: "#9CA3AF", background: "#F9FAFB",
                            padding: "6px 10px", borderRadius: 6, borderLeft: "2px solid #068237",
                          }}>
                            <span style={{ fontWeight: 700, color: "#6B7280" }}>Audit Status: </span>
                            {proj.gapNote}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>


      {proofProject && (
        <div onClick={() => setProofProject(null)} role="dialog" aria-modal="true" aria-label={`${proofProject.title} proof gallery`} style={{ position: "fixed", inset: 0, zIndex: 90, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.76)" }}>
          <div onClick={(event) => event.stopPropagation()} style={{ width: "min(960px, 100%)", maxHeight: "90dvh", overflowY: "auto", borderRadius: 18, background: "white", padding: 18, boxShadow: "0 24px 70px rgba(0,0,0,0.35)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 14 }}>
              <div>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#068237" }}>Project proof</p>
                <h2 style={{ margin: "4px 0 0", fontSize: 18, color: "#082C20" }}>{proofProject.title}</h2>
              </div>
              <button type="button" onClick={() => setProofProject(null)} style={{ border: "none", borderRadius: 999, padding: "8px 12px", background: "#F3F4F6", color: "#1F2C35", fontWeight: 700, cursor: "pointer" }}>Close</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
              {proofProject.images?.map((image, index) => <img key={image} src={image} alt={`${proofProject.title} proof ${index + 1}`} style={{ width: "100%", minHeight: 280, borderRadius: 12, objectFit: "cover" }} />)}
              {proofProject.videos?.map((video) => <video key={video} controls playsInline style={{ width: "100%", minHeight: 280, borderRadius: 12, background: "#082C20" }}><source src={video} /></video>)}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
        @keyframes slideIn { from { transform: translateX(40px); opacity: 0; } to { transform: none; opacity: 1; } }
      `}</style>
    </div>
  );
}

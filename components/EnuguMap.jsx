"use client";

import { useEffect, useRef, useState } from "react";
import { PROJECTS, ENUGU_CENTER } from "@/data/enugu-data";

export default function EnuguMap({ onSelectProjectForQuery }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [activeProject, setActiveProject] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const initMapbox = () => {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      const mapboxgl = window.mapboxgl;
      if (!mapboxgl) return;

      mapboxgl.accessToken =
        process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
        "pk.eyJ1IjoiaXp1Y2h1a3d1am9obmJvc2NvOTUiLCJhIjoiY213YzFzZzJ5MDFjdTJ6cXpyZjhiNTMxOCJ9.SQtJxu1766AJWuQtOjvWLA";

      if (mapInstanceRef.current) return;

      // Clean light style that fits beautifully into a white background layout
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: ENUGU_CENTER,
        zoom: 8.8,
        minZoom: 8.0,
        maxZoom: 15,
        maxBounds: [
          [6.60, 5.75], // Southwest limit
          [8.20, 7.35], // Northeast limit
        ],
        attributionControl: false,
      });

      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");

      map.on("load", () => {
        if (!isCancelled) {
          setMapLoaded(true);
          mapInstanceRef.current = map;
          renderPins(map);
        }
      });
    };

    const renderPins = (map) => {
      const mapboxgl = window.mapboxgl;
      if (!mapboxgl) return;

      PROJECTS.forEach((project) => {
        const el = document.createElement("div");
        el.className = "group cursor-pointer transform transition-transform hover:scale-125 duration-200";

        const isCompleted = project.status === "Completed";
        const pinBg = isCompleted ? "#068237" : "#E8A812";

        el.innerHTML = `
          <div style="background-color: ${pinBg}; box-shadow: 0 4px 14px rgba(0,0,0,0.25);"
               class="w-7 h-7 rounded-full flex items-center justify-center text-white border-2 border-white shadow-md">
            <span class="text-[11px] leading-none">${
              project.category === "Education"
                ? "🏫"
                : project.category === "Healthcare"
                ? "🏥"
                : project.category === "Water & Utilities"
                ? "💧"
                : "🏗️"
            }</span>
          </div>
        `;

        el.addEventListener("click", (e) => {
          e.stopPropagation();
          setActiveProject(project);
          map.flyTo({
            center: project.coordinates,
            zoom: 12.5,
            duration: 1000,
          });
        });

        const marker = new mapboxgl.Marker(el)
          .setLngLat(project.coordinates)
          .addTo(map);

        markersRef.current.push(marker);
      });
    };

    if (window.mapboxgl) {
      initMapbox();
    } else {
      const script = document.createElement("script");
      script.src = "https://api.mapbox.com/mapbox-gl-js/v3.4.0/mapbox-gl.js";
      script.async = true;
      script.onload = () => {
        if (!isCancelled) initMapbox();
      };
      document.head.appendChild(script);
    }

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleResetMap = () => {
    setActiveProject(null);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: ENUGU_CENTER,
        zoom: 8.8,
        duration: 900,
      });
    }
  };

  return (
    <div className="relative w-full">
      {/* Curved Social Media Profile Header Cover Banner */}
      <div className="relative w-full h-[280px] sm:h-[340px] md:h-[400px] overflow-hidden cover-curve shadow-md border-b border-gray-100 bg-[#E8F5E9]/40">
        {/* Mapbox Canvas */}
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Subtle Gradient Overlays for smooth blend */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/25 via-transparent to-white/40" />

        {/* Top Floating Badge on Cover */}
        <div className="absolute top-4 left-4 sm:left-8 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm border border-gray-200/80">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#068237] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#068237]"></span>
          </span>
          <span className="text-xs font-semibold text-[#082C20] tracking-wide">
            Enugu State Spatial Verification Map
          </span>
        </div>

        {/* Reset View Button on Cover */}
        <button
          onClick={handleResetMap}
          className="absolute top-4 right-4 sm:right-8 z-10 text-xs font-medium px-3.5 py-1.5 bg-white/90 hover:bg-white text-[#082C20] rounded-full shadow-sm border border-gray-200/80 transition"
        >
          Reset View ↺
        </button>

        {/* Floating Project Inspection Card (When a pin is clicked) */}
        {activeProject && (
          <div className="absolute bottom-6 right-4 sm:right-8 left-4 sm:left-auto sm:w-[360px] z-20 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#068237]">
                {activeProject.category}
              </span>
              <button
                onClick={() => setActiveProject(null)}
                className="text-gray-400 hover:text-gray-700 text-sm p-1"
              >
                ✕
              </button>
            </div>

            <h4 className="text-sm font-bold text-[#082C20] leading-snug mb-1">
              {activeProject.title}
            </h4>
            <div className="text-xs text-gray-500 mb-2">
              {activeProject.lgaName} • {activeProject.ward}
            </div>

            <div className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded-lg border border-gray-100 mb-2.5">
              <span className="text-gray-500">Allocation:</span>
              <span className="font-bold text-[#068237]">{activeProject.budget}</span>
              <span className="text-gray-500">•</span>
              <span className="font-semibold text-[#082C20]">{activeProject.status}</span>
            </div>

            {activeProject.images?.[0] && (
              <img
                src={activeProject.images[0]}
                alt={activeProject.title}
                className="w-full h-24 object-cover rounded-lg mb-2.5"
              />
            )}

            <button
              onClick={() => {
                if (onSelectProjectForQuery) {
                  onSelectProjectForQuery(
                    `What are the verified details and budget records for "${activeProject.title}" in ${activeProject.lgaName}?`
                  );
                }
              }}
              className="w-full py-2 bg-[#068237] hover:bg-[#056d2e] text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Ask AI About This Project</span>
              <span>➔</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

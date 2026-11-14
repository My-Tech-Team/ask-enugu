"use client";

import { useEffect, useRef, useState } from "react";
import { LGAS, PROJECTS } from "@/data/enugu-data";

// Enugu State Bounding Box covering all 17 LGAs from Igbo-Eze North to Awgu/Aninri
const ENUGU_FIT_BOUNDS = [
  [7.02, 5.92], // Southwest: Awgu / Aninri / Uzo-Uwani south
  [7.85, 7.12], // Northeast: Igbo-Eze North / Isi-Uzo
];

export default function EnuguMap({ onSelectProjectForQuery }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [selectedLga, setSelectedLga] = useState(null);
  const [activeCommunity, setActiveCommunity] = useState(null);
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

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/light-v11",
        bounds: ENUGU_FIT_BOUNDS,
        fitBoundsOptions: { padding: 25 },
        attributionControl: false,
      });

      map.on("load", () => {
        if (!isCancelled) {
          setMapLoaded(true);
          mapInstanceRef.current = map;
          renderAllLgaPins(map);
        }
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

  // LEVEL 1: RENDER ALL 17 LOCAL GOVERNMENT AREAS
  const renderAllLgaPins = (map) => {
    const mapboxgl = window.mapboxgl;
    if (!mapboxgl) return;

    // Clear previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    LGAS.forEach((lga) => {
      const el = document.createElement("div");
      el.className = "flex flex-col items-center cursor-pointer group";

      el.innerHTML = `
        <!-- Circular LGA Pin -->
        <div class="relative flex items-center justify-center">
          <span class="absolute w-4 h-4 rounded-full bg-[#068237] opacity-25 group-hover:scale-150 transition-transform"></span>
          <div style="background-color: #068237; box-shadow: 0 1px 5px rgba(6,130,55,0.4);"
               class="w-3.5 h-3.5 rounded-full border border-white flex items-center justify-center transform transition-transform group-hover:scale-125">
            <span class="w-1 h-1 rounded-full bg-[#E8A812]"></span>
          </div>
        </div>

        <!-- Clean Label -->
        <span style="text-shadow: 0 0 4px #ffffff, 0 0 6px #ffffff, 0 1px 2px #ffffff;"
              class="text-[9px] sm:text-[10px] font-extrabold text-[#082C20] whitespace-nowrap tracking-tight select-none group-hover:text-[#068237] transition-colors mt-0.5">
          ${lga.name}
        </span>
      `;

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        handleLgaClick(lga);
      });

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: "center",
      })
        .setLngLat(lga.center)
        .addTo(map);

      markersRef.current.push(marker);
    });
  };

  // LEVEL 2: DRILL-DOWN INTO CLICKED LGA -> SHOW ITS COMMUNITIES ONLY
  const handleLgaClick = (lga) => {
    setSelectedLga(lga);
    setActiveCommunity(null);

    const map = mapInstanceRef.current;
    if (!map) return;

    // Zoom and isolate that LGA
    map.flyTo({
      center: lga.center,
      zoom: lga.zoom || 12.2,
      duration: 1000,
      essential: true,
    });

    renderCommunityPins(map, lga);
  };

  const renderCommunityPins = (map, lga) => {
    const mapboxgl = window.mapboxgl;
    if (!mapboxgl) return;

    // Clear all previous markers (hides the other 16 LGAs)
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const communities = lga.communities || [];

    communities.forEach((comm) => {
      const el = document.createElement("div");
      el.className = "flex flex-col items-center cursor-pointer group";

      el.innerHTML = `
        <!-- Community Point Icon -->
        <div class="relative flex items-center justify-center">
          <div style="background-color: #E8A812; box-shadow: 0 2px 8px rgba(232,168,18,0.5);"
               class="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center transform transition-transform group-hover:scale-125">
            <span class="w-1.5 h-1.5 rounded-full bg-[#082C20]"></span>
          </div>
        </div>

        <!-- Community Name Badge -->
        <span style="text-shadow: 0 0 4px #ffffff, 0 0 8px #ffffff;"
              class="text-[10px] font-bold text-[#082C20] bg-white/90 backdrop-blur-xs px-1.5 py-0.2 rounded-md shadow-xs border border-gray-200 whitespace-nowrap mt-0.5 group-hover:border-[#068237] transition">
          ${comm.name}
        </span>
      `;

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        setActiveCommunity(comm);
        map.flyTo({
          center: comm.coords,
          zoom: 13.5,
          duration: 600,
        });
      });

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: "center",
      })
        .setLngLat(comm.coords)
        .addTo(map);

      markersRef.current.push(marker);
    });
  };

  // RETURN BACK TO FULL STATE VIEW (ALL 17 LGAs)
  const handleResetToAllLgas = () => {
    setSelectedLga(null);
    setActiveCommunity(null);

    const map = mapInstanceRef.current;
    if (!map) return;

    map.fitBounds(ENUGU_FIT_BOUNDS, {
      padding: 25,
      duration: 1000,
    });

    renderAllLgaPins(map);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Frosted Glass Map Container */}
      <div className="relative w-full h-[280px] sm:h-[320px] rounded-3xl overflow-hidden shadow-xl border border-white/60 bg-white/30 backdrop-blur-md transition-all duration-300">
        {/* Mapbox Canvas */}
        <div
          ref={mapContainerRef}
          className="w-full h-full opacity-85 hover:opacity-95 transition-opacity duration-300"
        />

        {/* Top Control Bar */}
        <div className="absolute top-3 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
          {/* Status Badge */}
          <div className="pointer-events-auto flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-xs border border-white/70">
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#068237] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#068237]"></span>
            </span>
            <span className="text-[10px] font-semibold text-[#082C20]">
              {selectedLga
                ? `${selectedLga.name} Communities (${selectedLga.communities?.length || 0})`
                : "All 17 Local Government Areas"}
            </span>
          </div>

          {/* Reset / Back to All LGAs Button */}
          {selectedLga ? (
            <button
              onClick={handleResetToAllLgas}
              className="pointer-events-auto text-[10px] font-bold px-3 py-1 bg-[#068237] hover:bg-[#056d2e] text-white rounded-full shadow transition flex items-center gap-1"
            >
              <span>← All 17 LGAs</span>
            </button>
          ) : (
            <button
              onClick={handleResetToAllLgas}
              className="pointer-events-auto text-[10px] font-medium px-2.5 py-1 bg-white/90 hover:bg-white text-[#082C20] rounded-full shadow-xs border border-white/70 transition"
            >
              Reset View ↺
            </button>
          )}
        </div>

        {/* Floating Detail Card for Selected LGA */}
        {selectedLga && (
          <div className="absolute inset-x-3 bottom-3 sm:inset-x-auto sm:right-4 sm:bottom-3 sm:w-[290px] z-20 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-3.5 animate-in fade-in duration-200 text-left">
            <div className="flex items-start justify-between gap-1 mb-1">
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#068237]">
                {selectedLga.senatorialDistrict} District
              </span>
              <button
                onClick={handleResetToAllLgas}
                className="text-gray-400 hover:text-gray-700 text-xs px-1"
                title="Back to all LGAs"
              >
                ✕
              </button>
            </div>

            <h4 className="text-sm font-bold text-[#082C20] leading-snug mb-0.5">
              {selectedLga.name} Local Government Area
            </h4>
            <div className="text-[10px] text-gray-500 mb-1.5">
              HQs: {selectedLga.hq} • {activeCommunity ? (
                <span className="text-[#E8A812] font-bold">Community: {activeCommunity.name}</span>
              ) : (
                <span className="text-[#068237] font-semibold">{selectedLga.communities?.length || 0} Communities Mapped</span>
              )}
            </div>

            <p className="text-[11px] text-gray-600 line-clamp-2 mb-2 leading-relaxed">
              {selectedLga.summary}
            </p>

            <button
              onClick={() => {
                if (onSelectProjectForQuery) {
                  const targetName = activeCommunity
                    ? `${activeCommunity.name} community in ${selectedLga.name} Local Government Area`
                    : `${selectedLga.name} Local Government Area`;
                  onSelectProjectForQuery(
                    `What public projects, schools, health centers, and budget allocations are verified in ${targetName}?`
                  );
                }
              }}
              className="w-full py-1.5 bg-[#068237] hover:bg-[#056d2e] text-white text-[11px] font-semibold rounded-lg transition flex items-center justify-center gap-1 shadow-xs"
            >
              <span>Explore in Chat</span>
              <span>➔</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

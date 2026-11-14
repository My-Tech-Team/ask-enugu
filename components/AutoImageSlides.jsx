"use client";

import { useEffect, useState } from "react";

export const ENUGU_SLIDES = [
  {
    id: 1,
    title: "Milliken Hill & Ngwo Scenic Valley",
    category: "Natural Heritage & Transport",
    description: "The historic winding gateway into Enugu metropolis, linking traditional hill country with urban centers.",
    image: "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1400&q=80",
    queryPrompt: "What is the maintenance status of Milliken Hill road infrastructure?",
  },
  {
    id: 2,
    title: "Flagship Smart Green School Model",
    category: "Education Innovation",
    description: "Solar-powered, robotics-equipped basic learning centers operating in rural and urban communities.",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1400&q=80",
    queryPrompt: "What Smart Green Schools are being built in Nkanu East and Nsukka?",
  },
  {
    id: 3,
    title: "9th Mile 24/7 Aquifer Water Scheme",
    category: "Public Utilities & Water",
    description: "Heavy-duty industrial submersible water extraction delivering clean water into metropolitan reservoirs.",
    image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1400&q=80",
    queryPrompt: "What is the status of the 9th Mile 24/7 Water Scheme?",
  },
  {
    id: 4,
    title: "International Conference Centre (ICC)",
    category: "Civic Infrastructure",
    description: "Landmark 3,000-seater auditorium and cultural exhibition complex in Independence Layout.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=80",
    queryPrompt: "What records are available on the completion of the International Conference Centre?",
  },
  {
    id: 5,
    title: "Adani Modern Rice Irrigation Basin",
    category: "Agricultural Transformation",
    description: "Vast irrigation networks and automated parboiling mills empowering smallholder farmers in Uzo-Uwani.",
    image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1400&q=80",
    queryPrompt: "How much was budgeted for the Adani Rice Farm irrigation cluster?",
  },
];

export default function AutoImageSlides({ onSelectSlidePrompt }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ENUGU_SLIDES.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const currentSlide = ENUGU_SLIDES[currentIndex];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full max-w-2xl mx-auto mt-6 rounded-2xl overflow-hidden border border-white/15 shadow-2xl group transition-all duration-300"
    >
      {/* Background Slide Image with Crossfade */}
      <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-black/60">
        <img
          key={currentSlide.id}
          src={currentSlide.image}
          alt={currentSlide.title}
          className="w-full h-full object-cover animate-in fade-in duration-700 transform scale-100 group-hover:scale-105 transition-transform duration-1000"
        />

        {/* Dark Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Slide Content Details */}
        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 flex flex-col justify-end text-left">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#E8A812] bg-black/50 backdrop-blur px-2 py-0.5 rounded-full border border-[#E8A812]/30">
              {currentSlide.category}
            </span>

            {/* Clickable Quick Inquiry Trigger */}
            <button
              onClick={() => onSelectSlidePrompt && onSelectSlidePrompt(currentSlide.queryPrompt)}
              className="text-[11px] font-medium text-white hover:text-[#E8A812] bg-white/15 hover:bg-white/25 backdrop-blur px-2.5 py-1 rounded-full transition flex items-center gap-1 border border-white/20"
            >
              <span>Explore records</span>
              <span>➔</span>
            </button>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-white leading-tight mb-1">
            {currentSlide.title}
          </h3>

          <p className="text-xs text-gray-300 line-clamp-1 sm:line-clamp-2 max-w-xl">
            {currentSlide.description}
          </p>
        </div>
      </div>

      {/* Slide Indicators & Navigation Controls */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
        {ENUGU_SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === currentIndex
                ? "w-4 h-1.5 bg-[#E8A812]"
                : "w-1.5 h-1.5 bg-white/40 hover:bg-white/80"
            }`}
            title={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}


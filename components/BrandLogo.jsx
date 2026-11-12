"use client";

export default function BrandLogo({ showTagline = false, size = "default", className = "", theme = "dark" }) {
  // Brand Guidelines: Symbol = Speech bubble + Question mark + Gold Dot
  const isLight = theme === "light"; // White text on dark
  const textColor = isLight ? "text-white" : "text-[#082C20]";
  const taglineColor = isLight ? "text-[#E8A812]" : "text-[#068237]";

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Symbol SVG */}
      <div className="relative flex-shrink-0">
        <svg
          width={size === "sm" ? "32" : size === "lg" ? "56" : "44"}
          height={size === "sm" ? "32" : size === "lg" ? "56" : "44"}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform hover:scale-105 duration-200"
        >
          {/* Outer Speech Silhouette in Brand Green */}
          <path
            d="M50 8C27.9 8 10 24.6 10 45C10 54.3 13.7 62.8 20 69.3V88L35.2 80.8C39.8 82.8 44.8 84 50 84C72.1 84 90 67.4 90 47C90 26.6 72.1 8 50 8Z"
            fill="#068237"
          />
          {/* Inner Deep Green Contour */}
          <path
            d="M50 14C31.2 14 16 27.9 16 45C16 53.1 19.3 60.5 25 66.1V80.5L37.1 74.8C41 76.2 45.4 77 50 77C68.8 77 84 63.1 84 46C84 28.9 68.8 14 50 14Z"
            fill="#082C20"
          />
          {/* Question Form Silhouette in Crisp White */}
          <path
            d="M44.5 33.5C44.5 30.5 47 28 50.5 28C54 28 56.5 30.5 56.5 33.5C56.5 36.5 54 38.5 51.5 40.5C48 43.5 46 46.5 46 51H54C54 48.5 55.5 46.5 58 44.5C61.5 41.5 64.5 38 64.5 33.5C64.5 26 58.5 21 50.5 21C42.5 21 36.5 26.5 36.5 34.5H44.5V33.5Z"
            fill="#FFFFFF"
          />
          {/* Gold Dot at Point of Clarity */}
          <circle cx="50" cy="62" r="5" fill="#E8A812" />
        </svg>
      </div>

      {/* Wordmark & Optional Tagline */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5">
          <span className={`font-black tracking-tight font-sans text-xl sm:text-2xl leading-none ${textColor}`}>
            ASK ENUGU
          </span>
          <span className="h-2 w-2 rounded-full bg-[#E8A812]" />
        </div>
        {showTagline && (
          <span className={`text-[10px] sm:text-[11px] font-bold tracking-wider uppercase mt-1 ${taglineColor}`}>
            Your Government Information Hub
          </span>
        )}
      </div>
    </div>
  );
}

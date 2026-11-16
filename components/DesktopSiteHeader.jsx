"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DesktopSiteHeader() {
  const isLandingPage = usePathname() === "/";
  const textColor = isLandingPage ? "text-white hover:text-[#E8A812]" : "text-[#082C20] hover:text-[#068237]";
 
  return (
    <header className="fixed inset-x-0  top-0 z-[60] hidden w-full items-center py-2 md:flex">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-8 xl:px-12">
        <Link href="/" className="flex items-center" aria-label="AskEnugu home">
          <Image src={isLandingPage ? "/logo2.png" : "/logo1.png"} alt="AskEnugu" width={150} height={46} className="h-auto max-h-16 w-auto object-contain" priority />
        </Link>
        <nav className="flex items-center gap-7" aria-label="Main navigation">
          <Link href="/" className={`text-md font-medium transition ${textColor}`}>Home</Link>
          <Link href="/map" className={`text-md font-medium transition ${textColor}`}>Map</Link>
          <Link href="/chat?topic=all" className={`text-md font-medium transition ${textColor}`}>Topics</Link>
          <Link href="/about" className={`text-md font-medium transition ${textColor}`}>About</Link>
          <Link href="/chat?q=How can I contact public information officers in Enugu?" className={`text-md font-medium transition ${textColor}`}>Contact</Link>
            </nav>
      </div>
    </header>
  );
}

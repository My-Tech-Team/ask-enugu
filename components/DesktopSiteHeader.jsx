import Image from "next/image";
import Link from "next/link";

export default function DesktopSiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-[60] hidden py-2 w-full items-center border-b bg-[#082C20]/95 backdrop-blur md:flex" style={{ borderColor: "rgba(255,255,255,0.14)" }}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-8 xl:px-12">
        <Link href="/" className="flex items-center" aria-label="AskEnugu home">
          <Image src="/logo2.png" alt="AskEnugu" width={150} height={46} className="h-auto max-h-16 w-auto object-contain" priority />
        </Link>
        <nav className="flex items-center gap-7" aria-label="Main navigation">
          <Link href="/" className="text-md font-medium text-white transition hover:text-[#E8A812]">Home</Link>
          <Link href="/map" className="text-md font-medium text-white transition hover:text-[#E8A812]">Map</Link>
          <Link href="/chat?topic=all" className="text-md font-medium text-white transition hover:text-[#E8A812]">Topics</Link>
          <Link href="/about" className="text-md font-medium text-white transition hover:text-[#E8A812]">About</Link>
          <Link href="/chat?q=How can I contact public information officers in Enugu?" className="text-md font-medium text-white transition hover:text-[#E8A812]">Contact</Link>
            </nav>
      </div>
    </header>
  );
}

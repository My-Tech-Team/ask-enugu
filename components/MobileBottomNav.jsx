"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const items = [
  { href: "/", label: "Home", key: "home" },
  { href: "/map", label: "Map", key: "map" },
  { href: "/chat?topic=all", label: "Topics", key: "topics" },
  { href: "/about", label: "About", key: "about" },
  { href: "/chat?q=How can I contact public information officers in Enugu?", label: "Contact", key: "contact" },
];

export default function MobileBottomNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const active = pathname === "/map" ? "map" : pathname === "/about" ? "about" : pathname === "/chat" ? "topics" : "home";

  return (
    <div className="sm:hidden">
      <header className={`fixed inset-x-0 top-0 z-[70] flex items-center justify-between px-4 py-3 ${isLandingPage ? "" : "border-b bg-white"}`} style={isLandingPage ? undefined : { borderColor: "rgba(8,44,32,0.12)" }}>
        <Link href="/" aria-label="AskEnugu home" className="flex items-center">
          <Image src={isLandingPage ? "/logo2.png" : "/logo1.png"} alt="AskEnugu" width={126} height={38} className="h-auto max-h-16 w-auto object-contain" priority />
        </Link>
        <button type="button" onClick={() => setOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full border transition active:scale-95" style={{ borderColor: isLandingPage ? "rgba(255,255,255,0.35)" : "rgba(8,44,32,0.22)", color: isLandingPage ? "white" : "#082C20" }} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {typeof document !== "undefined" && createPortal(
        <div className={`fixed inset-0 z-[100] transition ${open ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!open}>
          <button type="button" onClick={() => setOpen(false)} className={`absolute inset-0 bg-black/45 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} aria-label="Close menu" />
          <aside className={`absolute right-0 top-0 flex h-full w-[min(340px,88vw)] flex-col bg-white px-6 pb-8 pt-6 shadow-2xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}>
          <div className="mb-9 flex items-center justify-between">
            <Image src="/logo1.png" alt="AskEnugu" width={130} height={40} className="h-auto max-h-10 w-auto object-contain" />
            <button type="button" onClick={() => setOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full border" style={{ borderColor: "rgba(8,44,32,0.22)", color: "#082C20" }} aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-2" aria-label="Main navigation">
            {items.map(({ href, label, key }) => (
              <Link key={key} href={href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-semibold transition" style={{ backgroundColor: active === key ? "#E8F5E9" : "transparent", color: active === key ? "#068237" : "#082C20" }}>
                {label}
              </Link>
            ))}
              </nav>
          </aside>
        </div>,
        document.body
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const items = [
  { href: "/", label: "Home", key: "home" },
  { href: "/map", label: "Map", key: "map" },
  { href: "/chat?topic=all", label: "Topics", key: "topics" },
  { href: "/chat?q=What is AskEnugu and who runs it?", label: "About", key: "about" },
  { href: "/chat?q=How can I contact public information officers in Enugu?", label: "Contact", key: "contact" },
];

export default function MobileBottomNav({ active }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <header className="fixed inset-x-0 top-0 z-[70] flex h-16 items-center justify-between border-b bg-[#082C20]/95 px-4 shadow-sm backdrop-blur" style={{ borderColor: "rgba(255,255,255,0.14)" }}>
        <Link href="/" aria-label="AskEnugu home" className="flex items-center">
          <Image src="/logo2.png" alt="AskEnugu" width={126} height={38} className="h-auto max-h-16 w-auto object-contain" priority />
        </Link>
        <button type="button" onClick={() => setOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full border text-white transition active:scale-95" style={{ borderColor: "rgba(255,255,255,0.35)" }} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
      </header>

      <div className={`fixed inset-0 z-[80] transition ${open ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!open}>
        <button type="button" onClick={() => setOpen(false)} className={`absolute inset-0 bg-black/45 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} aria-label="Close menu" />
        <aside className={`absolute right-0 top-0 flex h-full w-[min(340px,88vw)] flex-col bg-[#082C20]/95 px-6 pb-8 pt-6 shadow-2xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}>
          <div className="mb-9 flex items-center justify-between">
            <Image src="/logo2.png" alt="AskEnugu" width={130} height={40} className="h-auto max-h-10 w-auto object-contain" />
            <button type="button" onClick={() => setOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full border" style={{ borderColor: "rgba(0,0,0,0.12)", color: "#082C20" }} aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-2" aria-label="Main navigation">
            {items.map(({ href, label, key }) => (
              <Link key={key} href={href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base text-white font-semibold transition" style={{ backgroundColor: active === key ? "#E8F5E9" : "transparent", color: active === key ? "#068237" : "#ffff" }}>
                {label}
              </Link>
            ))}
              </nav>
        </aside>
      </div>
    </div>
  );
}

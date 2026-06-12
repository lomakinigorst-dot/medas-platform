"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/search", label: "Найти врача" },
  { href: "/clinics", label: "Клиники" },
  { href: "/specialities", label: "Специальности" },
  { href: "/promotions", label: "Акции" },
];

function Logo({ size = "md" }: { size?: "md" | "sm" }) {
  const w = size === "md" ? 156 : 120;
  const h = size === "md" ? 44 : 34;
  return (
    <Image src="/logo-dark.png" alt="MEDAS" width={w} height={h} priority className="object-contain" />
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 w-full z-50 glass-nav border-b border-outline-variant/30 font-headline">
        {/* Top bar — телефон + город */}
        <div className="hidden lg:flex items-center justify-between px-6 py-2 max-w-screen-2xl mx-auto border-b border-outline-variant/20 text-sm text-on-surface-variant">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Москва
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Пн–Вс 8:00–22:00
            </span>
          </div>
          <a href="tel:+78001234567" className="flex items-center gap-1.5 font-semibold text-primary hover:text-primary/80 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            8 800 123-45-67
          </a>
        </div>

        {/* Main nav */}
        <div className="flex justify-between items-center px-6 py-3.5 max-w-screen-2xl mx-auto">
          <Link href="/" className="flex items-center">
            <Logo size="md" />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/5 font-semibold text-[15px] transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login?role=doctor"
              className="text-on-surface-variant hover:text-primary font-semibold text-[15px] px-4 py-2 rounded-lg hover:bg-primary/5 transition-all duration-200"
            >
              Вход для врачей
            </Link>
            <Link
              href="/search"
              className="bg-secondary text-white px-5 py-2.5 rounded-xl font-bold text-[15px] shadow-sm hover:bg-secondary/90 transition-all duration-200 active:scale-95 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Записаться к врачу
            </Link>
          </div>

          {/* Mobile: phone + hamburger */}
          <div className="flex lg:hidden items-center gap-3">
            <a href="tel:+78001234567" className="text-primary" aria-label="Позвонить">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
            <button
              onClick={() => setOpen(true)}
              aria-label="Открыть меню"
              className="flex flex-col justify-center items-center w-10 h-10 gap-[5px] rounded-xl hover:bg-surface-container-low transition-colors"
            >
              <span className="w-5 h-0.5 bg-on-surface rounded-full block" />
              <span className="w-5 h-0.5 bg-on-surface rounded-full block" />
              <span className="w-3 h-0.5 bg-on-surface rounded-full block" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 z-50 bg-surface-container-lowest shadow-2xl flex flex-col lg:hidden transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
          <Logo size="sm" />
          <button
            onClick={() => setOpen(false)}
            aria-label="Закрыть меню"
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container-low transition-colors"
          >
            <svg className="w-5 h-5 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-4 py-5 flex-1 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-xl text-on-surface font-semibold text-[15px] hover:bg-surface-container-low hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="my-3 border-t border-outline-variant/30" />
          <Link
            href="/login?role=doctor"
            onClick={() => setOpen(false)}
            className="px-4 py-3 rounded-xl text-on-surface-variant font-semibold text-[15px] hover:bg-surface-container-low transition-colors"
          >
            Вход для врачей
          </Link>
        </nav>

        <div className="px-6 pb-8 pt-4 border-t border-outline-variant/30 space-y-3">
          <a
            href="tel:+78001234567"
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-outline-variant text-primary font-semibold text-[15px] hover:bg-primary/5 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            8 800 123-45-67
          </a>
          <Link
            href="/search"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary text-white font-bold text-[15px] hover:bg-secondary/90 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Записаться к врачу
          </Link>
        </div>
      </div>
    </>
  );
}

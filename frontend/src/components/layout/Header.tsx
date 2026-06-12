"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/search", label: "Найти врача" },
  { href: "/clinics", label: "Клиники" },
  { href: "/specialities", label: "Специальности" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 glass-nav shadow-sm shadow-blue-900/5 font-headline tracking-tight">
        <div className="flex justify-between items-center px-6 py-4 max-w-screen-2xl mx-auto w-full">
          {/* Logo */}
          <Link href="/" className="h-10 flex items-center">
            <div className="flex items-center gap-1">
              <span className="font-headline font-extrabold text-2xl text-primary tracking-tight">
                MED
              </span>
              <span className="inline-flex items-center bg-secondary rounded-full px-2 py-0.5">
                <span className="font-headline font-extrabold text-2xl text-white leading-none">
                  A
                </span>
                <span className="w-px h-5 bg-white/40 mx-1" />
                <span className="font-headline font-extrabold text-2xl text-white leading-none">
                  S
                </span>
              </span>
            </div>
          </Link>

          {/* Nav links — desktop only */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-600 hover:text-primary transition-colors duration-300 first:text-primary first:border-b-2 first:border-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth buttons + hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="/login?role=doctor"
              className="hidden md:block text-slate-600 hover:text-primary font-medium px-4 py-2 transition-transform active:scale-95"
            >
              Вход для врачей
            </Link>
            <Link
              href="/cabinet/patient"
              className="btn-primary-gradient text-white px-6 py-2.5 rounded-lg font-bold shadow-sm transition-transform active:scale-95"
            >
              Кабинет
            </Link>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setOpen(true)}
              aria-label="Открыть меню"
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg hover:bg-surface-container-low transition-colors"
            >
              <span className="w-6 h-0.5 bg-on-surface rounded-full" />
              <span className="w-6 h-0.5 bg-on-surface rounded-full" />
              <span className="w-4 h-0.5 bg-on-surface rounded-full" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 z-50 bg-surface-container-lowest shadow-2xl flex flex-col md:hidden transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-on-surface/10">
          <div className="flex items-center gap-1">
            <span className="font-headline font-extrabold text-xl text-primary">MED</span>
            <span className="inline-flex items-center bg-secondary rounded-full px-2 py-0.5">
              <span className="font-headline font-extrabold text-xl text-white leading-none">A</span>
              <span className="w-px h-4 bg-white/40 mx-1" />
              <span className="font-headline font-extrabold text-xl text-white leading-none">S</span>
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Закрыть меню"
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-low transition-colors text-on-surface-variant"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer nav links */}
        <nav className="flex flex-col gap-1 px-4 py-6 flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-xl text-on-surface font-semibold hover:bg-surface-container-low transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Drawer footer auth */}
        <div className="flex flex-col gap-3 px-6 py-6 border-t border-on-surface/10">
          <Link
            href="/login?role=doctor"
            onClick={() => setOpen(false)}
            className="text-center text-slate-600 hover:text-primary font-medium py-2.5 rounded-xl border border-on-surface/15 transition-colors"
          >
            Вход для врачей
          </Link>
          <Link
            href="/cabinet/patient"
            onClick={() => setOpen(false)}
            className="btn-primary-gradient text-white text-center py-2.5 rounded-xl font-bold"
          >
            Личный кабинет
          </Link>
        </div>
      </div>
    </>
  );
}

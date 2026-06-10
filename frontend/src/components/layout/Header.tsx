"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
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

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/search"
            className="text-primary font-semibold border-b-2 border-primary transition-colors duration-300"
          >
            Найти врача
          </Link>
          <Link
            href="/clinics"
            className="text-slate-600 hover:text-primary transition-colors duration-300"
          >
            Клиники
          </Link>
          <Link
            href="/specialities"
            className="text-slate-600 hover:text-primary transition-colors duration-300"
          >
            Специальности
          </Link>
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-4">
          <Link
            href="/login?role=doctor"
            className="text-slate-600 hover:text-primary font-medium px-4 py-2 transition-transform active:scale-95"
          >
            Вход для врачей
          </Link>
          <Link
            href="/cabinet/patient"
            className="btn-primary-gradient text-white px-6 py-2.5 rounded-lg font-bold shadow-sm transition-transform active:scale-95"
          >
            Личный кабинет
          </Link>
        </div>
      </div>
    </nav>
  );
}

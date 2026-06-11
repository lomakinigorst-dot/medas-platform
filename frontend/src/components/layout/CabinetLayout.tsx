"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  icon: string;
  label: string;
};

type CabinetLayoutProps = {
  children: React.ReactNode;
  role: "patient" | "clinic" | "doctor";
  userName: string;
  userSubtitle: string;
  userImage?: string;
  navItems: NavItem[];
  headerTitle?: string;
};

export default function CabinetLayout({
  children,
  role,
  userName,
  userSubtitle,
  navItems,
  headerTitle,
}: CabinetLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen overflow-hidden bg-[#f7f9fb]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col h-full w-64 bg-slate-50 border-r border-[#eceef0] fixed left-0 top-0 z-40 p-4 gap-2">
        <div className="mb-8 px-2">
          <Link href="/" className="flex items-center gap-1">
            <span className="font-[family-name:var(--font-manrope)] font-extrabold text-xl text-[#003087]">MED</span>
            <span className="inline-flex items-center bg-[#00a982] rounded-full px-1.5 py-0.5">
              <span className="font-[family-name:var(--font-manrope)] font-extrabold text-lg text-white leading-none">A</span>
              <span className="w-px h-3.5 bg-white/40 mx-0.5" />
              <span className="font-[family-name:var(--font-manrope)] font-extrabold text-lg text-white leading-none">S</span>
            </span>
          </Link>
          <p className="text-[10px] text-slate-500 tracking-widest uppercase mt-2">
            {role === "patient" ? "Панель пациента" : role === "clinic" ? "Панель клиники" : "Панель врача"}
          </p>
        </div>

        {/* User Info */}
        <div className="mb-6 px-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-tighter mb-3">С возвращением</p>
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#dbe1ff] flex items-center justify-center text-[#003087] font-bold text-sm overflow-hidden">
              {userName.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-[#191c1e] text-sm truncate">{userName}</p>
              <p className="text-[11px] text-slate-500">{userSubtitle}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all text-sm font-medium ${
                  active
                    ? "bg-white text-[#003087] shadow-sm font-bold"
                    : "text-slate-500 hover:bg-[#f2f4f6] hover:text-[#003087]"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-slate-200 pt-4 mt-4 space-y-1">
          <Link href="/cabinet/settings" className="flex items-center gap-3 p-3 rounded-lg text-slate-500 hover:text-[#003087] hover:bg-[#f2f4f6] transition-all text-sm">
            <span>⚙️</span> Настройки
          </Link>
          <Link href="/logout" className="flex items-center gap-3 p-3 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all text-sm">
            <span>🚪</span> Выйти
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen">
        {/* Top Header */}
        <header className="flex justify-between items-center px-6 py-4 bg-white/70 backdrop-blur-xl sticky top-0 z-30 shadow-sm shadow-blue-900/5">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-[#191c1e] font-[family-name:var(--font-manrope)]">
              {headerTitle || "Обзор"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <input
                className="bg-[#f2f4f6] border-none rounded-xl py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-[#003087]/20 w-64"
                placeholder="Поиск..."
                type="text"
              />
              <span className="absolute right-3 top-2.5 text-slate-400 text-sm">🔍</span>
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#e6e8ea] text-[#191c1e] hover:bg-[#e0e3e5] transition-colors">
              🔔
            </button>
          </div>
        </header>

        <div className="px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}

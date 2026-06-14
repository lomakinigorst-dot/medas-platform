"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearToken, getToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.med-as.ru/api/v1";

type NavItem = {
  href: string;
  icon: string;
  label: string;
  badge?: number;
};

type CabinetLayoutProps = {
  children: React.ReactNode;
  role: "patient" | "clinic" | "doctor";
  userName: string;
  userSubtitle: string;
  userImage?: string;
  navItems: NavItem[];
  headerTitle?: string;
  headerAction?: React.ReactNode;
};

export default function CabinetLayout({
  children,
  role,
  userName,
  userSubtitle,
  navItems,
  headerTitle,
  headerAction,
}: CabinetLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [apiName, setApiName] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    fetch(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data?.name && setApiName(data.name))
      .catch(() => null);
  }, []);

  function handleLogout() {
    clearToken();
    router.push("/");
  }

  const displayName = apiName ?? userName;
  const roleLabel =
    role === "patient" ? "Панель пациента" : role === "clinic" ? "Панель клиники" : "Панель врача";

  return (
    <div className="flex min-h-screen overflow-hidden bg-[#f7f9fb]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col h-full w-64 bg-white border-r border-[#eceef0] fixed left-0 top-0 z-40 p-4 gap-2">
        {/* Logo */}
        <div className="mb-8 px-2 flex items-center gap-3">
          <Link href="/">
            <Image src="/logo-dark.png" alt="MEDAS" width={100} height={30} className="object-contain" />
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium relative ${
                  active
                    ? "bg-[#003087] text-white shadow-md font-bold"
                    : "text-slate-500 hover:bg-[#f2f4f6] hover:text-[#003087]"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge != null && item.badge > 0 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#00a982] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User info — внизу */}
        <div className="border-t border-slate-100 pt-4 mt-2">
          <div className="flex items-center gap-3 px-4 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#dbe1ff] flex items-center justify-center text-[#003087] font-bold text-sm flex-shrink-0">
              {displayName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-[#191c1e] text-sm truncate leading-tight">{displayName}</p>
              <p className="text-[11px] text-slate-400 truncate">{roleLabel}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all text-sm w-full"
          >
            <span>🚪</span>
            <span>Выйти</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen">
        {/* Top Header */}
        <header className="flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-xl sticky top-0 z-30 border-b border-[#eceef0]">
          <div>
            <h2 className="text-xl font-extrabold text-[#003087] font-[family-name:var(--font-manrope)] tracking-tight">
              {headerTitle || "Обзор"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{userSubtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <input
                className="bg-[#f2f4f6] border-none rounded-xl py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-[#003087]/20 w-56"
                placeholder="Поиск..."
                type="text"
              />
              <span className="absolute right-3 top-2.5 text-slate-400 text-sm">🔍</span>
            </div>
            {headerAction}
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#f2f4f6] text-slate-500 hover:bg-[#e6e8ea] transition-colors relative">
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

"use client";

import { useState, useEffect } from "react";
import CabinetLayout from "@/components/layout/CabinetLayout";
import ClinicAppointments from "@/components/cabinet/ClinicAppointments";
import { fetchClinicStats, type ClinicStats, type RevenueDay } from "@/lib/api";
import { getToken } from "@/lib/auth";

const navItems = [
  { href: "/cabinet/clinic", icon: "📊", label: "Дашборд" },
  { href: "/cabinet/clinic/doctors", icon: "👨‍⚕️", label: "Врачи" },
  { href: "/cabinet/clinic/schedule", icon: "📅", label: "Расписание" },
  { href: "/cabinet/clinic/appointments", icon: "📋", label: "Записи" },
  { href: "/cabinet/clinic/reports", icon: "📈", label: "Отчёты" },
  { href: "/cabinet/clinic/settings", icon: "⚙️", label: "Настройки" },
];

const BAR_HEIGHT = 96; // px, высота графика

function pctChange(cur: number, prev: number): string {
  if (prev === 0) return cur > 0 ? "+∞%" : "0%";
  const d = ((cur - prev) / prev) * 100;
  return (d >= 0 ? "+" : "") + d.toFixed(0) + "%";
}

function fmt(n: number): string {
  return n.toLocaleString("ru-RU");
}

function RevenueChart({ days }: { days: RevenueDay[] }) {
  if (days.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-sm text-white/50">
        Нет данных за период
      </div>
    );
  }
  const max = Math.max(...days.map((d) => d.revenue), 1);
  return (
    <div className="flex items-end gap-1" style={{ height: `${BAR_HEIGHT}px` }}>
      {days.map((d, i) => {
        const barH = Math.max(Math.round((d.revenue / max) * BAR_HEIGHT), 3);
        const isLast = i === days.length - 1;
        return (
          <div
            key={d.date}
            className="flex-1 rounded-t-sm transition-all hover:opacity-80 cursor-default"
            style={{
              height: `${barH}px`,
              backgroundColor: isLast ? "#00a982" : "rgba(255,255,255,0.25)",
            }}
            title={`${d.date}: ${fmt(d.revenue)} ₽`}
          />
        );
      })}
    </div>
  );
}

function KpiSkeleton() {
  return <div className="h-8 w-28 bg-white/20 rounded-lg animate-pulse" />;
}

export default function ClinicCabinetPage() {
  const [stats, setStats] = useState<ClinicStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    fetchClinicStats(token).then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  const isUp = stats ? stats.month_revenue >= stats.prev_month_revenue : true;
  const change = stats ? pctChange(stats.month_revenue, stats.prev_month_revenue) : null;

  const headerAction = (
    <button className="flex items-center gap-2 px-4 py-2 bg-[#003087] text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-md shadow-[#003087]/20 active:scale-95">
      <span>+</span>
      <span className="hidden sm:inline">Новая запись</span>
    </button>
  );

  return (
    <CabinetLayout
      role="clinic"
      userName="СМ-Клиника"
      userSubtitle="Панель клиники"
      navItems={navItems}
      headerTitle="Дашборд клиники"
      headerAction={headerAction}
    >
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Записей сегодня */}
        <div className="bg-white rounded-2xl p-5 border border-[#eceef0] shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Записей сегодня</p>
          {loading ? <KpiSkeleton /> : (
            <p className="text-4xl font-extrabold text-[#191c1e] font-[family-name:var(--font-manrope)]">
              {stats?.today_count ?? "—"}
            </p>
          )}
          <p className="text-xs text-slate-400 mt-2">без отменённых</p>
        </div>

        {/* Ожидают подтверждения */}
        <div className="bg-white rounded-2xl p-5 border border-[#eceef0] shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Новые заявки</p>
          {loading ? <KpiSkeleton /> : (
            <p className="text-4xl font-extrabold text-[#191c1e] font-[family-name:var(--font-manrope)]">
              {stats?.pending_count ?? "—"}
            </p>
          )}
          {!loading && stats && stats.pending_count > 0 && (
            <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
              ⚡ требуют действия
            </div>
          )}
          {!loading && (!stats || stats.pending_count === 0) && (
            <p className="text-xs text-slate-400 mt-2">нет ожидающих</p>
          )}
        </div>

        {/* Выручка сегодня */}
        <div className="bg-white rounded-2xl p-5 border border-[#eceef0] shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Выручка сегодня</p>
          {loading ? <KpiSkeleton /> : (
            <p className="text-3xl font-extrabold text-[#191c1e] font-[family-name:var(--font-manrope)]">
              {stats ? `${fmt(stats.today_revenue)} ₽` : "—"}
            </p>
          )}
          <p className="text-xs text-slate-400 mt-2">подтверждённые + завершённые</p>
        </div>

        {/* Выручка за месяц */}
        <div className="bg-white rounded-2xl p-5 border border-[#eceef0] shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Выручка за месяц</p>
          {loading ? <KpiSkeleton /> : (
            <p className="text-3xl font-extrabold text-[#191c1e] font-[family-name:var(--font-manrope)]">
              {stats ? `${fmt(stats.month_revenue)} ₽` : "—"}
            </p>
          )}
          {change && (
            <div className={`mt-2 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${
              isUp ? "text-[#006644] bg-[#e3fcef]" : "text-[#ba1a1a] bg-[#ffdad6]"
            }`}>
              {isUp ? "▲" : "▼"} {change} vs прошлый мес.
            </div>
          )}
        </div>
      </div>

      {/* Chart + Doctor load */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Revenue chart — dark gradient card */}
        <div
          className="lg:col-span-2 rounded-2xl p-6 relative overflow-hidden shadow-lg"
          style={{ background: "linear-gradient(135deg, #002D62 0%, #003d82 100%)" }}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">
                  Выручка по дням
                </p>
                <p className="text-white text-sm font-medium opacity-80">последние 30 дней</p>
              </div>
              {change && (
                <div className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${
                  isUp
                    ? "bg-[#00a982]/20 text-[#00a982] border-[#00a982]/30"
                    : "bg-red-500/20 text-red-300 border-red-500/30"
                }`}>
                  {isUp ? "▲" : "▼"} {change}
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex items-end gap-1" style={{ height: `${BAR_HEIGHT}px` }}>
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-white/10 animate-pulse"
                    style={{ height: `${20 + Math.random() * 60}%` }}
                  />
                ))}
              </div>
            ) : (
              <RevenueChart days={stats?.revenue_by_day ?? []} />
            )}

            <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-wider">Сегодня</p>
                <p className="font-bold text-white text-sm">
                  {loading ? "—" : stats ? `${fmt(stats.today_revenue)} ₽` : "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-wider">Текущий месяц</p>
                <p className="font-bold text-white text-sm">
                  {loading ? "—" : stats ? `${fmt(stats.month_revenue)} ₽` : "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-wider">Прошлый месяц</p>
                <p className="font-bold text-white text-sm">
                  {loading ? "—" : stats ? `${fmt(stats.prev_month_revenue)} ₽` : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Decorative icon */}
          <div className="absolute -right-4 -bottom-4 opacity-5 text-[120px] select-none pointer-events-none">
            📈
          </div>
        </div>

        {/* Doctor load */}
        <div className="bg-white rounded-2xl p-5 border border-[#eceef0] shadow-sm">
          <h3 className="text-sm font-bold text-[#191c1e] font-[family-name:var(--font-manrope)] mb-4">
            Загрузка врачей сегодня
          </h3>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 bg-[#f7f9fb] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : stats && stats.doctors_today.length > 0 ? (
            <div className="space-y-4 max-h-56 overflow-y-auto pr-1">
              {stats.doctors_today.map((doc) => {
                const pct = doc.total_slots > 0
                  ? Math.min(Math.round((doc.booked / doc.total_slots) * 100), 100)
                  : null;
                const color =
                  pct === null ? "#003087"
                    : pct >= 80 ? "#003087"
                    : pct >= 50 ? "#00a982"
                    : "#c3c6d7";
                // Имя — берём первые два слова
                const shortName = doc.doctor_name.split(" ").slice(0, 2).join(" ");
                return (
                  <div key={doc.doctor_name}>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="text-sm font-medium text-[#191c1e] truncate max-w-[140px]">
                        {shortName}
                      </span>
                      <span className="text-[11px] text-slate-400 ml-2 flex-shrink-0">
                        {doc.total_slots > 0
                          ? `${doc.booked} из ${doc.total_slots}`
                          : `${doc.booked} зап.`}
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#f2f4f6] rounded-full">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: pct !== null ? `${pct}%` : "100%",
                          backgroundColor: color,
                          maxWidth: "100%",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <span className="text-3xl mb-2">🗓</span>
              <p className="text-sm text-slate-400">Сегодня записей нет</p>
            </div>
          )}
        </div>
      </div>

      {/* Incoming appointments */}
      <ClinicAppointments />
    </CabinetLayout>
  );
}

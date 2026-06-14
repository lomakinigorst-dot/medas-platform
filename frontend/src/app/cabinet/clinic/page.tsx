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

function pctChange(current: number, prev: number): string {
  if (prev === 0) return current > 0 ? "+∞%" : "0%";
  const diff = ((current - prev) / prev) * 100;
  return (diff >= 0 ? "+" : "") + diff.toFixed(0) + "%";
}

function pctPositive(current: number, prev: number): boolean {
  return prev === 0 ? current > 0 : current >= prev;
}

function fmt(n: number): string {
  return n.toLocaleString("ru-RU");
}

function RevenueChart({ days }: { days: RevenueDay[] }) {
  if (days.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-[#434655]">
        Нет данных за период
      </div>
    );
  }
  const max = Math.max(...days.map((d) => d.revenue), 1);
  return (
    <div className="flex items-end gap-1 h-32">
      {days.map((d, i) => {
        const h = Math.max((d.revenue / max) * 100, 2);
        const isLast = i === days.length - 1;
        return (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t-md transition-all"
              style={{
                height: `${h}%`,
                backgroundColor: isLast ? "#003087" : "#e3fcef",
              }}
              title={`${d.date}: ${fmt(d.revenue)} ₽`}
            />
          </div>
        );
      })}
    </div>
  );
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

  const todayRevText = loading ? "—" : stats ? `${fmt(stats.today_revenue)} ₽` : "—";
  const pendingText = loading ? "—" : stats ? String(stats.pending_count) : "—";
  const monthRevText = loading ? "—" : stats ? `${fmt(stats.month_revenue)} ₽` : "—";
  const todayCountText = loading ? "—" : stats ? String(stats.today_count) : "—";

  const monthVsPrev = stats
    ? pctChange(stats.month_revenue, stats.prev_month_revenue)
    : null;
  const monthIsUp = stats
    ? pctPositive(stats.month_revenue, stats.prev_month_revenue)
    : true;

  return (
    <CabinetLayout
      role="clinic"
      userName="СМ-Клиника"
      userSubtitle="Администратор"
      navItems={navItems}
      headerTitle="Дашборд клиники"
    >
      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/10 shadow-sm">
          <div className="w-10 h-10 bg-[#003087] rounded-xl flex items-center justify-center text-white text-lg mb-4">📅</div>
          <p className="text-2xl font-extrabold text-[#191c1e] mb-1">{todayCountText}</p>
          <p className="text-xs text-[#434655] mb-2">Записей сегодня</p>
          <span className="text-xs font-bold text-[#434655]">без учёта отменённых</span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/10 shadow-sm">
          <div className="w-10 h-10 bg-[#00a982] rounded-xl flex items-center justify-center text-white text-lg mb-4">💰</div>
          <p className="text-2xl font-extrabold text-[#191c1e] mb-1">{todayRevText}</p>
          <p className="text-xs text-[#434655] mb-2">Выручка сегодня</p>
          <span className="text-xs font-bold text-[#434655]">подтверждённые + завершённые</span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/10 shadow-sm">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white text-lg mb-4">🔔</div>
          <p className="text-2xl font-extrabold text-[#191c1e] mb-1">{pendingText}</p>
          <p className="text-xs text-[#434655] mb-2">Ожидают подтверждения</p>
          <span className="text-xs font-bold text-amber-500">требуют действия</span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/10 shadow-sm">
          <div className="w-10 h-10 bg-[#1e40af] rounded-xl flex items-center justify-center text-white text-lg mb-4">📈</div>
          <p className="text-2xl font-extrabold text-[#191c1e] mb-1">{monthRevText}</p>
          <p className="text-xs text-[#434655] mb-2">Выручка за месяц</p>
          {monthVsPrev !== null && (
            <span className={`text-xs font-bold ${monthIsUp ? "text-[#00a982]" : "text-[#ba1a1a]"}`}>
              {monthIsUp ? "▲" : "▼"} {monthVsPrev} vs прошлый месяц
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#c3c6d7]/10 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#191c1e] font-[family-name:var(--font-manrope)]">
              Выручка по дням <span className="text-xs font-normal text-[#434655]">(последние 30 дней)</span>
            </h3>
          </div>
          {loading ? (
            <div className="h-32 bg-[#f7f9fb] rounded-xl animate-pulse" />
          ) : (
            <RevenueChart days={stats?.revenue_by_day ?? []} />
          )}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#f2f4f6]">
            <div>
              <p className="text-xs text-[#434655]">Сегодня</p>
              <p className="font-bold text-[#003087]">{todayRevText}</p>
            </div>
            <div>
              <p className="text-xs text-[#434655]">Текущий месяц</p>
              <p className="font-bold text-[#003087]">{monthRevText}</p>
            </div>
            <div>
              <p className="text-xs text-[#434655]">vs прошлый месяц</p>
              {monthVsPrev !== null ? (
                <p className={`font-bold ${monthIsUp ? "text-[#00a982]" : "text-[#ba1a1a]"}`}>
                  {monthIsUp ? "▲" : "▼"} {monthVsPrev}
                </p>
              ) : (
                <p className="font-bold text-[#434655]">—</p>
              )}
            </div>
          </div>
        </div>

        {/* Doctor load */}
        <div className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/10 shadow-sm">
          <h3 className="font-bold text-[#191c1e] font-[family-name:var(--font-manrope)] mb-6">
            Загрузка врачей сегодня
          </h3>
          {loading ? (
            <div className="space-y-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-[#f7f9fb] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : stats && stats.doctors_today.length > 0 ? (
            <div className="space-y-5">
              {stats.doctors_today.map((doc) => {
                const pct = doc.total_slots > 0
                  ? Math.round((doc.booked / doc.total_slots) * 100)
                  : 100;
                const color = pct >= 80 ? "#003087" : pct >= 50 ? "#00a982" : "#c3c6d7";
                const shortName = doc.doctor_name.split(" ").slice(0, 2).join(" ");
                return (
                  <div key={doc.doctor_name}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-[#191c1e]">{shortName}</span>
                      <span className="text-[#434655] text-xs">
                        {doc.total_slots > 0
                          ? `${doc.booked} из ${doc.total_slots} слотов`
                          : `${doc.booked} записей`}
                      </span>
                    </div>
                    <div className="h-2 bg-[#f2f4f6] rounded-full">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-[#434655] text-center py-6">
              Сегодня записей нет
            </p>
          )}
        </div>
      </div>

      <ClinicAppointments />
    </CabinetLayout>
  );
}

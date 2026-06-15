"use client";

import { useState, useEffect } from "react";
import CabinetLayout from "@/components/layout/CabinetLayout";
import { getToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.med-as.ru/api/v1";

interface ServiceTypeStat { type: string; count: number; pct: number; }
interface DoctorRevenueStat { doctor_name: string; specialty: string; month_count: number; revenue: number; rating: number; }
interface ClinicAnalytics {
  period_appointments: number;
  period_revenue: number;
  conversion_pct: number;
  bonuses_earned: number;
  bonuses_used: number;
  bonus_discount_rub: number;
  by_service_type: ServiceTypeStat[];
  by_doctor: DoctorRevenueStat[];
}

const navItems = [
  { href: "/cabinet/clinic", icon: "📊", label: "Дашборд" },
  { href: "/cabinet/clinic/doctors", icon: "👨‍⚕️", label: "Врачи" },
  { href: "/cabinet/clinic/schedule", icon: "📅", label: "Расписание" },
  { href: "/cabinet/clinic/appointments", icon: "📋", label: "Записи" },
  { href: "/cabinet/clinic/reports", icon: "📈", label: "Отчёты" },
  { href: "/cabinet/clinic/settings", icon: "⚙️", label: "Настройки" },
];

const SERVICE_TYPE_LABELS: Record<string, string> = {
  primary: "Первичный приём",
  followup: "Повторный приём",
  online: "Онлайн консультация",
};

const SERVICE_TYPE_COLORS: Record<string, string> = {
  primary: "#003087",
  followup: "#00a982",
  online: "#1e40af",
};

function fmt(n: number): string {
  return n.toLocaleString("ru-RU");
}

function Skel({ className = "" }: { className?: string }) {
  return <div className={`bg-[#f2f4f6] rounded-lg animate-pulse ${className}`} />;
}

export default function ClinicReportsPage() {
  const [data, setData] = useState<ClinicAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    fetch(`${API_BASE}/appointments/clinic/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setData(d))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const periodLabel = now.toLocaleString("ru-RU", { month: "long", year: "numeric" });

  return (
    <CabinetLayout
      role="clinic"
      userName="Центр Современной Медицины"
      userSubtitle="Администратор"
      navItems={navItems}
      headerTitle="Отчёты и аналитика"
    >
      {/* Period header */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm font-semibold text-[#434655] capitalize">{periodLabel}</span>
        <span className="px-2.5 py-0.5 rounded-full bg-[#e3fcef] text-[#006644] text-[11px] font-bold">Текущий месяц</span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Записей за месяц", value: data ? fmt(data.period_appointments) : "—", sub: "всего не отменённых", icon: "👤", bg: "bg-[#dbe1ff]/30", color: "text-[#003087]" },
          { label: "Конверсия", value: data ? `${data.conversion_pct}%` : "—", sub: "подтверждено и завершено", icon: "📊", bg: "bg-[#e3fcef]", color: "text-[#00a982]" },
          { label: "Выручка", value: data ? `${fmt(data.period_revenue)} ₽` : "—", sub: "за текущий месяц", icon: "💰", bg: "bg-[#f2f4f6]", color: "text-[#003087]" },
          { label: "Бонусы начислено", value: data ? `${fmt(data.bonuses_earned)} б.` : "—", sub: "пациентам за приёмы", icon: "🎁", bg: "bg-amber-50", color: "text-amber-600" },
        ].map((kpi) => (
          <div key={kpi.label} className={`${kpi.bg} rounded-2xl p-5 border border-white/50`}>
            <p className="text-2xl mb-2">{kpi.icon}</p>
            {loading ? (
              <Skel className="h-8 w-24 mb-1" />
            ) : (
              <p className={`text-2xl font-extrabold ${kpi.color} font-[family-name:var(--font-manrope)] mb-1`}>{kpi.value}</p>
            )}
            <p className="text-xs font-bold text-[#191c1e]">{kpi.label}</p>
            <p className="text-xs text-[#434655] mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* By service type */}
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 4px 20px rgba(0,27,63,0.06)" }}>
          <h3 className="font-bold text-[#191c1e] font-[family-name:var(--font-manrope)] mb-5">По типу приёма</h3>
          {loading ? (
            <div className="space-y-4">{[1,2,3].map((i) => <Skel key={i} className="h-8" />)}</div>
          ) : !data || data.by_service_type.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">Нет данных</p>
          ) : (
            <div className="space-y-4">
              {data.by_service_type.map((item) => (
                <div key={item.type}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-[#191c1e]">{SERVICE_TYPE_LABELS[item.type] ?? item.type}</span>
                    <span className="text-[#434655]">{item.count} зап. · {item.pct}%</span>
                  </div>
                  <div className="h-2.5 bg-[#f2f4f6] rounded-full">
                    <div
                      className="h-2.5 rounded-full transition-all"
                      style={{ width: `${item.pct}%`, backgroundColor: SERVICE_TYPE_COLORS[item.type] ?? "#737686" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bonuses summary */}
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 4px 20px rgba(0,27,63,0.06)" }}>
          <h3 className="font-bold text-[#191c1e] font-[family-name:var(--font-manrope)] mb-5">Бонусы пациентов</h3>
          {loading ? (
            <div className="space-y-3">{[1,2,3,4].map((i) => <Skel key={i} className="h-12" />)}</div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-[#f7f9fb] rounded-xl">
                <span className="text-sm text-[#434655]">Начислено за приёмы</span>
                <span className="font-bold text-[#00a982]">+{fmt(data?.bonuses_earned ?? 0)} б.</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-[#f7f9fb] rounded-xl">
                <span className="text-sm text-[#434655]">Потрачено пациентами</span>
                <span className="font-bold text-[#ba1a1a]">−{fmt(data?.bonuses_used ?? 0)} б.</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-[#f7f9fb] rounded-xl">
                <span className="text-sm text-[#434655]">Скидки по бонусам</span>
                <span className="font-bold text-[#003087]">−{fmt(data?.bonus_discount_rub ?? 0)} ₽</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-[#e3fcef] rounded-xl border border-[#00a982]/20">
                <span className="text-sm font-bold text-[#006644]">Конверсия за месяц</span>
                <span className="font-extrabold text-[#006644]">{data?.conversion_pct ?? 0}%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Doctor revenue table */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(0,27,63,0.06)" }}>
        <div className="p-5 border-b border-[#f2f4f6]">
          <h3 className="font-bold text-[#191c1e] font-[family-name:var(--font-manrope)]">Выручка по врачам</h3>
        </div>
        {loading ? (
          <div className="p-5 space-y-3">{[1,2,3,4].map((i) => <Skel key={i} className="h-12" />)}</div>
        ) : !data || data.by_doctor.length === 0 ? (
          <p className="text-sm text-slate-400 p-8 text-center">Нет данных за период</p>
        ) : (
          <table className="w-full">
            <thead className="bg-[#f7f9fb]">
              <tr className="text-[10px] text-[#434655] font-bold uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Врач</th>
                <th className="px-5 py-3 text-left hidden sm:table-cell">Специальность</th>
                <th className="px-5 py-3 text-right">Записей</th>
                <th className="px-5 py-3 text-right">Выручка</th>
                <th className="px-5 py-3 text-right hidden sm:table-cell">Рейтинг</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2f4f6]">
              {data.by_doctor.map((doc) => (
                <tr key={doc.doctor_name} className="hover:bg-[#f7f9fb] transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-sm text-[#191c1e] max-w-[150px]">
                    <span className="block truncate">{doc.doctor_name.split(" ").slice(0, 2).join(" ")}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#434655] hidden sm:table-cell">{doc.specialty}</td>
                  <td className="px-5 py-3.5 text-right text-sm font-medium tabular-nums">{doc.month_count}</td>
                  <td className="px-5 py-3.5 text-right font-bold text-sm text-[#003087] tabular-nums">
                    {fmt(doc.revenue)} ₽
                  </td>
                  <td className="px-5 py-3.5 text-right text-amber-500 font-bold text-sm hidden sm:table-cell">
                    ★ {doc.rating.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </CabinetLayout>
  );
}

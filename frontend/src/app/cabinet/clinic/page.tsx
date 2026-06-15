"use client";

import { useState, useEffect, useMemo } from "react";
import CabinetLayout from "@/components/layout/CabinetLayout";
import ClinicAppointments from "@/components/cabinet/ClinicAppointments";
import {
  fetchClinicStats,
  fetchClinicAppointments,
  type ClinicStats,
  type RevenueDay,
  type ClinicAppointmentOut,
} from "@/lib/api";
import { getToken } from "@/lib/auth";
import { isToday, formatDateTime } from "@/lib/date-utils";

const navItems = [
  { href: "/cabinet/clinic", icon: "📊", label: "Дашборд" },
  { href: "/cabinet/clinic/doctors", icon: "👨‍⚕️", label: "Врачи" },
  { href: "/cabinet/clinic/schedule", icon: "📅", label: "Расписание" },
  { href: "/cabinet/clinic/appointments", icon: "📋", label: "Записи" },
  { href: "/cabinet/clinic/reports", icon: "📈", label: "Отчёты" },
  { href: "/cabinet/clinic/settings", icon: "⚙️", label: "Настройки" },
];

const BAR_HEIGHT = 80;

const TIMELINE_STATUS: Record<string, { label: string; color: string; dot: string }> = {
  pending:   { label: "ОЖИДАЕТСЯ",    color: "bg-[#f2f4f6] text-[#434655]",    dot: "bg-[#c3c6d7]" },
  confirmed: { label: "ПОДТВЕРЖДЁН",  color: "bg-[#dbe1ff] text-[#003087]",    dot: "bg-[#003087]" },
  completed: { label: "ЗАВЕРШЁН",     color: "bg-[#e3fcef] text-[#006644]",    dot: "bg-[#00a982]" },
  cancelled: { label: "ОТМЕНЁН",      color: "bg-[#ffdad6] text-[#ba1a1a]",    dot: "bg-[#ba1a1a]" },
};

function pctChange(cur: number, prev: number): string {
  if (prev === 0) return cur > 0 ? "+∞%" : "0%";
  const d = ((cur - prev) / prev) * 100;
  return (d >= 0 ? "+" : "") + d.toFixed(0) + "%";
}

function fmt(n: number): string {
  return n.toLocaleString("ru-RU");
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function KpiSkeleton() {
  return <div className="h-8 w-28 bg-[#f2f4f6] rounded-lg animate-pulse" />;
}

// ─── Revenue chart ────────────────────────────────────────────────────────────

function RevenueChart({ days, loading }: { days: RevenueDay[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="flex items-end gap-0.5" style={{ height: `${BAR_HEIGHT}px` }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="flex-1 rounded-t-sm bg-white/10 animate-pulse" style={{ height: `${20 + (i % 5) * 12}%` }} />
        ))}
      </div>
    );
  }
  if (days.length === 0) {
    return (
      <div className="flex items-center justify-center text-sm text-white/40" style={{ height: `${BAR_HEIGHT}px` }}>
        Нет данных за период
      </div>
    );
  }
  const max = Math.max(...days.map((d) => d.revenue), 1);
  return (
    <div className="flex items-end gap-0.5" style={{ height: `${BAR_HEIGHT}px` }}>
      {days.map((d, i) => {
        const h = Math.max(Math.round((d.revenue / max) * BAR_HEIGHT), 3);
        const isLast = i === days.length - 1;
        return (
          <div
            key={d.date}
            className="flex-1 rounded-t-sm transition-all hover:opacity-80 cursor-default"
            style={{ height: `${h}px`, backgroundColor: isLast ? "#00a982" : "rgba(255,255,255,0.22)" }}
            title={`${d.date}: ${fmt(d.revenue)} ₽`}
          />
        );
      })}
    </div>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

function DayTimeline({ appointments, loading }: { appointments: ClinicAppointmentOut[]; loading: boolean }) {
  const todayApts = useMemo(
    () =>
      appointments
        .filter((a) => isToday(a.scheduled_at) && a.status !== "cancelled")
        .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()),
    [appointments]
  );

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ boxShadow: "0 4px 20px rgba(0,27,63,0.06)" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#191c1e] font-[family-name:var(--font-manrope)]">
          Расписание на день
        </h3>
        <div className="flex gap-1 text-[10px]">
          <span className="px-2 py-0.5 rounded-full bg-[#f2f4f6] text-[#434655] font-semibold cursor-pointer hover:bg-[#e6e8ea]">Таблица</span>
          <span className="px-2 py-0.5 rounded-full bg-[#003087] text-white font-semibold">Список</span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="w-10 h-4 bg-[#f2f4f6] rounded animate-pulse flex-shrink-0" />
              <div className="flex-1 h-14 bg-[#f2f4f6] rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
      ) : todayApts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <span className="text-4xl mb-3">📅</span>
          <p className="text-sm font-medium text-[#191c1e]">Записей на сегодня нет</p>
          <p className="text-xs text-slate-400 mt-1">Новые заявки появятся здесь</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {todayApts.map((apt) => {
            const st = TIMELINE_STATUS[apt.status] ?? TIMELINE_STATUS.pending;
            const initials = apt.doctor_name.split(" ").map((w) => w[0]).slice(0, 2).join("");
            return (
              <div key={apt.id} className="flex gap-3 items-start group">
                {/* Time */}
                <div className="w-10 flex-shrink-0 text-right">
                  <span className="text-xs font-bold text-[#434655] tabular-nums">
                    {formatDateTime(apt.scheduled_at).time}
                  </span>
                </div>
                {/* Line + dot */}
                <div className="flex flex-col items-center flex-shrink-0 pt-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${st.dot}`} />
                  <div className="w-px flex-1 bg-[#eceef0] mt-1 min-h-[32px]" />
                </div>
                {/* Card */}
                <div className="flex-1 bg-[#f7f9fb] rounded-xl px-3 py-2.5 mb-1 group-hover:bg-[#f0f2f5] transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-[#dbe1ff] text-[#003087] flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#191c1e] truncate leading-tight">
                          {apt.patient_name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {apt.doctor_name}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ${st.color}`}>
                      {st.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── New requests sidebar ─────────────────────────────────────────────────────

function NewRequestsSidebar({ appointments, loading, onRefresh }: {
  appointments: ClinicAppointmentOut[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const pending = useMemo(
    () => appointments.filter((a) => a.status === "pending").slice(0, 8),
    [appointments]
  );

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col" style={{ boxShadow: "0 4px 20px rgba(0,27,63,0.06)" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#191c1e] font-[family-name:var(--font-manrope)]">
          Новые заявки
          {!loading && pending.length > 0 && (
            <span className="ml-2 bg-[#003087] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {pending.length}
            </span>
          )}
        </h3>
        <button onClick={onRefresh} className="text-[10px] text-slate-400 hover:text-[#003087] transition-colors font-medium">
          Обновить ↻
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-[#f2f4f6] rounded-xl animate-pulse" />)}
        </div>
      ) : pending.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center flex-1">
          <span className="text-3xl mb-2">✅</span>
          <p className="text-sm text-slate-400">Нет новых заявок</p>
        </div>
      ) : (
        <div className="space-y-2 flex-1 overflow-y-auto max-h-72">
          {pending.map((apt) => {
            const { date, time } = formatDateTime(apt.scheduled_at);
            return (
              <div key={apt.id} className="bg-[#f7f9fb] rounded-xl px-3 py-2.5 hover:bg-[#f0f2f5] transition-colors">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-[#dbe1ff] text-[#003087] flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    {apt.patient_name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#191c1e] truncate leading-tight">{apt.patient_name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{apt.doctor_name} · {date}, {time}</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#00a982] flex-shrink-0">
                    {fmt(apt.price)} ₽
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Doctor load ──────────────────────────────────────────────────────────────

function DoctorLoad({ stats, loading }: { stats: ClinicStats | null; loading: boolean }) {
  const [showAll, setShowAll] = useState(false);

  const doctors = stats?.doctors_today ?? [];
  const sorted = useMemo(
    () => [...doctors].sort((a, b) => {
      const pa = a.total_slots > 0 ? a.booked / a.total_slots : 0;
      const pb = b.total_slots > 0 ? b.booked / b.total_slots : 0;
      return pb - pa;
    }),
    [doctors]
  );
  const visible = useMemo(
    () => showAll ? sorted : sorted.slice(0, 5),
    [sorted, showAll]
  );

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ boxShadow: "0 4px 20px rgba(0,27,63,0.06)" }}>
      <h3 className="text-sm font-bold text-[#191c1e] font-[family-name:var(--font-manrope)] mb-4">
        Загрузка врачей
      </h3>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-8 bg-[#f2f4f6] rounded-lg animate-pulse" />)}
        </div>
      ) : sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <span className="text-3xl mb-2">🗓</span>
          <p className="text-sm text-slate-400">Сегодня записей нет</p>
        </div>
      ) : (
        <>
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-[#f2f4f6]">
                <th className="text-left pb-2 font-bold">Врач</th>
                <th className="text-right pb-2 font-bold">Сегодня</th>
                <th className="text-right pb-2 font-bold">Месяц</th>
                <th className="text-right pb-2 font-bold">Загрузка</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((doc) => {
                const pct = doc.total_slots > 0
                  ? Math.min(Math.round((doc.booked / doc.total_slots) * 100), 100)
                  : null;
                const pctColor = pct !== null && pct >= 80
                  ? "text-[#003087]"
                  : pct !== null && pct >= 50
                  ? "text-[#00a982]"
                  : "text-slate-400";
                const shortName = doc.doctor_name.split(" ").slice(0, 2).join(" ");
                return (
                  <tr key={doc.doctor_name} className="border-b border-[#f2f4f6] last:border-0">
                    <td className="py-2.5 text-sm font-medium text-[#191c1e] max-w-[120px]">
                      <span className="block truncate">{shortName}</span>
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-sm text-[#191c1e] font-semibold">
                      {doc.booked}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-sm text-slate-400">
                      {doc.month_count}
                    </td>
                    <td className="py-2.5 text-right">
                      {pct !== null ? (
                        <span className={`text-xs font-bold ${pctColor}`}>{pct}%</span>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {sorted.length > 5 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="mt-3 text-[11px] font-semibold text-[#003087] hover:opacity-75 transition-opacity w-full text-center"
            >
              {showAll ? "Скрыть" : `Ещё ${sorted.length - 5} врачей`}
            </button>
          )}
        </>
      )}
    </div>
  );
}

// ─── Patient funnel ──────────────────────────────────────────────────────────

function PatientFunnel({ stats, loading }: { stats: ClinicStats | null; loading: boolean }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 animate-pulse h-28" style={{ boxShadow: "0 4px 20px rgba(0,27,63,0.06)" }} />
    );
  }

  const steps = [
    { label: "Создано", value: stats?.month_count ?? 0 },
    { label: "Подтверждено", value: stats?.confirmed_month ?? 0 },
    { label: "Завершено", value: stats?.completed_month ?? 0 },
    { label: "С бонусами", value: stats?.bonuses_applied_month ?? 0 },
  ];

  function convPct(a: number, b: number): string {
    if (b === 0) return "—";
    return Math.round((a / b) * 100) + "%";
  }

  return (
    <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 4px 20px rgba(0,27,63,0.06)" }}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Воронка пациентов</p>
      <div className="flex items-center">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center flex-1 min-w-0">
            <div className="flex-1 text-center">
              <p className="text-2xl font-extrabold font-[family-name:var(--font-manrope)] text-[#003087]">
                {step.value}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">{step.label}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="flex flex-col items-center px-1 shrink-0">
                <span className="text-slate-300 text-lg leading-none">→</span>
                <span className="text-[9px] font-bold text-[#00a982]">
                  {convPct(steps[i + 1].value, step.value)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ClinicCabinetPage() {
  const [stats, setStats] = useState<ClinicStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [appointments, setAppointments] = useState<ClinicAppointmentOut[]>([]);
  const [aptsLoading, setAptsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { setStatsLoading(false); setAptsLoading(false); return; }
    fetchClinicStats(token).then((data) => { setStats(data); setStatsLoading(false); });
    fetchClinicAppointments(token).then((data) => { setAppointments(data); setAptsLoading(false); });
  }, []);

  function refresh() {
    const token = getToken();
    if (!token) return;
    setAptsLoading(true);
    fetchClinicAppointments(token).then((data) => { setAppointments(data); setAptsLoading(false); });
  }

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
      headerTitle="Панель управления"
      headerAction={headerAction}
    >
      {/* ── KPI row (4 карточки) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {/* Новые заявки */}
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 4px 20px rgba(0,27,63,0.06)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Новые заявки</p>
          {statsLoading ? <KpiSkeleton /> : (
            <p className="text-4xl font-extrabold text-[#191c1e] font-[family-name:var(--font-manrope)]">
              {stats?.pending_count ?? "—"}
            </p>
          )}
          {!statsLoading && stats && stats.pending_count > 0 && (
            <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
              ⚡ требуют ответа
            </div>
          )}
          {!statsLoading && (!stats || stats.pending_count === 0) && (
            <p className="text-xs text-slate-400 mt-2">нет ожидающих</p>
          )}
        </div>

        {/* Записей сегодня */}
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 4px 20px rgba(0,27,63,0.06)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Записей сегодня</p>
          {statsLoading ? <KpiSkeleton /> : (
            <p className="text-4xl font-extrabold text-[#191c1e] font-[family-name:var(--font-manrope)]">
              {stats?.today_count ?? "—"}
            </p>
          )}
          <p className="text-xs text-slate-400 mt-2">
            {!statsLoading && stats
              ? `${fmt(stats.today_revenue)} ₽ подтверждено`
              : "без отменённых"}
          </p>
        </div>

        {/* Эффективность месяца — тёмная карточка */}
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #002D62 0%, #003d82 100%)", boxShadow: "0 4px 20px rgba(0,27,63,0.18)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-3">Выручка за месяц</p>
          {statsLoading ? (
            <div className="h-8 w-28 bg-white/20 rounded-lg animate-pulse" />
          ) : (
            <p className="text-3xl font-extrabold text-white font-[family-name:var(--font-manrope)]">
              {stats ? `${fmt(stats.month_revenue)} ₽` : "—"}
            </p>
          )}
          {change && (
            <div className={`mt-2 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${
              isUp ? "bg-[#00a982]/20 text-[#00a982]" : "bg-red-500/20 text-red-300"
            }`}>
              {isUp ? "▲" : "▼"} {change} vs прошлый мес.
            </div>
          )}
          <div className="absolute -right-3 -bottom-3 opacity-10 text-[80px] select-none pointer-events-none">📈</div>
        </div>

        {/* Бонусы использованы */}
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 4px 20px rgba(0,27,63,0.06)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Бонусы</p>
          {statsLoading ? <KpiSkeleton /> : (
            <p className="text-3xl font-extrabold text-[#191c1e] font-[family-name:var(--font-manrope)]">
              {stats ? `${fmt(stats.bonus_used)} ₽` : "—"}
            </p>
          )}
          <p className="text-xs text-slate-400 mt-2">использовано за месяц</p>
        </div>
      </div>

      {/* ── Главный блок: Таймлайн (60%) + Новые заявки (40%) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-5">
        <div className="lg:col-span-3">
          <DayTimeline appointments={appointments} loading={aptsLoading} />
        </div>
        <div className="lg:col-span-2">
          <NewRequestsSidebar appointments={appointments} loading={aptsLoading} onRefresh={refresh} />
        </div>
      </div>

      {/* ── График + Загрузка врачей ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        {/* Revenue chart */}
        <div
          className="lg:col-span-2 rounded-2xl p-6 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #002D62 0%, #003d82 100%)", boxShadow: "0 4px 20px rgba(0,27,63,0.18)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">Выручка по дням</p>
              <p className="text-white text-sm font-medium opacity-80">последние 30 дней</p>
            </div>
            {change && (
              <div className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${
                isUp ? "bg-[#00a982]/20 text-[#00a982] border-[#00a982]/30" : "bg-red-500/20 text-red-300 border-red-500/30"
              }`}>
                {isUp ? "▲" : "▼"} {change}
              </div>
            )}
          </div>

          <RevenueChart days={stats?.revenue_by_day ?? []} loading={statsLoading} />

          <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-wider">Сегодня</p>
              <p className="font-bold text-white text-sm">
                {statsLoading ? "—" : stats ? `${fmt(stats.today_revenue)} ₽` : "—"}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-wider">Текущий месяц</p>
              <p className="font-bold text-white text-sm">
                {statsLoading ? "—" : stats ? `${fmt(stats.month_revenue)} ₽` : "—"}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-wider">Прошлый месяц</p>
              <p className="font-bold text-white text-sm">
                {statsLoading ? "—" : stats ? `${fmt(stats.prev_month_revenue)} ₽` : "—"}
              </p>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 text-[120px] select-none pointer-events-none">📈</div>
        </div>

        {/* Doctor load */}
        <DoctorLoad stats={stats} loading={statsLoading} />
      </div>

      {/* ── Воронка пациентов ── */}
      <div className="mb-5">
        <PatientFunnel stats={stats} loading={statsLoading} />
      </div>

      {/* ── Входящие записи (полная таблица) ── */}
      <ClinicAppointments />
    </CabinetLayout>
  );
}

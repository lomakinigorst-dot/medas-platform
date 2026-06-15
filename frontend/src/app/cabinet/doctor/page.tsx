"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CabinetLayout from "@/components/layout/CabinetLayout";
import { getToken } from "@/lib/auth";
import { fetchDoctorAppointments, fetchCurrentUser, DoctorAppointmentOut, UserMe } from "@/lib/api";

const navItems = [
  { href: "/cabinet/doctor", icon: "🏠", label: "Главная" },
  { href: "/cabinet/doctor/schedule", icon: "📅", label: "Расписание" },
  { href: "/cabinet/doctor/settings", icon: "⚙️", label: "Настройки" },
];

const STATUS_LABEL: Record<string, string> = {
  pending: "Ожидает",
  confirmed: "Подтверждён",
  completed: "Завершён",
  cancelled: "Отменён",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-[#e3fcef] text-[#006644]",
  completed: "bg-[#dbe1ff] text-[#003087]",
  cancelled: "bg-[#f2f4f6] text-[#737686]",
};

const SERVICE_LABEL: Record<string, string> = {
  primary: "Первичный",
  followup: "Повторный",
  online: "Онлайн",
};

function toMoscow(iso: string): Date {
  return new Date(iso);
}

function isToday(iso: string): boolean {
  const d = toMoscow(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
}

function isThisWeek(iso: string): boolean {
  const d = toMoscow(iso);
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return d >= weekAgo && d <= now;
}

function isThisMonth(iso: string): boolean {
  const d = toMoscow(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

export default function DoctorCabinetPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<DoctorAppointmentOut[]>([]);
  const [user, setUser] = useState<UserMe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/login?next=/cabinet/doctor"); return; }

    Promise.all([
      fetchDoctorAppointments(token),
      fetchCurrentUser(token),
    ]).then(([apts, me]) => {
      if (!me || me.role !== "doctor") { router.push("/login"); return; }
      setAppointments(apts);
      setUser(me);
      setLoading(false);
    });
  }, [router]);

  const todayApts = appointments.filter(a => isToday(a.scheduled_at) && a.status !== "cancelled");
  const weekCount = appointments.filter(a => isThisWeek(a.scheduled_at) && a.status !== "cancelled").length;
  const monthCount = appointments.filter(a => isThisMonth(a.scheduled_at) && a.status !== "cancelled").length;
  const pendingCount = appointments.filter(a => a.status === "pending").length;

  const kpi = [
    { label: "Приёмов сегодня", value: todayApts.length.toString(), icon: "📅", color: "bg-[#003087] text-white" },
    { label: "За неделю", value: weekCount.toString(), icon: "📆", color: "bg-[#e3fcef] text-[#006644]" },
    { label: "За месяц", value: monthCount.toString(), icon: "📊", color: "bg-[#dbe1ff] text-[#003087]" },
    { label: "Новых заявок", value: pendingCount.toString(), icon: "🔔", color: "bg-amber-50 text-amber-700" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb]">
        <p className="text-[#737686]">Загрузка...</p>
      </div>
    );
  }

  return (
    <CabinetLayout
      role="doctor"
      userName={user?.name ?? "Врач"}
      userSubtitle="Врач"
      navItems={navItems}
      headerTitle="Личный кабинет врача"
    >
      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpi.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/10 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-extrabold text-[#191c1e] mb-1">{stat.value}</p>
            <p className="text-xs text-[#434655]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Timeline */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#c3c6d7]/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#f2f4f6]">
            <h3 className="font-bold text-[#191c1e] font-[family-name:var(--font-manrope)]">
              Приёмы сегодня{todayApts.length > 0 ? ` — ${todayApts.length}` : ""}
            </h3>
          </div>
          {todayApts.length === 0 ? (
            <div className="p-8 text-center text-[#737686] text-sm">Записей на сегодня нет</div>
          ) : (
            <div className="divide-y divide-[#f2f4f6]">
              {todayApts
                .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
                .map((apt) => {
                  const time = toMoscow(apt.scheduled_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
                  return (
                    <div key={apt.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#f7f9fb] transition-colors">
                      <div className="w-14 text-center flex-shrink-0">
                        <span className="font-bold text-sm text-[#003087]">{time}</span>
                      </div>
                      <div className={`w-2 h-8 rounded-full flex-shrink-0 ${
                        apt.status === "confirmed" ? "bg-[#00a982]" :
                        apt.status === "pending" ? "bg-amber-400" : "bg-[#c3c6d7]"
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[#191c1e] truncate">{apt.patient_name}</p>
                        <p className="text-xs text-[#434655]">{SERVICE_LABEL[apt.service_type] ?? apt.service_type}</p>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg flex-shrink-0 ${STATUS_COLOR[apt.status] ?? "bg-[#f2f4f6] text-[#737686]"}`}>
                        {STATUS_LABEL[apt.status] ?? apt.status}
                      </span>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/10 shadow-sm">
          <h3 className="font-bold text-[#191c1e] font-[family-name:var(--font-manrope)] mb-4">Сводка</h3>
          <div className="space-y-3">
            {[
              { label: "Всего записей", value: appointments.length },
              { label: "Подтверждённых", value: appointments.filter(a => a.status === "confirmed").length },
              { label: "Завершённых", value: appointments.filter(a => a.status === "completed").length },
              { label: "Отменённых", value: appointments.filter(a => a.status === "cancelled").length },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-[#f2f4f6] last:border-0">
                <span className="text-sm text-[#434655]">{label}</span>
                <span className="font-bold text-[#191c1e]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Appointments Table */}
      <div className="mt-8 bg-white rounded-2xl border border-[#c3c6d7]/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#f2f4f6]">
          <h3 className="font-bold text-[#191c1e] font-[family-name:var(--font-manrope)]">Все записи</h3>
        </div>
        {appointments.length === 0 ? (
          <div className="p-8 text-center text-[#737686] text-sm">Записей пока нет</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f7f9fb]">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-bold text-[#434655] uppercase tracking-wider">Дата и время</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-[#434655] uppercase tracking-wider">Пациент</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-[#434655] uppercase tracking-wider">Тип</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-[#434655] uppercase tracking-wider">Статус</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-[#434655] uppercase tracking-wider">Клиника</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f4f6]">
                {appointments.map((apt) => {
                  const dt = toMoscow(apt.scheduled_at);
                  const dateStr = dt.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
                  const timeStr = dt.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
                  return (
                    <tr key={apt.id} className="hover:bg-[#f7f9fb] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-[#191c1e]">{dateStr}</span>
                        <span className="text-[#737686] ml-2">{timeStr}</span>
                      </td>
                      <td className="px-6 py-4 font-medium text-[#191c1e]">{apt.patient_name}</td>
                      <td className="px-6 py-4 text-[#434655]">{SERVICE_LABEL[apt.service_type] ?? apt.service_type}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${STATUS_COLOR[apt.status] ?? "bg-[#f2f4f6] text-[#737686]"}`}>
                          {STATUS_LABEL[apt.status] ?? apt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#434655]">{apt.clinic_name ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </CabinetLayout>
  );
}

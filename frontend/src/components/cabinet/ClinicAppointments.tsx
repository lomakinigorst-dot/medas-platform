"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  fetchClinicAppointments,
  confirmAppointment,
  cancelAppointment,
  type ClinicAppointmentOut,
} from "@/lib/api";
import { getToken } from "@/lib/auth";

const STATUS_LABELS: Record<string, string> = {
  pending: "Новая",
  confirmed: "Подтверждена",
  completed: "Выполнена",
  cancelled: "Отменена",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-[#dbe1ff] text-[#003087]",
  confirmed: "bg-[#e3fcef] text-[#006644]",
  completed: "bg-[#e6e8ea] text-[#434655]",
  cancelled: "bg-[#ffdad6] text-[#ba1a1a]",
};

const SERVICE_LABELS: Record<string, string> = {
  primary: "Первичный",
  followup: "Повторный",
  online: "Онлайн",
};

type Filter = "all" | "today" | "week";

const PAGE_SIZE = 20;

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" }),
    time: d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
  };
}

function isToday(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function isThisWeek(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay() + 1);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  return d >= weekStart && d < weekEnd;
}

export default function ClinicAppointments() {
  const [appointments, setAppointments] = useState<ClinicAppointmentOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [acting, setActing] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    const data = await fetchClinicAppointments(token);
    setAppointments(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    if (filter === "today") return appointments.filter((a) => isToday(a.scheduled_at));
    if (filter === "week") return appointments.filter((a) => isThisWeek(a.scheduled_at));
    return appointments;
  }, [appointments, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  const handleConfirm = useCallback(async (id: number) => {
    const token = getToken();
    if (!token) return;
    setActing(id);
    await confirmAppointment(id, token);
    await load();
    setActing(null);
  }, [load]);

  const handleCancel = useCallback(async (id: number) => {
    const token = getToken();
    if (!token) return;
    setActing(id);
    await cancelAppointment(id, token);
    await load();
    setActing(null);
  }, [load]);

  const handleComplete = useCallback(async (id: number) => {
    const token = getToken();
    if (!token) return;
    setActing(id);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "https://api.med-as.ru/api/v1"}/appointments/${id}/complete`,
      { method: "PATCH", headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.ok) await load();
    setActing(null);
  }, [load]);

  if (loading) {
    return <div className="text-sm text-[#434655] text-center py-6">Загрузка записей...</div>;
  }

  return (
    <div className="bg-white rounded-2xl border border-[#c3c6d7]/10 shadow-sm overflow-hidden">
      {/* Header + filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-6 border-b border-[#f2f4f6]">
        <h3 className="font-bold text-[#191c1e] font-[family-name:var(--font-manrope)]">
          Входящие записи
          {filtered.length > 0 && (
            <span className="ml-2 text-xs font-semibold text-[#434655] bg-[#f2f4f6] px-2 py-0.5 rounded-full">
              {filtered.length}
            </span>
          )}
        </h3>
        <div className="flex gap-1 bg-[#f2f4f6] p-1 rounded-xl text-xs font-semibold">
          {(["all", "today", "week"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === f ? "bg-white text-[#003087] shadow-sm" : "text-[#434655] hover:text-[#191c1e]"
              }`}
            >
              {f === "all" ? "Все" : f === "today" ? "Сегодня" : "Неделя"}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-sm text-[#434655]">
          {filter === "today" ? "Сегодня нет записей" : filter === "week" ? "На этой неделе нет записей" : "Записей пока нет"}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f7f9fb]">
              <tr className="text-xs text-[#434655] font-bold uppercase tracking-wider">
                <th className="px-6 py-3 text-left">Пациент</th>
                <th className="px-6 py-3 text-left">Врач</th>
                <th className="px-6 py-3 text-left">Услуга</th>
                <th className="px-6 py-3 text-left">Дата / Время</th>
                <th className="px-6 py-3 text-left">Стоимость</th>
                <th className="px-6 py-3 text-left">Статус</th>
                <th className="px-6 py-3 text-left">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2f4f6]">
              {paginated.map((apt) => {
                const { date, time } = formatDateTime(apt.scheduled_at);
                const busy = acting === apt.id;
                return (
                  <tr key={apt.id} className="hover:bg-[#f7f9fb] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#dbe1ff] text-[#003087] flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {apt.patient_name.charAt(0)}
                        </div>
                        <span className="font-medium text-sm text-[#191c1e]">{apt.patient_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#434655]">{apt.doctor_name}</td>
                    <td className="px-6 py-4 text-sm text-[#434655]">
                      {SERVICE_LABELS[apt.service_type] ?? apt.service_type}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[#191c1e]">
                      {date} · {time}
                    </td>
                    <td className="px-6 py-4 font-bold text-sm text-[#003087]">
                      {apt.price.toLocaleString("ru-RU")} ₽
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[apt.status] ?? "bg-[#e6e8ea] text-[#434655]"}`}>
                        {STATUS_LABELS[apt.status] ?? apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {apt.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleConfirm(apt.id)}
                              disabled={busy}
                              className="px-3 py-1 bg-[#003087] text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                            >
                              {busy ? "..." : "Принять"}
                            </button>
                            <button
                              onClick={() => handleCancel(apt.id)}
                              disabled={busy}
                              className="px-3 py-1 bg-[#f2f4f6] text-[#434655] text-xs font-bold rounded-lg hover:bg-[#e6e8ea] transition-all disabled:opacity-50"
                            >
                              Отклонить
                            </button>
                          </>
                        )}
                        {apt.status === "confirmed" && (
                          <>
                            <button
                              onClick={() => handleComplete(apt.id)}
                              disabled={busy}
                              className="px-3 py-1 bg-[#00a982] text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                            >
                              {busy ? "..." : "Завершить"}
                            </button>
                            <button
                              onClick={() => handleCancel(apt.id)}
                              disabled={busy}
                              className="px-3 py-1 bg-[#f2f4f6] text-[#434655] text-xs font-bold rounded-lg hover:bg-[#e6e8ea] transition-all disabled:opacity-50"
                            >
                              Отменить
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#f2f4f6]">
          <p className="text-xs text-[#434655]">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} из {filtered.length} записей
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#f2f4f6] text-[#434655] disabled:opacity-40 hover:bg-[#e6e8ea] transition-colors"
            >
              ← Назад
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page + i - 3;
              if (p < 1 || p > totalPages) return null;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 text-xs font-bold rounded-lg transition-colors ${
                    p === page
                      ? "bg-[#003087] text-white"
                      : "bg-[#f2f4f6] text-[#434655] hover:bg-[#e6e8ea]"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#f2f4f6] text-[#434655] disabled:opacity-40 hover:bg-[#e6e8ea] transition-colors"
            >
              Вперёд →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

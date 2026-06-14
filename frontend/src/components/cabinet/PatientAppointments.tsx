"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchMyAppointments, cancelAppointment, type AppointmentOut } from "@/lib/api";
import { getToken } from "@/lib/auth";
import Link from "next/link";

const STATUS_LABELS: Record<string, string> = {
  pending: "Ожидает",
  confirmed: "Подтверждён",
  completed: "Завершён",
  cancelled: "Отменён",
};

function formatDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  const date = d.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
  const time = d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  return { date, time };
}

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState<AppointmentOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<number | null>(null);

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    const data = await fetchMyAppointments(token);
    setAppointments(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCancel = useCallback(async (id: number) => {
    const token = getToken();
    if (!token) return;
    setCancelling(id);
    const ok = await cancelAppointment(id, token);
    if (ok) await load();
    setCancelling(null);
  }, [load]);

  const upcoming = appointments.filter((a) => a.status === "pending" || a.status === "confirmed");
  const past = appointments.filter((a) => a.status === "completed" || a.status === "cancelled");

  if (loading) {
    return (
      <div className="text-sm text-[#434655] py-4 text-center">
        Загрузка приёмов...
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-[#c3c6d7]/10 shadow-sm text-center">
        <div className="text-4xl mb-3">📅</div>
        <p className="font-bold text-[#191c1e] mb-1">Нет записей</p>
        <p className="text-sm text-[#434655] mb-4">Запишитесь к врачу прямо сейчас</p>
        <Link
          href="/search"
          className="inline-block px-6 py-2.5 bg-[#003087] text-white font-bold rounded-xl text-sm hover:opacity-90 transition-all"
        >
          Найти врача
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {upcoming.length > 0 && (
        <>
          {upcoming.map((apt) => {
            const { date, time } = formatDateTime(apt.scheduled_at);
            return (
              <div
                key={apt.id}
                className="bg-white rounded-2xl p-6 border border-[#003087]/20 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#f2f4f6] flex items-center justify-center text-xl">📅</div>
                    <div>
                      <h4 className="font-bold text-[#191c1e]">{apt.doctor_name}</h4>
                      <p className="text-sm text-[#434655]">
                        {apt.clinic_name ?? "Клиника"} · {STATUS_LABELS[apt.status] ?? apt.status}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-sm text-[#191c1e]">{date}</p>
                    <p className="text-xs text-[#434655]">{time}</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-4 pt-4 border-t border-[#c3c6d7]/10">
                  <button
                    onClick={() => handleCancel(apt.id)}
                    disabled={cancelling === apt.id}
                    className="flex-1 py-2 bg-[#f2f4f6] text-[#434655] text-xs font-bold rounded-lg hover:bg-[#e6e8ea] transition-all disabled:opacity-50"
                  >
                    {cancelling === apt.id ? "Отменяем..." : "Отменить"}
                  </button>
                </div>
              </div>
            );
          })}
        </>
      )}

      {past.map((apt) => {
        const { date, time } = formatDateTime(apt.scheduled_at);
        return (
          <div
            key={apt.id}
            className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/10 shadow-sm opacity-70"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#f2f4f6] flex items-center justify-center text-xl">
                  {apt.status === "completed" ? "✅" : "❌"}
                </div>
                <div>
                  <h4 className="font-bold text-[#191c1e]">{apt.doctor_name}</h4>
                  <p className="text-sm text-[#434655]">
                    {apt.clinic_name ?? "Клиника"} · {STATUS_LABELS[apt.status] ?? apt.status}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-sm text-[#191c1e]">{date}</p>
                <p className="text-xs text-[#434655]">{time}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import CabinetLayout from "@/components/layout/CabinetLayout";
import { getToken } from "@/lib/auth";
import {
  fetchCurrentUser,
  fetchClinicDoctors,
  fetchDoctorSchedule,
  putDoctorSchedule,
  fetchDoctorDayOffs,
  addDoctorDayOff,
  removeDoctorDayOff,
  type ClinicDoctorOut,
  type ScheduleItem,
  type DayOffItem,
} from "@/lib/api";

const navItems = [
  { href: "/cabinet/clinic", icon: "📊", label: "Дашборд" },
  { href: "/cabinet/clinic/doctors", icon: "👨‍⚕️", label: "Врачи" },
  { href: "/cabinet/clinic/schedule", icon: "📅", label: "Расписание" },
  { href: "/cabinet/clinic/appointments", icon: "📋", label: "Записи" },
  { href: "/cabinet/clinic/reports", icon: "📈", label: "Отчёты" },
  { href: "/cabinet/clinic/settings", icon: "⚙️", label: "Настройки" },
];

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function initials(name: string): string {
  const parts = name.trim().split(" ");
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

function today8(): string {
  const d = new Date();
  d.setDate(d.getDate());
  return d.toISOString().slice(0, 10);
}

// ─── Doctor schedule row ──────────────────────────────────────────────────────

function DoctorScheduleRow({
  doctor,
  token,
}: {
  doctor: ClinicDoctorOut;
  token: string;
}) {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [dayOffs, setDayOffs] = useState<DayOffItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [newDayOff, setNewDayOff] = useState("");
  const [newReason, setNewReason] = useState("");

  useEffect(() => {
    fetchDoctorSchedule(doctor.id, token).then(setSchedule);
    fetchDoctorDayOffs(doctor.id, token).then(setDayOffs);
  }, [doctor.id, token]);

  const isWorkday = (wd: number) => schedule.some((s) => s.weekday === wd);
  const getSlot = (wd: number) => schedule.find((s) => s.weekday === wd);

  function toggleDay(wd: number) {
    if (isWorkday(wd)) {
      setSchedule((prev) => prev.filter((s) => s.weekday !== wd));
    } else {
      setSchedule((prev) => [...prev, { weekday: wd, start_time: "09:00", end_time: "18:00", slot_duration_min: 30 }]);
    }
  }

  function updateTime(wd: number, field: "start_time" | "end_time", val: string) {
    setSchedule((prev) =>
      prev.map((s) => s.weekday === wd ? { ...s, [field]: val } : s)
    );
  }

  async function saveSchedule() {
    setSaving(true);
    await putDoctorSchedule(doctor.id, schedule, token);
    setSaving(false);
  }

  async function handleAddDayOff() {
    if (!newDayOff) return;
    const ok = await addDoctorDayOff(doctor.id, newDayOff, newReason || null, token);
    if (ok) {
      setDayOffs((prev) => [...prev, { date: newDayOff, reason: newReason || null }]);
      setNewDayOff("");
      setNewReason("");
    }
  }

  async function handleRemoveDayOff(d: string) {
    const ok = await removeDoctorDayOff(doctor.id, d, token);
    if (ok) setDayOffs((prev) => prev.filter((x) => x.date !== d));
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(0,27,63,0.06)" }}>
      {/* Header */}
      <button
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#f7f9fb] transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#dbe1ff] text-[#003087] flex items-center justify-center text-sm font-bold uppercase">
            {initials(doctor.name)}
          </div>
          <div className="text-left">
            <p className="font-bold text-[#191c1e] font-[family-name:var(--font-manrope)]">{doctor.name}</p>
            <p className="text-xs text-slate-400">{doctor.specialty}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {WEEKDAYS.map((label, wd) => (
              <span
                key={wd}
                className={`w-6 h-6 rounded-full text-[9px] font-bold flex items-center justify-center ${
                  isWorkday(wd) ? "bg-[#003087] text-white" : "bg-[#f2f4f6] text-[#c3c6d7]"
                }`}
              >
                {label[0]}
              </span>
            ))}
          </div>
          <span className="text-slate-400 text-sm">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-[#f2f4f6] px-5 py-4 space-y-5">

          {/* Weekday schedule */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Расписание по дням</p>
            <div className="grid grid-cols-7 gap-2">
              {WEEKDAYS.map((label, wd) => {
                const slot = getSlot(wd);
                const active = !!slot;
                return (
                  <div key={wd} className="flex flex-col gap-1">
                    <button
                      onClick={() => toggleDay(wd)}
                      className={`w-full py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        active ? "bg-[#003087] text-white" : "bg-[#f2f4f6] text-[#c3c6d7] hover:bg-[#e6e8ea] hover:text-[#434655]"
                      }`}
                    >
                      {label}
                    </button>
                    {active && slot && (
                      <div className="flex flex-col gap-1">
                        <input
                          type="time"
                          value={slot.start_time}
                          onChange={(e) => updateTime(wd, "start_time", e.target.value)}
                          className="w-full text-[10px] border border-[#e6e8ea] rounded-lg px-1 py-1 focus:outline-none focus:ring-1 focus:ring-[#003087]/30 text-center"
                        />
                        <input
                          type="time"
                          value={slot.end_time}
                          onChange={(e) => updateTime(wd, "end_time", e.target.value)}
                          className="w-full text-[10px] border border-[#e6e8ea] rounded-lg px-1 py-1 focus:outline-none focus:ring-1 focus:ring-[#003087]/30 text-center"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <button
              onClick={saveSchedule}
              disabled={saving}
              className="mt-3 px-4 py-2 bg-[#003087] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
            >
              {saving ? "Сохраняю..." : "Сохранить расписание"}
            </button>
          </div>

          {/* Day-offs */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Выходные дни</p>

            {dayOffs.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {dayOffs
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map((d) => (
                    <div key={d.date} className="flex items-center gap-1.5 bg-[#fff3cd] border border-[#ffc107]/30 rounded-lg px-2.5 py-1">
                      <span className="text-xs font-semibold text-[#856404]">{d.date}</span>
                      {d.reason && <span className="text-[10px] text-[#856404]/70">· {d.reason}</span>}
                      <button
                        onClick={() => handleRemoveDayOff(d.date)}
                        className="text-[#856404] hover:text-[#ba1a1a] text-xs font-bold ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              <input
                type="date"
                value={newDayOff}
                min={today8()}
                onChange={(e) => setNewDayOff(e.target.value)}
                className="border border-[#e6e8ea] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/20"
              />
              <input
                type="text"
                placeholder="Причина (необязательно)"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                className="flex-1 min-w-[140px] border border-[#e6e8ea] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/20"
              />
              <button
                onClick={handleAddDayOff}
                disabled={!newDayOff}
                className="px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all disabled:opacity-40"
              >
                + Закрыть дату
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ClinicSchedulePage() {
  const [doctors, setDoctors] = useState<ClinicDoctorOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const load = useCallback(async () => {
    const t = getToken();
    if (!t) { setLoading(false); return; }
    setToken(t);
    const user = await fetchCurrentUser(t);
    if (!user?.clinic_id) { setLoading(false); return; }
    const data = await fetchClinicDoctors(user.clinic_id, t);
    setDoctors(data.filter((d) => d.is_active));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <CabinetLayout
      role="clinic"
      userName="СМ-Клиника"
      userSubtitle="Панель клиники"
      navItems={navItems}
      headerTitle="Расписание"
    >
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-white rounded-2xl animate-pulse" style={{ boxShadow: "0 4px 20px rgba(0,27,63,0.06)" }} />
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center" style={{ boxShadow: "0 4px 20px rgba(0,27,63,0.06)" }}>
          <p className="text-3xl mb-3">📅</p>
          <p className="font-medium text-[#191c1e]">Нет активных врачей</p>
          <p className="text-sm text-slate-400 mt-1">Активируйте врачей в разделе «Врачи»</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-slate-400 mb-1">
            Нажмите на врача чтобы настроить расписание и выходные дни
          </p>
          {token && doctors.map((doc) => (
            <DoctorScheduleRow key={doc.id} doctor={doc} token={token} />
          ))}
        </div>
      )}
    </CabinetLayout>
  );
}

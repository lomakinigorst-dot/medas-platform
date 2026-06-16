"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import CabinetLayout from "@/components/layout/CabinetLayout";
import { getToken } from "@/lib/auth";
import {
  fetchCurrentUser,
  fetchDoctorSchedule,
  putDoctorSchedule,
  fetchDoctorDayOffs,
  addDoctorDayOff,
  removeDoctorDayOff,
  type UserMe,
  type ScheduleItem,
  type DayOffItem,
} from "@/lib/api";

const navItems = [
  { href: "/cabinet/doctor", icon: "🏠", label: "Главная" },
  { href: "/cabinet/doctor/schedule", icon: "📅", label: "Расписание" },
  { href: "/cabinet/doctor/settings", icon: "⚙️", label: "Настройки" },
];

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function DoctorSchedulePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserMe | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [dayOffs, setDayOffs] = useState<DayOffItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [newDayOff, setNewDayOff] = useState(todayStr());
  const [newReason, setNewReason] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/login?next=/cabinet/doctor/schedule"); return; }

    fetchCurrentUser(token).then((me) => {
      if (!me || me.role !== "doctor") { router.push("/login"); return; }
      setUser(me);
      if (me.doctor_id) {
        Promise.all([
          fetchDoctorSchedule(me.doctor_id, token),
          fetchDoctorDayOffs(me.doctor_id, token),
        ]).then(([sched, doffs]) => {
          setSchedule(sched);
          setDayOffs(doffs);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  const reload = useCallback(async () => {
    const token = getToken();
    if (!token || !user?.doctor_id) return;
    const [sched, doffs] = await Promise.all([
      fetchDoctorSchedule(user.doctor_id, token),
      fetchDoctorDayOffs(user.doctor_id, token),
    ]);
    setSchedule(sched);
    setDayOffs(doffs);
  }, [user]);

  function isWorkday(wd: number) { return schedule.some((s) => s.weekday === wd); }
  function getSlot(wd: number) { return schedule.find((s) => s.weekday === wd); }

  function toggleDay(wd: number) {
    if (isWorkday(wd)) {
      setSchedule((prev) => prev.filter((s) => s.weekday !== wd));
    } else {
      setSchedule((prev) => [...prev, { weekday: wd, start_time: "09:00", end_time: "18:00", slot_duration_min: 30 }]);
    }
  }

  function updateTime(wd: number, field: "start_time" | "end_time", val: string) {
    setSchedule((prev) => prev.map((s) => s.weekday === wd ? { ...s, [field]: val } : s));
  }

  async function saveSchedule() {
    const token = getToken();
    if (!token || !user?.doctor_id) return;
    setSaving(true);
    await putDoctorSchedule(user.doctor_id, schedule, token);
    setSaving(false);
  }

  async function handleAddDayOff() {
    const token = getToken();
    if (!token || !user?.doctor_id || !newDayOff) return;
    await addDoctorDayOff(user.doctor_id, newDayOff, newReason || null, token);
    setNewDayOff(todayStr());
    setNewReason("");
    await reload();
  }

  async function handleRemoveDayOff(date: string) {
    const token = getToken();
    if (!token || !user?.doctor_id) return;
    await removeDoctorDayOff(user.doctor_id, date, token);
    await reload();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb]">
        <p className="text-[#737686]">Загрузка...</p>
      </div>
    );
  }

  if (!user?.doctor_id) {
    return (
      <CabinetLayout role="doctor" userName={user?.name ?? "Врач"} userSubtitle="Расписание" navItems={navItems} headerTitle="Расписание">
        <div className="bg-white rounded-2xl p-8 border border-[#c3c6d7]/10 shadow-sm text-center">
          <p className="text-[#737686]">Профиль врача не привязан к аккаунту. Обратитесь в администрацию клиники.</p>
        </div>
      </CabinetLayout>
    );
  }

  return (
    <CabinetLayout
      role="doctor"
      userName={user.name}
      userSubtitle="Расписание"
      navItems={navItems}
      headerTitle="Моё расписание"
    >
      {/* Weekly schedule */}
      <div className="bg-white rounded-2xl border border-[#c3c6d7]/10 shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-[#f2f4f6] flex items-center justify-between">
          <h3 className="font-bold text-[#191c1e]">Рабочие дни и время приёма</h3>
          <button
            onClick={saveSchedule}
            disabled={saving}
            className="px-4 py-2 bg-[#003087] text-white text-sm font-semibold rounded-xl hover:bg-[#002070] disabled:opacity-60 transition-colors"
          >
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
        <div className="p-6 space-y-3">
          {WEEKDAYS.map((label, idx) => {
            const wd = idx + 1;
            const slot = getSlot(wd);
            return (
              <div key={wd} className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={() => toggleDay(wd)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-colors flex-shrink-0 ${
                    isWorkday(wd)
                      ? "bg-[#003087] text-white"
                      : "bg-[#f2f4f6] text-[#737686] hover:bg-[#e3e5ea]"
                  }`}
                >
                  {label}
                </button>
                {isWorkday(wd) && slot && (
                  <>
                    <input
                      type="time"
                      value={slot.start_time}
                      onChange={(e) => updateTime(wd, "start_time", e.target.value)}
                      className="border border-[#c3c6d7] rounded-lg px-3 py-1.5 text-sm text-[#191c1e]"
                    />
                    <span className="text-[#737686] text-sm">—</span>
                    <input
                      type="time"
                      value={slot.end_time}
                      onChange={(e) => updateTime(wd, "end_time", e.target.value)}
                      className="border border-[#c3c6d7] rounded-lg px-3 py-1.5 text-sm text-[#191c1e]"
                    />
                    <span className="text-xs text-[#737686]">слот 30 мин</span>
                  </>
                )}
                {!isWorkday(wd) && (
                  <span className="text-sm text-[#737686]">выходной</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Day-offs */}
      <div className="bg-white rounded-2xl border border-[#c3c6d7]/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#f2f4f6]">
          <h3 className="font-bold text-[#191c1e]">Выходные дни (конкретные даты)</h3>
        </div>
        <div className="p-6 space-y-4">
          {/* Add day-off */}
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="date"
              value={newDayOff}
              min={todayStr()}
              onChange={(e) => setNewDayOff(e.target.value)}
              className="border border-[#c3c6d7] rounded-lg px-3 py-1.5 text-sm text-[#191c1e]"
            />
            <input
              type="text"
              placeholder="Причина (необязательно)"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              className="border border-[#c3c6d7] rounded-lg px-3 py-1.5 text-sm text-[#191c1e] flex-1 min-w-[160px]"
            />
            <button
              onClick={handleAddDayOff}
              className="px-4 py-2 bg-[#00a982] text-white text-sm font-semibold rounded-xl hover:bg-[#008f6e] transition-colors"
            >
              + Добавить
            </button>
          </div>

          {/* Existing day-offs */}
          {dayOffs.length === 0 ? (
            <p className="text-sm text-[#737686]">Нет запланированных выходных дней.</p>
          ) : (
            <div className="space-y-2">
              {dayOffs.map((d) => (
                <div key={d.date} className="flex items-center justify-between bg-[#fff8f6] border border-[#ffdad6] rounded-xl px-4 py-2">
                  <div>
                    <span className="font-semibold text-sm text-[#191c1e]">{d.date}</span>
                    {d.reason && <span className="ml-2 text-xs text-[#737686]">{d.reason}</span>}
                  </div>
                  <button
                    onClick={() => handleRemoveDayOff(d.date)}
                    className="text-xs text-[#b3261e] font-semibold hover:underline"
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </CabinetLayout>
  );
}

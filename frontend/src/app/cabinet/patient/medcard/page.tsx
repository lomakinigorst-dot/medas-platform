"use client";

import { useState, useEffect, useCallback } from "react";
import CabinetLayout from "@/components/layout/CabinetLayout";
import { getToken } from "@/lib/auth";
import { fetchCurrentUser, fetchMyAppointments, patchProfile, type UserMe, type AppointmentOut } from "@/lib/api";

const navItems = [
  { href: "/cabinet/patient", icon: "🏠", label: "Главная" },
  { href: "/cabinet/patient/appointments", icon: "📅", label: "Приёмы" },
  { href: "/cabinet/patient/medcard", icon: "📋", label: "Медкарта" },
  { href: "/cabinet/patient/family", icon: "👨‍👩‍👧", label: "Семейный профиль" },
  { href: "/cabinet/patient/bonuses", icon: "🎁", label: "Бонусы" },
  { href: "/cabinet/patient/favorites", icon: "❤️", label: "Избранные врачи" },
];

const BLOOD_TYPES = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"];

function calcAge(birth: string | null): number | null {
  if (!birth) return null;
  const b = new Date(birth);
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  if (now < new Date(now.getFullYear(), b.getMonth(), b.getDate())) age--;
  return age;
}

function calcBmi(weight: number | null, height: number | null): { value: string; label: string; color: string } | null {
  if (!weight || !height) return null;
  const bmi = weight / ((height / 100) ** 2);
  const value = bmi.toFixed(1);
  if (bmi < 18.5) return { value, label: "Дефицит", color: "text-blue-600" };
  if (bmi < 25) return { value, label: "Норма", color: "text-[#00a982]" };
  if (bmi < 30) return { value, label: "Избыток", color: "text-amber-500" };
  return { value, label: "Ожирение", color: "text-red-500" };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

function formatBirth(birth: string | null): string {
  if (!birth) return "—";
  return new Date(birth).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

function statusLabel(status: string): { text: string; cls: string } {
  const map: Record<string, { text: string; cls: string }> = {
    completed: { text: "Завершён", cls: "bg-[#e8f5e9] text-[#1b5e20]" },
    confirmed: { text: "Подтверждён", cls: "bg-[#e3f2fd] text-[#0d47a1]" },
    pending: { text: "Ожидание", cls: "bg-amber-50 text-amber-800" },
    cancelled: { text: "Отменён", cls: "bg-[#ffebee] text-[#b71c1c]" },
  };
  return map[status] ?? { text: status, cls: "bg-[#f2f4f6] text-[#434655]" };
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

interface EditModalProps {
  user: UserMe;
  onSave: (data: Partial<UserMe>) => Promise<void>;
  onClose: () => void;
}

function EditModal({ user, onSave, onClose }: EditModalProps) {
  const [form, setForm] = useState({
    name: user.name ?? "",
    birth_date: user.birth_date ?? "",
    blood_type: user.blood_type ?? "",
    allergies: user.allergies ?? "",
    chronic_conditions: user.chronic_conditions ?? "",
    weight_kg: user.weight_kg?.toString() ?? "",
    height_cm: user.height_cm?.toString() ?? "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({
      name: form.name || undefined,
      birth_date: form.birth_date || null,
      blood_type: form.blood_type || null,
      allergies: form.allergies || null,
      chronic_conditions: form.chronic_conditions || null,
      weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
      height_cm: form.height_cm ? parseInt(form.height_cm) : null,
    });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-[#f2f4f6] flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#191c1e] font-[family-name:var(--font-manrope)]">Редактировать профиль</h2>
          <button onClick={onClose} className="text-[#737686] hover:text-[#191c1e] transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#737686] uppercase tracking-wider mb-1.5">Полное имя</label>
            <input type="text" value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full border border-[#c3c6d7]/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/20" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#737686] uppercase tracking-wider mb-1.5">Дата рождения</label>
              <input type="date" value={form.birth_date} onChange={(e) => setForm(p => ({ ...p, birth_date: e.target.value }))}
                className="w-full border border-[#c3c6d7]/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/20" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#737686] uppercase tracking-wider mb-1.5">Группа крови</label>
              <select value={form.blood_type} onChange={(e) => setForm(p => ({ ...p, blood_type: e.target.value }))}
                className="w-full border border-[#c3c6d7]/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/20 bg-white">
                <option value="">Не указана</option>
                {BLOOD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#737686] uppercase tracking-wider mb-1.5">Рост (см)</label>
              <input type="number" min="100" max="250" value={form.height_cm} onChange={(e) => setForm(p => ({ ...p, height_cm: e.target.value }))}
                placeholder="175" className="w-full border border-[#c3c6d7]/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/20" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#737686] uppercase tracking-wider mb-1.5">Вес (кг)</label>
              <input type="number" min="30" max="300" step="0.1" value={form.weight_kg} onChange={(e) => setForm(p => ({ ...p, weight_kg: e.target.value }))}
                placeholder="70" className="w-full border border-[#c3c6d7]/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/20" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#737686] uppercase tracking-wider mb-1.5">Аллергии</label>
            <textarea rows={2} value={form.allergies} onChange={(e) => setForm(p => ({ ...p, allergies: e.target.value }))}
              placeholder="Пенициллин, латекс, пыльца берёзы..."
              className="w-full border border-[#c3c6d7]/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/20 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#737686] uppercase tracking-wider mb-1.5">Хронические заболевания</label>
            <textarea rows={2} value={form.chronic_conditions} onChange={(e) => setForm(p => ({ ...p, chronic_conditions: e.target.value }))}
              placeholder="Гипертония I ст., сахарный диабет 2 типа..."
              className="w-full border border-[#c3c6d7]/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/20 resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[#c3c6d7]/40 text-sm font-bold text-[#434655] hover:bg-[#f7f9fb] transition-colors">
              Отмена
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 rounded-xl bg-[#003087] text-white text-sm font-bold hover:opacity-90 transition-all disabled:opacity-60">
              {saving ? "Сохраняю..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Visit Card (accordion) ────────────────────────────────────────────────────

function VisitCard({ visit }: { visit: AppointmentOut }) {
  const [open, setOpen] = useState(false);
  const s = statusLabel(visit.status);
  const date = new Date(visit.scheduled_at);
  const dayNum = date.toLocaleDateString("ru-RU", { day: "numeric" });
  const month = date.toLocaleDateString("ru-RU", { month: "short" }).replace(".", "");
  const time = date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="bg-white rounded-2xl border border-[#c3c6d7]/15 shadow-sm overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-[#f7f9fb]/50 transition-colors">
        <div className="w-14 h-14 bg-gradient-to-br from-[#003087]/8 to-[#003087]/16 rounded-2xl flex flex-col items-center justify-center flex-shrink-0">
          <span className="text-base font-extrabold text-[#003087] leading-none">{dayNum}</span>
          <span className="text-[10px] font-bold text-[#003087]/70 uppercase tracking-wide">{month}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-bold text-[#191c1e] text-sm truncate">{visit.doctor_name}</p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${s.cls}`}>{s.text}</span>
          </div>
          <p className="text-xs text-[#737686] truncate">{visit.clinic_name ?? "MEDAS"} · {time}</p>
          <p className="text-xs text-[#434655] mt-0.5">{visit.service_type === "primary" ? "Первичный приём" : visit.service_type === "followup" ? "Повторный приём" : "Онлайн-приём"}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-sm font-bold text-[#003087]">{visit.price.toLocaleString("ru-RU")} ₽</span>
          <svg className={`w-5 h-5 text-[#737686] transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-[#f2f4f6]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <div className="bg-[#f7f9fb] rounded-xl p-4">
              <p className="text-[10px] font-bold text-[#737686] uppercase tracking-widest mb-2">Диагноз</p>
              <p className="text-sm font-semibold text-[#191c1e] leading-snug">Данные заполняются врачом</p>
            </div>
            <div className="bg-[#f7f9fb] rounded-xl p-4">
              <p className="text-[10px] font-bold text-[#737686] uppercase tracking-widest mb-2">Назначение</p>
              <p className="text-sm font-semibold text-[#191c1e] leading-snug">Данные заполняются врачом</p>
            </div>
            <div className="bg-[#f7f9fb] rounded-xl p-4">
              <p className="text-[10px] font-bold text-[#737686] uppercase tracking-widest mb-2">Бонусы</p>
              <div className="space-y-1">
                {visit.bonuses_used > 0 && <p className="text-xs text-[#737686]">Использовано: {visit.bonuses_used} бонусов</p>}
                {visit.bonuses_earned > 0 && <p className="text-xs text-[#00a982] font-bold">+{visit.bonuses_earned} бонусов</p>}
                {visit.bonuses_used === 0 && visit.bonuses_earned === 0 && <p className="text-xs text-[#737686]">—</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function PatientMedcardPage() {
  const [user, setUser] = useState<UserMe | null>(null);
  const [visits, setVisits] = useState<AppointmentOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [specialtyFilter, setSpecialtyFilter] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    Promise.all([fetchCurrentUser(token), fetchMyAppointments(token)]).then(([me, appts]) => {
      if (me) setUser(me);
      setVisits(appts.sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime()));
      setLoading(false);
    });
  }, []);

  const handleSave = useCallback(async (data: Partial<UserMe>) => {
    const token = getToken();
    if (!token) return;
    const updated = await patchProfile(data as Parameters<typeof patchProfile>[0], token);
    if (updated) setUser(updated);
  }, []);

  const handlePdf = () => window.print();

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  const age = calcAge(user?.birth_date ?? null);
  const bmi = calcBmi(user?.weight_kg ?? null, user?.height_cm ?? null);
  const initials = (user?.name ?? "П").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  const allergiesList = user?.allergies?.split(/[,;]+/).map(s => s.trim()).filter(Boolean) ?? [];
  const chronicList = user?.chronic_conditions?.split(/[,;]+/).map(s => s.trim()).filter(Boolean) ?? [];

  const specialties = [...new Set(visits.map(v => v.doctor_name.split(" ").slice(-1)[0]))];
  const filteredVisits = specialtyFilter
    ? visits.filter(v => v.doctor_name.includes(specialtyFilter))
    : visits;

  if (loading) {
    return (
      <CabinetLayout role="patient" userName="..." userSubtitle="Медкарта" navItems={navItems} headerTitle="Электронная медкарта">
        <div className="space-y-4 animate-pulse">
          <div className="h-32 bg-[#f2f4f6] rounded-2xl" />
          <div className="h-24 bg-[#f2f4f6] rounded-2xl" />
          <div className="h-48 bg-[#f2f4f6] rounded-2xl" />
        </div>
      </CabinetLayout>
    );
  }

  return (
    <CabinetLayout
      role="patient"
      userName={user?.name ?? "Пациент"}
      userSubtitle="Электронная медкарта"
      navItems={navItems}
      headerTitle="Медкарта"
    >
      {editOpen && user && <EditModal user={user} onSave={handleSave} onClose={() => setEditOpen(false)} />}

      {/* ── Профиль ── */}
      <div className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/10 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-5">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#003087] to-[#1e40af] flex items-center justify-center text-white text-2xl font-extrabold flex-shrink-0 shadow-lg shadow-[#003087]/20">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#191c1e] font-[family-name:var(--font-manrope)] leading-tight">{user?.name ?? "Пациент"}</h2>
              <p className="text-[#737686] text-sm mt-1">
                {user?.birth_date ? formatBirth(user.birth_date) : "Дата рождения не указана"}
                {age && ` · ${age} лет`}
              </p>
              <div className="flex flex-wrap gap-2 mt-2.5">
                {user?.blood_type ? (
                  <span className="px-3 py-1 bg-[#003087] text-white text-xs font-bold rounded-lg">
                    {user.blood_type}
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-[#f2f4f6] text-[#737686] text-xs font-bold rounded-lg">Группа крови не указана</span>
                )}
                {allergiesList.length > 0 && (
                  <span className="px-3 py-1 bg-[#ffdad6] text-[#93000a] text-xs font-bold rounded-lg flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    Аллергия: {allergiesList[0]}{allergiesList.length > 1 ? ` +${allergiesList.length - 1}` : ""}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2.5 flex-wrap">
            <button onClick={() => setEditOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#003087] text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Редактировать
            </button>
            <button onClick={handlePdf}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#f2f4f6] text-[#434655] text-sm font-bold rounded-xl hover:bg-[#e6e8ea] transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF
            </button>
            <button onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#f2f4f6] text-[#434655] text-sm font-bold rounded-xl hover:bg-[#e6e8ea] transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {copied ? "Скопировано!" : "Поделиться"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Метрики ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "ИМТ",
            value: bmi ? bmi.value : "—",
            sub: bmi ? <span className={`text-xs font-bold ${bmi.color}`}>{bmi.label}</span> : <span className="text-xs text-[#737686]">Укажите рост и вес</span>,
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            ),
          },
          {
            label: "Рост / Вес",
            value: user?.height_cm && user?.weight_kg ? `${user.height_cm} см / ${user.weight_kg} кг` : "—",
            sub: <span className="text-xs text-[#737686]">Физические параметры</span>,
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            ),
          },
          {
            label: "Группа крови",
            value: user?.blood_type ?? "—",
            sub: <span className="text-xs text-[#737686]">{user?.blood_type ? "Резус-фактор учтён" : "Не указана"}</span>,
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            ),
          },
          {
            label: "Хронических",
            value: chronicList.length > 0 ? String(chronicList.length) : "0",
            sub: <span className="text-xs text-[#737686]">{chronicList.length > 0 ? "Заболевани" + (chronicList.length === 1 ? "е" : "й") : "Не выявлено"}</span>,
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            ),
          },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-2xl p-5 border border-[#c3c6d7]/10 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#003087]/8 flex items-center justify-center text-[#003087]">
                {m.icon}
              </div>
              <span className="text-xs font-bold text-[#737686] uppercase tracking-wider">{m.label}</span>
            </div>
            <p className="text-2xl font-extrabold text-[#191c1e] font-[family-name:var(--font-manrope)] mb-1">{m.value}</p>
            {m.sub}
          </div>
        ))}
      </div>

      {/* ── Двухколоночный layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левая колонка */}
        <div className="space-y-4">
          {/* Аллергии */}
          <div className="bg-white rounded-2xl p-5 border border-[#c3c6d7]/10 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-[#ffdad6] flex items-center justify-center">
                <svg className="w-4 h-4 text-[#93000a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-sm text-[#191c1e]">Аллергии</h3>
            </div>
            {allergiesList.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {allergiesList.map(a => (
                  <span key={a} className="px-3 py-1.5 bg-[#fff3f2] border border-[#ffdad6] text-[#93000a] text-xs font-bold rounded-lg">{a}</span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#737686]">Не указаны. Нажмите «Редактировать» чтобы добавить.</p>
            )}
          </div>

          {/* Хронические */}
          <div className="bg-white rounded-2xl p-5 border border-[#c3c6d7]/10 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-sm text-[#191c1e]">Хронические заболевания</h3>
            </div>
            {chronicList.length > 0 ? (
              <div className="space-y-2">
                {chronicList.map(c => (
                  <div key={c} className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-xl">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                    <span className="text-xs font-semibold text-amber-900">{c}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#737686]">Не указаны. Нажмите «Редактировать» чтобы добавить.</p>
            )}
          </div>

          {/* Препараты */}
          <div className="bg-white rounded-2xl p-5 border border-[#c3c6d7]/10 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-[#003087]/8 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#003087]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="font-bold text-sm text-[#191c1e]">Препараты</h3>
            </div>
            <p className="text-xs text-[#737686] leading-relaxed">Список препаратов заполняется врачом по итогам приёма.</p>
            {visits.length > 0 && (
              <div className="mt-3 p-3 bg-[#f7f9fb] rounded-xl">
                <p className="text-xs font-bold text-[#003087]">Последний приём: {formatDate(visits[0].scheduled_at)}</p>
                <p className="text-xs text-[#737686] mt-0.5">{visits[0].doctor_name}</p>
              </div>
            )}
          </div>
        </div>

        {/* История визитов */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#191c1e] font-[family-name:var(--font-manrope)]">
              История визитов
              {visits.length > 0 && <span className="ml-2 text-sm font-normal text-[#737686]">({visits.length})</span>}
            </h3>
            {visits.length > 0 && (
              <select value={specialtyFilter} onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="text-xs bg-[#f2f4f6] border-none rounded-xl px-3 py-2 font-medium text-[#434655] focus:ring-2 focus:ring-[#003087]/20 outline-none">
                <option value="">Все врачи</option>
                {specialties.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            )}
          </div>

          {filteredVisits.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 border border-[#c3c6d7]/10 shadow-sm text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#f2f4f6] rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-[#c3c6d7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-[#434655] font-semibold mb-2">История визитов пуста</p>
              <p className="text-sm text-[#737686]">Ваши записи к врачам появятся здесь после первого приёма.</p>
              <a href="/search" className="inline-block mt-4 px-5 py-2.5 bg-[#003087] text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all">
                Записаться к врачу
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredVisits.map((v) => <VisitCard key={v.id} visit={v} />)}
            </div>
          )}
        </div>
      </div>
    </CabinetLayout>
  );
}

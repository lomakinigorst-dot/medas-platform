"use client";

import { useState, useEffect, useCallback } from "react";
import CabinetLayout from "@/components/layout/CabinetLayout";
import { getToken } from "@/lib/auth";
import {
  fetchCurrentUser,
  fetchClinicDoctors,
  patchDoctor,
  type ClinicDoctorOut,
} from "@/lib/api";

const navItems = [
  { href: "/cabinet/clinic", icon: "📊", label: "Дашборд" },
  { href: "/cabinet/clinic/doctors", icon: "👨‍⚕️", label: "Врачи" },
  { href: "/cabinet/clinic/schedule", icon: "📅", label: "Расписание" },
  { href: "/cabinet/clinic/appointments", icon: "📋", label: "Записи" },
  { href: "/cabinet/clinic/reports", icon: "📈", label: "Отчёты" },
  { href: "/cabinet/clinic/settings", icon: "⚙️", label: "Настройки" },
];

function initials(name: string): string {
  const parts = name.trim().split(" ");
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

function DoctorCard({
  doctor,
  onPriceUpdate,
  onToggleActive,
}: {
  doctor: ClinicDoctorOut;
  onPriceUpdate: (id: number, price: number) => Promise<void>;
  onToggleActive: (id: number, active: boolean) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [priceInput, setPriceInput] = useState(String(doctor.price));
  const [saving, setSaving] = useState(false);

  async function handlePriceSave() {
    const newPrice = parseInt(priceInput, 10);
    if (isNaN(newPrice) || newPrice < 0) return;
    setSaving(true);
    await onPriceUpdate(doctor.id, newPrice);
    setSaving(false);
    setEditing(false);
  }

  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm transition-opacity ${!doctor.is_active ? "opacity-60" : ""}`}
      style={{ boxShadow: "0 4px 20px rgba(0,27,63,0.06)" }}>

      <div className="flex items-start gap-4">
        {/* Avatar */}
        {doctor.avatar ? (
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="w-14 h-14 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-[#dbe1ff] text-[#003087] flex items-center justify-center text-lg font-bold flex-shrink-0 uppercase">
            {initials(doctor.name)}
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-[#191c1e] font-[family-name:var(--font-manrope)] truncate">
              {doctor.name}
            </h3>
            {doctor.is_verified && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e3fcef] text-[#006644]">Проверен</span>
            )}
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              doctor.is_active
                ? "bg-[#e3fcef] text-[#006644]"
                : "bg-[#f2f4f6] text-[#434655]"
            }`}>
              {doctor.is_active ? "Активен" : "Неактивен"}
            </span>
          </div>
          <p className="text-sm text-[#434655] mt-0.5">{doctor.specialty}</p>
          <p className="text-xs text-slate-400 mt-0.5">Стаж {doctor.experience} лет · ★ {doctor.rating.toFixed(1)}</p>
        </div>
      </div>

      {/* Price + actions */}
      <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Стоимость:</span>
          {editing ? (
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handlePriceSave(); if (e.key === "Escape") setEditing(false); }}
                className="w-24 px-2 py-1 text-sm border border-[#003087]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]/20 font-bold text-[#003087]"
                autoFocus
              />
              <button
                onClick={handlePriceSave}
                disabled={saving}
                className="px-2 py-1 bg-[#003087] text-white text-xs font-bold rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "…" : "✓"}
              </button>
              <button
                onClick={() => { setEditing(false); setPriceInput(String(doctor.price)); }}
                className="px-2 py-1 bg-[#f2f4f6] text-[#434655] text-xs font-bold rounded-lg hover:bg-[#e6e8ea]"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#003087]">{doctor.price.toLocaleString("ru-RU")} ₽</span>
              <button
                onClick={() => setEditing(true)}
                className="text-[10px] font-bold text-[#003087] hover:opacity-70 transition-opacity border border-[#003087]/20 px-2 py-0.5 rounded-lg"
              >
                Изменить
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => onToggleActive(doctor.id, !doctor.is_active)}
          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
            doctor.is_active
              ? "bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffb3ad]"
              : "bg-[#e3fcef] text-[#006644] hover:bg-[#c7f5e0]"
          }`}
        >
          {doctor.is_active ? "Деактивировать" : "Активировать"}
        </button>
      </div>
    </div>
  );
}

export default function ClinicDoctorsPage() {
  const [doctors, setDoctors] = useState<ClinicDoctorOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    const user = await fetchCurrentUser(token);
    if (!user?.clinic_id) { setError("Клиника не привязана к аккаунту"); setLoading(false); return; }
    const data = await fetchClinicDoctors(user.clinic_id, token);
    setDoctors(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handlePriceUpdate = useCallback(async (id: number, price: number) => {
    const token = getToken();
    if (!token) return;
    const updated = await patchDoctor(id, { price }, token);
    if (updated) setDoctors((prev) => prev.map((d) => d.id === id ? { ...d, price: updated.price } : d));
  }, []);

  const handleToggleActive = useCallback(async (id: number, is_active: boolean) => {
    const token = getToken();
    if (!token) return;
    const updated = await patchDoctor(id, { is_active }, token);
    if (updated) setDoctors((prev) => prev.map((d) => d.id === id ? { ...d, is_active: updated.is_active } : d));
  }, []);

  return (
    <CabinetLayout
      role="clinic"
      userName="СМ-Клиника"
      userSubtitle="Панель клиники"
      navItems={navItems}
      headerTitle="Врачи"
    >
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-white rounded-2xl animate-pulse" style={{ boxShadow: "0 4px 20px rgba(0,27,63,0.06)" }} />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl p-8 text-center" style={{ boxShadow: "0 4px 20px rgba(0,27,63,0.06)" }}>
          <p className="text-[#ba1a1a] font-medium">{error}</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center" style={{ boxShadow: "0 4px 20px rgba(0,27,63,0.06)" }}>
          <p className="text-3xl mb-3">👨‍⚕️</p>
          <p className="font-medium text-[#191c1e]">Врачи не найдены</p>
          <p className="text-sm text-slate-400 mt-1">Врачи этой клиники появятся здесь</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-400">
              {doctors.filter((d) => d.is_active).length} из {doctors.length} активны
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctors.map((doc) => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
                onPriceUpdate={handlePriceUpdate}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        </>
      )}
    </CabinetLayout>
  );
}

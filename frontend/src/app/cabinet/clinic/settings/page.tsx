"use client";

import { useState, useEffect } from "react";
import CabinetLayout from "@/components/layout/CabinetLayout";
import { getToken } from "@/lib/auth";
import { fetchCurrentUser, type UserMe } from "@/lib/api";

const navItems = [
  { href: "/cabinet/clinic", icon: "📊", label: "Дашборд" },
  { href: "/cabinet/clinic/doctors", icon: "👨‍⚕️", label: "Врачи" },
  { href: "/cabinet/clinic/schedule", icon: "📅", label: "Расписание" },
  { href: "/cabinet/clinic/appointments", icon: "📋", label: "Записи" },
  { href: "/cabinet/clinic/reports", icon: "📈", label: "Отчёты" },
  { href: "/cabinet/clinic/settings", icon: "⚙️", label: "Настройки" },
];

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-medium text-[#191c1e] bg-[#f7f9fb] rounded-xl px-4 py-2.5">{value}</p>
    </div>
  );
}

export default function ClinicSettingsPage() {
  const [user, setUser] = useState<UserMe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    fetchCurrentUser(token).then((u) => { setUser(u); setLoading(false); });
  }, []);

  return (
    <CabinetLayout
      role="clinic"
      userName="СМ-Клиника"
      userSubtitle="Панель клиники"
      navItems={navItems}
      headerTitle="Настройки"
    >
      <div className="max-w-xl space-y-4">

        {/* Account info */}
        <div className="bg-white rounded-2xl p-6 space-y-4" style={{ boxShadow: "0 4px 20px rgba(0,27,63,0.06)" }}>
          <h3 className="font-bold text-[#191c1e] font-[family-name:var(--font-manrope)]">Аккаунт</h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => <div key={i} className="h-10 bg-[#f2f4f6] rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-3">
              <Field label="Имя / название" value={user?.name ?? "—"} />
              <Field label="Телефон (логин)" value={user?.phone ?? "—"} />
              <Field label="Роль" value={user?.role === "clinic" ? "Клиника" : user?.role ?? "—"} />
            </div>
          )}
        </div>

        {/* Change phone — placeholder */}
        <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 4px 20px rgba(0,27,63,0.06)" }}>
          <h3 className="font-bold text-[#191c1e] font-[family-name:var(--font-manrope)] mb-1">Смена телефона</h3>
          <p className="text-sm text-slate-400 mb-4">Функция доступна по запросу в поддержку MEDAS</p>
          <a
            href="mailto:support@med-as.ru"
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#003087]/20 text-[#003087] text-sm font-bold rounded-xl hover:bg-[#003087]/5 transition-colors"
          >
            Написать в поддержку
          </a>
        </div>

        {/* Info */}
        <div className="bg-[#f7f9fb] rounded-2xl px-6 py-4">
          <p className="text-xs text-slate-400">
            Для изменения названия клиники, адреса и контактных данных обратитесь к команде MEDAS.
            Полное управление профилем клиники будет доступно в следующем обновлении платформы.
          </p>
        </div>

      </div>
    </CabinetLayout>
  );
}

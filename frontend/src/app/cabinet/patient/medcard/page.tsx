"use client";

import { useState, useEffect } from "react";
import CabinetLayout from "@/components/layout/CabinetLayout";
import { getToken } from "@/lib/auth";
import { fetchCurrentUser } from "@/lib/api";

const navItems = [
  { href: "/cabinet/patient", icon: "🏠", label: "Главная" },
  { href: "/cabinet/patient/appointments", icon: "📅", label: "Приёмы" },
  { href: "/cabinet/patient/medcard", icon: "📋", label: "Медкарта" },
  { href: "/cabinet/patient/family", icon: "👨‍👩‍👧", label: "Семейный профиль" },
  { href: "/cabinet/patient/bonuses", icon: "🎁", label: "Бонусы" },
  { href: "/cabinet/patient/favorites", icon: "❤️", label: "Избранные врачи" },
];

const visits = [
  { date: "7 ноя 2024", doctor: "Д-р Волков", specialty: "Кардиолог", diagnosis: "Гипертония I ст.", prescription: "Лизиноприл 10мг / 1 раз в день", notes: "Контроль через 3 месяца. ЭКГ в норме." },
  { date: "23 окт 2024", doctor: "Д-р Чэнь", specialty: "Невролог", diagnosis: "Хроническое напряжение", prescription: "Магний B6 / 1 месяц", notes: "Снизить стресс, нормализовать сон." },
  { date: "15 сен 2024", doctor: "Д-р Миллер", specialty: "Терапевт", diagnosis: "ОРВИ", prescription: "Оциллококцинум 5 дней", notes: "Постельный режим, обильное питьё." },
];

export default function PatientMedcardPage() {
  const [userName, setUserName] = useState("Пациент");

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    fetchCurrentUser(token).then((me) => {
      if (me?.name) setUserName(me.name);
    });
  }, []);

  const initials = userName.slice(0, 1).toUpperCase();

  return (
    <CabinetLayout
      role="patient"
      userName={userName}
      userSubtitle="Управление здоровьем"
      navItems={navItems}
      headerTitle="Электронная медкарта"
    >
      {/* Personal Info Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/10 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#003087] to-[#1e40af] flex items-center justify-center text-white text-3xl font-bold">
              {initials}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#191c1e] font-[family-name:var(--font-manrope)]">{userName}</h2>
              <p className="text-[#434655] text-sm">Дата рождения: 12.03.1990 • Мужской • 34 года</p>
              <div className="flex gap-3 mt-2">
                <span className="px-3 py-1 bg-[#003087] text-white text-xs font-bold rounded-lg">Группа крови: O+</span>
                <span className="px-3 py-1 bg-[#ffdad6] text-[#93000a] text-xs font-bold rounded-lg">⚠ Аллергия: Пенициллин</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2 bg-[#003087] text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all">Скачать PDF</button>
            <button className="px-5 py-2 bg-[#f2f4f6] text-[#434655] text-sm font-bold rounded-xl hover:bg-[#e6e8ea] transition-all">Поделиться</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vital Stats */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#191c1e] font-[family-name:var(--font-manrope)]">Показатели здоровья</h3>
          {[
            { label: "Давление", value: "120/80 мм рт.ст.", icon: "❤️", status: "norm" },
            { label: "Пульс", value: "72 уд/мин", icon: "💓", status: "norm" },
            { label: "Температура", value: "36.6 °C", icon: "🌡️", status: "norm" },
            { label: "Рост", value: "182 см", icon: "📏", status: "info" },
            { label: "Вес", value: "75 кг", icon: "⚖️", status: "norm" },
            { label: "ИМТ", value: "22.6", icon: "📊", status: "norm" },
          ].map((metric) => (
            <div key={metric.label} className="bg-white rounded-xl p-4 border border-[#c3c6d7]/10 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{metric.icon}</span>
                <span className="text-sm text-[#434655]">{metric.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#191c1e]">{metric.value}</span>
                {metric.status === "norm" && <span className="text-xs text-[#00a982] font-bold">✓</span>}
              </div>
            </div>
          ))}

          {/* Chronic Conditions */}
          <div className="bg-white rounded-xl p-5 border border-[#c3c6d7]/10 shadow-sm">
            <h4 className="font-bold text-sm text-[#191c1e] mb-3">Хронические заболевания</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-amber-50 text-amber-800 text-xs font-bold rounded-lg border border-amber-100">Гипертония I ст.</span>
            </div>
          </div>

          {/* Current Medications */}
          <div className="bg-white rounded-xl p-5 border border-[#c3c6d7]/10 shadow-sm">
            <h4 className="font-bold text-sm text-[#191c1e] mb-3">Текущие препараты</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">💊</span>
                <div>
                  <p className="text-xs font-bold text-[#191c1e]">Лизиноприл 10мг</p>
                  <p className="text-[10px] text-[#434655]">1 раз в день, утром</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visit History */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#191c1e] font-[family-name:var(--font-manrope)]">История визитов</h3>
            <div className="flex gap-2">
              <select className="text-xs bg-[#f2f4f6] border-none rounded-lg px-3 py-2 font-medium text-[#434655] focus:ring-0">
                <option>Все специальности</option>
                <option>Кардиология</option>
                <option>Неврология</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {visits.map((visit, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/10 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#f2f4f6] rounded-2xl flex flex-col items-center justify-center">
                      <span className="text-xs font-bold text-[#003087]">{visit.date.split(" ")[0]}</span>
                      <span className="text-[10px] text-[#434655]">{visit.date.split(" ")[1]}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#191c1e]">{visit.doctor}</h4>
                      <p className="text-xs text-[#434655]">{visit.specialty}</p>
                    </div>
                  </div>
                  <button className="text-xs text-[#003087] font-bold hover:underline">Документы</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#f7f9fb] rounded-xl p-3">
                    <p className="text-[10px] font-bold text-[#737686] uppercase tracking-wider mb-1">Диагноз</p>
                    <p className="text-sm font-semibold text-[#191c1e]">{visit.diagnosis}</p>
                  </div>
                  <div className="bg-[#f7f9fb] rounded-xl p-3">
                    <p className="text-[10px] font-bold text-[#737686] uppercase tracking-wider mb-1">Назначение</p>
                    <p className="text-sm font-semibold text-[#191c1e]">{visit.prescription}</p>
                  </div>
                  <div className="bg-[#f7f9fb] rounded-xl p-3">
                    <p className="text-[10px] font-bold text-[#737686] uppercase tracking-wider mb-1">Заметки врача</p>
                    <p className="text-xs text-[#434655]">{visit.notes}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CabinetLayout>
  );
}

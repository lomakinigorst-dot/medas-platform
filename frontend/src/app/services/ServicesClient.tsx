"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.med-as.ru/api/v1";

/* ── SVG icons ────────────────────────────────────────────────── */
function IconHeart() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>;
}
function IconBrain() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.49-4.89A5 5 0 0 1 9.5 2Z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.49-4.89A5 5 0 0 0 14.5 2Z" /></svg>;
}
function IconStomach() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2C8 2 5 5 5 9c0 2 1 4 2 5.5C8 16.5 8 18 7 20h10c-1-2-1-3.5.5-5.5 1-1.5 1.5-3.5 1.5-5.5 0-4-2.5-7-7-7z" /><path d="M9 12c0 1.66 1.34 3 3 3s3-1.34 3-3" /></svg>;
}
function IconEye() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
}
function IconSkin() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 8v4l2 2" /><circle cx="18" cy="6" r="3" /></svg>;
}
function IconBone() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 10c.7-.7 1-1.5 1-2.5a3.5 3.5 0 0 0-7 0c0 1 .3 1.8 1 2.5L7 15c-.7.7-1 1.5-1 2.5a3.5 3.5 0 0 0 7 0c0-1-.3-1.8-1-2.5Z" /></svg>;
}
function IconHormone() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" /></svg>;
}
function IconChild() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M8 16c-2 .5-3 2-3 4h14c0-2-1-3.5-3-4" /></svg>;
}
function IconFlask() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 3h6m-6 0v6L4.5 18.5A2 2 0 0 0 6.3 21h11.4a2 2 0 0 0 1.8-2.5L15 9V3" /></svg>;
}
function IconSearch() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>;
}
function IconStar() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>;
}

/* ── Types ────────────────────────────────────────────────────── */
interface ApiDoctor {
  id: number;
  slug: string;
  name: string;
  specialty: string;
  avatar: string;
  price: number;
  rating: number;
  experience: number;
}

interface Category {
  name: string;
  icon: React.FC;
  color: string;
  bg: string;
  description: string;
  services: string[];
  from: string;
  q: string;
}

/* ── Static data ──────────────────────────────────────────────── */
const categories: Category[] = [
  { name: "Кардиология", icon: IconHeart, color: "#e53e3e", bg: "#fff5f5", description: "Диагностика и лечение сердечно-сосудистых заболеваний", services: ["ЭКГ", "Эхокардиография", "Холтер-мониторинг", "Стресс-тест"], from: "3 200", q: "кардиолог" },
  { name: "Неврология", icon: IconBrain, color: "#6b46c1", bg: "#faf5ff", description: "Лечение заболеваний нервной системы, мигрени, инсульта", services: ["ЭЭГ", "МРТ головного мозга", "Консультация невролога", "Терапия бессонницы"], from: "2 800", q: "невролог" },
  { name: "Гастроэнтерология", icon: IconStomach, color: "#d97706", bg: "#fffbeb", description: "Диагностика и лечение органов пищеварения", services: ["Гастроскопия", "Колоноскопия", "УЗИ брюшной полости", "Анализ на хеликобактер"], from: "2 500", q: "гастроэнтеролог" },
  { name: "Офтальмология", icon: IconEye, color: "#0891b2", bg: "#ecfeff", description: "Диагностика и лечение заболеваний органов зрения", services: ["Проверка зрения", "Лечение глаукомы", "Подбор линз", "Лазерная коррекция"], from: "1 800", q: "офтальмолог" },
  { name: "Дерматология", icon: IconSkin, color: "#00a982", bg: "#f0fdf4", description: "Лечение кожных заболеваний и косметология", services: ["Диагностика кожи", "Удаление родинок", "Лечение акне", "Дерматоскопия"], from: "2 200", q: "дерматолог" },
  { name: "Ортопедия", icon: IconBone, color: "#003087", bg: "#eff6ff", description: "Лечение заболеваний опорно-двигательного аппарата", services: ["Рентген", "МРТ суставов", "Блокада суставов", "Физиотерапия"], from: "3 500", q: "ортопед" },
  { name: "Эндокринология", icon: IconHormone, color: "#b45309", bg: "#fef3c7", description: "Лечение заболеваний эндокринной системы", services: ["Анализы на гормоны", "УЗИ щитовидной железы", "Лечение диабета", "Остеопороз"], from: "2 700", q: "эндокринолог" },
  { name: "Педиатрия", icon: IconChild, color: "#d53f8c", bg: "#fff5f7", description: "Медицинская помощь детям от рождения до 18 лет", services: ["Плановый осмотр", "Вакцинация", "Лечение ОРВИ", "Аллергология"], from: "1 500", q: "педиатр" },
  { name: "Лабораторные анализы", icon: IconFlask, color: "#2d3748", bg: "#f7fafc", description: "Полный спектр лабораторной диагностики", services: ["Общий анализ крови", "Биохимия", "ПЦР-тесты", "Генетические тесты"], from: "500", q: "анализ" },
];

/* ── Doctor mini-card ─────────────────────────────────────────── */
function DoctorMiniCard({ doc }: { doc: ApiDoctor }) {
  return (
    <Link
      href={`/doctor/${doc.slug}`}
      className="flex items-center gap-3 p-3 rounded-xl bg-[#f7f9fb] hover:bg-[#003087]/5 transition-colors group/doc"
    >
      <img
        src={doc.avatar}
        alt={doc.name}
        width={40}
        height={40}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
      <div className="min-w-0">
        <p className="font-semibold text-xs text-[#191c1e] truncate group-hover/doc:text-[#003087] transition-colors">
          {doc.name}
        </p>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-yellow-500"><IconStar /></span>
          <span className="text-[11px] text-[#434655] tabular-nums">{doc.rating.toFixed(2)}</span>
          <span className="text-[#c3c6d7] mx-1">·</span>
          <span className="text-[11px] text-[#434655] tabular-nums">от {doc.price.toLocaleString("ru-RU")} ₽</span>
        </div>
      </div>
    </Link>
  );
}

/* ── Main component ───────────────────────────────────────────── */
export default function ServicesClient() {
  const [doctors, setDoctors] = useState<ApiDoctor[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/doctors?limit=50`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { items: ApiDoctor[] } | null) => {
        if (data?.items) setDoctors(data.items);
      })
      .catch(() => null);
  }, []);

  const q = search.toLowerCase().trim();

  const filtered = useMemo(
    () =>
      q
        ? categories.filter(
            (c) =>
              c.name.toLowerCase().includes(q) ||
              c.description.toLowerCase().includes(q) ||
              c.services.some((s) => s.toLowerCase().includes(q)) ||
              c.q.includes(q)
          )
        : categories,
    [q]
  );

  function doctorsFor(cat: Category): ApiDoctor[] {
    return doctors.filter((d) => d.specialty.toLowerCase().includes(cat.q));
  }

  return (
    <div className="pt-20 lg:pt-[110px] pb-20 max-w-screen-2xl mx-auto px-4 sm:px-6">

      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-4xl lg:text-5xl font-extrabold font-[family-name:var(--font-manrope)] tracking-tight text-[#191c1e] mb-4">
          Услуги и <span className="text-[#003087]">диагностика</span>
        </h1>
        <p className="text-[#434655] text-lg lg:text-xl max-w-2xl mx-auto mb-8">
          Полный спектр медицинских услуг от проверенных специалистов. Выберите направление и запишитесь онлайн.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto">
          <label htmlFor="services-search" className="sr-only">Поиск услуги или специальности</label>
          <div className="relative w-full sm:flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737686] pointer-events-none">
              <IconSearch />
            </span>
            <input
              id="services-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Кардиология, ЭКГ, Педиатр..."
              className="w-full bg-white border border-[#c3c6d7]/30 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/20 shadow-sm"
            />
          </div>
          <Link
            href={search ? `/search?q=${encodeURIComponent(search)}` : "/search"}
            className="w-full sm:w-auto px-8 py-4 bg-[#003087] text-white font-bold rounded-2xl shadow-lg hover:opacity-90 transition-all focus:outline-none focus:ring-4 focus:ring-[#003087]/30 whitespace-nowrap"
          >
            Найти врача
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {[
          { num: String(doctors.length || "6") + "+", label: "Врачей-специалистов" },
          { num: "25+", label: "Направлений" },
          { num: "50 000+", label: "Пациентов в год" },
          { num: "4.9", label: "Средний рейтинг" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 text-center border border-[#c3c6d7]/10 shadow-sm">
            <div className="text-2xl lg:text-3xl font-extrabold text-[#003087] mb-1 tabular-nums">{s.num}</div>
            <div className="text-xs text-[#434655] font-medium">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Categories grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-manrope)] text-[#191c1e]">
            {q ? `Результаты: «${search}»` : "Все специальности"}
          </h2>
          {q && (
            <button
              onClick={() => setSearch("")}
              className="text-sm text-[#003087] hover:underline focus:outline-none focus:underline"
            >
              Сбросить
            </button>
          )}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#737686] text-lg mb-4">Ничего не найдено по запросу «{search}»</p>
            <Link href={`/search?q=${encodeURIComponent(search)}`}
              className="inline-block px-6 py-3 bg-[#003087] text-white font-bold rounded-xl hover:opacity-90 transition-all">
              Искать среди врачей
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cat) => {
            const Icon = cat.icon;
            const matchedDoctors = doctorsFor(cat);
            return (
              <div
                key={cat.name}
                className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/10 shadow-sm hover:shadow-lg hover:shadow-[#003087]/5 transition-all group flex flex-col"
              >
                {/* Category header */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors"
                    style={{ background: cat.bg, color: cat.color }}
                  >
                    <Icon />
                  </div>
                  {matchedDoctors.length > 0 && (
                    <span className="text-xs font-bold text-[#434655] bg-[#f2f4f6] px-2 py-1 rounded-lg">
                      {matchedDoctors.length} {matchedDoctors.length === 1 ? "врач" : "врача"}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-xl text-[#191c1e] mb-2 font-[family-name:var(--font-manrope)] group-hover:text-[#003087] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-[#434655] mb-4 leading-relaxed">{cat.description}</p>

                {/* Services tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {cat.services.slice(0, 3).map((svc) => (
                    <span key={svc} className="px-2 py-1 bg-[#f2f4f6] text-xs font-medium text-[#434655] rounded-lg">
                      {svc}
                    </span>
                  ))}
                  {cat.services.length > 3 && (
                    <span className="px-2 py-1 bg-[#f2f4f6] text-xs font-medium text-[#434655] rounded-lg">
                      +{cat.services.length - 3}
                    </span>
                  )}
                </div>

                {/* Matched doctors */}
                {matchedDoctors.length > 0 && (
                  <div className="space-y-2 mb-5">
                    {matchedDoctors.slice(0, 2).map((doc) => (
                      <DoctorMiniCard key={doc.id} doc={doc} />
                    ))}
                    {matchedDoctors.length > 2 && (
                      <Link
                        href={`/search?q=${encodeURIComponent(cat.q)}`}
                        className="block text-center text-xs text-[#003087] hover:underline py-1"
                      >
                        Ещё {matchedDoctors.length - 2} врача →
                      </Link>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm text-[#434655]">
                    от <span className="font-bold text-[#191c1e]">{cat.from} ₽</span>
                  </span>
                  <Link
                    href={`/search?q=${encodeURIComponent(cat.q)}`}
                    className="px-4 py-2 bg-[#003087] text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-[#003087]/40 active:scale-95"
                  >
                    Записаться
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20 bg-gradient-to-br from-[#003087] to-[#1e40af] rounded-3xl p-8 lg:p-12 text-white text-center">
        <h2 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-manrope)] mb-4">
          Не нашли нужную услугу?
        </h2>
        <p className="text-white/80 mb-8">Позвоните нам, и мы поможем подобрать подходящего специалиста</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:+74951234567"
            className="px-8 py-4 bg-white text-[#003087] font-bold rounded-2xl hover:opacity-90 transition-all focus:outline-none focus:ring-4 focus:ring-white/40"
          >
            Позвонить: +7 (495) 123-45-67
          </a>
          <Link
            href="/search"
            className="px-8 py-4 bg-white/20 text-white font-bold rounded-2xl hover:bg-white/30 transition-all focus:outline-none focus:ring-4 focus:ring-white/40"
          >
            Все врачи
          </Link>
        </div>
      </section>
    </div>
  );
}

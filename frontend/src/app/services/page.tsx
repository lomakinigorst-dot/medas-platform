import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Услуги и диагностика — MEDAS",
  description:
    "Полный спектр медицинских услуг: кардиология, неврология, ортопедия и ещё 20+ специальностей. Запись онлайн.",
};

function IconHeart() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
function IconBrain() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.49-4.89A5 5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.49-4.89A5 5 0 0 0 14.5 2Z" />
    </svg>
  );
}
function IconStomach() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2C8 2 5 5 5 9c0 2 1 4 2 5.5C8 16.5 8 18 7 20h10c-1-2-1-3.5.5-5.5 1-1.5 1.5-3.5 1.5-5.5 0-4-2.5-7-7-7z" />
      <path d="M9 12c0 1.66 1.34 3 3 3s3-1.34 3-3" />
    </svg>
  );
}
function IconEye() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function IconSkin() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 10 10" />
      <path d="M12 8v4l2 2" />
      <circle cx="18" cy="6" r="3" />
    </svg>
  );
}
function IconBone() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 10c.7-.7 1-1.5 1-2.5a3.5 3.5 0 0 0-7 0c0 1 .3 1.8 1 2.5L7 15c-.7.7-1 1.5-1 2.5a3.5 3.5 0 0 0 7 0c0-1-.3-1.8-1-2.5Z" />
    </svg>
  );
}
function IconHormone() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
    </svg>
  );
}
function IconChild() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M8 16c-2 .5-3 2-3 4h14c0-2-1-3.5-3-4" />
    </svg>
  );
}
function IconFlask() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 3h6m-6 0v6L4.5 18.5A2 2 0 0 0 6.3 21h11.4a2 2 0 0 0 1.8-2.5L15 9V3" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

const categories = [
  {
    name: "Кардиология",
    icon: IconHeart,
    color: "#e53e3e",
    bg: "#fff5f5",
    description: "Диагностика и лечение сердечно-сосудистых заболеваний",
    services: ["ЭКГ", "Эхокардиография", "Холтер-мониторинг", "Стресс-тест"],
    doctors: 24,
    from: "3 200",
    q: "кардиолог",
  },
  {
    name: "Неврология",
    icon: IconBrain,
    color: "#6b46c1",
    bg: "#faf5ff",
    description: "Лечение заболеваний нервной системы, мигрени, инсульта",
    services: ["ЭЭГ", "МРТ головного мозга", "Консультация невролога", "Терапия бессонницы"],
    doctors: 18,
    from: "2 800",
    q: "невролог",
  },
  {
    name: "Гастроэнтерология",
    icon: IconStomach,
    color: "#d97706",
    bg: "#fffbeb",
    description: "Диагностика и лечение органов пищеварения",
    services: ["Гастроскопия", "Колоноскопия", "УЗИ брюшной полости", "Анализ на хеликобактер"],
    doctors: 12,
    from: "2 500",
    q: "гастроэнтеролог",
  },
  {
    name: "Офтальмология",
    icon: IconEye,
    color: "#0891b2",
    bg: "#ecfeff",
    description: "Диагностика и лечение заболеваний органов зрения",
    services: ["Проверка зрения", "Лечение глаукомы", "Подбор линз", "Лазерная коррекция"],
    doctors: 9,
    from: "1 800",
    q: "офтальмолог",
  },
  {
    name: "Дерматология",
    icon: IconSkin,
    color: "#00a982",
    bg: "#f0fdf4",
    description: "Лечение кожных заболеваний и косметология",
    services: ["Диагностика кожи", "Удаление родинок", "Лечение акне", "Дерматоскопия"],
    doctors: 15,
    from: "2 200",
    q: "дерматолог",
  },
  {
    name: "Ортопедия",
    icon: IconBone,
    color: "#003087",
    bg: "#eff6ff",
    description: "Лечение заболеваний опорно-двигательного аппарата",
    services: ["Рентген", "МРТ суставов", "Блокада суставов", "Физиотерапия"],
    doctors: 11,
    from: "3 500",
    q: "ортопед",
  },
  {
    name: "Эндокринология",
    icon: IconHormone,
    color: "#b45309",
    bg: "#fef3c7",
    description: "Лечение заболеваний эндокринной системы",
    services: ["Анализы на гормоны", "УЗИ щитовидной железы", "Лечение диабета", "Остеопороз"],
    doctors: 8,
    from: "2 700",
    q: "эндокринолог",
  },
  {
    name: "Педиатрия",
    icon: IconChild,
    color: "#d53f8c",
    bg: "#fff5f7",
    description: "Медицинская помощь детям от рождения до 18 лет",
    services: ["Плановый осмотр", "Вакцинация", "Лечение ОРВИ", "Аллергология"],
    doctors: 20,
    from: "1 500",
    q: "педиатр",
  },
  {
    name: "Лабораторные анализы",
    icon: IconFlask,
    color: "#2d3748",
    bg: "#f7fafc",
    description: "Полный спектр лабораторной диагностики",
    services: ["Общий анализ крови", "Биохимия", "ПЦР-тесты", "Генетические тесты"],
    doctors: 0,
    from: "500",
    q: "анализы",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="pt-20 lg:pt-[110px] pb-20 max-w-screen-2xl mx-auto px-6">
        {/* Hero */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-extrabold font-[family-name:var(--font-manrope)] tracking-tight text-[#191c1e] mb-4">
            Услуги и{" "}
            <span className="text-[#003087]">диагностика</span>
          </h1>
          <p className="text-[#434655] text-xl max-w-2xl mx-auto">
            Полный спектр медицинских услуг от проверенных специалистов. Выберите направление и запишитесь онлайн.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <label htmlFor="services-search" className="sr-only">Поиск услуги или специальности</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737686] pointer-events-none">
                <IconSearch />
              </span>
              <input
                id="services-search"
                type="text"
                placeholder="Поиск услуги или специальности..."
                className="bg-white border border-[#c3c6d7]/30 rounded-2xl pl-12 pr-6 py-4 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-[#003087]/20 shadow-sm"
              />
            </div>
            <Link
              href="/search"
              className="px-8 py-4 bg-[#003087] text-white font-bold rounded-2xl shadow-lg hover:opacity-90 transition-all focus:outline-none focus:ring-4 focus:ring-[#003087]/30"
            >
              Найти
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { num: "150+", label: "Врачей-специалистов" },
            { num: "25+", label: "Направлений" },
            { num: "50 000+", label: "Пациентов в год" },
            { num: "4.9", label: "Средний рейтинг" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 text-center border border-[#c3c6d7]/10 shadow-sm">
              <div className="text-3xl font-extrabold text-[#003087] mb-1">{stat.num}</div>
              <div className="text-xs text-[#434655] font-medium">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Categories Grid */}
        <section>
          <h2 className="text-3xl font-bold font-[family-name:var(--font-manrope)] text-[#191c1e] mb-8">Все специальности</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.name}
                  className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/10 shadow-sm hover:shadow-lg hover:shadow-[#003087]/5 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors"
                      style={{ background: cat.bg, color: cat.color }}
                    >
                      <Icon />
                    </div>
                    {cat.doctors > 0 && (
                      <span className="text-xs font-bold text-[#434655] bg-[#f2f4f6] px-2 py-1 rounded-lg">
                        {cat.doctors} врачей
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-xl text-[#191c1e] mb-2 font-[family-name:var(--font-manrope)] group-hover:text-[#003087] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-[#434655] mb-4 leading-relaxed">{cat.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
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
                  <div className="flex items-center justify-between">
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
        <section className="mt-20 bg-gradient-to-br from-[#003087] to-[#1e40af] rounded-3xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold font-[family-name:var(--font-manrope)] mb-4">
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
              Найти врача
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

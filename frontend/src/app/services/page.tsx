import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const categories = [
  {
    name: "Кардиология",
    icon: "❤️",
    description: "Диагностика и лечение сердечно-сосудистых заболеваний",
    services: ["ЭКГ", "Эхокардиография", "Холтер-мониторинг", "Стресс-тест"],
    doctors: 24,
    from: "3 200",
  },
  {
    name: "Неврология",
    icon: "🧠",
    description: "Лечение заболеваний нервной системы, мигрени, инсульта",
    services: ["ЭЭГ", "МРТ головного мозга", "Консультация невролога", "Терапия бессонницы"],
    doctors: 18,
    from: "2 800",
  },
  {
    name: "Гастроэнтерология",
    icon: "🫁",
    description: "Диагностика и лечение органов пищеварения",
    services: ["Гастроскопия", "Колоноскопия", "УЗИ брюшной полости", "Анализ на хеликобактер"],
    doctors: 12,
    from: "2 500",
  },
  {
    name: "Офтальмология",
    icon: "👁️",
    description: "Диагностика и лечение заболеваний органов зрения",
    services: ["Проверка зрения", "Лечение глаукомы", "Подбор линз", "Лазерная коррекция"],
    doctors: 9,
    from: "1 800",
  },
  {
    name: "Дерматология",
    icon: "✨",
    description: "Лечение кожных заболеваний и косметология",
    services: ["Диагностика кожи", "Удаление родинок", "Лечение акне", "Дерматоскопия"],
    doctors: 15,
    from: "2 200",
  },
  {
    name: "Ортопедия",
    icon: "🦴",
    description: "Лечение заболеваний опорно-двигательного аппарата",
    services: ["Рентген", "МРТ суставов", "Блокада суставов", "Физиотерапия"],
    doctors: 11,
    from: "3 500",
  },
  {
    name: "Эндокринология",
    icon: "⚗️",
    description: "Лечение заболеваний эндокринной системы",
    services: ["Анализы на гормоны", "УЗИ щитовидной железы", "Лечение диабета", "Остеопороз"],
    doctors: 8,
    from: "2 700",
  },
  {
    name: "Педиатрия",
    icon: "👶",
    description: "Медицинская помощь детям от рождения до 18 лет",
    services: ["Плановый осмотр", "Вакцинация", "Лечение ОРВИ", "Аллергология"],
    doctors: 20,
    from: "1 500",
  },
  {
    name: "Лабораторные анализы",
    icon: "🔬",
    description: "Полный спектр лабораторной диагностики",
    services: ["Общий анализ крови", "Биохимия", "ПЦР-тесты", "Генетические тесты"],
    doctors: 0,
    from: "500",
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
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737686]">🔍</span>
              <input
                type="text"
                placeholder="Поиск услуги или специальности..."
                className="bg-white border border-[#c3c6d7]/30 rounded-2xl pl-12 pr-6 py-4 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-[#003087]/20 shadow-sm"
              />
            </div>
            <button className="px-8 py-4 bg-[#003087] text-white font-bold rounded-2xl shadow-lg hover:opacity-90 transition-all">
              Найти
            </button>
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
            {categories.map((cat) => (
              <div key={cat.name} className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/10 shadow-sm hover:shadow-lg hover:shadow-[#003087]/5 transition-all group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-[#f2f4f6] rounded-2xl flex items-center justify-center text-2xl group-hover:bg-[#003087]/10 transition-colors">
                    {cat.icon}
                  </div>
                  {cat.doctors > 0 && (
                    <span className="text-xs font-bold text-[#434655] bg-[#f2f4f6] px-2 py-1 rounded-lg">{cat.doctors} врачей</span>
                  )}
                </div>
                <h3 className="font-bold text-xl text-[#191c1e] mb-2 font-[family-name:var(--font-manrope)] group-hover:text-[#003087] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-[#434655] mb-4 leading-relaxed">{cat.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {cat.services.slice(0, 3).map((svc) => (
                    <span key={svc} className="px-2 py-1 bg-[#f2f4f6] text-xs font-medium text-[#434655] rounded-lg">{svc}</span>
                  ))}
                  {cat.services.length > 3 && (
                    <span className="px-2 py-1 bg-[#f2f4f6] text-xs font-medium text-[#434655] rounded-lg">+{cat.services.length - 3}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#434655]">от <span className="font-bold text-[#191c1e]">{cat.from} ₽</span></span>
                  <Link href={`/search?specialty=${cat.name.toLowerCase()}`} className="px-4 py-2 bg-[#003087] text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all">
                    Записаться
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-20 bg-gradient-to-br from-[#003087] to-[#1e40af] rounded-3xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold font-[family-name:var(--font-manrope)] mb-4">Не нашли нужную услугу?</h2>
          <p className="text-white/80 mb-8">Позвоните нам, и мы поможем подобрать подходящего специалиста</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-[#003087] font-bold rounded-2xl hover:opacity-90 transition-all">
              Позвонить: +7 (495) 123-45-67
            </button>
            <Link href="/search" className="px-8 py-4 bg-white/20 text-white font-bold rounded-2xl hover:bg-white/30 transition-all">
              Найти врача
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

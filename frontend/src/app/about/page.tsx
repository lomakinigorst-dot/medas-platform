import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "О нас — MEDAS | Медицинская платформа",
  description:
    "MEDAS — платформа для поиска врачей и онлайн-записи. Наша миссия — сделать качественную медицину доступной каждому жителю России.",
  openGraph: {
    title: "О нас — MEDAS",
    description: "500+ клиник, 10 000+ врачей. Записывайтесь онлайн за 2 минуты.",
    type: "website",
    locale: "ru_RU",
  },
};

function IconCheck() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function IconZap() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconGift() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}

const stats = [
  { num: "500+", label: "Клиник-партнёров" },
  { num: "10 000+", label: "Врачей-специалистов" },
  { num: "2 млн+", label: "Пациентов" },
  { num: "50+", label: "Городов России" },
];

const values = [
  {
    icon: <IconCheck />,
    title: "Проверенные врачи",
    description:
      "Каждый специалист проходит верификацию документов, лицензий и квалификации. Только дипломированные врачи с подтверждённым опытом.",
  },
  {
    icon: <IconZap />,
    title: "Мгновенная запись",
    description:
      "Запись к любому врачу занимает меньше 2 минут. Выберите специалиста, дату и время — без звонков и ожидания.",
  },
  {
    icon: <IconShield />,
    title: "Безопасные данные",
    description:
      "Медицинские данные шифруются и хранятся в соответствии с 152-ФЗ. Ваша история болезней доступна только вам и вашему врачу.",
  },
  {
    icon: <IconGift />,
    title: "Бонусная программа",
    description:
      "До 10% от стоимости каждого приёма возвращается бонусами. Копите баллы и получайте скидки на следующие визиты.",
  },
];

const team = [
  {
    name: "Алексей Соколов",
    role: "CEO & Основатель",
    initials: "АС",
    color: "#003087",
    bio: "Врач-терапевт, 12 лет в медицине. Основал MEDAS чтобы сократить время ожидания приёма с недель до минут.",
  },
  {
    name: "Мария Иванова",
    role: "CTO",
    initials: "МИ",
    color: "#00a982",
    bio: "10+ лет в разработке медицинских систем. Отвечает за безопасность данных и архитектуру платформы.",
  },
  {
    name: "Дмитрий Волков",
    role: "Директор по партнёрствам",
    initials: "ДВ",
    color: "#1e40af",
    bio: "Выстраивает отношения с клиниками по всей России. Более 500 клиник-партнёров — его личный результат.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-[64px] lg:pt-[104px]">

        {/* Hero */}
        <section className="relative bg-gradient-to-br from-[#003087] via-[#003087] to-[#1e3a8a] text-white py-24 lg:py-36 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00a982]/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
          </div>
          <div className="relative max-w-screen-xl mx-auto px-6 text-center">
            <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-[#00a982] bg-[#00a982]/10 rounded-full mb-6 border border-[#00a982]/20">
              О компании
            </span>
            <h1 className="text-4xl lg:text-6xl font-extrabold font-[family-name:var(--font-manrope)] tracking-tight mb-6 leading-tight">
              Миссия MEDAS
            </h1>
            <p className="text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Сделать качественную медицинскую помощь доступной каждому — независимо от города, возраста и дохода. Мы соединяем пациентов с проверенными врачами за считанные минуты.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white py-16 border-b border-[#f2f4f6]">
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="text-center p-8 rounded-2xl bg-[#f8faff] border border-[#e8edf8] hover:border-[#003087]/20 hover:shadow-lg hover:shadow-[#003087]/5 transition-all duration-200 cursor-default"
                >
                  <div className="text-4xl lg:text-5xl font-extrabold text-[#003087] font-[family-name:var(--font-manrope)] mb-2 tabular-nums">
                    {s.num}
                  </div>
                  <div className="text-sm text-[#434655] font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-[#f8faff]">
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-manrope)] text-[#191c1e] mb-4">
                Почему выбирают MEDAS
              </h2>
              <p className="text-[#434655] text-lg max-w-2xl mx-auto">
                Четыре принципа, которые лежат в основе каждого нашего решения
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="bg-white rounded-2xl p-7 border border-[#e8edf8] hover:border-[#003087]/20 hover:shadow-lg hover:shadow-[#003087]/5 transition-all duration-200 group"
                >
                  <div className="w-14 h-14 bg-[#003087]/8 text-[#003087] rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#003087] group-hover:text-white transition-all duration-200">
                    {v.icon}
                  </div>
                  <h3 className="font-bold text-lg text-[#191c1e] font-[family-name:var(--font-manrope)] mb-3">
                    {v.title}
                  </h3>
                  <p className="text-sm text-[#434655] leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-20 bg-white">
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase text-[#00a982] bg-[#00a982]/10 rounded-full mb-5">
                  Наша история
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-manrope)] text-[#191c1e] mb-6 leading-tight">
                  Родились из личного опыта
                </h2>
                <div className="space-y-4 text-[#434655] leading-relaxed">
                  <p>
                    В 2026 году команда врачей и IT-специалистов из Москвы основала MEDAS — после того, как сами столкнулись с проблемой: найти нужного врача в нужное время было мучительно долго.
                  </p>
                  <p>
                    Мы создали платформу, которая убирает барьеры: звонки на регистратуру, бумажные карточки, неудобное время. Пациент видит реальное расписание врача и записывается онлайн — в любое время суток.
                  </p>
                  <p>
                    Сегодня MEDAS работает в 50+ городах России. Каждый день через платформу проходят тысячи записей — и каждая из них экономит время пациента и врача.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { year: "2026", event: "Основание MEDAS в Москве" },
                  { year: "2026", event: "Первые 10 клиник-партнёров" },
                  { year: "2026", event: "Запуск бонусной программы" },
                  { year: "2026+", event: "Экспансия в регионы России" },
                ].map((item) => (
                  <div
                    key={item.event}
                    className="bg-[#f8faff] rounded-2xl p-5 border border-[#e8edf8]"
                  >
                    <div className="text-2xl font-extrabold text-[#003087] font-[family-name:var(--font-manrope)] mb-2 tabular-nums">
                      {item.year}
                    </div>
                    <div className="text-sm text-[#434655] leading-snug">{item.event}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-[#f8faff]">
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-manrope)] text-[#191c1e] mb-4">
                Команда основателей
              </h2>
              <p className="text-[#434655] text-lg max-w-2xl mx-auto">
                Врачи, разработчики и предприниматели с одной целью — изменить медицину
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="bg-white rounded-2xl p-8 border border-[#e8edf8] text-center hover:border-[#003087]/20 hover:shadow-lg hover:shadow-[#003087]/5 transition-all duration-200"
                >
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-5 font-[family-name:var(--font-manrope)]"
                    style={{ backgroundColor: member.color }}
                    aria-label={`Аватар ${member.name}`}
                  >
                    {member.initials}
                  </div>
                  <h3 className="font-bold text-lg text-[#191c1e] font-[family-name:var(--font-manrope)] mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm font-semibold text-[#003087] mb-4">{member.role}</p>
                  <p className="text-sm text-[#434655] leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-white">
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="relative bg-gradient-to-br from-[#003087] via-[#003087] to-[#1e3a8a] rounded-3xl p-12 lg:p-16 text-white text-center overflow-hidden">
              <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute top-0 right-0 w-72 h-72 bg-[#00a982]/15 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full blur-2xl" />
              </div>
              <div className="relative">
                <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-manrope)] mb-4">
                  Готовы попробовать?
                </h2>
                <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
                  Запишитесь к врачу прямо сейчас или подключите вашу клинику к платформе
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/search"
                    className="px-8 py-4 bg-white text-[#003087] font-bold rounded-2xl hover:opacity-90 active:scale-95 transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-white/40 cursor-pointer"
                  >
                    Найти врача
                  </Link>
                  <Link
                    href="/for-clinics"
                    className="px-8 py-4 bg-white/15 text-white font-bold rounded-2xl border border-white/25 hover:bg-white/25 active:scale-95 transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-white/40 cursor-pointer"
                  >
                    Для клиник
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

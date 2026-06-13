import type { Metadata } from "next";
import Link from "next/link";
import { StarIcon } from "@/components/ui/StarIcon";

const RU_FORMAT = new Intl.NumberFormat("ru-RU");

type TopDoctorCard = {
  slug: string;
  name: string;
  specialty: string;
  avatar: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  experience: number;
  specializations: string[];
  price: number;
};

const TOP_DOCTORS: TopDoctorCard[] = [
  {
    slug: "anna-sokolova",
    name: "Соколова Анна Михайловна",
    specialty: "Кардиолог",
    avatar: "https://i.pravatar.cc/150?u=anna-sokolova",
    verified: true,
    rating: 4.9,
    reviewCount: 184,
    experience: 12,
    specializations: ["Ишемическая болезнь сердца", "Нарушения ритма"],
    price: 2500,
  },
  {
    slug: "igor-petrov",
    name: "Петров Игорь Сергеевич",
    specialty: "Хирург",
    avatar: "https://i.pravatar.cc/150?u=igor-petrov",
    verified: true,
    rating: 4.8,
    reviewCount: 212,
    experience: 18,
    specializations: ["Лапароскопические операции", "Грыжи брюшной стенки"],
    price: 3000,
  },
  {
    slug: "maria-kozlova",
    name: "Козлова Мария Александровна",
    specialty: "Педиатр",
    avatar: "https://i.pravatar.cc/150?u=maria-kozlova",
    verified: true,
    rating: 5.0,
    reviewCount: 147,
    experience: 9,
    specializations: ["ОРВИ и грипп", "Аллергия у детей"],
    price: 1800,
  },
  {
    slug: "dmitry-volkov",
    name: "Волков Дмитрий Александрович",
    specialty: "Невролог",
    avatar: "https://i.pravatar.cc/150?u=dmitry-volkov",
    verified: true,
    rating: 4.85,
    reviewCount: 167,
    experience: 14,
    specializations: ["Мигрень", "Остеохондроз"],
    price: 3200,
  },
  {
    slug: "elena-sidorova",
    name: "Сидорова Елена Игоревна",
    specialty: "Терапевт",
    avatar: "https://i.pravatar.cc/150?u=elena-sidorova",
    verified: false,
    rating: 4.7,
    reviewCount: 289,
    experience: 11,
    specializations: ["Гипертония", "Диабет 2 типа"],
    price: 2200,
  },
  {
    slug: "alexey-nikitin",
    name: "Никитин Алексей Петрович",
    specialty: "Ортопед",
    avatar: "https://i.pravatar.cc/150?u=alexey-nikitin",
    verified: true,
    rating: 4.9,
    reviewCount: 134,
    experience: 16,
    specializations: ["Артроз суставов", "Эндопротезирование"],
    price: 4500,
  },
];

export const metadata: Metadata = {
  title: "Врачи Москвы — каталог специалистов | MEDAS",
  description:
    "Найдите квалифицированного врача в Москве: кардиологи, педиатры, хирурги, неврологи и 90+ специализаций. Онлайн-запись, реальные отзывы, проверенные специалисты.",
  robots: "noindex,nofollow",
};

const HERO_STATS = [
  { value: "2 400+", label: "врачей" },
  { value: "95+",    label: "специализаций" },
  { value: "4.8",    label: "средний рейтинг" },
  { value: "48 ч",   label: "среднее ожидание" },
];

type Specialty = {
  name: string;
  slug: string;
  count: number;
  paths: string[];
};

const SPECIALTIES: Specialty[] = [
  {
    name: "Кардиология",
    slug: "кардиология",
    count: 187,
    paths: [
      "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    ],
  },
  {
    name: "Педиатрия",
    slug: "педиатрия",
    count: 312,
    paths: [
      "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    ],
  },
  {
    name: "Хирургия",
    slug: "хирургия",
    count: 143,
    paths: [
      "M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z",
    ],
  },
  {
    name: "Неврология",
    slug: "неврология",
    count: 209,
    paths: [
      "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    ],
  },
  {
    name: "Гинекология",
    slug: "гинекология",
    count: 276,
    paths: [
      "M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75",
      "M12 9a3 3 0 110 0",
    ],
  },
  {
    name: "Стоматология",
    slug: "стоматология",
    count: 195,
    paths: [
      "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
    ],
  },
  {
    name: "Дерматология",
    slug: "дерматология",
    count: 134,
    paths: [
      "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .116 2.7-1.257 2.5l-4.895-.795a2.25 2.25 0 00-.702 0l-4.895.795c-1.373.2-2.257-1.5-1.257-2.5L5 14.5",
    ],
  },
  {
    name: "Офтальмология",
    slug: "офтальмология",
    count: 118,
    paths: [
      "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z",
      "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    ],
  },
  {
    name: "Урология",
    slug: "урология",
    count: 89,
    paths: [
      "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
    ],
  },
  {
    name: "Ортопедия",
    slug: "ортопедия",
    count: 156,
    paths: [
      "M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z",
      "M12 18a3.75 3.75 0 00.495-7.468 5.99 5.99 0 00-1.925 3.547 5.975 5.975 0 01-2.133-1A3.75 3.75 0 0012 18z",
    ],
  },
  {
    name: "Эндокринология",
    slug: "эндокринология",
    count: 97,
    paths: [
      "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z",
    ],
  },
  {
    name: "Онкология",
    slug: "онкология",
    count: 74,
    paths: [
      "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6",
    ],
  },
];

function SpecialtyCard({ spec }: { spec: Specialty }) {
  return (
    <Link
      href={`/search?specialty=${encodeURIComponent(spec.slug)}`}
      className="group flex flex-col items-center text-center p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center mb-3 group-hover:bg-primary/12 transition-colors">
        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          {spec.paths.map((p, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" d={p} />
          ))}
        </svg>
      </div>
      <p className="font-semibold text-on-surface text-sm leading-snug group-hover:text-primary transition-colors mb-1">
        {spec.name}
      </p>
      <p className="text-xs text-on-surface-variant">{spec.count} врачей</p>
    </Link>
  );
}

export default function DoctorsPage() {
  const topDoctors = TOP_DOCTORS;

  return (
    <main className="min-h-screen bg-slate-50">

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary to-primary/85 text-white pt-20 lg:pt-[110px]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-4">
              Каталог врачей
            </p>
            <h1 className="font-headline font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-5">
              Врачи Москвы
            </h1>
            <p className="text-white/75 text-lg sm:text-xl mb-8 leading-relaxed">
              Квалифицированные специалисты с подтверждёнными отзывами пациентов.
              Запишитесь онлайн за 2 минуты.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
              {HERO_STATS.map(({ value, label }) => (
                <div key={label}>
                  <div className="font-headline font-extrabold text-2xl sm:text-3xl">{value}</div>
                  <div className="text-white/60 text-sm mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-primary font-bold text-sm hover:bg-slate-50 transition-colors shadow-lg shadow-black/10"
              >
                Найти врача
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
              <Link
                href="/clinics"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/15 border border-white/25 text-white font-semibold text-sm hover:bg-white/20 transition-colors"
              >
                Каталог клиник
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Specialties grid ────────────────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-headline font-bold text-2xl sm:text-3xl text-on-surface mb-1">
              Специализации
            </h2>
            <p className="text-on-surface-variant text-sm">
              Выберите направление — покажем лучших врачей
            </p>
          </div>
          <Link
            href="/search"
            className="hidden sm:inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:underline"
          >
            Все специализации
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {SPECIALTIES.map((spec) => (
            <SpecialtyCard key={spec.slug} spec={spec} />
          ))}
        </div>

        <div className="flex sm:hidden justify-center mt-6">
          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:underline"
          >
            Все специализации →
          </Link>
        </div>
      </section>

      {/* ── Top doctors ─────────────────────────────────────────────────────── */}
      <section className="bg-white border-t border-slate-100">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-headline font-bold text-2xl sm:text-3xl text-on-surface mb-1">
                Топ-врачи
              </h2>
              <p className="text-on-surface-variant text-sm">
                Высокий рейтинг, сотни отзывов от пациентов
              </p>
            </div>
            <Link
              href="/search"
              className="hidden sm:inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:underline"
            >
              Все врачи
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topDoctors.map((doctor) => (
              <Link
                key={doctor.slug}
                href={`/doctor/${doctor.slug}`}
                className="group flex items-center gap-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5"
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden ring-2 ring-primary/10 bg-primary/8">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={doctor.avatar}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {doctor.verified && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-secondary flex items-center justify-center border-2 border-white shadow-sm">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-headline font-bold text-on-surface text-base sm:text-lg leading-snug group-hover:text-primary transition-colors">
                    {doctor.name}
                  </h3>
                  <p className="text-primary font-medium text-sm mb-2">{doctor.specialty}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-on-surface-variant mb-2">
                    <span className="flex items-center gap-1">
                      <StarIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-bold text-on-surface text-xs">{doctor.rating}</span>
                      <span className="text-xs opacity-70">({doctor.reviewCount})</span>
                    </span>
                    <span className="text-xs">{doctor.experience} лет опыта</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {doctor.specializations.slice(0, 2).map((s) => (
                      <span key={s} className="px-2.5 py-0.5 rounded-full bg-slate-50 border border-slate-100 text-[11px] text-slate-600 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price + CTA */}
                <div className="shrink-0 flex flex-col items-end gap-2.5">
                  <div className="text-right">
                    <p className="text-[11px] text-on-surface-variant">от</p>
                    <p className="font-bold text-on-surface text-sm sm:text-base">
                      {RU_FORMAT.format(doctor.price)} ₽
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-primary text-white text-xs font-bold group-hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20 whitespace-nowrap">
                    Записаться
                    <svg className="w-3 h-3 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border-2 border-primary text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all"
            >
              Смотреть всех врачей
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why trust MEDAS ─────────────────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="font-headline font-bold text-2xl sm:text-3xl text-on-surface text-center mb-10">
          Почему выбирают MEDAS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z",
              title: "Проверенные врачи",
              desc: "Каждый специалист прошёл верификацию документов и дипломов",
            },
            {
              icon: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z",
              title: "Реальные отзывы",
              desc: "Только пациенты, которые действительно прошли приём, могут оставить отзыв",
            },
            {
              icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5",
              title: "Онлайн-запись 24/7",
              desc: "Записывайтесь в любое время — без звонков и ожидания на линии",
            },
            {
              icon: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z",
              title: "Поддержка 24/7",
              desc: "Ответим на вопросы и поможем выбрать врача в любое время суток",
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="w-11 h-11 rounded-2xl bg-primary/8 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
              </div>
              <h3 className="font-bold text-on-surface text-base mb-2">{title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary to-primary/85 text-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <h2 className="font-headline font-extrabold text-3xl sm:text-4xl mb-4">
            Найдите своего врача прямо сейчас
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-lg mx-auto">
            95+ специализаций, онлайн и офлайн приём, ДМС — всё в одном каталоге
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary font-bold text-base hover:bg-slate-50 transition-colors shadow-lg shadow-black/15"
            >
              Открыть каталог врачей
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/clinics"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/15 border border-white/25 text-white font-semibold text-base hover:bg-white/20 transition-colors"
            >
              Клиники Москвы
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

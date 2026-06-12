import Link from "next/link";

export default function OffersSection() {
  return (
    <section className="py-24 px-6 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left text */}
          <div className="lg:w-1/3 shrink-0">
            <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-4 block">
              Сезонные пакеты
            </span>
            <h2 className="font-headline text-4xl font-extrabold tracking-tight mb-6">
              Спецпредложения для вашего здоровья
            </h2>
            <p className="text-on-surface-variant text-lg mb-8">
              Инвестируйте в своё благополучие с нашими медицинскими пакетами,
              разработанными для комплексной профилактики.
            </p>
            <Link
              href="/promotions"
              className="inline-block bg-surface-container-high text-on-surface px-8 py-3 rounded-xl font-bold transition-all hover:bg-surface-container-highest"
            >
              Все предложения
            </Link>
          </div>

          {/* Cards */}
          <div className="lg:w-2/3 flex flex-col md:flex-row gap-6">
            {/* Card 1 — Primary blue */}
            <div className="bg-primary text-white p-8 rounded-[2.5rem] relative overflow-hidden group flex-1">
              <div className="relative z-10">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block">
                  СКИДКА 25%
                </span>
                <h3 className="font-headline text-2xl font-bold mb-3">
                  Полный чекап
                </h3>
                <p className="text-white/80 mb-6 text-sm">
                  Полная панель обмена веществ, стресс-тестирование и консультация
                  эксперта.
                </p>
                <div className="mb-6">
                  <span className="text-3xl font-headline font-extrabold whitespace-nowrap">25&nbsp;000&nbsp;₽</span>
                  {" "}
                  <span className="text-sm font-normal opacity-60 line-through whitespace-nowrap">35&nbsp;000&nbsp;₽</span>
                </div>
                <Link
                  href="/offers/executive-checkup"
                  className="inline-block bg-white text-primary px-6 py-2.5 rounded-xl font-bold shadow-lg transition-transform active:scale-95"
                >
                  Получить
                </Link>
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            </div>

            {/* Card 2 — Secondary green */}
            <div className="bg-secondary text-white p-8 rounded-[2.5rem] relative overflow-hidden group flex-1 md:mt-10">
              <div className="relative z-10">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block">
                  Новый пациент
                </span>
                <h3 className="font-headline text-2xl font-bold mb-3">
                  Дерматология
                </h3>
                <p className="text-white/80 mb-6 text-sm">
                  Первичная консультация и бесплатный анализ состояния кожи.
                </p>
                <div className="mb-6">
                  <span className="text-3xl font-headline font-extrabold whitespace-nowrap">8&nbsp;000&nbsp;₽</span>
                  {" "}
                  <span className="text-sm font-normal opacity-60 line-through whitespace-nowrap">12&nbsp;000&nbsp;₽</span>
                </div>
                <Link
                  href="/offers/dermatology-sculpt"
                  className="inline-block bg-white text-secondary px-6 py-2.5 rounded-xl font-bold shadow-lg transition-transform active:scale-95"
                >
                  Получить
                </Link>
              </div>
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            </div>

            {/* Card 3 — Neutral surface */}
            <div className="bg-surface-container-low border border-outline-variant p-8 rounded-[2.5rem] relative overflow-hidden group flex-1">
              <div className="relative z-10">
                <span className="bg-on-surface/8 px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block text-on-surface-variant">
                  Семейный
                </span>
                <h3 className="font-headline text-2xl font-bold mb-3 text-on-surface">
                  Семейный план
                </h3>
                <p className="text-on-surface-variant mb-6 text-sm">
                  Годовое медицинское сопровождение для всей семьи — до 4 человек.
                </p>
                <div className="mb-6">
                  <span className="text-3xl font-headline font-extrabold text-on-surface whitespace-nowrap">45&nbsp;000&nbsp;₽</span>
                  {" "}
                  <span className="text-sm font-normal text-on-surface-variant line-through whitespace-nowrap">68&nbsp;000&nbsp;₽</span>
                </div>
                <Link
                  href="/offers/family-health-plan"
                  className="inline-block bg-primary text-white px-6 py-2.5 rounded-xl font-bold shadow transition-transform active:scale-95"
                >
                  Получить
                </Link>
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

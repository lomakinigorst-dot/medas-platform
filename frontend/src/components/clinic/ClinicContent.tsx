import Link from "next/link";
import Image from "next/image";
import type { Clinic } from "@/lib/clinics";
import { getClinics } from "@/lib/clinics";
import { getDoctorBySlug } from "@/lib/doctors";
import ReviewCard from "@/components/ui/ReviewCard";
import ClinicServicesSearch from "@/components/clinic/ClinicServicesSearch";

const ruPrice = new Intl.NumberFormat("ru-RU");

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl sm:text-2xl font-headline font-bold tracking-tight text-primary border-l-4 border-secondary pl-4">
      {children}
    </h2>
  );
}

// Deterministic slots per doctor position
const SLOT_SETS = [
  ["11:30", "14:00", "16:30"],
  ["10:00", "13:30", "17:00"],
  ["09:30", "12:00", "15:30"],
];

export default function ClinicContent({ clinic }: { clinic: Clinic }) {
  const doctors = clinic.doctorSlugs.map(getDoctorBySlug).filter(Boolean);
  const similar = getClinics().filter((c) => c.slug !== clinic.slug).slice(0, 2);

  return (
    <div className="space-y-10">

      {/* ─── 1. О клинике ─── */}
      <section className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,45,98,0.06)] border border-outline-variant/10">
        <SectionHeading>О клинике</SectionHeading>
        <p className="text-on-surface-variant leading-relaxed mt-5 mb-6 text-sm sm:text-base">
          {clinic.description}
        </p>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { value: `${clinic.stats.specialties}+`, label: "Специализаций" },
            { value: `${clinic.stats.doctors}+`, label: "Врачей" },
            { value: clinic.stats.patientsPerYear, label: "Пациентов в год" },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-xl bg-surface-container-low border-l-4 border-secondary">
              <div className="text-xl sm:text-2xl font-headline font-extrabold text-primary">{stat.value}</div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-on-surface-variant mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 2. Врачи доступны сегодня ─── */}
      {doctors.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <SectionHeading>Врачи доступны сегодня</SectionHeading>
            <Link href="/search" className="text-sm font-bold text-secondary hover:underline flex items-center gap-1 whitespace-nowrap">
              Все врачи
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {doctors.map((doc, idx) => {
              const slots = SLOT_SETS[idx % SLOT_SETS.length];
              return (
                <div key={doc!.slug} className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,45,98,0.06)] border border-outline-variant/10">
                  <div className="flex gap-4 mb-4">
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden">
                      <Image src={doc!.photo} alt={doc!.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-headline font-bold text-primary text-sm leading-tight">{doc!.name}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5 truncate">{doc!.specialty} · Стаж {doc!.experience} лет</p>
                      <div className="flex items-center gap-1 mt-1">
                        <svg className="w-3 h-3 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs font-bold text-on-surface">{doc!.rating}</span>
                        <span className="text-xs text-on-surface-variant">({doc!.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                  {/* Time slots */}
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Ближайшие окна сегодня</p>
                  <div className="flex gap-2 flex-wrap">
                    {slots.map((t) => (
                      <Link
                        key={t}
                        href={`/doctor/${doc!.slug}`}
                        className="px-3 py-1.5 bg-secondary/10 text-secondary text-xs font-bold rounded-lg hover:bg-secondary/20 transition-colors"
                      >
                        {t}
                      </Link>
                    ))}
                  </div>
                  <Link
                    href={`/doctor/${doc!.slug}`}
                    className="mt-4 block w-full py-2 bg-primary text-white text-xs font-bold rounded-xl text-center hover:opacity-90 transition-opacity"
                  >
                    Записаться к врачу
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── 3. Услуги и цены (client: live search) ─── */}
      <ClinicServicesSearch services={clinic.services} />

      {/* ─── 4. Рейтинг и отзывы ─── */}
      <section className="space-y-5">
        <SectionHeading>Рейтинг и отзывы</SectionHeading>

        {/* Summary */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,45,98,0.06)] border border-outline-variant/10 flex flex-col sm:flex-row gap-6">
          {/* Big number */}
          <div className="text-center flex-shrink-0 sm:border-r border-surface-container sm:pr-6">
            <p className="font-headline text-5xl font-extrabold text-primary leading-none">{clinic.rating.toFixed(1)}</p>
            <div className="flex gap-0.5 justify-center mt-2">
              {[1,2,3,4,5].map((i) => (
                <svg key={i} className={`w-4 h-4 ${i <= Math.round(clinic.rating) ? "text-amber-400" : "text-outline-variant"}`} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-xs text-on-surface-variant mt-1">{new Intl.NumberFormat("ru-RU").format(clinic.reviewCount)} отзывов</p>
          </div>
          {/* Category bars */}
          <div className="flex-1 space-y-3">
            {clinic.ratingCategories.map((cat) => (
              <div key={cat.name} className="flex items-center gap-3">
                <span className="text-xs text-on-surface-variant w-36 flex-shrink-0">{cat.name}</span>
                <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full"
                    style={{ width: `${(cat.value / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-on-surface w-6 text-right flex-shrink-0">{cat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review cards */}
        {clinic.reviews.length === 0 ? (
          <div className="text-center py-12 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
            <p className="text-3xl mb-3">💬</p>
            <p className="font-bold text-on-surface">Отзывов пока нет</p>
            <p className="text-sm text-on-surface-variant mt-1">Станьте первым, кто поделится впечатлениями</p>
          </div>
        ) : (
          <div className="space-y-4">
            {clinic.reviews.map((review, i) => (
              <ReviewCard
                key={i}
                name={review.author}
                initials={review.author[0]}
                date={review.date}
                rating={review.rating}
                text={review.text}
              />
            ))}
          </div>
        )}
      </section>

      {/* ─── 5. Акции и бонусы ─── */}
      {clinic.promotions.length > 0 && (
        <section className="space-y-4">
          <SectionHeading>Акции и бонусы</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {clinic.promotions.map((promo, i) => (
              <div
                key={i}
                className="relative bg-surface-container-lowest rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,45,98,0.06)] border border-outline-variant/10 overflow-hidden"
              >
                {/* Discount badge */}
                <span className="absolute top-4 right-4 bg-secondary text-white text-xs font-extrabold px-3 py-1 rounded-full">
                  {promo.discount}
                </span>
                <p className="font-headline font-bold text-primary text-base pr-16">{promo.title}</p>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">{promo.description}</p>
                <div className="flex items-center gap-1.5 mt-4">
                  <svg className="w-3.5 h-3.5 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[11px] text-on-surface-variant">до {promo.validUntil}</span>
                </div>
              </div>
            ))}
          </div>
          {/* MEDAS bonus info */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
            <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            <div>
              <p className="text-xs font-bold text-amber-700">Бонусная программа MEDAS</p>
              <p className="text-[11px] text-amber-600 mt-0.5 leading-relaxed">
                Начисляем 5% от стоимости каждого визита бонусами. Оплачивайте бонусами до 10% следующей записи. 1 бонус = 1 ₽.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ─── 6. Специализации ─── */}
      <section className="space-y-4">
        <SectionHeading>Направления</SectionHeading>
        <div className="flex flex-wrap gap-2">
          {clinic.specialtyTags.map((tag) => (
            <Link
              key={tag}
              href={`/search?specialty=${encodeURIComponent(tag)}`}
              className="px-3 py-1.5 bg-surface-container text-on-surface text-xs font-semibold rounded-full hover:bg-primary/8 hover:text-primary transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 7. Фото клиники ─── */}
      <section className="space-y-4">
        <SectionHeading>Фото клиники</SectionHeading>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className={`rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant/40 text-xs ${i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          ))}
        </div>
        <button className="text-sm font-bold text-secondary hover:underline">
          Смотреть все фото →
        </button>
      </section>

      {/* ─── 8. Похожие клиники ─── */}
      {similar.length > 0 && (
        <section className="space-y-4">
          <SectionHeading>Похожие клиники</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {similar.map((c) => (
              <div key={c.slug} className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,45,98,0.06)] border border-outline-variant/10">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-primary leading-tight">{c.name}</p>
                    <p className="text-xs text-secondary font-medium mt-0.5">{c.metro}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <svg className="w-3 h-3 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs font-bold text-on-surface">{c.rating}</span>
                      <span className="text-xs text-on-surface-variant">({new Intl.NumberFormat("ru-RU").format(c.reviewCount)} отз.)</span>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/clinic/${c.slug}`}
                  className="block w-full py-2 bg-secondary/10 text-secondary text-xs font-bold rounded-xl text-center hover:bg-secondary/20 transition-colors"
                >
                  Перейти в клинику
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

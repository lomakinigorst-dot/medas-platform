import Link from "next/link";
import Image from "next/image";
import type { Clinic } from "@/lib/clinics";
import { getDoctorBySlug } from "@/lib/doctors";

const ruPrice = new Intl.NumberFormat("ru-RU");

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl sm:text-2xl font-headline font-bold tracking-tight text-primary border-l-4 border-secondary pl-4">
      {children}
    </h2>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={`w-3.5 h-3.5 ${i <= rating ? "text-secondary" : "text-outline-variant"}`} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ClinicContent({ clinic }: { clinic: Clinic }) {
  const doctors = clinic.doctorSlugs.map(getDoctorBySlug).filter(Boolean);

  return (
    <div className="space-y-10">
      {/* О клинике */}
      <section className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,45,98,0.06)] border border-outline-variant/10">
        <SectionHeading>О клинике</SectionHeading>
        <p className="text-on-surface-variant leading-relaxed mt-5 mb-6 text-sm sm:text-base">
          {clinic.description}
        </p>
        <div className="grid grid-cols-3 gap-4">
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

      {/* Наши специалисты */}
      {doctors.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <SectionHeading>Наши специалисты</SectionHeading>
            <Link href="/search" className="text-sm font-bold text-secondary hover:underline flex items-center gap-1">
              Все врачи
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {doctors.map((doc) => (
              <div key={doc!.slug} className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,45,98,0.06)] border border-outline-variant/10 group">
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                    <Image src={doc!.photo} alt={doc!.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-headline font-bold text-primary group-hover:text-secondary transition-colors text-sm leading-tight">{doc!.name}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{doc!.specialty} · Стаж {doc!.experience} лет</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <svg className="w-3 h-3 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs font-bold text-on-surface">{doc!.rating}</span>
                      <span className="text-xs text-on-surface-variant">({doc!.reviewCount})</span>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/doctor/${doc!.slug}`}
                  className="mt-4 block w-full py-2 bg-secondary/10 text-secondary text-xs font-bold rounded-xl text-center hover:bg-secondary/20 transition-colors"
                >
                  Записаться к врачу
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Фото клиники */}
      <section>
        <SectionHeading>Фото клиники</SectionHeading>
        <div className="grid grid-cols-3 gap-3 mt-5">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant text-xs font-medium">
              Фото {i + 1}
            </div>
          ))}
        </div>
      </section>

      {/* Услуги и направления */}
      <section>
        <SectionHeading>Услуги и направления</SectionHeading>
        <div className="flex flex-wrap gap-2 mt-5">
          {clinic.specialtyTags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 bg-surface-container text-on-surface text-xs font-semibold rounded-full hover:bg-primary/8 hover:text-primary transition-colors cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Отзывы */}
      <section>
        <SectionHeading>Отзывы</SectionHeading>
        {clinic.reviews.length === 0 ? (
          <div className="mt-5 text-center py-12 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
            <p className="text-3xl mb-3">💬</p>
            <p className="font-bold text-on-surface">Отзывов пока нет</p>
            <p className="text-sm text-on-surface-variant mt-1">Станьте первым, кто поделится впечатлениями</p>
          </div>
        ) : (
          <div className="space-y-4 mt-5">
            {clinic.reviews.map((review, i) => (
              <div key={i} className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,45,98,0.06)] border border-outline-variant/10">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {review.author[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-on-surface">{review.author}</p>
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                  <span className="text-[10px] text-on-surface-variant whitespace-nowrap">{review.date}</span>
                </div>
                <p className="text-sm text-on-surface-variant italic leading-relaxed">&ldquo;{review.text}&rdquo;</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

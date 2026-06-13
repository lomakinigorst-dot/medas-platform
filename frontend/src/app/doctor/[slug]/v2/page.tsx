import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { StarIcon } from "@/components/ui/StarIcon";
import DoctorHeroV2 from "@/components/doctor/v2/DoctorHeroV2";
import AppointmentSidebarV2 from "@/components/doctor/v2/AppointmentSidebarV2";
import SimilarDoctors from "@/components/doctor/SimilarDoctors";
import { getDoctorBySlug, getSimilarDoctors, type Doctor } from "@/lib/doctors";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);
  if (!doctor) return { title: "Врач не найден | MEDAS" };
  return {
    title: `${doctor.name} — ${doctor.specialty} в Москве | MEDAS`,
    description: `${doctor.name} — ${doctor.specialty}, опыт ${doctor.experience} лет. ${doctor.bio.slice(0, 120)}`,
  };
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-bold font-headline border-l-4 border-secondary pl-4 text-on-surface">
      {children}
    </h2>
  );
}

function ReviewsSection({ doctor }: { doctor: Doctor }) {
  const stars = [5, 4, 3, 2, 1] as const;
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <SectionHeading>Отзывы пациентов</SectionHeading>
        <button className="text-secondary font-bold text-sm hover:underline">
          Все {doctor.reviewCount} отзывов
        </button>
      </div>

      {/* Rating summary */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start shadow-sm">
        <div className="text-center flex-shrink-0">
          <p className="font-headline text-5xl font-extrabold text-on-surface">{doctor.rating.toFixed(1)}</p>
          <div className="flex gap-0.5 justify-center mt-2">
            {[1,2,3,4,5].map((i) => (
              <StarIcon key={i} className={`w-4 h-4 ${i <= Math.round(doctor.rating) ? "text-amber-400" : "text-outline-variant"}`} />
            ))}
          </div>
          <p className="text-sm text-on-surface-variant mt-1">{doctor.reviewCount} отзывов</p>
        </div>
        <div className="flex-1 w-full space-y-2">
          {stars.map((star) => (
            <div key={star} className="flex items-center gap-3">
              <span className="text-xs text-on-surface-variant w-3 text-right">{star}</span>
              <StarIcon className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${doctor.ratingBreakdown[star]}%` }} />
              </div>
              <span className="text-xs text-on-surface-variant w-8 text-right">{doctor.ratingBreakdown[star]}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review cards */}
      <div className="space-y-4">
        {doctor.reviews.length === 0 ? (
          <p className="text-center text-on-surface-variant py-8">Отзывов пока нет</p>
        ) : (
          doctor.reviews.map((review) => (
            <div key={review.id} className="p-6 bg-surface-container-lowest rounded-2xl shadow-sm">
              <div className="flex justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-sm">
                    {review.initials}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-on-surface">{review.name}</p>
                    <p className="text-xs text-on-surface-variant">{review.date}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((i) => (
                    <StarIcon key={i} className={`w-4 h-4 ${i <= review.rating ? "text-amber-400" : "text-outline-variant"}`} />
                  ))}
                </div>
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed italic">
                &ldquo;{review.text}&rdquo;
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default async function DoctorProfilePageV2({ params }: Props) {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);
  if (!doctor) notFound();

  const similar = getSimilarDoctors(doctor, 3);

  return (
    <>
      <Header />
      <main className="pt-20 lg:pt-[110px] pb-20 bg-surface">
        <div className="max-w-screen-xl mx-auto px-6">
          {/* Version badge */}
          <div className="mb-4 flex items-center gap-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary">
              Вариант 2 — Editorial стиль
            </span>
            <a href={`/doctor/${slug}`} className="text-xs text-on-surface-variant hover:text-primary underline">
              → Вариант 1
            </a>
          </div>

          <Breadcrumb
            items={[
              { label: "Главная", href: "/" },
              { label: doctor.specialty, href: `/search?specialty=${doctor.specialtySlug}` },
              { label: doctor.name },
            ]}
          />

          {/* Hero */}
          <div className="mt-6 mb-12">
            <DoctorHeroV2 doctor={doctor} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left column */}
            <div className="lg:col-span-8 space-y-12">

              {/* Biography */}
              <section className="space-y-4">
                <SectionHeading>Профессиональная биография</SectionHeading>
                <div className="bg-surface-container-lowest p-8 rounded-2xl leading-relaxed text-on-surface-variant shadow-sm">
                  {doctor.bio}
                </div>
              </section>

              {/* Education + Specializations */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-surface-container-lowest rounded-2xl shadow-sm space-y-4">
                  <div className="flex items-center gap-3 text-primary">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    <h3 className="font-bold font-headline">Образование и подготовка</h3>
                  </div>
                  <ul className="space-y-4">
                    {doctor.education.map((edu, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 mt-2 rounded-full bg-secondary flex-shrink-0" />
                        <div>
                          <p className="font-bold text-sm text-on-surface">{edu.institution}</p>
                          <p className="text-xs text-on-surface-variant">{edu.degree} · {edu.year}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 bg-surface-container-lowest rounded-2xl shadow-sm space-y-4">
                  <div className="flex items-center gap-3 text-secondary">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <h3 className="font-bold font-headline">Клинические специализации</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {doctor.specializations.map((s) => (
                      <span key={s} className="px-3 py-1.5 bg-secondary/8 text-secondary text-xs font-bold rounded-lg">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* Services table */}
              <section className="space-y-4">
                <SectionHeading>Услуги и цены</SectionHeading>
                <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-surface-container text-left">
                        <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wide">Услуга</th>
                        <th className="px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wide hidden sm:table-cell">Длительность</th>
                        <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wide text-right">Стоимость</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctor.services.map((service, i) => (
                        <tr key={i} className="border-t border-outline-variant/10 hover:bg-surface-container/40 transition-colors">
                          <td className="px-6 py-4 font-medium text-sm text-on-surface">{service.name}</td>
                          <td className="px-4 py-4 text-sm text-on-surface-variant hidden sm:table-cell">{service.duration}</td>
                          <td className="px-6 py-4 text-right">
                            <span className="font-headline font-bold text-on-surface whitespace-nowrap">
                              {new Intl.NumberFormat("ru-RU").format(service.price)} ₽
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Clinic info + Map */}
              <section className="space-y-4">
                <SectionHeading>Информация о клинике</SectionHeading>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Clinic card */}
                  <div className="p-6 bg-surface-container-lowest rounded-2xl shadow-sm space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-primary">{doctor.clinic.name}</p>
                        <p className="text-sm text-on-surface-variant">{doctor.clinic.address}</p>
                        <p className="text-xs text-secondary font-semibold mt-0.5">м. {doctor.clinic.metro}</p>
                      </div>
                    </div>
                    <div className="space-y-2 pt-3 border-t border-outline-variant/10">
                      {doctor.clinic.schedule.map((s, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-on-surface-variant">{s.days}</span>
                          <span className="font-semibold text-on-surface">{s.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Map placeholder */}
                  <div className="min-h-[220px] rounded-2xl overflow-hidden bg-surface-container-high relative shadow-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-surface-container to-surface-container-high" />
                    {/* Grid lines to simulate map */}
                    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 300 220">
                      {[0,40,80,120,160,200,240].map(x => <line key={x} x1={x} y1="0" x2={x} y2="220" stroke="#43474f" strokeWidth="0.5"/>)}
                      {[0,40,80,120,160,200].map(y => <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#43474f" strokeWidth="0.5"/>)}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-xl">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                      </div>
                      <p className="text-xs font-semibold text-on-surface-variant">{doctor.clinic.name}</p>
                      <p className="text-xs text-on-surface-variant">{doctor.clinic.address}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Reviews */}
              <ReviewsSection doctor={doctor} />
            </div>

            {/* Right sidebar */}
            <div className="lg:col-span-4">
              <AppointmentSidebarV2 doctor={doctor} />
            </div>
          </div>

          {/* Similar doctors */}
          <SimilarDoctors doctors={similar} />
        </div>
      </main>
      <Footer />
    </>
  );
}

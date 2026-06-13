import { StarIcon } from "@/components/ui/StarIcon";
import type { Doctor } from "@/lib/doctors";
import ReviewCard from "@/components/ui/ReviewCard";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl lg:text-2xl font-bold font-headline border-l-4 border-secondary pl-4 text-on-surface">
      {children}
    </h2>
  );
}

function BiographySection({ doctor }: { doctor: Doctor }) {
  return (
    <section className="space-y-4">
      <SectionHeading>Профессиональная биография</SectionHeading>
      <div className="bg-surface-container-lowest p-6 lg:p-8 rounded-2xl leading-relaxed text-on-surface-variant shadow-sm">
        {doctor.bio}
      </div>
    </section>
  );
}

function EducationSection({ doctor }: { doctor: Doctor }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Education */}
      <div className="p-6 bg-surface-container-lowest rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-primary">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
          </svg>
          <h3 className="font-bold font-headline">Образование</h3>
        </div>
        <ul className="space-y-4">
          {doctor.education.map((edu, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-secondary flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm text-on-surface">{edu.institution}</p>
                <p className="text-xs text-on-surface-variant">{edu.degree} · {edu.year}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Specializations */}
      <div className="p-6 bg-surface-container-lowest rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-secondary">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
          <h3 className="font-bold font-headline">Специализации</h3>
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
  );
}

function ServicesSection({ doctor }: { doctor: Doctor }) {
  const ruPrice = new Intl.NumberFormat("ru-RU");
  return (
    <section className="space-y-4">
      <SectionHeading>Услуги и цены</SectionHeading>
      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-container text-left">
              <th className="px-5 py-3.5 text-xs font-bold text-on-surface-variant uppercase tracking-wide">Услуга</th>
              <th className="px-4 py-3.5 text-xs font-bold text-on-surface-variant uppercase tracking-wide hidden sm:table-cell">Длит.</th>
              <th className="px-5 py-3.5 text-xs font-bold text-on-surface-variant uppercase tracking-wide text-right">Цена</th>
            </tr>
          </thead>
          <tbody>
            {doctor.services.map((service, i) => (
              <tr key={i} className="border-t border-outline-variant/10 hover:bg-surface-container/40 transition-colors">
                <td className="px-5 py-4 text-sm text-on-surface">{service.name}</td>
                <td className="px-4 py-4 text-sm text-on-surface-variant hidden sm:table-cell">{service.duration}</td>
                <td className="px-5 py-4 text-right">
                  <span className="font-headline font-bold text-on-surface whitespace-nowrap">
                    {ruPrice.format(service.price)} ₽
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-on-surface-variant px-1">
        * Цены за стандартный приём. Могут отличаться в зависимости от сложности случая.
      </p>
    </section>
  );
}

function ClinicSection({ doctor }: { doctor: Doctor }) {
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(doctor.clinic.address + ", Москва")}`;
  return (
    <section className="space-y-4">
      <SectionHeading>Клиника приёма</SectionHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Info card */}
        <div className="p-6 bg-surface-container-lowest rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-primary leading-tight">{doctor.clinic.name}</p>
              <p className="text-sm text-on-surface-variant mt-0.5">{doctor.clinic.address}</p>
              <p className="text-xs text-secondary font-semibold mt-1">м. {doctor.clinic.metro}</p>
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
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:underline pt-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Как добраться
          </a>
        </div>

        {/* Map thumbnail */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[200px] rounded-2xl overflow-hidden bg-surface-container relative shadow-sm group block"
          aria-label="Открыть в Google Maps"
        >
          <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice">
            {[0,50,100,150,200,250,300].map(x => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="200" stroke="#43474f" strokeWidth="0.8"/>)}
            {[0,50,100,150,200].map(y => <line key={`h${y}`} x1="0" y1={y} x2="300" y2={y} stroke="#43474f" strokeWidth="0.8"/>)}
            <line x1="0" y1="100" x2="300" y2="100" stroke="#43474f" strokeWidth="3" opacity="0.4"/>
            <line x1="150" y1="0" x2="150" y2="200" stroke="#43474f" strokeWidth="3" opacity="0.4"/>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-on-surface">м. {doctor.clinic.metro}</p>
              <p className="text-[11px] text-on-surface-variant mt-0.5 group-hover:text-primary transition-colors">
                Открыть в Google Maps →
              </p>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}

function ReviewsSection({ doctor }: { doctor: Doctor }) {
  const stars = [5, 4, 3, 2, 1] as const;

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <SectionHeading>Отзывы пациентов</SectionHeading>
        {/* Not a link — page doesn't exist yet */}
        <span className="text-sm text-on-surface-variant">{doctor.reviewCount} отзывов</span>
      </div>

      {doctor.reviews.length === 0 ? (
        /* Empty state */
        <div className="bg-surface-container-lowest rounded-2xl p-8 text-center space-y-3 shadow-sm">
          <div className="text-4xl">⭐</div>
          <p className="font-headline font-bold text-on-surface">Пока нет отзывов</p>
          <p className="text-sm text-on-surface-variant max-w-sm mx-auto">
            Станьте первым — запишитесь на приём и поделитесь впечатлением.
            Это помогает другим пациентам выбрать врача.
          </p>
        </div>
      ) : (
        <>
          {/* Rating summary */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start shadow-sm">
            <div className="text-center flex-shrink-0">
              <p className="font-headline text-5xl font-extrabold text-on-surface">{doctor.rating.toFixed(1)}</p>
              <div className="flex gap-0.5 justify-center mt-2">
                {[1,2,3,4,5].map((i) => (
                  <StarIcon key={i} className={`w-4 h-4 ${i <= Math.round(doctor.rating) ? "text-amber-400" : "text-outline-variant"}`}/>
                ))}
              </div>
              <p className="text-sm text-on-surface-variant mt-1">{doctor.reviewCount} отзывов</p>
            </div>
            <div className="flex-1 w-full space-y-2">
              {stars.map((star) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-xs text-on-surface-variant w-3 text-right">{star}</span>
                  <StarIcon className="w-3.5 h-3.5 text-amber-400 flex-shrink-0"/>
                  <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${doctor.ratingBreakdown[star]}%` }}/>
                  </div>
                  <span className="text-xs text-on-surface-variant w-8 text-right">{doctor.ratingBreakdown[star]}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review cards — unified component */}
          <div className="space-y-4">
            {doctor.reviews.map((review) => (
              <ReviewCard
                key={review.id}
                name={review.name}
                initials={review.initials}
                date={review.date}
                rating={review.rating}
                text={review.text}
                verified
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default function DoctorContentSections({ doctor }: { doctor: Doctor }) {
  return (
    <div className="space-y-10">
      <BiographySection doctor={doctor} />
      <EducationSection doctor={doctor} />
      <ServicesSection doctor={doctor} />
      <ClinicSection doctor={doctor} />
      <ReviewsSection doctor={doctor} />
    </div>
  );
}

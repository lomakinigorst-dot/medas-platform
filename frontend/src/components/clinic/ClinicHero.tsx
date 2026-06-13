import Link from "next/link";
import type { Clinic } from "@/lib/clinics";

const ruInt = new Intl.NumberFormat("ru-RU");

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg className={`w-4 h-4 ${filled ? "text-secondary" : "text-outline-variant"}`} viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default function ClinicHero({ clinic }: { clinic: Clinic }) {
  return (
    <header className="mb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          {/* Verified badge */}
          <div className="flex items-center gap-2 text-secondary font-bold tracking-widest text-xs uppercase">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Проверена MEDAS
          </div>

          {/* Clinic name */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-extrabold tracking-tight text-primary">
            {clinic.name}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium">{clinic.address}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <StarIcon key={i} filled={i <= Math.round(clinic.rating)} />
                ))}
              </div>
              <span className="text-sm font-bold text-on-surface">{clinic.rating}</span>
              <span className="text-xs text-on-surface-variant">({ruInt.format(clinic.reviewCount)} отзывов)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Пн–Пт {clinic.hours.weekdays}</span>
            </div>
          </div>

          {/* DMS badge */}
          {clinic.acceptsDMS && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/8 border border-primary/15 rounded-full">
              <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="text-xs font-bold text-primary">Принимаем ДМС</span>
            </div>
          )}
        </div>

        {/* CTA buttons */}
        <div className="flex gap-3 flex-shrink-0">
          <Link
            href={`/search?clinic=${clinic.slug}`}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all text-sm sm:text-base whitespace-nowrap"
          >
            Записаться на приём
          </Link>
          <button
            className="p-3 sm:p-4 rounded-xl bg-surface-container text-primary hover:bg-surface-container-high active:scale-95 transition-all"
            aria-label="Поделиться"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

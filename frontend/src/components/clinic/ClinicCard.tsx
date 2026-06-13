import Link from "next/link";
import type { Clinic } from "@/lib/clinics";

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function HospitalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
  );
}

function MetroIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 20l3.5-12L12 16l6.5-8L22 20H2zm10-7.2L8.5 7.6 6.3 15h11.4l-1.7-5.8L12 12.8z" />
    </svg>
  );
}

type Props = {
  clinic: Clinic;
  isOpen: boolean;
};

export default function ClinicCard({ clinic, isOpen }: Props) {
  const topTags = clinic.specialtyTags.slice(0, 4);
  const ruPrice = new Intl.NumberFormat("ru-RU");

  return (
    <Link
      href={`/clinic/${clinic.slug}`}
      className="group relative flex bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
    >
      {/* Left accent bar */}
      <div className="w-1 shrink-0 bg-primary rounded-l-2xl" />

      {/* Content */}
      <div className="flex flex-1 flex-col sm:flex-row gap-5 p-5 sm:p-6 min-w-0">

        {/* Icon block */}
        <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/8 flex items-center justify-center">
          <HospitalIcon className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0 space-y-2.5">

          {/* Name row */}
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-headline font-bold text-on-surface text-base sm:text-lg leading-snug group-hover:text-primary transition-colors">
              {clinic.name}
            </h3>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${
                isOpen
                  ? "bg-secondary/10 text-secondary"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-secondary" : "bg-slate-300"}`} />
              {isOpen ? "Открыто" : "Закрыто"}
            </span>
            {clinic.acceptsDMS && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600">
                ДМС
              </span>
            )}
          </div>

          {/* Address + metro */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-on-surface-variant">
            <span>{clinic.address}</span>
            {clinic.metro && (
              <span className="inline-flex items-center gap-1 text-primary font-medium">
                <MetroIcon />
                {clinic.metro}
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {topTags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-600 text-xs font-medium border border-slate-100"
              >
                {tag}
              </span>
            ))}
            {clinic.specialtyTags.length > 4 && (
              <span className="px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-400 text-xs font-medium border border-slate-100">
                +{clinic.specialtyTags.length - 4}
              </span>
            )}
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
            <span className="text-on-surface-variant">
              <span className="font-bold text-on-surface">{clinic.stats.doctors}</span> врачей
            </span>
            <span className="text-on-surface-variant">
              <span className="font-bold text-on-surface">{clinic.stats.specialties}</span> специализаций
            </span>
            <span className="text-on-surface-variant">
              <span className="font-bold text-secondary">{clinic.bookingsLastMonth}</span> записей за месяц
            </span>
          </div>
        </div>

        {/* Right block */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:gap-4 shrink-0 sm:min-w-[110px]">
          {/* Rating */}
          <div className="flex flex-col items-center sm:items-end gap-0.5">
            <div className="flex items-center gap-1.5">
              <StarIcon className="w-4 h-4 text-amber-400" />
              <span className="font-headline font-extrabold text-on-surface text-lg leading-none">
                {clinic.rating}
              </span>
            </div>
            <span className="text-[11px] text-on-surface-variant">
              {clinic.reviewCount} отзывов
            </span>
          </div>

          {/* Price */}
          {clinic.services[0] && (
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[11px] text-on-surface-variant">от</span>
              <span className="font-bold text-on-surface text-sm">
                {ruPrice.format(clinic.services[0].price)} ₽
              </span>
            </div>
          )}

          {/* CTA */}
          <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold group-hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20 whitespace-nowrap">
            Выбрать врача
            <svg className="w-3.5 h-3.5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

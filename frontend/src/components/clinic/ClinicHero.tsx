import Link from "next/link";
import type { Clinic } from "@/lib/clinics";

const ruInt = new Intl.NumberFormat("ru-RU");

function isOpenNow(clinic: Clinic): boolean {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const hour = now.getHours() + now.getMinutes() / 60;

  const parseHours = (str: string): { from: number; to: number } | null => {
    const m = str.match(/(\d+):(\d+)\s*[–-]\s*(\d+):(\d+)/);
    if (!m) return null;
    return { from: +m[1] + +m[2] / 60, to: +m[3] + +m[4] / 60 };
  };

  if (day === 0 || day === 6) {
    const h = parseHours(clinic.hours.weekends);
    return h ? hour >= h.from && hour < h.to : false;
  }
  const h = parseHours(clinic.hours.weekdays);
  return h ? hour >= h.from && hour < h.to : false;
}

export default function ClinicHero({ clinic }: { clinic: Clinic }) {
  const open = isOpenNow(clinic);
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(clinic.address)}`;

  return (
    <header className="mb-8 space-y-5">
      {/* ─── Hero banner ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-[#0038A8] to-[#001f70] min-h-[220px] lg:min-h-[280px] flex items-end">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/[0.04] rounded-full" />
        <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-white/[0.04] rounded-full" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-secondary/10 rounded-full -translate-y-1/2" />

        {/* Medical cross watermark */}
        <svg
          className="absolute top-6 right-6 w-28 h-28 lg:w-40 lg:h-40 text-white/[0.06]"
          fill="none" viewBox="0 0 100 100" stroke="currentColor" strokeWidth={8}
        >
          <line x1="50" y1="10" x2="50" y2="90" />
          <line x1="10" y1="50" x2="90" y2="50" />
        </svg>

        {/* Social proof badge */}
        <div className="absolute top-5 left-5 sm:top-6 sm:left-6 flex items-center gap-2 bg-white/[0.12] backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
          <span className="w-2 h-2 bg-secondary rounded-full animate-pulse flex-shrink-0" />
          <span className="text-white text-xs font-bold">
            {clinic.bookingsLastMonth} записей за месяц
          </span>
        </div>

        {/* Verified + DMS badges — top right */}
        <div className="absolute top-5 right-5 sm:top-6 sm:right-6 flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1 bg-secondary/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Проверена
          </span>
          {clinic.acceptsDMS && (
            <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/30">
              ДМС
            </span>
          )}
        </div>

        {/* Content at the bottom of banner */}
        <div className="relative w-full p-5 sm:p-7 lg:p-8">
          {/* Verified row (mobile) */}
          <div className="sm:hidden flex items-center gap-1.5 text-secondary text-[10px] font-bold uppercase tracking-widest mb-2">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Проверена MEDAS
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-headline font-extrabold text-white tracking-tight leading-tight mb-4">
            {clinic.name}
          </h1>

          {/* Meta chips row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Rating */}
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((i) => (
                  <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.round(clinic.rating) ? "text-amber-400" : "text-white/30"}`} viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-white font-bold text-sm">{clinic.rating}</span>
              <span className="text-white/60 text-xs">({ruInt.format(clinic.reviewCount)})</span>
            </div>

            {/* Divider */}
            <span className="w-px h-4 bg-white/20" />

            {/* Metro */}
            <div className="flex items-center gap-1.5 text-white/90 text-xs font-medium">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10l9-7 9 7v11a1 1 0 01-1 1H4a1 1 0 01-1-1V10z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" />
              </svg>
              {clinic.metro}
            </div>

            {/* Divider */}
            <span className="w-px h-4 bg-white/20" />

            {/* Open / closed */}
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${open ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
              <span className="text-white text-xs font-medium">
                {open ? "Открыто сейчас" : "Закрыто"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CTA row ─── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={`/search?clinic=${clinic.slug}`}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all text-sm whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Записаться на приём
        </Link>

        <a
          href={`tel:${clinic.phone.replace(/\D/g, "")}`}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-surface-container text-on-surface font-bold rounded-xl hover:bg-surface-container-high transition-colors text-sm whitespace-nowrap"
        >
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          {clinic.phone}
        </a>

        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(clinic.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center justify-center gap-2 px-5 py-3.5 bg-surface-container text-on-surface-variant font-bold rounded-xl hover:bg-surface-container-high transition-colors text-sm whitespace-nowrap"
        >
          <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Как добраться
        </a>

        <button
          className="hidden sm:flex items-center justify-center w-12 h-12 bg-surface-container text-on-surface-variant rounded-xl hover:bg-surface-container-high transition-colors ml-auto flex-shrink-0"
          aria-label="Поделиться"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>
    </header>
  );
}

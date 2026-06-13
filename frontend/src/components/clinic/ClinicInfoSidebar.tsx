import Link from "next/link";
import type { Clinic } from "@/lib/clinics";

export default function ClinicInfoSidebar({ clinic }: { clinic: Clinic }) {
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(clinic.address)}`;

  return (
    <div className="sticky top-[110px] max-h-[calc(100vh-126px)] overflow-y-auto space-y-4 [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-outline-variant/40 [&::-webkit-scrollbar-thumb]:rounded-full">

      {/* Info card */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-[0_4px_20px_rgba(0,45,98,0.06)] border border-outline-variant/10 overflow-hidden">
        <div className="bg-primary px-6 py-5 text-white">
          <h3 className="text-base font-headline font-bold">Информация о клинике</h3>
          <p className="text-xs opacity-75 mt-0.5">Режим работы и контакты</p>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <p className="text-xs font-bold text-on-surface">Адрес</p>
              <p className="text-xs text-on-surface-variant mt-0.5">{clinic.address}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <div>
              <p className="text-xs font-bold text-on-surface">Телефон</p>
              <a href={`tel:${clinic.phone.replace(/\D/g, "")}`} className="text-xs text-primary font-semibold hover:underline mt-0.5 block">
                {clinic.phone}
              </a>
            </div>
          </div>
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-xs font-bold text-on-surface">Пн–Пт</p>
              <p className="text-xs text-on-surface-variant mt-0.5">{clinic.hours.weekdays}</p>
              <p className="text-xs font-bold text-on-surface mt-2">Сб–Вс</p>
              <p className="text-xs text-on-surface-variant mt-0.5">{clinic.hours.weekends}</p>
            </div>
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 bg-surface-container-low text-primary font-bold rounded-xl text-center text-sm hover:bg-surface-container transition-colors mt-2"
          >
            Проложить маршрут
          </a>
        </div>
      </div>

      {/* CTA */}
      <Link
        href={`/search?clinic=${clinic.slug}`}
        className="block w-full py-4 bg-secondary text-white font-bold rounded-2xl shadow-lg shadow-secondary/20 text-center text-sm hover:opacity-95 active:scale-95 transition-all"
      >
        Записаться на приём
      </Link>

      {/* Bonus block */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
        <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
        <div>
          <p className="text-xs font-bold text-amber-700">Бонусы MEDAS</p>
          <p className="text-[11px] text-amber-600 mt-0.5">За каждый визит в клинике начисляем бонусы. 1 бонус = 1 рубль при следующей записи.</p>
        </div>
      </div>

      {/* DMS card */}
      {clinic.acceptsDMS && (
        <div className="flex items-center gap-3 p-4 bg-surface-container-lowest rounded-2xl shadow-[0_4px_20px_rgba(0,45,98,0.06)] border border-outline-variant/10">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface">Страхование</p>
            <p className="text-[11px] text-on-surface-variant mt-0.5">Принимаем полисы ДМС крупных компаний</p>
          </div>
        </div>
      )}
    </div>
  );
}

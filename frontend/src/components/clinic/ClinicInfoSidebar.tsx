import Link from "next/link";
import type { Clinic } from "@/lib/clinics";
import AddressMapBlock from "@/components/ui/AddressMapBlock";

export default function ClinicInfoSidebar({ clinic }: { clinic: Clinic }) {
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(clinic.address)}`;

  // Mon=0 … Sun=6 to match scheduleByDay array order
  const todayIdx = (new Date().getDay() + 6) % 7;

  return (
    <div className="sticky top-[110px] max-h-[calc(100vh-126px)] overflow-y-auto space-y-4 [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-outline-variant/40 [&::-webkit-scrollbar-thumb]:rounded-full">

      {/* Map + address + route */}
      <AddressMapBlock
        address={clinic.address}
        phone={clinic.phone}
        metro={clinic.metro}
        mapsUrl={mapsUrl}
      />

      {/* CTA */}
      <Link
        href={`/search?clinic=${clinic.slug}`}
        className="block w-full py-4 bg-secondary text-white font-bold rounded-2xl shadow-lg shadow-secondary/20 text-center text-sm hover:opacity-95 active:scale-95 transition-all"
      >
        Записаться на приём
      </Link>

      {/* 7-day schedule */}
      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,45,98,0.06)] border border-outline-variant/10">
        <div className="px-5 py-3.5 border-b border-surface-container">
          <h3 className="text-sm font-headline font-bold text-on-surface">Расписание</h3>
        </div>
        <div className="divide-y divide-surface-container">
          {clinic.scheduleByDay.map((d, i) => {
            const isToday = i === todayIdx;
            return (
              <div
                key={d.day}
                className={`flex items-center justify-between px-5 py-2.5 ${isToday ? "bg-secondary/8" : "hover:bg-surface-container-low/50"} transition-colors`}
              >
                <div className="flex items-center gap-2">
                  {isToday && (
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0" />
                  )}
                  <span className={`text-xs font-semibold ${isToday ? "text-secondary" : "text-on-surface-variant"} ${!isToday ? "ml-3.5" : ""}`}>
                    {d.day}
                  </span>
                </div>
                <span className={`text-xs font-medium ${d.closed ? "text-on-surface-variant/50" : isToday ? "text-secondary font-bold" : "text-on-surface"}`}>
                  {d.hours}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bonus block */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
        <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold text-amber-700">Бонусы MEDAS</p>
          <p className="text-[11px] text-amber-600 mt-0.5 leading-relaxed">
            +5% от стоимости каждого визита. 1 бонус = 1 ₽ при следующей записи.
          </p>
        </div>
      </div>

      {/* DMS insurance companies */}
      {clinic.acceptsDMS && clinic.insuranceCompanies.length > 0 && (
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,45,98,0.06)] border border-outline-variant/10 space-y-3">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p className="text-xs font-bold text-on-surface">Страховые компании (ДМС)</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {clinic.insuranceCompanies.map((ins) => (
              <span key={ins} className="text-[11px] font-semibold px-2.5 py-1 bg-secondary/8 text-secondary rounded-full">
                {ins}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {clinic.certifications.length > 0 && (
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,45,98,0.06)] border border-outline-variant/10 space-y-2.5">
          <p className="text-xs font-bold text-on-surface">Сертификаты</p>
          {clinic.certifications.map((cert) => (
            <div key={cert} className="flex items-start gap-2">
              <svg className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">{cert}</p>
            </div>
          ))}
        </div>
      )}

      {/* Parking */}
      {clinic.parking && (
        <div className="flex items-center gap-3 p-3.5 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
          <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <p className="text-[11px] text-on-surface-variant">{clinic.parking}</p>
        </div>
      )}
    </div>
  );
}

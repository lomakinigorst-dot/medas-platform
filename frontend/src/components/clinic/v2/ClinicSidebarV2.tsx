import type { Clinic } from "@/lib/clinics";

function StarFilled() {
  return (
    <svg className="w-3 h-3 text-secondary" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default function ClinicSidebarV2({ clinic }: { clinic: Clinic }) {
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(clinic.address)}`;

  return (
    <aside className="space-y-6">

      {/* Map + contacts card */}
      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,45,98,0.06)] border border-outline-variant/10">
        {/* Map placeholder */}
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="block h-48 bg-surface-container relative group overflow-hidden">
          <div className="absolute inset-0 bg-[#e8ecf0] flex items-center justify-center">
            <svg className="w-full h-full opacity-10" viewBox="0 0 400 200" fill="none">
              <rect width="400" height="200" fill="#c3c6d7"/>
              <line x1="0" y1="100" x2="400" y2="100" stroke="#a0a4b8" strokeWidth="1"/>
              <line x1="200" y1="0" x2="200" y2="200" stroke="#a0a4b8" strokeWidth="1"/>
              <line x1="0" y1="50" x2="400" y2="50" stroke="#a0a4b8" strokeWidth="0.5"/>
              <line x1="0" y1="150" x2="400" y2="150" stroke="#a0a4b8" strokeWidth="0.5"/>
              <line x1="100" y1="0" x2="100" y2="200" stroke="#a0a4b8" strokeWidth="0.5"/>
              <line x1="300" y1="0" x2="300" y2="200" stroke="#a0a4b8" strokeWidth="0.5"/>
            </svg>
            <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/15 transition-colors" />
            <div className="absolute bg-white p-3 rounded-full shadow-lg">
              <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          </div>
          <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold text-primary shadow-sm">
            Открыть на карте →
          </div>
        </a>

        {/* Contact info */}
        <div className="p-5 space-y-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <p className="text-xs font-bold text-primary">Адрес</p>
              <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{clinic.address}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <div>
              <p className="text-xs font-bold text-primary">Телефон</p>
              <a href={`tel:${clinic.phone.replace(/\D/g, "")}`} className="text-xs text-on-surface-variant hover:text-primary transition-colors mt-0.5 block">
                {clinic.phone}
              </a>
            </div>
          </div>
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="text-xs font-bold text-primary">Электронная почта</p>
              <a href={`mailto:${clinic.email}`} className="text-xs text-on-surface-variant hover:text-primary transition-colors mt-0.5 block">
                {clinic.email}
              </a>
            </div>
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 bg-primary text-white font-bold rounded-xl text-center text-sm hover:opacity-90 active:scale-95 transition-all"
          >
            Проложить маршрут
          </a>
        </div>
      </div>

      {/* Gallery 2×2 */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,45,98,0.06)] border border-outline-variant/10">
        <h3 className="text-base font-headline font-bold text-primary mb-4">Фотогалерея</h3>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant text-xs font-medium">
              Фото {i}
            </div>
          ))}
          <div className="aspect-square rounded-xl bg-primary/8 flex items-center justify-center cursor-pointer hover:bg-primary/15 transition-colors relative overflow-hidden">
            <div className="text-center">
              <p className="text-2xl font-extrabold text-primary">+{Math.max(0, 12)}</p>
              <p className="text-[10px] font-bold text-primary/70 uppercase tracking-wide">Ещё фото</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews compact */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,45,98,0.06)] border border-outline-variant/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-headline font-bold text-primary">Отзывы</h3>
          <button className="text-xs font-bold text-secondary hover:underline">Смотреть все</button>
        </div>

        {clinic.reviews.length === 0 ? (
          <p className="text-xs text-on-surface-variant text-center py-4">Отзывов пока нет</p>
        ) : (
          <div className="space-y-4">
            {clinic.reviews.slice(0, 2).map((review, i) => (
              <div key={i} className="space-y-1.5 pb-4 border-b border-surface-container last:border-0 last:pb-0">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-on-surface">{review.author}</span>
                  <span className="text-[10px] text-on-surface-variant">{review.date}</span>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => <StarFilled key={s} />)}
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed italic">&ldquo;{review.text}&rdquo;</p>
              </div>
            ))}
          </div>
        )}

        <button className="w-full mt-4 py-2.5 border border-outline-variant rounded-xl text-sm font-bold text-primary hover:bg-surface-container transition-colors">
          Оставить отзыв
        </button>
      </div>
    </aside>
  );
}

type AddressMapBlockProps = {
  address: string;
  phone: string;
  metro?: string;
  mapsUrl: string;
};

export default function AddressMapBlock({ address, phone, metro, mapsUrl }: AddressMapBlockProps) {
  return (
    <div className="rounded-2xl overflow-hidden border border-outline-variant/10 shadow-[0_4px_20px_rgba(0,45,98,0.06)]">
      {/* Map thumbnail */}
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-36 bg-surface-container relative group overflow-hidden"
        aria-label="Открыть в Google Maps"
      >
        {/* Grid background */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.12]" viewBox="0 0 300 144" preserveAspectRatio="xMidYMid slice">
          {[0, 50, 100, 150, 200, 250, 300].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="144" stroke="#43474f" strokeWidth="0.8" />
          ))}
          {[0, 36, 72, 108, 144].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="300" y2={y} stroke="#43474f" strokeWidth="0.8" />
          ))}
          <line x1="0" y1="72" x2="300" y2="72" stroke="#43474f" strokeWidth="3" opacity="0.4" />
          <line x1="150" y1="0" x2="150" y2="144" stroke="#43474f" strokeWidth="2" opacity="0.3" />
          <line x1="60" y1="30" x2="240" y2="90" stroke="#43474f" strokeWidth="2" opacity="0.25" />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          {metro && (
            <span className="text-[11px] font-bold bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-primary shadow-sm">
              🚇 {metro}
            </span>
          )}
          <p className="text-[10px] text-on-surface-variant group-hover:text-primary transition-colors font-medium">
            Открыть в Google Maps →
          </p>
        </div>
      </a>

      {/* Info block */}
      <div className="bg-surface-container-lowest p-4 space-y-3">
        {/* Address */}
        <div className="flex items-start gap-2.5">
          <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-xs text-on-surface-variant leading-relaxed">{address}</p>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2.5">
          <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <a
            href={`tel:${phone.replace(/\D/g, "")}`}
            className="text-xs text-primary font-semibold hover:underline"
          >
            {phone}
          </a>
        </div>

        {/* Route button */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-bold text-primary bg-surface-container hover:bg-surface-container-high rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Проложить маршрут
        </a>
      </div>
    </div>
  );
}

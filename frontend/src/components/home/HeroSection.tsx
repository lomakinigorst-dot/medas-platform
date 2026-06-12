import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="hero-gradient px-6 pb-20 lg:pb-28 pt-10 lg:pt-14">
      <div className="max-w-screen-2xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Heading + Search */}
        <div>
          <h1 className="font-headline text-5xl lg:text-7xl font-extrabold tracking-tighter text-on-surface leading-[1.1] mb-6">
            Медицинская забота,{" "}
            <span className="text-secondary">отобранная</span> для вашей жизни.
          </h1>
          <p className="text-on-surface-variant text-xl mb-10 max-w-xl">
            Ощутите клиническое совершенство через наш высококлассный агрегатор.
            Найдите лучших специалистов и бутик-клиники в вашем районе.
          </p>

          {/* Search Bar */}
          <div className="bg-surface-container-lowest p-2 rounded-xl shadow-xl shadow-blue-900/5 flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 gap-3 bg-surface-container-low rounded-lg focus-within:ring-2 ring-primary/10 transition-all">
              <svg className="w-5 h-5 text-outline flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                className="w-full bg-transparent border-none focus:ring-0 py-4 text-on-surface placeholder:text-outline outline-none"
                placeholder="Симптомы, врачи или клиники..."
                type="text"
              />
            </div>
            <div className="w-full md:w-48 flex items-center px-4 gap-3 bg-surface-container-low rounded-lg focus-within:ring-2 ring-primary/10 transition-all">
              <svg className="w-5 h-5 text-outline flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                className="w-full bg-transparent border-none focus:ring-0 py-4 text-on-surface font-medium outline-none"
                placeholder="Локация"
                type="text"
                defaultValue="Москва"
              />
            </div>
            <button className="btn-primary-gradient text-white px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-transform active:scale-95">
              Поиск
            </button>
          </div>
        </div>

        {/* Right: Doctor image + badge */}
        <div className="relative hidden lg:block">
          <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDq1AZIgGrFEhJgC69aFoT5u_uxpWZ1Nz3-31VxcDuyU9GIAlHjaFYr-rftAGOjaI11K-jDo5QrkCrn1xcK9iMqBAWTnzQzK-D_oMavx2mJRR0WjC5a9RPae7dOTgQLxm6BHVAEQCSLqOviik4GQA3jcEc8nGjI_ZwxLBkV5mXz7MUl6NjYmKQbm3UT2ld6maSvncePIS-HjKLKICeh9-WuWFKobc8PXVCTgbGpN8tEdt6DhMCQ_DWNmO9g_pEHZbzUYYmw4qgy3C2s"
              alt="Врач в клинике"
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-10 -left-10 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 max-w-xs">
            <div className="flex gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="font-headline font-bold text-on-surface">5,000+ Доверенных клиник</p>
            <p className="text-sm text-on-surface-variant">Экспертный подход к выбору поставщиков медицинских услуг.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

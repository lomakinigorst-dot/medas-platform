import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";

const doctors = [
  { name: "Д-р Александр Волков", specialty: "Кардиолог • Стаж 15 лет", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjjxhEceHNxav0dTw2fbf-t7NvOTzuP8PSEDL8VURASVhQMziRNdfKtpyfOxxkXXI_sxsBX0CIBAtQuhx_bfsgHzahrENH0bXUYTufWZ7nodvamL4uueyhN4qAlU7-621T9zwP7bPtfHxFl7OBgyf3d0kRMAZOLWttvPrm43-k3tD2y2_YE2nQIRzjy0ary-7aM14Od2cHuGV0XgrjwRRlXMqW-jTwWFNe5V5PUljtyseOJMiTrxc3gAS2STdzIj7GYBOxNxr5JKql" },
  { name: "Д-р Елена Соколова", specialty: "Невролог • Стаж 12 лет", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBV4pmTX1W5jehIt8v_2CebZTeLnST8RGjgmI4MdhJC71hTedEUvI19cCHWhnkVprcbeTJ_Xp3ZyE9WnsFQVw6Vt3-3RhnNxTV3ZmTiFoD5Mo91TVVjKdztefwlojBqdBD1BPqBqVLEQ-6LET9aQ7IkbLniNDbgJHmW_tPKTxCQAVaq2pprt4ahn4rId0t0U7qPfpzAmnWVTfZDVfnfrUFyDsMEfG7Kc2FBqINndwild2Ld3FESDgBta7WRkMXpf2UxsepqSVzlQmzb" },
];

export default function ClinicProfilePage() {
  return (
    <>
      <Header />
      <main className="pt-20 lg:pt-[110px] pb-20 max-w-7xl mx-auto px-8">
        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#00a982] font-bold tracking-widest text-xs uppercase">
                <span>✓</span> Премиум Клиника
              </div>
              <h1 className="text-5xl font-extrabold tracking-tighter text-[#002D62] font-[family-name:var(--font-manrope)]">
                Центр Современной Медицины
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-[#434655]">
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span className="text-sm font-medium">ул. Александра Пушкина, 14, Москва</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#00a982]">★</span>
                  <span className="text-sm font-bold text-[#191c1e]">4.9</span>
                  <span className="text-xs text-[#434655]">(1,240 отзывов)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🕐</span>
                  <span className="text-sm font-medium">08:00 – 21:00</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/doctor/volkov/booking" className="px-8 py-4 bg-[#002D62] text-white font-bold rounded-lg shadow-lg hover:opacity-90 active:scale-95 transition-all">
                Записаться на прием
              </Link>
              <button className="p-4 rounded-lg bg-[#eceef0] text-[#002D62] active:scale-95 transition-all hover:bg-[#e6e8ea]">
                🔗
              </button>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-8 space-y-12">
            {/* About */}
            <div className="bg-white rounded-xl p-8 border border-[#c3c6d7]/10 shadow-sm">
              <h2 className="text-2xl font-bold tracking-tight text-[#002D62] mb-6 font-[family-name:var(--font-manrope)]">О клинике</h2>
              <p className="text-[#434655] leading-relaxed mb-6">
                Центр Современной Медицины — это пространство, где высокие технологии встречаются с человеческой заботой. Мы создали клиническую среду, ориентированную на пациента, предлагая полный спектр диагностических и лечебных услуг в одном месте.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { num: "25+", label: "Специализаций" },
                  { num: "150+", label: "Врачей" },
                  { num: "12к+", label: "Пациентов в год" },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 rounded-lg bg-[#f2f4f6] border-l-4 border-[#00a982]">
                    <div className="text-2xl font-extrabold text-[#002D62]">{stat.num}</div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#434655]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Doctors */}
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-[#002D62] font-[family-name:var(--font-manrope)]">Наши специалисты</h2>
                <Link href="/search" className="text-sm font-bold text-[#00a982] flex items-center gap-1 hover:underline">
                  Все врачи →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {doctors.map((doc) => (
                  <div key={doc.name} className="bg-white rounded-xl p-6 flex gap-6 border border-[#c3c6d7]/10 shadow-sm group">
                    <div className="relative w-24 h-24 shrink-0 -mt-8">
                      <Image src={doc.image} alt={doc.name} fill className="object-cover rounded-xl shadow-md" />
                      <div className="absolute -bottom-2 -right-2 bg-[#00a982] text-white text-[10px] font-bold px-2 py-1 rounded-full">Top</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#002D62] group-hover:text-[#00a982] transition-colors">{doc.name}</h3>
                      <p className="text-xs text-[#434655] mb-4">{doc.specialty}</p>
                      <button className="w-full py-2 bg-[#e3fcef] text-[#006644] text-xs font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all">
                        Выбрать время
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#002D62] mb-8 font-[family-name:var(--font-manrope)]">Фото клиники</h2>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-32 rounded-xl bg-[#eceef0] flex items-center justify-center text-[#737686] text-sm">
                    Фото {i}
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#002D62] mb-8 font-[family-name:var(--font-manrope)]">Услуги и направления</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {["Кардиология", "Неврология", "Гастроэнтерология", "Офтальмология", "Дерматология", "УЗИ диагностика", "МРТ", "Лабораторные анализы", "Вакцинация"].map((svc) => (
                  <div key={svc} className="p-4 bg-white rounded-xl border border-[#c3c6d7]/10 shadow-sm hover:border-[#003087]/30 transition-colors cursor-pointer">
                    <p className="font-semibold text-sm text-[#002D62]">{svc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#002D62] mb-8 font-[family-name:var(--font-manrope)]">Отзывы</h2>
              <div className="space-y-4">
                {["Отличная клиника, внимательный персонал, современное оборудование.", "Быстро записали, врач очень профессиональный. Рекомендую!"].map((text, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl border border-[#c3c6d7]/10 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#e3fcef] text-[#006644] flex items-center justify-center font-bold">А</div>
                      <div>
                        <p className="font-bold text-sm">Анна К.</p>
                        <p className="text-xs text-[#434655]">2 дня назад</p>
                      </div>
                      <div className="ml-auto text-amber-500 text-sm">★★★★★</div>
                    </div>
                    <p className="text-sm text-[#434655] italic">&ldquo;{text}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white rounded-xl p-6 border border-[#c3c6d7]/10 shadow-sm space-y-4">
                <h3 className="font-bold text-[#002D62] font-[family-name:var(--font-manrope)]">Информация</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#434655]">Адрес</span>
                    <span className="font-semibold text-right">ул. Александра Пушкина, 14</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#434655]">Телефон</span>
                    <span className="font-semibold">+7 (495) 123-45-67</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#434655]">Пн – Пт</span>
                    <span className="font-semibold">08:00 – 21:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#434655]">Сб – Вс</span>
                    <span className="font-semibold">09:00 – 18:00</span>
                  </div>
                </div>
                <Link href="/search" className="block w-full py-3 bg-[#002D62] text-white font-bold rounded-lg text-center text-sm hover:opacity-90 transition-all">
                  Записаться на прием
                </Link>
              </div>

              <div className="bg-[#e3fcef] rounded-xl p-5 border border-[#00a982]/20">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">🏆</span>
                  <p className="font-bold text-[#006644] text-sm">Аккредитованная клиника</p>
                </div>
                <p className="text-xs text-[#434655]">Все врачи прошли верификацию. Оборудование сертифицировано.</p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-[#c3c6d7]/10 shadow-sm">
                <p className="font-bold text-[#002D62] text-sm mb-3">ДМС и страхование</p>
                <div className="flex flex-wrap gap-2">
                  {["АльфаСтрахование", "СОГАЗ", "ВТБ Страхование", "Ингосстрах"].map((ins) => (
                    <span key={ins} className="px-2 py-1 bg-[#f2f4f6] text-xs font-medium rounded">{ins}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

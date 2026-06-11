import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";

export default function DoctorProfilePage({ params }: { params: { slug: string } }) {
  return (
    <>
      <Header />
      <main className="pt-24 pb-20 max-w-screen-2xl mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 text-sm text-[#434655]">
          <Link href="/search" className="hover:text-[#003087]">Поиск</Link>
          <span>›</span>
          <Link href="/search?specialty=cardiology" className="hover:text-[#003087]">Кардиология</Link>
          <span>›</span>
          <span className="font-medium text-[#191c1e]">Д-р Джулианна Стерлинг</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            {/* Hero */}
            <section className="flex flex-col md:flex-row gap-8 items-start">
              <div className="relative w-48 h-48 flex-shrink-0">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDEuWj7FQdk1mrMMYIsic7qhPY1GoZo3F_KPpf8u7H0j6nWuPSi1dsHIsqb6U-JDBfqyWnGT-p5kd9bz5wZPAkmXsVvHB_fRF_tfNOy1gsNhqkTzfUsXKw9D9nVa7GsDSQl16dU_L1NdwHGeIcYjGiGYr9tPkFkrJ5xEFWiDyXDHE6-zkHuqF4EGaoxhqF0IO3sWI2NEAw0X1KvAnkhF1oVU_9CzHjpnj_wo1jpD9YNSXz2-Y2ffjLkdQAT_c_YpCBIk9ZqLdjjDxU"
                  alt="Д-р Джулианна Стерлинг"
                  fill
                  className="object-cover rounded-2xl shadow-lg border-4 border-white"
                />
                <div className="absolute -bottom-2 -right-2 bg-[#00a982] text-white p-2 rounded-full shadow-md flex items-center justify-center">
                  <span className="text-lg">✓</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-[#00a982] text-white text-[10px] font-bold rounded uppercase tracking-wider">Топ рейтинг 2024</span>
                  <span className="px-3 py-1 bg-[#e6e8ea] text-[#434655] text-[10px] font-bold rounded uppercase">Опыт 12+ лет</span>
                </div>
                <h1 className="text-4xl font-extrabold font-[family-name:var(--font-manrope)] tracking-tight text-[#191c1e]">
                  Д-р Джулианна Стерлинг, MD
                </h1>
                <p className="text-xl text-[#003087] font-semibold">Интервенционный кардиолог и специалист по ритму сердца</p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500">★</span>
                    <span className="font-bold text-lg">4.9</span>
                    <span className="text-[#434655] text-sm">(1,240 отзывов)</span>
                  </div>
                  <div className="h-4 w-px bg-[#c3c6d7]/30"></div>
                  <span className="text-sm text-[#434655]">🌐 Английский, Испанский, Французский</span>
                </div>
              </div>
            </section>

            {/* Biography */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold font-[family-name:var(--font-manrope)] border-l-4 border-[#00a982] pl-4">Профессиональная биография</h2>
              <div className="bg-white p-8 rounded-2xl leading-relaxed text-[#434655] shadow-sm border border-[#c3c6d7]/10">
                Д-р Джулианна Стерлинг — всемирно известный интервенционный кардиолог, специализирующийся на малоинвазивных процедурах на сердце и сложном управлении ритмом. Имея более чем десятилетний опыт работы в Институте сердца Метрополитен, она стала пионером в методах транскатетерной замены аортального клапана (TAVR). Её подход, ориентированный на пациента, обеспечивает превосходное медицинское обслуживание.
              </div>
            </section>

            {/* Education & Specializations */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-[#c3c6d7]/10 space-y-4">
                <div className="flex items-center gap-3 text-[#003087]">
                  <span className="text-lg">🎓</span>
                  <h3 className="font-bold font-[family-name:var(--font-manrope)]">Образование и подготовка</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    { degree: "Медицинская школа Джонса Хопкинса", sub: "Доктор медицины (MD)" },
                    { degree: "Высшая школа клиники Майо", sub: "Ординатура по сердечно-сосудистым заболеваниям" },
                  ].map((edu) => (
                    <li key={edu.degree} className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-[#00a982] flex-shrink-0"></div>
                      <div>
                        <p className="font-bold text-sm">{edu.degree}</p>
                        <p className="text-xs text-[#434655]">{edu.sub}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-[#c3c6d7]/10 space-y-4">
                <div className="flex items-center gap-3 text-[#00a982]">
                  <span className="text-lg">🏥</span>
                  <h3 className="font-bold font-[family-name:var(--font-manrope)]">Клинические специализации</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Сердечная недостаточность", "Ангиопластика", "Эхокардиография", "Лечение гипертонии", "Аритмия"].map((s) => (
                    <span key={s} className="px-3 py-1.5 bg-[#e3fcef] text-[#006644] text-xs font-bold rounded-lg">{s}</span>
                  ))}
                </div>
              </div>
            </section>

            {/* Clinic Info */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-manrope)] border-l-4 border-[#00a982] pl-4">Информация о клинике</h2>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-[#c3c6d7]/10 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-[#eceef0] overflow-hidden">
                      <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnsw9D9e2ss0YXOOSSzGFgX-CA0C0_UlOYoQIUbyeAgNxXTkkLgieoKkt5g8w9Rl87NlyFKhVGtfbpqx7FLFKyhX1U6kmHdmEfsdDWSKkaB-LPAflanCCHWfy7KVPgmceorhLQ-6r4Kdy371pogOFNN3CFufqiu4SF1MkBpLuWVgwcwCC_Qed26-FoKraSLa2vVDSsCZowhMos-oYR3KjQu-eeL6K2WgE65WaDhnTpSE1NEwKqFA-b2xO7faVCj_fS-_v6AWRiFj_y" alt="Клиника" width={64} height={64} className="object-cover w-full h-full" />
                    </div>
                    <div>
                      <p className="font-bold text-[#003087]">Институт сердца Метрополитен</p>
                      <p className="text-sm text-[#434655]">Главный медицинский центр, офис 400</p>
                    </div>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#434655]">Пн - Пт</span>
                      <span className="font-semibold">08:00 – 18:00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#434655]">Суббота</span>
                      <span className="font-semibold">09:00 – 13:00</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-full min-h-[250px] rounded-2xl overflow-hidden bg-[#e6e8ea] relative border border-[#c3c6d7]/10 shadow-sm flex items-center justify-center">
                <div className="text-center text-[#434655]">
                  <div className="w-12 h-12 bg-[#003087] rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-xl">📍</span>
                  </div>
                  <p className="text-sm font-medium">ул. Академика Сахарова, 12</p>
                  <p className="text-xs text-[#737686]">Москва</p>
                </div>
              </div>
            </section>

            {/* Reviews */}
            <section className="space-y-8">
              <div className="flex justify-between items-end">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-manrope)] border-l-4 border-[#00a982] pl-4">Отзывы пациентов</h2>
                <button className="text-[#00a982] font-bold text-sm hover:underline">Все 1,240 отзывов</button>
              </div>
              <div className="space-y-4">
                {[
                  { name: "Сара Митчелл", init: "СМ", time: "2 дня назад", stars: 5, text: "Д-р Стерлинг была невероятно внимательна. Она уделила время, чтобы объяснить мою процедуру так, что все мои тревоги исчезли. Рекомендую всем, кому нужна кардиологическая помощь." },
                  { name: "Роберт Хейнс", init: "РХ", time: "1 неделю назад", stars: 4, text: "Профессиональный персонал и минимальное время ожидания. Клиника безупречно чистая и современная." },
                ].map((review) => (
                  <div key={review.name} className="p-6 bg-white rounded-2xl shadow-sm border border-[#c3c6d7]/10">
                    <div className="flex justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#e3fcef] text-[#006644] flex items-center justify-center font-bold">{review.init}</div>
                        <div>
                          <p className="font-bold text-sm">{review.name}</p>
                          <p className="text-xs text-[#434655]">{review.time}</p>
                        </div>
                      </div>
                      <div className="text-amber-500">{"★".repeat(review.stars)}</div>
                    </div>
                    <p className="text-[#434655] text-sm italic">&ldquo;{review.text}&rdquo;</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Booking Widget */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 overflow-hidden border border-[#c3c6d7]/10">
                <div className="bg-[#003087] p-6 text-white">
                  <h3 className="text-xl font-bold font-[family-name:var(--font-manrope)]">Запись на прием</h3>
                  <p className="text-xs opacity-90 mt-1">Ближайшее время: Завтра в 10:30</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Calendar */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <span className="font-bold text-sm">Октябрь 2024</span>
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-slate-100 rounded-lg text-sm">‹</button>
                        <button className="p-1 hover:bg-slate-100 rounded-lg text-sm">›</button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 text-center text-[10px] font-bold text-[#434655] mb-2">
                      {["ПН","ВТ","СР","ЧТ","ПТ","СБ","ВС"].map((d) => <span key={d}>{d}</span>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      <span className="p-2 text-slate-300">30</span>
                      {Array.from({ length: 13 }, (_, i) => i + 1).map((d) => (
                        <button key={d} className={`p-2 rounded-lg transition-colors ${d === 4 ? "bg-[#00a982] text-white font-bold shadow-sm" : "hover:bg-[#e3fcef]"}`}>{d}</button>
                      ))}
                    </div>
                  </div>
                  {/* Time Slots */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-[#434655] uppercase tracking-wider">Доступное время</p>
                    <div className="grid grid-cols-3 gap-2">
                      {["09:00","10:30","11:45","14:00","15:30","16:45"].map((t) => (
                        <button key={t} className={`py-2.5 text-xs font-semibold rounded-lg transition-colors ${t === "10:30" ? "bg-[#00a982] text-white border border-[#00a982] shadow-sm" : "bg-[#e6e8ea] hover:bg-[#e3fcef]"}`}>{t}</button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[#c3c6d7]/10 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#434655]">Стоимость консультации</span>
                      <span className="font-bold text-[#003087]">15 500 ₽</span>
                    </div>
                    <Link href={`/doctor/${params.slug}/booking`} className="block w-full py-4 bg-[#00a982] text-white font-bold rounded-xl shadow-lg text-center hover:opacity-90 active:scale-95 transition-all">
                      Подтвердить запись
                    </Link>
                    <p className="text-[10px] text-center text-[#434655]">Предоплата не требуется. Действует политика отмены.</p>
                  </div>
                </div>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-[#c3c6d7]/10 flex items-center gap-4 shadow-sm">
                <span className="text-2xl text-[#00a982]">🛡</span>
                <div>
                  <p className="font-bold text-xs">Страхование</p>
                  <p className="text-[11px] text-[#434655]">Принимаем полисы ДМС крупных компаний</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

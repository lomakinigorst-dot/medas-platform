import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";

export default function BookingPage({ params }: { params: { slug: string } }) {
  return (
    <>
      <Header />
      <main className="pt-20 lg:pt-[110px] pb-20 max-w-screen-2xl mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 text-sm text-[#434655]">
          <Link href="/search" className="hover:text-[#003087]">Поиск</Link>
          <span>›</span>
          <Link href={`/doctor/${params.slug}`} className="hover:text-[#003087]">Д-р Александр Волков</Link>
          <span>›</span>
          <span className="font-medium text-[#191c1e]">Запись на приём</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Doctor + Booking Form */}
          <div className="lg:col-span-8 space-y-8">
            {/* Doctor Card */}
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-[#c3c6d7]/10">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="relative w-32 h-40 rounded-2xl overflow-hidden flex-shrink-0">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcCJKJMo7cyziXbkmQMPDzekwjh1BVD6YEPOezlSrwg1jqrdz6LbsYWRRc2qRAhrXBWpQ3Y08WmUgPDmBqx8dIcXKuP_-l05d-S-pWuQPTx2vMXSGGgHUQVCj3-3F03174TB8N69_9BPaKdW8ASe0WrP4YYcEAkOFb_ut0_b07YEewtQnwxFi5_SDt0JyKRcJrBD7lMryoB_3BbJXoXofvEis_Fywzc6ZX38xrGx6WdFj9DtazLQRUhEnImnW6cRlu5YBtxvbvg0we"
                    alt="Д-р Александр Волков"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                    <span className="bg-[#00a982] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase">Доступен</span>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-[#003087] font-[family-name:var(--font-manrope)]">Д-р Александр Волков</h1>
                    <p className="text-[#00a982] font-semibold uppercase tracking-widest text-[11px] mt-1">Старший кардиолог • Стаж 14 лет</p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 bg-[#f2f4f6] px-4 py-2 rounded-xl">
                      <span className="text-amber-500">★</span>
                      <span className="font-bold text-[#003087]">4.9</span>
                      <span className="text-[#434655] text-sm">(128 отзывов)</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#f2f4f6] px-4 py-2 rounded-xl">
                      <span className="text-[#003087]">✓</span>
                      <span className="text-[#434655] text-sm font-medium">Проверенный специалист</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Date & Time Selection */}
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-[#c3c6d7]/10 space-y-6">
              <h2 className="text-xl font-bold font-[family-name:var(--font-manrope)] text-[#003087]">Выберите дату и время</h2>
              {/* Calendar */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">Ноябрь 2024</span>
                  <div className="flex gap-2">
                    <button className="p-1 hover:bg-slate-100 rounded-lg text-sm">‹</button>
                    <button className="p-1 hover:bg-slate-100 rounded-lg text-sm">›</button>
                  </div>
                </div>
                <div className="grid grid-cols-7 text-center text-[10px] font-bold text-[#434655]">
                  {["ПН","ВТ","СР","ЧТ","ПТ","СБ","ВС"].map((d) => <span key={d} className="pb-2">{d}</span>)}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                    <button key={d} className={`p-2.5 rounded-lg transition-colors ${d === 7 ? "bg-[#003087] text-white font-bold" : d < 5 ? "text-slate-300 cursor-not-allowed" : "hover:bg-[#e3fcef] hover:text-[#006644]"}`}>{d}</button>
                  ))}
                </div>
              </div>
              {/* Time Slots */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-[#434655] uppercase tracking-wider">Доступное время 7 ноября</p>
                <div className="grid grid-cols-4 gap-3">
                  {["09:00","10:00","11:00","12:00","14:00","15:00","16:00","17:00"].map((t) => (
                    <button key={t} className={`py-3 text-sm font-semibold rounded-xl transition-colors ${t === "10:00" ? "bg-[#003087] text-white shadow-lg" : "bg-[#f2f4f6] hover:bg-[#e3fcef] hover:text-[#006644]"}`}>{t}</button>
                  ))}
                </div>
              </div>
            </section>

            {/* Appointment Type */}
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-[#c3c6d7]/10 space-y-4">
              <h2 className="text-xl font-bold font-[family-name:var(--font-manrope)] text-[#003087]">Тип приёма</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: "🏥", title: "В клинике", desc: "Институт сердца Метрополитен", price: "4 500 ₽", selected: true },
                  { icon: "📱", title: "Онлайн", desc: "Видеоконсультация", price: "3 200 ₽", selected: false },
                ].map((type) => (
                  <div key={type.title} className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${type.selected ? "border-[#003087] bg-[#003087]/5" : "border-[#c3c6d7]/30 hover:border-[#003087]/30"}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{type.icon}</span>
                      <div>
                        <p className="font-bold text-sm">{type.title}</p>
                        <p className="text-xs text-[#434655]">{type.desc}</p>
                      </div>
                    </div>
                    <p className="text-lg font-extrabold text-[#003087]">{type.price}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Comment */}
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-[#c3c6d7]/10 space-y-4">
              <h2 className="text-xl font-bold font-[family-name:var(--font-manrope)] text-[#003087]">Комментарий к записи</h2>
              <textarea
                rows={4}
                placeholder="Опишите жалобы или вопросы к врачу..."
                className="w-full rounded-xl bg-[#f2f4f6] border-none p-4 text-sm focus:ring-2 focus:ring-[#003087]/20 resize-none"
              />
            </section>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              {/* Bonus Card */}
              <div className="bg-gradient-to-br from-[#003087] to-[#1e40af] p-6 rounded-2xl text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🎁</span>
                  </div>
                  <div>
                    <p className="font-bold">Бонусы MEDAS</p>
                    <p className="text-xs opacity-80">За каждую запись</p>
                  </div>
                </div>
                <p className="text-3xl font-extrabold mb-1">+450 <span className="text-lg font-bold opacity-80">баллов</span></p>
                <p className="text-xs opacity-70">Начислим после состоявшегося приёма</p>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-xs opacity-80">Ваш текущий баланс: <span className="font-bold">1,230 баллов</span></p>
                  <div className="mt-2 h-2 bg-white/20 rounded-full">
                    <div className="h-2 bg-[#00a982] rounded-full w-2/3"></div>
                  </div>
                  <p className="text-[10px] opacity-60 mt-1">270 баллов до следующего уровня</p>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#c3c6d7]/10 space-y-5">
                <h3 className="font-bold font-[family-name:var(--font-manrope)] text-[#191c1e]">Итог записи</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-[#434655]">Врач</span><span className="font-semibold">Д-р А. Волков</span></div>
                  <div className="flex justify-between"><span className="text-[#434655]">Дата</span><span className="font-semibold">7 ноября 2024</span></div>
                  <div className="flex justify-between"><span className="text-[#434655]">Время</span><span className="font-semibold">10:00</span></div>
                  <div className="flex justify-between"><span className="text-[#434655]">Тип</span><span className="font-semibold">В клинике</span></div>
                  <div className="border-t border-[#c3c6d7]/20 pt-3 flex justify-between">
                    <span className="font-bold">Стоимость</span>
                    <span className="font-extrabold text-[#003087] text-lg">4 500 ₽</span>
                  </div>
                  <div className="flex justify-between text-[#00a982]">
                    <span className="font-semibold text-xs">Бонусы к начислению</span>
                    <span className="font-bold text-xs">+450 баллов</span>
                  </div>
                </div>
                <button className="w-full py-4 bg-[#00a982] text-white font-bold rounded-xl shadow-lg shadow-[#00a982]/20 hover:opacity-90 active:scale-95 transition-all">
                  Подтвердить запись
                </button>
                <p className="text-[10px] text-center text-[#434655]">Нажимая «Подтвердить», вы соглашаетесь с условиями использования сервиса</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

import CabinetLayout from "@/components/layout/CabinetLayout";
import PatientHeroGreeting from "@/components/cabinet/PatientHeroGreeting";
import Link from "next/link";

const navItems = [
  { href: "/cabinet/patient", icon: "🏠", label: "Главная" },
  { href: "/cabinet/patient/appointments", icon: "📅", label: "Приёмы" },
  { href: "/cabinet/patient/medcard", icon: "📋", label: "Медкарта" },
  { href: "/cabinet/patient/family", icon: "👨‍👩‍👧", label: "Семейный профиль" },
  { href: "/cabinet/patient/bonuses", icon: "🎁", label: "Бонусы" },
  { href: "/cabinet/patient/favorites", icon: "❤️", label: "Избранные врачи" },
];

const appointments = [
  { doctor: "Д-р Александр Волков", specialty: "Кардиолог", date: "7 ноября", time: "10:00", clinic: "Институт сердца", status: "upcoming" },
  { doctor: "Д-р Елена Соколова", specialty: "Невролог", date: "12 ноября", time: "14:30", clinic: "МедЦентр", status: "upcoming" },
  { doctor: "Д-р Сара Чэнь", specialty: "Невролог", date: "23 октября", time: "11:00", clinic: "МедЦентр", status: "done" },
];

export default function PatientCabinetPage() {
  return (
    <CabinetLayout
      role="patient"
      userName="Алекс Стерлинг"
      userSubtitle="Управление здоровьем"
      navItems={navItems}
      headerTitle="Обзор здоровья"
    >
      {/* Hero Stats */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        <div className="lg:col-span-8 bg-gradient-to-br from-[#003087] to-[#1e40af] p-8 rounded-[2rem] text-white relative overflow-hidden flex flex-col justify-between min-h-[240px]">
          <div className="relative z-10">
            <PatientHeroGreeting />
            <p className="text-white/80 max-w-md text-sm">
              У вас 2 запланированных приёма на этой неделе. Не забудьте заполнить анкету перед визитом.
            </p>
          </div>
          <div className="relative z-10 mt-6 flex gap-4">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl">
              <p className="text-[10px] uppercase font-bold tracking-widest text-white/70">Последний осмотр</p>
              <p className="text-lg font-bold">12 окт 2024</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl">
              <p className="text-[10px] uppercase font-bold tracking-widest text-white/70">Индекс здоровья</p>
              <p className="text-lg font-bold">92/100</p>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#00a982]/20 rounded-full blur-3xl"></div>
          <div className="absolute right-10 top-5 opacity-10 text-9xl">🏥</div>
        </div>

        <div className="lg:col-span-4 bg-white p-6 rounded-[2rem] shadow-sm flex flex-col justify-center border border-[#eceef0]">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ближайшее событие</span>
            <span className="text-[#00a982]">📈</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#ffdad6] rounded-2xl flex items-center justify-center">
              <span className="text-xl">💊</span>
            </div>
            <div>
              <h4 className="font-bold text-[#191c1e]">Прием лекарств</h4>
              <p className="text-sm text-[#434655]">Лизиноприл 10мг</p>
              <p className="text-xs text-[#00a982] font-semibold mt-1">Принять сегодня в 20:00</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Appointments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#191c1e] font-[family-name:var(--font-manrope)]">Предстоящие приёмы</h3>
            <Link href="/cabinet/patient/appointments" className="text-xs font-bold text-[#003087] hover:underline">Все приёмы</Link>
          </div>
          <div className="space-y-4">
            {appointments.map((apt, i) => (
              <div key={i} className={`bg-white rounded-2xl p-6 border ${apt.status === "upcoming" ? "border-[#003087]/20" : "border-[#c3c6d7]/10"} shadow-sm`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#f2f4f6] flex items-center justify-center text-xl">
                      {apt.status === "upcoming" ? "📅" : "✅"}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#191c1e]">{apt.doctor}</h4>
                      <p className="text-sm text-[#434655]">{apt.specialty} • {apt.clinic}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-[#191c1e]">{apt.date}</p>
                    <p className="text-xs text-[#434655]">{apt.time}</p>
                  </div>
                </div>
                {apt.status === "upcoming" && (
                  <div className="flex gap-3 mt-4 pt-4 border-t border-[#c3c6d7]/10">
                    <button className="flex-1 py-2 bg-[#003087] text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all">Подтвердить</button>
                    <button className="flex-1 py-2 bg-[#f2f4f6] text-[#434655] text-xs font-bold rounded-lg hover:bg-[#e6e8ea] transition-all">Перенести</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Link href="/search" className="block w-full py-4 bg-[#003087] text-white font-bold rounded-2xl text-center shadow-lg hover:opacity-90 transition-all">
            Записаться на новый приём
          </Link>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Bonuses Widget */}
          <div className="bg-gradient-to-br from-[#00a982] to-[#006644] p-6 rounded-2xl text-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold">Бонусы MEDAS</span>
              <Link href="/cabinet/patient/bonuses" className="text-xs text-white/70 hover:text-white">Детали →</Link>
            </div>
            <p className="text-4xl font-extrabold mb-1">1 230</p>
            <p className="text-white/70 text-xs mb-4">доступных баллов</p>
            <div className="h-2 bg-white/20 rounded-full">
              <div className="h-2 bg-white rounded-full w-3/4"></div>
            </div>
            <p className="text-xs text-white/60 mt-2">270 баллов до Gold уровня</p>
          </div>

          {/* Health Score */}
          <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/10 shadow-sm">
            <h4 className="font-bold text-[#191c1e] mb-4 font-[family-name:var(--font-manrope)]">Показатели здоровья</h4>
            <div className="space-y-4">
              {[
                { label: "Давление", value: "120/80", status: "norm", icon: "❤️" },
                { label: "Вес", value: "75 кг", status: "norm", icon: "⚖️" },
                { label: "Пульс", value: "72 уд/мин", status: "norm", icon: "💓" },
              ].map((metric) => (
                <div key={metric.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{metric.icon}</span>
                    <span className="text-sm text-[#434655]">{metric.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{metric.value}</span>
                    <span className="text-xs text-[#00a982] font-bold">✓ Норма</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Doctors */}
          <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/10 shadow-sm">
            <h4 className="font-bold text-[#191c1e] mb-4 font-[family-name:var(--font-manrope)]">Рекомендуемые врачи</h4>
            <div className="space-y-3">
              {[
                { name: "Д-р Волков", specialty: "Кардиолог", rating: "4.9" },
                { name: "Д-р Соколова", specialty: "Невролог", rating: "4.8" },
              ].map((doc) => (
                <div key={doc.name} className="flex items-center justify-between py-2 border-b border-[#c3c6d7]/10 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#dbe1ff] text-[#003087] flex items-center justify-center font-bold text-xs">
                      {doc.name.charAt(3)}
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-[#191c1e]">{doc.name}</p>
                      <p className="text-[10px] text-[#434655]">{doc.specialty}</p>
                    </div>
                  </div>
                  <Link href="/search" className="text-xs bg-[#003087] text-white px-3 py-1 rounded-lg font-bold hover:opacity-90 transition-all">
                    Записать
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CabinetLayout>
  );
}

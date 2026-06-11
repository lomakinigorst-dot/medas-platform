import CabinetLayout from "@/components/layout/CabinetLayout";

const navItems = [
  { href: "/cabinet/doctor", icon: "🏠", label: "Главная" },
  { href: "/cabinet/doctor/schedule", icon: "📅", label: "Расписание" },
  { href: "/cabinet/doctor/appointments", icon: "📋", label: "Приёмы" },
  { href: "/cabinet/doctor/patients", icon: "👥", label: "Пациенты" },
  { href: "/cabinet/doctor/profile", icon: "👤", label: "Мой профиль" },
];

const todaySlots = [
  { time: "09:00", patient: "Анна Козлова", type: "Первичный приём", status: "confirmed" },
  { time: "10:00", patient: "Сергей Митин", type: "Повторный приём", status: "confirmed" },
  { time: "11:00", patient: "—", type: "Свободно", status: "free" },
  { time: "12:00", patient: "Обед", type: "—", status: "break" },
  { time: "14:00", patient: "Ольга Петрова", type: "Кардиограмма", status: "confirmed" },
  { time: "15:00", patient: "Иван Дмитриев", type: "Первичный приём", status: "new" },
  { time: "16:00", patient: "—", type: "Свободно", status: "free" },
  { time: "17:00", patient: "Мария Иванова", type: "Эхокардиография", status: "confirmed" },
];

const week = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const weekData = [8, 6, 9, 7, 5, 3, 0];

export default function DoctorCabinetPage() {
  return (
    <CabinetLayout
      role="doctor"
      userName="Д-р Александр Волков"
      userSubtitle="Кардиолог"
      navItems={navItems}
      headerTitle="Управление расписанием"
    >
      {/* Today's Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Приёмов сегодня", value: "6", icon: "📅", color: "bg-[#003087] text-white" },
          { label: "Свободных слотов", value: "2", icon: "⏰", color: "bg-[#e3fcef] text-[#006644]" },
          { label: "Новых заявок", value: "3", icon: "🔔", color: "bg-amber-50 text-amber-700" },
          { label: "Рейтинг", value: "4.9 ★", icon: "⭐", color: "bg-[#dbe1ff] text-[#003087]" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/10 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-extrabold text-[#191c1e] mb-1">{stat.value}</p>
            <p className="text-xs text-[#434655]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today Schedule */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#c3c6d7]/10 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-[#f2f4f6]">
            <h3 className="font-bold text-[#191c1e] font-[family-name:var(--font-manrope)]">Расписание на сегодня — 7 ноября</h3>
            <button className="text-xs font-bold text-[#003087] bg-[#dbe1ff]/30 px-3 py-1.5 rounded-lg hover:bg-[#dbe1ff]/50 transition-all">
              + Добавить слот
            </button>
          </div>
          <div className="divide-y divide-[#f2f4f6]">
            {todaySlots.map((slot) => (
              <div key={slot.time} className={`flex items-center gap-4 px-6 py-4 transition-colors ${slot.status === "new" ? "bg-amber-50" : slot.status === "break" ? "bg-[#f7f9fb]" : "hover:bg-[#f7f9fb]"}`}>
                <div className="w-14 text-center">
                  <span className="font-bold text-sm text-[#003087]">{slot.time}</span>
                </div>
                <div className={`w-2 h-8 rounded-full flex-shrink-0 ${
                  slot.status === "confirmed" ? "bg-[#00a982]" :
                  slot.status === "new" ? "bg-amber-400" :
                  slot.status === "free" ? "bg-[#c3c6d7]" :
                  "bg-[#eceef0]"
                }`}></div>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${slot.status === "free" || slot.status === "break" ? "text-[#737686]" : "text-[#191c1e]"}`}>
                    {slot.patient}
                  </p>
                  <p className="text-xs text-[#434655]">{slot.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  {slot.status === "new" && (
                    <>
                      <button className="px-3 py-1.5 bg-[#003087] text-white text-xs font-bold rounded-lg hover:opacity-90">Принять</button>
                      <button className="px-3 py-1.5 bg-[#f2f4f6] text-[#434655] text-xs font-bold rounded-lg hover:bg-[#e6e8ea]">Отклонить</button>
                    </>
                  )}
                  {slot.status === "confirmed" && (
                    <button className="px-3 py-1.5 bg-[#f2f4f6] text-[#434655] text-xs font-bold rounded-lg hover:bg-[#e6e8ea]">Детали</button>
                  )}
                  {slot.status === "free" && (
                    <span className="text-xs text-[#737686]">Свободно</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Weekly Overview */}
          <div className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/10 shadow-sm">
            <h3 className="font-bold text-[#191c1e] font-[family-name:var(--font-manrope)] mb-4">Неделя</h3>
            <div className="flex items-end gap-2 h-20 mb-3">
              {week.map((day, i) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t transition-all"
                    style={{
                      height: `${(weekData[i] / 10) * 100}%`,
                      backgroundColor: i === 0 ? "#003087" : weekData[i] > 0 ? "#e3fcef" : "#f2f4f6"
                    }}
                  ></div>
                  <span className={`text-[10px] font-medium ${i === 0 ? "text-[#003087]" : "text-[#737686]"}`}>{day}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-[#434655] pt-3 border-t border-[#f2f4f6]">
              <span>Всего за неделю:</span>
              <span className="font-bold text-[#191c1e]">38 приёмов</span>
            </div>
          </div>

          {/* Availability Settings */}
          <div className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/10 shadow-sm">
            <h3 className="font-bold text-[#191c1e] font-[family-name:var(--font-manrope)] mb-4">Доступность</h3>
            <div className="space-y-4">
              {["Пн – Пт", "Суббота", "Воскресенье"].map((day, i) => (
                <div key={day} className="flex items-center justify-between">
                  <span className="text-sm text-[#434655]">{day}</span>
                  <div className="flex items-center gap-2">
                    {i < 2 ? (
                      <>
                        <span className="text-xs font-medium">09:00 – 18:00</span>
                        <div className="w-9 h-5 bg-[#003087] rounded-full relative cursor-pointer">
                          <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-xs font-medium text-[#737686]">Выходной</span>
                        <div className="w-9 h-5 bg-[#c3c6d7] rounded-full relative cursor-pointer">
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2.5 bg-[#003087] text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all">
              Сохранить расписание
            </button>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/10 shadow-sm">
            <h3 className="font-bold text-[#191c1e] font-[family-name:var(--font-manrope)] mb-4">Последние отзывы</h3>
            <div className="space-y-4">
              {[
                { patient: "Анна К.", stars: 5, text: "Отличный специалист!", time: "2 дня" },
                { patient: "Сергей М.", stars: 5, text: "Очень внимательный врач.", time: "5 дней" },
              ].map((review) => (
                <div key={review.patient} className="border-b border-[#f2f4f6] pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs">{review.patient}</span>
                    <div className="text-amber-500 text-xs">{"★".repeat(review.stars)}</div>
                  </div>
                  <p className="text-xs text-[#434655]">{review.text}</p>
                  <p className="text-[10px] text-[#737686] mt-1">{review.time} назад</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CabinetLayout>
  );
}

import CabinetLayout from "@/components/layout/CabinetLayout";
import ClinicAppointments from "@/components/cabinet/ClinicAppointments";

const navItems = [
  { href: "/cabinet/clinic", icon: "📊", label: "Дашборд" },
  { href: "/cabinet/clinic/doctors", icon: "👨‍⚕️", label: "Врачи" },
  { href: "/cabinet/clinic/schedule", icon: "📅", label: "Расписание" },
  { href: "/cabinet/clinic/appointments", icon: "📋", label: "Записи" },
  { href: "/cabinet/clinic/reports", icon: "📈", label: "Отчёты" },
  { href: "/cabinet/clinic/settings", icon: "⚙️", label: "Настройки" },
];

export default function ClinicCabinetPage() {
  return (
    <CabinetLayout
      role="clinic"
      userName="Центр Современной Медицины"
      userSubtitle="Администратор"
      navItems={navItems}
      headerTitle="Дашборд клиники"
    >
      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Записей сегодня", value: "24", change: "+12%", icon: "📅", color: "bg-[#003087]" },
          { label: "Выручка за месяц", value: "248 500 ₽", change: "+8%", icon: "💰", color: "bg-[#00a982]" },
          { label: "Новых пациентов", value: "18", change: "+23%", icon: "👤", color: "bg-[#1e40af]" },
          { label: "Рейтинг клиники", value: "4.9 ★", change: "+0.1", icon: "⭐", color: "bg-amber-500" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/10 shadow-sm">
            <div className={`w-10 h-10 ${kpi.color} rounded-xl flex items-center justify-center text-white text-lg mb-4`}>
              {kpi.icon}
            </div>
            <p className="text-2xl font-extrabold text-[#191c1e] mb-1">{kpi.value}</p>
            <p className="text-xs text-[#434655] mb-2">{kpi.label}</p>
            <span className="text-xs font-bold text-[#00a982]">▲ {kpi.change} за месяц</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#c3c6d7]/10 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#191c1e] font-[family-name:var(--font-manrope)]">Выручка по дням</h3>
            <select className="text-xs bg-[#f2f4f6] border-none rounded-lg px-3 py-2 text-[#434655] focus:ring-0 font-medium">
              <option>Ноябрь 2024</option>
              <option>Октябрь 2024</option>
            </select>
          </div>
          {/* Fake bar chart */}
          <div className="flex items-end gap-2 h-32">
            {[60, 80, 45, 90, 75, 55, 100, 70, 85, 65, 95, 80, 70, 88].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{ height: `${h}%`, backgroundColor: i === 13 ? "#003087" : "#e3fcef" }}
                ></div>
                {(i === 0 || i === 6 || i === 13) && <span className="text-[10px] text-[#737686]">{i + 1}</span>}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#f2f4f6]">
            <div>
              <p className="text-xs text-[#434655]">Сегодня</p>
              <p className="font-bold text-[#003087]">12 400 ₽</p>
            </div>
            <div>
              <p className="text-xs text-[#434655]">Прогноз за месяц</p>
              <p className="font-bold text-[#003087]">284 000 ₽</p>
            </div>
            <div>
              <p className="text-xs text-[#434655]">vs прошлый месяц</p>
              <p className="font-bold text-[#00a982]">▲ +8%</p>
            </div>
          </div>
        </div>

        {/* Doctor Load */}
        <div className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/10 shadow-sm">
          <h3 className="font-bold text-[#191c1e] font-[family-name:var(--font-manrope)] mb-6">Загрузка врачей</h3>
          <div className="space-y-5">
            {[
              { name: "Д-р Волков", load: 90, visits: 12 },
              { name: "Д-р Соколова", load: 70, visits: 9 },
              { name: "Д-р Миллер", load: 55, visits: 7 },
              { name: "Д-р Чэнь", load: 85, visits: 11 },
            ].map((doc) => (
              <div key={doc.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-[#191c1e]">{doc.name}</span>
                  <span className="text-[#434655] text-xs">{doc.visits} записей</span>
                </div>
                <div className="h-2 bg-[#f2f4f6] rounded-full">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${doc.load}%`,
                      backgroundColor: doc.load > 80 ? "#003087" : doc.load > 60 ? "#00a982" : "#c3c6d7"
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ClinicAppointments />
    </CabinetLayout>
  );
}

import CabinetLayout from "@/components/layout/CabinetLayout";
import Link from "next/link";

const navItems = [
  { href: "/cabinet/clinic", icon: "📊", label: "Дашборд" },
  { href: "/cabinet/clinic/doctors", icon: "👨‍⚕️", label: "Врачи" },
  { href: "/cabinet/clinic/schedule", icon: "📅", label: "Расписание" },
  { href: "/cabinet/clinic/appointments", icon: "📋", label: "Записи" },
  { href: "/cabinet/clinic/reports", icon: "📈", label: "Отчёты" },
  { href: "/cabinet/clinic/settings", icon: "⚙️", label: "Настройки" },
];

const leads = [
  { patient: "Анна К.", doctor: "Д-р Волков", service: "Кардиология", date: "7 ноя", time: "10:00", status: "new", price: "4 500" },
  { patient: "Сергей М.", doctor: "Д-р Соколова", service: "Неврология", date: "7 ноя", time: "11:30", status: "confirmed", price: "3 200" },
  { patient: "Ольга П.", doctor: "Д-р Волков", service: "ЭКГ", date: "8 ноя", time: "09:00", status: "new", price: "1 800" },
  { patient: "Иван Д.", doctor: "Д-р Миллер", service: "Терапия", date: "8 ноя", time: "14:00", status: "done", price: "2 800" },
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

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-[#c3c6d7]/10 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-[#f2f4f6]">
          <h3 className="font-bold text-[#191c1e] font-[family-name:var(--font-manrope)]">Входящие записи</h3>
          <Link href="/cabinet/clinic/appointments" className="text-xs text-[#003087] font-bold hover:underline">Все записи →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f7f9fb]">
              <tr className="text-xs text-[#434655] font-bold uppercase tracking-wider">
                <th className="px-6 py-3 text-left">Пациент</th>
                <th className="px-6 py-3 text-left">Врач</th>
                <th className="px-6 py-3 text-left">Услуга</th>
                <th className="px-6 py-3 text-left">Дата / Время</th>
                <th className="px-6 py-3 text-left">Стоимость</th>
                <th className="px-6 py-3 text-left">Статус</th>
                <th className="px-6 py-3 text-left">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2f4f6]">
              {leads.map((lead, i) => (
                <tr key={i} className="hover:bg-[#f7f9fb] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#dbe1ff] text-[#003087] flex items-center justify-center text-xs font-bold">
                        {lead.patient.charAt(0)}
                      </div>
                      <span className="font-medium text-sm">{lead.patient}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#434655]">{lead.doctor}</td>
                  <td className="px-6 py-4 text-sm text-[#434655]">{lead.service}</td>
                  <td className="px-6 py-4 text-sm font-medium">{lead.date} · {lead.time}</td>
                  <td className="px-6 py-4 font-bold text-sm text-[#003087]">{lead.price} ₽</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      lead.status === "new" ? "bg-[#dbe1ff] text-[#003087]" :
                      lead.status === "confirmed" ? "bg-[#e3fcef] text-[#006644]" :
                      "bg-[#e6e8ea] text-[#434655]"
                    }`}>
                      {lead.status === "new" ? "Новая" : lead.status === "confirmed" ? "Подтверждена" : "Выполнена"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {lead.status === "new" && (
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-[#003087] text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all">Принять</button>
                        <button className="px-3 py-1 bg-[#f2f4f6] text-[#434655] text-xs font-bold rounded-lg hover:bg-[#e6e8ea] transition-all">Отклонить</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </CabinetLayout>
  );
}

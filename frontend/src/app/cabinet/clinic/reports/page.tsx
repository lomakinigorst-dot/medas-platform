import CabinetLayout from "@/components/layout/CabinetLayout";

const navItems = [
  { href: "/cabinet/clinic", icon: "📊", label: "Дашборд" },
  { href: "/cabinet/clinic/doctors", icon: "👨‍⚕️", label: "Врачи" },
  { href: "/cabinet/clinic/schedule", icon: "📅", label: "Расписание" },
  { href: "/cabinet/clinic/appointments", icon: "📋", label: "Записи" },
  { href: "/cabinet/clinic/reports", icon: "📈", label: "Отчёты" },
  { href: "/cabinet/clinic/settings", icon: "⚙️", label: "Настройки" },
];

export default function ClinicReportsPage() {
  return (
    <CabinetLayout
      role="clinic"
      userName="Центр Современной Медицины"
      userSubtitle="Администратор"
      navItems={navItems}
      headerTitle="Отчёты по лидам и бонусам"
    >
      {/* Period Selector */}
      <div className="flex items-center gap-4 mb-8">
        <select className="bg-white border border-[#c3c6d7]/30 rounded-xl px-4 py-2.5 text-sm font-medium text-[#191c1e] focus:ring-2 focus:ring-[#003087]/20 shadow-sm">
          <option>Ноябрь 2024</option>
          <option>Октябрь 2024</option>
          <option>Сентябрь 2024</option>
        </select>
        <button className="px-5 py-2.5 bg-[#003087] text-white font-bold rounded-xl text-sm hover:opacity-90 transition-all">Скачать отчёт PDF</button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Лидов получено", value: "156", sub: "от MEDAS платформы", icon: "👤", color: "text-[#003087]", bg: "bg-[#dbe1ff]/30" },
          { label: "Конверсия", value: "68%", sub: "записей состоялось", icon: "📊", color: "text-[#00a982]", bg: "bg-[#e3fcef]" },
          { label: "Выручка от лидов", value: "248 500 ₽", sub: "без вычета комиссии", icon: "💰", color: "text-[#003087]", bg: "bg-[#f2f4f6]" },
          { label: "Бонусы начислено", value: "12 400 б.", sub: "пациентам клиники", icon: "🎁", color: "text-amber-600", bg: "bg-amber-50" },
        ].map((kpi) => (
          <div key={kpi.label} className={`${kpi.bg} rounded-2xl p-6 border border-white/50`}>
            <p className="text-2xl mb-1">{kpi.icon}</p>
            <p className={`text-2xl font-extrabold ${kpi.color} mb-1`}>{kpi.value}</p>
            <p className="text-xs font-bold text-[#191c1e]">{kpi.label}</p>
            <p className="text-xs text-[#434655] mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Leads by Source */}
        <div className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/10 shadow-sm">
          <h3 className="font-bold text-[#191c1e] font-[family-name:var(--font-manrope)] mb-6">Лиды по источникам</h3>
          <div className="space-y-4">
            {[
              { source: "MEDAS Поиск", count: 89, pct: 57, color: "#003087" },
              { source: "MEDAS Специальности", count: 34, pct: 22, color: "#00a982" },
              { source: "Прямая ссылка", count: 21, pct: 13, color: "#1e40af" },
              { source: "Рекомендации", count: 12, pct: 8, color: "#737686" },
            ].map((item) => (
              <div key={item.source}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-[#191c1e]">{item.source}</span>
                  <span className="text-[#434655]">{item.count} лидов · {item.pct}%</span>
                </div>
                <div className="h-2.5 bg-[#f2f4f6] rounded-full">
                  <div className="h-2.5 rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bonuses Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/10 shadow-sm">
          <h3 className="font-bold text-[#191c1e] font-[family-name:var(--font-manrope)] mb-6">Бонусы пациентов</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-[#f7f9fb] rounded-xl">
              <span className="text-sm text-[#434655]">Начислено за приёмы</span>
              <span className="font-bold text-[#00a982]">+12 400 баллов</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-[#f7f9fb] rounded-xl">
              <span className="text-sm text-[#434655]">Потрачено пациентами</span>
              <span className="font-bold text-[#ba1a1a]">-3 200 баллов</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-[#f7f9fb] rounded-xl">
              <span className="text-sm text-[#434655]">Скидки по бонусам</span>
              <span className="font-bold text-[#003087]">-8 000 ₽</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-[#e3fcef] rounded-xl border border-[#00a982]/20">
              <span className="text-sm font-bold text-[#006644]">Повторных визитов с бонусами</span>
              <span className="font-extrabold text-[#006644]">42%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Doctors by Revenue */}
      <div className="bg-white rounded-2xl border border-[#c3c6d7]/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#f2f4f6]">
          <h3 className="font-bold text-[#191c1e] font-[family-name:var(--font-manrope)]">Выручка по врачам</h3>
        </div>
        <table className="w-full">
          <thead className="bg-[#f7f9fb]">
            <tr className="text-xs text-[#434655] font-bold uppercase tracking-wider">
              <th className="px-6 py-3 text-left">Врач</th>
              <th className="px-6 py-3 text-left">Специальность</th>
              <th className="px-6 py-3 text-left">Записей</th>
              <th className="px-6 py-3 text-left">Конверсия</th>
              <th className="px-6 py-3 text-left">Выручка</th>
              <th className="px-6 py-3 text-left">Рейтинг</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f2f4f6]">
            {[
              { name: "Д-р Волков", spec: "Кардиолог", visits: 48, conv: "79%", revenue: "96 000 ₽", rating: "4.9" },
              { name: "Д-р Соколова", spec: "Невролог", visits: 36, conv: "72%", revenue: "72 000 ₽", rating: "4.8" },
              { name: "Д-р Чэнь", spec: "Невролог", visits: 42, conv: "81%", revenue: "64 000 ₽", rating: "5.0" },
              { name: "Д-р Миллер", spec: "Терапевт", visits: 30, conv: "70%", revenue: "42 000 ₽", rating: "4.7" },
            ].map((doc) => (
              <tr key={doc.name} className="hover:bg-[#f7f9fb] transition-colors">
                <td className="px-6 py-4 font-semibold text-sm">{doc.name}</td>
                <td className="px-6 py-4 text-sm text-[#434655]">{doc.spec}</td>
                <td className="px-6 py-4 text-sm font-medium">{doc.visits}</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-bold text-[#00a982]">{doc.conv}</span>
                </td>
                <td className="px-6 py-4 font-bold text-sm text-[#003087]">{doc.revenue}</td>
                <td className="px-6 py-4 text-amber-500 font-bold text-sm">★ {doc.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CabinetLayout>
  );
}

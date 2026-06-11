import CabinetLayout from "@/components/layout/CabinetLayout";

const navItems = [
  { href: "/cabinet/patient", icon: "🏠", label: "Главная" },
  { href: "/cabinet/patient/appointments", icon: "📅", label: "Приёмы" },
  { href: "/cabinet/patient/medcard", icon: "📋", label: "Медкарта" },
  { href: "/cabinet/patient/family", icon: "👨‍👩‍👧", label: "Семейный профиль" },
  { href: "/cabinet/patient/bonuses", icon: "🎁", label: "Бонусы" },
  { href: "/cabinet/patient/favorites", icon: "❤️", label: "Избранные врачи" },
];

const familyMembers = [
  { name: "Алекс Стерлинг", relation: "Вы", age: 34, bloodType: "O+", allergies: ["Пенициллин"], lastVisit: "7 ноя 2024", status: "Хорошее", isMain: true },
  { name: "Мария Стерлинг", relation: "Супруга", age: 31, bloodType: "A+", allergies: [], lastVisit: "15 окт 2024", status: "Хорошее", isMain: false },
  { name: "Дима Стерлинг", relation: "Сын", age: 7, bloodType: "B+", allergies: ["Лактоза"], lastVisit: "2 ноя 2024", status: "На контроле", isMain: false },
];

export default function PatientFamilyPage() {
  return (
    <CabinetLayout
      role="patient"
      userName="Алекс Стерлинг"
      userSubtitle="Управление здоровьем"
      navItems={navItems}
      headerTitle="Семейный профиль"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#191c1e] font-[family-name:var(--font-manrope)]">Семья Стерлинг</h2>
          <p className="text-[#434655] text-sm mt-1">Управляйте здоровьем всей семьи в одном месте</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-[#003087] text-white font-bold rounded-xl text-sm hover:opacity-90 transition-all">
          <span>+</span> Добавить члена семьи
        </button>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {familyMembers.map((member) => (
          <div key={member.name} className={`bg-white rounded-2xl p-6 border shadow-sm ${member.isMain ? "border-[#003087]/30" : "border-[#c3c6d7]/10"}`}>
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#003087] to-[#1e40af] flex items-center justify-center text-white font-bold text-xl">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-[#191c1e]">{member.name}</h3>
                  <p className="text-xs text-[#434655]">{member.relation} • {member.age} лет</p>
                </div>
              </div>
              {member.isMain && (
                <span className="text-[10px] font-bold bg-[#003087] text-white px-2 py-1 rounded-full">Вы</span>
              )}
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-[#434655]">Группа крови</span>
                <span className="font-bold text-[#003087]">{member.bloodType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#434655]">Последний визит</span>
                <span className="font-semibold">{member.lastVisit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#434655]">Статус</span>
                <span className={`font-semibold ${member.status === "Хорошее" ? "text-[#00a982]" : "text-amber-600"}`}>{member.status}</span>
              </div>
            </div>

            {member.allergies.length > 0 && (
              <div className="mb-5">
                <p className="text-xs text-[#434655] mb-2 font-medium">Аллергии:</p>
                <div className="flex flex-wrap gap-2">
                  {member.allergies.map((a) => (
                    <span key={a} className="px-2 py-1 bg-[#ffdad6] text-[#93000a] text-xs font-bold rounded-lg">{a}</span>
                  ))}
                </div>
              </div>
            )}

            {member.allergies.length === 0 && (
              <div className="mb-5">
                <span className="px-2 py-1 bg-[#e3fcef] text-[#006644] text-xs font-bold rounded-lg">Нет аллергий</span>
              </div>
            )}

            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-[#003087] text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all">Медкарта</button>
              <button className="flex-1 py-2 bg-[#f2f4f6] text-[#434655] text-xs font-bold rounded-lg hover:bg-[#e6e8ea] transition-all">Записать</button>
            </div>
          </div>
        ))}

        {/* Add Member Card */}
        <button className="bg-white rounded-2xl p-6 border-2 border-dashed border-[#c3c6d7]/40 flex flex-col items-center justify-center gap-3 hover:border-[#003087]/40 hover:bg-[#f7f9fb] transition-all min-h-[280px]">
          <div className="w-14 h-14 rounded-2xl bg-[#f2f4f6] flex items-center justify-center text-3xl text-[#737686]">
            +
          </div>
          <div className="text-center">
            <p className="font-bold text-[#434655] text-sm">Добавить члена семьи</p>
            <p className="text-xs text-[#737686] mt-1">Управляйте здоровьем близких</p>
          </div>
        </button>
      </div>

      {/* Family Insights */}
      <div className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/10 shadow-sm">
        <h3 className="text-lg font-bold text-[#191c1e] mb-6 font-[family-name:var(--font-manrope)]">Рекомендации для семьи</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: "💉", title: "Вакцинация", desc: "Дима: ревакцинация через 2 месяца", urgent: true },
            { icon: "🦷", title: "Стоматология", desc: "Мария: плановый осмотр через 3 мес.", urgent: false },
            { icon: "❤️", title: "Кардиология", desc: "Алекс: ЭКГ по назначению врача", urgent: false },
          ].map((tip) => (
            <div key={tip.title} className={`p-4 rounded-xl border ${tip.urgent ? "border-amber-200 bg-amber-50" : "border-[#c3c6d7]/10 bg-[#f7f9fb]"}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{tip.icon}</span>
                <p className="font-bold text-sm text-[#191c1e]">{tip.title}</p>
                {tip.urgent && <span className="ml-auto text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">Скоро</span>}
              </div>
              <p className="text-xs text-[#434655]">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </CabinetLayout>
  );
}

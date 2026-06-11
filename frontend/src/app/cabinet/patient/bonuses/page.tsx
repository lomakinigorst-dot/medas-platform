import CabinetLayout from "@/components/layout/CabinetLayout";
import Link from "next/link";

const navItems = [
  { href: "/cabinet/patient", icon: "🏠", label: "Главная" },
  { href: "/cabinet/patient/appointments", icon: "📅", label: "Приёмы" },
  { href: "/cabinet/patient/medcard", icon: "📋", label: "Медкарта" },
  { href: "/cabinet/patient/family", icon: "👨‍👩‍👧", label: "Семейный профиль" },
  { href: "/cabinet/patient/bonuses", icon: "🎁", label: "Бонусы" },
  { href: "/cabinet/patient/favorites", icon: "❤️", label: "Избранные врачи" },
];

const history = [
  { date: "7 ноя 2024", description: "Приём у Д-р Волкова", type: "earned", amount: "+450" },
  { date: "23 окт 2024", description: "Приём у Д-р Чэнь", type: "earned", amount: "+320" },
  { date: "15 окт 2024", description: "Скидка на анализы", type: "spent", amount: "-200" },
  { date: "8 окт 2024", description: "Первичная запись", type: "earned", amount: "+100" },
  { date: "1 окт 2024", description: "Регистрация на платформе", type: "earned", amount: "+500" },
];

const rewards = [
  { name: "Скидка 5% на следующий приём", cost: 500, icon: "🏷️" },
  { name: "Бесплатный анализ крови", cost: 800, icon: "🔬" },
  { name: "Приоритетная запись без очереди", cost: 300, icon: "⚡" },
  { name: "Консультация диетолога онлайн", cost: 1200, icon: "🥗" },
  { name: "Скидка 10% для члена семьи", cost: 700, icon: "👨‍👩‍👧" },
  { name: "Бесплатный ЭКГ", cost: 600, icon: "❤️" },
];

export default function PatientBonusesPage() {
  return (
    <CabinetLayout
      role="patient"
      userName="Алекс Стерлинг"
      userSubtitle="Управление здоровьем"
      navItems={navItems}
      headerTitle="Бонусная программа"
    >
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-[#003087] via-[#003087] to-[#1e40af] rounded-3xl p-8 text-white mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-white/70 text-sm uppercase tracking-widest font-bold mb-2">Ваш баланс</p>
            <p className="text-6xl font-extrabold tracking-tighter mb-2">1 230</p>
            <p className="text-white/70">бонусных баллов</p>
          </div>
          <div className="space-y-4 bg-white/10 rounded-2xl p-6 min-w-[220px]">
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Текущий уровень</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🥈</span>
                <span className="font-bold text-lg">Silver</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-white/60 mb-1">До Gold: 270 баллов</p>
              <div className="h-2 bg-white/20 rounded-full">
                <div className="h-2 bg-[#00a982] rounded-full" style={{ width: "73%" }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#00a982]/20 rounded-full blur-2xl"></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Всего заработано", value: "1 870", icon: "💰" },
          { label: "Потрачено", value: "200", icon: "🛍️" },
          { label: "Текущий баланс", value: "1 230", icon: "💳" },
          { label: "Сгорят через", value: "365 дн", icon: "⏳" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-[#c3c6d7]/10 shadow-sm">
            <p className="text-2xl mb-2">{s.icon}</p>
            <p className="text-xl font-extrabold text-[#191c1e]">{s.value}</p>
            <p className="text-xs text-[#434655] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rewards */}
        <div className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/10 shadow-sm">
          <h3 className="text-lg font-bold text-[#191c1e] mb-6 font-[family-name:var(--font-manrope)]">Потратить баллы</h3>
          <div className="space-y-4">
            {rewards.map((reward) => {
              const canAfford = reward.cost <= 1230;
              return (
                <div key={reward.name} className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${canAfford ? "border-[#c3c6d7]/20 hover:border-[#003087]/30" : "border-[#c3c6d7]/10 opacity-60"}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{reward.icon}</span>
                    <div>
                      <p className="font-semibold text-sm text-[#191c1e]">{reward.name}</p>
                      <p className="text-xs text-[#434655]">{reward.cost} баллов</p>
                    </div>
                  </div>
                  <button
                    disabled={!canAfford}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${canAfford ? "bg-[#003087] text-white hover:opacity-90 active:scale-95" : "bg-[#f2f4f6] text-[#737686] cursor-not-allowed"}`}
                  >
                    {canAfford ? "Получить" : "Мало баллов"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* History */}
        <div className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/10 shadow-sm">
          <h3 className="text-lg font-bold text-[#191c1e] mb-6 font-[family-name:var(--font-manrope)]">История транзакций</h3>
          <div className="space-y-4">
            {history.map((tx, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-[#f2f4f6] last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${tx.type === "earned" ? "bg-[#e3fcef] text-[#006644]" : "bg-[#ffdad6] text-[#93000a]"}`}>
                    {tx.type === "earned" ? "↑" : "↓"}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-[#191c1e]">{tx.description}</p>
                    <p className="text-xs text-[#434655]">{tx.date}</p>
                  </div>
                </div>
                <span className={`font-bold text-sm ${tx.type === "earned" ? "text-[#00a982]" : "text-[#ba1a1a]"}`}>
                  {tx.amount} баллов
                </span>
              </div>
            ))}
          </div>

          {/* How it Works */}
          <div className="mt-6 pt-6 border-t border-[#f2f4f6]">
            <h4 className="font-bold text-sm text-[#191c1e] mb-3">Как зарабатывать баллы</h4>
            <div className="space-y-2 text-xs text-[#434655]">
              <p>• За каждый приём: <span className="font-bold text-[#191c1e]">до 10% от стоимости</span></p>
              <p>• Пригласить друга: <span className="font-bold text-[#191c1e]">+300 баллов</span></p>
              <p>• Оставить отзыв: <span className="font-bold text-[#191c1e]">+50 баллов</span></p>
              <p>• Заполнить медкарту: <span className="font-bold text-[#191c1e]">+100 баллов</span></p>
            </div>
          </div>
        </div>
      </div>
    </CabinetLayout>
  );
}

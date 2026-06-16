"use client";

import { useEffect, useState } from "react";
import CabinetLayout from "@/components/layout/CabinetLayout";
import { getToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.med-as.ru/api/v1";

const navItems = [
  { href: "/cabinet/patient", icon: "🏠", label: "Главная" },
  { href: "/cabinet/patient/appointments", icon: "📅", label: "Приёмы" },
  { href: "/cabinet/patient/medcard", icon: "📋", label: "Медкарта" },
  { href: "/cabinet/patient/family", icon: "👨‍👩‍👧", label: "Семейный профиль" },
  { href: "/cabinet/patient/bonuses", icon: "🎁", label: "Бонусы" },
  { href: "/cabinet/patient/favorites", icon: "❤️", label: "Избранные врачи" },
];

const rewards = [
  { name: "Скидка 5% на следующий приём", cost: 500 },
  { name: "Бесплатный анализ крови", cost: 800 },
  { name: "Приоритетная запись без очереди", cost: 300 },
  { name: "Консультация диетолога онлайн", cost: 1200 },
  { name: "Скидка 10% для члена семьи", cost: 700 },
  { name: "Бесплатный ЭКГ", cost: 600 },
];

interface Transaction {
  id: number;
  amount: number;
  type: string;
  description: string;
  appointment_id: number | null;
  created_at: string;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fmtAmount(amount: number): string {
  return amount > 0 ? `+${amount}` : `${amount}`;
}

export default function PatientBonusesPage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState("Пациент");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      setError("Необходимо войти в аккаунт");
      return;
    }

    async function load() {
      try {
        const [meRes, bonusRes] = await Promise.all([
          fetch(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE}/bonuses/my`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (meRes.ok) {
          const me = (await meRes.json()) as { name: string };
          setUserName(me.name);
        }

        if (bonusRes.ok) {
          const data = (await bonusRes.json()) as { balance: number; transactions: Transaction[] };
          setBalance(data.balance);
          setTransactions(data.transactions);
        } else {
          setError("Не удалось загрузить данные бонусов");
        }
      } catch {
        setError("Нет соединения с сервером");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  const totalEarned = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalSpent = Math.abs(transactions.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0));
  const currentBalance = balance ?? 0;

  return (
    <CabinetLayout
      role="patient"
      userName={userName}
      userSubtitle="Управление здоровьем"
      navItems={navItems}
      headerTitle="Бонусная программа"
    >
      {loading && (
        <div className="flex items-center justify-center py-24 text-[#737686] text-sm">
          Загружаем данные...
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-[#003087] via-[#003087] to-[#1e40af] rounded-3xl p-8 text-white mb-8 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <p className="text-white/70 text-sm uppercase tracking-widest font-bold mb-2">Ваш баланс</p>
                <p className="text-6xl font-extrabold tracking-tighter mb-2 tabular-nums">
                  {currentBalance.toLocaleString("ru-RU")}
                </p>
                <p className="text-white/70">бонусных баллов</p>
              </div>
              <div className="space-y-4 bg-white/10 rounded-2xl p-6 min-w-[220px]">
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Заработано всего</p>
                  <p className="font-bold text-lg tabular-nums">{totalEarned.toLocaleString("ru-RU")} баллов</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Потрачено: {totalSpent.toLocaleString("ru-RU")} баллов</p>
                  {totalEarned > 0 && (
                    <div className="h-2 bg-white/20 rounded-full">
                      <div
                        className="h-2 bg-[#00a982] rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.round((totalEarned - totalSpent) / totalEarned * 100))}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#00a982]/20 rounded-full blur-2xl" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Всего заработано", value: totalEarned.toLocaleString("ru-RU") },
              { label: "Потрачено", value: totalSpent.toLocaleString("ru-RU") },
              { label: "Текущий баланс", value: currentBalance.toLocaleString("ru-RU") },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-[#c3c6d7]/10 shadow-sm">
                <p className="text-xl font-extrabold text-[#191c1e] tabular-nums">{s.value}</p>
                <p className="text-xs text-[#434655] mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Rewards */}
            <div className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/10 shadow-sm">
              <h3 className="text-lg font-bold text-[#191c1e] mb-6 font-[family-name:var(--font-manrope)]">
                Потратить баллы
              </h3>
              <div className="space-y-4">
                {rewards.map((reward) => {
                  const canAfford = reward.cost <= currentBalance;
                  return (
                    <div
                      key={reward.name}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                        canAfford ? "border-[#c3c6d7]/20 hover:border-[#003087]/30" : "border-[#c3c6d7]/10 opacity-60"
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-sm text-[#191c1e]">{reward.name}</p>
                        <p className="text-xs text-[#434655] tabular-nums">{reward.cost} баллов</p>
                      </div>
                      <button
                        disabled={!canAfford}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#003087]/30 ${
                          canAfford
                            ? "bg-[#003087] text-white hover:opacity-90 active:scale-95"
                            : "bg-[#f2f4f6] text-[#737686] cursor-not-allowed"
                        }`}
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
              <h3 className="text-lg font-bold text-[#191c1e] mb-6 font-[family-name:var(--font-manrope)]">
                История транзакций
              </h3>

              {transactions.length === 0 ? (
                <p className="text-sm text-[#737686] text-center py-8">Транзакций пока нет</p>
              ) : (
                <div className="space-y-4">
                  {transactions.map((tx) => {
                    const isEarned = tx.amount > 0;
                    return (
                      <div key={tx.id} className="flex items-center justify-between py-3 border-b border-[#f2f4f6] last:border-0">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                              isEarned ? "bg-[#e3fcef] text-[#006644]" : "bg-[#ffdad6] text-[#93000a]"
                            }`}
                            aria-hidden="true"
                          >
                            {isEarned ? "↑" : "↓"}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-[#191c1e]">{tx.description}</p>
                            <p className="text-xs text-[#434655]">{fmtDate(tx.created_at)}</p>
                          </div>
                        </div>
                        <span
                          className={`font-bold text-sm tabular-nums ${isEarned ? "text-[#00a982]" : "text-[#ba1a1a]"}`}
                        >
                          {fmtAmount(tx.amount)} баллов
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

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
        </>
      )}
    </CabinetLayout>
  );
}

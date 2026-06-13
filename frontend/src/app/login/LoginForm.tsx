"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { setToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.med-as.ru/api/v1";

type Step = "phone" | "register" | "otp";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const next = searchParams.get("next") ?? "/cabinet/patient";

  async function handlePhone() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      if (res.status === 404) {
        setStep("register");
      } else if (res.ok) {
        setStep("otp");
      } else {
        const data = await res.json().catch(() => ({}));
        setError((data as { detail?: string }).detail ?? "Ошибка сервера");
      }
    } catch {
      setError("Нет соединения с сервером");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name }),
      });
      if (res.ok) {
        setStep("otp");
      } else {
        const data = await res.json().catch(() => ({}));
        setError((data as { detail?: string }).detail ?? "Ошибка регистрации");
      }
    } catch {
      setError("Нет соединения с сервером");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otp }),
      });
      if (res.ok) {
        const data = (await res.json()) as { access_token: string };
        setToken(data.access_token);
        router.push(next);
      } else {
        const data = await res.json().catch(() => ({}));
        setError((data as { detail?: string }).detail ?? "Неверный код");
      }
    } catch {
      setError("Нет соединения с сервером");
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full bg-[#f7f9fb] border border-[#c3c6d7]/30 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/20 transition-all";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f9fb] to-[#e6f9f4] flex items-center justify-center px-4">
      <div className="absolute top-6 left-6">
        <Link href="/">
          <Image src="/logo-dark.png" alt="MEDAS" width={130} height={38} className="object-contain" />
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl shadow-[#003087]/8 border border-[#c3c6d7]/20 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-[#191c1e] font-[family-name:var(--font-manrope)] mb-2">
              {step === "register" ? "Регистрация" : "Добро пожаловать"}
            </h1>
            <p className="text-[#434655] text-sm">
              {step === "phone" && "Войдите или зарегистрируйтесь по номеру телефона"}
              {step === "register" && "Введите имя для создания аккаунта"}
              {step === "otp" && `Код отправлен на ${phone}`}
            </p>
          </div>

          {step === "phone" && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#434655] uppercase tracking-wider mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && phone && handlePhone()}
                  placeholder="+7 (999) 000-00-00"
                  className={inputCls}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                onClick={handlePhone}
                disabled={loading || !phone}
                className="w-full py-4 bg-gradient-to-r from-[#003087] to-[#1e40af] text-white font-bold rounded-xl shadow-lg shadow-[#003087]/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? "Отправляем..." : "Получить код"}
              </button>
            </div>
          )}

          {step === "register" && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#434655] uppercase tracking-wider mb-2">
                  Телефон
                </label>
                <input type="tel" value={phone} disabled className={`${inputCls} text-[#737686] cursor-not-allowed`} />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#434655] uppercase tracking-wider mb-2">
                  Ваше имя
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && name && handleRegister()}
                  placeholder="Иван Иванов"
                  className={inputCls}
                  autoFocus
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                onClick={handleRegister}
                disabled={loading || !name}
                className="w-full py-4 bg-gradient-to-r from-[#003087] to-[#1e40af] text-white font-bold rounded-xl shadow-lg shadow-[#003087]/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? "Регистрируем..." : "Зарегистрироваться"}
              </button>
              <button
                type="button"
                onClick={() => { setStep("phone"); setError(null); }}
                className="w-full text-sm text-[#434655] hover:text-[#003087] transition-colors"
              >
                ← Изменить номер
              </button>
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#434655] uppercase tracking-wider mb-2">
                  Код из СМС
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && otp.length === 6 && handleVerify()}
                  placeholder="123456"
                  maxLength={6}
                  className={`${inputCls} text-center tracking-widest text-xl`}
                  autoFocus
                />
                <p className="text-xs text-[#737686] mt-2 text-center">Для тестирования: 123456</p>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                onClick={handleVerify}
                disabled={loading || otp.length !== 6}
                className="w-full py-4 bg-gradient-to-r from-[#003087] to-[#1e40af] text-white font-bold rounded-xl shadow-lg shadow-[#003087]/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? "Проверяем..." : "Войти"}
              </button>
              <button
                type="button"
                onClick={() => { setStep("phone"); setOtp(""); setError(null); }}
                className="w-full text-sm text-[#434655] hover:text-[#003087] transition-colors"
              >
                ← Изменить номер
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { icon: "🔒", label: "Безопасно" },
            { icon: "⚡", label: "Быстро" },
            { icon: "🎁", label: "Бонусы" },
          ].map((b) => (
            <div key={b.label} className="bg-white/70 backdrop-blur rounded-xl p-3 text-center border border-white shadow-sm">
              <p className="text-lg mb-1">{b.icon}</p>
              <p className="text-xs font-bold text-[#434655]">{b.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

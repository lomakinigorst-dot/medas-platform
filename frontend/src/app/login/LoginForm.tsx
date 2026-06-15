"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { setToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.med-as.ru/api/v1";

type Step = "phone" | "register" | "otp";

// ─── Phone helpers ────────────────────────────────────────────────────────────

function extractDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Normalise to +7XXXXXXXXXX. Returns null if input is not a valid RU number. */
function normalizePhone(raw: string): string | null {
  let d = extractDigits(raw);
  if (d.startsWith("8") && d.length === 11) d = "7" + d.slice(1);
  if (d.startsWith("7") && d.length === 11) return "+" + d;
  if (d.length === 10) return "+7" + d;
  return null;
}

/** Format digits as +7 (9XX) XXX-XX-XX for display. */
function formatPhone(raw: string): string {
  let d = extractDigits(raw);
  // drop leading 8 → treat as 7
  if (d.startsWith("8")) d = "7" + d.slice(1);
  // drop leading 7 (we'll add +7 ourselves)
  if (d.startsWith("7")) d = d.slice(1);
  // cap at 10 digits
  d = d.slice(0, 10);

  let out = "+7";
  if (d.length > 0) out += " (" + d.slice(0, Math.min(3, d.length));
  if (d.length >= 3) out += ") " + d.slice(3, Math.min(6, d.length));
  if (d.length >= 6) out += "-" + d.slice(6, Math.min(8, d.length));
  if (d.length >= 8) out += "-" + d.slice(8, 10);
  return out;
}

function phoneError(raw: string): string | null {
  if (!raw || raw === "+7") return null; // empty — no error yet
  const norm = normalizePhone(raw);
  if (!norm) return "Введите корректный номер в формате +7 (9XX) XXX-XX-XX";
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("phone");
  const [phoneRaw, setPhoneRaw] = useState("+7 ");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const next = searchParams.get("next") ?? "/cabinet/patient";

  // normalised phone sent to API
  const normalised = normalizePhone(phoneRaw);
  const phoneValid = normalised !== null;
  const validationError = phoneError(phoneRaw);

  useEffect(() => {
    if (step !== "otp") return;
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  function handlePhoneChange(raw: string) {
    // keep +7 prefix always
    const formatted = formatPhone(raw);
    setPhoneRaw(formatted);
    setError(null);
  }

  async function handlePhone() {
    if (!phoneValid) { setError("Введите корректный номер телефона"); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalised }),
      });
      if (res.status === 404) {
        setIsNewUser(true);
        setStep("register");
      } else if (res.ok) {
        setIsNewUser(false);
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
    if (!phoneValid) { setError("Введите корректный номер телефона"); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalised, name }),
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

  async function handleResend() {
    setOtp("");
    setError(null);
    if (isNewUser) await handleRegister();
    else await handlePhone();
  }

  async function handleVerify() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalised, code: otp }),
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
          <Logo width={130} height={38} priority />
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
              {step === "otp" && (
                <>
                  Робот позвонит на <strong>{normalised}</strong> и продиктует код
                </>
              )}
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
                  value={phoneRaw}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && phoneValid && handlePhone()}
                  onFocus={() => { if (!phoneRaw || phoneRaw === "+7") setPhoneRaw("+7 "); }}
                  placeholder="+7 (999) 000-00-00"
                  inputMode="tel"
                  className={`${inputCls} ${validationError ? "border-red-400 focus:ring-red-200" : ""}`}
                />
                {validationError && (
                  <p className="mt-1 text-xs text-red-500">{validationError}</p>
                )}
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                onClick={handlePhone}
                disabled={loading || !phoneValid}
                className="w-full py-4 bg-gradient-to-r from-[#003087] to-[#1e40af] text-white font-bold rounded-xl shadow-lg shadow-[#003087]/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? "Отправляем..." : "Получить код звонком"}
              </button>
              <p className="text-center text-xs text-[#737686]">
                Робот позвонит и продиктует 6-значный код
              </p>
            </div>
          )}

          {step === "register" && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#434655] uppercase tracking-wider mb-2">
                  Телефон
                </label>
                <input type="tel" value={normalised ?? phoneRaw} disabled className={`${inputCls} text-[#737686] cursor-not-allowed`} />
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
                  Код из звонка
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && otp.length === 6 && handleVerify()}
                  placeholder="------"
                  maxLength={6}
                  inputMode="numeric"
                  className={`${inputCls} text-center tracking-widest text-xl`}
                  autoFocus
                />
                <div className="mt-2 text-center">
                  {countdown > 0 ? (
                    <p className="text-xs text-[#737686]">Повторный звонок через {countdown} сек</p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={loading}
                      className="text-xs text-[#003087] hover:underline disabled:opacity-50"
                    >
                      Позвонить повторно
                    </button>
                  )}
                </div>
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
            { icon: "📞", label: "Звонок" },
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

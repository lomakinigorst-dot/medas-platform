"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { setToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.med-as.ru/api/v1";
const FLASH_TIMEOUTS = [60, 90, 120, 120, 120]; // seconds per flash attempt 1-5

type Step = "phone" | "register" | "otp";
type OtpMethod = "flash" | "sms";

// ─── Phone helpers ────────────────────────────────────────────────────────────

/** Keep only 10 digits after +7, handle 8→7 and 7→strip. */
function cleanDigits(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("8") && d.length >= 11) d = d.slice(1);
  if (d.startsWith("7")) d = d.slice(1);
  return d.slice(0, 10);
}

function phoneValid(digits: string): boolean {
  return digits.length === 10;
}

function normalised(digits: string): string {
  return "+7" + digits;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/cabinet/patient";

  // ── Phone step ──
  const [step, setStep] = useState<Step>("phone");
  const [digits, setDigits] = useState(""); // raw 10 digits
  const [name, setName] = useState("");

  // ── OTP step ──
  const [otp, setOtp] = useState("");
  const [method, setMethod] = useState<OtpMethod>("flash");
  const [flashCount, setFlashCount] = useState(0); // increments on each flash call (max 5)
  const [smsUsed, setSmsUsed] = useState(false);
  const [otpTrigger, setOtpTrigger] = useState(0); // increment → reset countdown
  const [countdown, setCountdown] = useState(0);
  const countdownInitRef = useRef(60); // seconds to use on next countdown start

  // ── Misc ──
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const phone = normalised(digits);

  // Countdown timer — restarts whenever otpTrigger increments
  useEffect(() => {
    if (otpTrigger === 0) return;
    setCountdown(countdownInitRef.current);
    const id = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(id); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [otpTrigger]);

  function startCountdown(seconds: number) {
    countdownInitRef.current = seconds;
    setOtpTrigger((t) => t + 1);
  }

  function handlePhoneChange(val: string) {
    setDigits(cleanDigits(val));
    setError(null);
  }

  // ── Shared OTP send helper ──
  async function sendOtp(m: OtpMethod): Promise<boolean> {
    setLoading(true);
    setError(null);
    try {
      const endpoint = isNewUser
        ? `${API_BASE}/auth/register`
        : `${API_BASE}/auth/login`;
      const body = isNewUser
        ? { phone, name, method: m }
        : { phone, method: m };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { detail?: string }).detail ?? "Ошибка сервера");
        return false;
      }
      return true;
    } catch {
      setError("Нет соединения с сервером");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handlePhone() {
    if (!phoneValid(digits)) { setError("Введите корректный номер в формате +7 (9XX) XXX-XX-XX"); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, method: "flash" }),
      });
      if (res.status === 404) {
        setIsNewUser(true);
        setStep("register");
      } else if (res.ok) {
        setIsNewUser(false);
        setMethod("flash");
        setFlashCount(1);
        setSmsUsed(false);
        setOtp("");
        startCountdown(FLASH_TIMEOUTS[0]);
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
    if (!phoneValid(digits)) { setError("Введите корректный номер телефона"); return; }
    if (!name.trim()) { setError("Введите имя"); return; }
    const ok = await sendOtp("flash");
    if (ok) {
      setMethod("flash");
      setFlashCount(1);
      setSmsUsed(false);
      setOtp("");
      startCountdown(FLASH_TIMEOUTS[0]);
      setStep("otp");
    }
  }

  async function handleResend() {
    const ok = await sendOtp("flash");
    if (ok) {
      // flashCount is still old value here — use it to index next timeout
      startCountdown(FLASH_TIMEOUTS[flashCount] ?? 120);
      setFlashCount((c) => c + 1);
      setOtp("");
    }
  }

  async function handleSwitchToSms() {
    const ok = await sendOtp("sms");
    if (ok) {
      setMethod("sms");
      setSmsUsed(true);
      setOtp("");
      startCountdown(120);
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

  // OTP input length: 4 for flash call, 6 for SMS
  const otpLength = method === "sms" ? 6 : 4;

  // Resend / fallback button after countdown
  function renderResendArea() {
    if (countdown > 0) {
      return (
        <p className="text-xs text-[#737686]">
          {method === "flash" ? "Повторный звонок" : "Повторная SMS"} через {countdown} сек
        </p>
      );
    }
    if (method === "flash" && flashCount < 5) {
      return (
        <button type="button" onClick={handleResend} disabled={loading}
          className="text-xs text-[#003087] hover:underline disabled:opacity-50">
          Позвонить повторно
        </button>
      );
    }
    if (method === "flash" && flashCount >= 5 && !smsUsed) {
      return (
        <button type="button" onClick={handleSwitchToSms} disabled={loading}
          className="text-xs text-[#003087] hover:underline disabled:opacity-50">
          Другой способ — получить SMS
        </button>
      );
    }
    if (smsUsed) {
      return (
        <p className="text-xs text-[#737686]">
          Напишите в{" "}
          <a href="mailto:support@med-as.ru" className="text-[#003087] hover:underline">
            поддержку
          </a>{" "}
          для восстановления доступа
        </p>
      );
    }
    return null;
  }

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
              {step === "otp" && method === "flash" && (
                <>Вам позвонят на <strong>{phone}</strong> — введите последние 4 цифры входящего номера</>
              )}
              {step === "otp" && method === "sms" && (
                <>Код отправлен на <strong>{phone}</strong> по SMS</>
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
                  ref={phoneInputRef}
                  type="tel"
                  value={"+7" + digits}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && phoneValid(digits) && handlePhone()}
                  onFocus={(e) => {
                    // move cursor to end
                    const len = e.target.value.length;
                    e.target.setSelectionRange(len, len);
                  }}
                  placeholder="+7 9991234567"
                  inputMode="tel"
                  className={inputCls}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                onClick={handlePhone}
                disabled={loading || !phoneValid(digits)}
                className="w-full py-4 bg-gradient-to-r from-[#003087] to-[#1e40af] text-white font-bold rounded-xl shadow-lg shadow-[#003087]/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? "Отправляем..." : "Получить код звонком"}
              </button>
              <p className="text-center text-xs text-[#737686]">
                Позвоним — введите последние 4 цифры входящего номера
              </p>
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
                disabled={loading || !name.trim()}
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
                  {method === "flash" ? "Последние 4 цифры входящего номера" : "Код из SMS"}
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, otpLength))}
                  onKeyDown={(e) => e.key === "Enter" && otp.length === otpLength && handleVerify()}
                  placeholder={"—".repeat(otpLength)}
                  maxLength={otpLength}
                  inputMode="numeric"
                  className={`${inputCls} text-center tracking-widest text-xl`}
                  autoFocus
                />
                <div className="mt-2 text-center">
                  {renderResendArea()}
                </div>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                onClick={handleVerify}
                disabled={loading || otp.length !== otpLength}
                className="w-full py-4 bg-gradient-to-r from-[#003087] to-[#1e40af] text-white font-bold rounded-xl shadow-lg shadow-[#003087]/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? "Проверяем..." : "Войти"}
              </button>
              <button
                type="button"
                onClick={() => { setStep("phone"); setOtp(""); setError(null); setFlashCount(0); setSmsUsed(false); }}
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

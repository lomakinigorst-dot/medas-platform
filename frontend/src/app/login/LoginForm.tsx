"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { setToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.med-as.ru/api/v1";
const FLASH_TIMEOUTS = [60, 90, 120, 120, 120]; // seconds per flash attempt 1-5
const OTP_TTL_SEC = 600; // must match backend OTP_TTL

type Step = "phone" | "register" | "otp";
type OtpMethod = "flash" | "sms";

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

function fmtTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/cabinet/patient";

  // ── Phone step ──
  const [step, setStep] = useState<Step>("phone");
  const [digits, setDigits] = useState("");
  const [name, setName] = useState("");

  // ── OTP step ──
  const [otp, setOtp] = useState("");
  const [method, setMethod] = useState<OtpMethod>("flash");
  const [flashCount, setFlashCount] = useState(0);
  const [smsUsed, setSmsUsed] = useState(false);

  // Two independent timers:
  // otpTrigger → resend cooldown (countdown) + code expiry (otpExpiry)
  const [otpTrigger, setOtpTrigger] = useState(0);
  const [countdown, setCountdown] = useState(0);   // resend cooldown
  const [otpExpiry, setOtpExpiry] = useState(0);   // code valid for N sec

  // UI states
  const [attemptsExhausted, setAttemptsExhausted] = useState(false);

  const countdownInitRef = useRef(60);
  const submittingRef = useRef(false);

  // ── Misc ──
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const phone = normalised(digits);

  // Resend cooldown — resets on each new OTP sent
  useEffect(() => {
    if (otpTrigger === 0) return;
    setCountdown(countdownInitRef.current);
    const id = setInterval(() => {
      setCountdown((c) => { if (c <= 1) { clearInterval(id); return 0; } return c - 1; });
    }, 1000);
    return () => clearInterval(id);
  }, [otpTrigger]);

  // Code expiry countdown (10 min) — resets on each new OTP sent
  useEffect(() => {
    if (otpTrigger === 0) return;
    setOtpExpiry(OTP_TTL_SEC);
    const id = setInterval(() => {
      setOtpExpiry((c) => { if (c <= 1) { clearInterval(id); return 0; } return c - 1; });
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

  function resetToPhone() {
    setStep("phone");
    setOtp("");
    setError(null);
    setFlashCount(0);
    setSmsUsed(false);
    setOtpExpiry(0);
    setAttemptsExhausted(false);
  }

  // ── Shared OTP send ──
  async function sendOtp(m: OtpMethod): Promise<boolean> {
    setLoading(true);
    setError(null);
    try {
      const endpoint = isNewUser ? `${API_BASE}/auth/register` : `${API_BASE}/auth/login`;
      const body = isNewUser ? { phone, name, method: m } : { phone, method: m };
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
    if (submittingRef.current) return;
    if (!phoneValid(digits)) { setError("Введите корректный номер телефона"); return; }
    submittingRef.current = true;
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
        setAttemptsExhausted(false);
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
      submittingRef.current = false;
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
      setAttemptsExhausted(false);
      startCountdown(FLASH_TIMEOUTS[0]);
      setStep("otp");
    }
  }

  async function handleResend() {
    const ok = await sendOtp("flash");
    if (ok) {
      startCountdown(FLASH_TIMEOUTS[flashCount] ?? 120);
      setFlashCount((c) => c + 1);
      setOtp("");
      setAttemptsExhausted(false);
    }
  }

  async function handleSwitchToSms() {
    const ok = await sendOtp("sms");
    if (ok) {
      setMethod("sms");
      setSmsUsed(true);
      setOtp("");
      setAttemptsExhausted(false);
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
        const detail = (data as { detail?: string }).detail ?? "Неверный код";
        if (res.status === 429) {
          // Attempts exhausted — switch to countdown UI
          setAttemptsExhausted(true);
          setOtp("");
          setError(null);
          // If detail contains lockout (2h or 30min) — show as error, not countdown
          if (detail.includes("час") || detail.includes("30 мин") || detail.includes("поддержк")) {
            setError(detail);
          }
        } else {
          setError(detail);
        }
      }
    } catch {
      setError("Нет соединения с сервером");
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full bg-[#f7f9fb] border border-[#c3c6d7]/30 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/20 transition-all";

  const otpLength = method === "sms" ? 6 : 4;
  const codeExpired = otpExpiry === 0 && otpTrigger > 0;
  const otpDisabled = codeExpired || attemptsExhausted;

  function renderResendArea() {
    if (attemptsExhausted) {
      if (countdown > 0) {
        return (
          <p className="text-xs text-amber-600 font-medium">
            Попытки исчерпаны — новый звонок через {countdown} сек
          </p>
        );
      }
      if (method === "flash" && flashCount < 5) {
        return (
          <button type="button" onClick={handleResend} disabled={loading}
            className="text-xs text-[#003087] hover:underline disabled:opacity-50 font-medium">
            Запросить новый звонок
          </button>
        );
      }
      if (!smsUsed) {
        return (
          <button type="button" onClick={handleSwitchToSms} disabled={loading}
            className="text-xs text-[#003087] hover:underline disabled:opacity-50 font-medium">
            Получить код по SMS
          </button>
        );
      }
      return (
        <p className="text-xs text-[#737686]">
          Напишите в{" "}
          <a href="mailto:support@med-as.ru" className="text-[#003087] hover:underline">поддержку</a>{" "}
          для восстановления доступа
        </p>
      );
    }

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
          <a href="mailto:support@med-as.ru" className="text-[#003087] hover:underline">поддержку</a>{" "}
          для восстановления доступа
        </p>
      );
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f9fb] to-[#e6f9f4] flex items-center justify-center px-4">
      <div className="absolute top-6 left-6">
        <Link href="/"><Logo width={130} height={38} priority /></Link>
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
                <>Вам позвонят на <strong>{phone}</strong></>
              )}
              {step === "otp" && method === "sms" && (
                <>Код отправлен на <strong>{phone}</strong> по SMS</>
              )}
            </p>
          </div>

          {/* ── PHONE STEP ── */}
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
                  onFocus={(e) => { const l = e.target.value.length; e.target.setSelectionRange(l, l); }}
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

          {/* ── REGISTER STEP ── */}
          {step === "register" && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#434655] uppercase tracking-wider mb-2">Телефон</label>
                <input type="tel" value={phone} disabled className={`${inputCls} text-[#737686] cursor-not-allowed`} />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#434655] uppercase tracking-wider mb-2">Ваше имя</label>
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
              <button type="button" onClick={() => { setStep("phone"); setError(null); }}
                className="w-full text-sm text-[#434655] hover:text-[#003087] transition-colors">
                ← Изменить номер
              </button>
            </div>
          )}

          {/* ── OTP STEP ── */}
          {step === "otp" && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs text-[#737686] mb-2">
                  {method === "flash" ? "Последние 4 цифры входящего номера" : "Код из SMS"}
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, otpLength))}
                  onKeyDown={(e) => e.key === "Enter" && otp.length === otpLength && !otpDisabled && handleVerify()}
                  placeholder={"—".repeat(otpLength)}
                  maxLength={otpLength}
                  inputMode="numeric"
                  disabled={otpDisabled}
                  className={`${inputCls} text-center tracking-widest text-xl ${otpDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  autoFocus={!otpDisabled}
                />

                {/* Caller ID example — subtle, flash only */}
                {method === "flash" && !codeExpired && (
                  <p className="text-xs text-[#9b9eb0] mt-1.5 text-center">
                    Пример: +7 (495) 123-<span className="text-[#434655]">45-67</span> → введите <span className="text-[#434655]">4567</span>
                  </p>
                )}

                {/* Resend / expired / exhausted */}
                <div className="mt-2 text-center">
                  {codeExpired ? (
                    <p className="text-xs text-red-400">Код устарел — запросите новый звонок</p>
                  ) : (
                    renderResendArea()
                  )}
                </div>

                {/* Timer — tiny, right-aligned, unobtrusive */}
                {otpTrigger > 0 && !codeExpired && (
                  <p className="text-right text-[11px] text-[#b0b3c4] mt-1 tabular-nums">
                    {fmtTime(otpExpiry)}
                  </p>
                )}
              </div>

              {error && <p className="text-sm text-red-500 text-center">{error}</p>}

              <button
                onClick={handleVerify}
                disabled={loading || otp.length !== otpLength || otpDisabled}
                className="w-full py-4 bg-gradient-to-r from-[#003087] to-[#1e40af] text-white font-bold rounded-xl shadow-lg shadow-[#003087]/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? "Проверяем..." : "Войти"}
              </button>

              {codeExpired && flashCount < 5 && (
                <button type="button" onClick={handleResend} disabled={loading}
                  className="w-full py-3 border border-[#003087] text-[#003087] rounded-xl hover:bg-[#003087]/5 transition-all disabled:opacity-50 text-sm">
                  {loading ? "Отправляем..." : "Запросить новый звонок"}
                </button>
              )}

              <div className="text-center space-y-2">
                <button type="button" onClick={resetToPhone}
                  className="text-sm text-[#434655] hover:text-[#003087] transition-colors">
                  ← Изменить номер
                </button>
                {method === "flash" && !codeExpired && !smsUsed && (
                  <p className="text-xs text-[#b0b3c4]">
                    Не приходит звонок? Проверьте «Не беспокоить» и блокировщики спама
                  </p>
                )}
              </div>
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

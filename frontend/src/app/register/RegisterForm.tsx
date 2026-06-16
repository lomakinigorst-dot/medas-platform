"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { setToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.med-as.ru/api/v1";
const FLASH_TIMEOUTS = [60, 90, 120, 120, 120];
const OTP_TTL_SEC = 600;

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

type Step = "form" | "otp";

export default function RegisterForm() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("form");
  const [digits, setDigits] = useState("");
  const [name, setName] = useState("");

  const [otp, setOtp] = useState("");
  const [flashCount, setFlashCount] = useState(0);
  const [smsUsed, setSmsUsed] = useState(false);
  const [otpTrigger, setOtpTrigger] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [otpExpiry, setOtpExpiry] = useState(0);
  const [attemptsExhausted, setAttemptsExhausted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const countdownInitRef = useRef(60);
  const submittingRef = useRef(false);

  const phone = normalised(digits);

  useEffect(() => {
    if (otpTrigger === 0) return;
    setCountdown(countdownInitRef.current);
    const id = setInterval(() => {
      setCountdown((c) => { if (c <= 1) { clearInterval(id); return 0; } return c - 1; });
    }, 1000);
    return () => clearInterval(id);
  }, [otpTrigger]);

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

  async function sendOtp(method: "flash" | "sms"): Promise<boolean> {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name: name.trim(), method }),
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

  async function handleSubmit() {
    if (submittingRef.current) return;
    if (!phoneValid(digits)) { setError("Введите корректный номер телефона"); return; }
    if (!name.trim()) { setError("Введите ваше имя"); return; }
    submittingRef.current = true;
    const ok = await sendOtp("flash");
    submittingRef.current = false;
    if (ok) {
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
        router.push("/cabinet/patient");
      } else {
        const data = await res.json().catch(() => ({}));
        const detail = (data as { detail?: string }).detail ?? "Неверный код";
        if (res.status === 429) {
          setAttemptsExhausted(true);
          setOtp("");
          setError(null);
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
      if (flashCount < 5) {
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
          {smsUsed ? "Повторная SMS" : "Повторный звонок"} через {countdown} сек
        </p>
      );
    }
    if (flashCount < 5) {
      return (
        <button type="button" onClick={handleResend} disabled={loading}
          className="text-xs text-[#003087] hover:underline disabled:opacity-50">
          Позвонить повторно
        </button>
      );
    }
    if (!smsUsed) {
      return (
        <button type="button" onClick={handleSwitchToSms} disabled={loading}
          className="text-xs text-[#003087] hover:underline disabled:opacity-50">
          Получить SMS вместо звонка
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f9fb] to-[#e6f9f4] flex items-center justify-center px-4">
      <div className="absolute top-6 left-6">
        <Link href="/"><Logo width={130} height={38} priority /></Link>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl shadow-[#003087]/8 border border-[#c3c6d7]/20 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#00a982]/10 rounded-2xl mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00a982" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-[#191c1e] font-[family-name:var(--font-manrope)] mb-2">
              {step === "form" ? "Создать аккаунт" : "Подтвердите номер"}
            </h1>
            <p className="text-[#434655] text-sm">
              {step === "form" && "Введите имя и телефон — придёт звонок для подтверждения"}
              {step === "otp" && (
                <>Вам позвонят на <strong>{phone}</strong></>
              )}
            </p>
          </div>

          {/* ── FORM STEP ── */}
          {step === "form" && (
            <div className="space-y-5">
              <div>
                <label htmlFor="reg-name" className="block text-xs font-bold text-[#434655] uppercase tracking-wider mb-2">
                  Ваше имя <span className="text-red-400">*</span>
                </label>
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(null); }}
                  onKeyDown={(e) => e.key === "Enter" && name.trim() && phoneValid(digits) && handleSubmit()}
                  placeholder="Иван Иванов"
                  autoComplete="name"
                  className={inputCls}
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="reg-phone" className="block text-xs font-bold text-[#434655] uppercase tracking-wider mb-2">
                  Телефон <span className="text-red-400">*</span>
                </label>
                <input
                  id="reg-phone"
                  type="tel"
                  value={"+7" + digits}
                  onChange={(e) => { setDigits(cleanDigits(e.target.value)); setError(null); }}
                  onKeyDown={(e) => e.key === "Enter" && name.trim() && phoneValid(digits) && handleSubmit()}
                  onFocus={(e) => { const l = e.target.value.length; e.target.setSelectionRange(l, l); }}
                  placeholder="+7 9991234567"
                  inputMode="tel"
                  autoComplete="tel"
                  className={inputCls}
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={loading || !name.trim() || !phoneValid(digits)}
                className="w-full py-4 bg-gradient-to-r from-[#003087] to-[#1e40af] text-white font-bold rounded-xl shadow-lg shadow-[#003087]/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-[#003087]/30"
              >
                {loading ? "Отправляем..." : "Зарегистрироваться"}
              </button>

              <p className="text-xs text-center text-[#737686]">
                Позвоним — введите последние 4 цифры входящего номера
              </p>

              <div className="pt-2 border-t border-[#f2f4f6] text-center">
                <p className="text-sm text-[#434655]">
                  Уже есть аккаунт?{" "}
                  <Link href="/login" className="text-[#003087] font-semibold hover:underline">
                    Войти
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* ── OTP STEP ── */}
          {step === "otp" && (
            <div className="space-y-5">
              <div>
                <label htmlFor="reg-otp" className="block text-xs text-[#737686] mb-2 text-center">
                  {smsUsed ? "Код из SMS" : "Последние 4 цифры входящего номера"}
                </label>
                <input
                  id="reg-otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, smsUsed ? 6 : 4))}
                  onKeyDown={(e) => {
                    const len = smsUsed ? 6 : 4;
                    if (e.key === "Enter" && otp.length === len && !otpDisabled) handleVerify();
                  }}
                  placeholder={smsUsed ? "——————" : "————"}
                  maxLength={smsUsed ? 6 : 4}
                  inputMode="numeric"
                  disabled={otpDisabled}
                  className={`${inputCls} text-center tracking-widest text-xl ${otpDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  autoFocus={!otpDisabled}
                />

                {!smsUsed && !codeExpired && (
                  <p className="text-xs text-[#9b9eb0] mt-1.5 text-center">
                    Пример: +7 (495) 123-<span className="text-[#434655]">45-67</span> → введите <span className="text-[#434655]">4567</span>
                  </p>
                )}

                <div className="mt-2 text-center">
                  {codeExpired ? (
                    <p className="text-xs text-red-400">Код устарел — запросите новый звонок</p>
                  ) : (
                    renderResendArea()
                  )}
                </div>

                {otpTrigger > 0 && !codeExpired && (
                  <p className="text-right text-[11px] text-[#b0b3c4] mt-1 tabular-nums">
                    {fmtTime(otpExpiry)}
                  </p>
                )}
              </div>

              {error && <p className="text-sm text-red-500 text-center">{error}</p>}

              <button
                onClick={handleVerify}
                disabled={loading || otp.length !== (smsUsed ? 6 : 4) || otpDisabled}
                className="w-full py-4 bg-gradient-to-r from-[#003087] to-[#1e40af] text-white font-bold rounded-xl shadow-lg shadow-[#003087]/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-[#003087]/30"
              >
                {loading ? "Проверяем..." : "Подтвердить"}
              </button>

              {codeExpired && flashCount < 5 && (
                <button type="button" onClick={handleResend} disabled={loading}
                  className="w-full py-3 border border-[#003087] text-[#003087] rounded-xl hover:bg-[#003087]/5 transition-all disabled:opacity-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30">
                  {loading ? "Отправляем..." : "Запросить новый звонок"}
                </button>
              )}

              <div className="text-center space-y-2">
                <button type="button"
                  onClick={() => { setStep("form"); setOtp(""); setError(null); setOtpExpiry(0); setAttemptsExhausted(false); }}
                  className="text-sm text-[#434655] hover:text-[#003087] transition-colors focus:outline-none focus:underline">
                  ← Изменить данные
                </button>
                {!smsUsed && !codeExpired && (
                  <p className="text-xs text-[#b0b3c4]">
                    Не приходит звонок? Проверьте «Не беспокоить» и блокировщики спама
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-[#9b9eb0] mt-6">
          Регистрируясь, вы соглашаетесь с{" "}
          <Link href="/terms" className="hover:underline text-[#737686]">условиями использования</Link>
          {" "}и{" "}
          <Link href="/privacy" className="hover:underline text-[#737686]">политикой конфиденциальности</Link>
        </p>
      </div>
    </div>
  );
}

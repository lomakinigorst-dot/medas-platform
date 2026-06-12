import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f9fb] to-[#e6f9f4] flex items-center justify-center px-4">
      {/* Logo */}
      <div className="absolute top-6 left-6">
        <Link href="/">
          <Image src="/logo-dark.png" alt="MEDAS" width={130} height={38} className="object-contain" />
        </Link>
      </div>

      <div className="w-full max-w-md">
        {/* Role Tabs */}
        <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-[#c3c6d7]/20 mb-6">
          {[
            { label: "Пациент", icon: "👤", href: "?role=patient" },
            { label: "Врач", icon: "👨‍⚕️", href: "?role=doctor" },
            { label: "Клиника", icon: "🏥", href: "?role=clinic" },
          ].map((role, i) => (
            <button
              key={role.label}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${i === 0 ? "bg-[#003087] text-white shadow-sm" : "text-[#434655] hover:text-[#003087]"}`}
            >
              <span>{role.icon}</span>
              {role.label}
            </button>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-[#003087]/8 border border-[#c3c6d7]/20 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-[#191c1e] font-[family-name:var(--font-manrope)] mb-2">
              Добро пожаловать
            </h1>
            <p className="text-[#434655] text-sm">Войдите в личный кабинет пациента</p>
          </div>

          <form className="space-y-5">
            {/* Phone / Email */}
            <div>
              <label className="block text-xs font-bold text-[#434655] uppercase tracking-wider mb-2">
                Телефон или Email
              </label>
              <input
                type="text"
                placeholder="+7 (999) 000-00-00"
                className="w-full bg-[#f7f9fb] border border-[#c3c6d7]/30 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/20 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-[#434655] uppercase tracking-wider">Пароль</label>
                <Link href="/forgot-password" className="text-xs text-[#003087] font-semibold hover:underline">
                  Забыли пароль?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#f7f9fb] border border-[#c3c6d7]/30 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/20 pr-12 transition-all"
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737686] hover:text-[#434655]">
                  👁
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[#003087] to-[#1e40af] text-white font-bold rounded-xl shadow-lg shadow-[#003087]/20 hover:opacity-90 active:scale-95 transition-all"
            >
              Войти
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#c3c6d7]/30"></div>
            <span className="text-xs text-[#737686]">или</span>
            <div className="flex-1 h-px bg-[#c3c6d7]/30"></div>
          </div>

          {/* OTP Login */}
          <button className="w-full py-3.5 border border-[#c3c6d7]/30 rounded-xl text-sm font-semibold text-[#434655] hover:border-[#003087]/40 hover:text-[#003087] transition-all flex items-center justify-center gap-2">
            <span>📱</span> Войти по СМС-коду
          </button>

          {/* Register Link */}
          <p className="text-center text-sm text-[#434655] mt-6">
            Нет аккаунта?{" "}
            <Link href="/register" className="text-[#003087] font-bold hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </div>

        {/* Benefits */}
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

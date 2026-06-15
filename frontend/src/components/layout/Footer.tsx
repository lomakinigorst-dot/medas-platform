import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="w-full mt-20 bg-slate-50 font-body text-xs tracking-wide uppercase">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-10 py-16 max-w-screen-2xl mx-auto">
        {/* Brand */}
        <div className="flex flex-col gap-6">
          <Logo width={120} height={34} />
          <p className="text-slate-500 normal-case tracking-normal text-sm">
            Лидерство в области экспертного медицинского совершенства. Соединяем
            вас с качественной помощью, которую вы заслуживаете.
          </p>
        </div>

        {/* Platform */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-slate-900 mb-2">Платформа</h4>
          <Link href="/search" className="text-slate-500 hover:text-primary transition-colors normal-case tracking-normal">Найти врача</Link>
          <Link href="/doctors" className="text-slate-500 hover:text-primary transition-colors normal-case tracking-normal">Врачи</Link>
          <Link href="/clinics" className="text-slate-500 hover:text-primary transition-colors normal-case tracking-normal">Клиники</Link>
          <Link href="/specialities" className="text-slate-500 hover:text-primary transition-colors normal-case tracking-normal">Специальности</Link>
          <Link href="/offers" className="text-slate-500 hover:text-primary transition-colors normal-case tracking-normal">Предложения</Link>
        </div>

        {/* Support */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-slate-900 mb-2">Поддержка</h4>
          <Link href="/support" className="text-slate-500 hover:text-primary transition-colors normal-case tracking-normal">Служба поддержки</Link>
          <Link href="/terms" className="text-slate-500 hover:text-primary transition-colors normal-case tracking-normal">Условия использования</Link>
          <Link href="/privacy" className="text-slate-500 hover:text-primary transition-colors normal-case tracking-normal">Политика конфиденциальности</Link>
          <Link href="/disclaimer" className="text-slate-500 hover:text-primary transition-colors normal-case tracking-normal">Отказ от ответственности</Link>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-slate-900 mb-2">Рассылка</h4>
          <p className="text-slate-500 normal-case tracking-normal text-sm mb-2">
            Получайте медицинские советы и обновления клиник.
          </p>
          <div className="flex">
            <input
              className="bg-white border border-slate-200 rounded-l-lg px-4 py-3 text-xs w-full focus:outline-none focus:ring-1 ring-primary/20 normal-case tracking-normal"
              placeholder="Email адрес"
              type="email"
            />
            <button className="bg-primary text-white px-4 py-3 rounded-r-lg font-bold hover:bg-primary-container transition-colors">
              ОК
            </button>
          </div>
        </div>
      </div>

      <div className="px-10 py-8 border-t border-slate-200/50 max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 normal-case tracking-normal">
        <p>© 2024 Med-as. Экспертное медицинское совершенство.</p>
        <div className="flex gap-6">
          <Link href="https://t.me" className="hover:text-primary transition-colors">Telegram</Link>
          <Link href="https://vk.com" className="hover:text-primary transition-colors">VK</Link>
          <Link href="https://instagram.com" className="hover:text-primary transition-colors">Instagram</Link>
        </div>
      </div>
    </footer>
  );
}

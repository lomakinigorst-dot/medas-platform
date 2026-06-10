import Link from "next/link";

export default function CTASection() {
  return (
    <section className="px-6 py-20">
      <div className="max-w-screen-2xl mx-auto">
        <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-24 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-headline text-4xl lg:text-6xl font-extrabold text-white tracking-tighter mb-6">
              Готовы найти своего врача?
            </h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-12">
              Присоединяйтесь к тысячам пациентов, которые доверяют Med-as в
              вопросах первичной и специализированной медицинской помощи.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="btn-primary-gradient text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 transition-transform active:scale-95 text-center"
              >
                Создать аккаунт
              </Link>
              <Link
                href="/search"
                className="bg-white/10 text-white border border-white/10 px-10 py-5 rounded-2xl font-bold text-lg backdrop-blur-sm transition-all hover:bg-white/20 text-center"
              >
                Просмотреть каталог
              </Link>
            </div>
          </div>

          {/* Decorative blurs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 blur-[120px] pointer-events-none" />
        </div>
      </div>
    </section>
  );
}

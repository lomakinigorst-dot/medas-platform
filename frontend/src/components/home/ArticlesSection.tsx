import Link from "next/link";

const articles = [
  {
    icon: "🫀",
    rubric: "Кардиология",
    title: "Как распознать ранние признаки сердечно-сосудистых заболеваний",
    date: "10 июня 2026",
    href: "/articles/cardiovascular-early-signs",
  },
  {
    icon: "🧠",
    rubric: "Неврология",
    title: "Мигрень или головная боль напряжения: как отличить и что делать",
    date: "7 июня 2026",
    href: "/articles/migraine-vs-tension",
  },
  {
    icon: "🦷",
    rubric: "Стоматология",
    title: "Профилактика кариеса: советы от ведущих стоматологов MEDAS",
    date: "3 июня 2026",
    href: "/articles/caries-prevention",
  },
];

export default function ArticlesSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-4 block">
              Медицинский блог
            </span>
            <h2 className="font-headline text-4xl font-extrabold tracking-tight">
              Статьи о здоровье
            </h2>
          </div>
          <Link
            href="/articles"
            className="text-primary font-bold hover:underline underline-offset-4 flex items-center gap-2 shrink-0"
          >
            Все статьи
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, i) => (
            <Link
              key={i}
              href={article.href}
              className="group bg-surface-container-low rounded-2xl p-8 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-4xl">{article.icon}</div>
              <div className="text-xs font-bold text-secondary tracking-widest uppercase">
                {article.rubric}
              </div>
              <h3 className="font-headline font-bold text-xl text-on-surface leading-snug group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              <div className="mt-auto pt-4 border-t border-on-surface/10 flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">{article.date}</span>
                <span className="text-primary font-semibold text-sm flex items-center gap-1">
                  Читать
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

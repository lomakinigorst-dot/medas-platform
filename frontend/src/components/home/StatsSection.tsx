"use client";

import { memo, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, type Variants } from "framer-motion";

type Stat = {
  icon: React.ReactNode;
  end: number;
  format: (v: number) => string;
  label: string;
  sub: string;
  color: string;
  bg: string;
};

const stats: Stat[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    end: 10000,
    format: (v) => `${Math.round(v / 1000)} 000+`,
    label: "Врачей",
    sub: "проверенных специалистов",
    color: "text-primary",
    bg: "bg-primary/8",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    end: 500,
    format: (v) => `${Math.round(v)}+`,
    label: "Клиник",
    sub: "по всей России",
    color: "text-secondary",
    bg: "bg-secondary/8",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    end: 1000000,
    format: (v) => {
      if (v < 1000) return `${Math.round(v)}+`;
      if (v < 1000000) return `${Math.floor(v / 1000)} 000+`;
      return "1 000 000+";
    },
    label: "Пациентов",
    sub: "воспользовались сервисом",
    color: "text-primary",
    bg: "bg-primary/8",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    end: 49,
    format: (v) => (v / 10).toFixed(1),
    label: "Рейтинг",
    sub: "средняя оценка врачей",
    color: "text-secondary",
    bg: "bg-secondary/8",
  },
];

const StatCard = memo(function StatCard({ stat }: { stat: Stat }) {
  const count = useMotionValue(0);
  const display = useTransform(count, stat.format);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          animate(count, stat.end, { duration: 1.8, ease: "easeOut" });
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [count, stat.end, stat.format]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center px-6 py-8 lg:py-10">
      <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-5 shrink-0`}>
        {stat.icon}
      </div>
      <motion.div className={`font-headline text-4xl lg:text-5xl font-extrabold tracking-tight ${stat.color} mb-2 whitespace-nowrap`}>
        {display}
      </motion.div>
      <div className="font-headline font-bold text-on-surface text-lg mb-1">{stat.label}</div>
      <div className="text-on-surface-variant text-sm leading-snug max-w-[140px]">{stat.sub}</div>
    </div>
  );
});

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function StatsSection() {
  return (
    <section className="py-4 px-6 bg-surface-container-lowest border-y border-outline-variant/40">
      <motion.div
        className="max-w-screen-2xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-outline-variant/40"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        {stats.map((s, i) => (
          <motion.div key={i} variants={cardItem}>
            <StatCard stat={s} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

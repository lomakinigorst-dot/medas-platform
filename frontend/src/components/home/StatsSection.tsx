"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 10000, suffix: "+", label: "Врачей", sublabel: "проверенных специалистов" },
  { value: 500, suffix: "+", label: "Клиник", sublabel: "по всей России" },
  { value: 1000000, suffix: "+", label: "Пациентов", sublabel: "воспользовались сервисом" },
  { value: 4.9, suffix: "", label: "Рейтинг", sublabel: "средняя оценка врачей" },
];

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(0) + " млн";
  if (n >= 1000) return (n / 1000).toFixed(0) + " тыс";
  return n.toFixed(n % 1 !== 0 ? 1 : 0);
}

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const duration = 1800;

  useEffect(() => {
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * target);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target]);

  return (
    <span>
      {formatNumber(count)}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-16 px-6 bg-primary">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 divide-y-2 lg:divide-y-0 lg:divide-x divide-white/20">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center text-center px-8 py-4 lg:py-0">
            <div className="font-headline text-4xl lg:text-5xl font-extrabold text-white mb-1">
              {visible ? <Counter target={stat.value} suffix={stat.suffix} /> : "0"}
            </div>
            <div className="text-white font-bold text-lg mb-1">{stat.label}</div>
            <div className="text-white/60 text-sm">{stat.sublabel}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

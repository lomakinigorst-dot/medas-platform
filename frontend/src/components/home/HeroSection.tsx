"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { StarIcon } from "@/components/ui/StarIcon";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: "easeOut" as const },
});

const fadeRight = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.75, delay: 0.2, ease: "easeOut" as const },
};

const POPULAR_QUERIES = ["Стоматолог", "Терапевт", "Кардиолог", "Гинеколог", "Педиатр"].map((q) => ({
  label: q,
  href: `/search?q=${encodeURIComponent(q)}`,
}));

export default function HeroSection() {
  return (
    <section className="hero-gradient px-6 pb-20 lg:pb-28 pt-10 lg:pt-14">
      <div className="max-w-screen-2xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Heading + Search */}
        <div>
          <motion.h1
            className="font-headline text-5xl lg:text-7xl font-extrabold tracking-tighter text-on-surface leading-[1.1] mb-6"
            {...fadeUp(0.05)}
          >
            Найдите врача и{" "}
            <span className="text-secondary">запишитесь</span> онлайн — без звонков и очередей.
          </motion.h1>
          <motion.p
            className="text-on-surface-variant text-xl mb-10 max-w-xl"
            {...fadeUp(0.2)}
          >
            Выберите из 10 000+ проверенных специалистов, прочитайте отзывы пациентов и запишитесь онлайн за 2 минуты.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            className="bg-surface-container-lowest p-2 rounded-xl shadow-xl shadow-blue-900/5 flex flex-col md:flex-row gap-2"
            {...fadeUp(0.35)}
          >
            <div className="flex-1 flex items-center px-4 gap-3 bg-surface-container-low rounded-lg focus-within:ring-2 ring-primary/10 transition-all">
              <svg className="w-5 h-5 text-outline flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                className="w-full bg-transparent border-none focus:ring-0 py-4 text-on-surface placeholder:text-outline outline-none"
                placeholder="Симптомы, врачи или клиники..."
                type="text"
              />
            </div>
            <div className="w-full md:w-48 flex items-center px-4 gap-3 bg-surface-container-low rounded-lg focus-within:ring-2 ring-primary/10 transition-all">
              <svg className="w-5 h-5 text-outline flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                className="w-full bg-transparent border-none focus:ring-0 py-4 text-on-surface font-medium outline-none"
                placeholder="Локация"
                type="text"
                defaultValue="Москва"
              />
            </div>
            <button className="btn-primary-gradient text-white px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-transform active:scale-95">
              Поиск
            </button>
          </motion.div>

          {/* Popular search chips */}
          <motion.div className="flex flex-wrap items-center gap-2 mt-4" {...fadeUp(0.5)}>
            <span className="text-on-surface-variant text-sm">Популярные:</span>
            {POPULAR_QUERIES.map((chip) => (
              <Link
                key={chip.label}
                href={chip.href}
                className="px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {chip.label}
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Right: Doctor image + badge */}
        <motion.div className="relative hidden lg:block" {...fadeRight}>
          <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
            <Image
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80"
              alt="Врач в клинике"
              fill
              className="object-cover"
            />
          </div>

          {/* Floating badge */}
          <motion.div
            className="absolute -bottom-10 -left-10 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 max-w-xs"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" as const }}
          >
            <div className="flex gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className="w-5 h-5 text-secondary" />
              ))}
            </div>
            <p className="font-headline font-bold text-on-surface">500+ Клиник-партнёров</p>
            <p className="text-sm text-on-surface-variant">Реальные отзывы пациентов по каждому врачу.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

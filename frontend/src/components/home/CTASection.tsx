"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.75, ease: "easeOut", staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const child: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function CTASection() {
  return (
    <section className="px-6 py-20">
      <div className="max-w-screen-2xl mx-auto">
        <motion.div
          className="bg-slate-900 rounded-[3rem] p-12 lg:p-24 text-center relative overflow-hidden"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="relative z-10">
            <motion.h2
              className="font-headline text-4xl lg:text-6xl font-extrabold text-white tracking-tighter mb-6"
              variants={child}
            >
              Готовы найти своего врача?
            </motion.h2>
            <motion.p
              className="text-slate-400 text-xl max-w-2xl mx-auto mb-12"
              variants={child}
            >
              Присоединяйтесь к тысячам пациентов, которые доверяют Med-as в
              вопросах первичной и специализированной медицинской помощи.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={child}
            >
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
            </motion.div>
          </div>

          {/* Decorative blurs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 blur-[120px] pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}

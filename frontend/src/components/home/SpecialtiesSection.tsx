"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { staggerContainer, fadeUpItem } from "@/lib/motion";

const specialties = [
  { icon: "❤️", name: "Кардиология", slug: "cardiology" },
  { icon: "🧠", name: "Неврология", slug: "neurology" },
  { icon: "🔬", name: "Дерматология", slug: "dermatology" },
  { icon: "🦷", name: "Стоматология", slug: "dentistry" },
  { icon: "👁️", name: "Офтальмология", slug: "ophthalmology" },
  { icon: "👶", name: "Педиатрия", slug: "pediatrics" },
];

const container = staggerContainer(0.07);
const item = fadeUpItem(20, 0.5);

export default function SpecialtiesSection() {
  return (
    <section className="py-24 px-6 bg-surface">
      <div className="max-w-screen-2xl mx-auto">
        <motion.div
          className="flex justify-between items-end mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <div>
            <h2 className="font-headline text-3xl font-extrabold tracking-tight mb-2">
              Популярные направления
            </h2>
            <p className="text-on-surface-variant">
              Высокоточная помощь в различных медицинских дисциплинах.
            </p>
          </div>
          <Link
            href="/specialities"
            className="text-primary font-bold flex items-center gap-1 hover:underline"
          >
            Смотреть все{" "}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {specialties.map((spec) => (
            <motion.div key={spec.slug} variants={item}>
              <Link
                href={`/specialities/${spec.slug}`}
                className="flex flex-col items-center bg-surface-container-low hover:bg-surface-container-high p-8 rounded-xl text-center transition-all duration-300 group cursor-pointer"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <span className="text-3xl">{spec.icon}</span>
                </div>
                <p className="font-headline font-bold text-on-surface">{spec.name}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

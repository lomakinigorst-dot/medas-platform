"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StarIcon } from "@/components/ui/StarIcon";
import { fadeUpItem } from "@/lib/motion";
import type { Doctor } from "@/lib/doctors";

const ruPrice = new Intl.NumberFormat("ru-RU");
const tabVariant = fadeUpItem(16, 0.4);

type Tab = "about" | "services" | "reviews";

const TABS: { id: Tab; label: string }[] = [
  { id: "about", label: "О враче" },
  { id: "services", label: "Услуги и цены" },
  { id: "reviews", label: "Отзывы" },
];

function AboutTab({ doctor }: { doctor: Doctor }) {
  return (
    <motion.div variants={tabVariant} initial="hidden" animate="show" className="space-y-8">
      <div className="bg-surface-container-lowest rounded-2xl p-6">
        <h3 className="font-headline font-bold text-on-surface mb-3">О враче</h3>
        <p className="text-on-surface-variant leading-relaxed">{doctor.bio}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-base">🎓</span>
            <h3 className="font-headline font-bold text-on-surface">Образование</h3>
          </div>
          <ul className="space-y-4">
            {doctor.education.map((edu, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-secondary flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-on-surface">{edu.institution}</p>
                  <p className="text-xs text-on-surface-variant">{edu.degree} · {edu.year}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center text-base">🏥</span>
            <h3 className="font-headline font-bold text-on-surface">Специализации</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {doctor.specializations.map((s) => (
              <span key={s} className="px-3 py-1.5 bg-secondary/8 text-secondary text-xs font-semibold rounded-lg">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ServicesTab({ doctor }: { doctor: Doctor }) {
  return (
    <motion.div variants={tabVariant} initial="hidden" animate="show">
      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-container text-left">
              <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wide">Услуга</th>
              <th className="px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wide hidden sm:table-cell">Длительность</th>
              <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wide text-right">Стоимость</th>
            </tr>
          </thead>
          <tbody>
            {doctor.services.map((service, i) => (
              <tr key={i} className="border-t border-outline-variant/20 hover:bg-surface-container/50 transition-colors">
                <td className="px-6 py-4 font-medium text-sm text-on-surface">{service.name}</td>
                <td className="px-4 py-4 text-sm text-on-surface-variant hidden sm:table-cell">{service.duration}</td>
                <td className="px-6 py-4 text-right">
                  <span className="font-headline font-bold text-on-surface whitespace-nowrap">
                    {ruPrice.format(service.price)} ₽
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-on-surface-variant px-1">
        * Цены указаны за стандартный приём. Стоимость может отличаться в зависимости от сложности случая.
      </p>
    </motion.div>
  );
}

function ReviewsTab({ doctor }: { doctor: Doctor }) {
  const breakdown = doctor.ratingBreakdown;
  const stars = [5, 4, 3, 2, 1] as const;

  return (
    <motion.div variants={tabVariant} initial="hidden" animate="show" className="space-y-6">
      {/* Summary */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start">
        <div className="text-center flex-shrink-0">
          <p className="font-headline text-5xl font-extrabold text-on-surface">{doctor.rating.toFixed(1)}</p>
          <div className="flex gap-0.5 justify-center mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <StarIcon
                key={i}
                className={`w-4 h-4 ${i <= Math.round(doctor.rating) ? "text-amber-400" : "text-outline-variant"}`}
              />
            ))}
          </div>
          <p className="text-sm text-on-surface-variant mt-1">{doctor.reviewCount} отзывов</p>
        </div>
        <div className="flex-1 w-full space-y-2">
          {stars.map((star) => (
            <div key={star} className="flex items-center gap-3">
              <span className="text-xs text-on-surface-variant w-3 text-right">{star}</span>
              <StarIcon className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${breakdown[star]}%` }}
                />
              </div>
              <span className="text-xs text-on-surface-variant w-8 text-right">{breakdown[star]}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review cards */}
      <div className="space-y-4">
        {doctor.reviews.length === 0 ? (
          <p className="text-center text-on-surface-variant py-8">Отзывов пока нет</p>
        ) : (
          doctor.reviews.map((review) => (
            <div key={review.id} className="bg-surface-container-lowest rounded-2xl p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {review.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-on-surface">{review.name}</p>
                    <p className="text-xs text-on-surface-variant">{review.date}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <StarIcon
                      key={i}
                      className={`w-4 h-4 ${i <= review.rating ? "text-amber-400" : "text-outline-variant"}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed">&ldquo;{review.text}&rdquo;</p>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

export default function DoctorTabs({ doctor }: { doctor: Doctor }) {
  const [active, setActive] = useState<Tab>("about");

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 bg-surface-container rounded-2xl p-1 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${
              active === tab.id
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <div key={active}>
          {active === "about" && <AboutTab doctor={doctor} />}
          {active === "services" && <ServicesTab doctor={doctor} />}
          {active === "reviews" && <ReviewsTab doctor={doctor} />}
        </div>
      </AnimatePresence>
    </div>
  );
}

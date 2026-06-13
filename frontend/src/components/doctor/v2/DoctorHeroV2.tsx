"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { StarIcon } from "@/components/ui/StarIcon";
import { fadeUpItem } from "@/lib/motion";
import type { Doctor } from "@/lib/doctors";

const heroVariant = fadeUpItem(20, 0.5);

export default function DoctorHeroV2({ doctor }: { doctor: Doctor }) {
  const filled = Math.round(doctor.rating);

  return (
    <motion.section
      variants={heroVariant}
      initial="hidden"
      animate="show"
      className="flex flex-col md:flex-row gap-8 items-start"
    >
      {/* Compact square photo */}
      <div className="relative w-44 h-44 flex-shrink-0">
        <Image
          src={doctor.photo}
          alt={doctor.name}
          fill
          className="object-cover object-top rounded-2xl shadow-lg ring-4 ring-white"
          sizes="176px"
          priority
        />
        {/* Verified badge on photo */}
        {doctor.verified && (
          <div className="absolute -bottom-2 -right-2 bg-secondary text-white w-9 h-9 rounded-full shadow-md flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-4 flex-1">
        {/* Badges above name */}
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-secondary text-white text-[10px] font-bold rounded uppercase tracking-wider">
            Топ рейтинг 2024
          </span>
          <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant text-[10px] font-bold rounded uppercase tracking-wide">
            Опыт {doctor.experience}+ лет
          </span>
          {doctor.status === "online" ? (
            <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-bold rounded uppercase tracking-wide flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
              Принимает онлайн
            </span>
          ) : (
            <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded uppercase tracking-wide flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
              Принимает сегодня
            </span>
          )}
        </div>

        {/* Name */}
        <h1 className="font-headline text-3xl lg:text-4xl font-extrabold tracking-tight text-on-surface">
          {doctor.name}
        </h1>
        <p className="text-xl text-primary font-semibold">{doctor.specialty}</p>

        {/* Rating + languages */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((i) => (
                <StarIcon key={i} className={`w-4 h-4 ${i <= filled ? "text-amber-400" : "text-outline-variant"}`} />
              ))}
            </div>
            <span className="font-bold text-on-surface">{doctor.rating.toFixed(1)}</span>
            <span className="text-on-surface-variant">({doctor.reviewCount} отзывов)</span>
          </div>
          <div className="h-3 w-px bg-outline-variant/40 hidden sm:block" />
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span>Русский, Английский</span>
          </div>
        </div>

        {/* DMS + Online badges */}
        <div className="flex flex-wrap gap-2 pt-1">
          {doctor.acceptsDMS && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-bold">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Принимает ДМС
            </span>
          )}
          {doctor.onlineAppointment && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-bold">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Онлайн-приём
            </span>
          )}
        </div>
      </div>
    </motion.section>
  );
}

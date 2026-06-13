import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { StarIcon } from "@/components/ui/StarIcon";
import { fadeUpItem } from "@/lib/motion";
import type { Doctor } from "@/lib/doctors";

const ruPrice = new Intl.NumberFormat("ru-RU");

const heroVariant = fadeUpItem(24, 0.55);

export default function DoctorHero({ doctor }: { doctor: Doctor }) {
  const filled = Math.round(doctor.rating);

  return (
    <motion.section
      className="bg-surface-container-lowest rounded-3xl overflow-hidden"
      variants={heroVariant}
      initial="hidden"
      animate="show"
    >
      <div className="flex flex-col md:flex-row gap-0">
        {/* Photo */}
        <div className="relative w-full md:w-72 lg:w-80 flex-shrink-0">
          <div className="relative h-72 md:h-full min-h-[340px]">
            <Image
              src={doctor.photo}
              alt={doctor.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 320px"
              priority
            />
            {/* Status badge over photo */}
            <div className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm ${
              doctor.status === "online"
                ? "bg-secondary text-white"
                : "bg-amber-500 text-white"
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
              {doctor.status === "online" ? "Принимает онлайн" : "Принимает сегодня"}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 p-8 flex flex-col gap-5">
          {/* Name + specialty */}
          <div>
            <h1 className="font-headline text-3xl lg:text-4xl font-extrabold tracking-tight text-on-surface mb-1">
              {doctor.name}
            </h1>
            <p className="text-secondary font-semibold text-lg">
              {doctor.specialty} · Опыт {doctor.experience} лет
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <StarIcon
                  key={i}
                  className={`w-5 h-5 ${i <= filled ? "text-amber-400" : "text-outline-variant"}`}
                />
              ))}
            </div>
            <span className="font-headline font-bold text-on-surface">
              {doctor.rating.toFixed(1)}
            </span>
            <span className="text-on-surface-variant text-sm">
              {doctor.reviewCount} отзывов
            </span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {doctor.verified && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Проверен MEDAS
              </span>
            )}
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

          {/* Clinic */}
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <svg className="w-4 h-4 text-outline flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span>{doctor.clinic.name} · м. {doctor.clinic.metro}</span>
          </div>

          {/* Price + CTA (mobile only — desktop has sidebar) */}
          <div className="flex items-center gap-4 pt-2 md:hidden">
            <div>
              <p className="text-xs text-on-surface-variant">Первичная консультация</p>
              <p className="font-headline font-extrabold text-xl text-on-surface whitespace-nowrap">
                от {ruPrice.format(doctor.price)} ₽
              </p>
            </div>
            <Link
              href={`/doctor/${doctor.slug}/booking`}
              className="flex-1 btn-primary-gradient text-white py-3.5 rounded-xl font-bold text-center transition-transform active:scale-95"
            >
              Записаться
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

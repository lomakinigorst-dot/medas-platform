"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { StarIcon } from "@/components/ui/StarIcon";
import { staggerContainer, fadeUpItem } from "@/lib/motion";
import { fetchClinics, type ApiClinic } from "@/lib/api";

const CLINIC_COLORS = [
  "from-[#003087] to-[#1e40af]",
  "from-[#00a982] to-[#006644]",
  "from-[#6750a4] to-[#4a3880]",
  "from-[#b3261e] to-[#7c1d1a]",
];

const container = staggerContainer();
const cardVariant = fadeUpItem(24);

function ClinicImage({ clinic, colorClass }: { clinic: ApiClinic; colorClass: string }) {
  if (clinic.logo_url) {
    return (
      <Image
        src={clinic.logo_url}
        alt={clinic.name}
        fill
        className="object-cover"
        unoptimized
      />
    );
  }
  return (
    <div className={`w-full h-full bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
      <span className="text-white/30 text-4xl font-extrabold select-none">
        {clinic.name.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}

export default function ClinicsSection() {
  const [clinics, setClinics] = useState<ApiClinic[]>([]);

  useEffect(() => {
    fetchClinics().then((data) => {
      if (data) setClinics(data.slice(0, 4));
    });
  }, []);

  if (clinics.length === 0) {
    return (
      <section className="py-24 px-6 bg-surface-container-low">
        <div className="max-w-screen-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline text-4xl font-extrabold tracking-tight mb-4 text-on-surface">
              Лучшие клиники
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-48">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="bg-surface-container-lowest rounded-3xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const [featured, horizontal, ...small] = clinics;

  return (
    <section className="py-24 px-6 bg-surface-container-low">
      <div className="max-w-screen-2xl mx-auto">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <h2 className="font-headline text-4xl font-extrabold tracking-tight mb-4 text-on-surface">
            Лучшие клиники
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">
            Откройте для себя медицинские учреждения, проверенные на соответствие
            стандартам качества и удовлетворенности пациентов.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 lg:h-[700px]"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {/* Featured clinic — big */}
          {featured && (
            <motion.div
              className="md:col-span-2 md:row-span-2 bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm flex flex-col group cursor-pointer"
              variants={cardVariant}
            >
              <div className="relative flex-1 overflow-hidden min-h-[300px]">
                <ClinicImage clinic={featured} colorClass={CLINIC_COLORS[0]} />
                {featured.accepts_dms && (
                  <div className="absolute top-6 left-6 bg-secondary text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                    ДМС
                  </div>
                )}
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-headline text-2xl font-bold mb-1">{featured.name}</h3>
                    <p className="text-on-surface-variant flex items-center gap-1 text-sm">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {featured.metro ? `м. ${featured.metro} · ` : ""}{featured.address}
                    </p>
                  </div>
                  <div className="bg-secondary-container px-3 py-1 rounded-lg text-secondary font-bold flex items-center gap-1">
                    {featured.rating.toFixed(1)} <StarIcon className="w-4 h-4 text-secondary" />
                  </div>
                </div>
                {featured.description && (
                  <p className="text-on-surface-variant text-sm mb-6 line-clamp-2">{featured.description}</p>
                )}
                <Link
                  href={`/clinic/${featured.slug}`}
                  className="block w-full btn-primary-gradient text-white py-4 rounded-xl font-bold text-lg text-center transition-transform active:scale-95"
                >
                  Записаться на приём
                </Link>
              </div>
            </motion.div>
          )}

          {/* Horizontal clinic */}
          {horizontal && (
            <motion.div
              className="md:col-span-2 md:row-span-1 bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm flex flex-row group cursor-pointer"
              variants={cardVariant}
            >
              <div className="w-1/3 relative overflow-hidden min-h-[160px]">
                <ClinicImage clinic={horizontal} colorClass={CLINIC_COLORS[1]} />
              </div>
              <div className="w-2/3 p-6 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-headline text-xl font-bold">{horizontal.name}</h3>
                  <div className="text-secondary font-bold flex items-center gap-1">
                    {horizontal.rating.toFixed(1)} <StarIcon className="w-4 h-4 text-secondary" />
                  </div>
                </div>
                <p className="text-on-surface-variant text-sm mb-4 line-clamp-2">
                  {horizontal.description ?? horizontal.address}
                </p>
                <Link
                  href={`/clinic/${horizontal.slug}`}
                  className="self-start text-primary font-bold flex items-center gap-1 group/btn"
                >
                  Забронировать слот{" "}
                  <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          )}

          {/* Small clinics */}
          {small.map((clinic, idx) => (
            <motion.div
              key={clinic.slug}
              className="md:col-span-1 md:row-span-1 bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm group cursor-pointer"
              variants={cardVariant}
            >
              <div className="h-1/2 relative overflow-hidden min-h-[140px]">
                <ClinicImage clinic={clinic} colorClass={CLINIC_COLORS[idx + 2] ?? CLINIC_COLORS[0]} />
              </div>
              <div className="p-6">
                <h3 className="font-headline font-bold mb-1">{clinic.name}</h3>
                <div className="flex items-center gap-1 text-sm text-secondary font-bold mb-3">
                  {clinic.rating.toFixed(1)} <StarIcon className="w-4 h-4 text-secondary" />
                  {clinic.review_count > 0 && (
                    <span className="text-on-surface-variant font-normal">({clinic.review_count} отзывов)</span>
                  )}
                </div>
                <Link
                  href={`/clinic/${clinic.slug}`}
                  className="block w-full py-2 border border-primary/20 rounded-lg text-primary font-bold text-sm text-center hover:bg-primary/5 transition-colors"
                >
                  Запись
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

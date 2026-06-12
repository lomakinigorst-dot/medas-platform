"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { StarIcon } from "@/components/ui/StarIcon";
import { staggerContainer, fadeUpItem } from "@/lib/motion";

const clinics = [
  {
    id: "st-ethos",
    name: "Медицинский центр St. Ethos",
    location: "Хамовники, Москва",
    rating: 4.9,
    badge: "Премиум выбор",
    tags: ["24/7 Скорая", "Роботизированная хирургия"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9Z7nADul-mopLDA9aHRIP4YtRcEykQhnvniUalQdhqZWchUFd1WHXzvp_hKj6RM1IkacmY2_j7tvcoFX66ya_LzljM618PlE4cEDaQWgci4kiUss09NI7sZYsOgm1tLwAD3NCn8N_4W2OUGPD5HsHQL4ebb-19CbSZcD8cw934ht6pYEKCVdCRPb8_imeI9rxfh3Hfh9teTDayoVxCHz-kBPpNaerqHqw6gnb36F9zwHrBg2a-krLsM8yivirA5Dyujbjy2PDOIr5",
    featured: true,
  },
  {
    id: "lumina-dental",
    name: "Lumina Dental Arts",
    location: "Пресня, Москва",
    rating: 4.8,
    description: "Специализация на эстетической стоматологии и восстановительном искусстве.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfji4DzvQwAS_vE5WAW1Qu2Uc-h0Bk70_CUz_K7Yn39JxEK_STOGWXKepw505VCwfRs2E1BeZ9yhXxT9kM07iDPePMliXk0HWzD3nPfMVBOpxWBVsPLqCNZVGfXQUu-VCsLh85FiLJy960lRGhAV8XlpjDMR8lkDoU9bhQHoa8GnecMg2XCJtRflsRrc3dJcodhmSoLBTMUIM744Gf582JtC1M_aV_fNp4gJ2auPQTXR7fD9FM5VOkZ5Uybr2umOGl_uTOUwpjvPGA",
    featured: false,
    horizontal: true,
  },
  {
    id: "kindred-pediatrics",
    name: "Kindred Pediatrics",
    rating: 5.0,
    reviewCount: "1.2k",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxlrGg968dc2U1Hgky8rtnaBSdYNDDFa24b4sKya2ivDVfCLjWWE8WhzbbYD18znoAl6a_MFIlQa-UftXOWpAJZw2u99qGlOrHXDxQXZgoY8igyEFm4a5MktvR4EsHDbkoB2UXz1xUHINjYND3eyJ2lID0ZejBWs4nfV26uvtBob1QsISLf1Cy4RYkLGSgOuzggsrjDH9xvDmb4renk3a_IJTtcBfJock8u7pW9uDv7wwnvXmRr_3swZq4t",
    featured: false,
  },
  {
    id: "bloom-wellness",
    name: "Bloom Wellness",
    rating: 4.7,
    reviewCount: "840",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKtcddeCJo2aaollHWQh_nxi13IbCEBciLCk2L0LwoWwj3hVhhLsCJJiqxL65YlPRx860rs051QsGmZqVKH8czhe5YeYBwzAuRZPKNrjOHTPs2-TD9XrvNsOZMdR20GjPafAKx_PSy0LjqHCAHizEpY6DB3WEYh8ZfaJImxwEkCDtNBlEcAVAn2ywR4kwE9oIW74-l4CdRZ_XdWasCPEdZNLvicNgFivd2dJ2mVPDqr0eXkucz68s7KHxlZpCoXTlUQqdwZneWVjVC",
    featured: false,
  },
];

const container = staggerContainer();
const cardVariant = fadeUpItem(24);

export default function ClinicsSection() {
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
          <motion.div
            className="md:col-span-2 md:row-span-2 bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm flex flex-col group cursor-pointer"
            variants={cardVariant}
          >
            <div className="relative flex-1 overflow-hidden min-h-[300px]">
              <Image
                src={featured.image}
                alt={featured.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                unoptimized
              />
              <div className="absolute top-6 left-6 bg-secondary text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                {featured.badge}
              </div>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-headline text-2xl font-bold mb-1">{featured.name}</h3>
                  <p className="text-on-surface-variant flex items-center gap-1 text-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {featured.location}
                  </p>
                </div>
                <div className="bg-secondary-container px-3 py-1 rounded-lg text-secondary font-bold flex items-center gap-1">
                  {featured.rating} <StarIcon className="w-4 h-4 text-secondary" />
                </div>
              </div>
              <div className="flex gap-2 mb-8 flex-wrap">
                {featured.tags?.map((tag) => (
                  <span key={tag} className="bg-surface-container-high px-3 py-1 rounded text-xs font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={`/clinics/${featured.id}`}
                className="block w-full btn-primary-gradient text-white py-4 rounded-xl font-bold text-lg text-center transition-transform active:scale-95"
              >
                Записаться на приём
              </Link>
            </div>
          </motion.div>

          {/* Horizontal clinic */}
          <motion.div
            className="md:col-span-2 md:row-span-1 bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm flex flex-row group cursor-pointer"
            variants={cardVariant}
          >
            <div className="w-1/3 relative overflow-hidden min-h-[160px]">
              <Image
                src={horizontal.image}
                alt={horizontal.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                unoptimized
              />
            </div>
            <div className="w-2/3 p-6 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-headline text-xl font-bold">{horizontal.name}</h3>
                <div className="text-secondary font-bold flex items-center gap-1">
                  {horizontal.rating} <StarIcon className="w-4 h-4 text-secondary" />
                </div>
              </div>
              <p className="text-on-surface-variant text-sm mb-4">{horizontal.description}</p>
              <Link
                href={`/clinics/${horizontal.id}`}
                className="self-start text-primary font-bold flex items-center gap-1 group/btn"
              >
                Забронировать слот{" "}
                <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* Small clinics */}
          {small.map((clinic) => (
            <motion.div
              key={clinic.id}
              className="md:col-span-1 md:row-span-1 bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm group cursor-pointer"
              variants={cardVariant}
            >
              <div className="h-1/2 relative overflow-hidden min-h-[140px]">
                <Image
                  src={clinic.image}
                  alt={clinic.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  unoptimized
                />
              </div>
              <div className="p-6">
                <h3 className="font-headline font-bold mb-1">{clinic.name}</h3>
                <div className="flex items-center gap-1 text-sm text-secondary font-bold mb-3">
                  {clinic.rating} <StarIcon className="w-4 h-4 text-secondary" />
                  {clinic.reviewCount && (
                    <span className="text-on-surface-variant font-normal">({clinic.reviewCount} отзывов)</span>
                  )}
                </div>
                <Link
                  href={`/clinics/${clinic.id}`}
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

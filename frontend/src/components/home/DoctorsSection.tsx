"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { StarIcon } from "@/components/ui/StarIcon";
import { staggerContainer, fadeUpItem } from "@/lib/motion";

type DoctorStatus = "online" | "today";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  reviews: number;
  price: number;
  status: DoctorStatus;
  avatar: string;
  slug: string;
};

const STATUS_CONFIG: Record<DoctorStatus, { dot: string; badge: string; label: string }> = {
  online: { dot: "bg-secondary", badge: "bg-secondary/10 text-secondary", label: "Онлайн" },
  today:  { dot: "bg-amber-400",  badge: "bg-amber-50 text-amber-700",     label: "Сегодня" },
};

const ruPrice = new Intl.NumberFormat("ru-RU");

const doctors: Doctor[] = [
  {
    id: "1",
    name: "Анна Соколова",
    specialty: "Кардиолог",
    experience: 12,
    rating: 4.9,
    reviews: 184,
    price: 2500,
    status: "online",
    avatar: "https://i.pravatar.cc/150?u=anna-sokolova",
    slug: "anna-sokolova",
  },
  {
    id: "2",
    name: "Игорь Петров",
    specialty: "Хирург",
    experience: 18,
    rating: 4.8,
    reviews: 212,
    price: 3000,
    status: "today",
    avatar: "https://i.pravatar.cc/150?u=igor-petrov",
    slug: "igor-petrov",
  },
  {
    id: "3",
    name: "Мария Козлова",
    specialty: "Педиатр",
    experience: 9,
    rating: 5.0,
    reviews: 147,
    price: 1800,
    status: "online",
    avatar: "https://i.pravatar.cc/150?u=maria-kozlova",
    slug: "maria-kozlova",
  },
];

const container = staggerContainer(0.12);
const cardItem = fadeUpItem(24, 0.5);

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon
          key={i}
          className={`w-4 h-4 ${i <= filled ? "text-amber-400" : "text-outline-variant"}`}
        />
      ))}
      <span className="text-sm font-semibold text-on-surface ml-1">{rating.toFixed(1)}</span>
      <span className="text-sm text-on-surface-variant">({reviews})</span>
    </div>
  );
}

function DoctorCard({ doctor }: { doctor: Doctor }) {
  const statusCfg = STATUS_CONFIG[doctor.status];
  return (
    <div className="bg-surface-container-lowest rounded-[12px] border border-outline-variant/40 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow h-full">
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-outline-variant/20">
            <Image
              src={doctor.avatar}
              alt={doctor.name}
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${statusCfg.dot}`} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-headline font-bold text-on-surface text-lg leading-tight">{doctor.name}</h3>
          <p className="text-on-surface-variant text-sm mt-0.5">{doctor.specialty}</p>
          <p className="text-outline text-xs mt-1">Стаж {doctor.experience} лет</p>
        </div>
        <div className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${statusCfg.badge}`}>
          {statusCfg.label}
        </div>
      </div>

      <StarRating rating={doctor.rating} reviews={doctor.reviews} />

      <div className="flex items-center justify-between mt-auto pt-2">
        <div>
          <span className="text-on-surface-variant text-xs">Приём от</span>
          <p className="font-headline font-bold text-on-surface text-xl whitespace-nowrap">
            {ruPrice.format(doctor.price)}&nbsp;₽
          </p>
        </div>
        <Link
          href={`/doctor/${doctor.slug}`}
          className="btn-primary-gradient text-white text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
        >
          Записаться
        </Link>
      </div>
    </div>
  );
}

export default function DoctorsSection() {
  return (
    <section className="py-16 lg:py-20 px-6 bg-surface">
      <div className="max-w-screen-2xl mx-auto">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <div>
            <h2 className="font-headline text-3xl lg:text-4xl font-extrabold text-on-surface">
              Топ специалисты
            </h2>
            <p className="text-on-surface-variant mt-2">Врачи с лучшими отзывами пациентов</p>
          </div>
          <Link
            href="/search"
            className="text-primary font-semibold text-sm flex items-center gap-1 hover:underline shrink-0"
          >
            Смотреть всех врачей
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {doctors.map((doctor) => (
            <motion.div key={doctor.id} variants={cardItem}>
              <DoctorCard doctor={doctor} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { StarIcon } from "@/components/ui/StarIcon";
import type { Doctor } from "@/lib/doctors";

export default function DoctorBookingCard({ doctor }: { doctor: Doctor }) {
  const filled = Math.round(doctor.rating);
  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
      {/* Back link */}
      <div className="px-5 pt-4 pb-3 border-b border-outline-variant/10">
        <Link
          href={`/doctor/${doctor.slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors font-medium"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Назад к профилю
        </Link>
      </div>

      {/* Doctor info */}
      <div className="p-5 flex items-start gap-4">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
          <Image
            src={doctor.photo}
            alt={doctor.name}
            fill
            className="object-cover object-top"
            sizes="64px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-headline font-bold text-on-surface leading-tight">{doctor.name}</p>
          <p className="text-secondary text-sm font-semibold mt-0.5">
            {doctor.specialty} · {doctor.experience} лет
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <StarIcon
                  key={i}
                  className={`w-3.5 h-3.5 ${i <= filled ? "text-amber-400" : "text-outline-variant"}`}
                />
              ))}
            </div>
            <span className="text-xs text-on-surface-variant">{doctor.rating} · {doctor.reviewCount} отз.</span>
          </div>
        </div>
      </div>

      {/* Verified badge */}
      {doctor.verified && (
        <div className="mx-5 mb-4 flex items-center gap-2 bg-secondary/8 text-secondary px-3 py-2 rounded-lg">
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-.866 3.483 3.745 3.745 0 01-3.483.866A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.483-.866 3.745 3.745 0 01-.866-3.483A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 01.866-3.483 3.746 3.746 0 013.483-.866A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.483.866 3.746 3.746 0 01.866 3.483A3.745 3.745 0 0121 12z" />
          </svg>
          <span className="text-xs font-bold">Проверенный специалист MEDAS</span>
        </div>
      )}

      {/* Clinic */}
      <div className="px-5 pb-5 border-t border-outline-variant/10 pt-4 space-y-1">
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Место приёма</p>
        <p className="text-sm font-semibold text-on-surface">{doctor.clinic.name}</p>
        <p className="text-xs text-on-surface-variant">{doctor.clinic.address}</p>
        <p className="text-xs text-secondary font-semibold">м. {doctor.clinic.metro}</p>
      </div>
    </div>
  );
}

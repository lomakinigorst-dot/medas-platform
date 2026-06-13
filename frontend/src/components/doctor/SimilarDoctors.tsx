import Image from "next/image";
import Link from "next/link";
import { StarIcon } from "@/components/ui/StarIcon";
import type { Doctor } from "@/lib/doctors";

const ruPrice = new Intl.NumberFormat("ru-RU");

export default function SimilarDoctors({ doctors }: { doctors: Doctor[] }) {
  if (doctors.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="font-headline text-2xl font-extrabold text-on-surface mb-6">
        Похожие врачи
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <Link
            key={doctor.id}
            href={`/doctor/${doctor.slug}`}
            className="group bg-surface-container-lowest rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative h-52">
              <Image
                src={doctor.photo}
                alt={doctor.name}
                fill
                className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
                doctor.status === "online"
                  ? "bg-secondary text-white"
                  : "bg-amber-500 text-white"
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
                {doctor.status === "online" ? "Онлайн" : "Сегодня"}
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-headline font-bold text-on-surface group-hover:text-primary transition-colors">
                {doctor.name}
              </h3>
              <p className="text-secondary text-sm font-semibold mt-0.5">
                {doctor.specialty} · {doctor.experience} лет
              </p>
              <div className="flex items-center gap-1.5 mt-3">
                <StarIcon className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-sm text-on-surface">{doctor.rating.toFixed(1)}</span>
                <span className="text-xs text-on-surface-variant">({doctor.reviewCount})</span>
                <span className="ml-auto font-headline font-bold text-sm text-on-surface">
                  от {ruPrice.format(doctor.price)} ₽
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

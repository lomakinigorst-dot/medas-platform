import Link from "next/link";
import type { Clinic } from "@/lib/clinics";

const AVATAR_COLORS = [
  "bg-primary",
  "bg-secondary",
  "bg-[#6366f1]",
  "bg-[#f59e0b]",
  "bg-[#ef4444]",
  "bg-[#8b5cf6]",
];

function getAvatarColor(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function MetroIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 20l3.5-12L12 16l6.5-8L22 20H2zm10-7.2L8.5 7.6 6.3 15h11.4l-1.7-5.8L12 12.8z" />
    </svg>
  );
}

type Props = {
  clinic: Clinic;
  isOpen: boolean;
};

export default function ClinicCard({ clinic, isOpen }: Props) {
  const avatarBg = getAvatarColor(clinic.slug);
  const initials = getInitials(clinic.name);
  const topTags = clinic.specialtyTags.slice(0, 3);

  return (
    <Link
      href={`/clinic/${clinic.slug}`}
      className="group flex flex-col sm:flex-row gap-4 bg-white rounded-2xl border border-surface-container-high/60 p-4 sm:p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Avatar */}
      <div
        className={`${avatarBg} shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center text-white font-bold text-xl sm:text-2xl select-none`}
      >
        {initials}
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        {/* Name + open badge */}
        <div className="flex items-start gap-2 flex-wrap">
          <span className="font-semibold text-on-surface group-hover:text-primary transition-colors text-base sm:text-lg leading-snug">
            {clinic.name}
          </span>
          <span
            className={`shrink-0 mt-0.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
              isOpen
                ? "bg-secondary/10 text-secondary"
                : "bg-surface-container-highest text-on-surface-variant"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-secondary" : "bg-on-surface-variant/50"}`}
            />
            {isOpen ? "Открыто" : "Закрыто"}
          </span>
        </div>

        {/* Address + metro */}
        <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3 text-sm text-on-surface-variant">
          <span>{clinic.address}</span>
          {clinic.metro && (
            <span className="inline-flex items-center gap-1 text-primary font-medium">
              <MetroIcon />
              {clinic.metro}
            </span>
          )}
        </div>

        {/* Specialty tags */}
        <div className="flex flex-wrap gap-1.5">
          {topTags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-medium"
            >
              {tag}
            </span>
          ))}
          {clinic.specialtyTags.length > 3 && (
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-medium">
              +{clinic.specialtyTags.length - 3}
            </span>
          )}
          {clinic.acceptsDMS && (
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              ДМС
            </span>
          )}
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-on-surface-variant">
          <span>
            <span className="font-semibold text-on-surface">{clinic.stats.doctors}</span> врачей
          </span>
          <span>
            <span className="font-semibold text-on-surface">{clinic.stats.specialties}</span>{" "}
            специализаций
          </span>
          <span>
            <span className="font-semibold text-secondary">{clinic.bookingsLastMonth}</span> записей
            за месяц
          </span>
        </div>
      </div>

      {/* Right: rating + CTA */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between gap-3 sm:gap-2 shrink-0">
        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <StarIcon className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-on-surface text-sm">{clinic.rating}</span>
          <span className="text-on-surface-variant text-xs">({clinic.reviewCount})</span>
        </div>

        {/* Price hint */}
        {clinic.services[0] && (
          <div className="text-right hidden sm:block">
            <div className="text-xs text-on-surface-variant">от</div>
            <div className="font-semibold text-on-surface text-sm">
              {clinic.services[0].price.toLocaleString("ru-RU")} ₽
            </div>
          </div>
        )}

        {/* CTA */}
        <span className="shrink-0 inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium group-hover:bg-primary/90 transition-colors">
          Выбрать врача
        </span>
      </div>
    </Link>
  );
}

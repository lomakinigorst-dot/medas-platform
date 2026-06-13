"use client";

import Link from "next/link";

const ruPrice = new Intl.NumberFormat("ru-RU");

export default function MobileBookingBar({
  slug,
  price,
}: {
  slug: string;
  price: number;
}) {
  return (
    /* Shown only on mobile (lg:hidden), fixed at bottom, above system bars */
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest border-t border-outline-variant/20 px-4 py-3 flex items-center gap-3 shadow-2xl">
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-on-surface-variant">Первичная консультация</p>
        <p className="font-headline font-extrabold text-lg text-on-surface leading-tight">
          от {ruPrice.format(price)} ₽
        </p>
      </div>
      <Link
        href={`/doctor/${slug}/booking`}
        className="flex-shrink-0 btn-primary-gradient text-white px-6 py-3.5 rounded-2xl font-bold text-sm text-center active:scale-95 transition-transform"
      >
        Записаться
      </Link>
    </div>
  );
}

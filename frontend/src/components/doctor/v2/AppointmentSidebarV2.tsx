"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Doctor } from "@/lib/doctors";

const ruPrice = new Intl.NumberFormat("ru-RU");

const WEEK_LABELS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
const MONTH_NAMES = [
  "Январь","Февраль","Март","Апрель","Май","Июнь",
  "Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь",
];

function buildCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Shift to Monday=0
  const startOffset = (firstDay + 6) % 7;
  return { startOffset, daysInMonth };
}

const FLAT_SLOTS = ["09:00","10:30","11:45","13:00","14:30","16:00"];

export default function AppointmentSidebarV2({ doctor }: { doctor: Doctor }) {
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());
  const [selectedTime, setSelectedTime] = useState<string | null>("10:30");

  const { startOffset, daysInMonth } = buildCalendar(viewYear, viewMonth);

  const isToday = (d: number) =>
    d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const isPast = (d: number) => {
    const date = new Date(viewYear, viewMonth, d);
    date.setHours(0,0,0,0);
    const todayMidnight = new Date();
    todayMidnight.setHours(0,0,0,0);
    return date < todayMidnight;
  };

  const isCurrentMonth = viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const prevMonth = () => {
    if (isCurrentMonth) return; // нельзя уйти в прошлое
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDay(null);
  };

  const bookingHref = selectedDay && selectedTime
    ? `/doctor/${doctor.slug}/booking?date=${viewYear}-${viewMonth+1}-${selectedDay}&time=${encodeURIComponent(selectedTime)}`
    : `/doctor/${doctor.slug}/booking`;

  return (
    <div className="sticky top-28 space-y-4">
      <div className="bg-surface-container-lowest rounded-2xl shadow-xl shadow-primary/5 overflow-hidden">
        {/* Navy header */}
        <div className="bg-primary px-6 py-5 text-white">
          <h3 className="text-lg font-headline font-bold">Запись на приём</h3>
          <p className="text-xs opacity-80 mt-0.5">Ближайшее: Завтра в 10:30</p>
        </div>

        <div className="p-5 space-y-5">
          {/* Calendar */}
          <div className="space-y-3">
            {/* Month nav */}
            <div className="flex justify-between items-center">
              <span className="font-headline font-bold text-sm text-on-surface">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={prevMonth}
                  disabled={isCurrentMonth}
                  className={`p-1.5 rounded-lg transition-colors ${isCurrentMonth ? "opacity-30 cursor-not-allowed" : "hover:bg-surface-container"}`}
                  aria-label="Предыдущий месяц"
                >
                  <svg className="w-4 h-4 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg hover:bg-surface-container transition-colors"
                  aria-label="Следующий месяц"
                >
                  <svg className="w-4 h-4 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 text-center">
              {WEEK_LABELS.map((d) => (
                <span key={d} className="text-[10px] font-bold text-on-surface-variant py-1">{d}</span>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-0.5 text-center">
              {Array.from({ length: startOffset }).map((_, i) => (
                <span key={`e-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
                const past = isPast(d);
                const selected = selectedDay === d;
                const today_ = isToday(d);
                return (
                  <button
                    key={d}
                    disabled={past}
                    onClick={() => { setSelectedDay(d); setSelectedTime(null); }}
                    className={`py-2 text-xs rounded-lg font-semibold transition-all ${
                      past
                        ? "text-on-surface-variant/30 cursor-not-allowed"
                        : selected
                        ? "bg-secondary text-white shadow-sm"
                        : today_
                        ? "bg-secondary/15 text-secondary font-bold"
                        : "hover:bg-secondary/10 text-on-surface"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time slots */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              Доступное время
            </p>
            <div className="grid grid-cols-3 gap-2">
              {FLAT_SLOTS.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-2.5 text-xs font-semibold rounded-xl transition-all ${
                    selectedTime === time
                      ? "bg-secondary text-white shadow-sm"
                      : "bg-surface-container text-on-surface hover:bg-secondary/10 hover:text-secondary"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Price + CTA */}
          <div className="pt-3 border-t border-outline-variant/10 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant">Стоимость консультации</span>
              <span className="font-headline font-bold text-primary">
                {ruPrice.format(doctor.price)} ₽
              </span>
            </div>
            <Link
              href={bookingHref}
              className="block w-full py-4 bg-secondary text-white font-bold rounded-2xl shadow-lg shadow-secondary/20 text-center text-sm active:scale-95 transition-transform hover:opacity-95"
            >
              {selectedTime ? `Записаться на ${selectedTime}` : "Выберите время"}
            </Link>
            <p className="text-[10px] text-center text-on-surface-variant">
              Предоплата не требуется · Бесплатная отмена за 2 часа
            </p>
            <div className="text-center">
              <p className="text-[10px] text-on-surface-variant">Или позвоните нам:</p>
              <a href="tel:+74951234567" className="text-xs font-bold text-primary hover:underline">
                +7 (495) 123-45-67
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Insurance card */}
      {doctor.acceptsDMS && (
        <div className="p-4 bg-surface-container-lowest rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-xs text-on-surface">Страхование</p>
            <p className="text-[11px] text-on-surface-variant">Принимаем полисы ДМС крупных компаний</p>
          </div>
        </div>
      )}
    </div>
  );
}

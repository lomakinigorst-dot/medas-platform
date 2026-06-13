"use client";

import { useState } from "react";
import Link from "next/link";
import type { Doctor, DaySlots } from "@/lib/doctors";

const ruPrice = new Intl.NumberFormat("ru-RU");

function SlotButton({
  time,
  available,
  selected,
  onClick,
}: {
  time: string;
  available: boolean;
  selected: boolean;
  onClick: () => void;
}) {
  if (!available) {
    return (
      <span className="px-3 py-2 rounded-xl text-xs font-semibold text-on-surface-variant/40 bg-surface-container line-through cursor-not-allowed">
        {time}
      </span>
    );
  }
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
        selected
          ? "bg-primary text-white shadow-sm"
          : "bg-surface-container text-on-surface hover:bg-primary/10 hover:text-primary"
      }`}
    >
      {time}
    </button>
  );
}

function SlotGroup({ label, slots, selectedTime, onSelect }: {
  label: string;
  slots: { time: string; available: boolean }[];
  selectedTime: string | null;
  onSelect: (time: string) => void;
}) {
  if (slots.length === 0) return null;
  return (
    <div className="space-y-2">
      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">{label}</p>
      <div className="flex flex-wrap gap-2">
        {slots.map((slot) => (
          <SlotButton
            key={slot.time}
            time={slot.time}
            available={slot.available}
            selected={selectedTime === slot.time}
            onClick={() => onSelect(slot.time)}
          />
        ))}
      </div>
    </div>
  );
}

export default function AppointmentSidebar({ doctor }: { doctor: Doctor }) {
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const daySlots: DaySlots = doctor.slots[selectedDay];

  const hasSlots =
    daySlots.slots.morning.length > 0 ||
    daySlots.slots.afternoon.length > 0 ||
    daySlots.slots.evening.length > 0;

  const bookingHref =
    selectedTime
      ? `/doctor/${doctor.slug}/booking?day=${selectedDay}&time=${encodeURIComponent(selectedTime)}`
      : `/doctor/${doctor.slug}/booking`;

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 sticky top-28 space-y-6">
      {/* Price */}
      <div>
        <p className="text-xs text-on-surface-variant mb-1">Первичная консультация</p>
        <p className="font-headline font-extrabold text-2xl text-on-surface">
          от {ruPrice.format(doctor.price)} ₽
        </p>
        {doctor.acceptsDMS && (
          <p className="text-xs text-secondary font-semibold mt-1 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Принимает по ДМС
          </p>
        )}
      </div>

      {/* Day selector */}
      <div>
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-2">Дата приёма</p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
          {doctor.slots.map((day, i) => (
            <button
              key={i}
              onClick={() => { setSelectedDay(i); setSelectedTime(null); }}
              className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedDay === i
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface-container text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time slots */}
      <div className="space-y-4">
        {!hasSlots ? (
          <p className="text-sm text-on-surface-variant text-center py-4">Нет доступных слотов</p>
        ) : (
          <>
            <SlotGroup
              label="Утро"
              slots={daySlots.slots.morning}
              selectedTime={selectedTime}
              onSelect={setSelectedTime}
            />
            <SlotGroup
              label="День"
              slots={daySlots.slots.afternoon}
              selectedTime={selectedTime}
              onSelect={setSelectedTime}
            />
            <SlotGroup
              label="Вечер"
              slots={daySlots.slots.evening}
              selectedTime={selectedTime}
              onSelect={setSelectedTime}
            />
          </>
        )}
      </div>

      {/* CTA */}
      <Link
        href={bookingHref}
        className={`block w-full btn-primary-gradient text-white py-4 rounded-2xl font-bold text-center text-sm transition-all ${
          !selectedTime ? "opacity-70" : "hover:opacity-95 active:scale-[0.98]"
        }`}
      >
        {selectedTime ? `Записаться на ${selectedTime}` : "Записаться на приём"}
      </Link>

      {/* Online note */}
      {doctor.onlineAppointment && (
        <p className="text-center text-xs text-on-surface-variant flex items-center justify-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Доступна онлайн-консультация
        </p>
      )}
    </div>
  );
}

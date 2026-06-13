"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { StarIcon } from "@/components/ui/StarIcon";
import type { Doctor } from "@/lib/doctors";

// ─── Constants ────────────────────────────────────────────────────────────────

const BONUS_BALANCE = 1500;
const BONUS_EARN_RATE = 0.05;
const BONUS_MAX_SPEND_RATE = 0.1;

// Indices from doctor.services to show in booking
const SERVICE_ICONS = ["🏥", "🔄", "💻"];
const SERVICE_INDICES = [0, 1, 4]; // Первичная, Повторная, Онлайн

// ─── Section wrapper ──────────────────────────────────────────────────────────

function FormSection({
  step,
  title,
  children,
  complete,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
  complete?: boolean;
}) {
  return (
    <section className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-outline-variant/10">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-extrabold transition-colors ${
            complete
              ? "bg-secondary text-white"
              : "bg-primary/10 text-primary"
          }`}
        >
          {complete ? (
            <svg className="w-4 h-4" viewBox="0 0 12 10" fill="none">
              <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            step
          )}
        </div>
        <h2 className="font-headline font-bold text-on-surface">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

// ─── Success screen ───────────────────────────────────────────────────────────

function BookingSuccess({
  doctor,
  service,
  dayLabel,
  slotTime,
  earnedBonuses,
  onReset,
}: {
  doctor: Doctor;
  service: { name: string; price: number };
  dayLabel: string;
  slotTime: string;
  earnedBonuses: number;
  onReset: () => void;
}) {
  const ruPrice = new Intl.NumberFormat("ru-RU");
  return (
    <div className="max-w-lg mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Big checkmark */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="font-headline text-2xl font-extrabold text-on-surface mb-2">
          Запись подтверждена!
        </h2>
        <p className="text-on-surface-variant text-sm">
          Мы отправим напоминание за 24 часа до приёма
        </p>
      </div>

      {/* Details card */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 space-y-4 mb-4">
        <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/10">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
            <Image src={doctor.photo} alt={doctor.name} fill className="object-cover object-top" sizes="48px" />
          </div>
          <div>
            <p className="font-bold text-on-surface text-sm">{doctor.name}</p>
            <p className="text-secondary text-xs font-semibold">{doctor.specialty}</p>
          </div>
        </div>
        {[
          { label: "Услуга", value: service.name },
          { label: "Дата", value: dayLabel },
          { label: "Время", value: slotTime },
          { label: "Место", value: doctor.clinic.name },
          { label: "Адрес", value: doctor.clinic.address },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between gap-4 text-sm">
            <span className="text-on-surface-variant">{label}</span>
            <span className="font-semibold text-on-surface text-right">{value}</span>
          </div>
        ))}
        <div className="flex justify-between pt-3 border-t border-outline-variant/10 text-sm">
          <span className="font-bold text-on-surface">Стоимость</span>
          <span className="font-extrabold text-primary">{ruPrice.format(service.price)}&nbsp;₽</span>
        </div>
      </div>

      {/* Bonuses card */}
      <div className="bg-secondary/8 border border-secondary/20 rounded-2xl p-5 flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-secondary/15 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-secondary text-sm">Бонусы начислены после приёма</p>
          <p className="font-headline font-extrabold text-secondary text-xl mt-0.5">
            +{earnedBonuses} баллов
          </p>
          <p className="text-xs text-secondary/70 mt-0.5">
            Можно потратить на следующий визит
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/cabinet/patient"
          className="flex-1 py-3.5 text-center bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
        >
          Перейти в Личный кабинет
        </Link>
        <button
          onClick={onReset}
          className="flex-1 py-3.5 text-center bg-surface-container text-on-surface font-semibold rounded-xl hover:bg-surface-container-highest transition-colors"
        >
          Записаться ещё раз
        </button>
      </div>
    </div>
  );
}

// ─── Mini calendar ────────────────────────────────────────────────────────────

const RU_MONTHS = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
const RU_DOW = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];

function labelToDayNum(label: string, today: Date): number {
  if (label === "Сегодня") return today.getDate();
  if (label === "Завтра")  return today.getDate() + 1;
  const m = label.match(/(\d+)$/);
  return m ? parseInt(m[1]) : -1;
}

function MiniCalendar({
  doctorSlots,
  selectedDayIdx,
  onSelect,
}: {
  doctorSlots: { label: string; slots: { morning: { time: string; available: boolean }[]; afternoon: { time: string; available: boolean }[]; evening: { time: string; available: boolean }[] } }[];
  selectedDayIdx: number;
  onSelect: (idx: number) => void;
}) {
  const today = new Date();
  const year  = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth   = new Date(year, month + 1, 0).getDate();
  const firstWeekday  = new Date(year, month, 1).getDay(); // 0=Sun
  // Convert to Mon-based offset (Mon=0 … Sun=6)
  const startOffset   = firstWeekday === 0 ? 6 : firstWeekday - 1;

  // Map available labels → day numbers in this month
  const availMap = new Map<number, number>(); // dayNum → slotIdx
  doctorSlots.forEach((s, idx) => {
    const d = labelToDayNum(s.label, today);
    if (d > 0) availMap.set(d, idx);
  });

  const selectedDayNum = selectedDayIdx >= 0 ? labelToDayNum(doctorSlots[selectedDayIdx]?.label ?? "", today) : -1;

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to full rows
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      {/* Month header */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-on-surface text-sm">
          {RU_MONTHS[month]} {year}
        </span>
        <span className="text-xs text-on-surface-variant">
          {doctorSlots.filter((_, i) => availMap.has(labelToDayNum(doctorSlots[i].label, today))).length} дней со слотами
        </span>
      </div>

      {/* Day-of-week header */}
      <div className="grid grid-cols-7 mb-1">
        {RU_DOW.map((d) => (
          <div key={d} className="text-center text-[11px] font-bold text-on-surface-variant py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;

          const isPast     = day < today.getDate();
          const isToday    = day === today.getDate();
          const isAvail    = availMap.has(day);
          const isSelected = day === selectedDayNum;
          const slotIdx    = availMap.get(day) ?? -1;

          return (
            <button
              key={day}
              disabled={!isAvail}
              onClick={() => isAvail && onSelect(slotIdx)}
              className={[
                "relative mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all",
                isSelected
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : isAvail
                    ? "bg-secondary/10 text-secondary font-bold hover:bg-secondary/20 cursor-pointer"
                    : isPast
                      ? "text-outline-variant/40 cursor-default"
                      : "text-on-surface-variant cursor-default",
              ].join(" ")}
            >
              {day}
              {isToday && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BookingForm({ doctor }: { doctor: Doctor }) {
  const ruPrice = new Intl.NumberFormat("ru-RU");

  // Derive available services from doctor.services
  const services = useMemo(
    () =>
      SERVICE_INDICES.map((idx, i) => ({
        ...doctor.services[idx],
        icon: SERVICE_ICONS[i],
      })).filter(Boolean),
    [doctor.services]
  );

  // ── State ──
  const [selectedSvcIdx, setSelectedSvcIdx] = useState(0);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [useBonuses, setUseBonuses] = useState(false);
  const [name, setName] = useState("Иван Иванов");
  const [phone, setPhone] = useState("+7 (");
  const [forWhom, setForWhom] = useState<"self" | "family">("self");
  const [comment, setComment] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ── Derived ──
  const selectedService = services[selectedSvcIdx];
  const selectedDay = doctor.slots[selectedDayIdx];

  // Flat sorted time slots (no morning/afternoon/evening grouping)
  const flatSlots = useMemo(() => {
    if (!selectedDay) return [];
    return [
      ...selectedDay.slots.morning,
      ...selectedDay.slots.afternoon,
      ...selectedDay.slots.evening,
    ].sort((a, b) => a.time.localeCompare(b.time));
  }, [selectedDay]);

  const maxBonusDeduct = Math.floor(selectedService.price * BONUS_MAX_SPEND_RATE);
  const bonusDeduct = useBonuses ? Math.min(BONUS_BALANCE, maxBonusDeduct) : 0;
  const finalPrice = selectedService.price - bonusDeduct;
  const earnedBonuses = Math.floor(finalPrice * BONUS_EARN_RATE);
  const canSubmit =
    selectedSlot !== null && agreed && name.trim().length > 1 && phone.length >= 6;

  const handleSelectService = useCallback(
    (idx: number) => {
      setSelectedSvcIdx(idx);
      setSelectedSlot(null);
    },
    []
  );

  const handleSelectDay = useCallback((idx: number) => {
    setSelectedDayIdx(idx);
    setSelectedSlot(null);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [canSubmit]);

  // ── Success screen ──
  if (submitted) {
    return (
      <BookingSuccess
        doctor={doctor}
        service={selectedService}
        dayLabel={selectedDay?.label ?? ""}
        slotTime={selectedSlot ?? ""}
        earnedBonuses={earnedBonuses}
        onReset={() => {
          setSubmitted(false);
          setSelectedSlot(null);
          setAgreed(false);
        }}
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">

        {/* ═══ LEFT — form ═══════════════════════════════════════════════════ */}
        <div className="space-y-5">

          {/* ── Mobile doctor card (hidden on desktop — sidebar handles it) ─ */}
          <div className="lg:hidden bg-surface-container-lowest rounded-2xl shadow-sm p-4 flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
              <Image src={doctor.photo} alt={doctor.name} fill className="object-cover object-top" sizes="56px" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-on-surface leading-tight">{doctor.name}</p>
              <p className="text-secondary text-sm font-semibold">{doctor.specialty}</p>
              <div className="flex items-center gap-1 mt-1">
                <StarIcon className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs text-on-surface-variant">{doctor.rating} · {doctor.reviewCount} отзывов</span>
              </div>
            </div>
            <Link
              href={`/doctor/${doctor.slug}`}
              className="flex-shrink-0 text-xs text-primary font-semibold hover:underline"
            >
              Профиль
            </Link>
          </div>

          {/* ── Step 1: Service ───────────────────────────────────────────── */}
          <FormSection step={1} title="Выберите услугу" complete={true}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {services.map((svc, i) => {
                const active = selectedSvcIdx === i;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectService(i)}
                    className={`flex flex-col items-start gap-2.5 p-4 rounded-xl border-2 text-left transition-all duration-150 ${
                      active
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-outline-variant/20 hover:border-primary/30 hover:bg-surface-container"
                    }`}
                  >
                    <span className="text-2xl leading-none">{svc.icon}</span>
                    <div>
                      <p className={`text-sm font-bold leading-snug ${active ? "text-primary" : "text-on-surface"}`}>
                        {svc.name}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{svc.duration}</p>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className={`font-headline font-extrabold text-xl ${active ? "text-primary" : "text-on-surface"}`}>
                        {ruPrice.format(svc.price)}
                      </span>
                      <span className={`text-sm font-semibold ${active ? "text-primary/70" : "text-on-surface-variant"}`}>₽</span>
                    </div>
                    {active && (
                      <span className="w-full py-1 text-center text-[10px] font-extrabold text-primary bg-primary/8 rounded-lg uppercase tracking-widest">
                        Выбрано ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </FormSection>

          {/* ── Step 2: Date & Time ───────────────────────────────────────── */}
          <FormSection step={2} title="Дата и время" complete={selectedSlot !== null}>
            {/* Mini calendar */}
            <MiniCalendar
              doctorSlots={doctor.slots}
              selectedDayIdx={selectedDayIdx}
              onSelect={handleSelectDay}
            />

            {/* Flat time slots */}
            {selectedDay && (
              <div className="mt-5 pt-5 border-t border-outline-variant/10">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-3">
                  Доступное время —{" "}
                  <span className="text-secondary normal-case font-semibold">
                    {flatSlots.filter((s) => s.available).length} свободно
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {flatSlots.map((slot) => {
                    const isSelected = selectedSlot === slot.time;
                    return (
                      <button
                        key={slot.time}
                        disabled={!slot.available}
                        onClick={() => slot.available && setSelectedSlot(slot.time)}
                        className={[
                          "px-4 py-2.5 rounded-xl text-sm font-semibold transition-all",
                          !slot.available
                            ? "bg-surface-container text-outline-variant cursor-not-allowed opacity-40 line-through"
                            : isSelected
                              ? "bg-primary text-white shadow-md shadow-primary/25"
                              : "bg-surface-container text-on-surface hover:bg-surface-container-high",
                        ].join(" ")}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {!selectedDay && (
              <p className="mt-5 text-sm text-on-surface-variant text-center py-4">
                Выберите дату в календаре выше
              </p>
            )}
          </FormSection>

          {/* ── Step 3: Patient info ──────────────────────────────────────── */}
          <FormSection step={3} title="Ваши данные" complete={agreed}>
            <div className="space-y-4">
              {/* Name + phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wide">
                    Имя и фамилия
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Иван Иванов"
                    className="w-full px-4 py-3 rounded-xl bg-surface-container text-on-surface text-sm font-medium placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/25 transition-shadow"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wide">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (999) 000-00-00"
                    className="w-full px-4 py-3 rounded-xl bg-surface-container text-on-surface text-sm font-medium placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/25 transition-shadow"
                  />
                </div>
              </div>

              {/* For whom */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wide">
                  Запись для кого
                </label>
                <div className="flex gap-2">
                  {(["self", "family"] as const).map((val) => (
                    <button
                      key={val}
                      onClick={() => setForWhom(val)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        forWhom === val
                          ? "bg-primary text-white shadow-sm"
                          : "bg-surface-container text-on-surface-variant hover:bg-surface-container-highest"
                      }`}
                    >
                      {val === "self" ? "Для себя" : "Для члена семьи"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wide">
                  Жалобы / цель визита{" "}
                  <span className="normal-case font-normal text-outline-variant">(необязательно)</span>
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Опишите симптомы или вопросы — врач ознакомится перед приёмом"
                  className="w-full px-4 py-3 rounded-xl bg-surface-container text-on-surface text-sm placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/25 resize-none transition-shadow"
                />
              </div>

              {/* Agreement */}
              <label className="flex items-start gap-3 cursor-pointer group pt-1">
                <div className="mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      agreed
                        ? "bg-primary border-primary"
                        : "border-outline-variant group-hover:border-primary/40"
                    }`}
                  >
                    {agreed && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 12 10" fill="none">
                        <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-xs text-on-surface-variant leading-relaxed select-none">
                  Я согласен с{" "}
                  <Link href="#" className="text-primary hover:underline">
                    условиями использования
                  </Link>{" "}
                  и{" "}
                  <Link href="#" className="text-primary hover:underline">
                    политикой конфиденциальности
                  </Link>{" "}
                  MEDAS. Согласен на обработку персональных данных.
                </span>
              </label>
            </div>
          </FormSection>
        </div>

        {/* ═══ RIGHT — sticky summary ═════════════════════════════════════ */}
        <div className="hidden lg:block">
          <div className="sticky top-[126px] space-y-4">

            {/* Summary card */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-outline-variant/10">
                <h3 className="font-headline font-bold text-on-surface text-sm uppercase tracking-wide">
                  Ваша запись
                </h3>
              </div>
              <div className="p-5 space-y-4">

                {/* Doctor mini */}
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={doctor.photo}
                      alt={doctor.name}
                      fill
                      className="object-cover object-top"
                      sizes="40px"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-on-surface text-sm leading-tight truncate">{doctor.name}</p>
                    <p className="text-secondary text-xs font-semibold">{doctor.specialty}</p>
                  </div>
                </div>

                {/* Selected service */}
                <div className="bg-surface-container rounded-xl p-3.5 space-y-1">
                  <p className="text-xs font-bold text-on-surface-variant">Услуга</p>
                  <p className="text-sm font-semibold text-on-surface">{selectedService.name}</p>
                  <p className="text-xs text-on-surface-variant">{selectedService.duration}</p>
                </div>

                {/* Date + time */}
                {selectedSlot ? (
                  <div className="bg-primary/5 border border-primary/15 rounded-xl p-3.5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-primary/70">Дата и время</p>
                      <p className="text-sm font-bold text-primary mt-0.5">
                        {selectedDay?.label} · {selectedSlot}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedSlot(null)}
                      className="text-xs text-on-surface-variant hover:text-primary transition-colors underline"
                    >
                      Изменить
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-outline-variant/30 rounded-xl p-3.5 text-center">
                    <p className="text-xs text-on-surface-variant">Выберите дату и время ↑</p>
                  </div>
                )}

                {/* Bonuses toggle */}
                <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                      </svg>
                      <span className="text-sm font-bold text-amber-800">Бонусы MEDAS</span>
                    </div>
                    {/* Toggle */}
                    <button
                      onClick={() => setUseBonuses((v) => !v)}
                      className={`relative inline-flex w-11 h-6 rounded-full transition-colors ${useBonuses ? "bg-secondary" : "bg-outline-variant/40"}`}
                      aria-label="Использовать бонусы"
                    >
                      <span
                        className={`inline-block w-4 h-4 rounded-full bg-white shadow-sm absolute top-1 transition-transform ${useBonuses ? "translate-x-6" : "translate-x-1"}`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-amber-700">
                    Баланс: <strong>{BONUS_BALANCE.toLocaleString("ru-RU")}</strong> баллов ·{" "}
                    {useBonuses
                      ? `Экономия: −${ruPrice.format(bonusDeduct)} ₽`
                      : `Можно списать до ${ruPrice.format(maxBonusDeduct)} ₽`}
                  </p>
                </div>

                {/* Price breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Стоимость услуги</span>
                    <span className={useBonuses ? "line-through text-outline-variant" : "font-semibold text-on-surface"}>
                      {ruPrice.format(selectedService.price)}&nbsp;₽
                    </span>
                  </div>
                  {useBonuses && (
                    <div className="flex justify-between text-secondary">
                      <span>Скидка бонусами</span>
                      <span className="font-bold">−{ruPrice.format(bonusDeduct)}&nbsp;₽</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-outline-variant/10">
                    <span className="font-bold text-on-surface">Итого</span>
                    <span className="font-headline font-extrabold text-xl text-primary">
                      {ruPrice.format(finalPrice)}&nbsp;₽
                    </span>
                  </div>
                  <div className="flex justify-between text-secondary text-xs">
                    <span>Вы получите бонусов</span>
                    <span className="font-bold">+{earnedBonuses} баллов</span>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${
                    canSubmit
                      ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-[0.98]"
                      : "bg-surface-container text-outline-variant cursor-not-allowed"
                  }`}
                >
                  {canSubmit ? "Подтвердить запись" : "Выберите дату и время"}
                </button>

                {!agreed && canSubmit === false && selectedSlot && (
                  <p className="text-xs text-center text-on-surface-variant">
                    Дайте согласие на обработку данных ↑
                  </p>
                )}

                <p className="text-[11px] text-center text-on-surface-variant">
                  Бесплатная отмена за 24 часа до приёма
                </p>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "🔒", text: "Данные защищены" },
                { icon: "⭐", text: "4.9 рейтинг врача" },
                { icon: "🎁", text: `+${earnedBonuses} бонусов` },
                { icon: "📱", text: "Напоминание за 24ч" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2 bg-surface-container-lowest rounded-xl p-3 shadow-sm">
                  <span className="text-lg leading-none">{icon}</span>
                  <span className="text-xs font-semibold text-on-surface-variant">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Mobile sticky bottom bar ══════════════════════════════════════ */}
      {selectedSlot && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-surface-container-lowest border-t border-outline-variant/15 px-4 py-4 shadow-2xl">
          <div className="flex items-center gap-4 max-w-screen-xl mx-auto">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-on-surface-variant truncate">
                {selectedDay?.label} · {selectedSlot} · {selectedService.name}
              </p>
              <p className="font-headline font-extrabold text-xl text-primary">
                {ruPrice.format(finalPrice)}&nbsp;₽
                {earnedBonuses > 0 && (
                  <span className="ml-2 text-xs font-bold text-secondary">+{earnedBonuses} бонусов</span>
                )}
              </p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`flex-shrink-0 px-6 py-3.5 rounded-xl font-bold text-sm transition-all ${
                canSubmit
                  ? "bg-primary text-white shadow-lg shadow-primary/25 active:scale-[0.97]"
                  : "bg-surface-container text-outline-variant cursor-not-allowed"
              }`}
            >
              Подтвердить
            </button>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

export const WEEK_LABELS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
export const MONTH_NAMES = [
  "Январь","Февраль","Март","Апрель","Май","Июнь",
  "Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь",
];

export function buildCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay + 6) % 7; // Mon=0
  return { startOffset, daysInMonth };
}

type Props = {
  viewYear: number;
  viewMonth: number;
  selectedDay: number | null;
  today: Date;
  availableDays?: Set<number>;
  onSelectDay: (day: number) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  canGoPrev: boolean;
};

export default function AppointmentCalendar({
  viewYear,
  viewMonth,
  selectedDay,
  today,
  availableDays,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
  canGoPrev,
}: Props) {
  const { startOffset, daysInMonth } = buildCalendar(viewYear, viewMonth);

  const isToday = (d: number) =>
    d === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();

  const isPast = (d: number) => {
    const date = new Date(viewYear, viewMonth, d);
    date.setHours(0, 0, 0, 0);
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    return date < todayMidnight;
  };

  return (
    <div className="space-y-3">
      {/* Month nav */}
      <div className="flex justify-between items-center">
        <span className="font-headline font-bold text-sm text-on-surface">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <div className="flex gap-1">
          <button
            onClick={onPrevMonth}
            disabled={!canGoPrev}
            className={`p-1.5 rounded-lg transition-colors ${
              !canGoPrev ? "opacity-30 cursor-not-allowed" : "hover:bg-surface-container"
            }`}
            aria-label="Предыдущий месяц"
          >
            <svg className="w-4 h-4 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={onNextMonth}
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
          <span key={d} className="text-[10px] font-bold text-on-surface-variant py-1">
            {d}
          </span>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {Array.from({ length: startOffset }).map((_, i) => (
          <span key={`e-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
          const past = isPast(d);
          const selected = selectedDay === d;
          const today_ = isToday(d);
          const hasSlots = availableDays?.has(d) ?? false;
          const clickable = !past;

          return (
            <button
              key={d}
              disabled={!clickable}
              onClick={() => clickable && onSelectDay(d)}
              className={[
                "py-2 text-xs rounded-lg font-semibold transition-all",
                past
                  ? "text-on-surface-variant/30 cursor-not-allowed"
                  : selected
                  ? "bg-secondary text-white shadow-sm"
                  : today_
                  ? "bg-secondary/15 text-secondary font-bold"
                  : hasSlots
                  ? "bg-primary/8 text-primary font-bold hover:bg-primary/15"
                  : "hover:bg-secondary/10 text-on-surface",
              ].join(" ")}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

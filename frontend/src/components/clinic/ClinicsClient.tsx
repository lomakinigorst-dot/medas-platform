"use client";

import { useState, useMemo } from "react";
import type { Clinic } from "@/lib/clinics";
import { isClinicOpenNow } from "@/lib/clinics";
import ClinicCard from "./ClinicCard";

type SortKey = "rating" | "popular" | "reviews";

const QUICK_CHIPS = [
  { id: "all",     label: "Все" },
  { id: "open",    label: "Открыто сейчас" },
  { id: "dms",     label: "С ДМС" },
  { id: "stom",    label: "Стоматология" },
  { id: "kids",    label: "Детская" },
  { id: "mri",     label: "МРТ / КТ" },
] as const;

const SPECIALTY_FILTERS = [
  "Кардиология",
  "Стоматология",
  "Педиатрия",
  "МРТ / КТ",
  "Терапия",
  "Гинекология",
  "Неврология",
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "rating",   label: "По рейтингу" },
  { value: "popular",  label: "По популярности" },
  { value: "reviews",  label: "По отзывам" },
];

type Props = {
  clinics: Clinic[];
};

export default function ClinicsClient({ clinics }: Props) {
  const [quickChip, setQuickChip] = useState<string>("all");
  const [filterDMS, setFilterDMS] = useState(false);
  const [filterOpenNow, setFilterOpenNow] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>("rating");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Precompute isOpen for each clinic once per render
  const clinicsWithOpen = useMemo(
    () => clinics.map((c) => ({ clinic: c, isOpen: isClinicOpenNow(c) })),
    [clinics]
  );

  const toggleSpecialty = (spec: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  const resetFilters = () => {
    setFilterDMS(false);
    setFilterOpenNow(false);
    setMinRating(0);
    setSelectedSpecialties([]);
    setQuickChip("all");
  };

  const filtered = useMemo(() => {
    return clinicsWithOpen.filter(({ clinic, isOpen }) => {
      // Quick chip
      if (quickChip === "open" && !isOpen) return false;
      if (quickChip === "dms" && !clinic.acceptsDMS) return false;
      if (quickChip === "stom" && !clinic.specialtyTags.some((t) => t.toLowerCase().includes("стоматол"))) return false;
      if (quickChip === "kids" && !clinic.specialtyTags.some((t) => t.toLowerCase().includes("детск") || t.toLowerCase().includes("педиатр"))) return false;
      if (quickChip === "mri" && !clinic.specialtyTags.some((t) => t.toLowerCase().includes("мрт") || t.toLowerCase().includes("кт"))) return false;

      // Sidebar filters
      if (filterDMS && !clinic.acceptsDMS) return false;
      if (filterOpenNow && !isOpen) return false;
      if (minRating > 0 && clinic.rating < minRating) return false;
      if (
        selectedSpecialties.length > 0 &&
        !selectedSpecialties.some((spec) =>
          clinic.specialtyTags.some((t) => t.toLowerCase().includes(spec.toLowerCase()))
        )
      )
        return false;

      return true;
    });
  }, [clinicsWithOpen, quickChip, filterDMS, filterOpenNow, minRating, selectedSpecialties]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortBy === "rating") return b.clinic.rating - a.clinic.rating;
      if (sortBy === "popular") return b.clinic.bookingsLastMonth - a.clinic.bookingsLastMonth;
      if (sortBy === "reviews") return b.clinic.reviewCount - a.clinic.reviewCount;
      return 0;
    });
  }, [filtered, sortBy]);

  const hasActiveFilters =
    filterDMS || filterOpenNow || minRating > 0 || selectedSpecialties.length > 0;

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface mb-1">
          Клиники в Москве
        </h1>
        <p className="text-on-surface-variant text-sm sm:text-base">
          Найдено{" "}
          <span className="font-semibold text-on-surface">{sorted.length}</span>{" "}
          {sorted.length === 1 ? "клиника" : sorted.length < 5 ? "клиники" : "клиник"}
        </p>
      </div>

      {/* Quick filter chips */}
      <div className="flex gap-2 flex-wrap mb-6">
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip.id}
            onClick={() => setQuickChip(chip.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              quickChip === chip.id
                ? "bg-primary text-white shadow-sm"
                : "bg-surface-container text-on-surface hover:bg-surface-container-high"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div className="flex gap-6 lg:gap-8 items-start">
        {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-4 w-full">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-surface-container-high bg-white text-sm font-medium text-on-surface"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 12h10M11 20h2" />
            </svg>
            Фильтры
            {hasActiveFilters && (
              <span className="ml-auto w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                {[filterDMS, filterOpenNow, minRating > 0, selectedSpecialties.length > 0].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Sidebar panel */}
        <aside
          className={`${
            sidebarOpen ? "block" : "hidden"
          } lg:block w-full lg:w-64 xl:w-72 shrink-0`}
        >
          <div className="bg-white rounded-2xl border border-surface-container-high/60 p-5 sticky top-[110px]">
            <div className="flex items-center justify-between mb-5">
              <span className="font-semibold text-on-surface">Фильтры</span>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-primary hover:underline"
                >
                  Сбросить
                </button>
              )}
            </div>

            {/* Open now */}
            <div className="mb-5 pb-5 border-b border-surface-container">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div
                  onClick={() => setFilterOpenNow(!filterOpenNow)}
                  className={`relative w-9 h-5 rounded-full transition-colors ${
                    filterOpenNow ? "bg-secondary" : "bg-surface-container-high"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      filterOpenNow ? "translate-x-4" : ""
                    }`}
                  />
                </div>
                <span className="text-sm text-on-surface">Работает сейчас</span>
              </label>
            </div>

            {/* DMS */}
            <div className="mb-5 pb-5 border-b border-surface-container">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div
                  onClick={() => setFilterDMS(!filterDMS)}
                  className={`relative w-9 h-5 rounded-full transition-colors ${
                    filterDMS ? "bg-secondary" : "bg-surface-container-high"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      filterDMS ? "translate-x-4" : ""
                    }`}
                  />
                </div>
                <span className="text-sm text-on-surface">Принимает ДМС</span>
              </label>
            </div>

            {/* Min rating */}
            <div className="mb-5 pb-5 border-b border-surface-container">
              <p className="text-sm font-medium text-on-surface mb-3">Минимальный рейтинг</p>
              <div className="flex flex-col gap-2">
                {[0, 4.0, 4.5, 4.8].map((val) => (
                  <label key={val} className="flex items-center gap-2.5 cursor-pointer select-none">
                    <span
                      onClick={() => setMinRating(val)}
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        minRating === val
                          ? "border-primary bg-primary"
                          : "border-surface-container-high"
                      }`}
                    >
                      {minRating === val && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </span>
                    <span className="text-sm text-on-surface">
                      {val === 0 ? "Любой" : `${val}+`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Specialties */}
            <div>
              <p className="text-sm font-medium text-on-surface mb-3">Специализация</p>
              <div className="flex flex-col gap-2">
                {SPECIALTY_FILTERS.map((spec) => (
                  <label
                    key={spec}
                    className="flex items-center gap-2.5 cursor-pointer select-none group"
                  >
                    <span
                      onClick={() => toggleSpecialty(spec)}
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                        selectedSpecialties.includes(spec)
                          ? "border-primary bg-primary"
                          : "border-surface-container-high group-hover:border-primary/50"
                      }`}
                    >
                      {selectedSpecialties.includes(spec) && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <span className="text-sm text-on-surface">{spec}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Clinic list ───────────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-on-surface-variant hidden sm:block">
              {sorted.length} {sorted.length === 1 ? "результат" : "результатов"}
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-on-surface-variant hidden sm:block">Сортировать:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="px-3 py-2 rounded-xl border border-surface-container-high bg-white text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cards */}
          {sorted.length > 0 ? (
            <div className="flex flex-col gap-3 sm:gap-4">
              {sorted.map(({ clinic, isOpen }) => (
                <ClinicCard key={clinic.slug} clinic={clinic} isOpen={isOpen} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-on-surface font-semibold text-lg mb-1">Клиники не найдены</p>
              <p className="text-on-surface-variant text-sm mb-4">
                Попробуйте изменить параметры фильтрации
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import type { Clinic } from "@/lib/clinics";
import { isClinicOpenNow, extractMetroName } from "@/lib/clinics";
import ClinicCard from "./ClinicCard";

type SortKey = "rating" | "popular" | "reviews";

const PAGE_SIZE = 6;

const QUICK_CHIPS = [
  { id: "all",  label: "Все клиники" },
  { id: "open", label: "Открыто сейчас" },
  { id: "dms",  label: "Принимает ДМС" },
  { id: "stom", label: "Стоматология" },
  { id: "kids", label: "Детские" },
  { id: "mri",  label: "МРТ / КТ" },
] as const;

const SPECIALTY_FILTERS = [
  "Кардиология",
  "Стоматология",
  "Педиатрия",
  "МРТ / КТ",
  "Терапия",
  "Гинекология",
  "Неврология",
  "Онкология",
  "Дерматология",
  "Репродуктология",
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "rating",  label: "По рейтингу" },
  { value: "popular", label: "По популярности" },
  { value: "reviews", label: "По отзывам" },
];

const HERO_STATS = [
  { value: "147+",  label: "клиник" },
  { value: "2 400+", label: "врачей" },
  { value: "4.8",   label: "средний рейтинг" },
];

const TOGGLE_FILTERS = [
  { key: "openNow" as const, label: "Открыто сейчас" },
  { key: "dms"     as const, label: "Принимает ДМС" },
];

type Props = {
  clinics: Clinic[];
};

export default function ClinicsClient({ clinics }: Props) {
  const [quickChip, setQuickChip]                     = useState<string>("all");
  const [filterDMS, setFilterDMS]                     = useState(false);
  const [filterOpenNow, setFilterOpenNow]             = useState(false);
  const [minRating, setMinRating]                     = useState<number>(0);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [sortBy, setSortBy]                           = useState<SortKey>("rating");
  const [filtersOpen, setFiltersOpen]                 = useState(false);
  const [searchQuery, setSearchQuery]                 = useState("");
  const [selectedMetro, setSelectedMetro]             = useState("");
  const [page, setPage]                               = useState(1);

  // Pre-compute metro name once per clinic to avoid repeated regex in filter
  const clinicsWithOpen = useMemo(
    () => clinics.map((c) => ({ clinic: c, isOpen: isClinicOpenNow(c), metroName: extractMetroName(c.metro) })),
    [clinics]
  );

  const metroOptions = useMemo(() => {
    const seen = new Set<string>();
    for (const { metroName } of clinicsWithOpen) {
      if (metroName) seen.add(metroName);
    }
    return Array.from(seen).sort();
  }, [clinicsWithOpen]);

  // ── handlers that also reset page ────────────────────────────────────────
  const handleQuickChip       = (chip: string)  => { setQuickChip(chip);              setPage(1); };
  const handleSortBy          = (sort: SortKey) => { setSortBy(sort);                 setPage(1); };
  const handleFilterDMS       = ()              => { setFilterDMS((v) => !v);         setPage(1); };
  const handleFilterOpenNow   = ()              => { setFilterOpenNow((v) => !v);     setPage(1); };
  const handleMinRating       = (val: number)   => { setMinRating(val);               setPage(1); };
  const handleSearch          = (q: string)     => { setSearchQuery(q);               setPage(1); };
  const handleMetro           = (m: string)     => { setSelectedMetro(m);             setPage(1); };
  const handleToggleSpecialty = (spec: string)  => {
    setSelectedSpecialties((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
    setPage(1);
  };

  const resetFilters = () => {
    setFilterDMS(false);
    setFilterOpenNow(false);
    setMinRating(0);
    setSelectedSpecialties([]);
    setQuickChip("all");
    setSearchQuery("");
    setSelectedMetro("");
    setPage(1);
  };

  const activeFilterCount = [
    filterDMS,
    filterOpenNow,
    minRating > 0,
    selectedSpecialties.length > 0,
    !!searchQuery,
    !!selectedMetro,
  ].filter(Boolean).length;

  const filtered = useMemo(() => {
    return clinicsWithOpen.filter(({ clinic, isOpen, metroName }) => {
      if (quickChip === "open" && !isOpen) return false;
      if (quickChip === "dms"  && !clinic.acceptsDMS) return false;
      if (quickChip === "stom" && !clinic.specialtyTags.some((t) => t.toLowerCase().includes("стоматол"))) return false;
      if (quickChip === "kids" && !clinic.specialtyTags.some((t) => t.toLowerCase().includes("детск") || t.toLowerCase().includes("педиатр"))) return false;
      if (quickChip === "mri"  && !clinic.specialtyTags.some((t) => t.toLowerCase().includes("мрт") || t.toLowerCase().includes("кт"))) return false;

      if (filterDMS && !clinic.acceptsDMS) return false;
      if (filterOpenNow && !isOpen) return false;
      if (minRating > 0 && clinic.rating < minRating) return false;
      if (
        selectedSpecialties.length > 0 &&
        !selectedSpecialties.some((spec) =>
          clinic.specialtyTags.some((t) => t.toLowerCase().includes(spec.toLowerCase()))
        )
      ) return false;

      if (searchQuery && !clinic.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;

      if (selectedMetro && metroName !== selectedMetro) return false;

      return true;
    });
  }, [clinicsWithOpen, quickChip, filterDMS, filterOpenNow, minRating, selectedSpecialties, searchQuery, selectedMetro]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortBy === "rating")  return b.clinic.rating - a.clinic.rating;
      if (sortBy === "popular") return b.clinic.bookingsLastMonth - a.clinic.bookingsLastMonth;
      if (sortBy === "reviews") return b.clinic.reviewCount - a.clinic.reviewCount;
      return 0;
    });
  }, [filtered, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div>
      {/* ── Hero header ─────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-primary to-primary/85 text-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h1 className="font-headline font-extrabold text-3xl sm:text-4xl lg:text-5xl mb-3 leading-tight">
            Клиники Москвы
          </h1>
          <p className="text-white/75 text-base sm:text-lg mb-8 max-w-xl">
            Выбирайте по рейтингу, специализации и расположению — запись онлайн за 2 минуты
          </p>
          {/* Search bar in hero */}
          <div className="relative max-w-lg mb-6">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Поиск клиники по названию..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/15 border border-white/25 text-white placeholder:text-white/50 text-sm font-medium focus:outline-none focus:bg-white/20 focus:border-white/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {/* Stats */}
          <div className="flex flex-wrap gap-8">
            {HERO_STATS.map(({ value, label }) => (
              <div key={label}>
                <div className="font-headline font-extrabold text-2xl sm:text-3xl">{value}</div>
                <div className="text-white/60 text-sm mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick chips ─────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip.id}
                onClick={() => handleQuickChip(chip.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                  quickChip === chip.id
                    ? "bg-primary text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6 lg:gap-8 items-start">

          {/* ── Sidebar ─────────────────────────────────────────────────────── */}
          <aside className="hidden lg:block w-56 xl:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-[60px]">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-on-surface text-sm">Фильтры</span>
                {activeFilterCount > 0 && (
                  <button onClick={resetFilters} className="text-xs text-primary hover:underline font-medium">
                    Сбросить
                  </button>
                )}
              </div>

              {/* Toggles */}
              <div className="space-y-3 pb-4 mb-4 border-b border-slate-100">
                {TOGGLE_FILTERS.map(({ key, label }) => {
                  const value   = key === "openNow" ? filterOpenNow : filterDMS;
                  const handler = key === "openNow" ? handleFilterOpenNow : handleFilterDMS;
                  return (
                    <label key={key} className="flex items-center justify-between cursor-pointer select-none">
                      <span className="text-sm text-on-surface">{label}</span>
                      <button
                        onClick={handler}
                        className={`relative w-9 h-5 rounded-full transition-colors ${value ? "bg-secondary" : "bg-slate-200"}`}
                        aria-label={label}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? "translate-x-4" : ""}`} />
                      </button>
                    </label>
                  );
                })}
              </div>

              {/* Metro */}
              <div className="pb-4 mb-4 border-b border-slate-100">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-3">Метро</p>
                <select
                  value={selectedMetro}
                  onChange={(e) => handleMetro(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Любое метро</option>
                  {metroOptions.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div className="pb-4 mb-4 border-b border-slate-100">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-3">Рейтинг</p>
                <div className="flex flex-col gap-2">
                  {([0, 4.0, 4.5, 4.8] as const).map((val) => (
                    <label key={val} className="flex items-center gap-2.5 cursor-pointer select-none">
                      <span
                        onClick={() => handleMinRating(val)}
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                          minRating === val ? "border-primary bg-primary" : "border-slate-200 hover:border-primary/50"
                        }`}
                      >
                        {minRating === val && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
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
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-3">Специализация</p>
                <div className="flex flex-col gap-2">
                  {SPECIALTY_FILTERS.map((spec) => (
                    <label key={spec} className="flex items-center gap-2.5 cursor-pointer select-none group">
                      <span
                        onClick={() => handleToggleSpecialty(spec)}
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${
                          selectedSpecialties.includes(spec)
                            ? "border-primary bg-primary"
                            : "border-slate-200 group-hover:border-primary/40"
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

          {/* ── Results ─────────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-5 flex-wrap sm:flex-nowrap">
              {/* Mobile filter button */}
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-on-surface shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 12h10M11 20h2" />
                </svg>
                Фильтры
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Count */}
              <p className="text-sm text-on-surface-variant flex-1">
                <span className="font-bold text-on-surface">{sorted.length}</span>{" "}
                {sorted.length === 1 ? "клиника" : sorted.length < 5 ? "клиники" : "клиник"}
              </p>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-on-surface-variant hidden sm:block">Сортировка:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortBy(e.target.value as SortKey)}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mobile filters panel */}
            {filtersOpen && (
              <div className="lg:hidden bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-on-surface text-sm">Фильтры</span>
                  {activeFilterCount > 0 && (
                    <button onClick={resetFilters} className="text-xs text-primary hover:underline font-medium">Сбросить</button>
                  )}
                </div>
                <div className="space-y-3 mb-4">
                  {TOGGLE_FILTERS.map(({ key, label }) => {
                    const value   = key === "openNow" ? filterOpenNow : filterDMS;
                    const handler = key === "openNow" ? handleFilterOpenNow : handleFilterDMS;
                    return (
                      <label key={key} className="flex items-center justify-between cursor-pointer select-none">
                        <span className="text-sm text-on-surface">{label}</span>
                        <button
                          onClick={handler}
                          className={`relative w-9 h-5 rounded-full transition-colors ${value ? "bg-secondary" : "bg-slate-200"}`}
                          aria-label={label}
                        >
                          <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? "translate-x-4" : ""}`} />
                        </button>
                      </label>
                    );
                  })}
                </div>
                {/* Mobile metro */}
                <div className="mb-4">
                  <select
                    value={selectedMetro}
                    onChange={(e) => handleMetro(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-on-surface focus:outline-none"
                  >
                    <option value="">Любое метро</option>
                    {metroOptions.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SPECIALTY_FILTERS.map((spec) => (
                    <button
                      key={spec}
                      onClick={() => handleToggleSpecialty(spec)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        selectedSpecialties.includes(spec)
                          ? "bg-primary text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cards */}
            {paginated.length > 0 ? (
              <>
                <div className="flex flex-col gap-4">
                  {paginated.map(({ clinic, isOpen }) => (
                    <ClinicCard key={clinic.slug} clinic={clinic} isOpen={isOpen} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={safePage <= 1}
                      className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-on-surface hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Назад
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                          p === safePage
                            ? "bg-primary text-white shadow-sm"
                            : "bg-white border border-slate-200 text-on-surface hover:bg-slate-50"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={safePage >= totalPages}
                      className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-on-surface hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Вперёд →
                    </button>
                  </div>
                )}

                {/* Page info */}
                {totalPages > 1 && (
                  <p className="text-center text-xs text-on-surface-variant mt-3">
                    Страница {safePage} из {totalPages} · {sorted.length} клиник
                  </p>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="font-bold text-on-surface text-lg mb-1">Клиники не найдены</p>
                <p className="text-on-surface-variant text-sm mb-4">
                  Попробуйте изменить параметры фильтрации
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Сбросить фильтры
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

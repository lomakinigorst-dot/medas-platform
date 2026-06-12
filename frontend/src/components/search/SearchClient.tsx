"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { LayoutList, MapPin, X, Search } from "lucide-react";

type SortKey = "rating" | "experience" | "price";
type Gender = "any" | "male" | "female";
type Experience = "any" | "5+" | "10+";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  badge: { label: string; color: string };
  rating: string;
  reviews: number;
  price: number;
  experience: number;
  district: string;
  metro: string;
  languages: string;
  tags: string[];
  dms: boolean;
  online: boolean;
  homeVisit: boolean;
  gender: "male" | "female";
  availability: string[];
  image: string;
}

interface FilterState {
  query: string;
  availability: string[];
  experience: Experience;
  priceMax: number;
  homeVisit: boolean;
  gender: Gender;
  metro: string[];
  dms: boolean;
  online: boolean;
}

const METRO_OPTIONS = [
  "Парк Культуры",
  "Киевская",
  "Смоленская",
  "Арбатская",
  "Фрунзенская",
  "Спортивная",
];

const INIT_FILTERS: FilterState = {
  query: "",
  availability: [],
  experience: "any",
  priceMax: 10000,
  homeVisit: false,
  gender: "any",
  metro: [],
  dms: false,
  online: false,
};

const DOCTORS: Doctor[] = [
  {
    id: 1,
    name: "Др. Юлиан Вейн",
    specialty: "Ведущий кардиолог",
    badge: { label: "Проверен", color: "bg-[#e3fcef] text-[#006644]" },
    rating: "4.9", reviews: 128, price: 4500, experience: 14,
    district: "Хамовники", metro: "Парк Культуры",
    languages: "Русский, Английский",
    tags: ["Кардиохирургия", "Ангиопластика"],
    dms: true, online: false, homeVisit: false, gender: "male",
    availability: ["Завтра"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKTYoAneGY9KsJF08Mzt1EmzImK-gCJzb-H9R8_ajgoOd2kadkgiZjWpNAPmzVSJKgLhh_64a59PCBuwyd-6bkhU0dpVH4RflsMaodnfScl7gY3GG2oYCB-TVbrHPbYczFcuIHxxU_gm04L4Umve52x5JRUKmFXGsexgrkuCCJW9-qAN1WsV3wo3yBAJp7vlm3ZAD_ChQWC0ZLJAB914SAAsGkP9LMCasx1X4K7IUeVXp1lWpUWuFMIkqh_rku-GWuQ6gFekpl7pvl",
  },
  {
    id: 2,
    name: "Др. Сара Чэнь",
    specialty: "Неврология и медицина сна",
    badge: { label: "Высокий рейтинг", color: "bg-[#cde5ff] text-[#001d32]" },
    rating: "5.0", reviews: 210, price: 5200, experience: 11,
    district: "Пресненский", metro: "Киевская",
    languages: "Русский, Китайский",
    tags: ["ЭЭГ анализ", "Терапия бессонницы"],
    dms: false, online: true, homeVisit: true, gender: "female",
    availability: ["Сегодня"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_kO26lNndjzlxZIowSIAJR3giIFdAEseTqhy9fCWMojDJ-C2lzsIAMHqs0UCPfueCWsh0dzH96DmHGO55X6UzJ0l_8FvoUTEsX48QTmtozk7dNJFOScvMkR7Aa0rSN7PlFT-Npu2JsCHmElG0hm8Dy41_dUozbFRnXBl1A-yKCQ_ObT7tY44evjrwXgLhGGzQaaj81tCA7b5ojAg0NI_ILY2lh42UreYHTUyp_jZEEKxe3PuETO6SPr4IlubRQBZw0MCpTF58URX2",
  },
  {
    id: 3,
    name: "Др. Маркус Торн",
    specialty: "Травматолог-ортопед",
    badge: { label: "Доступно сегодня", color: "bg-[#ffdad6] text-[#93000a]" },
    rating: "4.8", reviews: 94, price: 3800, experience: 8,
    district: "Смоленский", metro: "Смоленская",
    languages: "Русский, Испанский",
    tags: ["Протезирование", "Спортивная травма"],
    dms: true, online: false, homeVisit: false, gender: "male",
    availability: ["Сегодня"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7zrgvascA2D-A5c_fKnMbj97L5kIpG8n6mVSyruXIPtl-smjfYpAqUfN6RSi3T0fVA81781M0WBYGtC68vqypTdkkamLaogY8HZ29kdN4lNfl2QcWjtRfohdrTagMB0l63cgSSh27D3lVXzG9bdRhz6840W_0PRWFeOOSbINAS5OXaB4Rl8y7foS6WVLjFGKhk636iGe90ktnUTOQpaj2wnzcRHFkZcD4IKZcSn97ejZDU4raPJILOc38Wm6ytsv8wXi_ahbTuUwG",
  },
  {
    id: 4,
    name: "Др. Ольга Кузнецова",
    specialty: "Педиатр",
    badge: { label: "Проверен", color: "bg-[#e3fcef] text-[#006644]" },
    rating: "4.9", reviews: 315, price: 2900, experience: 16,
    district: "Арбат", metro: "Арбатская",
    languages: "Русский",
    tags: ["Вакцинация", "Педиатрия новорождённых"],
    dms: true, online: true, homeVisit: true, gender: "female",
    availability: ["Сегодня", "Завтра"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKtcddeCJo2aaollHWQh_nxi13IbCEBciLCk2L0LwoWwj3hVhhLsCJJiqxL65YlPRx860rs051QsGmZqVKH8czhe5YeYBwzAuRZPKNrjOHTPs2-TD9XrvNsOZMdR20GjPafAKx_PSy0LjqHCAHizEpY6DB3WEYh8ZfaJImxwEkCDtNBlEcAVAn2ywR4kwE9oIW74-l4CdRZ_XdWasCPEdZNLvicNgFivd2dJ2mVPDqr0eXkucz68s7KHxlZpCoXTlUQqdwZneWVjVC",
  },
  {
    id: 5,
    name: "Др. Алексей Романов",
    specialty: "Офтальмолог",
    badge: { label: "Высокий рейтинг", color: "bg-[#cde5ff] text-[#001d32]" },
    rating: "4.7", reviews: 87, price: 4100, experience: 12,
    district: "Лужники", metro: "Спортивная",
    languages: "Русский, Немецкий",
    tags: ["Лазерная коррекция", "Катаракта"],
    dms: false, online: false, homeVisit: false, gender: "male",
    availability: ["Выходные"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDq1AZIgGrFEhJgC69aFoT5u_uxpWZ1Nz3-31VxcDuyU9GIAlHjaFYr-rftAGOjaI11K-jDo5QrkCrn1xcK9iMqBAWTnzQzK-D_oMavx2mJRR0WjC5a9RPae7dOTgQLxm6BHVAEQCSLqOviik4GQA3jcEc8nGjI_ZwxLBkV5mXz7MUl6NjYmKQbm3UT2ld6maSvncePIS-HjKLKICeh9-WuWFKobc8PXVCTgbGpN8tEdt6DhMCQ_DWNmO9g_pEHZbzUYYmw4qgy3C2s",
  },
  {
    id: 6,
    name: "Др. Наталья Соколова",
    specialty: "Дерматолог-косметолог",
    badge: { label: "Доступно сегодня", color: "bg-[#ffdad6] text-[#93000a]" },
    rating: "5.0", reviews: 143, price: 6000, experience: 9,
    district: "Фрунзенский", metro: "Фрунзенская",
    languages: "Русский, Английский",
    tags: ["Омоложение", "Дерматоскопия"],
    dms: true, online: true, homeVisit: false, gender: "female",
    availability: ["Сегодня"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfji4DzvQwAS_vE5WAW1Qu2Uc-h0Bk70_CUz_K7Yn39JxEK_STOGWXKepw505VCwfRs2E1BeZ9yhXxT9kM07iDPePMliXk0HWzD3nPfMVBOpxWBVsPLqCNZVGfXQUu-VCsLh85FiLJy960lRGhAV8XlpjDMR8lkDoU9bhQHoa8GnecMg2XCJtRflsRrc3dJcodhmSoLBTMUIM744Gf582JtC1M_aV_fNp4gJ2auPQTXR7fD9FM5VOkZ5Uybr2umOGl_uTOUwpjvPGA",
  },
  {
    id: 7,
    name: "Др. Виктор Петров",
    specialty: "Гастроэнтеролог",
    badge: { label: "Проверен", color: "bg-[#e3fcef] text-[#006644]" },
    rating: "4.6", reviews: 67, price: 3500, experience: 20,
    district: "Лужники", metro: "Спортивная",
    languages: "Русский",
    tags: ["Эндоскопия", "Лечение ЖКТ"],
    dms: false, online: false, homeVisit: false, gender: "male",
    availability: ["Завтра", "Выходные"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxlrGg968dc2U1Hgky8rtnaBSdYNDDFa24b4sKya2ivDVfCLjWWE8WhzbbYD18znoAl6a_MFIlQa-UftXOWpAJZw2u99qGlOrHXDxQXZgoY8igyEFm4a5MktvR4EsHDbkoB2UXz1xUHINjYND3eyJ2lID0ZejBWs4nfV26uvtBob1QsISLf1Cy4RYkLGSgOuzggsrjDH9xvDmb4renk3a_IJTtcBfJock8u7pW9uDv7wwnvXmRr_3swZq4t",
  },
  {
    id: 8,
    name: "Др. Ирина Волкова",
    specialty: "Эндокринолог",
    badge: { label: "Высокий рейтинг", color: "bg-[#cde5ff] text-[#001d32]" },
    rating: "4.8", reviews: 192, price: 4800, experience: 13,
    district: "Пресненский", metro: "Киевская",
    languages: "Русский, Французский",
    tags: ["Диабет", "Щитовидная железа"],
    dms: true, online: true, homeVisit: true, gender: "female",
    availability: ["Сегодня", "Выходные"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_kO26lNndjzlxZIowSIAJR3giIFdAEseTqhy9fCWMojDJ-C2lzsIAMHqs0UCPfueCWsh0dzH96DmHGO55X6UzJ0l_8FvoUTEsX48QTmtozk7dNJFOScvMkR7Aa0rSN7PlFT-Npu2JsCHmElG0hm8Dy41_dUozbFRnXBl1A-yKCQ_ObT7tY44evjrwXgLhGGzQaaj81tCA7b5ojAg0NI_ILY2lh42UreYHTUyp_jZEEKxe3PuETO6SPr4IlubRQBZw0MCpTF58URX2",
  },
  {
    id: 9,
    name: "Др. Андрей Лебедев",
    specialty: "Психотерапевт",
    badge: { label: "Проверен", color: "bg-[#e3fcef] text-[#006644]" },
    rating: "4.9", reviews: 256, price: 7000, experience: 18,
    district: "Хамовники", metro: "Парк Культуры",
    languages: "Русский, Английский",
    tags: ["КПТ", "Работа с тревогой"],
    dms: false, online: true, homeVisit: false, gender: "male",
    availability: ["Завтра"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKTYoAneGY9KsJF08Mzt1EmzImK-gCJzb-H9R8_ajgoOd2kadkgiZjWpNAPmzVSJKgLhh_64a59PCBuwyd-6bkhU0dpVH4RflsMaodnfScl7gY3GG2oYCB-TVbrHPbYczFcuIHxxU_gm04L4Umve52x5JRUKmFXGsexgrkuCCJW9-qAN1WsV3wo3yBAJp7vlm3ZAD_ChQWC0ZLJAB914SAAsGkP9LMCasx1X4K7IUeVXp1lWpUWuFMIkqh_rku-GWuQ6gFekpl7pvl",
  },
];

const cardContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

export default function SearchClient() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>({
    ...INIT_FILTERS,
    query: searchParams?.get("q") ?? "",
  });
  const [isMapView, setIsMapView] = useState(false);
  const [metroOpen, setMetroOpen] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("rating");

  const filtered = useMemo(() => {
    const result = DOCTORS.filter((doc) => {
      if (filters.query) {
        const q = filters.query.toLowerCase();
        if (
          !doc.name.toLowerCase().includes(q) &&
          !doc.specialty.toLowerCase().includes(q) &&
          !doc.tags.some((t) => t.toLowerCase().includes(q))
        )
          return false;
      }
      if (
        filters.availability.length > 0 &&
        !filters.availability.some((a) => doc.availability.includes(a))
      )
        return false;
      if (filters.experience === "10+" && doc.experience < 10) return false;
      if (filters.experience === "5+" && doc.experience < 5) return false;
      if (filters.priceMax < 10000 && doc.price > filters.priceMax) return false;
      if (filters.homeVisit && !doc.homeVisit) return false;
      if (filters.gender !== "any" && doc.gender !== filters.gender) return false;
      if (filters.metro.length > 0 && !filters.metro.includes(doc.metro)) return false;
      if (filters.dms && !doc.dms) return false;
      if (filters.online && !doc.online) return false;
      return true;
    });
    return [...result].sort((a, b) => {
      if (sortKey === "experience") return b.experience - a.experience;
      if (sortKey === "price") return a.price - b.price;
      return parseFloat(b.rating) - parseFloat(a.rating);
    });
  }, [filters, sortKey]);

  const activeChips = useMemo(() => {
    const chips: { label: string; remove: () => void }[] = [];
    if (filters.query)
      chips.push({
        label: `"${filters.query}"`,
        remove: () => setFilters((p) => ({ ...p, query: "" })),
      });
    filters.availability.forEach((a) =>
      chips.push({
        label: a,
        remove: () =>
          setFilters((p) => ({
            ...p,
            availability: p.availability.filter((x) => x !== a),
          })),
      })
    );
    if (filters.experience !== "any")
      chips.push({
        label: `Стаж ${filters.experience}`,
        remove: () => setFilters((p) => ({ ...p, experience: "any" })),
      });
    if (filters.priceMax < 10000)
      chips.push({
        label: `до ${filters.priceMax.toLocaleString()} ₽`,
        remove: () => setFilters((p) => ({ ...p, priceMax: 10000 })),
      });
    if (filters.homeVisit)
      chips.push({
        label: "Выезд на дом",
        remove: () => setFilters((p) => ({ ...p, homeVisit: false })),
      });
    if (filters.gender !== "any")
      chips.push({
        label: filters.gender === "male" ? "Мужской" : "Женский",
        remove: () => setFilters((p) => ({ ...p, gender: "any" })),
      });
    filters.metro.forEach((m) =>
      chips.push({
        label: `м. ${m}`,
        remove: () =>
          setFilters((p) => ({ ...p, metro: p.metro.filter((x) => x !== m) })),
      })
    );
    if (filters.dms)
      chips.push({
        label: "ДМС",
        remove: () => setFilters((p) => ({ ...p, dms: false })),
      });
    if (filters.online)
      chips.push({
        label: "Онлайн",
        remove: () => setFilters((p) => ({ ...p, online: false })),
      });
    return chips;
  }, [filters]);

  const toggleArrayFilter = (key: "availability" | "metro", val: string) =>
    setFilters((p) => ({
      ...p,
      [key]: p[key].includes(val) ? p[key].filter((v) => v !== val) : [...p[key], val],
    }));

  return (
    <main className="pt-24 pb-16 bg-[#f7f9fb] min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-6">
        {/* Search bar + view toggle */}
        <div className="flex flex-col md:flex-row gap-3 mb-5 pt-4">
          <div className="flex-1 flex items-center gap-3 bg-white border border-[#c3c6d7]/30 rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 ring-[#003087]/10 transition-all">
            <Search className="w-5 h-5 text-[#737686] flex-shrink-0" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) =>
                setFilters((p) => ({ ...p, query: e.target.value }))
              }
              placeholder="Имя врача, специальность или симптом..."
              className="flex-1 bg-transparent outline-none text-[#1a1c2a] placeholder:text-[#a0a3b1] text-sm"
            />
            {filters.query && (
              <button
                onClick={() => setFilters((p) => ({ ...p, query: "" }))}
                className="text-[#737686] hover:text-[#1a1c2a] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center bg-white border border-[#c3c6d7]/30 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setIsMapView(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                !isMapView
                  ? "bg-[#003087] text-white"
                  : "text-[#737686] hover:text-[#003087]"
              }`}
            >
              <LayoutList className="w-4 h-4" />
              <span className="hidden sm:inline">Список</span>
            </button>
            <button
              onClick={() => setIsMapView(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                isMapView
                  ? "bg-[#003087] text-white"
                  : "text-[#737686] hover:text-[#003087]"
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Карта</span>
            </button>
          </div>
        </div>

        {/* Active chips */}
        <AnimatePresence>
          {activeChips.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 mb-5 overflow-hidden"
            >
              {activeChips.map((chip) => (
                <motion.span
                  key={chip.label}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  className="flex items-center gap-1.5 bg-[#003087] text-white px-3 py-1.5 rounded-full text-xs font-bold"
                >
                  {chip.label}
                  <button
                    onClick={chip.remove}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
              <button
                onClick={() => setFilters(INIT_FILTERS)}
                className="text-xs text-[#737686] font-semibold hover:text-[#003087] transition-colors px-2 py-1.5"
              >
                Сбросить все
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-6 sticky top-24 border border-[#c3c6d7]/20 shadow-sm space-y-7">
              <div className="flex items-center justify-between">
                <h2 className="font-[family-name:var(--font-manrope)] font-bold text-lg">
                  Фильтры
                </h2>
                {activeChips.length > 0 && (
                  <button
                    onClick={() => setFilters(INIT_FILTERS)}
                    className="text-[#003087] text-xs font-semibold hover:underline"
                  >
                    Сбросить
                  </button>
                )}
              </div>

              {/* Availability */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-[#737686] mb-3 font-semibold">
                  Доступность
                </h3>
                <div className="space-y-2.5">
                  {["Сегодня", "Завтра", "Выходные"].map((item) => (
                    <label key={item} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.availability.includes(item)}
                        onChange={() => toggleArrayFilter("availability", item)}
                        className="rounded w-4 h-4 text-[#003087] border-[#c3c6d7] cursor-pointer accent-[#003087]"
                      />
                      <span className="text-sm font-medium group-hover:text-[#003087] transition-colors">
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Metro */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-[#737686] mb-3 font-semibold">
                  Метро
                </h3>
                <div className="space-y-2">
                  {METRO_OPTIONS.slice(0, metroOpen ? undefined : 4).map((m) => (
                    <label key={m} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.metro.includes(m)}
                        onChange={() => toggleArrayFilter("metro", m)}
                        className="rounded w-4 h-4 cursor-pointer accent-[#003087]"
                      />
                      <span className="text-sm font-medium group-hover:text-[#003087] transition-colors">
                        {m}
                      </span>
                    </label>
                  ))}
                  {METRO_OPTIONS.length > 4 && (
                    <button
                      onClick={() => setMetroOpen((v) => !v)}
                      className="text-[#003087] text-xs font-semibold hover:underline mt-1"
                    >
                      {metroOpen ? "Скрыть" : `Ещё ${METRO_OPTIONS.length - 4}`}
                    </button>
                  )}
                </div>
              </div>

              {/* Experience */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-[#737686] mb-3 font-semibold">
                  Стаж
                </h3>
                <div className="space-y-2.5">
                  {(["any", "5+", "10+"] as Experience[]).map((val) => (
                    <label key={val} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="experience"
                        checked={filters.experience === val}
                        onChange={() =>
                          setFilters((p) => ({ ...p, experience: val }))
                        }
                        className="w-4 h-4 cursor-pointer accent-[#003087]"
                      />
                      <span className="text-sm font-medium">
                        {val === "any"
                          ? "Любой"
                          : val === "5+"
                          ? "Более 5 лет"
                          : "Более 10 лет"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-[#737686] mb-3 font-semibold">
                  Цена приёма
                </h3>
                <input
                  type="range"
                  min={500}
                  max={10000}
                  step={100}
                  value={filters.priceMax}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, priceMax: Number(e.target.value) }))
                  }
                  className="w-full cursor-pointer accent-[#003087]"
                />
                <div className="flex justify-between mt-1.5 text-xs font-bold text-[#737686]">
                  <span>500 ₽</span>
                  <span className="text-[#003087]">
                    {filters.priceMax === 10000
                      ? "Любая"
                      : `${filters.priceMax.toLocaleString()} ₽`}
                  </span>
                </div>
              </div>

              {/* Format toggles: ДМС, Онлайн, Выезд */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider text-[#737686] mb-1 font-semibold">
                  Формат
                </h3>
                {(
                  [
                    { key: "dms", label: "Принимает ДМС" },
                    { key: "online", label: "Онлайн-консультация" },
                    { key: "homeVisit", label: "Выезд на дом" },
                  ] as Array<{ key: "dms" | "online" | "homeVisit"; label: string }>
                ).map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{label}</span>
                    <button
                      onClick={() => setFilters((p) => ({ ...p, [key]: !p[key] }))}
                      className={`w-10 h-5 rounded-full relative transition-colors flex-shrink-0 ${
                        filters[key] ? "bg-[#003087]" : "bg-[#e6e8ea]"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          filters[key] ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              {/* Gender */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-[#737686] mb-3 font-semibold">
                  Пол врача
                </h3>
                <div className="flex gap-2">
                  {(["any", "male", "female"] as Gender[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => setFilters((p) => ({ ...p, gender: g }))}
                      className={`flex-1 py-2 px-1.5 rounded-lg text-xs font-bold transition-all ${
                        filters.gender === g
                          ? "bg-[#003087] text-white"
                          : "bg-white border border-[#c3c6d7]/40 text-[#434655] hover:bg-[#003087]/5"
                      }`}
                    >
                      {g === "any" ? "Любой" : g === "male" ? "Муж." : "Жен."}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <section className="lg:col-span-9">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
              <div>
                <h1 className="font-[family-name:var(--font-manrope)] text-3xl font-extrabold tracking-tight">
                  Специалисты в{" "}
                  <span className="text-[#003087]">Москве</span>
                </h1>
                <p className="text-[#434655] mt-1">
                  Найдено{" "}
                  <span className="font-bold text-[#003087]">
                    {filtered.length}
                  </span>{" "}
                  {filtered.length === 1 ? "врача" : "врачей"}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-[#737686]">Сортировать:</span>
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="bg-transparent border-none font-bold text-[#003087] focus:ring-0 p-0 cursor-pointer text-sm"
                >
                  <option value="rating">По рейтингу</option>
                  <option value="experience">По стажу</option>
                  <option value="price">Сначала дешевле</option>
                </select>
              </div>
            </div>

            {isMapView ? (
              <div className="relative bg-[#e8eef5] rounded-2xl overflow-hidden h-[560px] flex items-center justify-center border border-[#c3c6d7]/30">
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #003087 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />
                {filtered.map((doc, i) => (
                  <div
                    key={doc.id}
                    className="absolute bg-[#003087] text-white p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform hover:bg-[#00a982]"
                    style={{
                      left: `${15 + (i * 13) % 68}%`,
                      top: `${18 + (i * 19) % 52}%`,
                    }}
                    title={doc.name}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                ))}
                <div className="relative z-10 text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                  <MapPin className="w-12 h-12 text-[#003087] mx-auto mb-3" />
                  <p className="font-[family-name:var(--font-manrope)] font-bold text-xl text-[#1a1c2a]">
                    Карта скоро
                  </p>
                  <p className="text-[#737686] mt-1 text-sm">
                    Интеграция с Яндекс.Картами в разработке
                  </p>
                  <p className="text-[#003087] font-bold mt-2 text-sm">
                    {filtered.length} врачей в выбранной области
                  </p>
                </div>
              </div>
            ) : (
              <motion.div
                key={filtered.map((d) => d.id).join(",")}
                variants={cardContainer}
                initial="hidden"
                animate="show"
                className="space-y-5"
              >
                {filtered.length === 0 ? (
                  <motion.div
                    variants={cardItem}
                    className="text-center py-20 text-[#737686]"
                  >
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="font-[family-name:var(--font-manrope)] font-bold text-xl">
                      Врачи не найдены
                    </p>
                    <p className="mt-1 text-sm">
                      Попробуйте изменить фильтры
                    </p>
                    <button
                      onClick={() => setFilters(INIT_FILTERS)}
                      className="mt-5 bg-[#003087] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
                    >
                      Сбросить фильтры
                    </button>
                  </motion.div>
                ) : (
                  filtered.map((doc) => (
                    <motion.div
                      key={doc.id}
                      variants={cardItem}
                      className="bg-white p-6 rounded-2xl flex flex-col md:flex-row gap-6 hover:shadow-xl hover:shadow-[#003087]/5 transition-all group border border-[#c3c6d7]/10"
                    >
                      <div className="w-full md:w-44 h-52 rounded-xl overflow-hidden flex-shrink-0 bg-[#eceef0]">
                        <Image
                          src={doc.image}
                          alt={doc.name}
                          width={176}
                          height={208}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized
                        />
                      </div>
                      <div className="flex-grow space-y-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${doc.badge.color}`}
                              >
                                {doc.badge.label}
                              </span>
                              {doc.dms && (
                                <span className="px-2 py-0.5 rounded bg-[#f0f4ff] text-[#003087] text-[10px] font-bold uppercase tracking-widest">
                                  ДМС
                                </span>
                              )}
                              {doc.online && (
                                <span className="px-2 py-0.5 rounded bg-[#f0faf8] text-[#00a982] text-[10px] font-bold uppercase tracking-widest">
                                  Онлайн
                                </span>
                              )}
                              <div className="flex items-center gap-0.5">
                                <span className="text-sm">⭐</span>
                                <span className="text-sm font-bold text-[#00598a]">
                                  {doc.rating}
                                </span>
                                <span className="text-[#737686] text-xs ml-0.5">
                                  ({doc.reviews})
                                </span>
                              </div>
                            </div>
                            <h2 className="font-[family-name:var(--font-manrope)] text-xl font-bold">
                              {doc.name}
                            </h2>
                            <p className="text-[#003087] font-semibold text-sm mt-0.5">
                              {doc.specialty}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-extrabold font-[family-name:var(--font-manrope)]">
                              {doc.price.toLocaleString()} ₽
                            </p>
                            <p className="text-[10px] text-[#737686] font-bold uppercase tracking-tighter">
                              за консультацию
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 py-3 border-y border-[#c3c6d7]/10">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#f2f4f6] flex items-center justify-center text-sm flex-shrink-0">
                              ⏱
                            </div>
                            <div>
                              <p className="text-xs text-[#737686] font-medium">Стаж</p>
                              <p className="text-sm font-bold">{doc.experience} лет</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#f2f4f6] flex items-center justify-center text-sm flex-shrink-0">
                              🚇
                            </div>
                            <div>
                              <p className="text-xs text-[#737686] font-medium">Метро</p>
                              <p className="text-sm font-bold">{doc.metro}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#f2f4f6] flex items-center justify-center text-sm flex-shrink-0">
                              🌐
                            </div>
                            <div>
                              <p className="text-xs text-[#737686] font-medium">Языки</p>
                              <p className="text-sm font-bold">{doc.languages}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                          <div className="flex flex-wrap gap-2">
                            {doc.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 rounded-lg bg-[#e6e8ea] text-[#434655] text-xs font-bold"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <Link
                            href={`/doctor/${doc.id}`}
                            className="bg-[#003087] text-white px-7 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-[#003087]/10"
                          >
                            Записаться
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

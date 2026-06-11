import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";

const doctors = [
  {
    id: 1,
    name: "Др. Юлиан Вейн",
    specialty: "Ведущий кардиолог",
    badge: { label: "Проверен", color: "bg-[#e3fcef] text-[#006644]" },
    rating: "4.9",
    reviews: 128,
    price: "4 500",
    experience: "14 лет",
    district: "Хамовники",
    languages: "Русский, Английский",
    tags: ["Кардиохирургия", "Ангиопластика"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKTYoAneGY9KsJF08Mzt1EmzImK-gCJzb-H9R8_ajgoOd2kadkgiZjWpNAPmzVSJKgLhh_64a59PCBuwyd-6bkhU0dpVH4RflsMaodnfScl7gY3GG2oYCB-TVbrHPbYczFcuIHxxU_gm04L4Umve52x5JRUKmFXGsexgrkuCCJW9-qAN1WsV3wo3yBAJp7vlm3ZAD_ChQWC0ZLJAB914SAAsGkP9LMCasx1X4K7IUeVXp1lWpUWuFMIkqh_rku-GWuQ6gFekpl7pvl",
  },
  {
    id: 2,
    name: "Др. Сара Чэнь",
    specialty: "Неврология и медицина сна",
    badge: { label: "Высокий рейтинг", color: "bg-[#cde5ff] text-[#001d32]" },
    rating: "5.0",
    reviews: 210,
    price: "5 200",
    experience: "11 лет",
    district: "Выезд на дом",
    languages: "Русский, Китайский",
    tags: ["ЭЭГ анализ", "Терапия бессонницы"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_kO26lNndjzlxZIowSIAJR3giIFdAEseTqhy9fCWMojDJ-C2lzsIAMHqs0UCPfueCWsh0dzH96DmHGO55X6UzJ0l_8FvoUTEsX48QTmtozk7dNJFOScvMkR7Aa0rSN7PlFT-Npu2JsCHmElG0hm8Dy41_dUozbFRnXBl1A-yKCQ_ObT7tY44evjrwXgLhGGzQaaj81tCA7b5ojAg0NI_ILY2lh42UreYHTUyp_jZEEKxe3PuETO6SPr4IlubRQBZw0MCpTF58URX2",
  },
  {
    id: 3,
    name: "Др. Маркус Торн",
    specialty: "Травматолог-ортопед",
    badge: { label: "Доступно сегодня", color: "bg-[#ffdad6] text-[#93000a]" },
    rating: "4.8",
    reviews: 94,
    price: "3 800",
    experience: "8 лет",
    district: "Сегодня, 16:00",
    languages: "Русский, Испанский",
    tags: ["Протезирование", "Спортивная травма"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7zrgvascA2D-A5c_fKnMbj97L5kIpG8n6mVSyruXIPtl-smjfYpAqUfN6RSi3T0fVA81781M0WBYGtC68vqypTdkkamLaogY8HZ29kdN4lNfl2QcWjtRfohdrTagMB0l63cgSSh27D3lVXzG9bdRhz6840W_0PRWFeOOSbINAS5OXaB4Rl8y7foS6WVLjFGKhk636iGe90ktnUTOQpaj2wnzcRHFkZcD4IKZcSn97ejZDU4raPJILOc38Wm6ytsv8wXi_ahbTuUwG",
  },
];

export default function SearchPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-12 max-w-screen-2xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-xl p-6 sticky top-24 border border-[#c3c6d7]/20 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-[family-name:var(--font-manrope)] font-bold text-lg">Фильтры</h2>
              <button className="text-[#003087] text-xs font-semibold">Сбросить все</button>
            </div>
            <div className="space-y-8">
              {/* Availability */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-[#737686] mb-4 font-semibold">Доступность</h3>
                <div className="space-y-3">
                  {["Сегодня", "Завтра", "Выходные"].map((item) => (
                    <label key={item} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="rounded w-5 h-5 text-[#003087] border-[#c3c6d7]" />
                      <span className="text-sm font-medium group-hover:text-[#003087] transition-colors">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Experience */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-[#737686] mb-4 font-semibold">Стаж</h3>
                <div className="space-y-3">
                  {["Более 10 лет", "Более 5 лет", "Любой стаж"].map((item, i) => (
                    <label key={item} className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="exp" defaultChecked={i === 2} className="w-5 h-5 text-[#003087] border-[#c3c6d7]" />
                      <span className="text-sm font-medium">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Price */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-[#737686] mb-4 font-semibold">Стоимость приема</h3>
                <input type="range" className="w-full accent-[#003087] h-1 rounded-full appearance-none bg-[#e6e8ea]" />
                <div className="flex justify-between mt-2 text-xs font-bold text-[#737686]">
                  <span>500 ₽</span><span>10 000 ₽+</span>
                </div>
              </div>
              {/* Home visit */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-[#737686] mb-4 font-semibold">Выезд на дом</h3>
                <div className="flex items-center justify-between p-3 bg-[#e6e8ea] rounded-lg cursor-pointer">
                  <span className="text-sm font-semibold">Включить выезд</span>
                  <div className="w-10 h-6 bg-[#003087] rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              {/* Gender */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-[#737686] mb-4 font-semibold">Пол</h3>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 px-3 bg-white border border-[#c3c6d7]/30 rounded-lg text-xs font-bold hover:bg-[#003087] hover:text-white transition-all">Мужской</button>
                  <button className="flex-1 py-2 px-3 bg-white border border-[#c3c6d7]/30 rounded-lg text-xs font-bold hover:bg-[#003087] hover:text-white transition-all">Женский</button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <section className="lg:col-span-9 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
            <div>
              <h1 className="font-[family-name:var(--font-manrope)] text-3xl font-extrabold tracking-tight">
                Специалисты в <span className="text-[#003087]">Москве</span>
              </h1>
              <p className="text-[#434655] mt-1">Найдено 142 проверенных врача</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="text-[#737686]">Сортировать:</span>
              <select className="bg-transparent border-none font-bold text-[#003087] focus:ring-0 p-0 cursor-pointer">
                <option>По рейтингу</option>
                <option>По стажу</option>
                <option>Сначала дешевле</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {doctors.map((doc) => (
              <div key={doc.id} className="bg-white p-6 rounded-xl flex flex-col md:flex-row gap-8 hover:shadow-xl hover:shadow-[#003087]/5 transition-all group border border-[#c3c6d7]/10">
                <div className="w-full md:w-48 h-60 rounded-xl overflow-hidden flex-shrink-0 bg-[#eceef0]">
                  <Image
                    src={doc.image}
                    alt={doc.name}
                    width={192}
                    height={240}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex-grow space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${doc.badge.color}`}>
                          {doc.badge.label}
                        </span>
                        <div className="flex items-center text-[#00598a]">
                          <span className="text-sm">⭐</span>
                          <span className="text-sm font-bold ml-1">{doc.rating}</span>
                          <span className="text-[#737686] text-xs ml-1">({doc.reviews} отзывов)</span>
                        </div>
                      </div>
                      <h2 className="font-[family-name:var(--font-manrope)] text-2xl font-bold">{doc.name}</h2>
                      <p className="text-[#003087] font-semibold">{doc.specialty}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-extrabold">{doc.price} ₽</p>
                      <p className="text-xs text-[#737686] font-bold uppercase tracking-tighter">за консультацию</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 border-y border-[#c3c6d7]/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#f2f4f6] flex items-center justify-center text-[#003087] text-sm">⏱</div>
                      <div>
                        <p className="text-xs text-[#737686] font-medium">Стаж</p>
                        <p className="text-sm font-bold">{doc.experience}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#f2f4f6] flex items-center justify-center text-[#003087] text-sm">📍</div>
                      <div>
                        <p className="text-xs text-[#737686] font-medium">Район</p>
                        <p className="text-sm font-bold">{doc.district}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#f2f4f6] flex items-center justify-center text-[#003087] text-sm">🌐</div>
                      <div>
                        <p className="text-xs text-[#737686] font-medium">Языки</p>
                        <p className="text-sm font-bold">{doc.languages}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
                    <div className="flex gap-2">
                      {doc.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1.5 rounded bg-[#e6e8ea] text-[#434655] text-xs font-bold">{tag}</span>
                      ))}
                    </div>
                    <a href={`/doctor/${doc.id}`} className="bg-[#003087] text-white px-8 py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-[#003087]/10">
                      Записаться
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center pt-10">
            <nav className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#eceef0] hover:bg-[#003087] hover:text-white transition-colors">‹</button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#003087] text-white font-bold">1</button>
              {[2, 3].map((p) => (
                <button key={p} className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#eceef0] hover:bg-[#003087] hover:text-white transition-colors font-bold">{p}</button>
              ))}
              <span className="px-2">...</span>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#eceef0] hover:bg-[#003087] hover:text-white transition-colors font-bold">12</button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#eceef0] hover:bg-[#003087] hover:text-white transition-colors">›</button>
            </nav>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

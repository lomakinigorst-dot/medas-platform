import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchClient, { type Doctor } from "@/components/search/SearchClient";
import { fetchDoctors, type ApiDoctor } from "@/lib/api";

export const metadata = {
  title: "Поиск врачей — MEDAS",
  description:
    "Найдите проверенных специалистов в Москве. Фильтры по метро, ДМС, онлайн приёму.",
};

function apiDoctorToDoctor(d: ApiDoctor, idx: number): Doctor {
  return {
    id: idx + 1,
    name: d.name,
    specialty: d.specialty,
    badge: d.is_verified
      ? { label: "Проверен", color: "bg-[#e3fcef] text-[#006644]" }
      : { label: "Специалист", color: "bg-slate-100 text-slate-600" },
    rating: d.rating.toFixed(1),
    reviews: d.review_count,
    price: d.price,
    experience: d.experience,
    district: "",
    metro: "",
    languages: "Русский",
    tags: [],
    dms: false,
    online: false,
    homeVisit: false,
    gender: "male",
    availability: [],
    image: d.avatar ?? "",
  };
}

export default async function SearchPage() {
  const apiDoctors = await fetchDoctors();
  const initialDoctors: Doctor[] = apiDoctors.map(apiDoctorToDoctor);

  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="pt-32 pb-16 flex items-center justify-center min-h-screen bg-[#f7f9fb]">
            <div className="text-[#737686] text-sm font-medium">Загрузка...</div>
          </div>
        }
      >
        <SearchClient initialDoctors={initialDoctors} />
      </Suspense>
      <Footer />
    </>
  );
}

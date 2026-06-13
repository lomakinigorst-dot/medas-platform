import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchClient from "@/components/search/SearchClient";
import { fetchDoctors, apiDoctorToDoctor } from "@/lib/api";

export const metadata = {
  title: "Поиск врачей — MEDAS",
  description:
    "Найдите проверенных специалистов в Москве. Фильтры по метро, ДМС, онлайн приёму.",
};

export default async function SearchPage() {
  const apiDoctors = await fetchDoctors();
  const initialDoctors = (apiDoctors ?? []).map(apiDoctorToDoctor);

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

import type { Metadata } from "next";
import { fetchClinics, apiClinicToClinic } from "@/lib/api";
import { getClinics } from "@/lib/clinics";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ClinicsClient from "@/components/clinic/ClinicsClient";

export const metadata: Metadata = {
  title: "Клиники в Москве — MEDAS",
  description:
    "Каталог медицинских клиник Москвы: рейтинги, специализации, онлайн-запись. Работаем с ДМС. Найдите клинику рядом с вами.",
  robots: "noindex, nofollow",
};

export default async function ClinicsPage() {
  const apiClinics = await fetchClinics();
  const clinics = apiClinics !== null
    ? apiClinics.map(apiClinicToClinic)
    : getClinics();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-surface pt-20 lg:pt-[110px] pb-16">
        <ClinicsClient clinics={clinics} />
      </main>
      <Footer />
    </>
  );
}

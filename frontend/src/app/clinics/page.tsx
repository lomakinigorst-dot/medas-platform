import type { Metadata } from "next";
import { fetchClinics, type ApiClinic } from "@/lib/api";
import { getClinics, type Clinic } from "@/lib/clinics";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ClinicsClient from "@/components/clinic/ClinicsClient";

export const metadata: Metadata = {
  title: "Клиники в Москве — MEDAS",
  description:
    "Каталог медицинских клиник Москвы: рейтинги, специализации, онлайн-запись. Работаем с ДМС. Найдите клинику рядом с вами.",
  robots: "noindex, nofollow",
};

function apiClinicToClinic(c: ApiClinic): Clinic {
  return {
    slug: c.slug,
    name: c.name,
    address: c.address,
    phone: c.phone ?? "",
    email: "",
    rating: c.rating,
    reviewCount: c.review_count,
    description: c.description ?? "",
    hours: { weekdays: "9:00–21:00", weekends: "10:00–18:00" },
    acceptsDMS: c.accepts_dms,
    stats: { specialties: 0, doctors: 0, patientsPerYear: "0" },
    services: [],
    specialtyTags: [],
    reviews: [],
    doctorSlugs: [],
    metro: c.metro ?? "",
    bookingsLastMonth: 0,
    scheduleByDay: [],
    ratingCategories: [],
    promotions: [],
    insuranceCompanies: [],
    certifications: [],
    parking: "",
  };
}

export default async function ClinicsPage() {
  const apiClinics = await fetchClinics();
  const clinics: Clinic[] = apiClinics.length > 0
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

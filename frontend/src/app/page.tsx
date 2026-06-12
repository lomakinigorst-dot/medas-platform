import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import SpecialtiesSection from "@/components/home/SpecialtiesSection";
import ClinicsSection from "@/components/home/ClinicsSection";
import OffersSection from "@/components/home/OffersSection";
import ArticlesSection from "@/components/home/ArticlesSection";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "MEDAS — Медицинский агрегатор: найти врача и клинику онлайн",
  description:
    "Найдите лучших врачей и клиники рядом с вами. 10 000+ проверенных специалистов, запись онлайн, отзывы пациентов, все медицинские направления.",
  keywords: [
    "найти врача",
    "запись к врачу онлайн",
    "клиники Москва",
    "медицинский агрегатор",
    "MEDAS",
  ],
  openGraph: {
    title: "MEDAS — Найдите врача онлайн",
    description:
      "10 000+ врачей, 500+ клиник. Запись онлайн — быстро и удобно.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pt-24">
        <HeroSection />
        <StatsSection />
        <SpecialtiesSection />
        <ClinicsSection />
        <OffersSection />
        <ArticlesSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

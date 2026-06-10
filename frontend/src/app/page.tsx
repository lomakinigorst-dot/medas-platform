import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import SpecialtiesSection from "@/components/home/SpecialtiesSection";
import ClinicsSection from "@/components/home/ClinicsSection";
import OffersSection from "@/components/home/OffersSection";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pt-24">
        <HeroSection />
        <SpecialtiesSection />
        <ClinicsSection />
        <OffersSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

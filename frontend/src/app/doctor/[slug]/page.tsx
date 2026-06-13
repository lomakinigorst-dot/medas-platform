import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import DoctorHero from "@/components/doctor/DoctorHero";
import DoctorTabs from "@/components/doctor/DoctorTabs";
import AppointmentSidebar from "@/components/doctor/AppointmentSidebar";
import SimilarDoctors from "@/components/doctor/SimilarDoctors";
import { getDoctorBySlug, getSimilarDoctors, type Doctor } from "@/lib/doctors";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);
  if (!doctor) return { title: "Врач не найден | MEDAS" };
  return {
    title: `${doctor.name} — ${doctor.specialty} в Москве | MEDAS`,
    description: `${doctor.name} — ${doctor.specialty}, опыт ${doctor.experience} лет, рейтинг ${doctor.rating}. Запись онлайн на MEDAS. ${doctor.bio.slice(0, 100)}`,
    openGraph: {
      title: `${doctor.name} — ${doctor.specialty}`,
      description: doctor.bio.slice(0, 200),
      images: [{ url: doctor.photo, width: 800, height: 600 }],
    },
  };
}

function PhysicianSchema({ doctor }: { doctor: Doctor }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.name,
    description: doctor.bio,
    medicalSpecialty: doctor.specialty,
    url: `https://saas.med-as.ru/doctor/${doctor.slug}`,
    image: doctor.photo,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: doctor.rating,
      reviewCount: doctor.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    worksFor: {
      "@type": "MedicalOrganization",
      name: doctor.clinic.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: doctor.clinic.address,
        addressLocality: "Москва",
        addressCountry: "RU",
      },
    },
    offers: doctor.services.slice(0, 1).map((s) => ({
      "@type": "Offer",
      name: s.name,
      price: s.price,
      priceCurrency: "RUB",
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function DoctorProfilePage({ params }: Props) {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);
  if (!doctor) notFound();

  const similar = getSimilarDoctors(doctor, 3);

  return (
    <>
      <PhysicianSchema doctor={doctor} />
      <Header />
      <main className="pt-24 pb-20 bg-surface">
        <div className="max-w-screen-xl mx-auto px-6">
          <Breadcrumb
            items={[
              { label: "Главная", href: "/" },
              { label: doctor.specialty, href: `/search?specialty=${doctor.specialtySlug}` },
              { label: doctor.name },
            ]}
          />

          {/* Hero */}
          <div className="mt-6">
            <DoctorHero doctor={doctor} />
          </div>

          {/* Main content: tabs + sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
            <div className="lg:col-span-8">
              <DoctorTabs doctor={doctor} />
            </div>
            <div className="lg:col-span-4">
              <AppointmentSidebar doctor={doctor} />
            </div>
          </div>

          {/* Similar doctors */}
          <SimilarDoctors doctors={similar} />
        </div>
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import DoctorHero from "@/components/doctor/DoctorHero";
import DoctorContentSections from "@/components/doctor/DoctorContentSections";
import AppointmentSidebarV2 from "@/components/doctor/v2/AppointmentSidebarV2";
import SimilarDoctors from "@/components/doctor/SimilarDoctors";
import MobileBookingBar from "@/components/doctor/MobileBookingBar";
import { getDoctorBySlug, getSimilarDoctors, type Doctor } from "@/lib/doctors";
import { fetchDoctorBySlug, type ApiDoctor } from "@/lib/api";

function apiDoctorToFull(d: ApiDoctor): Doctor {
  const specialtySlug = d.specialty
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-zа-яё0-9-]/gi, "");
  return {
    id: String(d.slug),
    slug: d.slug,
    name: d.name,
    specialty: d.specialty,
    specialtySlug,
    experience: d.experience,
    rating: d.rating,
    reviewCount: d.review_count,
    ratingBreakdown: {
      5: Math.round(d.review_count * 0.7),
      4: Math.round(d.review_count * 0.2),
      3: Math.round(d.review_count * 0.06),
      2: Math.round(d.review_count * 0.03),
      1: Math.round(d.review_count * 0.01),
    },
    price: d.price,
    status: "today" as const,
    avatar: d.avatar ?? "",
    photo: d.avatar ?? "",
    bio: d.bio ?? "",
    education: [],
    specializations: [d.specialty],
    services: [{ name: "Первичный приём", duration: "30 мин", price: d.price }],
    reviews: [],
    clinic: { id: "medas", name: "MEDAS", address: "Москва", metro: "", schedule: [] },
    slots: [],
    acceptsDMS: false,
    onlineAppointment: false,
    verified: d.is_verified,
  };
}

async function resolveDoctor(slug: string): Promise<Doctor | undefined> {
  const staticDoc = getDoctorBySlug(slug);
  if (staticDoc) return staticDoc;
  const apiDoc = await fetchDoctorBySlug(slug);
  return apiDoc ? apiDoctorToFull(apiDoc) : undefined;
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doctor = await resolveDoctor(slug);
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
  const doctor = await resolveDoctor(slug);
  if (!doctor) notFound();

  const similar = getSimilarDoctors(doctor, 3);

  return (
    <>
      <PhysicianSchema doctor={doctor} />
      <Header />

      <main className="pt-20 lg:pt-[110px] pb-28 lg:pb-20 bg-surface">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <Breadcrumb
            items={[
              { label: "Главная", href: "/" },
              { label: doctor.specialty, href: `/search?specialty=${doctor.specialtySlug}` },
              { label: doctor.name },
            ]}
          />

          {/* Hero — V1 style (большое фото + бейджи) */}
          <div className="mt-6 mb-10">
            <DoctorHero doctor={doctor} />
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
            {/* Left: expanded content sections (no tabs) */}
            <div className="lg:col-span-8">
              <DoctorContentSections doctor={doctor} />
            </div>

            {/* Right: sidebar with calendar — desktop only */}
            <div className="lg:col-span-4 hidden lg:block">
              <AppointmentSidebarV2 doctor={doctor} />
            </div>
          </div>

          {/* Mobile sidebar — shown below content on small screens */}
          <div className="lg:hidden mt-10">
            <AppointmentSidebarV2 doctor={doctor} />
          </div>

          <SimilarDoctors doctors={similar} />
        </div>
      </main>

      <Footer />

      {/* Fixed mobile booking bar — appears over footer on small screens */}
      <MobileBookingBar slug={doctor.slug} price={doctor.price} />
    </>
  );
}

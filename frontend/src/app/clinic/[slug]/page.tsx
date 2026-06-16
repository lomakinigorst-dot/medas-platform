import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import ClinicHero from "@/components/clinic/ClinicHero";
import ClinicContent from "@/components/clinic/ClinicContent";
import ClinicInfoSidebar from "@/components/clinic/ClinicInfoSidebar";
import { getClinicBySlug, type Clinic } from "@/lib/clinics";
import { fetchClinicBySlug, type ApiClinic } from "@/lib/api";

function apiClinicToFull(c: ApiClinic): Clinic {
  return {
    slug: c.slug,
    name: c.name,
    address: c.address,
    phone: c.phone ?? "",
    email: "",
    rating: c.rating,
    reviewCount: c.review_count,
    description: c.description ?? "",
    hours: { weekdays: "09:00–20:00", weekends: "10:00–18:00" },
    acceptsDMS: c.accepts_dms,
    stats: { specialties: 10, doctors: 5, patientsPerYear: "1 000+" },
    services: [],
    specialtyTags: [],
    reviews: [],
    doctorSlugs: [],
    metro: c.metro ?? "",
    heroImageUrl: undefined,
    bookingsLastMonth: 0,
    scheduleByDay: [],
    ratingCategories: [],
    promotions: [],
    insuranceCompanies: [],
    certifications: [],
    parking: "",
  };
}

async function resolveClinic(slug: string): Promise<Clinic | undefined> {
  const staticClinic = getClinicBySlug(slug);
  if (staticClinic) return staticClinic;
  const apiClinic = await fetchClinicBySlug(slug);
  return apiClinic ? apiClinicToFull(apiClinic) : undefined;
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const clinic = await resolveClinic(slug);
  if (!clinic) return { title: "Клиника не найдена | MEDAS" };
  return {
    title: `${clinic.name} — клиника в Москве | MEDAS`,
    description: `${clinic.name}: ${clinic.stats.doctors}+ врачей, рейтинг ${clinic.rating}. Запись онлайн, ДМС. ${clinic.description.slice(0, 100)}`,
    openGraph: {
      title: `${clinic.name} — MEDAS`,
      description: clinic.description.slice(0, 200),
      type: "website",
      locale: "ru_RU",
    },
  };
}

function ClinicSchema({ clinic }: { clinic: Clinic }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    name: clinic.name,
    description: clinic.description,
    url: `https://saas.med-as.ru/clinic/${clinic.slug}`,
    telephone: clinic.phone,
    email: clinic.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: clinic.address,
      addressLocality: "Москва",
      addressCountry: "RU",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: clinic.rating,
      reviewCount: clinic.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    openingHours: [`Mo-Fr ${clinic.hours.weekdays}`, `Sa-Su ${clinic.hours.weekends}`],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function ClinicProfilePage({ params }: Props) {
  const { slug } = await params;
  const clinic = await resolveClinic(slug);
  if (!clinic) notFound();

  return (
    <>
      <ClinicSchema clinic={clinic} />
      <Header />

      <main className="pt-20 lg:pt-[110px] pb-20 bg-surface">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <Breadcrumb
            items={[
              { label: "Главная", href: "/" },
              { label: "Клиники", href: "/clinics" },
              { label: clinic.name },
            ]}
          />

          <div className="mt-6">
            <ClinicHero clinic={clinic} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
            {/* Left: content */}
            <div className="lg:col-span-8">
              <ClinicContent clinic={clinic} />
            </div>

            {/* Right: info sidebar — desktop */}
            <div className="lg:col-span-4 hidden lg:block">
              <ClinicInfoSidebar clinic={clinic} />
            </div>
          </div>

          {/* Mobile sidebar — below content */}
          <div className="lg:hidden mt-10">
            <ClinicInfoSidebar clinic={clinic} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

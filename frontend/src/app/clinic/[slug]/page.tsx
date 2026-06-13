import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import ClinicHero from "@/components/clinic/ClinicHero";
import ClinicContent from "@/components/clinic/ClinicContent";
import ClinicInfoSidebar from "@/components/clinic/ClinicInfoSidebar";
import { getClinicBySlug, type Clinic } from "@/lib/clinics";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const clinic = getClinicBySlug(slug);
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
  const clinic = getClinicBySlug(slug);
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

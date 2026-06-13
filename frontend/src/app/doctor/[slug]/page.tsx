import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getDoctorBySlug, type Doctor } from "@/lib/doctors";

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

  return (
    <>
      <PhysicianSchema doctor={doctor} />
      <Header />
      <main className="pt-24 pb-20 bg-surface">
        <div className="max-w-screen-2xl mx-auto px-6">
          <Breadcrumb
            items={[
              { label: "Главная", href: "/" },
              { label: doctor.specialty, href: `/search?specialty=${doctor.specialtySlug}` },
              { label: doctor.name },
            ]}
          />
          {/* DoctorHero — добавляется в D.2 */}
          <div className="bg-surface-container-lowest rounded-3xl p-8 mb-8">
            <h1 className="font-headline text-4xl font-extrabold text-on-surface">{doctor.name}</h1>
            <p className="text-secondary font-semibold mt-2">{doctor.specialty} · Опыт {doctor.experience} лет</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
            <div className="lg:col-span-8">
              {/* DoctorTabs — добавляется в D.3 */}
              <div className="bg-surface-container-lowest rounded-3xl p-8">
                <p className="text-on-surface-variant">{doctor.bio}</p>
              </div>
            </div>
            <div className="lg:col-span-4">
              {/* AppointmentSidebar — добавляется в D.4 */}
              <div className="bg-surface-container-lowest rounded-3xl p-6 sticky top-28">
                <p className="font-headline font-bold text-lg mb-4">Записаться</p>
                <p className="text-on-surface-variant text-sm">от {new Intl.NumberFormat("ru-RU").format(doctor.price)} ₽</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

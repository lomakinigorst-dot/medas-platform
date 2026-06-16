import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookingForm from "@/components/doctor/booking/BookingForm";
import { getDoctorBySlug, type Doctor } from "@/lib/doctors";
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
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
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
    title: `Запись к ${doctor.name} — ${doctor.specialty} | MEDAS`,
    description: `Запишитесь онлайн к ${doctor.name}, ${doctor.specialty}, опыт ${doctor.experience} лет. Выберите время. Бонусы за каждый визит.`,
    robots: { index: false, follow: false },
  };
}

function Chevron() {
  return (
    <svg className="w-3.5 h-3.5 text-outline-variant flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
    </svg>
  );
}

export default async function BookingPage({ params }: Props) {
  const { slug } = await params;
  const doctor = await resolveDoctor(slug);
  if (!doctor) notFound();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-surface pt-20 lg:pt-[110px] pb-32 lg:pb-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 py-5 text-sm text-on-surface-variant" aria-label="Хлебные крошки">
            <Link href="/" className="hover:text-primary transition-colors whitespace-nowrap">Главная</Link>
            <Chevron />
            <Link href="/search" className="hover:text-primary transition-colors whitespace-nowrap">Врачи</Link>
            <Chevron />
            <Link href={`/doctor/${slug}`} className="hover:text-primary transition-colors truncate max-w-[120px] sm:max-w-xs">
              {doctor.name}
            </Link>
            <Chevron />
            <span className="font-semibold text-on-surface whitespace-nowrap">Запись на приём</span>
          </nav>

          {/* Page heading */}
          <div className="mb-7">
            <h1 className="font-headline text-2xl lg:text-3xl font-extrabold text-on-surface">
              Запись на приём
            </h1>
            <p className="text-on-surface-variant text-sm mt-1.5">
              Выберите услугу, дату и время — подтверждение придёт на телефон
            </p>
          </div>

          <BookingForm doctor={doctor} />

        </div>
      </main>
      <Footer />
    </>
  );
}

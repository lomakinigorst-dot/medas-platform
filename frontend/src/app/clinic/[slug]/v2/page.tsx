import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ClinicHero from "@/components/clinic/ClinicHero";
import ClinicSidebarV2 from "@/components/clinic/v2/ClinicSidebarV2";
import ClinicServicesSearch from "@/components/clinic/v2/ClinicServicesSearch";
import { getClinicBySlug } from "@/lib/clinics";
import { getDoctorBySlug } from "@/lib/doctors";

type Props = { params: Promise<{ slug: string }> };

export default async function ClinicProfileV2Page({ params }: Props) {
  const { slug } = await params;
  const clinic = getClinicBySlug(slug);
  if (!clinic) notFound();

  const doctors = clinic.doctorSlugs.map(getDoctorBySlug).filter(Boolean);

  return (
    <>
      <Header />
      <main className="pt-20 lg:pt-[110px] pb-20 bg-surface">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          {/* V2 label */}
          <div className="mt-4 mb-2 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full text-xs font-bold text-secondary">
              Вариант 2 — Стич
            </span>
            <Link href={`/clinic/${clinic.slug}`} className="text-xs text-on-surface-variant hover:text-primary transition-colors underline">
              ← Вариант 1
            </Link>
          </div>

          <ClinicHero clinic={clinic} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
            {/* Left: editorial content */}
            <div className="lg:col-span-8 space-y-10">

              {/* О клинике */}
              <section className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,45,98,0.06)] border border-outline-variant/10">
                <h2 className="text-xl sm:text-2xl font-headline font-bold text-primary mb-5">О клинике</h2>
                <p className="text-on-surface-variant leading-relaxed mb-6 text-sm sm:text-base">{clinic.description}</p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: `${clinic.stats.specialties}+`, label: "Специализаций" },
                    { value: `${clinic.stats.doctors}+`, label: "Врачей" },
                    { value: clinic.stats.patientsPerYear, label: "Пациентов в год" },
                  ].map((stat) => (
                    <div key={stat.label} className="p-4 rounded-xl bg-surface-container-low border-l-4 border-secondary">
                      <div className="text-xl sm:text-2xl font-headline font-extrabold text-primary">{stat.value}</div>
                      <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-on-surface-variant mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Специалисты — Stich style: фото выходит за верх карточки (-mt-8) */}
              {doctors.length > 0 && (
                <section>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl sm:text-2xl font-headline font-bold text-primary">Наши специалисты</h2>
                    <Link href="/search" className="text-sm font-bold text-secondary hover:underline flex items-center gap-1">
                      Все врачи
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-10">
                    {doctors.map((doc) => (
                      <div key={doc!.slug} className="bg-surface-container-lowest rounded-2xl p-5 pt-3 flex gap-5 shadow-[0_4px_20px_rgba(0,45,98,0.06)] border border-outline-variant/10 group">
                        {/* Photo overlaps top of card */}
                        <div className="relative w-24 h-24 shrink-0 -mt-10 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                          <Image src={doc!.photo} alt={doc!.name} fill className="object-cover" />
                          <div className="absolute -bottom-1 -right-1 bg-secondary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">Top</div>
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <p className="font-headline font-bold text-primary group-hover:text-secondary transition-colors text-sm leading-tight">{doc!.name}</p>
                          <p className="text-xs text-on-surface-variant mt-0.5">{doc!.specialty} · Стаж {doc!.experience} лет</p>
                          <Link
                            href={`/doctor/${doc!.slug}`}
                            className="mt-4 block w-full py-1.5 bg-secondary/10 text-secondary text-xs font-bold rounded-lg text-center hover:bg-secondary/20 transition-colors"
                          >
                            Выбрать время
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Услуги с поиском (client component) */}
              <ClinicServicesSearch services={clinic.services} />
            </div>

            {/* Right: Stich sidebar */}
            <div className="lg:col-span-4">
              <ClinicSidebarV2 clinic={clinic} />
            </div>
          </div>

          {/* Mobile: sidebar below content */}
          <div className="lg:hidden mt-8">
            <ClinicSidebarV2 clinic={clinic} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

import type { Clinic } from "@/lib/clinics";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.med-as.ru/api/v1";

export interface ApiClinic {
  slug: string;
  name: string;
  description: string | null;
  address: string;
  metro: string | null;
  phone: string | null;
  website: string | null;
  rating: number;
  review_count: number;
  accepts_dms: boolean;
}

export interface ApiDoctor {
  slug: string;
  name: string;
  specialty: string;
  bio: string | null;
  avatar: string | null;
  experience: number;
  rating: number;
  review_count: number;
  price: number;
  is_verified: boolean;
}

// Display type for SearchClient — slug drives /doctor/[slug] routing
export interface Doctor {
  id: number;
  slug: string;
  name: string;
  specialty: string;
  badge: { label: string; color: string };
  rating: string;
  reviews: number;
  price: number;
  experience: number;
  district: string;
  metro: string;
  languages: string;
  tags: string[];
  dms: boolean;
  online: boolean;
  homeVisit: boolean;
  gender: "male" | "female";
  availability: string[];
  image: string;
}

async function fetchList<T>(path: string): Promise<T[]> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return ((await res.json()) as { items: T[] }).items;
  } catch {
    return [];
  }
}

export async function fetchClinics(): Promise<ApiClinic[]> {
  return fetchList("/clinics?limit=50");
}

export async function fetchDoctors(specialty?: string): Promise<ApiDoctor[]> {
  const qs = specialty
    ? `?specialty=${encodeURIComponent(specialty)}&limit=50`
    : "?limit=50";
  return fetchList(`/doctors${qs}`);
}

export function apiClinicToClinic(c: ApiClinic): Clinic {
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

export function apiDoctorToDoctor(d: ApiDoctor, idx: number): Doctor {
  return {
    id: idx + 1,
    slug: d.slug,
    name: d.name,
    specialty: d.specialty,
    badge: d.is_verified
      ? { label: "Проверен", color: "bg-[#e3fcef] text-[#006644]" }
      : { label: "Специалист", color: "bg-slate-100 text-slate-600" },
    rating: d.rating.toFixed(1),
    reviews: d.review_count,
    price: d.price,
    experience: d.experience,
    district: "",
    metro: "",
    languages: "Русский",
    tags: [],
    dms: false,
    online: false,
    homeVisit: false,
    gender: "male",
    availability: [],
    image: d.avatar ?? "",
  };
}

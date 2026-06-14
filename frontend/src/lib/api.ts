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

async function fetchList<T>(path: string): Promise<T[] | null> {
  const url = `${API_BASE}${path}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      console.error(`[api] ${url} → ${res.status} ${res.statusText}`);
      return null;
    }
    return ((await res.json()) as { items: T[] }).items;
  } catch (err) {
    console.error(`[api] ${url} → network error`, err);
    return null;
  }
}

export async function fetchClinics(): Promise<ApiClinic[] | null> {
  return fetchList("/clinics?limit=50");
}

export async function fetchDoctors(specialty?: string): Promise<ApiDoctor[] | null> {
  const qs = specialty
    ? `?specialty=${encodeURIComponent(specialty)}&limit=50`
    : "?limit=50";
  return fetchList(`/doctors${qs}`);
}

// ─── Slots ───────────────────────────────────────────────────────────────────

export interface SlotOut {
  time: string;
  available: boolean;
}

export async function fetchAvailableDays(slug: string, month: string): Promise<number[]> {
  try {
    const res = await fetch(`${API_BASE}/doctors/${slug}/available-days?month=${month}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const dates: string[] = await res.json();
    return dates.map((d) => parseInt(d.split("-")[2], 10));
  } catch {
    return [];
  }
}

export async function fetchSlots(slug: string, date: string): Promise<SlotOut[]> {
  try {
    const res = await fetch(`${API_BASE}/doctors/${slug}/slots?date=${date}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as SlotOut[];
  } catch {
    return [];
  }
}

// ─── Appointments ─────────────────────────────────────────────────────────────

export interface AppointmentOut {
  id: number;
  doctor_name: string;
  clinic_name: string | null;
  scheduled_at: string;
  service_type: string;
  status: string;
  price: number;
  bonuses_used: number;
  bonuses_earned: number;
}

export interface AppointmentCreate {
  doctor_slug: string;
  scheduled_at: string;
  service_type: "primary" | "followup" | "online";
  use_bonuses: boolean;
  notes?: string;
}

export async function createAppointment(
  payload: AppointmentCreate,
  token: string
): Promise<AppointmentOut | null> {
  try {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("[api] createAppointment →", err);
      return null;
    }
    return (await res.json()) as AppointmentOut;
  } catch (err) {
    console.error("[api] createAppointment → network error", err);
    return null;
  }
}

export async function fetchMyAppointments(token: string): Promise<AppointmentOut[]> {
  try {
    const res = await fetch(`${API_BASE}/appointments/my`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as AppointmentOut[];
  } catch {
    return [];
  }
}

export interface ClinicAppointmentOut extends AppointmentOut {
  patient_name: string;
}

export async function fetchClinicAppointments(token: string): Promise<ClinicAppointmentOut[]> {
  try {
    const res = await fetch(`${API_BASE}/appointments/clinic`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as ClinicAppointmentOut[];
  } catch {
    return [];
  }
}

export async function confirmAppointment(id: number, token: string): Promise<AppointmentOut | null> {
  try {
    const res = await fetch(`${API_BASE}/appointments/${id}/confirm`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return (await res.json()) as AppointmentOut;
  } catch {
    return null;
  }
}

export async function cancelAppointment(id: number, token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/appointments/${id}/cancel`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ─── Clinics / Doctors mappers ────────────────────────────────────────────────

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

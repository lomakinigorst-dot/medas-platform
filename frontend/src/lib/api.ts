const API_BASE = "https://api.med-as.ru/api/v1";

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

interface ListResponse<T> {
  total: number;
  items: T[];
}

export async function fetchClinics(): Promise<ApiClinic[]> {
  try {
    const res = await fetch(`${API_BASE}/clinics?limit=50`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: ListResponse<ApiClinic> = await res.json() as ListResponse<ApiClinic>;
    return data.items;
  } catch {
    return [];
  }
}

export async function fetchDoctors(specialty?: string): Promise<ApiDoctor[]> {
  try {
    const url = specialty
      ? `${API_BASE}/doctors?specialty=${encodeURIComponent(specialty)}&limit=50`
      : `${API_BASE}/doctors?limit=50`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data: ListResponse<ApiDoctor> = await res.json() as ListResponse<ApiDoctor>;
    return data.items;
  } catch {
    return [];
  }
}

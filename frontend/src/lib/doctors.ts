export type DoctorStatus = "online" | "today";

export type Education = {
  degree: string;
  institution: string;
  year: number;
};

export type Service = {
  name: string;
  duration: string;
  price: number;
};

export type DoctorReview = {
  id: string;
  name: string;
  initials: string;
  rating: number;
  text: string;
  date: string;
};

export type TimeSlot = {
  time: string;
  available: boolean;
};

export type DaySlots = {
  label: string;
  slots: {
    morning: TimeSlot[];
    afternoon: TimeSlot[];
    evening: TimeSlot[];
  };
};

export type DoctorClinic = {
  id: string;
  name: string;
  address: string;
  metro: string;
  schedule: { days: string; hours: string }[];
};

export type Doctor = {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  specialtySlug: string;
  experience: number;
  rating: number;
  reviewCount: number;
  ratingBreakdown: Record<1 | 2 | 3 | 4 | 5, number>;
  price: number;
  status: DoctorStatus;
  avatar: string;
  photo: string;
  bio: string;
  education: Education[];
  specializations: string[];
  services: Service[];
  reviews: DoctorReview[];
  clinic: DoctorClinic;
  slots: DaySlots[];
  acceptsDMS: boolean;
  onlineAppointment: boolean;
  verified: boolean;
};

const MOCK_SLOTS: DaySlots[] = [
  {
    label: "Сегодня",
    slots: {
      morning: [
        { time: "09:00", available: false },
        { time: "10:00", available: true },
        { time: "10:30", available: true },
      ],
      afternoon: [
        { time: "13:00", available: true },
        { time: "14:00", available: true },
        { time: "15:00", available: false },
      ],
      evening: [
        { time: "17:30", available: true },
        { time: "18:00", available: true },
      ],
    },
  },
  {
    label: "Завтра",
    slots: {
      morning: [
        { time: "09:00", available: true },
        { time: "09:30", available: true },
        { time: "10:00", available: true },
      ],
      afternoon: [
        { time: "12:00", available: true },
        { time: "13:30", available: false },
        { time: "15:00", available: true },
      ],
      evening: [
        { time: "17:00", available: true },
        { time: "18:30", available: true },
      ],
    },
  },
  {
    label: "Пт 13",
    slots: {
      morning: [
        { time: "10:00", available: true },
        { time: "11:00", available: true },
      ],
      afternoon: [
        { time: "14:00", available: true },
        { time: "15:30", available: false },
      ],
      evening: [
        { time: "17:00", available: true },
      ],
    },
  },
  {
    label: "Сб 14",
    slots: {
      morning: [
        { time: "10:00", available: true },
        { time: "11:00", available: true },
      ],
      afternoon: [],
      evening: [],
    },
  },
  {
    label: "Пн 16",
    slots: {
      morning: [
        { time: "09:00", available: true },
        { time: "09:30", available: true },
        { time: "10:00", available: true },
      ],
      afternoon: [
        { time: "13:00", available: true },
        { time: "14:00", available: true },
      ],
      evening: [
        { time: "17:00", available: true },
        { time: "18:00", available: true },
      ],
    },
  },
];

export const DOCTORS: Doctor[] = [
  {
    id: "1",
    slug: "anna-sokolova",
    name: "Анна Соколова",
    specialty: "Кардиолог",
    specialtySlug: "cardiology",
    experience: 12,
    rating: 4.9,
    reviewCount: 184,
    ratingBreakdown: { 5: 87, 4: 8, 3: 3, 2: 1, 1: 1 },
    price: 2500,
    status: "online",
    avatar: "https://i.pravatar.cc/150?u=anna-sokolova",
    photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&q=85",
    bio: "Кардиолог высшей категории, кандидат медицинских наук с 12-летним опытом работы. Специализируется на диагностике и лечении ишемической болезни сердца, нарушений ритма и сердечной недостаточности. Прошла стажировку в Европейском обществе кардиологов (ESC). Ежегодно участвует в международных конгрессах по кардиологии.",
    education: [
      { degree: "Лечебное дело", institution: "Первый МГМУ им. И.М. Сеченова", year: 2008 },
      { degree: "Ординатура по кардиологии", institution: "НМИЦ кардиологии Минздрава РФ", year: 2010 },
      { degree: "Кандидат медицинских наук", institution: "НМИЦ кардиологии", year: 2014 },
    ],
    specializations: [
      "Ишемическая болезнь сердца",
      "Нарушения ритма (аритмия)",
      "Артериальная гипертония",
      "Сердечная недостаточность",
      "ЭКГ и Эхо-КГ",
      "Холтер-мониторинг",
    ],
    services: [
      { name: "Первичная консультация", duration: "45 мин", price: 2500 },
      { name: "Повторная консультация", duration: "30 мин", price: 1800 },
      { name: "ЭКГ с расшифровкой", duration: "20 мин", price: 800 },
      { name: "ЭхоКГ (УЗИ сердца)", duration: "40 мин", price: 3200 },
      { name: "Онлайн-консультация", duration: "30 мин", price: 2000 },
      { name: "Холтер-мониторинг (суточный)", duration: "24 часа", price: 4500 },
    ],
    reviews: [
      {
        id: "r1",
        name: "Елена М.",
        initials: "ЕМ",
        rating: 5,
        text: "Анна Сергеевна — замечательный врач. Объяснила всё понятным языком, назначила правильное лечение. После визита наконец-то появилась ясность по моей ситуации. Очень рекомендую всем!",
        date: "2 дня назад",
      },
      {
        id: "r2",
        name: "Михаил К.",
        initials: "МК",
        rating: 5,
        text: "Профессионал высокого уровня. Внимательна, не торопит, отвечает на все вопросы. Назначенное лечение дало результат уже через две недели. Очень доволен.",
        date: "1 неделю назад",
      },
      {
        id: "r3",
        name: "Ольга Р.",
        initials: "ОР",
        rating: 4,
        text: "Хороший специалист, приём прошёл чётко по времени. Чуть больше хотелось бы объяснений по диете, но в целом очень довольна консультацией.",
        date: "3 недели назад",
      },
    ],
    clinic: {
      id: "clinic-1",
      name: "Медицинский центр «Здоровье»",
      address: "ул. Тверская, 24, Москва",
      metro: "Тверская",
      schedule: [
        { days: "Пн — Пт", hours: "09:00 — 20:00" },
        { days: "Суббота", hours: "10:00 — 16:00" },
      ],
    },
    slots: MOCK_SLOTS,
    acceptsDMS: true,
    onlineAppointment: true,
    verified: true,
  },
  {
    id: "2",
    slug: "igor-petrov",
    name: "Игорь Петров",
    specialty: "Хирург",
    specialtySlug: "surgery",
    experience: 18,
    rating: 4.8,
    reviewCount: 212,
    ratingBreakdown: { 5: 82, 4: 12, 3: 4, 2: 1, 1: 1 },
    price: 3000,
    status: "today",
    avatar: "https://i.pravatar.cc/150?u=igor-petrov",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=85",
    bio: "Хирург высшей категории с 18-летним опытом. Специализируется на лапароскопических операциях на органах брюшной полости. Автор более 30 научных публикаций в области малоинвазивной хирургии.",
    education: [
      { degree: "Лечебное дело", institution: "РНИМУ им. Н.И. Пирогова", year: 2003 },
      { degree: "Ординатура по хирургии", institution: "НИИ хирургии им. Вишневского", year: 2005 },
    ],
    specializations: [
      "Лапароскопические операции",
      "Грыжи брюшной стенки",
      "Желчнокаменная болезнь",
      "Аппендицит",
      "Колопроктология",
    ],
    services: [
      { name: "Первичная консультация", duration: "40 мин", price: 3000 },
      { name: "Повторная консультация", duration: "30 мин", price: 2000 },
      { name: "Предоперационная консультация", duration: "60 мин", price: 4000 },
    ],
    reviews: [],
    clinic: {
      id: "clinic-2",
      name: "Городская клиническая больница №1",
      address: "Ленинский пр-т, 10, Москва",
      metro: "Октябрьская",
      schedule: [
        { days: "Вт, Чт", hours: "10:00 — 18:00" },
        { days: "Пн, Ср, Пт", hours: "09:00 — 15:00" },
      ],
    },
    slots: MOCK_SLOTS,
    acceptsDMS: false,
    onlineAppointment: false,
    verified: true,
  },
  {
    id: "3",
    slug: "maria-kozlova",
    name: "Мария Козлова",
    specialty: "Педиатр",
    specialtySlug: "pediatrics",
    experience: 9,
    rating: 5.0,
    reviewCount: 147,
    ratingBreakdown: { 5: 95, 4: 4, 3: 1, 2: 0, 1: 0 },
    price: 1800,
    status: "online",
    avatar: "https://i.pravatar.cc/150?u=maria-kozlova",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=85",
    bio: "Педиатр с 9-летним опытом работы. Специализируется на лечении ОРВИ, бронхитов и аллергических заболеваний у детей от 0 до 17 лет. Регулярно проходит обучение по нейропсихологическому развитию ребёнка.",
    education: [
      { degree: "Педиатрический факультет", institution: "СПбГПМУ", year: 2012 },
      { degree: "Ординатура по педиатрии", institution: "НМИЦ здоровья детей", year: 2014 },
    ],
    specializations: [
      "ОРВИ и грипп",
      "Аллергия у детей",
      "Бронхиальная астма",
      "ЖКТ у детей",
      "Вакцинация",
      "Профилактические осмотры",
    ],
    services: [
      { name: "Первичный приём", duration: "40 мин", price: 1800 },
      { name: "Повторный приём", duration: "25 мин", price: 1200 },
      { name: "Вызов на дом", duration: "60 мин", price: 3500 },
      { name: "Онлайн-консультация", duration: "20 мин", price: 1500 },
    ],
    reviews: [],
    clinic: {
      id: "clinic-3",
      name: "Детский медицинский центр «Ребёнок»",
      address: "ул. Арбат, 33, Москва",
      metro: "Арбатская",
      schedule: [
        { days: "Пн — Пт", hours: "09:00 — 20:00" },
        { days: "Сб — Вс", hours: "10:00 — 15:00" },
      ],
    },
    slots: MOCK_SLOTS,
    acceptsDMS: true,
    onlineAppointment: true,
    verified: true,
  },
];

export function getDoctorBySlug(slug: string): Doctor | undefined {
  return DOCTORS.find((d) => d.slug === slug);
}

export function getSimilarDoctors(doctor: Doctor, count = 3): Doctor[] {
  const same = DOCTORS.filter(
    (d) => d.id !== doctor.id && d.specialty === doctor.specialty
  );
  const others = DOCTORS.filter(
    (d) => d.id !== doctor.id && d.specialty !== doctor.specialty
  );
  return [...same, ...others].slice(0, count);
}

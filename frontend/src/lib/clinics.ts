export type ClinicReview = {
  author: string;
  text: string;
  rating: number;
  date: string;
};

export type ClinicService = {
  name: string;
  description: string;
  price: number;
};

export type ScheduleDay = {
  day: string;
  hours: string;
  closed: boolean;
};

export type RatingCategory = {
  name: string;
  value: number;
};

export type ClinicPromotion = {
  title: string;
  description: string;
  discount: string;
  validUntil: string;
};

export type Clinic = {
  slug: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  description: string;
  hours: { weekdays: string; weekends: string };
  acceptsDMS: boolean;
  stats: { specialties: number; doctors: number; patientsPerYear: string };
  services: ClinicService[];
  specialtyTags: string[];
  reviews: ClinicReview[];
  doctorSlugs: string[];
  metro: string;
  heroImageUrl?: string;
  bookingsLastMonth: number;
  scheduleByDay: ScheduleDay[];
  ratingCategories: RatingCategory[];
  promotions: ClinicPromotion[];
  insuranceCompanies: string[];
  certifications: string[];
  parking: string;
};

const CLINICS: Clinic[] = [
  {
    slug: "centr-sovremennoy-meditsiny",
    name: "Центр Современной Медицины",
    address: "ул. Александра Пушкина, 14, корп. 2, Москва",
    phone: "+7 (495) 123-45-67",
    email: "hello@medas-clinic.ru",
    rating: 4.9,
    reviewCount: 1240,
    description:
      "Центр Современной Медицины — это пространство, где высокие технологии встречаются с человеческой заботой. Мы создали клиническую среду, ориентированную на пациента, предлагая полный спектр диагностических и лечебных услуг в одном месте.",
    hours: { weekdays: "08:00 – 21:00", weekends: "09:00 – 18:00" },
    acceptsDMS: true,
    stats: { specialties: 25, doctors: 150, patientsPerYear: "12к+" },
    metro: "5 мин от м. Пушкинская",
    bookingsLastMonth: 47,
    scheduleByDay: [
      { day: "Пн", hours: "08:00 – 21:00", closed: false },
      { day: "Вт", hours: "08:00 – 21:00", closed: false },
      { day: "Ср", hours: "08:00 – 21:00", closed: false },
      { day: "Чт", hours: "08:00 – 21:00", closed: false },
      { day: "Пт", hours: "08:00 – 21:00", closed: false },
      { day: "Сб", hours: "09:00 – 18:00", closed: false },
      { day: "Вс", hours: "Выходной",       closed: true  },
    ],
    ratingCategories: [
      { name: "Внимательность",    value: 4.9 },
      { name: "Качество лечения",  value: 4.8 },
      { name: "Чистота",           value: 5.0 },
      { name: "Цена/качество",     value: 4.3 },
    ],
    promotions: [
      {
        title: "Комплексный чекап",
        description: "УЗИ + анализы + консультация терапевта за один визит",
        discount: "−20%",
        validUntil: "30 июня 2026",
      },
      {
        title: "Первый визит",
        description: "Скидка новым пациентам на первичную консультацию любого специалиста",
        discount: "−15%",
        validUntil: "31 июля 2026",
      },
    ],
    insuranceCompanies: ["СОГАЗ", "Ингосстрах", "АльфаСтрахование", "РЕСО-Гарантия"],
    certifications: [
      "ISO 9001:2015 — Система менеджмента качества",
      "Лицензия Минздрава России № ЛО-77-01-019321",
      "Аккредитация Росздравнадзора",
    ],
    parking: "Бесплатная парковка для пациентов — 30 мест",
    services: [
      { name: "Первичная консультация терапевта", description: "Длительность: 45 минут", price: 3500 },
      { name: "Комплексное УЗИ сердца", description: "Высокоточное оборудование экспертного класса", price: 5200 },
      { name: "МРТ головного мозга", description: "Результаты через 2 часа", price: 8900 },
      { name: "Общий анализ крови", description: "Результат в день сдачи", price: 650 },
      { name: "ЭКГ с расшифровкой", description: "Консультация кардиолога включена", price: 1800 },
      { name: "Консультация кардиолога", description: "Первичный приём, 60 минут", price: 4200 },
    ],
    specialtyTags: [
      "Кардиология", "Неврология", "Гастроэнтерология", "Офтальмология",
      "Дерматология", "УЗИ диагностика", "МРТ", "Лабораторные анализы", "Вакцинация",
    ],
    reviews: [
      { author: "Анна М.",     text: "Очень внимательный персонал и современное оборудование. Приём начался вовремя.", rating: 5, date: "2 дня назад" },
      { author: "Виктор К.",   text: "Клиника чистая, врачи профессионалы. Цены выше среднего, но оно того стоит.", rating: 4, date: "Неделю назад" },
      { author: "Светлана Р.", text: "Записалась через MEDAS, всё прошло быстро. Врач внимательный, объяснил всё подробно.", rating: 5, date: "2 недели назад" },
    ],
    doctorSlugs: ["anna-sokolova", "igor-petrov"],
  },
  {
    slug: "klinika-zdorovye",
    name: "Клиника Здоровье",
    address: "пр. Ленина, 45, Москва",
    phone: "+7 (495) 987-65-43",
    email: "info@zdravo-clinic.ru",
    rating: 4.7,
    reviewCount: 560,
    description:
      "Клиника Здоровье — многопрофильный медицинский центр с более чем 20-летним опытом. Используем доказательную медицину и современные протоколы лечения для пациентов всех возрастов.",
    hours: { weekdays: "09:00 – 20:00", weekends: "10:00 – 17:00" },
    acceptsDMS: false,
    stats: { specialties: 15, doctors: 60, patientsPerYear: "8к+" },
    metro: "10 мин от м. Университет",
    bookingsLastMonth: 23,
    scheduleByDay: [
      { day: "Пн", hours: "09:00 – 20:00", closed: false },
      { day: "Вт", hours: "09:00 – 20:00", closed: false },
      { day: "Ср", hours: "09:00 – 20:00", closed: false },
      { day: "Чт", hours: "09:00 – 20:00", closed: false },
      { day: "Пт", hours: "09:00 – 20:00", closed: false },
      { day: "Сб", hours: "10:00 – 17:00", closed: false },
      { day: "Вс", hours: "Выходной",       closed: true  },
    ],
    ratingCategories: [
      { name: "Внимательность",   value: 4.7 },
      { name: "Качество лечения", value: 4.8 },
      { name: "Чистота",          value: 4.5 },
      { name: "Цена/качество",    value: 4.6 },
    ],
    promotions: [
      {
        title: "Педиатрия под контролем",
        description: "Профилактический осмотр ребёнка от 3 до 14 лет по специальной цене",
        discount: "−25%",
        validUntil: "15 июля 2026",
      },
    ],
    insuranceCompanies: [],
    certifications: [
      "Лицензия Минздрава России № ЛО-77-02-011458",
    ],
    parking: "Платная парковка рядом с клиникой",
    services: [
      { name: "Консультация педиатра", description: "Для детей до 18 лет", price: 2800 },
      { name: "Гастроскопия", description: "С анестезией, результат в день", price: 6500 },
      { name: "УЗИ брюшной полости", description: "Длительность: 30 минут", price: 2200 },
    ],
    specialtyTags: ["Педиатрия", "Гастроэнтерология", "Эндокринология", "Хирургия", "Терапия"],
    reviews: [
      { author: "Марина Л.", text: "Отличный педиатр. Записались за день, всё прошло спокойно.", rating: 5, date: "3 дня назад" },
    ],
    doctorSlugs: ["maria-kozlova"],
  },
];

export function getClinicBySlug(slug: string): Clinic | undefined {
  return CLINICS.find((c) => c.slug === slug);
}

export function getClinics(): Clinic[] {
  return CLINICS;
}

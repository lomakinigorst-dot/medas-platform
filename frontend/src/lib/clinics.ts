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

// ── Utility: real-time open/closed detection ──────────────────────────────────
export function isClinicOpenNow(clinic: Clinic): boolean {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon … 6=Sat
  const hours = dayOfWeek === 0 || dayOfWeek === 6 ? clinic.hours.weekends : clinic.hours.weekdays;
  if (!hours || hours.toLowerCase().includes("выходной") || hours.toLowerCase().includes("закрыт")) {
    return false;
  }
  const [openStr, closeStr] = hours.split("–").map((s) => s.trim());
  const toMinutes = (t: string) => {
    const [h, m] = t.replace(".", ":").split(":").map(Number);
    return h * 60 + (m || 0);
  };
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return currentMinutes >= toMinutes(openStr) && currentMinutes < toMinutes(closeStr);
}

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
  {
    slug: "stomatologiya-ulybka",
    name: "Стоматология Улыбка",
    address: "ул. Тверская, 22, Москва",
    phone: "+7 (495) 234-56-78",
    email: "smile@ulybka-clinic.ru",
    rating: 4.8,
    reviewCount: 892,
    description:
      "Современная стоматология с европейскими стандартами лечения. Безболезненная анестезия, имплантация, эстетическая стоматология и ортодонтия для всей семьи.",
    hours: { weekdays: "09:00 – 21:00", weekends: "10:00 – 19:00" },
    acceptsDMS: true,
    stats: { specialties: 8, doctors: 24, patientsPerYear: "6к+" },
    metro: "3 мин от м. Тверская",
    bookingsLastMonth: 62,
    scheduleByDay: [
      { day: "Пн", hours: "09:00 – 21:00", closed: false },
      { day: "Вт", hours: "09:00 – 21:00", closed: false },
      { day: "Ср", hours: "09:00 – 21:00", closed: false },
      { day: "Чт", hours: "09:00 – 21:00", closed: false },
      { day: "Пт", hours: "09:00 – 21:00", closed: false },
      { day: "Сб", hours: "10:00 – 19:00", closed: false },
      { day: "Вс", hours: "10:00 – 17:00", closed: false },
    ],
    ratingCategories: [
      { name: "Внимательность",   value: 4.9 },
      { name: "Качество лечения", value: 4.8 },
      { name: "Чистота",          value: 5.0 },
      { name: "Цена/качество",    value: 4.5 },
    ],
    promotions: [
      {
        title: "Отбеливание Zoom 4",
        description: "Профессиональное отбеливание за 1,5 часа — результат до 12 тонов",
        discount: "−30%",
        validUntil: "31 июля 2026",
      },
    ],
    insuranceCompanies: ["СОГАЗ", "ВТБ Страхование", "Ренессанс Здоровье"],
    certifications: [
      "Лицензия Минздрава России № ЛО-77-01-022145",
      "Сертификат качества материалов Nobel Biocare",
    ],
    parking: "Парковка во дворе — 10 мест бесплатно",
    services: [
      { name: "Консультация стоматолога", description: "Осмотр и план лечения", price: 1500 },
      { name: "Лечение кариеса", description: "Фотополимерная пломба", price: 4500 },
      { name: "Имплантация зуба", description: "Под ключ, премиум имплант", price: 45000 },
    ],
    specialtyTags: ["Стоматология", "Ортодонтия", "Имплантология", "Детская стоматология", "Отбеливание"],
    reviews: [
      { author: "Олег С.", text: "Поставил имплант — боли нет, всё аккуратно. Хожу сюда всей семьёй.", rating: 5, date: "Вчера" },
      { author: "Наталья В.", text: "Дети не боятся идти в эту клинику. Врачи очень терпеливые.", rating: 5, date: "Неделю назад" },
    ],
    doctorSlugs: [],
  },
  {
    slug: "semeynyy-doktor",
    name: "Семейный доктор",
    address: "ул. Профсоюзная, 7, Москва",
    phone: "+7 (495) 345-67-89",
    email: "family@semdoc.ru",
    rating: 4.6,
    reviewCount: 1830,
    description:
      "Многопрофильная сеть клиник для всей семьи с опытом 15 лет. Педиатры, терапевты, хирурги, неврологи. Круглосуточный call-центр и приём без записи.",
    hours: { weekdays: "08:00 – 22:00", weekends: "09:00 – 20:00" },
    acceptsDMS: true,
    stats: { specialties: 32, doctors: 210, patientsPerYear: "40к+" },
    metro: "7 мин от м. Профсоюзная",
    bookingsLastMonth: 118,
    scheduleByDay: [
      { day: "Пн", hours: "08:00 – 22:00", closed: false },
      { day: "Вт", hours: "08:00 – 22:00", closed: false },
      { day: "Ср", hours: "08:00 – 22:00", closed: false },
      { day: "Чт", hours: "08:00 – 22:00", closed: false },
      { day: "Пт", hours: "08:00 – 22:00", closed: false },
      { day: "Сб", hours: "09:00 – 20:00", closed: false },
      { day: "Вс", hours: "09:00 – 20:00", closed: false },
    ],
    ratingCategories: [
      { name: "Внимательность",   value: 4.6 },
      { name: "Качество лечения", value: 4.7 },
      { name: "Чистота",          value: 4.6 },
      { name: "Цена/качество",    value: 4.8 },
    ],
    promotions: [
      {
        title: "Детский чекап",
        description: "Комплексный осмотр ребёнка 8 специалистами за один день",
        discount: "−35%",
        validUntil: "30 июня 2026",
      },
      {
        title: "ДМС онлайн",
        description: "Подберём полис ДМС и сразу начнём обслуживать",
        discount: "Бесплатно",
        validUntil: "Постоянно",
      },
    ],
    insuranceCompanies: ["СОГАЗ", "Ингосстрах", "АльфаСтрахование", "РЕСО-Гарантия", "Росгосстрах"],
    certifications: [
      "ISO 9001:2015",
      "Лицензия Минздрава России № ЛО-77-01-018764",
    ],
    parking: "Подземная парковка — 50 мест",
    services: [
      { name: "Консультация терапевта", description: "Первичный приём", price: 2500 },
      { name: "Педиатрия до 14 лет", description: "Осмотр, назначения", price: 2200 },
      { name: "Анализ крови расширенный", description: "48 показателей за 1 день", price: 3800 },
    ],
    specialtyTags: ["Педиатрия", "Терапия", "Неврология", "Хирургия", "Гинекология", "Эндокринология", "Офтальмология"],
    reviews: [
      { author: "Дмитрий П.", text: "Ходим всей семьёй. Быстро записали, время ожидания — 5 минут.", rating: 5, date: "Сегодня" },
      { author: "Юлия А.", text: "Педиатр потрясающий. Дочка не плакала ни разу!", rating: 5, date: "3 дня назад" },
    ],
    doctorSlugs: [],
  },
  {
    slug: "medskан-diagnostika",
    name: "Медскан Диагностика",
    address: "Ленинградский пр-т, 58, Москва",
    phone: "+7 (495) 456-78-90",
    email: "mri@medskan.ru",
    rating: 4.9,
    reviewCount: 437,
    description:
      "Специализированный центр лучевой диагностики: МРТ, КТ, ПЭТ-КТ, рентген, маммография. Аппараты Siemens 3 Тл. Результаты через 2 часа. Работаем без выходных.",
    hours: { weekdays: "07:00 – 23:00", weekends: "08:00 – 22:00" },
    acceptsDMS: true,
    stats: { specialties: 5, doctors: 18, patientsPerYear: "15к+" },
    metro: "4 мин от м. Аэропорт",
    bookingsLastMonth: 84,
    scheduleByDay: [
      { day: "Пн", hours: "07:00 – 23:00", closed: false },
      { day: "Вт", hours: "07:00 – 23:00", closed: false },
      { day: "Ср", hours: "07:00 – 23:00", closed: false },
      { day: "Чт", hours: "07:00 – 23:00", closed: false },
      { day: "Пт", hours: "07:00 – 23:00", closed: false },
      { day: "Сб", hours: "08:00 – 22:00", closed: false },
      { day: "Вс", hours: "08:00 – 22:00", closed: false },
    ],
    ratingCategories: [
      { name: "Внимательность",   value: 4.9 },
      { name: "Качество снимков", value: 5.0 },
      { name: "Чистота",          value: 4.9 },
      { name: "Цена/качество",    value: 4.6 },
    ],
    promotions: [
      {
        title: "МРТ в ночное время",
        description: "С 22:00 до 07:00 — специальная ночная цена",
        discount: "−40%",
        validUntil: "Постоянно",
      },
    ],
    insuranceCompanies: ["СОГАЗ", "Ингосстрах", "РЕСО-Гарантия"],
    certifications: [
      "Сертификация Siemens Healthineers",
      "Лицензия Минздрава России № ЛО-77-01-021098",
      "Аккредитация РОРР",
    ],
    parking: "Бесплатная парковка — 100 мест",
    services: [
      { name: "МРТ головного мозга", description: "3 Тл, с/без контраста", price: 6900 },
      { name: "КТ грудной клетки", description: "Результат через 2 часа", price: 5500 },
      { name: "ПЭТ-КТ всего тела", description: "Онкологическая диагностика", price: 38000 },
    ],
    specialtyTags: ["МРТ", "КТ", "ПЭТ-КТ", "Рентген", "Маммография", "УЗИ диагностика"],
    reviews: [
      { author: "Алина К.", text: "Сделала МРТ без очереди, результат получила через 1,5 часа. Качество на высоте.", rating: 5, date: "Вчера" },
    ],
    doctorSlugs: [],
  },
];

export function getClinicBySlug(slug: string): Clinic | undefined {
  return CLINICS.find((c) => c.slug === slug);
}

export function getClinics(): Clinic[] {
  return CLINICS;
}

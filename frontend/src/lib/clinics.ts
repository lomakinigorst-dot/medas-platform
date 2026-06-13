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

// ── Utility: extract metro station name from "X мин от м. STATION" ───────────
export function extractMetroName(metroStr: string): string {
  const match = metroStr.match(/м\.\s+(.+)$/);
  return match ? match[1].trim() : "";
}

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
  // ── 6: Детская клиника «Аист» ─────────────────────────────────────────────
  {
    slug: "detskaya-klinika-aist",
    name: "Детская клиника «Аист»",
    address: "ул. Шаболовка, 26, Москва",
    phone: "+7 (495) 567-89-01",
    email: "kids@aist-clinic.ru",
    rating: 4.8,
    reviewCount: 2140,
    description:
      "Специализированная педиатрическая клиника для детей от 0 до 18 лет. Педиатры, неврологи, ортопеды, логопеды, психологи. Кабинет вакцинации, дневной стационар. Дружественная среда без страха.",
    hours: { weekdays: "08:00 – 21:00", weekends: "09:00 – 18:00" },
    acceptsDMS: false,
    stats: { specialties: 18, doctors: 65, patientsPerYear: "28к+" },
    metro: "5 мин от м. Тульская",
    bookingsLastMonth: 97,
    scheduleByDay: [
      { day: "Пн", hours: "08:00 – 21:00", closed: false },
      { day: "Вт", hours: "08:00 – 21:00", closed: false },
      { day: "Ср", hours: "08:00 – 21:00", closed: false },
      { day: "Чт", hours: "08:00 – 21:00", closed: false },
      { day: "Пт", hours: "08:00 – 21:00", closed: false },
      { day: "Сб", hours: "09:00 – 18:00", closed: false },
      { day: "Вс", hours: "09:00 – 18:00", closed: false },
    ],
    ratingCategories: [
      { name: "Внимательность",   value: 4.9 },
      { name: "Качество лечения", value: 4.8 },
      { name: "Чистота",          value: 4.9 },
      { name: "Цена/качество",    value: 4.7 },
    ],
    promotions: [
      {
        title: "Комплексный осмотр новорождённого",
        description: "Педиатр + невролог + хирург + УЗИ тазобедренных суставов",
        discount: "−25%",
        validUntil: "31 августа 2026",
      },
    ],
    insuranceCompanies: [],
    certifications: [
      "Лицензия Минздрава России № ЛО-77-01-023411",
      "Сертификат «Клиника, дружественная ребёнку» ВОЗ/ЮНИСЕФ",
    ],
    parking: "Парковка у входа — 20 мест бесплатно",
    services: [
      { name: "Консультация педиатра", description: "Первичный осмотр", price: 2000 },
      { name: "Вакцинация (по схеме)", description: "Введение препарата + наблюдение", price: 900 },
      { name: "Логопедическая коррекция", description: "Индивидуальное занятие 45 мин", price: 3500 },
    ],
    specialtyTags: ["Педиатрия", "Неврология детская", "Ортопедия детская", "Логопедия", "Вакцинация", "Психология"],
    reviews: [
      { author: "Марина Д.", text: "Дочка пошла к врачу с улыбкой! Врачи умеют работать с детьми без слёз.", rating: 5, date: "Сегодня" },
      { author: "Сергей Н.", text: "Быстро поставили диагноз, не пришлось мотаться по разным специалистам.", rating: 5, date: "2 дня назад" },
    ],
    doctorSlugs: [],
  },
  // ── 7: European Medical Center ────────────────────────────────────────────
  {
    slug: "european-medical-center",
    name: "European Medical Center",
    address: "ул. Щепкина, 35, Москва",
    phone: "+7 (495) 933-66-55",
    email: "contact@emc.ru",
    rating: 4.9,
    reviewCount: 3210,
    description:
      "Международная клиника европейского уровня с более чем 30-летней историей. Экстренная помощь 24/7, все специальности, хирургия, онкология. Приём на русском, английском, немецком, французском языках.",
    hours: { weekdays: "00:00 – 24:00", weekends: "00:00 – 24:00" },
    acceptsDMS: true,
    stats: { specialties: 55, doctors: 340, patientsPerYear: "80к+" },
    metro: "3 мин от м. Проспект Мира",
    bookingsLastMonth: 203,
    scheduleByDay: [
      { day: "Пн", hours: "Круглосуточно", closed: false },
      { day: "Вт", hours: "Круглосуточно", closed: false },
      { day: "Ср", hours: "Круглосуточно", closed: false },
      { day: "Чт", hours: "Круглосуточно", closed: false },
      { day: "Пт", hours: "Круглосуточно", closed: false },
      { day: "Сб", hours: "Круглосуточно", closed: false },
      { day: "Вс", hours: "Круглосуточно", closed: false },
    ],
    ratingCategories: [
      { name: "Внимательность",   value: 5.0 },
      { name: "Качество лечения", value: 4.9 },
      { name: "Чистота",          value: 5.0 },
      { name: "Цена/качество",    value: 4.2 },
    ],
    promotions: [
      {
        title: "Полный чекап для руководителя",
        description: "75 анализов, КТ, ЭКГ, консультации 5 специалистов — результаты за 1 день",
        discount: "−15%",
        validUntil: "30 сентября 2026",
      },
    ],
    insuranceCompanies: ["СОГАЗ", "Ингосстрах", "АльфаСтрахование", "РЕСО-Гарантия", "AXA", "Bupa", "Allianz"],
    certifications: [
      "Accreditation JCI (Joint Commission International)",
      "ISO 9001:2015",
      "Лицензия Минздрава России № ЛО-77-01-011245",
    ],
    parking: "Подземная парковка — 120 мест, первые 2 часа бесплатно",
    services: [
      { name: "Консультация специалиста", description: "Первичный приём", price: 8500 },
      { name: "Полный чекап Executive", description: "75 показателей, визуализация, консультации", price: 65000 },
      { name: "Экстренная помощь 24/7", description: "Выезд скорой + госпитализация", price: 12000 },
    ],
    specialtyTags: ["Многопрофильная", "Онкология", "Хирургия", "Кардиология", "Репродуктология", "Экстренная помощь"],
    reviews: [
      { author: "Андрей Л.", text: "Лечился здесь после командировки в Берлин — уровень абсолютно европейский. Рекомендую.", rating: 5, date: "Вчера" },
      { author: "Elena K.", text: "Профессионализм на высшем уровне. Английский у всего персонала.", rating: 5, date: "Неделю назад" },
    ],
    doctorSlugs: [],
  },
  // ── 8: Евроонко (онкологический центр) ───────────────────────────────────
  {
    slug: "evronko-onkologiya",
    name: "Евроонко",
    address: "Духовской пер., 22Б, Москва",
    phone: "+7 (495) 789-12-34",
    email: "info@euroonco.ru",
    rating: 4.8,
    reviewCount: 892,
    description:
      "Ведущий частный онкологический центр Москвы. Диагностика и лечение всех типов рака: химиотерапия, таргетная терапия, иммунотерапия, лучевая терапия. Консилиумы с мировыми онкологами.",
    hours: { weekdays: "08:00 – 21:00", weekends: "09:00 – 18:00" },
    acceptsDMS: true,
    stats: { specialties: 12, doctors: 87, patientsPerYear: "8к+" },
    metro: "6 мин от м. Тульская",
    bookingsLastMonth: 61,
    scheduleByDay: [
      { day: "Пн", hours: "08:00 – 21:00", closed: false },
      { day: "Вт", hours: "08:00 – 21:00", closed: false },
      { day: "Ср", hours: "08:00 – 21:00", closed: false },
      { day: "Чт", hours: "08:00 – 21:00", closed: false },
      { day: "Пт", hours: "08:00 – 21:00", closed: false },
      { day: "Сб", hours: "09:00 – 18:00", closed: false },
      { day: "Вс", hours: "", closed: true },
    ],
    ratingCategories: [
      { name: "Внимательность",   value: 4.9 },
      { name: "Качество лечения", value: 4.9 },
      { name: "Чистота",          value: 4.8 },
      { name: "Цена/качество",    value: 4.4 },
    ],
    promotions: [
      {
        title: "Онкологический скрининг",
        description: "Раннее выявление: анализы на онкомаркеры + УЗИ + осмотр онколога",
        discount: "−20%",
        validUntil: "31 июля 2026",
      },
    ],
    insuranceCompanies: ["СОГАЗ", "Ингосстрах", "АльфаСтрахование"],
    certifications: [
      "Лицензия Минздрава России на онкологию № ЛО-77-01-019543",
      "Член ESMO (Европейское общество онкологов)",
      "Аккредитация ВОЗ по химиотерапии",
    ],
    parking: "Собственная парковка — 40 мест",
    services: [
      { name: "Консультация онколога", description: "Первичный приём + план обследования", price: 5500 },
      { name: "Биопсия с анализом", description: "Взятие материала + гистология", price: 18000 },
      { name: "Химиотерапия (курс)", description: "1 введение препарата под наблюдением", price: 35000 },
    ],
    specialtyTags: ["Онкология", "Химиотерапия", "Иммунотерапия", "Лучевая терапия", "Маммология", "Урология онко"],
    reviews: [
      { author: "Светлана О.", text: "Когда поставили диагноз, именно здесь объяснили всё понятно. Врачи как поддержка, не только лечение.", rating: 5, date: "3 дня назад" },
      { author: "Михаил Р.", text: "Провели весь курс химии. Побочные минимальны — умеют подобрать протокол.", rating: 5, date: "Месяц назад" },
    ],
    doctorSlugs: [],
  },
  // ── 9: МедПлюс (бюджетная многопрофильная) ───────────────────────────────
  {
    slug: "medplus-klinika",
    name: "МедПлюс",
    address: "ул. Академика Янгеля, 3, Москва",
    phone: "+7 (495) 890-23-45",
    email: "info@medplus-msk.ru",
    rating: 4.4,
    reviewCount: 3870,
    description:
      "Доступная многопрофильная клиника для всей семьи без переплат. Запись онлайн за 5 минут, ожидание до 10 минут. Терапия, хирургия, гинекология, урология, ЛОР. Анализы и УЗИ — в день обращения.",
    hours: { weekdays: "08:00 – 21:00", weekends: "09:00 – 17:00" },
    acceptsDMS: false,
    stats: { specialties: 22, doctors: 95, patientsPerYear: "55к+" },
    metro: "2 мин от м. Бибирево",
    bookingsLastMonth: 142,
    scheduleByDay: [
      { day: "Пн", hours: "08:00 – 21:00", closed: false },
      { day: "Вт", hours: "08:00 – 21:00", closed: false },
      { day: "Ср", hours: "08:00 – 21:00", closed: false },
      { day: "Чт", hours: "08:00 – 21:00", closed: false },
      { day: "Пт", hours: "08:00 – 21:00", closed: false },
      { day: "Сб", hours: "09:00 – 17:00", closed: false },
      { day: "Вс", hours: "09:00 – 17:00", closed: false },
    ],
    ratingCategories: [
      { name: "Внимательность",   value: 4.4 },
      { name: "Качество лечения", value: 4.5 },
      { name: "Чистота",          value: 4.4 },
      { name: "Цена/качество",    value: 4.9 },
    ],
    promotions: [
      {
        title: "Первый приём бесплатно",
        description: "Консультация терапевта или педиатра — бесплатно для новых пациентов",
        discount: "Бесплатно",
        validUntil: "Постоянно",
      },
      {
        title: "Анализы экспресс",
        description: "Общий анализ крови + мочи + биохимия — результаты за 2 часа",
        discount: "−30%",
        validUntil: "31 июля 2026",
      },
    ],
    insuranceCompanies: [],
    certifications: [
      "Лицензия Минздрава России № ЛО-77-01-016234",
    ],
    parking: "Парковка на прилегающей улице — бесплатно",
    services: [
      { name: "Консультация терапевта", description: "Первичный приём", price: 1200 },
      { name: "УЗИ органов брюшной полости", description: "Полный протокол", price: 2500 },
      { name: "Общий анализ крови", description: "Результат за 2 часа", price: 650 },
    ],
    specialtyTags: ["Терапия", "Гинекология", "Урология", "ЛОР", "Хирургия", "Эндокринология"],
    reviews: [
      { author: "Ксения В.", text: "Цены самые доступные в районе. Очереди нет, записала маму онлайн за минуту.", rating: 4, date: "Сегодня" },
      { author: "Борис М.", text: "Попал без записи — взяли. Доктор внимательный, объяснил всё, не торопился.", rating: 5, date: "Неделю назад" },
    ],
    doctorSlugs: [],
  },
  // ── 10: Кардиологический центр «Кардиос» ─────────────────────────────────
  {
    slug: "kardios-cardiologiya",
    name: "Кардиос",
    address: "Беговая ул., 17, стр. 1, Москва",
    phone: "+7 (495) 901-34-56",
    email: "heart@kardios.ru",
    rating: 4.7,
    reviewCount: 1124,
    description:
      "Специализированный кардиологический центр. Лечение ИБС, гипертонии, аритмий, сердечной недостаточности. Холтер-мониторинг 24/7, стресс-тесты, эхокардиография, коронарография. Кардиохирургия.",
    hours: { weekdays: "08:00 – 20:00", weekends: "09:00 – 16:00" },
    acceptsDMS: true,
    stats: { specialties: 8, doctors: 42, patientsPerYear: "18к+" },
    metro: "4 мин от м. Беговая",
    bookingsLastMonth: 73,
    scheduleByDay: [
      { day: "Пн", hours: "08:00 – 20:00", closed: false },
      { day: "Вт", hours: "08:00 – 20:00", closed: false },
      { day: "Ср", hours: "08:00 – 20:00", closed: false },
      { day: "Чт", hours: "08:00 – 20:00", closed: false },
      { day: "Пт", hours: "08:00 – 20:00", closed: false },
      { day: "Сб", hours: "09:00 – 16:00", closed: false },
      { day: "Вс", hours: "", closed: true },
    ],
    ratingCategories: [
      { name: "Внимательность",   value: 4.8 },
      { name: "Качество лечения", value: 4.8 },
      { name: "Чистота",          value: 4.7 },
      { name: "Цена/качество",    value: 4.5 },
    ],
    promotions: [
      {
        title: "Кардиочекап за 1 день",
        description: "ЭКГ + Холтер 24ч + Эхо КГ + консультация кардиолога",
        discount: "−25%",
        validUntil: "30 августа 2026",
      },
    ],
    insuranceCompanies: ["СОГАЗ", "АльфаСтрахование", "РЕСО-Гарантия", "ВТБ Страхование"],
    certifications: [
      "Лицензия Минздрава России № ЛО-77-01-020178",
      "Аккредитация Российского кардиологического общества",
    ],
    parking: "Наземная парковка — 35 мест, 1 час бесплатно",
    services: [
      { name: "Консультация кардиолога", description: "Первичный осмотр + ЭКГ", price: 3800 },
      { name: "Холтер-мониторинг ЭКГ", description: "Запись суточного ЭКГ + расшифровка", price: 4500 },
      { name: "Эхокардиография", description: "УЗИ сердца с протоколом", price: 5200 },
    ],
    specialtyTags: ["Кардиология", "Кардиохирургия", "Аритмология", "Функциональная диагностика", "Сосудистая хирургия"],
    reviews: [
      { author: "Иван С.", text: "Наконец нашёл кардиолога, который объяснил мою ЭКГ понятным языком. Спасибо.", rating: 5, date: "4 дня назад" },
      { author: "Тамара Л.", text: "Всё оборудование новейшее, сделали всё за один визит. Рекомендую.", rating: 5, date: "Позавчера" },
    ],
    doctorSlugs: [],
  },
  // ── 11: Дерматологический центр «DermaCare» ──────────────────────────────
  {
    slug: "dermacare-dermatologiya",
    name: "DermaCare",
    address: "Сретенка ул., 8, Москва",
    phone: "+7 (495) 012-45-67",
    email: "skin@dermacare.ru",
    rating: 4.8,
    reviewCount: 1680,
    description:
      "Специализированный дерматологический центр: акне, псориаз, экзема, аллергодерматозы, онкодерматология. Дерматоскопия родинок, лазерное удаление, косметология. Аллерготестирование.",
    hours: { weekdays: "09:00 – 20:00", weekends: "10:00 – 17:00" },
    acceptsDMS: true,
    stats: { specialties: 6, doctors: 28, patientsPerYear: "22к+" },
    metro: "5 мин от м. Сухаревская",
    bookingsLastMonth: 89,
    scheduleByDay: [
      { day: "Пн", hours: "09:00 – 20:00", closed: false },
      { day: "Вт", hours: "09:00 – 20:00", closed: false },
      { day: "Ср", hours: "09:00 – 20:00", closed: false },
      { day: "Чт", hours: "09:00 – 20:00", closed: false },
      { day: "Пт", hours: "09:00 – 20:00", closed: false },
      { day: "Сб", hours: "10:00 – 17:00", closed: false },
      { day: "Вс", hours: "", closed: true },
    ],
    ratingCategories: [
      { name: "Внимательность",   value: 4.9 },
      { name: "Качество лечения", value: 4.8 },
      { name: "Чистота",          value: 5.0 },
      { name: "Цена/качество",    value: 4.6 },
    ],
    promotions: [
      {
        title: "Дерматоскопия всех родинок",
        description: "Полный скрининг родинок под FotoFinder — ранняя диагностика меланомы",
        discount: "−35%",
        validUntil: "31 октября 2026",
      },
    ],
    insuranceCompanies: ["СОГАЗ", "Ингосстрах", "Росгосстрах"],
    certifications: [
      "Лицензия Минздрава России № ЛО-77-01-021776",
      "Сертификат FotoFinder (дерматоскопия AI)",
    ],
    parking: "Платная парковка рядом (Сретенский бульвар)",
    services: [
      { name: "Консультация дерматолога", description: "Осмотр + план лечения", price: 2800 },
      { name: "Дерматоскопия 1 элемента", description: "С цифровой картой", price: 800 },
      { name: "Аллерготестирование", description: "Панель 40 аллергенов", price: 4200 },
    ],
    specialtyTags: ["Дерматология", "Косметология", "Аллергология", "Онкодерматология", "Трихология"],
    reviews: [
      { author: "Валерия П.", text: "Наконец-то справились с акне за 3 месяца. Схему подобрали чётко.", rating: 5, date: "Сегодня" },
      { author: "Никита Г.", text: "Удалили родинку лазером — ни рубца. Очень аккуратная работа.", rating: 5, date: "5 дней назад" },
    ],
    doctorSlugs: [],
  },
  // ── 12: Клиника репродуктивной медицины «ВитаФерт» ───────────────────────
  {
    slug: "vitafert-reproduktologiya",
    name: "ВитаФерт",
    address: "Чистопрудный бул., 12А, Москва",
    phone: "+7 (495) 123-56-78",
    email: "ivf@vitafert.ru",
    rating: 4.9,
    reviewCount: 748,
    description:
      "Клиника репродуктивной медицины с успешностью ЭКО 52%. Лечение бесплодия, ЭКО, ИКСИ, ПГД, суррогатное материнство. Банк донорских клеток. Индивидуальный подход к каждой паре.",
    hours: { weekdays: "08:00 – 21:00", weekends: "09:00 – 17:00" },
    acceptsDMS: false,
    stats: { specialties: 7, doctors: 35, patientsPerYear: "4к+" },
    metro: "3 мин от м. Чистые пруды",
    bookingsLastMonth: 44,
    scheduleByDay: [
      { day: "Пн", hours: "08:00 – 21:00", closed: false },
      { day: "Вт", hours: "08:00 – 21:00", closed: false },
      { day: "Ср", hours: "08:00 – 21:00", closed: false },
      { day: "Чт", hours: "08:00 – 21:00", closed: false },
      { day: "Пт", hours: "08:00 – 21:00", closed: false },
      { day: "Сб", hours: "09:00 – 17:00", closed: false },
      { day: "Вс", hours: "", closed: true },
    ],
    ratingCategories: [
      { name: "Внимательность",   value: 5.0 },
      { name: "Качество лечения", value: 4.9 },
      { name: "Чистота",          value: 5.0 },
      { name: "Цена/качество",    value: 4.6 },
    ],
    promotions: [
      {
        title: "Первичная консультация репродуктолога",
        description: "Анализ ситуации + план лечения + оценка шансов ЭКО",
        discount: "Бесплатно",
        validUntil: "Постоянно",
      },
    ],
    insuranceCompanies: [],
    certifications: [
      "Лицензия Минздрава России на ЭКО № ЛО-77-01-022847",
      "Член ESHRE (Европейское общество репродукции и эмбриологии)",
      "Лицензия на работу с биоматериалом",
    ],
    parking: "Перехватывающая парковка у м. Чистые пруды (платно)",
    services: [
      { name: "Консультация репродуктолога", description: "Первичный приём пары", price: 0 },
      { name: "ЭКО (стимуляция + пункция)", description: "Полный протокол до переноса", price: 120000 },
      { name: "ПГД (преимплантационная диагностика)", description: "Генетический анализ эмбрионов", price: 45000 },
    ],
    specialtyTags: ["Репродуктология", "ЭКО", "Гинекология", "Андрология", "Генетика", "Эндокринология репро"],
    reviews: [
      { author: "Анна К.", text: "С первой попытки ЭКО — беременность. Спасибо всей команде. Вы сделали нашу семью.", rating: 5, date: "Месяц назад" },
      { author: "Пара М. и А.", text: "Три года искали клинику. Здесь всё объяснили, не давили и поддержали. Успех!.", rating: 5, date: "Позавчера" },
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

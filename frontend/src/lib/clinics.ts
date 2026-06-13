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
    services: [
      { name: "Первичная консультация терапевта", description: "Длительность: 45 минут", price: 3500 },
      { name: "Комплексное УЗИ сердца", description: "Высокоточное оборудование экспертного класса", price: 5200 },
      { name: "МРТ головного мозга", description: "Результаты через 2 часа", price: 8900 },
      { name: "Общий анализ крови", description: "Результат в день сдачи", price: 650 },
    ],
    specialtyTags: [
      "Кардиология", "Неврология", "Гастроэнтерология", "Офтальмология",
      "Дерматология", "УЗИ диагностика", "МРТ", "Лабораторные анализы", "Вакцинация",
    ],
    reviews: [
      { author: "Анна М.", text: "Очень внимательный персонал и современное оборудование. Прием начался вовремя.", rating: 5, date: "2 дня назад" },
      { author: "Виктор К.", text: "Клиника чистая, врачи профессионалы. Цены выше среднего, но оно того стоит.", rating: 4, date: "Неделю назад" },
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

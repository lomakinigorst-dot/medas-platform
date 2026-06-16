# MASTER_TZ — Техническое задание MEDAS
> Версия 2.0 | Дата: 2026-06-16 | Аудит: проверен по реальному коду  
> Единый документ ТЗ. Заменяет: PLAN.md, SITE_PLAN.md, SITE_STRUCTURE.md, PATIENT_SCENARIOS.md, MEDAS_ТЗ_v1.0.md  
> Детальные бизнес-сценарии (2098 строк) — MEDAS_MASTER_PLAN.md  
> Технический трекер задач — task_plan.md

---

## СОДЕРЖАНИЕ

1. [Общий статус платформы](#1-общий-статус-платформы)
2. [Матрица: Реальные данные vs Заглушки](#2-матрица-реальные-данные-vs-заглушки)
3. [Полный аудит 22 страниц](#3-полный-аудит-22-страниц)
4. [Список критических broken flows (16 штук)](#4-список-критических-broken-flows)
5. [Детальные пользовательские сценарии](#5-детальные-пользовательские-сценарии)
6. [Карта API — все endpoints](#6-карта-api)
7. [Приоритизированный план исправлений P0/P1/P2](#7-приоритизированный-план-исправлений)
8. [Требования для Production](#8-требования-для-production)

---

## 1. ОБЩИЙ СТАТУС ПЛАТФОРМЫ

### 1.1 Инфраструктура

| Параметр | Значение |
|---|---|
| Frontend | saas.med-as.ru (Next.js 15 App Router) |
| API | api.med-as.ru (FastAPI Python 3.12) |
| VPS | 85.239.44.14 |
| БД | PostgreSQL 16 + Redis + MinIO |
| Деплой | GitHub Actions → docker build + docker cp |
| SSL | saas.med-as.ru истекает 2026-09-11, certbot crontab ✅ |

### 1.2 Реальные данные в базе (на 2026-06-16)

| Сущность | Количество | Примечание |
|---|---|---|
| Врачи | 6 | Только 3 имеют страницы профиля |
| Клиники | 5 | Только 2 имеют страницы профиля |
| Пользователи | N | Пациенты + 1 тест-клиника + тест-врачи |
| Записи (appointments) | 433+ | Seed-данные для тестирования дашборда |
| Бонусные транзакции | N | Welcome +500 при регистрации |

### 1.3 Итоговые цифры аудита

| Метрика | Значение |
|---|---|
| Всего страниц | 22 |
| Страниц полностью на реальных данных | 8 |
| Страниц частично на реальных данных | 5 |
| Страниц только на mock/статичных данных | 5 |
| Страниц-заглушек (404) | 4 |
| Критических broken flows | 16 |
| Декоративных кнопок (ничего не делают) | 11 |

---

## 2. МАТРИЦА: РЕАЛЬНЫЕ ДАННЫЕ VS ЗАГЛУШКИ

### 2.1 По страницам

| URL | Реальный API | Заглушка/Статика | Сломано / Отсутствует |
|---|---|---|---|
| `/` | — | Всё (stats, doctors, clinics, articles) | Clinic cards → 404 |
| `/search` | GET /doctors (6 врачей) | 9 mock как fallback; фильтры metro/DMS/online | 3/6 doctor links → 404 |
| `/doctors` | — | Всё (SEO-статика) | — |
| `/doctor/[slug]` | slots, available-days | Профиль из lib/doctors.ts | 3/6 API-врачей → 404 |
| `/doctor/[slug]/booking` | POST /appointments, slots | — | — |
| `/clinics` | GET /clinics (5 клиник) | — | 3/5 clinic links → 404 |
| `/clinic/[slug]` | — | Весь профиль (lib/clinics.ts) | 3/5 API-слагов → 404 |
| `/login` | POST /auth/login+verify-otp | — | Реальные звонки (контракт pending) |
| `/register` | POST /auth/register+verify-otp | — | Реальные звонки (контракт pending) |
| `/services` | GET /doctors | — | 3/6 doctor links → 404 |
| `/about` | — | Всё (статика) | — |
| `/cabinet/patient` | GET /auth/me (имя), GET /appointments/patient | Бонус-виджет, health stats | Nav: appointments, favorites → 404 |
| `/cabinet/patient/bonuses` | GET /auth/me, GET /bonuses/my | Rewards секция | "Получить" → ничего |
| `/cabinet/patient/medcard` | — | Всё (3 визита, витальные, имя "Алекс Стерлинг") | PDF, Share, Документы → ничего |
| `/cabinet/patient/family` | — | Всё (3 члена семьи Стерлинг) | Все кнопки декоративные |
| `/cabinet/patient/appointments` | — | — | **404 (страница не создана)** |
| `/cabinet/patient/favorites` | — | — | **404 (страница не создана)** |
| `/cabinet/clinic` | GET /appointments/clinic/stats | — | — |
| `/cabinet/clinic/appointments` | GET /appointments/clinic | — | — |
| `/cabinet/clinic/doctors` | GET /clinics/{id}/doctors | — | — |
| `/cabinet/clinic/schedule` | GET+POST+DELETE /doctors/{id}/day-offs | — | — |
| `/cabinet/clinic/reports` | GET /appointments/clinic/analytics | — | — |
| `/cabinet/clinic/settings` | GET /auth/me (phone, role) | userName "СМ-Клиника" hardcoded | Нельзя изменить данные |
| `/cabinet/doctor` | GET /appointments/doctor, /auth/me | — | Nav: schedule, settings → 404 |
| `/cabinet/doctor/schedule` | — | — | **404 (страница не создана)** |
| `/cabinet/doctor/settings` | — | — | **404 (страница не создана)** |

### 2.2 Врачи — реальные слаги vs профили

| Слаг (из API) | Имя | Специальность | /doctor/[slug] | /search список |
|---|---|---|---|---|
| anna-sokolova | Соколова Анна Михайловна | Кардиолог | ✅ (есть в lib/doctors.ts) | ✅ |
| igor-petrov | Петров Игорь Сергеевич | Хирург | ✅ (есть в lib/doctors.ts) | ✅ |
| maria-kozlova | Козлова Мария Александровна | Педиатр | ✅ (есть в lib/doctors.ts) | ✅ |
| elena-morozova-sm | Морозова Елена Владимировна | Невролог | ❌ **404** | ✅ |
| pavel-ivanov-sm | Иванов Павел Сергеевич | Терапевт | ❌ **404** | ✅ |
| aleksey-sidorov-sm | Сидоров Алексей Николаевич | Гастроэнтеролог | ❌ **404** | ✅ |

**Причина:** `frontend/src/app/doctor/[slug]/page.tsx` вызывает `getDoctorBySlug(slug)` из `lib/doctors.ts` — статический файл с 3 записями. Три API-врача там отсутствуют → `notFound()` → 404.
**Fix:** Заменить `getDoctorBySlug(slug)` на `fetchDoctorBySlug(slug)` из `lib/api.ts` (HTTP к реальному API).

### 2.3 Клиники — реальные слаги vs профили

| Слаг (из API) | Название | /clinic/[slug] | /clinics список |
|---|---|---|---|
| stomatologiya-ulybka | Стоматология Улыбка | ✅ (совпадает с lib/clinics.ts) | ✅ |
| semeynyy-doktor | Семейный доктор | ✅ (совпадает с lib/clinics.ts) | ✅ |
| medicina-na-tsvetnoy | Медицина на Цветном | ❌ **404** | ✅ |
| evromedservice | ЕвроМедСервис | ❌ **404** | ✅ |
| sm-klinika | СМ-Клиника | ❌ **404** | ✅ |

**Причина:** `frontend/src/app/clinic/[slug]/page.tsx` → `getClinicBySlug(slug)` из `lib/clinics.ts` (12 статических записей со старыми слагами). 3 новые API-клиники там не зарегистрированы → 404.
**Fix:** Переключить на `fetchClinicBySlug(slug)` через реальный API.

### 2.4 Фильтры поиска — что работает, что нет

| Фильтр | Для реальных врачей | Причина |
|---|---|---|
| Поиск по имени/специальности (q) | ✅ Работает | Текстовый match по name/specialty из API |
| Фильтр по цене (мин-макс) | ✅ Работает | price есть в ответе API |
| Фильтр по рейтингу | ✅ Работает | rating есть в ответе API |
| Фильтр по метро | ❌ 0 результатов | apiDoctorToDoctor маппит `metro: []` всегда |
| Фильтр ДМС | ❌ 0 результатов | apiDoctorToDoctor маппит `acceptsDMS: false` всегда |
| Фильтр онлайн-приём | ❌ 0 результатов | apiDoctorToDoctor маппит `online: false` всегда |
| Фильтр выезд на дом | ❌ 0 результатов | apiDoctorToDoctor маппит `homeVisit: false` всегда |
| Фильтр по полу | ❌ Не работает | apiDoctorToDoctor: gender не маппируется |

**Файл с проблемой:** `frontend/src/lib/api.ts` — функция `apiDoctorToDoctor()`.
**Fix:** Добавить поля `accepts_dms`, `online`, `home_visit`, `metro`, `gender` в модель Doctor на бэкенде + Alembic-миграция + маппинг в apiDoctorToDoctor.

---

## 3. ПОЛНЫЙ АУДИТ 22 СТРАНИЦ

---

### Страница 1: Главная `/`

**Тип:** SSR (Server Component)
**Файл:** `frontend/src/app/page.tsx`
**Компоненты:** HeroSection, StatsSection, DoctorsSection, SpecialtiesSection, ClinicsSection, OffersSection, ArticlesSection, CTASection

#### Реальные данные:
Нет прямых API-вызовов. Вся информация — статика.

#### Захардкоженные данные (по компонентам):

| Компонент | Что захардкожено | Файл |
|---|---|---|
| HeroSection | Текст "Найдите лучшего врача" | home/HeroSection.tsx |
| StatsSection | "10 000+ врачей", "500+ клиник", "4.9 рейтинг" | home/StatsSection.tsx |
| DoctorsSection | 3-6 карточек врачей — статический массив | home/DoctorsSection.tsx |
| SpecialtiesSection | Список специальностей | home/SpecialtiesSection.tsx |
| ClinicsSection | 4 клиники: id="st-ethos", "lumina-dental", "kindred-pediatrics", "bloom-wellness" | home/ClinicsSection.tsx |
| OffersSection | Карточки предложений | home/OffersSection.tsx |
| ArticlesSection | 3 статьи | home/ArticlesSection.tsx |

#### Broken элементы:
1. **ClinicsSection** → все 4 клиники: `href="/clinics/st-ethos"` → маршрут `/clinics/[slug]` НЕ СУЩЕСТВУЕТ (правильный — `/clinic/[slug]`), а сами IDs (st-ethos и др.) нет нигде в системе → **404** у всех 4 карточек.
2. **DoctorsSection** → ссылки могут вести на несуществующие слаги.
3. **StatsSection** → все цифры выдуманные, не из БД.

#### Что работает:
- HeroSection: поиск → /search?q=... ✅
- Header навигация (Врачи, Клиники, Записаться) ✅
- SpecialtiesSection → /search?q={specialty} ✅
- CTASection → /register и /search ✅

---

### Страница 2: Поиск `/search`

**Тип:** SSR + клиентские фильтры
**Файлы:** `frontend/src/app/search/page.tsx`, `frontend/src/components/search/SearchClient.tsx`

#### Поток данных (проверено по коду):
```
search/page.tsx
  → fetchDoctors() → GET api.med-as.ru/api/v1/doctors
  → 6 ApiDoctor объектов
  → каждый через apiDoctorToDoctor() → DisplayDoctor
  → передаётся как initialDoctors в <SearchClient>
  
SearchClient (строка 181):
  const doctors = initialDoctors.length > 0 ? initialDoctors : DOCTORS;
  → при работающем API: initialDoctors = 6 реальных врачей
  → DOCTORS (9 mock) никогда не используется при живом API
```

#### Работающие фильтры:
- Текстовый поиск (q): по name + specialty → ✅
- Специальность (табы): текстовый match → ✅
- Цена: price из API → ✅
- Рейтинг: rating из API → ✅
- Сортировка (рейтинг/цена) → ✅

#### Сломанные фильтры (причина — в apiDoctorToDoctor):
```typescript
// frontend/src/lib/api.ts
function apiDoctorToDoctor(d: ApiDoctor): DisplayDoctor {
  return {
    ...
    metro: [],        // всегда пусто — нет в API-ответе
    acceptsDMS: false, // всегда false — нет в API-ответе
    online: false,    // всегда false — нет в API-ответе
    homeVisit: false, // всегда false — нет в API-ответе
    gender: undefined, // нет в API-ответе
  }
}
```

#### Broken flows:
- Клик на Elena Morozova SM / Pavel Ivanov SM / Aleksey Sidorov SM → `/doctor/{slug}` → **404** (3 из 6)

---

### Страница 3: Каталог специальностей `/doctors`

**Тип:** SSR (полностью статическая страница, нет API)
**Файл:** `frontend/src/app/doctors/page.tsx`
**Статус после исправлений (коммит b3ece6c):** ✅

- Header и Footer присутствуют ✅
- 12 специальностей → ссылки `/search?q={specialty}` ✅ (было `/search?specialty=` — исправлено)
- SEO-метаданные ✅
- Всё содержимое статическое (нет счётчиков из БД)

---

### Страница 4: Профиль врача `/doctor/[slug]`

**Тип:** SSR + клиентский sidebar
**Файлы:** `frontend/src/app/doctor/[slug]/page.tsx`, `frontend/src/components/doctor/AppointmentSidebarV2.tsx`

#### Поток данных:
```
page.tsx:
  getDoctorBySlug(slug)  ← из lib/doctors.ts (СТАТИКА, 3 записи!)
  если slug не найден → notFound() → 404
  
AppointmentSidebarV2:
  GET /doctors/{slug}/available-days → доступные дни из БД ✅
  GET /doctors/{slug}/slots → слоты из БД ✅
  при клике "Записаться" → /doctor/{slug}/booking?date=...&time=...
```

#### Что работает (anna-sokolova, igor-petrov, maria-kozlova):
- Отображение профиля (из статики lib/doctors.ts) ✅
- Calendar доступности → реальный API ✅
- Слоты времени → реальный API ✅
- Переход на форму бронирования с pre-fill ✅

#### Broken:
- elena-morozova-sm → **404** (нет в lib/doctors.ts)
- pavel-ivanov-sm → **404**
- aleksey-sidorov-sm → **404**
- Кнопка "♡ В избранное" → ничего (нет onClick, нет Favorite-модели)
- Отзывы: статический массив, нет Review-модели в БД

#### Расхождение данных:
Данные профиля (bio, фото, стаж) — **из статики** `lib/doctors.ts`.
Слоты и доступность — **реальные из БД**.
При изменении данных врача через API — страница профиля не обновится автоматически.

---

### Страница 5: Форма бронирования `/doctor/[slug]/booking`

**Тип:** Client Component
**Файлы:** `frontend/src/app/doctor/[slug]/booking/page.tsx`, `frontend/src/components/doctor/booking/BookingForm.tsx`

#### Поток данных (проверено по коду):
```
URL: /doctor/anna-sokolova/booking?date=2026-6-17&time=10%3A00

BookingForm:
  useSearchParams() → prefillDate="2026-6-17", prefillTime="10:00"  [исправлено b3ece6c ✅]
  prefillDay = parseInt("17") = 17
  prefillIdx = findIndex в doctor.slots где день = 17 → предзаполняет календарь
  
  При отправке формы:
  POST /api/v1/appointments {
    doctor_slug: "anna-sokolova",
    scheduled_at: "2026-06-17T10:00:00",
    service_type: "clinic",  // или "online"
    use_bonuses: true/false,
    notes: "..."
  }
  
Backend:
  resolves doctor_slug → doctor.id
  creates appointment
  если use_bonuses=true → списывает max(10% цены, баланс пользователя)
  bonuses_earned = 0 (начисление при записи не реализовано!)
  
Redirect: → /cabinet/patient
```

#### Что работает:
- Создание записи ✅
- Pre-fill даты/времени из URL ✅ (исправлено b3ece6c)
- Использование бонусов ✅
- "Назад" → /doctor/{slug} ✅

#### Ограничения:
- `bonuses_earned` всегда = 0 (врач не начисляет бонусы за приём)
- Нет проверки уникальности слота (race condition: два пациента могут взять одно время)
- Тип "Онлайн" — нет реального видео-кабинета

---

### Страница 6: Каталог клиник `/clinics`

**Тип:** SSR + клиентские фильтры
**Файлы:** `frontend/src/app/clinics/page.tsx`, `frontend/src/components/clinic/ClinicsClient.tsx`

#### Поток данных:
```
clinics/page.tsx:
  fetchClinics() → GET /api/v1/clinics → 5 реальных клиник ✅
  apiClinicToClinic() → Clinic (с реальным slug из API)
  <ClinicsClient clinics={5 клиник} />
  
ClinicsClient:
  Фильтрация по тексту ✅
  <ClinicCard clinic={clinic} /> → href="/clinic/${clinic.slug}"
```

#### Что работает:
- Список 5 клиник из API ✅
- Поиск по названию ✅

#### Broken:
- Клик на medicina-na-tsvetnoy → `/clinic/medicina-na-tsvetnoy` → **404**
- Клик на evromedservice → `/clinic/evromedservice` → **404**
- Клик на sm-klinika → `/clinic/sm-klinika` → **404**
- stomatologiya-ulybka → ✅ (совпадает с lib/clinics.ts)
- semeynyy-doktor → ✅ (совпадает с lib/clinics.ts)
- **Итог: 3 из 5 кликов на клинику → 404**

---

### Страница 7: Профиль клиники `/clinic/[slug]`

**Тип:** SSR
**Файл:** `frontend/src/app/clinic/[slug]/page.tsx`

#### Поток данных:
```
page.tsx:
  getClinicBySlug(slug) ← из lib/clinics.ts (СТАТИКА, 12 записей со старыми слагами)
  если не найден → notFound() → 404
  Нет реальных API-вызовов — весь контент статический
```

#### Что работает (для 2 совпадающих слагов):
- stomatologiya-ulybka, semeynyy-doktor ✅
- SEO: OpenGraph, JSON-LD schema ✅
- Header/Footer ✅

#### Весь контент — статика (lib/clinics.ts):
- Название, описание, рейтинг, адрес, метро, часы работы — статика
- Фото клиники — статика (могут быть устаревшие URL)
- Список врачей внутри клиники — статика (не из API)
- Кнопка "Записаться" — не связана с реальным BookingForm

---

### Страница 8: Авторизация `/login`

**Тип:** Client Component
**Файлы:** `frontend/src/app/login/page.tsx`, `frontend/src/components/auth/LoginForm.tsx`

#### Поток данных:
```
1. Ввод номера: +7 XXXXXXXXXX (маска +7 (9XX) XXX-XX-XX)
2. POST /auth/login → {phone} → запрос Flash Call через websms.ru
3. websms.ru: исходящий звонок → пациент видит последние 4 цифры caller ID
4. Ввод кода → POST /auth/verify-otp → {phone, otp}
5. Ответ: JWT access_token + refresh_token
6. GET /auth/me → role
7. Редирект: clinic→/cabinet/clinic, doctor→/cabinet/doctor, patient→/cabinet/patient
```

#### Что работает:
- OTP Flow реализован ✅
- 5 попыток Flash Call с таймаутами [60,90,120,120,120]s ✅
- Lockout: 15 неверных → 30 мин блокировка ✅
- Мастер-код [REDACTED] работает для любого номера ✅
- Telegram 503 alerts ✅

#### Ограничения:
- **Реальные звонки НЕ работают**: websms.ru контракт PENDING ⚠️
- В продакшне все входы только через мастер-код

---

### Страница 9: Регистрация `/register`

**Тип:** Client Component
**Файл:** `frontend/src/components/auth/RegisterForm.tsx`

#### Поток данных:
```
1. Поля: имя (ФИО), телефон
2. POST /auth/register → {name, phone}
3. OTP → POST /auth/verify-otp
4. При первой верификации (is_verified: false→true) → welcome-бонус +500
5. JWT → redirect /cabinet/patient
```

#### Что работает:
- Регистрация через мастер-код ✅
- Welcome-бонус +500 ✅
- role=patient автоматически ✅

---

### Страница 10: Услуги `/services`

**Тип:** Client Component (ServicesClient)
**Файл:** `frontend/src/app/services/page.tsx`

- GET /api/v1/doctors → реальные врачи ✅
- Поиск по имени/специальности ✅
- Карточки → /doctor/{slug}
- 3/6 врачей ведут на 404 (та же проблема слагов)

---

### Страница 11: О платформе `/about`

**Тип:** SSR, полностью статика
**Файл:** `frontend/src/app/about/page.tsx`

Весь контент статический — текст, цифры, фото команды. Нет API-вызовов.

---

### Страница 12: ЛК Пациента — Главная `/cabinet/patient`

**Тип:** Server + Client Components
**Файл:** `frontend/src/app/cabinet/patient/page.tsx`

#### Реальные данные:

| Компонент | API | Статус |
|---|---|---|
| PatientHeroGreeting | GET /auth/me → имя из токена | ✅ |
| PatientAppointments | GET /appointments/patient → список записей | ✅ |
| "Отменить" кнопка | PATCH /appointments/{id}/cancel | ✅ |

#### Захардкоженные данные:

| Элемент | Захардкоженное значение | Статус |
|---|---|---|
| Бонус-виджет | "1 230 бонусов" | ❌ (нет API-вызова) |
| Давление | "120/80 мм рт.ст." | ❌ |
| Пульс | "72 уд/мин" | ❌ |
| Температура | "36.6 °C" | ❌ |
| ИМТ | "22.6" | ❌ |

#### Навигационное меню (6 пунктов):

| Пункт | URL | Статус |
|---|---|---|
| 🏠 Главная | /cabinet/patient | ✅ |
| 📅 Приёмы | /cabinet/patient/appointments | ❌ **404** |
| 📋 Медкарта | /cabinet/patient/medcard | ✅ (но всё mock) |
| 👨‍👩‍👧 Семейный профиль | /cabinet/patient/family | ✅ (но всё mock) |
| 🎁 Бонусы | /cabinet/patient/bonuses | ✅ (реальные данные) |
| ❤️ Избранные врачи | /cabinet/patient/favorites | ❌ **404** |

---

### Страница 13: ЛК Пациента — Бонусы `/cabinet/patient/bonuses`

**Тип:** Client Component
**Файл:** `frontend/src/app/cabinet/patient/bonuses/page.tsx`

#### Реальные данные:
- GET /auth/me → bonus_balance ✅
- GET /bonuses/my → 50 последних транзакций ✅
- История: тип, сумма, дата, описание ✅

#### Декоративные элементы (не работают):

| Элемент | Описание |
|---|---|
| "Скидка 5%" + кнопка "Получить" | Нет onClick, нет API |
| "Анализ крови" + "Получить" | Нет onClick, нет API |
| "Личный врач" + "Получить" | Нет onClick, нет API |
| "Полис ДМС" + "Получить" | Нет onClick, нет API |
| Прогресс-бар "до золотого статуса" | Hardcoded значение |

---

### Страница 14: ЛК Пациента — Медкарта `/cabinet/patient/medcard`

**Тип:** Server Component (полностью статика — нет ни одного API-вызова)
**Файл:** `frontend/src/app/cabinet/patient/medcard/page.tsx`

#### Весь контент захардкожен в JSX:

| Данные | Значение в коде |
|---|---|
| Имя пациента | "Алекс Стерлинг" (const в JSX) |
| Дата рождения | "12.03.1990 • Мужской • 34 года" |
| Группа крови | "O+" |
| Аллергия | "Пенициллин" |
| Хроническое заболевание | "Гипертония I ст." |
| Препарат | "Лизиноприл 10мг, 1 раз в день, утром" |
| Давление | "120/80 мм рт.ст." |
| Пульс | "72 уд/мин" |
| Температура | "36.6 °C" |
| Рост | "182 см" |
| Вес | "75 кг" |
| ИМТ | "22.6" |
| Визит 1 | "7 ноя 2024, Д-р Волков, Кардиолог, Гипертония I ст." |
| Визит 2 | "23 окт 2024, Д-р Чэнь, Невролог, Хроническое напряжение" |
| Визит 3 | "15 сен 2024, Д-р Миллер, Терапевт, ОРВИ" |

#### Декоративные кнопки:

| Кнопка | Что происходит при клике |
|---|---|
| "Скачать PDF" | Ничего (нет onClick) |
| "Поделиться" | Ничего |
| "Документы" (на каждом визите) | Ничего |
| Фильтр "Все специальности" | Ничего (нет onChange) |

#### Критическая проблема:
Любой авторизованный пациент видит чужие данные ("Алекс Стерлинг"). Это воспринимается как баг и разрушает доверие к платформе.

---

### Страница 15: ЛК Пациента — Семейный профиль `/cabinet/patient/family`

**Тип:** Server Component (полностью статика)
**Файл:** `frontend/src/app/cabinet/patient/family/page.tsx`

#### Захардкоженные данные:
```javascript
const familyMembers = [
  { name: "Алекс Стерлинг", relation: "Вы", age: 34, bloodType: "O+", ... },
  { name: "Мария Стерлинг", relation: "Супруга", age: 31, bloodType: "A+", ... },
  { name: "Дима Стерлинг", relation: "Сын", age: 7, bloodType: "B+", ... },
];
```

#### Декоративные кнопки:
- "+ Добавить члена семьи" → ничего
- "Медкарта" для каждого члена → ничего
- "Записать" для каждого члена → ничего
- Рекомендации (Вакцинация, Стоматология, Кардиология) → статический текст

---

### Страница 16: ЛК Пациента — Приёмы `/cabinet/patient/appointments`

**СТАТУС: СТРАНИЦА ОТСУТСТВУЕТ → 404**

В навигации ЛК пациента есть пункт "📅 Приёмы" → `/cabinet/patient/appointments`.
Директории и файла `page.tsx` НЕ СУЩЕСТВУЕТ. При переходе — 404.

**Что должна делать страница:**
- Показывать ВСЕ записи пациента (с пагинацией)
- Фильтрация по статусу (ожидает/подтверждено/завершено/отменено)
- Фильтрация по дате
- Детальная карточка каждой записи (врач, клиника, дата, цена, бонусы)
- Кнопка "Отменить" для pending-записей
- Кнопка "Записаться снова"

**Backend:** endpoint GET /appointments/patient уже существует ✅

---

### Страница 17: ЛК Пациента — Избранные врачи `/cabinet/patient/favorites`

**СТАТУС: СТРАНИЦА ОТСУТСТВУЕТ → 404**

В навигации — пункт "❤️ Избранные врачи" → `/cabinet/patient/favorites`.
Нет ни страницы, ни модели в БД, ни API-endpoints.

**Что нужно для полной реализации:**
1. Модель `Favorite` в PostgreSQL: `id, user_id, doctor_slug, created_at`
2. Alembic-миграция
3. Endpoints: POST /favorites/{slug}, DELETE /favorites/{slug}, GET /favorites/my
4. Кнопка "♡" на `/doctor/[slug]` → POST /favorites
5. Страница `/cabinet/patient/favorites` → GET /favorites/my

---

### Страница 18: ЛК Клиники — Дашборд `/cabinet/clinic`

**Тип:** Server + Client Components
**Файл:** `frontend/src/app/cabinet/clinic/page.tsx`

Все данные реальные (проверено). Единственная секция, где платформа полностью работает.

| Компонент | Endpoint | Данные |
|---|---|---|
| 4 KPI карточки | GET /appointments/clinic/stats | pending, today, month_revenue, bonus_used |
| Воронка (PatientFunnel) | тот же stats | Создано→Подтверждено→Завершено→Сбонусами |
| DayTimeline | тот же stats | Записи на сегодня по часам |
| NewRequestsSidebar | тот же stats | Pending-записи + "Подтвердить" |
| DoctorLoad (таблица) | тот же stats | Врач/Сегодня/Месяц/Загрузка% |
| График выручки | тот же stats | 30 дней daily_revenue |

---

### Страница 19-22: ЛК Клиники — Записи, Врачи, Расписание, Отчёты

**Все страницы ЛК клиники работают на реальных данных ✅**

| URL | Endpoint | Статус |
|---|---|---|
| /cabinet/clinic/appointments | GET /appointments/clinic + PATCH confirm/cancel | ✅ + CSV экспорт |
| /cabinet/clinic/doctors | GET /clinics/{id}/doctors, PATCH price/status | ✅ |
| /cabinet/clinic/schedule | GET+POST+DELETE /doctors/{id}/day-offs | ✅ |
| /cabinet/clinic/reports | GET /appointments/clinic/analytics | ✅ |

---

### Страница 23: ЛК Клиники — Настройки `/cabinet/clinic/settings`

**Тип:** Client Component
**Файл:** `frontend/src/app/cabinet/clinic/settings/page.tsx`

| Данные | Источник | Статус |
|---|---|---|
| Телефон | GET /auth/me → phone | ✅ |
| Роль | GET /auth/me → role | ✅ |
| Название клиники (userName prop) | Hardcoded "СМ-Клиника" в component | ❌ |
| Возможность изменить данные | — | ❌ (нет формы, нет PATCH) |

Текст-заглушка: *"Для изменения данных, пожалуйста, обратитесь к команде MEDAS."*

---

### Страница 24: ЛК Врача — Главная `/cabinet/doctor`

**Тип:** Server + Client Components
**Файл:** `frontend/src/app/cabinet/doctor/page.tsx`

#### Реальные данные:

| Компонент | Endpoint | Статус |
|---|---|---|
| Имя врача | GET /auth/me → name | ✅ |
| KPI (сегодня/месяц/ожидают) | GET /appointments/doctor (подсчёт) | ✅ |
| DayTimeline | GET /appointments/doctor | ✅ |
| Таблица записей | GET /appointments/doctor | ✅ |

#### Навигационное меню (2 пункта):

| Пункт | URL | Статус |
|---|---|---|
| 📅 Расписание | /cabinet/doctor/schedule | ❌ **404** |
| ⚙️ Настройки | /cabinet/doctor/settings | ❌ **404** |

---

### Страница 25-26: ЛК Врача — Расписание и Настройки

**ОБЕ СТРАНИЦЫ ОТСУТСТВУЮТ → 404**

| URL | Что нужно |
|---|---|
| /cabinet/doctor/schedule | Просмотр расписания, блокировка дат (переиспользовать UI клиники) |
| /cabinet/doctor/settings | Редактирование bio, фото, цены, специальности (новый endpoint PATCH /doctors/{id}/profile) |

---

## 4. СПИСОК КРИТИЧЕСКИХ BROKEN FLOWS

### BF-01: Главная → Клиника → 404
**Путь:** / → клик на клинику в секции клиник → `/clinics/st-ethos` → 404
**Причина:** ClinicsSection использует фиктивные IDs (st-ethos, lumina-dental и др.), ссылки `/clinics/{id}` (с «s»), маршрут `/clinics/[slug]` не существует
**Затронуты:** 100% посетителей главной (все 4 клиники → 404)
**Fix:** Заменить ClinicsSection на реальный fetchClinics() + ссылки `/clinic/{slug}`

### BF-02: Поиск → Профиль врача → 404
**Путь:** /search → клик на elena-morozova-sm или pavel-ivanov-sm или aleksey-sidorov-sm → 404
**Причина:** `/doctor/[slug]/page.tsx` читает из статики lib/doctors.ts (3 записи), 3 API-врача там отсутствуют
**Затронуты:** 3 из 6 врачей (50%)
**Fix:** `getDoctorBySlug(slug)` → `fetchDoctorBySlug(slug)` из lib/api.ts

### BF-03: Список клиник → Профиль клиники → 404
**Путь:** /clinics → клик на medicina-na-tsvetnoy / evromedservice / sm-klinika → 404
**Причина:** lib/clinics.ts содержит старые слаги, 3 новые API-клиники там отсутствуют
**Затронуты:** 3 из 5 клиник (60%)
**Fix:** Переключить `/clinic/[slug]/page.tsx` на fetchClinicBySlug из API

### BF-04: ЛК пациента → "Приёмы" → 404
**Путь:** /cabinet/patient → клик "📅 Приёмы" в навигации → 404
**Причина:** Страница не создана (нет page.tsx)
**Затронуты:** 100% пациентов
**Fix:** Создать `/cabinet/patient/appointments/page.tsx`

### BF-05: ЛК пациента → "Избранные врачи" → 404
**Путь:** /cabinet/patient → клик "❤️ Избранные врачи" → 404
**Причина:** Страница не создана + нет модели Favorite в БД + нет endpoints
**Затронуты:** 100% пациентов

### BF-06: ЛК врача → "Расписание" → 404
**Путь:** /cabinet/doctor → клик "📅 Расписание" → 404
**Причина:** Страница не создана

### BF-07: ЛК врача → "Настройки" → 404
**Путь:** /cabinet/doctor → клик "⚙️ Настройки" → 404
**Причина:** Страница не создана

### BF-08: Фильтры поиска "ДМС / Метро / Онлайн / Выезд" → 0 результатов
**Путь:** /search → включить любой из 4 фильтров → 0 врачей
**Причина:** apiDoctorToDoctor маппит все эти поля в false/[] — нет в API-ответе
**Затронуты:** 100% пользователей, использующих фильтры

### BF-09: Медкарта показывает чужие данные
**Путь:** Любой пациент → /cabinet/patient/medcard → видит "Алекс Стерлинг"
**Причина:** Весь контент hardcoded (нет API-вызовов)
**Серьёзность:** HIGH — разрушает доверие

### BF-10: Семейный профиль показывает чужие данные
**Путь:** Любой пациент → /cabinet/patient/family → "Семья Стерлинг"
**Причина:** Весь контент hardcoded
**Серьёзность:** HIGH

### BF-11: Бонус-виджет на главной ЛК — неверная сумма
**Путь:** /cabinet/patient → виджет "1 230 бонусов"
**Причина:** Число захардкожено, реальный баланс не подтягивается
**Fix:** Сделать client component, GET /auth/me → bonus_balance

### BF-12: Кнопки "Получить" в бонусах → ничего
**Путь:** /cabinet/patient/bonuses → "Получить" у любой награды
**Причина:** onClick отсутствует, нет модели BonusReward

### BF-13: "Скачать PDF" медкарты → ничего
**Путь:** /cabinet/patient/medcard → кнопка "Скачать PDF"
**Причина:** onClick отсутствует

### BF-14: "В избранное" на профиле врача → ничего
**Путь:** /doctor/{slug} → кнопка "♡ В избранное"
**Причина:** Нет onClick, нет Favorite-модели

### BF-15: Клиники на главной → неверный маршрут
**Путь:** / → ClinicsSection → любая клиника → `/clinics/st-ethos` → 404
**Причина:** Фиктивные IDs + неправильный маршрут (нужен /clinic/ без «s»)

### BF-16: Настройки клиники — нельзя изменить данные
**Путь:** /cabinet/clinic/settings → все поля read-only
**Причина:** Нет формы редактирования, нет PATCH /clinics/{id}

---

## 5. ДЕТАЛЬНЫЕ ПОЛЬЗОВАТЕЛЬСКИЕ СЦЕНАРИИ

---

### 5.1 Сценарий: Пациент — поиск и запись к врачу

**Актор:** Пациент (авторизованный)
**Цель:** Найти кардиолога и записаться на приём

#### ШАГ 1: Главная страница saas.med-as.ru/
**Что видит пациент:**
- Хедер с навигацией (Врачи, Клиники, Записаться, Войти)
- Поисковая строка с плейсхолдером "Найти врача или клинику"
- Секции: популярные специальности, врачи, клиники, статьи

**Что работает:**
- Поиск → /search?q=... ✅

**Что сломано:**
- Клик на любую из 4 клиник → 404 (BF-15) ❌

---

#### ШАГ 2: /search?q=кардиолог
**Что происходит в системе:**
- SSR: GET /api/v1/doctors → 6 врачей из БД
- SearchClient: doctors = 6 реальных API-врачей

**Что видит пациент:**
- 6 карточек врачей
- anna-sokolova (Кардиолог) соответствует запросу → в выдаче ✅
- Все 6 показываются (нет ограничения по специальности без явного фильтра)

**Если пациент хочет онлайн-приём:**
- Нажимает "Онлайн-приём" → фильтр → 0 результатов (BF-08) ❌

**Клик на anna-sokolova** → /doctor/anna-sokolova ✅

---

#### ШАГ 3: /doctor/anna-sokolova
**Что происходит:**
- page.tsx: getDoctorBySlug("anna-sokolova") → lib/doctors.ts → возвращает статику
- AppointmentSidebarV2: GET /doctors/anna-sokolova/available-days → реальные дни
- При выборе дня: GET /doctors/anna-sokolova/slots?date=2026-06-17 → реальные слоты

**Что видит:**
- Имя, фото, специальность, стаж, рейтинг (из статики lib/doctors.ts)
- Календарь с реальными доступными днями
- Слоты времени из БД
- Кнопка "В избранное" → ничего (BF-14) ❌

**Действие:** Выбрать дату 17 июня, время 10:00 → "Записаться"
→ Навигация: /doctor/anna-sokolova/booking?date=2026-6-17&time=10%3A00

**Если пациент ищет Elena Morozova:**
- Клик → /doctor/elena-morozova-sm → **404** (BF-02) ❌
- Нет кнопки "Назад к поиску", пациент должен нажать Back в браузере

---

#### ШАГ 4: /doctor/anna-sokolova/booking?date=2026-6-17&time=10%3A00
**Что происходит:**
- useSearchParams → date="2026-6-17", time="10:00"
- prefillDay=17, prefillIdx найден в slots → calendark предзаполнен ✅

**Что видит:**
- Форма с уже выбранной датой 17 июня и временем 10:00
- Поля: ФИО, телефон, комментарий
- Тип приёма: онлайн/офлайн
- Чекбокс "Использовать бонусы (500 доступно)"

**Заполняет форму и нажимает "Записаться"**

**POST /api/v1/appointments:**
```json
{
  "doctor_slug": "anna-sokolova",
  "scheduled_at": "2026-06-17T10:00:00",
  "service_type": "clinic",
  "use_bonuses": false,
  "notes": "Боли в груди при нагрузке"
}
```

**Ответ от сервера:**
```json
{
  "id": 124,
  "doctor_name": "Соколова Анна Михайловна",
  "scheduled_at": "2026-06-17T10:00:00",
  "status": "pending",
  "price": 3000,
  "bonuses_used": 0,
  "bonuses_earned": 0
}
```

→ Редирект: /cabinet/patient ✅

---

#### ШАГ 5: /cabinet/patient (после записи)
**Что видит:**
- "Ваше здоровье под контролем, Анна" (реальное имя из /auth/me) ✅
- Запись к Соколовой 17 июня, статус "Ожидает" ✅
- Бонусы: "1 230 бонусов" → захардкожено ❌ (реальный баланс не отображается)
- Health stats: 120/80, 72 уд/мин → захардкожено ❌

**Клик "📅 Приёмы"** → /cabinet/patient/appointments → **404** (BF-04) ❌
**Клик "❤️ Избранные"** → /cabinet/patient/favorites → **404** (BF-05) ❌

**Кнопка "Отменить":**
PATCH /appointments/124/cancel → status="cancelled" ✅

---

### 5.2 Сценарий: Пациент — работа с медкартой и бонусами

#### Медкарта /cabinet/patient/medcard
**Что происходит:** Страница загружается мгновенно (нет API-вызовов)
**Что видит:** "Алекс Стерлинг" — это НЕ текущий пациент. Чужие данные.
**Серьёзность:** HIGH — если показать клиенту/инвестору, разрушает доверие

#### Бонусы /cabinet/patient/bonuses
**Что работает:**
- Реальный баланс (GET /auth/me) ✅
- Реальная история транзакций (GET /bonuses/my): welcome +500 и другие ✅

**Что не работает:**
- 4 кнопки "Получить" → ничего (BF-12) ❌

---

### 5.3 Сценарий: Владелец клиники — управление

**Тест-аккаунт:** +70000000001 / 123456 (или мастер-код)

#### Вход → /cabinet/clinic
Все 6 страниц ЛК клиники работают на реальных данных.

#### Что можно делать (работает):
1. Смотреть дашборд: KPI, воронка, timeline, выручка ✅
2. Просматривать и подтверждать/отменять записи ✅
3. Скачать CSV всех записей ✅
4. Управлять ценами врачей (inline edit) ✅
5. Блокировать дни в расписании врача ✅
6. Просматривать аналитику по типам приёмов ✅

#### Что нельзя делать (сломано):
1. Изменить название клиники, адрес, часы работы (BF-16) ❌
2. Загрузить логотип клиники ❌

---

### 5.4 Сценарий: Врач — работа с расписанием

**Актор:** Пользователь с role="doctor"

#### Вход → /cabinet/doctor
- KPI, DayTimeline, таблица записей — реальные данные ✅

#### Что врач не может сделать:
- Посмотреть своё расписание: /cabinet/doctor/schedule → **404** ❌
- Изменить свои данные: /cabinet/doctor/settings → **404** ❌
- Заблокировать отпускные дни ❌

---

## 6. КАРТА API

### 6.1 Реализованные endpoints (проверены в коде)

| Endpoint | Метод | Используется где | Статус |
|---|---|---|---|
| /auth/register | POST | /register (RegisterForm) | ✅ |
| /auth/login | POST | /login (LoginForm) | ✅ |
| /auth/verify-otp | POST | /login, /register | ✅ |
| /auth/me | GET | PatientHeroGreeting, bonuses, cabinet/doctor, cabinet/clinic/settings | ✅ |
| /doctors | GET | /search (SSR), /services | ✅ |
| /doctors/{slug} | GET | НЕ используется frontend (читает lib/doctors.ts) | ✅ API, ❌ frontend |
| /doctors/{slug}/slots | GET | AppointmentSidebarV2, BookingForm | ✅ |
| /doctors/{slug}/available-days | GET | AppointmentCalendar | ✅ |
| /doctors/{id}/schedule | GET | /cabinet/clinic/schedule | ✅ |
| /doctors/{id}/day-offs | POST | /cabinet/clinic/schedule | ✅ |
| /doctors/{id}/day-offs/{date} | DELETE | /cabinet/clinic/schedule | ✅ |
| /clinics | GET | /clinics (SSR), часть home | ✅ |
| /clinics/{slug} | GET | НЕ используется frontend (читает lib/clinics.ts) | ✅ API, ❌ frontend |
| /clinics/{clinic_id}/doctors | GET | /cabinet/clinic/doctors | ✅ |
| /bonuses/my | GET | /cabinet/patient/bonuses | ✅ |
| /appointments | POST | BookingForm | ✅ |
| /appointments/patient | GET | PatientAppointments | ✅ |
| /appointments/clinic | GET | /cabinet/clinic/appointments | ✅ |
| /appointments/clinic/stats | GET | /cabinet/clinic (dashboard) | ✅ |
| /appointments/clinic/analytics | GET | /cabinet/clinic/reports | ✅ |
| /appointments/doctor | GET | /cabinet/doctor | ✅ |
| /appointments/{id}/confirm | PATCH | ClinicAppointments, sidebar | ✅ |
| /appointments/{id}/cancel | PATCH | PatientAppointments, ClinicAppointments | ✅ |

### 6.2 Отсутствующие endpoints (нужно добавить)

| Endpoint | Метод | Нужен для | Приоритет |
|---|---|---|---|
| /favorites/my | GET | /cabinet/patient/favorites | P1 |
| /favorites/{doctor_slug} | POST | Кнопка "♡" на /doctor/[slug] | P1 |
| /favorites/{doctor_slug} | DELETE | Убрать из избранного | P1 |
| /clinics/{id} | PATCH | /cabinet/clinic/settings редактирование | P1 |
| /doctors/{id}/profile | PATCH | /cabinet/doctor/settings | P1 |
| /doctors/{id}/profile | GET | /cabinet/doctor/settings | P1 |
| /appointments/bonus-redeem | POST | /cabinet/patient/bonuses "Получить" | P2 |
| /medrecords/my | GET | /cabinet/patient/medcard | P2 |
| /family-members | GET/POST | /cabinet/patient/family | P2 |

---

## 7. ПРИОРИТИЗИРОВАННЫЙ ПЛАН ИСПРАВЛЕНИЙ

### P0 — Критические (блокируют пользователей прямо сейчас)

---

#### P0-1: Профили 3 врачей (elena-morozova-sm, pavel-ivanov-sm, aleksey-sidorov-sm)
**Симптом:** Пользователь из поиска кликает на 3 из 6 врачей → 404.
**Файл:** `frontend/src/app/doctor/[slug]/page.tsx`
**Изменение:** `getDoctorBySlug(slug)` (lib/doctors.ts) → `fetchDoctorBySlug(slug)` (lib/api.ts)
**Сложность:** M (нужно адаптировать типы ApiDoctor → компоненты профиля)
**Backend:** endpoint GET /doctors/{slug} уже работает ✅

---

#### P0-2: Профили 3 клиник (medicina-na-tsvetnoy, evromedservice, sm-klinika)
**Симптом:** Пользователь из /clinics кликает на 3 из 5 клиник → 404.
**Файл:** `frontend/src/app/clinic/[slug]/page.tsx`
**Изменение:** `getClinicBySlug(slug)` → `fetchClinicBySlug(slug)` (добавить в lib/api.ts)
**Backend:** endpoint GET /clinics/{slug} уже работает ✅

---

#### P0-3: Страница /cabinet/patient/appointments (404)
**Симптом:** Пациент нажимает "Приёмы" в боковом меню → 404.
**Файл:** создать `frontend/src/app/cabinet/patient/appointments/page.tsx`
**Backend:** GET /appointments/patient уже работает ✅
**Что включить:** пагинация, фильтр по статусу, детальные карточки, кнопка "Отменить"

---

#### P0-4: Страница /cabinet/doctor/schedule (404)
**Симптом:** Врач нажимает "Расписание" → 404.
**Файл:** создать `frontend/src/app/cabinet/doctor/schedule/page.tsx`
**Backend:** GET /doctors/{id}/schedule + POST/DELETE day-offs уже работают ✅
**UI:** переиспользовать компоненты из /cabinet/clinic/schedule

---

#### P0-5: ClinicsSection на главной → реальные данные
**Симптом:** Все 4 клиники на главной → 404.
**Файл:** `frontend/src/components/home/ClinicsSection.tsx`
**Изменение:** заменить hardcoded массив (st-ethos и др.) на fetchClinics(), ссылки → `/clinic/{slug}`

---

### P1 — Важные (следующий спринт)

| ID | Задача | Файлы | Сложность |
|---|---|---|---|
| P1-1 | Фильтры поиска ДМС/Метро/Онлайн | api.ts (apiDoctorToDoctor) + Doctor-модель + миграция | M |
| P1-2 | /cabinet/patient/favorites (полная фича) | новая модель + миграция + 3 endpoints + страница + кнопка | L |
| P1-3 | /cabinet/doctor/settings (404) | новая страница + PATCH /doctors/{id}/profile | M |
| P1-4 | /cabinet/clinic/settings — форма редактирования | settings/page.tsx + PATCH /clinics/{id} | M |
| P1-5 | Бонусы на главной ЛК — реальная сумма | cabinet/patient/page.tsx: client-side GET /auth/me | S |
| P1-6 | Имя пациента в medcard и family — из API | medcard/page.tsx, family/page.tsx: GET /auth/me | S |

---

### P2 — Улучшения (дальнейшая дорожная карта)

| Задача | Сложность | Описание |
|---|---|---|
| Медкарта — реальные данные | XL | Модель MedicalRecord, API, redesign страницы |
| Семейный профиль — реальные данные | XL | Модель FamilyMember, API, страница |
| Бонусы "Получить" — реальное погашение | L | Модель BonusReward, endpoint, UI |
| PDF-экспорт медкарты | L | puppeteer/pdfmake на бэкенде |
| Отзывы на профиле врача — реальные | L | Модель Review, API, компонент |
| Статьи на главной — реальные | L | Модель Article, CMS-like API |
| Счётчики на StatsSection — из БД | S | Новый endpoint /stats/platform |
| DoctorsSection на главной — из API | S | fetchDoctors() в HomePage |
| "Следующий приём" в ЛК — из реальных записей | S | GET /appointments/patient → nearest |
| Health stats на главной ЛК — убрать | S | Убрать hardcoded секцию |

---

## 8. ТРЕБОВАНИЯ ДЛЯ PRODUCTION

### 8.1 Блокеры перед запуском на prod-домене med-as.ru

| Требование | Статус | Приоритет |
|---|---|---|
| Профили 3 врачей (P0-1) | ❌ | CRITICAL |
| Профили 3 клиник (P0-2) | ❌ | CRITICAL |
| /cabinet/patient/appointments (P0-3) | ❌ | CRITICAL |
| Клиники на главной (P0-5) | ❌ | CRITICAL |
| Реальные Flash Call (websms.ru контракт) | ⚠️ Pending | CRITICAL |
| /cabinet/doctor/schedule (P0-4) | ❌ | HIGH |
| Фильтры поиска (P1-1) | ❌ | HIGH |
| Медкарта — убрать чужие данные (хотя бы) | ❌ | HIGH |

### 8.2 Минимальный путь пользователя без ни одной 404

Для демонстрации инвестору или клиенту пройти весь путь без ошибок:

```
1. saas.med-as.ru/ → поиск → ✅
2. /search?q=кардиолог → anna-sokolova → ✅
3. /doctor/anna-sokolova → профиль → выбрать слот → ✅
4. /doctor/anna-sokolova/booking → заполнить форму → ✅
5. POST /appointments → запись создана → ✅
6. /cabinet/patient → записи видны → ✅
7. НЕ нажимать "Приёмы" (404!) ❌
8. НЕ нажимать "Избранные" (404!) ❌
9. НЕ кликать на клиники на главной (404!) ❌
10. НЕ открывать медкарту (чужие данные!) ❌
```

### 8.3 Тестовые данные

| Роль | Телефон | Код | Что тестировать |
|---|---|---|---|
| Пациент (новый) | Любой | [REDACTED] | Регистрация, запись, ЛК |
| Пациент (тест) | +79271915291 | [REDACTED] | Уже зарегистрирован, есть записи |
| Клиника | +70000000001 | 123456 | Дашборд, врачи, расписание, отчёты |
| Врач | Нужен аккаунт с doctor_id | | ЛК врача |

---

## ПРИЛОЖЕНИЕ A — Карта критических файлов

| Файл | Роль | Проблема |
|---|---|---|
| `frontend/src/app/doctor/[slug]/page.tsx` | Профиль врача | Читает статику вместо API |
| `frontend/src/app/clinic/[slug]/page.tsx` | Профиль клиники | Читает статику вместо API |
| `frontend/src/lib/doctors.ts` | Статика врачей (346 строк) | Только 3 из 6 API-врачей |
| `frontend/src/lib/clinics.ts` | Статика клиник (796 строк) | Только 2 из 5 API-клиник по слагам |
| `frontend/src/lib/api.ts` | HTTP к API | apiDoctorToDoctor теряет metro/DMS/online |
| `frontend/src/components/home/ClinicsSection.tsx` | Блок клиник на главной | Фиктивные IDs, битые ссылки |
| `frontend/src/app/cabinet/patient/medcard/page.tsx` | Медкарта | 100% статика с чужими данными |
| `frontend/src/app/cabinet/patient/family/page.tsx` | Семья | 100% статика с чужими данными |

---

## ПРИЛОЖЕНИЕ B — Хронология исправлений

| Дата | Коммит | Что исправлено |
|---|---|---|
| 2026-06-16 | b3ece6c | /doctors: Header+Footer, ссылки ?specialty=→?q= |
| 2026-06-16 | b3ece6c | BookingForm: pre-fill date/time из URL params |
| 2026-06-15 | ec4d661 | DoctorDayOff модель + API + available-days |
| 2026-06-15 | websms | Flash Call через websms.ru |
| 2026-06-15 | e15e120 | /cabinet/clinic/reports — реальные данные |
| 2026-06-15 | — | /cabinet/clinic/appointments, /doctors, /schedule |
| 2026-06-14 | f2842c6 | PatientFunnel + 5-я KPI карточка |
| 2026-06-14 | 8660bda | SVG логотипы MEDAS |

---

*Документ обновлён: 2026-06-16. Следующее обновление: после выполнения фазы P0 (5 задач).*

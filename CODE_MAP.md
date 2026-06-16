# CODE_MAP — Карта кода MEDAS
> Обновлён: 2026-06-15 | Читать вместо поиска по коду каждую сессию

---

## БЫСТРЫЙ ПОИСК (TOC)

| Раздел | Строка (прибл.) |
|---|---|
| СТРУКТУРА ПРОЕКТА | 22 |
| СТРАНИЦЫ → КОМПОНЕНТЫ | 48 |
| КОМПОНЕНТЫ ДОКТОРА | 70 |
| КОМПОНЕНТЫ КЛИНИКИ | 82 |
| ОБЩИЕ UI-КОМПОНЕНТЫ | 95 |
| КОМПОНЕНТЫ ГЛАВНОЙ | 105 |
| LAYOUT-КОМПОНЕНТЫ | 119 |
| BACKEND — API ENDPOINTS | 130 |
| ДИЗАЙН-СИСТЕМА | 230 |
| ДЕПЛОЙ — команды | 265 |
| ФАЙЛЫ — НЕ ТРОГАТЬ | 310 |
| ВАЖНЫЕ ПАТТЕРНЫ | 320 |

---

## СТРУКТУРА ПРОЕКТА

```
Сайт медас/
├── frontend/                   # Next.js 16.2.9 + React 19 + TypeScript
│   ├── src/
│   │   ├── app/                # App Router (страницы)
│   │   │   ├── page.tsx        # Главная /
│   │   │   ├── layout.tsx      # Root layout (шрифты, meta, noindex)
│   │   │   ├── globals.css     # Дизайн-токены MEDAS + Tailwind v4
│   │   │   ├── robots.ts       # robots.txt — disallow: / (dev mode)
│   │   │   ├── about/          # /about — О компании (статическая, SSR)
│   │   │   ├── login/          # /login — страница входа
│   │   │   ├── register/       # /register — регистрация (в работе)
│   │   │   ├── search/         # /search — поиск врачей
│   │   │   ├── services/       # /services — услуги
│   │   │   ├── doctor/[slug]/  # /doctor/[slug] — профиль врача + /booking
│   │   │   ├── clinic/[slug]/  # /clinic/[slug] — профиль клиники
│   │   │   └── cabinet/        # ЛК: /patient /clinic /doctor
│   │   ├── components/
│   │   │   ├── home/           # Секции главной страницы
│   │   │   ├── layout/         # Header, Footer, CabinetLayout
│   │   │   ├── ui/             # Общие компоненты: ReviewCard, AddressMapBlock, StarIcon, button
│   │   │   ├── doctor/         # Компоненты страницы врача
│   │   │   └── clinic/         # Компоненты страницы клиники
│   │   └── lib/
│   │       ├── utils.ts        # cn() helper
│   │       ├── doctors.ts      # Mock-данные врачей (типы + getDoctor)
│   │       └── clinics.ts      # Mock-данные клиник (типы + 7 полей E2)
│   ├── public/
│   │   ├── logo-dark.png       # Логотип для светлых фонов (156×44)
│   │   └── logo-light.png      # Логотип для тёмных фонов (156×44)
│   ├── Dockerfile
│   └── package.json
├── deploy.sh                   # Скрипт деплоя (docker build → scp → VPS)
├── CODE_MAP.md                 # Этот файл
├── PLAN.md                     # Мастер-план (фазы разработки)
├── SITE_PLAN.md                # 35 страниц с ТЗ (v2.0, 2026-06-12)
├── progress.md                 # Трекер текущего шага
├── task_plan.md                # Детальный план текущего этапа
├── MEDAS_ТЗ_v1.0.md           # Техническое задание
└── MEDAS_Финплан_v1.0.md      # Финансовый план
```

---

## FRONTEND — СТРАНИЦЫ → КОМПОНЕНТЫ

| URL | Файл | Компоненты |
|---|---|---|
| `/` | `app/page.tsx` | HeroSection, StatsSection, SpecialtiesSection, OffersSection, ClinicsSection, ArticlesSection, CTASection |
| `/login` | `app/login/page.tsx` | inline (`LoginForm` client) |
| `/register` | `app/register/page.tsx` | `RegisterForm` (client) — имя+телефон→OTP flash/SMS→/cabinet/patient |
| `/about` | `app/about/page.tsx` | inline SSR — Hero, Stats, Values, Story, Team, CTA |
| `/search` | `app/search/page.tsx` | `SearchClient` (client) |
| `/services` | `app/services/page.tsx` | inline |
| `/doctor/[slug]` | `app/doctor/[slug]/page.tsx` | `DoctorHero`, `DoctorContentSections`, `AppointmentSidebarV2` (client), `MobileBookingBar` (client), `SimilarDoctors` |
| `/doctor/[slug]/booking` | `app/doctor/[slug]/booking/page.tsx` | `BookingForm` (client), `DoctorBookingCard` |
| `/clinics` | `app/clinics/page.tsx` | `ClinicsClient` (client) — фильтры + список ClinicCard |
| `/clinic/[slug]` | `app/clinic/[slug]/page.tsx` | `ClinicHero`, `ClinicContent`, `ClinicInfoSidebar`, `ClinicServicesSearch` (client) |
| `/cabinet/patient` | `app/cabinet/patient/page.tsx` | CabinetLayout, PatientHeroGreeting (client), PatientAppointments (client) |
| `/cabinet/patient/medcard` | `app/cabinet/patient/medcard/page.tsx` | CabinetLayout |
| `/cabinet/patient/family` | `app/cabinet/patient/family/page.tsx` | CabinetLayout |
| `/cabinet/patient/bonuses` | `app/cabinet/patient/bonuses/page.tsx` | CabinetLayout |
| `/cabinet/clinic` | `app/cabinet/clinic/page.tsx` | CabinetLayout, PatientFunnel (inline), DayTimeline (inline), NewRequestsSidebar (inline), DoctorLoad-table (inline), ссылка → /appointments |
| `/cabinet/clinic/reports` | `app/cabinet/clinic/reports/page.tsx` | CabinetLayout + "use client", реальные данные из /clinic/analytics |
| `/cabinet/clinic/appointments` | `app/cabinet/clinic/appointments/page.tsx` | CabinetLayout + ClinicAppointments (showExport) — CSV экспорт ✅ |
| `/cabinet/clinic/doctors` | `app/cabinet/clinic/doctors/page.tsx` | CabinetLayout + DoctorCard (inline) — inline edit цены, деактивация ✅ |
| `/cabinet/clinic/schedule` | `app/cabinet/clinic/schedule/page.tsx` | CabinetLayout + DoctorScheduleRow (inline) — расписание по дням + DoctorDayOff ✅ |
| `/cabinet/clinic/settings` | `app/cabinet/clinic/settings/page.tsx` | CabinetLayout + Field (inline) — read-only MVP ✅ |
| `/cabinet/doctor` | `app/cabinet/doctor/page.tsx` | CabinetLayout — ✅ реальные данные: KPI (сегодня/неделя/месяц/pending) + DayTimeline + таблица записей |

---

## КОМПОНЕНТЫ ДОКТОРА (`src/components/doctor/`)

| Компонент | Файл | Что делает |
|---|---|---|
| `DoctorHero` | `DoctorHero.tsx` | Фото + бейджи + рейтинг + CTA кнопки |
| `DoctorContentSections` | `DoctorContentSections.tsx` | Биография, Образование, Услуги/цены, Клиника приёма (2 колонки), Отзывы (ReviewCard) |
| `AppointmentSidebarV2` | `AppointmentSidebarV2.tsx` | `"use client"`. Мини-календарь + слоты + бонусы + ДМС. Sticky на desktop |
| `MobileBookingBar` | `MobileBookingBar.tsx` | `"use client"`. Fixed bottom bar на мобиле (цена + «Записаться») |
| `SimilarDoctors` | `SimilarDoctors.tsx` | 3 карточки похожих врачей |

---

## КОМПОНЕНТЫ КЛИНИКИ (`src/components/clinic/`)

| Компонент | Файл | Что делает |
|---|---|---|
| `ClinicHero` | `ClinicHero.tsx` | Gradient hero (primary→#001f70), соцдоказательство «47 записей», isOpenNow(), CTA-ряд |
| `ClinicContent` | `ClinicContent.tsx` | 8 секций: О клинике, Врачи сегодня (слоты), Поиск услуг, Рейтинг+отзывы (ReviewCard), Акции, Направления, Фото, Похожие клиники |
| `ClinicInfoSidebar` | `ClinicInfoSidebar.tsx` | AddressMapBlock + расписание-сетка 7 дней (сегодня = highlight) + DMS-чипы + сертификаты + парковка |
| `ClinicServicesSearch` | `ClinicServicesSearch.tsx` | `"use client"`. Поиск по услугам в реальном времени |
| `ClinicsClient` | `ClinicsClient.tsx` | `"use client"`. Quick chips + sidebar фильтры (DMS/OpenNow/рейтинг/специализации) + сортировка. Используется на /clinics |
| `ClinicCard` | `ClinicCard.tsx` | Горизонтальная карточка клиники: colored avatar (initials), адрес, метро badge, теги, stats, isOpen, CTA → /clinic/[slug] |

---

## ОБЩИЕ UI-КОМПОНЕНТЫ (`src/components/ui/`)

| Компонент | Файл | Используется |
|---|---|---|
| `ReviewCard` | `ReviewCard.tsx` | Страница клиники (ClinicContent) + страница врача (DoctorContentSections) |
| `AddressMapBlock` | `AddressMapBlock.tsx` | ClinicInfoSidebar (адрес + телефон + метро + SVG-карта + маршрут) |
| `StarIcon` | `StarIcon.tsx` | DoctorHero, DoctorContentSections (рейтинговые звёзды) |

---

## КОМПОНЕНТЫ ГЛАВНОЙ (`src/components/home/`)

| Компонент | Файл | Что делает |
|---|---|---|
| `HeroSection` | `HeroSection.tsx` | Hero с поисковой строкой и CTA. padding: `pb-20 lg:pb-28 pt-10 lg:pt-14` |
| `StatsSection` | `StatsSection.tsx` | 4 статистики (10 000+ врачей, 500+ клиник, 1 000 000+ пациентов, 4.9 рейтинг). IntersectionObserver. `"use client"` |
| `SpecialtiesSection` | `SpecialtiesSection.tsx` | Специализации (карточки). Ссылка → /search |
| `OffersSection` | `OffersSection.tsx` | 3 акции: Полный чекап / Дерматология / Семейный план. Цены с `&nbsp;` (без переносов) |
| `ClinicsSection` | `ClinicsSection.tsx` | Карточки клиник |
| `ArticlesSection` | `ArticlesSection.tsx` | 3 статьи (Кардиология / Неврология / Стоматология). Server component |
| `CTASection` | `CTASection.tsx` | Финальный призыв к действию |

---

## LAYOUT-КОМПОНЕНТЫ (`src/components/layout/`)

| Компонент | Файл | Ключевые детали |
|---|---|---|
| `Header` | `Header.tsx` | `"use client"`. Показывает имя/бонусы из GET /auth/me. Кнопки Войти/Кабинет/Выйти в зависимости от auth. Мобильный drawer |
| `Footer` | `Footer.tsx` | Лого: `/logo-dark.png` 120×34 |
| `CabinetLayout` | `CabinetLayout.tsx` | `"use client"`. Sidebar + header. Загружает имя из /auth/me. Logout через clearToken() + router.push("/") |
| `PatientHeroGreeting` | `cabinet/PatientHeroGreeting.tsx` | `"use client"`. Приветствие с именем пациента из /auth/me |
| `PatientAppointments` | `cabinet/PatientAppointments.tsx` | `"use client"`. GET /appointments/my → список записей + отмена через PATCH /cancel |
| `Logo` | `ui/Logo.tsx` | Shared логотип MEDAS. Src: /logos/Medas_gor_b.svg. Props: width/height/priority/className. Требует unoptimized. |
| `PatientFunnel` | (inline в `cabinet/clinic/page.tsx`) | Воронка пациентов: Создано→Подтверждено→Завершено→С бонусами + % конверсии. Данные из ClinicStats. |

**Высота Header:**
- Mobile (только nav): ~68px → `<main>` получает `pt-[68px]`
- Desktop (topbar + nav): ~104px → `<main>` получает `lg:pt-[104px]`

---

## BACKEND — API ENDPOINTS

**Стек:** FastAPI Python 3.12, SQLAlchemy 2.0 async, PostgreSQL 16, Alembic
**Путь:** `backend/app/` | Image: `medas-backend:latest`
**Alembic HEAD:** `f5a6b7c8d9e0` (add_user_doctor_id)

### Auth (`backend/app/api/v1/endpoints/auth.py`)
| Method | Path | Описание | Статус |
|---|---|---|---|
| POST | `/auth/register` | Upsert User → генерирует OTP → Redis TTL 600s → SMSC.ru SMS | ✅ |
| POST | `/auth/login` | Найти User → генерирует OTP → Redis TTL 600s → SMSC.ru SMS | ✅ |
| POST | `/auth/verify-otp` | Redis lookup → 3 попытки → 429 → JWT 7 дней | ✅ |
| GET | `/auth/me` | Bearer JWT → UserResponse(id, phone, name, bonus_balance, role, clinic_id) | ✅ |

**OTP:** `backend/app/core/otp.py` — `generate_otp()` + `send_otp(phone, code)` → smsc.ru HTTP API. Логин=medas, SMSC_LOGIN/PASSWORD в backend.env на VPS.

### Clinics (`backend/app/api/v1/endpoints/clinics.py`)
| Method | Path | Описание | Статус |
|---|---|---|---|
| GET | `/clinics?limit=50` | Список клиник (ClinicListOut) | ✅ |
| GET | `/clinics/{slug}` | Клиника по slug | ✅ |

### Doctors (`backend/app/api/v1/endpoints/doctors.py`)
| Method | Path | Auth | Описание | Статус |
|---|---|---|---|---|
| GET | `/doctors?specialty=&clinic_id=&limit=` | — | Список врачей с фильтрами по специальности и клинике | ✅ |
| GET | `/doctors/{slug}` | — | Врач по slug | ✅ |
| PATCH | `/doctors/{id}` | Bearer (role=clinic) | Обновить price / is_active (только своя клиника) | ✅ |
| GET | `/doctors/{slug}/slots?date=YYYY-MM-DD` | — | Доступные слоты (30 мин, из DoctorSchedule) | ✅ |
| GET | `/doctors/{slug}/available-days?month=YYYY-MM` | — | Рабочие дни (weekdays из DoctorSchedule минус DoctorDayOff) | ✅ |
| GET | `/doctors/{id}/schedule` | Bearer (role=clinic) | Расписание врача по дням недели | ✅ |
| PUT | `/doctors/{id}/schedule` | Bearer (role=clinic) | Bulk replace расписания (delete+insert) | ✅ |
| GET | `/doctors/{id}/day-offs` | Bearer (role=clinic) | Список заблокированных дат врача | ✅ |
| POST | `/doctors/{id}/day-offs` | Bearer (role=clinic) | Заблокировать дату (DoctorDayOff) | ✅ |
| DELETE | `/doctors/{id}/day-offs/{date}` | Bearer (role=clinic) | Разблокировать дату | ✅ |

### Appointments (`backend/app/api/v1/endpoints/appointments.py`)
| Method | Path | Auth | Описание | Статус |
|---|---|---|---|---|
| POST | `/appointments` | Bearer | Создать запись (doctor_slug, scheduled_at, service_type, use_bonuses) | ✅ |
| GET | `/appointments/my` | Bearer | Записи текущего пациента | ✅ |
| PATCH | `/appointments/{id}/complete` | Bearer | status→completed + 5% бонусов → patient.bonus_balance | ✅ |
| PATCH | `/appointments/{id}/cancel` | Bearer | status→cancelled + возврат bonuses_used | ✅ |
| PATCH | `/appointments/{id}/confirm` | Bearer (role=clinic) | status pending→confirmed | ✅ |
| GET | `/appointments/clinic` | Bearer (role=clinic) | Записи клиники (clinic_id из user) | ✅ |
| GET | `/appointments/clinic/stats` | Bearer (role=clinic) | KPI + воронка + врачи + график | ✅ |
| GET | `/appointments/clinic/analytics` | Bearer (role=clinic) | Аналитика: тип приёма / врачи / бонусы | ✅ |
| GET | `/appointments/doctor` | Bearer (role=doctor) | Записи врача (doctor_id из user), JOIN patient_name+clinic_name | ✅ |

### Модели (`backend/app/models/`)
| Модель | Файл | Ключевые поля |
|---|---|---|
| User | `user.py` | phone(unique), name, bonus_balance, is_verified, role, clinic_id FK(nullable), doctor_id FK(nullable) |
| Clinic | `clinic.py` | slug(unique), name, address, metro, rating, accepts_dms |
| Doctor | `doctor.py` | slug(unique), clinic_id FK, specialty, price, is_verified, is_active, schedules[], day_offs[] |
| Appointment | `appointment.py` | patient_id(indexed), doctor_id, clinic_id, status, scheduled_at, bonuses_used/earned |
| DoctorSchedule | `schedule.py` | doctor_id FK, weekday(0-6), start_time, end_time, slot_duration_min=30 |
| DoctorDayOff | `day_off.py` | doctor_id FK(indexed), date Date, reason str? — блокировка конкретных дат | 
| Review | `review.py` | patient_id, doctor_id, clinic_id, rating, text |
| BonusTransaction | `bonus.py` | user_id, amount, type, appointment_id |

### Алгоритм слотов (`backend/app/services/schedule_service.py`)
- `get_available_slots(db, doctor_id, date)` — берёт DoctorSchedule по weekday, генерирует слоты с шагом slot_duration_min, исключает занятые из Appointment (status != cancelled)

### Миграции (Alembic)
| Rev | Описание |
|---|---|
| 77dbb05f7c23 | initial_tables (baseline) |
| a3f8c2d1e5b9 | add_doctor_schedule |
| c2d3e4f5a6b7 | add_appointments_patient_index |
| d3e4f5a6b7c8 | add_user_role_clinic_id |
| e4f5a6b7c8d9 | add_doctor_day_off (doctor_day_offs table) |
| f5a6b7c8d9e0 | add_user_doctor_id (users.doctor_id FK → doctors.id) |

---

## ДИЗАЙН-СИСТЕМА

**Файл токенов:** `frontend/src/app/globals.css`

```
Основной (primary):    #003087  (синий MEDAS)
Акцентный (secondary): #00a982  (зелёный MEDAS)
Tertiary:              #00598a  (голубой)
Фон (background):      #f7f9fb
Поверхность:           #ffffff
Текст основной:        #191c1e
Текст вторичный:       #434655
Outline:               #737686
Outline-variant:       #c3c6d7
Ошибка:                #ba1a1a
```

**CSS-переменные (Tailwind v4 `@theme`):**
```css
--color-primary            → text-primary, bg-primary, border-primary
--color-secondary          → text-secondary, bg-secondary
--color-surface            → bg-surface
--color-on-surface         → text-on-surface
--color-surface-container-lowest → bg-surface-container-lowest (белый)
```

**Шрифты:**
```
--font-headline: Manrope ExtraBold  → font-headline (заголовки)
--font-body:     Inter              → font-body (текст)
```

**Breakpoints (Tailwind default):**
```
sm:  640px
md:  768px
lg:  1024px  ← основной (мобиле vs десктоп)
xl:  1280px
2xl: 1536px
```

**Логотип:**
```
/logo-dark.png  — на светлых фонах (Header, Footer, Login, CabinetLayout)
/logo-light.png — на тёмных фонах (будущие тёмные секции)
ВСЕГДА: <Image src="/logo-dark.png" alt="MEDAS" width={N} height={N} />
НИКОГДА: CSS-имитация логотипа через span/div
```

**CSS-классы (globals.css):**
```
.glass-nav           — стекломорфизм навигации
.hero-gradient       — градиент hero секции
.btn-primary-gradient — градиент кнопки CTA
```

---

## ДЕПЛОЙ

**VPS:** `85.239.44.14` | SSH: `root@85.239.44.14 -i ~/.ssh/server_key`
**URL:** `https://saas.med-as.ru`
**Путь на VPS:** `/app/medas-platform`
**Docker Compose:** `docker-compose.yml` на VPS

### Деплой frontend
```bash
# Rsync source на VPS
rsync -az --exclude='.next' --exclude='node_modules' --exclude='.git' \
  -e "ssh -i ~/.ssh/server_key" \
  ./frontend/ root@85.239.44.14:/app/medas-platform/frontend-src/

# Собрать образ на VPS (не локально — архитектура)
ssh -i ~/.ssh/server_key root@85.239.44.14 \
  "docker build -t medas-frontend:latest /app/medas-platform/frontend-src/"

# Перезапустить
ssh -i ~/.ssh/server_key root@85.239.44.14 \
  "cd /app/medas-platform && docker compose stop frontend && docker compose up -d frontend"
```

### Деплой backend
```bash
# Rsync source
rsync -az --exclude='__pycache__' --exclude='*.pyc' --exclude='.git' \
  -e "ssh -i ~/.ssh/server_key" \
  ./backend/ root@85.239.44.14:/app/medas-platform/backend-src/

# Собрать + перезапустить
ssh -i ~/.ssh/server_key root@85.239.44.14 \
  "docker build -t medas-backend:latest /app/medas-platform/backend-src/ && \
   cd /app/medas-platform && docker compose stop backend && docker compose up -d backend"

# Alembic миграции (PYTHONPATH=/app — обязательно)
ssh -i ~/.ssh/server_key root@85.239.44.14 \
  "docker exec medas-platform-backend-1 sh -c 'cd /app && PYTHONPATH=/app alembic upgrade head'"
```

### Верификация деплоя (обязательно после каждого деплоя)
```bash
# Проверить что новый код в бандле (HTTP 200 ≠ деплой)
ssh -i ~/.ssh/server_key root@85.239.44.14 \
  "docker exec $(docker ps -q -f name=frontend) grep -rl 'УНИКАЛЬНАЯ_СТРОКА' /app/.next/server/chunks/ 2>/dev/null"

# Примеры строк: 'Записаться к врачу', 'Полный чекап', 'Медицинский блог'
```

### SSH на VPS
```bash
ssh -i ~/.ssh/server_key root@85.239.44.14
cd /app/medas-platform
docker compose logs frontend --tail=50
```

---

## ФАЙЛЫ — НЕ ТРОГАТЬ БЕЗ ПРИЧИНЫ

| Файл | Почему осторожно |
|---|---|
| `frontend/src/app/globals.css` | Дизайн-токены всего проекта — изменение сломает все компоненты |
| `frontend/src/app/layout.tsx` | Root layout — шрифты, meta, глобальная структура |
| `frontend/public/logo-dark.png` | Бренд-актив — менять только новыми файлами от Игоря |
| `frontend/public/logo-light.png` | Бренд-актив |
| `deploy.sh` | Рабочий скрипт деплоя — менять осторожно, тестировать перед коммитом |

---

## ВАЖНЫЕ ПАТТЕРНЫ

### Добавление нового компонента главной страницы
```
1. Создать frontend/src/components/home/NewSection.tsx
2. Импортировать в frontend/src/app/page.tsx
3. Добавить в таблицу КОМПОНЕНТЫ ГЛАВНОЙ выше
4. Тестировать на https://saas.med-as.ru
```

### Использование логотипа (ОБЯЗАТЕЛЬНО везде)
```tsx
import Image from "next/image";
// Светлый фон:
<Image src="/logo-dark.png" alt="MEDAS" width={156} height={44} className="object-contain" />
// Тёмный фон:
<Image src="/logo-light.png" alt="MEDAS" width={156} height={44} className="object-contain" />
```

### Цены без переноса строки
```tsx
// ПРАВИЛЬНО — &nbsp; предотвращает перенос внутри числа:
<span className="whitespace-nowrap">25&nbsp;000&nbsp;₽</span>
// НЕПРАВИЛЬНО — "25 000 ₽" может разорваться на мобиле
```

### Клиентский компонент (анимации, состояние)
```tsx
"use client"; // первая строка файла
// Использовать для: StatsSection (IntersectionObserver), Header (drawer)
// НЕ использовать если компонент только рендерит статичный HTML — server component быстрее
```

---

> Этот файл — живой документ. Обновлять после каждой задачи которая добавляет новые компоненты, страницы или меняет архитектуру. При добавлении нового раздела — обновить TOC-таблицу выше.

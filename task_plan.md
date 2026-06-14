# MEDAS — Полный план разработки
**Версия:** 5.2 | **Дата:** 2026-06-13 | **Статус:** 🔄 В работе

---

## Current Phase
Фаза 2 — Авторизация (JWT + mock OTP)

---

## Phases

---

### Фаза 0 — Frontend MVP ✅ complete (2026-06-10 → 2026-06-13)

**Что сделано:**
- Главная страница: Hero, поиск, специализации, топ-клиники, акции, framer-motion анимации
- /search: SearchClient, фильтры специальность/цена/ДМС/онлайн, 9 мок-карточек врачей
- /doctors: hero + 12 специализаций (SVG) + топ-3 врача + «Почему MEDAS» + CTA
- /clinics: список + пагинация 6/стр + поиск по имени + метро + фильтры (ДМС/открыто/рейтинг/специальность)
- /doctor/[slug]: DoctorHero + DoctorContentSections + AppointmentSidebarV2 (календарь+слоты+бонусы) + MobileBookingBar + SimilarDoctors + SEO
- /doctor/[slug]/booking: BookingForm 3 шага + бонусы + экран успеха
- /clinic/[slug]: ClinicHero + ClinicContent 8 секций + ClinicInfoSidebar (расписание/метро/ДМС/сертификаты)
- Shared компоненты: AppointmentCalendar, ReviewCard, AddressMapBlock, StarIcon
- Мок-данные: 3 врача (lib/doctors.ts), 12 клиник (lib/clinics.ts)
- Инфраструктура: VPS (85.239.44.14), SSL (saas.med-as.ru), Docker + Nginx, GitHub CI/CD

**Что НЕ готово (UI-заглушки ⚠️ без реального API):**
- /login — форма есть, JWT нет
- /services — статичный список
- /cabinet/patient (+ /bonuses, /medcard, /family) — UI без данных
- /cabinet/clinic (+ /reports) — UI без данных
- /cabinet/doctor — UI без данных

---

### Фаза 1 — Backend Foundation ✅ complete (2026-06-13)

**Зачем:** без бэкенда все данные — моки. Нельзя показывать клиентам, нельзя принимать реальные записи.
**Критерий готовности:** `GET /api/v1/health` → 200, PostgreSQL запущен, Alembic миграции применены, `GET /api/v1/clinics` → JSON список из БД.

> ⚠️ Домены: `saas.med-as.ru` = ТЕСТОВЫЙ домен для разработки. Продакшн переедет на `med-as.ru`.
> API домен: `api.med-as.ru` (DNS A-record → 85.239.44.14 уже настроен). CORS: оба домена в allow_origins.

#### 1.1 — Структура FastAPI проекта ✅ (2026-06-13)
- [x] Создать `backend/` папку: `app/`, `alembic/`, `scripts/`, `requirements.txt`, `Dockerfile`
- [x] `core/config.py` — Settings (DATABASE_URL, SECRET_KEY, REDIS_URL, CORS_ORIGINS)
- [x] `core/database.py` — async SQLAlchemy engine + AsyncSessionLocal + get_db dependency
- [x] `main.py` — FastAPI app + CORS (saas.med-as.ru + med-as.ru + localhost) + router
- [x] `GET /health` → `{"status": "ok"}`

#### 1.2 — Модели базы данных ✅ (2026-06-13)
- [x] `models/user.py` — User (phone, name, email, hashed_password, is_verified, bonus_balance)
- [x] `models/clinic.py` — Clinic (slug, name, address, metro, rating, review_count, accepts_dms)
- [x] `models/doctor.py` — Doctor (slug, name, specialty, clinic_id, experience, rating, price, is_verified)
- [x] `models/appointment.py` — Appointment (patient_id, doctor_id, clinic_id, service_type, scheduled_at, status, bonuses)
- [x] `models/review.py` — Review (patient_id, doctor_id, clinic_id, rating, text, is_verified)
- [x] `models/bonus.py` — BonusTransaction (user_id, amount, type, appointment_id)
- [x] `alembic/env.py` + `alembic/script.py.mako` — async migrations ready
- [ ] Первая миграция `alembic revision --autogenerate -m "initial_tables"` (на VPS после .env)

#### 1.3 — Docker Compose с backend + PostgreSQL + Redis ✅ (2026-06-13)
- [x] `docker-compose.prod.yml` обновлён: `backend` (medas-backend:latest) + `postgres:16` + `redis:7`
- [x] `backend/Dockerfile`: python:3.12-slim + requirements + uvicorn
- [x] `nginx/conf.d/api.conf`: HTTP → backend:8000 (SSL добавить после certbot)
- [x] VPS: `medas-backend:latest` image собран, postgres:16 + redis:7 образы скачаны
- [ ] Создать `/app/medas-platform/backend.env` и `postgres.env` на VPS (вручную — секреты)
- [ ] `docker compose up -d postgres redis backend && docker compose restart nginx` на VPS

#### 1.4 — CRUD API для клиник и врачей ✅ (2026-06-13)
- [x] `schemas/clinic.py` — ClinicOut, ClinicListOut (Pydantic v2)
- [x] `schemas/doctor.py` — DoctorOut, DoctorListOut
- [x] `api/v1/endpoints/clinics.py` — `GET /api/v1/clinics`, `GET /api/v1/clinics/{slug}`
- [x] `api/v1/endpoints/doctors.py` — `GET /api/v1/doctors?specialty=`, `GET /api/v1/doctors/{slug}`

#### 1.5 — Seed данных + деплой ✅ (2026-06-13)
- [x] `scripts/seed.py` — 5 клиник + 3 врача в PostgreSQL
- [x] VPS: все контейнеры запущены (postgres, redis, backend, frontend, nginx)
- [x] SSL для api.med-as.ru через certbot (истекает 2026-09-11)
- [x] Frontend → API: `lib/api.ts` (fetchClinics/fetchDoctors с revalidate:60)
- [x] `/clinics` и `/search` используют реальные данные из PostgreSQL
- [x] Alembic baseline: revision 77dbb05f7c23 stamped head

#### 1.6 — Доработки (текущая сессия)
- [ ] **Т1**: `lib/api.ts` — fetchList возвращает null на ошибке (логировать + правильный fallback)
- [ ] **Т2**: VPS crontab — auto-renewal certbot 1-го и 15-го числа в 3:00

---

### Фаза 2 — Авторизация (JWT + mock OTP) ✅ complete (2026-06-13)

**Зачем:** без реального входа нельзя брать реальные записи, нельзя показывать кабинет.
**Критерий готовности:** POST /auth/register → code "123456" → POST /auth/verify-otp → JWT → /cabinet/* защищён middleware.
**MVP-упрощение:** OTP = "123456" для всех (реальный SMS — Фаза 4). Cookie — обычный (не httpOnly, т.к. middleware.ts читает его).

#### 2.1 — Backend JWT Auth (**Т3**)
- [ ] `backend/requirements.txt` — добавить `python-jose[cryptography]`
- [ ] `backend/app/core/security.py` (NEW):
  - `create_access_token(user_id, phone, expires_delta=7дней)` → str
  - `verify_token(token)` → dict payload | None
- [ ] `backend/app/schemas/auth.py` (NEW) — Pydantic v2:
  - `RegisterRequest(phone, name)`, `LoginRequest(phone)`
  - `OTPVerifyRequest(phone, code)`, `TokenResponse(access_token, token_type="bearer")`
  - `UserResponse(id, phone, name, bonus_balance)`
- [ ] `backend/app/api/v1/endpoints/auth.py` (NEW):
  - `POST /auth/register` → upsert User → return `{"code": "123456"}`
  - `POST /auth/login` → find User → return `{"code": "123456"}` (404 if not found)
  - `POST /auth/verify-otp` → if code=="123456" → return TokenResponse(JWT)
  - `GET /auth/me` → decode Bearer → return UserResponse
- [ ] `backend/app/api/v1/router.py` — include auth_router

#### 2.2 — Frontend middleware + auth utils (**Т3 продолжение**)
- [ ] `frontend/src/lib/auth.ts` (NEW) — setToken/getToken/clearToken/isAuthenticated (cookie)
- [ ] `frontend/src/middleware.ts` (NEW) — читать cookie "medas_token", redirect → /login?next=... для /cabinet/*
- [ ] Matcher: `['/cabinet/:path*']`

#### 2.3 — (Фаза 4) Реальный SMS + httpOnly
- [ ] SMSC.ru или Twilio интеграция
- [ ] Redis TTL для OTP кодов
- [ ] Переключить cookie на httpOnly + refresh token

---

### Фаза 3 — Реальное бронирование 🔄 in_progress

**Зачем:** главная ценность продукта — реальная запись к врачу, а не форма-заглушка.
**Критерий готовности:** пациент записывается через сайт → запись видна в /cabinet/clinic.

#### Т1 — DoctorSchedule модель + миграция + seed (backend)
- [ ] `backend/app/models/schedule.py` (NEW) — DoctorSchedule(id, doctor_id FK, weekday int 0-6, start_time Time, end_time Time, slot_duration_min int=30)
- [ ] `backend/app/models/__init__.py` — добавить import DoctorSchedule
- [ ] Alembic: `alembic revision --autogenerate -m "add_doctor_schedule"` → `alembic upgrade head`
- [ ] `backend/scripts/seed.py` — добавить расписание для 3 врачей: Пн-Пт (0-4), 09:00-18:00, 30 мин

#### Т2 — Slots endpoint + schedule service (backend)
- [ ] `backend/app/schemas/appointment.py` (NEW) — SlotOut(time: str, available: bool)
- [ ] `backend/app/services/schedule_service.py` (NEW) — get_available_slots(db, doctor_id, date) → list[SlotOut]: генерирует слоты из расписания, убирает занятые из appointments таблицы
- [ ] `backend/app/api/v1/endpoints/doctors.py` — добавить `GET /api/v1/doctors/{slug}/slots?date=YYYY-MM-DD`

#### Т3 — get_current_user + Appointments endpoint (backend)
- [ ] `backend/app/core/deps.py` (NEW) — `get_current_user(credentials, db)` → User (переиспользуемая зависимость)
- [ ] `backend/app/schemas/appointment.py` (дополнить) — AppointmentCreate(doctor_slug, scheduled_at, service_type, use_bonuses, notes), AppointmentOut(id, doctor_name, clinic_name, scheduled_at, service_type, status, price, bonuses_used, bonuses_earned)
- [ ] `backend/app/api/v1/endpoints/appointments.py` (NEW):
  - `POST /api/v1/appointments` — resolve doctor_slug→doctor_id, списать бонусы если use_bonuses (min(balance, floor(price*0.1))), создать Appointment status=pending
  - `GET /api/v1/appointments/my` — записи текущего пользователя с JOIN doctor+clinic
  - `PATCH /api/v1/appointments/{id}/cancel` — status→cancelled если patient_id совпадает
- [ ] `backend/app/api/v1/router.py` — include appointments router

#### Т4 — Frontend: BookingForm реальный submit + реальные слоты
- [ ] `frontend/src/lib/api.ts` — добавить fetchSlots(slug, date), createAppointment(payload, token), fetchMyAppointments(token)
- [ ] `frontend/src/components/doctor/booking/BookingForm.tsx` — handleSubmit: POST /appointments с Bearer JWT; показывать реальный bonus_balance из /auth/me (убрать хардкод BONUS_BALANCE=1500)
- [ ] `frontend/src/components/doctor/v2/AppointmentSidebarV2.tsx` — загружать слоты из GET /doctors/{slug}/slots при смене дня

#### Т5 — Frontend: /cabinet/patient реальные записи
- [ ] `frontend/src/components/cabinet/PatientAppointments.tsx` (NEW client component) — getToken() → GET /appointments/my → рендер списка записей (заменяет хардкод в patient/page.tsx)
- [ ] `frontend/src/app/cabinet/patient/page.tsx` — заменить mock appointments на <PatientAppointments />

#### Т6 — Deploy
- [ ] rsync backend + frontend → VPS
- [ ] docker build medas-backend:latest (с новыми пакетами если нужны)
- [ ] Alembic upgrade head на VPS
- [ ] docker build medas-frontend:latest → docker restart
- [ ] Smoke test: POST /appointments curl → GET /appointments/my → проверить /cabinet/patient

---

### Фаза 3 доработки — Индекс, бонусы, доступные дни 🔄 in_progress

**Зачем:** производительность (индекс), корректность бонусной программы, UX календаря.
**Критерий готовности:** GET /appointments/my быстро, PATCH /complete начисляет бонусы, календарь подсвечивает рабочие дни врача.

#### T7 — Alembic миграция: индекс на appointments.patient_id
- [ ] `backend/alembic/versions/c2d3e4f5a6b7_add_appointments_patient_index.py` (NEW)
  - down_revision = "a3f8c2d1e5b9"
  - `op.create_index("ix_appointments_patient_id", "appointments", ["patient_id"])`
- Verify: `alembic upgrade head` → INFO Running upgrade a3f8c2d1e5b9 → c2d3e4f5a6b7

#### T8 — PATCH /appointments/{id}/complete + начисление бонусов
- [ ] `backend/app/api/v1/endpoints/appointments.py` — добавить endpoint:
  - Загрузить Appointment по ID (любой авторизованный — MVP без ролей)
  - Если уже completed/cancelled → 400
  - `apt.status = "completed"`
  - `apt.bonuses_earned = round(apt.price * 0.05)`
  - Загрузить пациента `select(User).where(User.id == apt.patient_id)` → `patient.bonus_balance += apt.bonuses_earned`
  - commit + return AppointmentOut
- Verify: curl PATCH /appointments/1/complete → status=completed, bonuses_earned=..., GET /auth/me → bonus_balance увеличился

#### T9 — GET /doctors/{slug}/available-days?month=YYYY-MM (backend)
- [ ] `backend/app/api/v1/endpoints/doctors.py` — новый endpoint:
  - Парсить `month=YYYY-MM` → year, month
  - Получить doctor по slug
  - Получить DoctorSchedule для doctor → set weekdays (0-4 обычно)
  - Для каждого дня в месяце: if weekday in schedules_set and date >= today → добавить в список
  - Вернуть `list[str]` ("YYYY-MM-DD")
- Verify: curl /doctors/maria-kozlova/available-days?month=2026-06 → список дат (только Пн-Пт)

#### T10 — Frontend: fetchAvailableDays + AppointmentSidebarV2
- [ ] `frontend/src/lib/api.ts` — добавить `fetchAvailableDays(slug, month): Promise<number[]>`
  - GET /doctors/{slug}/available-days?month={month} → парсить в номера дней
- [ ] `frontend/src/components/doctor/v2/AppointmentSidebarV2.tsx`:
  - Добавить state `availableDays: Set<number>` 
  - useEffect при mount + при смене viewYear/viewMonth → вызвать loadAvailableDays
  - Передать `availableDays={availableDays}` в `<AppointmentCalendar>`
- AppointmentCalendar уже поддерживает этот prop — изменений в нём нет

#### T11 — Deploy
- [ ] rsync backend → docker build medas-backend → alembic upgrade head (миграция c2d3e4f5a6b7)
- [ ] rsync frontend → docker build medas-frontend → docker compose up -d
- [ ] Smoke test: curl /doctors/maria-kozlova/available-days?month=2026-06, PATCH /appointments/.../complete

---

### Фаза ЛК клиники 🔄 in_progress

**Зачем:** клиника видит входящие записи и управляет ими — подтверждает, завершает, отменяет.
**Критерий готовности:** GET /appointments/clinic → реальный список; кнопки Принять/Завершить/Отменить работают.

**Архитектурное решение (принято):**
- Appointment.clinic_id уже есть в БД → миграция НЕ нужна
- MVP без ролей: clinic_id=1 hardcode в frontend (первая клиника в seed)
- Новая схема ClinicAppointmentOut = AppointmentOut + patient_name

#### C1 — Backend: GET /appointments/clinic?clinic_id= + PATCH /confirm
- [ ] `backend/app/schemas/appointment.py` — добавить `ClinicAppointmentOut(AppointmentOut + patient_name: str)`
- [ ] `backend/app/api/v1/endpoints/appointments.py`:
  - `GET /appointments/clinic?clinic_id=N` (auth required): SELECT Appointment WHERE clinic_id=N + JOIN User(patient) + JOIN Doctor → ClinicAppointmentOut[]
  - `PATCH /appointments/{id}/confirm` (auth required): status pending → confirmed
- Verify: curl GET /appointments/clinic?clinic_id=1 → список с patient_name

#### C2 — Frontend: fetchClinicAppointments + confirmAppointment
- [ ] `frontend/src/lib/api.ts`:
  - `interface ClinicAppointmentOut` (extends AppointmentOut + patient_name)
  - `fetchClinicAppointments(clinicId, token)` → `ClinicAppointmentOut[]`
  - `confirmAppointment(id, token)` → `AppointmentOut | null`
- Verify: tsc --noEmit без ошибок

#### C3 — Frontend: ClinicAppointments client component
- [ ] `frontend/src/components/cabinet/ClinicAppointments.tsx` (NEW, "use client"):
  - Props: `clinicId: number`
  - Загружает GET /appointments/clinic?clinic_id=clinicId
  - Табличный вид (аналог mock-таблицы в clinic/page.tsx, но с реальными данными)
  - Статус pending → кнопки "Принять" (confirm) + "Отклонить" (cancel)
  - Статус confirmed → кнопка "Завершить" (complete)
  - Статус completed/cancelled → только бейдж
  - Фильтр: "Сегодня" / "Неделя" / "Все"
- Verify: компонент рендерится без ошибок, данные из API

#### C4 — Frontend: clinic/page.tsx → реальные данные
- [ ] `frontend/src/app/cabinet/clinic/page.tsx`:
  - Убрать `const leads = [...]`
  - Добавить import `ClinicAppointments`
  - Заменить секцию "Входящие записи" (mock-таблица) на `<ClinicAppointments clinicId={1} />`
  - KPI-карточки оставить (mock статистика — данные для дашборда в следующей фазе)
- Verify: tsc --noEmit, страница /cabinet/clinic отображает реальные записи

#### C5 — Deploy
- [ ] rsync backend → docker build medas-backend
- [ ] rsync frontend → docker build medas-frontend
- [ ] docker compose stop/up (без alembic — миграции нет)
- [ ] Smoke test: curl GET /appointments/clinic?clinic_id=1 + проверить /cabinet/clinic в браузере

---

### Фаза 4 — Уведомления (Email + SMS)

**Зачем:** без уведомлений пациенты забывают о записях (no-show rate 30%+).
**Критерий готовности:** после записи пациент получает SMS, за 24ч — напоминание.

- [ ] `services/notification_service.py` — send_sms(phone, text), send_email(to, subject, html)
- [ ] SMS-провайдер: SMSC.ru (интеграция через HTTP API)
- [ ] Email: SMTP через Yandex или SendGrid
- [ ] Шаблоны: подтверждение записи, напоминание за 24ч, напоминание за 2ч, отмена
- [ ] Celery + Redis: задача `send_reminder` в очереди (запуск за 24ч до приёма)
- [ ] `docker-compose.yml`: добавить service `celery-worker`
- [ ] Верификация: сделать тестовую запись → получить SMS

---

### Фаза 5 — Личные кабинеты (реальные данные)

**Зачем:** без кабинета клиники не могут управлять записями → не будут пользоваться платформой.
**Критерий готовности:** клиника видит входящие записи, может подтвердить/отменить.

#### 5.1 — Кабинет пациента
- [ ] Подключить `/cabinet/patient` к `GET /api/v1/appointments/my`
- [ ] `/cabinet/patient/bonuses` — реальная история бонусов из BonusTransaction
- [ ] `/cabinet/patient/medcard` — базовая медкарта (пол, дата рождения, аллергии, хронические)
- [ ] `/cabinet/patient/family` — добавить члена семьи + записать от его имени

#### 5.2 — Кабинет клиники
- [ ] Регистрация клиники: отдельный флоу (заявка → проверка → активация)
- [ ] `/cabinet/clinic` — дашборд: записи сегодня, записи на неделю, доход за месяц
- [ ] `/cabinet/clinic/schedule` — управление расписанием врачей
- [ ] `/cabinet/clinic/doctors` — добавить/редактировать врача клиники
- [ ] Подтверждение/отмена записи клиникой

#### 5.3 — Кабинет врача
- [ ] `/cabinet/doctor` — расписание на неделю + записи на сегодня
- [ ] Заметки о пациенте (краткий анамнез)

---

### Фаза 6 — Контент: блог, симптомы, /about

**Зачем:** SEO-трафик. «Болит голова» → статья → «Запишитесь к неврологу» → бронирование.
**Критерий готовности:** /articles открывается, 5 статей, каждая ведёт на врача нужной специальности.

- [ ] `models/article.py` — Article (slug, title, excerpt, content_html, specialty, readTime, publishedAt)
- [ ] `GET /api/v1/articles?specialty=` + `GET /api/v1/articles/{slug}`
- [ ] Страница `/articles` — список статей + фильтр по специальности
- [ ] Страница `/articles/[slug]` — статья + виджет «Врачи по теме» + CTA запись
- [ ] Страница `/symptoms` — поиск по симптому → список специалистов
- [ ] Страница `/about` — о платформе, команда, миссия
- [ ] Страница `/register` — форма регистрации пациента (подключена к Фазе 2)
- [ ] SEO: schema.org/Article, OpenGraph для каждой статьи

---

### Фаза 7 — Монетизация (ЮKassa + бонусная программа)

**Зачем:** без оплаты онлайн платформа не зарабатывает.
**Критерий готовности:** пациент оплачивает запись картой → деньги поступают на счёт клиники минус комиссия MEDAS.

- [ ] Интеграция ЮKassa: `POST /api/v1/payments/create` → redirect на оплату → webhook подтверждения
- [ ] После оплаты: статус записи → confirmed, начислить бонусы
- [ ] Сплит-оплата: 90% клинике, 10% MEDAS (ЮKassa поддерживает маршрутизацию)
- [ ] Реальная бонусная программа: BonusTransaction в БД (не localStorage)
- [ ] 4 уровня лояльности: Стандарт (5%) / Серебро (7%) / Золото (9%) / Платина (12%)
- [ ] Реферальная программа: уникальная ссылка → 200 бонусов за каждого пришедшего

---

### Фаза 8 — Расширенный поиск

**Зачем:** pg_trgm медленный при 1000+ клиниках. Хороший поиск = главное конкурентное преимущество.

- [ ] Подключить `pg_trgm` расширение PostgreSQL → полнотекстовый поиск по врачам/клиникам
- [ ] `/search` версия 2: табы «Врачи / Клиники» + поиск по симптому (через mapping симптом → специальность)
- [ ] Геопоиск: «Рядом со мной» через browser geolocation + PostGIS расстояние
- [ ] Автодополнение в поиске (debounce 300ms → `GET /api/v1/search/suggest?q=`)
- [ ] Фильтр по карте: Яндекс.Карты с маркерами клиник (lat/lng в модели Clinic)

---

### Фаза 9 — Онлайн-консультации + мобильное приложение (Фаза 3, долгосрочно)

**Зачем:** следующий уровень после MVP. Требует значительных ресурсов.

- [ ] Онлайн-консультации: Agora.io WebRTC (видео), чат внутри платформы
- [ ] Загрузка документов в медкарту (AWS S3 или Yandex Object Storage)
- [ ] React Native мобильное приложение (iOS + Android)
- [ ] Интеграция с ДМС-системами
- [ ] Корпоративные клиенты B2B (ДМС для сотрудников компаний)
- [ ] Kubernetes при нагрузке > 10k DAU

---

## Decisions

| # | Решение | Обоснование |
|---|---|---|
| 1 | Backend — первый приоритет после Frontend MVP | Без реального API нельзя показывать продукт клиентам и начать продажи |
| 2 | FastAPI (async) + PostgreSQL + Alembic | Async нужен для I/O-bound задач; Alembic — единственный правильный путь миграций |
| 3 | JWT в httpOnly cookie, не localStorage | Защита от XSS; refresh token с ротацией |
| 4 | Redis для SMS-кодов (TTL 10 мин) + Celery для уведомлений | SMS-коды не нужны в PostgreSQL; Celery — стандарт для background tasks в Python |
| 5 | Новые фронтенд-страницы — после Фазы 2 (Auth) | Страницы /register, /articles, /symptoms не имеет смысла делать без реального бэкенда |
| 6 | ЮKassa сплит-оплата | Поддерживает маршрутизацию платежей — не нужно делать это вручную |
| 7 | Seed script вместо ручного заполнения | Воспроизводимость; можно сбросить и наполнить заново |
| 8 | Не трогать фронтенд-компоненты до Фазы 1 готова | Нет смысла делать новые UI-страницы пока API не существует |

---

## Errors Encountered

| Время | Ошибка | Статус |
|---|---|---|
| — | — | — |

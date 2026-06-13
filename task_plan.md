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

### Фаза 2 — Авторизация (JWT + mock OTP) 🔄 in_progress

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

### Фаза 3 — Реальное бронирование

**Зачем:** главная ценность продукта — реальная запись к врачу, а не форма-заглушка.
**Критерий готовности:** пациент записывается через сайт → запись видна в /cabinet/clinic.

#### 3.1 — Расписание врачей
- [ ] `models/schedule.py` — DoctorSchedule (doctor_id, weekday, start_time, end_time, slot_duration_min)
- [ ] `models/appointment.py` — добавить поле `datetime` + UNIQUE constraint (doctor_id, datetime)
- [ ] `services/schedule_service.py` — get_available_slots(doctor_id, date) → список свободных слотов
- [ ] `GET /api/v1/doctors/{slug}/slots?date=2026-06-15` → [{time: "10:00", available: true}, ...]
- [ ] Seed: добавить расписание для 3 врачей (Пн-Пт, 09:00-18:00, 30-мин слоты)

#### 3.2 — API записи
- [ ] `POST /api/v1/appointments` (requires auth) — создать запись (doctor_id, slot, service, use_bonuses)
- [ ] Логика бонусов: если use_bonuses → списать до 10% от цены, начислить 5% после визита
- [ ] `GET /api/v1/appointments/my` (requires auth) — мои записи (пациент)
- [ ] `GET /api/v1/appointments/clinic` (requires clinic_admin) — записи клиники
- [ ] `PATCH /api/v1/appointments/{id}/cancel` — отмена записи

#### 3.3 — Фронтенд: подключить BookingForm к API
- [ ] Заменить mock submit в `BookingForm.tsx` на `POST /api/v1/appointments`
- [ ] Получать реальные слоты из `GET /api/v1/doctors/{slug}/slots`
- [ ] Показывать реальный баланс бонусов из API (не хардкод 1500)
- [ ] Страница /cabinet/patient — реальный список записей из `GET /api/v1/appointments/my`

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

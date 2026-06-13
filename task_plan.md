# MEDAS — Полный план разработки
**Версия:** 5.0 | **Дата:** 2026-06-13 | **Статус:** 🔄 В работе

---

## Current Phase
Фаза 1 — Backend Foundation (FastAPI + PostgreSQL)

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

### Фаза 1 — Backend Foundation 🔄 in_progress

**Зачем:** без бэкенда все данные — моки. Нельзя показывать клиентам, нельзя принимать реальные записи.
**Критерий готовности:** `GET /api/v1/health` → 200, PostgreSQL запущен, Alembic миграции применены, `GET /api/v1/clinics` → JSON список из БД.

#### 1.1 — Структура FastAPI проекта
- [ ] Создать `backend/` папку: `app/`, `alembic/`, `tests/`, `requirements.txt`, `Dockerfile`, `pyproject.toml`
- [ ] Структура `app/`: `main.py`, `core/` (config, database, security), `models/`, `schemas/`, `services/`, `api/v1/endpoints/`
- [ ] `core/config.py` — Settings через pydantic-settings (DATABASE_URL, SECRET_KEY, REDIS_URL, SMS_API_KEY)
- [ ] `core/database.py` — async SQLAlchemy engine + SessionLocal + get_db dependency
- [ ] `main.py` — FastAPI app + CORS + `/api/v1` router + lifespan (connect/disconnect DB)
- [ ] `GET /api/v1/health` → `{"status": "ok", "version": "1.0.0"}`

#### 1.2 — Модели базы данных
- [ ] `models/user.py` — User (id, phone, email, name, role: patient|clinic_admin|doctor|admin, is_verified, created_at)
- [ ] `models/clinic.py` — Clinic (id, slug, name, address, metro, phone, email, rating, acceptsDMS, is_verified, owner_id)
- [ ] `models/doctor.py` — Doctor (id, slug, name, specialty, clinic_id, experience, rating, price, is_verified)
- [ ] `models/appointment.py` — Appointment (id, patient_id, doctor_id, clinic_id, datetime, status, service, price, bonuses_used, bonuses_earned)
- [ ] `models/review.py` — Review (id, patient_id, doctor_id, clinic_id, rating, text, is_verified, created_at)
- [ ] `models/bonus.py` — BonusTransaction (id, user_id, amount, type: earn|spend, appointment_id, created_at)
- [ ] Alembic: `alembic init alembic`, `env.py`, первая миграция `0001_initial_tables`

#### 1.3 — Docker Compose с backend + PostgreSQL + Redis
- [ ] Обновить `docker-compose.yml`: добавить services `backend`, `postgres`, `redis`
- [ ] `backend/Dockerfile`: `python:3.12-slim`, копировать requirements, `uvicorn app.main:app`
- [ ] Переменные окружения: `DATABASE_URL=postgresql+asyncpg://medas:pass@postgres:5432/medas`
- [ ] Nginx: добавить upstream `backend:8000`, роутинг `/api/` → backend
- [ ] `docker-compose.prod.yml` — для VPS (volumes для postgres data)

#### 1.4 — CRUD API для клиник и врачей (из БД, без авторизации)
- [ ] `schemas/clinic.py` — ClinicOut, ClinicList (Pydantic v2)
- [ ] `schemas/doctor.py` — DoctorOut, DoctorList
- [ ] `services/clinic_service.py` — get_clinics(filters), get_clinic_by_slug()
- [ ] `services/doctor_service.py` — get_doctors(filters), get_doctor_by_slug()
- [ ] `api/v1/endpoints/clinics.py` — `GET /api/v1/clinics?specialty=&dms=&metro=&page=`
- [ ] `api/v1/endpoints/doctors.py` — `GET /api/v1/doctors?specialty=&price_max=&page=`
- [ ] `api/v1/endpoints/clinics.py` — `GET /api/v1/clinics/{slug}`
- [ ] `api/v1/endpoints/doctors.py` — `GET /api/v1/doctors/{slug}`

#### 1.5 — Seed данных + деплой
- [ ] `scripts/seed.py` — загрузить в БД 12 клиник и 3 врачей из текущих моков
- [ ] Деплой: docker compose up -d на VPS
- [ ] Верификация: `curl https://saas.med-as.ru/api/v1/health` → 200
- [ ] Верификация: `curl https://saas.med-as.ru/api/v1/clinics` → JSON массив
- [ ] Frontend: заменить импорты из `lib/clinics.ts` на `fetch('/api/v1/clinics')` в нужных местах

---

### Фаза 2 — Авторизация (JWT + SMS)

**Зачем:** без реального входа нельзя брать реальные записи, нельзя показывать кабинет.
**Критерий готовности:** реальный вход через форму → JWT в cookie → защищённый endpoint отвечает 200.

#### 2.1 — JWT авторизация
- [ ] `core/security.py` — create_access_token, create_refresh_token, verify_token (python-jose)
- [ ] `models/user.py` — добавить поле `hashed_password` (для email-входа) + `phone_verified`
- [ ] `api/v1/endpoints/auth.py`:
  - `POST /api/v1/auth/send-sms` — отправить SMS-код на телефон (через SMSC.ru или Twilio)
  - `POST /api/v1/auth/verify-sms` — проверить код → выдать JWT + refresh
  - `POST /api/v1/auth/refresh` — обновить access token по refresh
  - `POST /api/v1/auth/logout` — инвалидировать refresh (в Redis)
- [ ] `dependencies/auth.py` — `get_current_user` dependency (декодирует JWT из Bearer)
- [ ] Redis: хранить SMS-коды с TTL 10 мин (`sms:{phone}` → code)

#### 2.2 — Регистрация пациента
- [ ] `POST /api/v1/auth/register` — создать User(phone, name, role=patient) + отправить SMS
- [ ] Страница `/register` на фронтенде: форма имя + телефон + код + согласие
- [ ] Страница `/login` — реальный запрос к API (не заглушка)
- [ ] Хранить JWT в httpOnly cookie (не localStorage — безопасность)
- [ ] Редирект после входа: пациент → /cabinet/patient, клиника → /cabinet/clinic

#### 2.3 — Защищённые endpoints
- [ ] `GET /api/v1/me` — профиль текущего пользователя (requires auth)
- [ ] Middleware: проверка JWT для всех `/cabinet/*` маршрутов на фронте (Next.js middleware.ts)
- [ ] Обновить `Header.tsx` — показывать имя пользователя + баланс бонусов если авторизован

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

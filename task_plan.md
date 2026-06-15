# MEDAS — Полный план разработки
**Версия:** 7.0 | **Дата:** 2026-06-15 | **Статус:** 🔄 В работе

---

## Current Phase
**Этап 3 — ЛК Врача: реальные данные** (активен с 2026-06-15)

Порядок: Э3-1 (миграция doctor_id в User + seed врача) → Э3-2 (GET /appointments/doctor endpoint) → деплой backend → Э3-3 (frontend /cabinet/doctor) → деплой frontend

Критерий готовности: врач (+70000000002) входит и видит свои записи в /cabinet/doctor с реальными данными.

---

## Phases

---

### Фаза Д — Дашборд клиники (улучшения) 🔄 in_progress (2026-06-14)

**Зачем:** обогатить дашборд клиники данными из Stitch — воронка пациентов + 5-я KPI + таблица врачей.

**Критерий готовности:** воронка и 5-я KPI карточка отображаются в /cabinet/clinic с реальными данными.

#### Д1 — Backend stats расширить + Frontend воронка + 5-я KPI
Status: complete
Done: Backend +4 поля в ClinicStats (bonus_used, confirmed_month, completed_month, bonuses_applied_month), PatientFunnel компонент (4 шага: 102→96→90→0), 5-я KPI карточка Бонусы, KPI grid grid-cols-2 lg:grid-cols-4. Коммит f2842c6.

#### Д2 — Таблица врачей (апгрейд DoctorLoad)
Status: complete
Done: DoctorLoadItem +month_count (backend schema + SQL), DoctorLoad bar chart → таблица Врач/Сегодня/Месяц/Загрузка%. Коммит 904eaff.

#### Д3 — Страница /cabinet/clinic/reports
Status: complete
Done: GET /clinic/analytics endpoint (ClinicAnalytics schema — ServiceTypeStat + DoctorRevenueStat), reports/page.tsx → "use client" с реальными KPI / по типу приёма / бонусы / таблица врачей. Коммит e15e120.

---

### Фаза Л — Логотипы SVG + Favicon ✅ complete (2026-06-14)

**Что сделано:** коммиты 8660bda, 6ae7eee, 31f8b1c

#### Л1 — SVG в public/logos/ + nginx volume
Status: complete
Done: rsync на VPS, nginx force-recreate, /logos/ → 200

#### Л2 — Favicon + app icons
Status: complete
Done: icon.svg + apple-icon.png в src/app/

#### Л3 — Логотип в .tsx компонентах
Status: complete
Done: shared Logo компонент + Header/Footer/CabinetLayout/LoginForm обновлены

#### Л4 — Stitch preview pages
Status: complete
Done: 15 файлов, 30 замен, rsync на VPS

#### Л5 — Deploy + verify
Status: complete
Done: git push 31f8b1c, /logos/ → 200, /icon.svg → 200

---

### Фаза Л — Логотипы SVG + Favicon 🔄 in_progress (2026-06-15)

**Зачем:** заменить PNG-заглушки реальными SVG-логотипами MEDAS во всех компонентах и настроить favicon для браузеров и мобильных устройств.

**Критерий готовности:** логотип отображается в Header/Footer/Login/Cabinet через SVG, в browser tab — правильный favicon, apple-touch-icon корректен.

#### Л1 — Скопировать SVG в public/logos/ + nginx volume
Status: pending
- [ ] Создать `frontend/public/logos/`
- [ ] Скопировать: Medas_gor_b.svg, Medas_gor_w.svg, Medas_gor_bez_podlojki_b.svg, Medas_gor_bez_podlojki_w.svg, 02.1_deep_blue_clean.svg
- [ ] VPS: создать `/app/medas-platform/logos/` + rsync SVG туда
- [ ] docker-compose.yml: добавить logos volume в nginx (аналогично stitch)
- [ ] medas.conf: добавить `location /logos/` → alias на volume
- [ ] Перезапустить nginx (force-recreate не нужен, только reload)

#### Л2 — Favicon + app icons
Status: pending
- [ ] Скопировать `02.1_deep_blue_clean.svg` → `frontend/src/app/icon.svg` (Next.js favicon)
- [ ] Скопировать `02.1_deep_blue_clean.png` → `frontend/src/app/apple-icon.png` (apple-touch-icon)
- [ ] Обновить `layout.tsx` metadata: добавить `icons` с favicon SVG + apple-icon
- Done: N/A

#### Л3 — Заменить логотип в .tsx компонентах
Status: pending
Файлы (все 4 используют `/logo-dark.png` → заменить на `/logos/Medas_gor_b.svg`):
- [ ] `src/app/login/LoginForm.tsx:106` → светлый фон → Medas_gor_b.svg
- [ ] `src/components/layout/CabinetLayout.tsx:67` → sidebar светлый → Medas_gor_b.svg
- [ ] `src/components/layout/Header.tsx:18` → header светлый → Medas_gor_b.svg
- [ ] `src/components/layout/Footer.tsx:10` → проверить фон → b или w версия

Примечание: `<Image>` с SVG требует prop `unoptimized` (Next.js не оптимизирует SVG)

#### Л4 — Stitch preview pages (bulk find/replace)
Status: pending
- [ ] Заменить `lh3.googleusercontent.com/...` logo URLs в 16 HTML файлах на `/logos/Medas_gor_b.svg`
- [ ] rsync обновлённых HTML → VPS `/app/medas-platform/stitch/`

#### Л5 — Deploy + verify
Status: pending
- [ ] git commit + push всех изменений
- [ ] `curl https://saas.med-as.ru/logos/Medas_gor_b.svg` → 200
- [ ] Визуальная проверка Header на сайте
- [ ] Проверить favicon в browser tab

**Решения:**
- SVG в nginx (не в docker image) → чтобы не пересобирать образ: аналогично stitch approach
- `<Image unoptimized>` для SVG (Next.js требует это для SVG)
- Favicon: `src/app/icon.svg` → Next.js App Router auto-picks, но это проявится при следующей сборке образа
- До сборки: `favicon.ico` остаётся текущий (приемлемо, не критично)

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

### Фаза Д — Дашборд клиники (редизайн + фиксы) 🔄 in_progress

**Зачем:** дашборд показывал пустой график, сломанный truncate в сайдбаре, портянку без пагинации, фиктивные KPI. Нужен редизайн по Stitch Вариант 1 + реальные данные.
**Критерий готовности:** `/cabinet/clinic` — KPI реальные, «Расписание на день» таймлайн отображает сегодняшние записи, график рисует столбцы, имя клиники выровнено, врачи top-5, пагинация 20/стр.

#### Д1 — CabinetLayout: фикс user info + headerAction prop
Status: complete
Done: user info перенесён вниз сайдбара (min-w-0 flex-1 + truncate работает), добавлен prop headerAction, активный nav = синий bg. Коммит 19fab7d.

#### Д2 — clinic/page.tsx: редизайн по Stitch v2 + аудит конкурентов
Status: complete
Done: KPI text-4xl + бейджи тренда, тёмный градиент-график (абсолютные px высоты, фикс пустого блока), врачи max-h-56 + overflow-y-auto, кнопка «Новая запись» в хедере. Коммит 19fab7d.

#### Д3 — ClinicAppointments: пагинация 20/стр
Status: complete
Done: PAGE_SIZE=20, paginated useMemo, пагинатор с номерами страниц, «X–Y из N», сброс page при смене фильтра. Коммит 19fab7d.

#### Д4 — /test (пост-деплой проверка .tsx)
Status: pending

#### Д5 — /simplify (3 файла, 200+ строк)
Status: pending

**Критерий готовности Фазы Д — ВЫПОЛНЕН ✅** (2026-06-14, коммит b6ff5ea)

#### Д6 — Фикс CabinetLayout: выравнивание имени клиники (sidebar)
Status: complete
Done: px-2 → px-4 в user info блоке. Коммит b6ff5ea.
- Проблема: padding сайдбарного user info (px-2) не совпадает с nav items (px-4) → визуальный сдвиг влево
- Фикс: `px-2` → `px-4` в блоке user info + оставить min-w-0 flex-1 truncate
- Файл: `frontend/src/components/layout/CabinetLayout.tsx` (строки 98-115)

#### Д7 — Фикс backend: revenue_by_day пустой
Status: complete
Done: status filter IN('confirmed','completed') → status != 'cancelled'. revenue_by_day: 22 дня с данными. Коммит b6ff5ea.
- Причина: запрос фильтрует `status IN ('confirmed', 'completed')`, seed-записи — pending
- Фикс: изменить фильтр на `status != 'cancelled'` для 30-дневного графика
- Файл: `backend/app/api/v1/endpoints/appointments.py` (строка ~294-303)
- Verify: curl /appointments/clinic/stats → revenue_by_day содержит ненулевые значения

#### Д8 — «Расписание на день» таймлайн + редизайн clinic/page.tsx
Status: complete
Done: KPI(3) → DayTimeline/NewRequests(2-col) → RevenueChart/DoctorLoad → ClinicAppointments. DoctorLoad top-5+collapse. Коммит b6ff5ea.
- Новый layout: KPI (3 карточки) → [Таймлайн 60% | Новые заявки 40%] → [График | Врачи] → Таблица
- Таймлайн: фильтрует сегодняшние записи из `fetchClinicAppointments`, сортирует по времени
- Карточка слота: время (HH:MM) + имя пациента + врач + специальность + статус-бейдж
- Статусы: pending="ОЖИДАЕТСЯ" (серый), confirmed="ПОДТВЕРЖДЁН" (синий), completed="ЗАВЕРШЁН" (зелёный)
- Врачи: показывать max 5 (сортировка по % загрузки убыванию), остальные за «Ещё N врачей»
- Файл: `frontend/src/app/cabinet/clinic/page.tsx`
- Verify: /cabinet/clinic рендерится, таймлайн отображает записи на сегодня

#### Д9 — Deploy (backend фикс + frontend редизайн)
Status: complete
Done: rsync→build→restart. Smoke: /health 200, revenue_by_day 22 дня, /cabinet/clinic 307. Коммит b6ff5ea.
- rsync backend → docker build medas-backend (без alembic — нет новых миграций)
- rsync frontend → docker build medas-frontend:latest
- docker compose stop/up
- Smoke test: curl /appointments/clinic/stats → revenue_by_day непустой; /cabinet/clinic открывается

---

### Фаза Роли — role + clinic_id в User 🔄 in_progress

**Зачем:** без роли любой авторизованный видит все записи всех клиник. С ролью — только своя клиника.
**Критерий готовности:** GET /appointments/clinic без role=clinic → 403; пользователь-клиника видит только свои записи; /auth/me возвращает role + clinic_id.

**Решения принятые заранее:**
- role хранится как String("patient"|"clinic"|"doctor"), default="patient"
- clinic_id в User — nullable FK на clinics.id
- Seed создаёт admin-пользователя: phone="+70000000001", role="clinic", clinic_id=3 (СМ-Клиника)
- Frontend ClinicAppointments: убирает clinicId prop, сам вызывает API без параметра

#### R1 — models/user.py: role + clinic_id
- [ ] Добавить `from sqlalchemy import ForeignKey` (если нет)
- [ ] `role: Mapped[str] = mapped_column(String(20), default="patient")`
- [ ] `clinic_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("clinics.id"), nullable=True)`
- Verify: python -c "from app.models.user import User" без ошибок

#### R2 — Alembic миграция d3e4f5a6b7c8
- [ ] `backend/alembic/versions/d3e4f5a6b7c8_add_user_role_clinic_id.py`
  - down_revision = "c2d3e4f5a6b7"
  - `op.add_column("users", sa.Column("role", sa.String(20), nullable=False, server_default="patient"))`
  - `op.add_column("users", sa.Column("clinic_id", sa.Integer(), nullable=True))`
  - FK отдельно: `op.create_foreign_key(None, "users", "clinics", ["clinic_id"], ["id"])`
- Verify: alembic upgrade head → INFO Running upgrade c2d3e4f5a6b7 → d3e4f5a6b7c8

#### R3 — seed.py: пользователь-клиника
- [ ] После создания клиник — upsert User: phone="+70000000001", name="Администратор СМ-Клиника", role="clinic", clinic_id=3
- [ ] Upsert: SELECT → если не нашли, INSERT; если нашли, обновить role+clinic_id
- Verify: psql SELECT role, clinic_id FROM users WHERE phone='+70000000001' → clinic | 3

#### R4 — schemas/auth.py: UserResponse + role + clinic_id
- [ ] Добавить `role: str` и `clinic_id: int | None` в UserResponse
- [ ] `GET /me` уже использует `UserResponse.model_validate(user)` — дополнительных изменений нет
- Verify: curl GET /auth/me → JSON содержит role + clinic_id

#### R5 — appointments.py: проверка роли + фильтр clinic_id
- [ ] `GET /appointments/clinic`: убрать `clinic_id: int | None = Query(None)`
- [ ] Добавить проверку: if current_user.role != "clinic" → HTTPException(403)
- [ ] Фильтровать: `WHERE clinic_id = current_user.clinic_id`
- [ ] Если current_user.clinic_id is None → 403 "Клиника не привязана к аккаунту"
- Verify: curl пациентом → 403; curl клиникой → список только своей клиники

#### R6 — api.ts: убрать clinicId из fetchClinicAppointments
- [ ] `fetchClinicAppointments(token)` — без параметра clinicId
- [ ] URL: `/appointments/clinic` (без query param)
- Verify: tsc --noEmit ✓

#### R7 — ClinicAppointments.tsx: убрать prop, обработать 403
- [ ] Убрать `clinicId` из props и сигнатуры
- [ ] `fetchClinicAppointments(token)` без аргумента
- [ ] Если 403 (пустой массив и token есть) → показать "Нет доступа к записям клиники"
- Verify: пациент видит "Нет доступа"; клиника видит записи

#### R8 — clinic/page.tsx: убрать prop
- [ ] `<ClinicAppointments />` (без clinicId={null})
- Verify: tsc --noEmit ✓

#### R9 — Deploy
- [ ] rsync backend + frontend → VPS
- [ ] docker build medas-backend
- [ ] alembic upgrade head (d3e4f5a6b7c8)
- [ ] python scripts/seed.py (или точечный скрипт для admin-пользователя)
- [ ] docker build medas-frontend → docker compose up -d
- [ ] Smoke: curl /auth/me с токеном клиники → role=clinic; curl /appointments/clinic → список; curl пациентом → 403

---

### Фаза СТ — Stitch Preview Pages (публичные) 🔄 in_progress

**Зачем:** клиент хочет видеть оба варианта Stitch дашборда в браузере, выбрать что брать в продакшн.
**Критерий готовности:** `saas.med-as.ru/stitch/` открывается без авторизации, переключение V1/V2 работает, все данные статические.

#### СТ1 — frontend/src/app/stitch/page.tsx
Status: pending
- "use client", tab state: "v1" | "v2"
- Mock данные жёстко в файле (без API вызовов)
- V1 — Базовый дашборд:
  - Sidebar: MED AS logo, Дашборд, График приёма, Входящие заявки [2], Врачи, Профиль клиники
  - KPI (3): Новые заявки 12 | Записи сегодня 34 | Эффективность 428 пациентов +9% (тёмная)
  - Главный блок (grid cols-5): Таймлайн (col-span-3) | Новые заявки (col-span-2)
  - Таймлайн: 09:00 Артур Морган / В ПРОГРЕССЕ, 10:30 Сэди Миллер / ОЖИДАЕТСЯ, 11:15 Джон Марстон / ОСТРОЕ
  - Новые заявки: 2 карточки с кнопками принять/отклонить
- V2 — Расширенный дашборд:
  - Sidebar: Dashboard, Products, Leads, Patients, Analytics + [Add New Lead]
  - KPI (4): Users 24.8k | CTR 4.2% | 852 | 2.4M Revenue (тёмная)
  - Главный блок: Воронка продаж (150k→12k→1.8k→940k₽) | Финансовый центр (3 платежа)
  - Второй ряд: Управление врачами (2 карточки + Добавить специалиста)
  - Третий ряд: Последние лиды | Центр отзывов
- Цвета MEDAS: #003087 синий + #00a982 зелёный (НЕ Stitch navy)
- Шрифт: Manrope (var(--font-manrope)), rounded-2xl, tonal layering

#### СТ2 — Deploy
Status: pending
- rsync frontend → VPS → docker build medas-frontend:latest
- docker compose stop frontend && docker compose up -d frontend
- Smoke: curl -I saas.med-as.ru/stitch/ → 200

---

### ⚠️ БЛОКЕР ПЕРЕД PROD — SMS OTP + Certbot
Status: pending

#### SMS-0 — Реальный OTP через SMSC.ru ✅ (2026-06-15, коммиты 37d0e7c + e7cee3b)
**Готово:** otp.py (generate_otp + send_otp → smsc.ru), Redis TTL 600s, 3 попытки → 429, нормализация номера, LoginForm countdown 60s. Вход +79271915291 подтверждён.
- [ ] `backend/app/core/otp.py` (NEW): `send_otp(phone, code)` → HTTP GET к SMSC.ru API
- [ ] `backend/app/core/config.py`: добавить SMSC_LOGIN, SMSC_PASSWORD в Settings
- [ ] `backend/app/api/v1/endpoints/auth.py`:
  - POST /auth/login → генерировать 6-значный код → сохранить в Redis `otp:{phone}` TTL=600s → отправить через send_otp
  - POST /auth/verify-otp → получить из Redis → сравнить → удалить → 3 неверных попытки → 429
- [ ] Frontend `app/login/LoginForm.tsx`: countdown "повторить через 60 сек" после отправки кода
- Verify: реальный телефон получает SMS с кодом, 4-я попытка → ошибка

#### SMS-1 — Certbot auto-renewal (5 минут)
**Риск:** сертификат истекает 2026-09-11. Без crontab — в сентябре сайт упадёт с SSL-ошибкой.
- [ ] VPS: `crontab -e` → `0 3 1,15 * * certbot renew --quiet && nginx -s reload`
- Verify: `crontab -l` показывает задачу

---

### Этап 1 — Слоты и календарь (T9 + T10) 🔴 следующая сессия
Status: pending

**Зачем:** пациент видит все дни в календаре записи, включая выходные и нерабочие дни врача — риск ошибочной записи.
**Критерий готовности:** нерабочие дни врача серые (не кликабельны) в AppointmentCalendar.

#### T9 — GET /doctors/{slug}/available-days?month=YYYY-MM (backend)
Status: complete
Done: endpoint реализован в doctors.py (weekdays из DoctorSchedule, date >= today). Коммит 37d0e7c.
- [ ] `backend/app/api/v1/endpoints/doctors.py` — новый endpoint:
  - Парсить `month=YYYY-MM` → year, month
  - Получить doctor по slug
  - Получить DoctorSchedule для doctor → set weekdays
  - Для каждого дня месяца: if weekday in schedules_set and date >= today → добавить в список
  - Вернуть `list[str]` ("YYYY-MM-DD")
- Verify: `curl /doctors/maria-kozlova/available-days?month=2026-06` → список только Пн–Пт

#### T10 — Frontend: fetchAvailableDays + AppointmentSidebarV2
Status: complete
Done: AppointmentCalendar — unavailable дни (не в availableDays, size>0) серые + disabled. Коммит 622fc48.
- [ ] `frontend/src/lib/api.ts` — `fetchAvailableDays(slug, month): Promise<number[]>` уже есть (строка 87–98), нужно только убедиться что работает с реальным endpoint
- [ ] `frontend/src/components/doctor/v2/AppointmentSidebarV2.tsx`:
  - state `availableDays: Set<number>`
  - useEffect при mount + при смене viewYear/viewMonth → loadAvailableDays
  - Передать `availableDays={availableDays}` в `<AppointmentCalendar>`
  - AppointmentCalendar уже поддерживает этот prop — изменений в нём нет
- Verify: нерабочие дни серые, суббота/воскресенье не кликабельны

---

### Этап 2 — ЛК Клиники: недостающие страницы
Status: complete
Done: все 6 пунктов навигации ЛК клиники работают. DoctorDayOff реализован. Коммиты: ec4d661 + 4290355.

#### Э2-1 — /cabinet/clinic/appointments
Status: complete
Done: страница создана с ClinicAppointments + кнопка "Экспорт CSV" (Blob), дашборд показывает ссылку → /appointments.

#### Э2-2 — /cabinet/clinic/doctors
Status: complete
Done: GET /doctors?clinic_id= (backend), карточки врачей + inline edit цены + деактивация.

#### Э2-3 — /cabinet/clinic/schedule
Status: complete
Done: accordion per doctor, 7 дней, time inputs, PUT /doctors/{id}/schedule.

#### Э2-3б — DoctorDayOff
Status: complete
Done: модель day_off.py + Alembic e4f5a6b7c8d9 + POST/DELETE /doctors/{id}/day-offs + available-days исключает blocked dates. Security fix (ownership checks) — коммит 3d30d8a.

#### Э2-4 — /cabinet/clinic/settings
Status: complete
Done: read-only MVP (имя, телефон, роль из /auth/me).

---

### Этап 3 — ЛК Врача (реальные данные)
Status: in_progress

**Зачем:** без ЛК врача нельзя онбордить врачей на платформу — они не видят своих записей.
**Критерий готовности:** врач (+70000000002) входит и видит свои записи в /cabinet/doctor с реальными данными.

#### Э3-1 — Alembic миграция doctor_id в User + seed врача
Status: pending
- [ ] `backend/app/models/user.py`: добавить `doctor_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("doctors.id"), nullable=True)`
- [ ] Alembic миграция `f5a6b7c8d9e0_add_user_doctor_id.py` (down_revision = "e4f5a6b7c8d9"):
  - `op.add_column("users", sa.Column("doctor_id", sa.Integer(), nullable=True))`
  - `op.create_foreign_key(None, "users", "doctors", ["doctor_id"], ["id"])`
- [ ] `backend/scripts/seed_doctor.py` (NEW): upsert User(phone="+70000000002", name="Иванова Мария Сергеевна", role="doctor", doctor_id=<первый активный врач clinic_id=3>)
- [ ] `backend/app/schemas/auth.py`: добавить `doctor_id: int | None` в UserResponse
- Verify: POST /auth/login +70000000002 → verify-otp → GET /auth/me → {role:"doctor", doctor_id:N}

#### Э3-2 — Backend: GET /appointments/doctor endpoint
Status: pending
- [ ] `backend/app/schemas/appointment.py`: добавить `DoctorAppointmentOut` (id, patient_name, clinic_name, status, scheduled_at, service_type, price, bonuses_used)
- [ ] `backend/app/api/v1/endpoints/appointments.py`:
  - `GET /appointments/doctor` — role=doctor required (403 иначе), фильтр `Appointment.doctor_id == current_user.doctor_id`
  - JOIN: `User.name AS patient_name`, `Clinic.name AS clinic_name`
  - Порядок: scheduled_at DESC
- [ ] `frontend/src/lib/api.ts`: добавить `DoctorAppointmentOut` тип + `fetchDoctorAppointments(token)`
- Verify: `curl -H "Authorization: Bearer $TOKEN" https://api.med-as.ru/api/v1/appointments/doctor` → список записей врача

#### Э3-3 — Frontend /cabinet/doctor страница (реальные данные)
Status: pending
- [ ] `frontend/src/app/cabinet/doctor/page.tsx` — "use client", полная замена заглушки:
  - KPI cards: записей сегодня / за 7 дней / завершено за месяц (считать из appointments[])
  - DayTimeline: записи с scheduled_at = сегодня, сортировка по времени, имя пациента + время
  - Таблица всех записей: дата, пациент, клиника, статус, цена
  - Кнопка «Завершить» (status=confirmed) → PATCH /appointments/{id}/complete → optimistic update
  - Кнопка «Отменить» (status=pending|confirmed) → PATCH /appointments/{id}/cancel → optimistic update
  - NavItems: Главная (ЛК), Расписание (⚠️ заглушка), Настройки (⚠️ заглушка)
- Verify: логин +70000000002 → /cabinet/doctor → таблица с реальными записями пациентов

---

### Этап 4 — Публичные страницы: /about + /register + /services
Status: pending
**Зачем:** без /about нет страницы для инвесторов и партнёров. /register отдельно нужна для SEO.

#### Э4-1 — /register (отдельная страница)
- [ ] Разделить /login на два флоу: "Войти" и "Зарегистрироваться" (сейчас всё в одном)
- [ ] /register: форма с именем + телефоном → POST /auth/register → OTP-верификация

#### Э4-2 — /about
- [ ] Статичная: миссия, команда, цифры (клиник/врачей/пациентов)

#### Э4-3 — /services (динамический каталог)
- [ ] Категории услуг → ссылки на /search?specialty=

---

### Этап 5 — Бонусы пациента + история BonusTransaction
Status: pending
- [ ] `GET /bonuses/my` — история BonusTransaction из БД для текущего пользователя
- [ ] /cabinet/patient/bonuses → реальная история с суммами и описаниями
- [ ] ⚠️ /cabinet/patient/medcard и /family — отложить до Этапа монетизации (нет модели в БД)

---

### Этап 6 — Контент: блог, симптомы
Status: pending
- [ ] Модель Article (slug, title, excerpt, content_html, specialty, publishedAt)
- [ ] GET /articles, GET /articles/{slug}
- [ ] /articles + /articles/[slug] страницы — SEO, schema.org/Article
- [ ] /symptoms — поиск симптом → специальность

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
| 9 | **Дизайн/страницы — обязательно Magic MCP (21st.dev) + `/ui-ux-pro-max`** | Любая новая страница, редизайн, UI-компонент: включить `/mcp-magic-on` → выполнить задачу → выключить `/mcp-magic-off`. API ключ — в settings.local.json (не в коде). |

---

## Errors Encountered

| Время | Ошибка | Статус |
|---|---|---|
| — | — | — |

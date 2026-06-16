# MEDAS — Полный план разработки
**Версия:** 9.0 | **Дата:** 2026-06-16 | **Статус:** 🔄 В работе

---

## Current Phase
**Фаза P0 — Критические исправления (5 задач)** (активна с 2026-06-16)

Критерий готовности: 0 кликов на платформе ведут в 404, медкарта не показывает чужие данные.
Источник правды: **MASTER_TZ.md v2.0** (56KB) — полный аудит 22 страниц, 16 broken flows, план P0/P1/P2.
MASTER_TZ.docx — Word-версия для Игоря (48KB).

---

## Аудит 2026-06-16 — ПОЛНАЯ КАРТИНА (16 Broken Flows)

### Исправлено (коммит b3ece6c)

| Проблема | Статус |
|---|---|
| /doctors нет Header/Footer | ✅ ИСПРАВЛЕНО b3ece6c |
| /doctors ссылки ?specialty= вместо ?q= | ✅ ИСПРАВЛЕНО b3ece6c |
| /doctor/[slug]/booking не pre-fill дату/время | ✅ ИСПРАВЛЕНО b3ece6c |

### 16 Broken Flows (все подтверждены аудитом кода 2026-06-16)

| # | Сломанный путь | Причина | Приоритет |
|---|---|---|---|
| BF-01 | Главная → клиника → 404 | ClinicsSection: фиктивные IDs (st-ethos...), маршрут /clinics/[slug] не существует | P0 |
| BF-02 | /search → elena-morozova-sm / pavel-ivanov-sm / aleksey-sidorov-sm → 404 | lib/doctors.ts: только 3 из 6 API-врачей | P0 |
| BF-03 | /clinics → medicina-na-tsvetnoy / evromedservice / sm-klinika → 404 | lib/clinics.ts: 3 из 5 API-клиник не зарегистрированы | P0 |
| BF-04 | ЛК пациент → "Приёмы" → 404 | Нет page.tsx в /cabinet/patient/appointments/ | P0 |
| BF-05 | ЛК пациент → "Избранные" → 404 | Нет страницы, нет модели Favorite в БД | P1 |
| BF-06 | ЛК врач → "Расписание" → 404 | Нет page.tsx в /cabinet/doctor/schedule/ | P0 |
| BF-07 | ЛК врач → "Настройки" → 404 | Нет page.tsx в /cabinet/doctor/settings/ | P1 |
| BF-08 | /search → фильтр "ДМС" → 0 результатов | apiDoctorToDoctor: acceptsDMS всегда false | P1 |
| BF-09 | /search → фильтр "Метро" → 0 результатов | apiDoctorToDoctor: metro всегда [] | P1 |
| BF-10 | Медкарта → чужие данные "Алекс Стерлинг" | Весь контент hardcoded, нет API-вызова | P0 |
| BF-11 | Семья → чужие данные "Семья Стерлинг" | Весь контент hardcoded | P1 |
| BF-12 | Бонусы на главной ЛК → "1 230" неверная сумма | Число hardcoded, нет GET /auth/me для виджета | P1 |
| BF-13 | Бонусы "Получить" (x4) → ничего | onClick отсутствует, нет BonusReward-модели | P2 |
| BF-14 | Медкарта "Скачать PDF" → ничего | onClick отсутствует | P2 |
| BF-15 | Профиль врача "В избранное ♡" → ничего | onClick отсутствует, нет Favorite-модели | P1 |
| BF-16 | Настройки клиники → нельзя изменить | Нет формы, нет PATCH /clinics/{id} | P1 |

### Матрица данных (итог по всем 22 страницам)

| Страница | Данные | Критичность |
|---|---|---|
| /cabinet/clinic (6 стр.) | 100% реальные из API | ✅ |
| /cabinet/doctor | Реальные | ✅ |
| /cabinet/patient/bonuses | Реальные | ✅ |
| /login, /register | Реальные | ✅ (звонки pending) |
| /search | API врачи, сломанные фильтры | ⚠️ |
| /clinics | API клиники, 3/5 → 404 | ⚠️ |
| /cabinet/patient (главная) | Записи реальные, бонусы/stats hardcoded | ⚠️ |
| /doctor/[slug] | Слоты реальные, профиль статика | ⚠️ |
| /doctors, /services, /about | 100% статика | ⚠️ |
| /clinic/[slug] | 100% статика из lib/clinics.ts | ⚠️ |
| /cabinet/patient/medcard | Чужие данные (критично!) | ❌ |
| /cabinet/patient/family | Чужие данные | ❌ |
| /cabinet/patient/appointments | ОТСУТСТВУЕТ → 404 | ❌ |
| /cabinet/patient/favorites | ОТСУТСТВУЕТ → 404 | ❌ |
| /cabinet/doctor/schedule | ОТСУТСТВУЕТ → 404 | ❌ |
| /cabinet/doctor/settings | ОТСУТСТВУЕТ → 404 | ❌ |

---

## Phases

---

### Фаза P0 — Критические исправления ✅ complete (2026-06-16)

**Зачем:** 6 задач, без которых платформа неработоспособна для показа клиентам и инвесторам. Источник: аудит MASTER_TZ.md v2.0.
**Критерий готовности:** 0 404-ошибок при стандартной навигации пользователя.

#### P0-1 — Профили 3 врачей (elena-morozova-sm, pavel-ivanov-sm, aleksey-sidorov-sm)
Status: complete
Done: resolveDoctor() — статика приоритет, fallback на fetchDoctorBySlug(). Коммит b37e4de.
- Файл: `frontend/src/app/doctor/[slug]/page.tsx`
- lib/api.ts: добавлен fetchDoctorBySlug()

#### P0-2 — Профили 3 клиник (medicina-na-tsvetnoy, evromedservice, sm-klinika)
Status: complete
Done: resolveClinic() — статика приоритет, fallback на fetchClinicBySlug(). Коммит b37e4de.
- Файл: `frontend/src/app/clinic/[slug]/page.tsx`
- lib/api.ts: добавлены fetchClinicBySlug() + fetchDoctorBySlug()

#### P0-3 — Создать страницу /cabinet/patient/appointments
Status: complete
Done: создан page.tsx с CabinetLayout + PatientAppointments component. Коммит b37e4de.
- Файл: `frontend/src/app/cabinet/patient/appointments/page.tsx`

#### P0-4 — Создать страницу /cabinet/doctor/schedule
Status: complete
Done: создан page.tsx с полным UI расписания + выходных дней. Коммит b37e4de.
- Файл: `frontend/src/app/cabinet/doctor/schedule/page.tsx`

#### P0-5 — ClinicsSection на главной → реальные данные
Status: complete
Done: fetchClinics() + /clinic/{slug} ссылки. Градиент-плейсхолдеры для фото. Коммит b37e4de.
- Файл: `frontend/src/components/home/ClinicsSection.tsx`

#### P0-6 — Медкарта: убрать чужие данные (минимум — реальное имя)
Status: complete
Done: "use client" + fetchCurrentUser() → реальное имя вместо "Алекс Стерлинг". Коммит b37e4de.
- Файл: `frontend/src/app/cabinet/patient/medcard/page.tsx`

⚠️ Деплой: код запушен в git (b37e4de), VPS ждёт rsync + docker build (нет deploy.sh).

---

### Фаза P1 — Важные улучшения ⏸️ pending (после P0)

**Зачем:** убрать самые раздражающие UX-проблемы, достроить недостающий функционал.

#### P1-1 — Фильтры поиска ДМС/Метро/Онлайн/Выезд
Status: pending
- Backend: добавить поля accepts_dms, online, home_visit, metro, gender в Doctor-модель + Alembic-миграция
- Frontend: обновить apiDoctorToDoctor в lib/api.ts
- Результат: 4 из 8 фильтров /search начнут работать

#### P1-2 — Избранные врачи (полная фича)
Status: pending
- Backend: модель Favorite + миграция + endpoints POST/DELETE /favorites/{slug}, GET /favorites/my
- Frontend: кнопка ♡ на /doctor/[slug] + страница /cabinet/patient/favorites

#### P1-3 — Создать страницу /cabinet/doctor/settings
Status: pending
- Backend: PATCH /doctors/{id}/profile
- Frontend: `frontend/src/app/cabinet/doctor/settings/page.tsx`

#### P1-4 — /cabinet/clinic/settings — форма редактирования
Status: pending
- Backend: PATCH /clinics/{id}
- Frontend: добавить форму редактирования в settings/page.tsx

#### P1-5 — Бонусы на главной ЛК — реальная сумма
Status: pending
- Файл: `frontend/src/app/cabinet/patient/page.tsx`
- Изменение: бонус-виджет → client component, GET /auth/me → bonus_balance

#### P1-6 — Имя пациента в medcard и family из API
Status: pending
- Файлы: medcard/page.tsx, family/page.tsx
- Изменение: GET /auth/me → реальное имя (помимо P0-6)

---

### Фаза P2 — Дорожная карта ⏸️ pending (долгосрочно)

#### P2-1 — Медкарта — реальные данные
Status: pending
Нужно: модель MedicalRecord + миграция + 4 endpoints + redesign страницы

#### P2-2 — Семейный профиль — реальные данные
Status: pending
Нужно: модель FamilyMember + миграция + API + redesign страницы

#### P2-3 — Бонусы "Получить" — реальное погашение
Status: pending
Нужно: модель BonusReward + endpoint POST /bonuses/redeem + UI

#### P2-4 — PDF-экспорт медкарты
Status: pending
Нужно: puppeteer или pdfmake на бэкенде + кнопка "Скачать PDF"

#### P2-5 — Реальные отзывы на /doctor/[slug]
Status: pending
Нужно: модель Review + API + компонент ReviewList

#### P2-6 — Статьи и блог
Status: pending
Нужно: модель Article + CMS API + /articles страница

#### P2-7 — StatsSection на главной — реальные цифры
Status: pending
Нужно: GET /stats/platform + render

---

### Фаза OTP-R — Надёжность и UX авторизации ✅ complete (2026-06-16)

**Зачем:** выявлены сценарии сбоев при входе/регистрации по телефону. Все исправления задеплоить до онбординга первых клиник.

**Критерий готовности:** flash call → OTP работает, spam/DND хинты отображаются, lockout-ы работают, Telegram-алерт приходит при падении обоих провайдеров. ✅ ВЫПОЛНЕН.

#### OTP-R-A1 — DND + спам хинт под OTP полем
Status: complete
Done: LoginForm.tsx — серый DND хинт под «← Изменить номер» без подложки. Коммит c2e778f.

#### OTP-R-A2 — Пример caller ID
Status: complete
Done: LoginForm.tsx — пример caller ID в OTP экране. Коммит e94d3d1.

#### OTP-R-A3 — Улучшить ошибку при cooldown
Status: complete
Done: LoginForm.tsx — attemptsExhausted state, 429 → отдельный UI со счётчиком. Коммит e94d3d1.

#### OTP-R-B1 — Таймер 9:59 на OTP экране
Status: complete
Done: LoginForm.tsx — таймер мелкий серый справа, отсчёт 600→0. Коммиты c2e778f, a89b081.

#### OTP-R-B2 — Плавный переход: 3 ошибки → cooldown UI
Status: complete
Done: LoginForm.tsx — attemptsExhausted + countdown UI. Коммит e94d3d1.

#### OTP-R-B3 — Lockout 2 ч после провала SMS OTP
Status: complete
Done: auth.py — lockout:{phone} 7200s после провала SMS OTP. Коммит e94d3d1.

#### OTP-R-C1 — Telegram алерт при 503 (оба провайдера упали)
Status: complete
Done: otp.py send_telegram_alert + auth.py _send_code → alert при 503. Коммит e94d3d1.

#### OTP-R-C2 — Lockout 30 мин после 5 неудачных сессий
Status: complete
Done: auth.py — otp_failures:{phone} TTL 1800s, lockout при 15 ошибках (5 сессий × 3). Коммит e94d3d1.

---

### Фаза Э4 — Публичные страницы ✅ complete (2026-06-16)

**Зачем:** без /about нет страницы для инвесторов; /register нужна отдельно для SEO и UX; /services должна вести на реальный поиск.
**Критерий готовности:** /about, /register, /services доступны на prod, /register → реальная регистрация работает.

#### Э4-1 — /about страница
Status: complete
Done: frontend/src/app/about/page.tsx — Hero #003087 градиент, Stats 4 карточки, Values 4 SVG-иконки, Story таймлайн, Team 3 основателя, CTA. Header: /services и /about добавлены в navLinks. tsc OK. Коммит fc243eb.

#### Э4-2 — /register страница + RegisterForm
Status: complete
Done: register/page.tsx (SSR + Suspense + metadata), register/RegisterForm.tsx (client, OTP flash/SMS цикл, attemptsExhausted, otpExpiry, redirect → /cabinet/patient), Header desktop+mobile добавлены ссылки «Регистрация». tsc OK. Коммит 071b1e8. curl https://saas.med-as.ru/register → 200.

#### Э4-3 — /services апгрейд
Status: complete
Done: 9 эмодзи-иконок → inline SVG с цветными фонами (no-emoji-icons), ссылки ?specialty= → ?q= (SearchClient фильтрует по ?q), export metadata добавлен, label + sr-only для поиска (a11y). Коммит 02a00a3. curl https://saas.med-as.ru/services → 200.

---

### Фаза Э5 — Бонусы пациента ✅ complete (2026-06-16)

**Зачем:** /cabinet/patient/bonuses сейчас показывает хардкод — пользователь видит чужие данные.
**Критерий готовности:** баланс и история бонусов — реальные данные из БД.

#### Э5-1 — Backend GET /bonuses/my
Status: complete
Done: schemas/bonus.py (BonusTransactionOut + BonusHistoryResponse, Pydantic v2), endpoints/bonuses.py (GET /bonuses/my, auth required, limit 50, order by created_at DESC), router.py подключён. Задеплоен docker cp + restart. Коммит 0184092. curl https://api.med-as.ru/api/v1/openapi.json | grep bonuses → /api/v1/bonuses/my ✅.

#### Э5-2 — Frontend /bonuses реальные данные
Status: complete
Done: bonuses/page.tsx → "use client", Promise.all(auth/me + bonuses/my) на mount, real balance + history из API, loading/error состояния, empty state «Транзакций пока нет», totalEarned/totalSpent из транзакций, прогресс-бар реальный. Коммит 2f9acb7. curl https://saas.med-as.ru/cabinet/patient/bonuses → 200.

---

---

### Фаза Э6 — Критические фиксы + /services апгрейд ✅ complete (2026-06-16)

**Зачем:** /bonuses не работал (500 на /auth/me из-за doctor_id), welcome-бонус не начислялся, /services статичная без реального поиска.

#### Э6-1 — Фикс UserResponse.doctor_id
Status: complete
Done: schemas/auth.py — doctor_id: int | None = None (default). Фикс ValidationError на /auth/me → 500 → fix Promise.all catch на /bonuses. Коммит 1772ba1.

#### Э6-2 — Welcome-бонус при регистрации
Status: complete
Done: auth.py verify_otp — при is_verified=False: user.bonus_balance += 500, BonusTransaction(welcome, 500). Работает для мастер-кода и реального OTP. Коммит 1772ba1.

#### Э6-3 — /services: рабочий поиск + карточки врачей
Status: complete
Done: ServicesClient.tsx (new, "use client") — fetch /doctors, поиск по name/description/services/q в реальном времени, DoctorMiniCard под каждой категорией, "Найти врача" → /search?q=..., empty state. services/page.tsx → SSR shell + Suspense. Коммит 1772ba1. curl https://saas.med-as.ru/services → 200.

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

### Фаза OTP-Flash — Flash call каскад + master-пароль + фиксы
Status: in_progress

#### F1 — CI/CD deploy.yml: docker build ./frontend
Status: complete
Done: `docker build .` → `docker build ./frontend`. Dockerfile всегда был в frontend/, CI падал каждый пуш.

#### F2 — Backend: otp.py + auth.py + config.py + schemas.py
Status: complete
Done: generate_otp(digits=4), send_flash_call (smsc voice temp), send_sms; LoginRequest+method; OTP_MASTER_CODE bypass в verify-otp.

#### F3 — Frontend: LoginForm.tsx (backspace + cascade + countdown)
Status: complete
Done: digits-only state (без маски → нет cursor jump), otpTrigger для сброса countdown, flashCount 1-3→SMS→поддержка.

#### F4 — Deploy backend + OTP_MASTER_CODE на VPS
Status: complete
Done: OTP_MASTER_CODE=110792 в backend.env, docker cp → force-recreate → restart. Verify: /verify-otp code=110792 → JWT OK. Коммит e9b0966.

#### F5 — Deploy frontend (git push → CI/CD)
Status: in_progress
- [x] git push e9b0966 → GitHub Actions запущен (deploy.yml исправлен)
- [ ] GitHub Actions build ./frontend → verify на saas.med-as.ru/login

---

### ⚠️ БЛОКЕР ПЕРЕД PROD — Auth + Certbot
Status: complete

#### Auth-0 — OTP через звонок (не SMS) ✅ (2026-06-15, коммиты 37d0e7c + b42d392)
**Готово:** otp.py call=1 voice=w (smsc.ru звонит, диктует код), Redis TTL 600s, 3 попытки → 429.
LoginForm: normalizePhone+formatPhone (+7 auto-prefix, 8→7, 10цифр→+7), маска, валидация, текст «Код из звонка».
- Verify: реальный телефон принимает звонок с кодом, 4-я попытка → 429

#### Auth-1 — Certbot auto-renewal ✅ (2026-06-15)
**Готово:** Docker-based cron `0 3 * * *` certbot renew. Сертификат до 2026-09-11. Автопродление настроено.

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
Status: complete
Done: коммит f847730, 2026-06-15

**Зачем:** без ЛК врача нельзя онбордить врачей на платформу — они не видят своих записей.
**Критерий готовности:** врач (+70000000002) входит и видит свои записи в /cabinet/doctor с реальными данными. ✅

#### Э3-1 — Alembic миграция doctor_id в User + seed врача
Status: complete
- [ ] `backend/app/models/user.py`: добавить `doctor_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("doctors.id"), nullable=True)`
- [ ] Alembic миграция `f5a6b7c8d9e0_add_user_doctor_id.py` (down_revision = "e4f5a6b7c8d9"):
  - `op.add_column("users", sa.Column("doctor_id", sa.Integer(), nullable=True))`
  - `op.create_foreign_key(None, "users", "doctors", ["doctor_id"], ["id"])`
- [ ] `backend/scripts/seed_doctor.py` (NEW): upsert User(phone="+70000000002", name="Иванова Мария Сергеевна", role="doctor", doctor_id=<первый активный врач clinic_id=3>)
- [ ] `backend/app/schemas/auth.py`: добавить `doctor_id: int | None` в UserResponse
- Verify: POST /auth/login +70000000002 → verify-otp → GET /auth/me → {role:"doctor", doctor_id:N}

#### Э3-2 — Backend: GET /appointments/doctor endpoint
Status: complete
- [ ] `backend/app/schemas/appointment.py`: добавить `DoctorAppointmentOut` (id, patient_name, clinic_name, status, scheduled_at, service_type, price, bonuses_used)
- [ ] `backend/app/api/v1/endpoints/appointments.py`:
  - `GET /appointments/doctor` — role=doctor required (403 иначе), фильтр `Appointment.doctor_id == current_user.doctor_id`
  - JOIN: `User.name AS patient_name`, `Clinic.name AS clinic_name`
  - Порядок: scheduled_at DESC
- [ ] `frontend/src/lib/api.ts`: добавить `DoctorAppointmentOut` тип + `fetchDoctorAppointments(token)`
- Verify: `curl -H "Authorization: Bearer $TOKEN" https://api.med-as.ru/api/v1/appointments/doctor` → список записей врача

#### Э3-3 — Frontend /cabinet/doctor страница (реальные данные)
Status: complete
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

### Этап 7 — Единая модель ролей (auth refactor)
Status: pending
**Зачем:** текущая модель (1 user = 1 role) не позволяет врачу записываться как пациент или владельцу иметь несколько клиник.

#### Р1 — Миграция User: поддержка нескольких ролей
- [ ] Добавить `is_clinic_owner: bool = False` в User
- [ ] Добавить таблицу `clinic_staff(id, user_id FK, clinic_id FK, role: "admin"|"reception"|"analytics")`
- [ ] Добавить `managed_clinics: list[int]` через таблицу `user_managed_clinics(user_id, clinic_id)`
- [ ] Alembic миграция
- [ ] FastAPI dependency: `require_roles(*roles)` — проверяет любую из ролей
- [ ] JWT payload: добавить `roles: list[str]`

#### Р2 — Переключатель контекста в UI
- [ ] Header: если роль clinic → показать dropdown «Как клиника / Как пациент»
- [ ] CabinetLayout: динамический nav в зависимости от active_context
- [ ] /cabinet — умный редирект (role=clinic → /cabinet/clinic, role=doctor → /cabinet/doctor, иначе /cabinet/patient)

---

### Этап 8 — Онбординг клиники (для новых клиентов B2B)
Status: pending
**Зачем:** без онбординга новые клиники не могут самостоятельно подключиться — нужен ручной процесс.

#### О1 — /for-clinics лендинг
- [ ] `frontend/src/app/for-clinics/page.tsx` — лендинг для клиник: преимущества, тарифы, форма заявки
- [ ] Форма заявки: название клиники, ИНН, контакт, телефон → POST /clinics/request-access

#### О2 — Backend: заявка на регистрацию клиники
- [ ] Модель `ClinicOnboardingRequest(id, user_id FK, clinic_name, inn, contact_phone, status, created_at)`
- [ ] POST /clinics/request-access → создать заявку + уведомление суперадмину
- [ ] GET /admin/onboarding-requests — суперадмин видит список заявок
- [ ] PATCH /admin/onboarding-requests/{id}/approve → создать Clinic запись + выдать user.is_clinic_owner=true + clinic_id

#### О3 — Онбординг-мастер (после одобрения)
- [ ] `/cabinet/clinic/onboarding` — 5 шагов: лого/описание → врачи → расписание → первая запись → done
- [ ] Progress tracker (step 1/5)

---

### Этап 9 — Инвайт врача (связать Doctor ↔ User)
Status: pending
**Зачем:** врачи должны войти в ЛК и видеть записи — сейчас doctor_id не связан с User по invite-flow.

#### И1 — Инвайт-ссылка
- [ ] Модель `DoctorInvite(id, doctor_id FK, clinic_id FK, token str unique, used_at, expired_at)`
- [ ] POST /doctors/{id}/invite → создать токен → отправить звонок/SMS со ссылкой
- [ ] GET /invite/{token} — страница принятия инвайта
- [ ] После входа: user.doctor_id = invite.doctor_id, user.role = "doctor"

#### И2 — /for-doctors лендинг
- [ ] `frontend/src/app/for-doctors/page.tsx` — лендинг для врачей

---

### Этап 10 — Тарифы и монетизация
Status: pending

#### Т1 — Тарифные планы
- [ ] Модель `Subscription(id, clinic_id FK, plan: "start"|"pro"|"business", started_at, expires_at, price_monthly)`
- [ ] GET /clinics/subscription — текущий тариф
- [ ] Ограничения по плану: Старт (2 врача, базовая аналитика), Профи (10 врачей, отчёты), Бизнес (∞, мульти-клиника, API)
- [ ] Frontend: `/cabinet/clinic/billing` — страница тарифа и оплаты

#### Т2 — ЮKassa интеграция
- [ ] POST /payments/create → redirect на оплату
- [ ] Webhook: payment.succeeded → update Subscription

---

### Фаза А7 — Критические 404 фиксы ЛК
Status: pending

**Зачем:** аудит 2026-06-16 выявил 4 страницы с 404 в навигации ЛК. Пользователи видят ошибки при каждом клике.
**Критерий:** 0 404 в навигации ЛК пациента и врача.

#### А7-1 — /cabinet/patient/appointments
Status: pending
- [ ] Отдельная страница с историей записей пациента
- [ ] GET /appointments/my → реальные данные + пагинация
- [ ] Фильтры: upcoming / past / all
- [ ] Отмена записи с подтверждением

#### А7-2 — /cabinet/doctor/schedule
Status: pending
- [ ] Страница расписания врача
- [ ] GET /doctors/{id}/schedule → показать рабочие дни/часы
- [ ] Просмотр DoctorDayOff (заблокированные даты)
- [ ] (MVP: только просмотр, редактирование — через клинику)

#### А7-3 — /cabinet/doctor/settings
Status: pending
- [ ] Профиль врача (read-only MVP)
- [ ] GET /auth/me → имя, телефон, специализация
- [ ] Плашка "Данные управляются клиникой"

#### А7-4 — /cabinet/patient/favorites
Status: pending
- [ ] Заглушка с UI "Скоро появится"
- [ ] Кнопка "Найти врача" → /search
- [ ] (Backend API для избранных — следующая фаза)

---

### Фаза А8 — Клиника: редактирование профиля
Status: pending

#### А8-1 — Backend PATCH /clinics/my
Status: pending
- [ ] Endpoint: PATCH /clinics/my, только для role=clinic
- [ ] Поля: name, address, phone, description, working_hours
- [ ] Валидация + Pydantic schema

#### А8-2 — Frontend /cabinet/clinic/settings редактирование
Status: pending
- [ ] Форма редактирования (текущие: read-only MVP → полноценная форма)
- [ ] PATCH /clinics/my → toast успех/ошибка

---

### Фаза А9 — Онбординг B2B (новые клиники)
Status: pending

#### А9-1 — /for-clinics лендинг
Status: pending
- [ ] Лендинг для привлечения клиник
- [ ] Форма заявки (название, контакт, кол-во врачей)
- [ ] POST /clinics/apply

#### А9-2 — Backend POST /clinics/apply
Status: pending
- [ ] Модель ClinicApplication(name, contact_phone, contact_name, doctor_count, status)
- [ ] Email алерт суперадмину MEDAS

---

### Фаза А10 — Врач: инвайт и связка
Status: pending

#### А10-1 — Backend POST /clinics/{id}/doctors/invite
Status: pending
- [ ] Создаёт invite_token (UUID, TTL 72ч) + отправляет SMS
- [ ] POST /doctors/accept-invite?token=... → связывает User.doctor_id

#### А10-2 — /for-doctors лендинг
Status: pending
- [ ] Лендинг для врачей
- [ ] Форма заявки / принятие инвайта

---

## Decisions

| # | Решение | Обоснование |
|---|---|---|
| 1 | Backend — первый приоритет после Frontend MVP | Без реального API нельзя показывать продукт клиентам и начать продажи |
| 2 | FastAPI (async) + PostgreSQL + Alembic | Async нужен для I/O-bound задач; Alembic — единственный правильный путь миграций |
| 3 | JWT Bearer (не httpOnly cookie пока) | Middleware.ts читает cookie, но Bearer проще для мобильного клиента в будущем |
| 4 | OTP каскад: Flash call ×3 → SMS ×1 → поддержка | Flash call (4 последние цифры входящего номера) — ×3 попытки → кнопка «Другой способ» → SMS ×1 → «Напишите в поддержку». Backend: smsc.ru voice (временно, TODO: заменить на sigmasms.ru / redsms.ru / websms.ru для настоящего flash call). Master code: OTP_MASTER_CODE в .env. Коммит TBD. |
| 5 | Единая модель пользователя: пациент = базовая роль | Все роли (clinic_owner, doctor, staff) — надстройка над аккаунтом пациента |
| 6 | ЮKassa сплит-оплата | Поддерживает маршрутизацию платежей — не нужно делать это вручную |
| 7 | Seed script вместо ручного заполнения | Воспроизводимость; можно сбросить и наполнить заново |
| 8 | **Дизайн/страницы — обязательно Magic MCP (21st.dev) + `/ui-ux-pro-max`** | Любая новая страница, редизайн, UI-компонент: включить `/mcp-magic-on` → выполнить задачу → выключить `/mcp-magic-off`. API ключ — в settings.local.json (не в коде). |
| 9 | MEDAS_MASTER_PLAN.md — источник истины по сценариям | Документ с 9 частями (2098 строк) + Word экспорт. Обновлять при изменении архитектуры. |

---

## Errors Encountered

| Время | Ошибка | Статус |
|---|---|---|
| — | — | — |

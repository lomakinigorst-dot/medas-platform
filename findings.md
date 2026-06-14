# findings.md — Исследования и заметки
> Заметки текущей сессии, открытые вопросы, анализ конкурентов

---

## Stitch + конкурентный анализ дашборда клиники (2026-06-14)

### Stitch Вариант 1 — «ЛК клиника - Админка» (ПРИОРИТЕТ)

Файл: `/Страницы СТИЧ/ЛК клиника - Админка/`

**Структура (сверху вниз):**
1. Хедер: «Панель управления» + дата + поиск + «Новая запись» (синяя CTA)
2. KPI 3 карточки: «Новые заявки: 12 (+4 с 8:00)» / «Заблокировано: 34 (85%)» / тёмная «Эффективность: 428 пациентов +5%» с мини-чартом
3. **ГЛАВНЫЙ БЛОК** (2 колонки): LEFT 60% = «Расписание на день» таймлайн | RIGHT 40% = «Новые заявки»
4. Таймлайн: слоты 09:00 / 10:30 / 11:30. Карточка = аватар врача + имя пациента + специальность + статус-бейдж. Статусы: «В ПРОГРЕССЕ» (синий) / «ОЖИДАЕТСЯ» (серый) / «ОСТРОЕ» (красный)
5. Design tokens: Navy #00193c, Seafoam #006c45. Нет border-lines, tonal layering, Manrope, rounded-2xl

### Stitch Вариант 2 — «Расширенный дашборд» (будущая фаза)

- KPI: Users / CTR / Business / Revenue — все с ±% трендами
- «Путь пациента» — воронка (маркетинг → профиль → запись → оплата)
- «Финансовый центр», «Управление врачами» с рейтингами, «Последние лиды», «Центр отзывов»
→ Для фазы монетизации (Фаза 7+), не сейчас

### Конкурентный анализ (СберЗдоровье / Napopravku)

| Блок | Конкуренты | Stitch V1 | У нас | Приоритет |
|---|---|---|---|---|
| KPI сегодня | ✅ реальные | ✅ 3 карточки | ✅ есть | done |
| **Расписание-таймлайн** | ✅ главный блок | ✅ 60% экрана | ❌ нет | 🔴 критично |
| Загрузка врачей | «N из M слотов» | «Заполнено X%» | ✅ scroll | нужен top-5 фикс |
| Входящие заявки | карточки + фильтр | правая колонка | ✅ таблица + пагинация | ok |
| График выручки | вторичный | вторичный | 🟡 пустой (баг) | фикс backend |

### Баг: пустой revenue_by_day

**Файл:** `backend/app/api/v1/endpoints/appointments.py`, строки 294-303

**Причина:** запрос фильтрует `status IN ('confirmed', 'completed')`, но seed-записи создаются в статусе `pending` → исторические данные за май-июнь не попадают в график.

**Фикс:** `Appointment.status.in_(["confirmed", "completed"])` → `Appointment.status != "cancelled"`.

### Баг: padding сайдбара (CabinetLayout)

**Файл:** `frontend/src/components/layout/CabinetLayout.tsx`, строка 99

**Причина:** nav items — `px-4`, user info блок — `px-2` → имя клиники «съезжает» влево.

**Фикс:** `px-2` → `px-4` в обёртке user info.

---

## Сессия 2026-06-14 — Фаза Д: Дашборд клиники (редизайн)

### Дизайны Stitch — что взято

**Vариант 2 «Админка»** (основа):
- KPI: большие числа (text-5xl), маленький бейдж тренда (+4 с 8:00)
- Кнопка «Новая запись» (зелёная) в хедере
- User info внизу сайдбара с avatar + overflow-hidden

**Вариант 1 «Расширенный»:**
- Тёмный градиент-блок для графика (col-span-2)
- Мини-бары с bg-white/10..60 на тёмном фоне

### Аудит конкурентов (СберЗдоровье, Napopravku)
- KPI сегодня — реальные из API (done: /clinic/stats)
- Загрузка врачей «X из Y слотов» (done)
- Входящие записи — главный блок + пагинация (done: 20/стр)
- Быстрое действие «Добавить запись» (done: кнопка в хедере, без функционала)

### Технические решения
- **Пустой график**: height:X% в flex-col без явной высоты родителя = 0px. Решение: абсолютные px (barH = revenue/max * 96px).
- **Truncate не работал**: div без min-w-0 в flex. Решение: min-w-0 flex-1 + перенос user info вниз.
- **Пагинация**: useMemo paginated = filtered.slice((page-1)*20, page*20). Сброс page при смене фильтра.

---

## Сессия 2026-06-13 — Фаза 3: Реальное бронирование

### Исследование кода — что уже есть

**Appointment модель** — полностью готова: patient_id, doctor_id, clinic_id, service_type (enum: primary/followup/online), scheduled_at, price, bonuses_used, bonuses_earned, status (enum: pending/confirmed/completed/cancelled), notes.

**DoctorSchedule** — модели нет, таблицы нет. Нужно создать.

**BookingForm.tsx** — handleSubmit просто вызывает `setSubmitted(true)`, никакого API вызова. Использует `Doctor` из `lib/doctors.ts` (мок), не из API. Слоты берёт из `doctor.slots` (мок-данные).

**AppointmentSidebarV2.tsx** — использует `FLAT_SLOTS = ["09:00","10:30","11:45","13:00","14:30","16:00"]` (хардкод).

**Нет** `get_current_user` dependency (auth.py использует `_bearer` напрямую) — нужно вынести в `core/deps.py`.

**Нет** `/api/v1/appointments` endpoint.

**Нет** `schemas/appointment.py`.

### Архитектурные решения

**Doctor ID в BookingForm**: `BookingForm` получает `doctor: Doctor` из lib/doctors.ts, где нет поля `id`. POST /appointments принимает `doctor_slug` (строка) → backend сам резолвит в doctor_id. Не нужно менять тип Doctor или делать лишний API-запрос.

**Slots endpoint**: `GET /api/v1/doctors/{slug}/slots?date=YYYY-MM-DD` — добавить в существующий `endpoints/doctors.py` (не создавать отдельный файл).

**Timezone**: scheduled_at хранится в UTC, слоты генерируются в московском времени (UTC+3) — форматировать на клиенте.

**Алгоритм слотов**: schedule_service.get_available_slots(doctor_id, date) → генерирует все слоты (start_time, slot_duration_min, end_time из DoctorSchedule) → убирает уже занятые (WHERE doctor_id=X AND DATE(scheduled_at)=date AND status != 'cancelled').

**/cabinet/patient реальные записи**: patient/page.tsx — server component. Создать `PatientAppointments` client component рядом (аналогично PatientHeroGreeting). Получает список из GET /appointments/my с Bearer токеном на клиенте.

### Файлы к изменению (10 файлов)

Backend (7):
1. `backend/app/models/schedule.py` — NEW
2. `backend/app/models/__init__.py` — добавить DoctorSchedule
3. `backend/app/core/deps.py` — NEW (get_current_user)
4. `backend/app/schemas/appointment.py` — NEW (SlotOut, AppointmentCreate, AppointmentOut)
5. `backend/app/services/schedule_service.py` — NEW
6. `backend/app/api/v1/endpoints/appointments.py` — NEW
7. `backend/app/api/v1/endpoints/doctors.py` — добавить GET /slots
8. `backend/app/api/v1/router.py` — include appointments router
9. `backend/scripts/seed.py` — добавить расписание
10. Alembic миграция (autogenerate)

Frontend (3+1):
11. `frontend/src/lib/api.ts` — добавить fetchSlots, createAppointment, fetchMyAppointments
12. `frontend/src/components/doctor/booking/BookingForm.tsx` — реальный submit
13. `frontend/src/components/doctor/v2/AppointmentSidebarV2.tsx` — реальные слоты
14. `frontend/src/components/cabinet/PatientAppointments.tsx` — NEW client component

## Сессия 2026-06-13 — Фаза 2: Header auth + Logout + CORS

### Исследование кода

**`frontend/src/lib/auth.ts`** — полностью готов:
- `getToken()` читает `document.cookie` (только client-side, возвращает null на сервере)
- `clearToken()` стирает cookie
- `isAuthenticated()` = `!!getToken()`

**`frontend/src/components/layout/Header.tsx`** — `"use client"`, есть `useEffect` для scroll, НЕТ auth-логики. Текущие кнопки: «Вход для врачей» + «Записаться к врачу». Кнопки «Войти» нет совсем.

**`frontend/src/app/cabinet/patient/page.tsx`** — Server Component (нет `"use client"`), хардкод имени «Алекс Стерлинг». Кнопки «Выйти» нет.

**`frontend/src/lib/api.ts`** — `API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.med-as.ru/api/v1"`. Вызовы идут напрямую с браузера на `api.med-as.ru`.

**`frontend/src/proxy.ts`** — содержит middleware-логику (`matcher: ['/cabinet/:path*']`), НО расположен неверно. Next.js middleware должен быть `src/middleware.ts`. Защита маршрутов может не работать как middleware.

**CORS** (`backend/app/core/config.py`) — `CORS_ORIGINS` уже содержит `"https://saas.med-as.ru"` и `"https://med-as.ru"`. Конфиг корректный, нужна live-проверка.

### Архитектурное решение — Header auth

`/auth/me` вызывается с браузера → `https://api.med-as.ru/api/v1/auth/me` с заголовком `Authorization: Bearer <token>`. CORS разрешает `saas.med-as.ru` как origin — preflight пройдёт.

Когда залогинен, в хедере показываем:
- Имя пользователя + bonus_balance (chip)
- Кнопка «Мой кабинет» (замещает «Вход для врачей»)
- Кнопка «Выйти» (clearToken + router.push("/"))
- «Записаться к врачу» остаётся (основной CTA)

Logout в cabinet/patient — отдельный `LogoutButton` client component (не делать весь page.tsx клиентским).



---

## Сессия 2026-06-10 — Анализ и планирование MEDAS

### Анализ конкурентов

#### СберЗдоровье (sberhealth.ru)
**Сильные стороны:**
- Мощный поиск с фильтрами (специализация, район, цена, онлайн/офлайн)
- Профили врачей с отзывами и рейтингом
- Телемедицина + очная запись в одном месте
- Доверие бренда Сбера

**Слабые стороны:**
- Перегруженный UI, много лишнего
- Медленная загрузка некоторых страниц
- Слабый мобильный UX

**Что берём:** структуру поиска, карточку врача, двойной вид (список/карта)

---

#### Напоправку (napravku.ru)
**Сильные стороны:**
- Отличное SEO (каждый врач = отдельная индексируемая страница)
- Простой онбординг для клиник
- Детальные фильтры поиска
- Хорошая мобильная версия

**Слабые стороны:**
- Устаревший дизайн
- Нет бонусной системы
- Слабая аналитика для клиник

**Что берём:** структуру SEO-страниц, фильтры, онбординг клиник

---

### Ключевые технические решения

#### SEO-архитектура (критично для MEDAS)
```
/ (главная) — SSG, ревалидируется раз в час
/specialists/ — SSG список специализаций
/specialists/[slug]/ — SSR, страница врача (обновляется часто)
/clinics/ — SSG список клиник
/clinics/[slug]/ — SSR, страница клиники
/[city]/[specialty]/ — SSG, поиск по городу+специальности (ключевой для SEO)
```

Каждая страница врача = отдельный URL с:
- title: "Имя врача — Специальность в Городе | MEDAS"
- description: уникальное описание
- canonical URL
- StructuredData (schema.org/Physician)
- OG теги для соцсетей

#### URL-структура
```
Публичная часть:
/                          — главная
/search                    — поиск врачей
/doctor/[slug]             — профиль врача
/clinic/[slug]             — страница клиники  
/speciality/[slug]         — специализация
/[city]/[speciality]       — поиск по городу

Личные кабинеты (protected):
/cabinet/patient           — ЛК пациента
/cabinet/clinic            — ЛК клиники
/cabinet/doctor            — ЛК врача

Auth:
/login
/register
/register/clinic           — онбординг клиники
```

#### Бонусная система (логика)
- 1 запись = X бонусных баллов пациенту
- Бонусы = скидка на следующую запись через MEDAS (не деньги)
- Срок жизни бонусов: 12 месяцев
- Не выводятся, только тратятся внутри платформы (удержание)

#### Монетизация клиник
- Базовый план: бесплатно, лимит X лидов/месяц
- Стандарт: фикс/месяц, неограниченные лиды
- PRO: + поднятие в поиске + реклама
- CPA-опция: платят только за состоявшуюся запись

---

### Логотип MEDAS — анализ

**Светлая версия:** белый фон, "MED" в белом (невидим), зелёный [A|S] пилюля
**Тёмная версия:** тёмно-синяя пилюля-контейнер с "MED" белым + зелёная пилюля [A|S]

**Цвета (точные из логотипа):**
- Тёмно-синий: `#1B3A6B` (primary brand)
- Зелёный: `#52C88A` (accent, action)
- Белый: `#FFFFFF`

**Дизайн-концепция:** форма таблетки (capsule shape) → медицина, здоровье
Использовать везде: кнопки с border-radius высоким, бейджи pill-style

---

### Открытые вопросы (нужны ответы Игоря)

1. **Дизайн**: Как выгрузить из Stitch? (скриншоты / Figma-ссылка / Zeplin?)
2. **VPS**: IP-адрес, SSH доступ — передать при настройке
3. **Домен**: medas.ru уже есть? Какой домен?
4. **Город**: Запуск в одном городе или сразу все регионы?
5. **Контент**: Откуда берём первых врачей? (парсинг / ручной ввод / самостоятельная регистрация)
6. **Платежи**: ЮКасса или Stripe? (для РФ — ЮКасса предпочтительнее)
7. **Email-сервис**: SendGrid / Unisender / другое?

---

---

## Сессия 2026-06-12 — Анализ /search page

### Текущее состояние page.tsx (225 строк)
- Чистый server component (нет 'use client')
- Статический массив `doctors` — 3 записи
- Фильтры — только визуальные, без логики (checkbox/radio без обработчиков)
- Toggle сортировки — `<select>` без обработчика
- Кнопка «Записаться» ведёт на `/doctor/{id}` (должно быть `/doctor/{slug}`)
- Нет поисковой строки

### Архитектурное решение
Вариант 1 (простой): всё в одном файле page.tsx, 'use client', useState + useSearchParams
Вариант 2 (разделённый): page.tsx остаётся server, выносим SearchClient.tsx с 'use client'

→ **Выбираем Вариант 2**: в Next.js App Router лучше оставить page.tsx server component и вынести интерактив в `SearchClient.tsx`. Это правильный паттерн.

Файлы которые будут созданы/изменены:
- `frontend/src/app/search/page.tsx` — минимальные изменения (импорт SearchClient)
- `frontend/src/components/search/SearchClient.tsx` — вся интерактивность (новый файл)

### Дизайн-токены (из SITE_PLAN.md + DESIGN.md)
- Primary: #003087 | Secondary: #00a982 | BG: #f7f9fb
- Manrope (заголовки, extrabold) | Inter (текст)
- rounded-2xl карточки, rounded-xl кнопки, rounded-3xl модалки

### Открытые вопросы
- Стоит ли использовать компоненты 21st.dev? (Игорь спросил в сессии 2026-06-12)

### Приоритеты Phase 0

1. Выяснить как получить дизайн из Stitch
2. Онбординг файлов (заполнить шаблоны)
3. GitHub репозиторий
4. Docker инфраструктура

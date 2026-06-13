# MEDAS — Полный план разработки
**Версия:** 4.0 | **Дата:** 2026-06-12 | **Статус:** 🔄 В работе

---

## Current Phase
Фаза F — Страница /doctor/[slug]/booking (форма записи)

---

## Phases

### Фазы 1–4 — Главная страница (базовый редизайн)
**Статус:** ✅ complete (задеплоено 2026-06-12)

### Фаза A — Настройка инструментов (framer-motion + 21st.dev MCP)
**Статус:** ✅ complete (framer-motion v12.40.0 установлен, 21st.dev MCP подключён)

### Фаза B — Редизайн главной страницы с анимациями
**Статус:** ✅ complete (StatsSection, HeroSection, DoctorsSection, StarIcon, lib/motion.ts)

### Фаза C — Страница /search (интерактивная)
**Статус:** ✅ complete (SearchClient.tsx — фильтры + 9 карточек врачей)

---

### Фаза D — Страница /doctor/[slug] (профиль врача)
**Статус:** 🔄 in_progress
**Файлы:**
- `frontend/src/app/doctor/[slug]/page.tsx` — рефакторинг заглушки
- `frontend/src/components/doctor/DoctorHero.tsx` — новый компонент
- `frontend/src/components/doctor/DoctorTabs.tsx` — новый компонент
- `frontend/src/components/doctor/AppointmentSidebar.tsx` — новый компонент
- `frontend/src/components/doctor/SimilarDoctors.tsx` — новый компонент
- `frontend/src/components/ui/Breadcrumb.tsx` — переиспользуемый компонент

**Что есть (заглушка):** структура есть, но: иностранное имя, inline #hex вместо токенов, нет табов, нет generateMetadata, нет schema.org, нет похожих врачей, фото из lh3 (нестабильные).

- [ ] D.1 Типы + моки + metadata
      - Создать `frontend/src/lib/doctors.ts` — типы Doctor, Review, Service, TimeSlot
      - Mock-данные: Анна Соколова (Кардиолог, slug: anna-sokolova) — bio, образование, услуги с ценами, 3 отзыва, слоты
      - generateMetadata + schema.org/Physician JSON-LD в page.tsx
      - Breadcrumb компонент (переиспользуемый для /clinic/[slug])

- [ ] D.2 DoctorHero.tsx
      - Фото 320×400px (правильное соотношение), обёрнутое в offset-frame как в HeroSection
      - Имя, специальность, опыт (N лет)
      - Рейтинг со звёздами (StarIcon), количество отзывов
      - Бейджи: «Проверен MEDAS» (зелёный), «Принимает ДМС» (синий), «Онлайн-приём» (серый)
      - Бейдж «Принимает сегодня» — зелёный, выделенный
      - Кнопка «Записаться» с ценой (видна в мобиле)

- [ ] D.3 DoctorTabs.tsx (О враче / Услуги и цены / Отзывы)
      - Таб «О враче»: bio-текст + образование (вуз, год, степень) + теги специализаций
      - Таб «Услуги и цены»: таблица — услуга | длительность | цена + кнопка «Записаться»
      - Таб «Отзывы»: сводный рейтинг (4.9 / 5) + рейтинг-бары (5★: 87%, 4★: 8%...) + 3 карточки отзывов
      - useSearchParams для сохранения активного таба в URL (?tab=reviews)

- [ ] D.4 AppointmentSidebar.tsx (sticky на десктопе)
      - 5 дней: «Сегодня» / «Завтра» / «Пн» / «Вт» / «Ср» — горизонтальный выбор
      - Слоты по группам: Утро / День / Вечер
      - Цена консультации + CTA «Записаться» → /doctor/[slug]/booking
      - На мобиле: фиксированная кнопка внизу экрана (fixed bottom bar)

- [ ] D.5 SimilarDoctors.tsx + сборка page.tsx
      - 3 карточки врачей той же специальности (из моков)
      - Анимация stagger при появлении
      - Собрать page.tsx: Breadcrumb + DoctorHero + двухколоночный layout + DoctorTabs/AppointmentSidebar + SimilarDoctors

- [ ] D.6 Деплой + верификация
      - git commit + push
      - ./deploy.sh
      - curl https://saas.med-as.ru/doctor/anna-sokolova → HTTP 200
      - grep бандл: «Принимает сегодня»

---

### Фаза E — Страница /clinic/[slug] ⏳
**Файлы:**
- `frontend/src/lib/clinics.ts` — СОЗДАТЬ (типы + 2 мока)
- `frontend/src/components/clinic/ClinicHero.tsx` — СОЗДАТЬ
- `frontend/src/components/clinic/ClinicContent.tsx` — СОЗДАТЬ
- `frontend/src/components/clinic/ClinicInfoSidebar.tsx` — СОЗДАТЬ
- `frontend/src/app/clinic/[slug]/page.tsx` — ПЕРЕПИСАТЬ

- [ ] E.1 Типы + моки: `frontend/src/lib/clinics.ts`
      - Тип Clinic: slug, name, address, phone, rating, reviewCount, description
      - hours: { weekdays, weekends }, acceptsDMS, stats: { specialties, doctors, patientsPerYear }
      - services: string[], reviews: Review[], doctorSlugs: string[]
      - Мок 1: "centr-sovremennoy-meditsiny" — 4.9 / 1240 отз / ДМС: true / Пн-Пт 8-21 / Сб-Вс 9-18
      - Мок 2: "klinika-zdorovye" — 4.7 / 560 отз / ДМС: false / Пн-Сб 9-20
      - getClinicBySlug(), getClinics()

- [ ] E.2 ClinicHero.tsx (server component)
      - Заголовок, бейджи: «Проверена MEDAS» (зелёный), «ДМС» (синий, если acceptsDMS)
      - Рейтинг со звёздами, кол-во отзывов
      - Адрес, часы работы
      - Кнопка «Записаться» → /search?clinic=[slug] + кнопка «Поделиться»

- [ ] E.3 ClinicContent.tsx (server component)
      - AboutSection: bio + 3 стат-карточки с border-l-4 border-secondary
      - DoctorsSection: карточки врачей из doctorSlugs (getDoctorBySlug из lib/doctors.ts)
      - GallerySection: 6 плейсхолдеров 3×2, rounded-xl bg-surface-container
      - ServicesSection: теги направлений
      - ReviewsSection: карточки + empty state (если reviews.length === 0)
      - Заголовки секций: border-l-4 border-secondary pl-4

- [ ] E.4 ClinicInfoSidebar.tsx (client component — для sticky)
      - sticky top-[110px] max-h-[calc(100vh-126px)] overflow-y-auto
      - Блок «Информация»: адрес, телефон, часы ПН-ПТ / СБ-ВС
      - Кнопка «Записаться на приём» → /search?clinic=[slug]
      - Бонусный блок: «За каждый визит в клинике — бонусы MEDAS»
      - ДМС-карточка (если acceptsDMS): «Принимаем полисы ДМС»

- [ ] E.5 Переписать page.tsx
      - params: Promise<{slug}>, await params, getClinicBySlug → notFound()
      - generateMetadata: title = «[Название] — клиника в Москве | MEDAS»
      - schema.org/MedicalOrganization JSON-LD
      - Breadcrumb: Главная → Клиники → [название]
      - Layout: ClinicHero + grid lg:col-span-8/4 + мобильный сайдбар после контента

- [ ] E.6 Деплой + верификация
      - docker build -t medas-frontend:latest
      - docker save | gzip | ssh | gunzip | docker load
      - docker compose up -d --force-recreate frontend
      - curl https://saas.med-as.ru/clinic/centr-sovremennoy-meditsiny → HTTP 200
      - grep бандл: «Проверена MEDAS»

### Фаза E2 — Редизайн /clinic/[slug] «10x лучше конкурентов»
**Статус:** ✅ complete (коммит 1ec30e5, задеплоено 2026-06-12)
**Файлы:**
- `frontend/src/lib/clinics.ts` — ОБНОВИТЬ (7 новых полей)
- `frontend/src/components/ui/ReviewCard.tsx` — СОЗДАТЬ (единый)
- `frontend/src/components/ui/AddressMapBlock.tsx` — СОЗДАТЬ (единый)
- `frontend/src/components/clinic/ClinicHero.tsx` — ПЕРЕСТРОИТЬ
- `frontend/src/components/clinic/ClinicContent.tsx` — ПЕРЕСТРОИТЬ
- `frontend/src/components/clinic/ClinicInfoSidebar.tsx` — ПЕРЕСТРОИТЬ
- `frontend/src/components/doctor/DoctorContentSections.tsx` — ОБНОВИТЬ

- [ ] E2.1 Обновить `clinics.ts` — добавить: metro, heroImageUrl, bookingsLastMonth, scheduleByDay (7 дней), ratingCategories (4 категории), promotions, insuranceCompanies, certifications, parking
      Мок «Центр Современной Медицины»: metro «5 мин от м. Пушкинская», bookingsLastMonth: 47, scheduleByDay: Пн-Пт 8-21 / Сб-Вс 9-18 / Вс нет, ratingCategories: [Внимательность 4.9, Качество 4.8, Чистота 5.0, Цена 4.3], promotions: 2 акции с бонусами, insuranceCompanies: 4 компании, certifications: 3 сертификата

- [ ] E2.2 Создать единые компоненты в `components/ui/`:
      ReviewCard.tsx — аватар + имя + дата + звёзды + текст + verified badge. Использовать везде.
      AddressMapBlock.tsx — карта-заглушка (кликабельная → Google Maps) + метро с иконкой + адрес + телефон + кнопка «Проложить маршрут». Принимает props: address, phone, metro, mapsUrl.

- [ ] E2.3 Перестроить `ClinicHero.tsx`:
      - Hero-баннер 100% ширины, h-64 lg:h-80, bg-primary gradient если нет heroImageUrl
      - Поверх баннера: название клиники, бейджи «Проверена MEDAS» + «ДМС»
      - Под баннером: строка метрик — рейтинг / кол-во отзывов / специализаций / Статус (открыто/закрыто сейчас)
      - Правее: соцдоказательство «47 записей за последний месяц» + кнопки CTA

- [ ] E2.4 Перестроить `ClinicContent.tsx` — 7 секций:
      a) «О клинике» — bio + 3 стат-карточки (как было)
      b) «Врачи доступны сегодня» — карточки с фото + первый доступный слот сегодня + кнопка «Записаться»
      c) «Услуги и цены» — поиск + список строк (перенести из V2 ServicesSearch как server-friendly)
      d) «Рейтинг и отзывы» — сводный рейтинг + 4 бара по категориям + ReviewCard для каждого отзыва
      e) «Акции и бонусы» — карточки акций с бейджем скидки + начисляемые бонусы MEDAS
      f) «Фото клиники» — 6 плейсхолдеров + кнопка «Смотреть все фото»
      g) «Похожие клиники» — 2-3 карточки других клиник из getClinics()

- [ ] E2.5 Перестроить `ClinicInfoSidebar.tsx`:
      - AddressMapBlock (карта + метро + адрес + телефон + маршрут)
      - Расписание-сетка 7 дней (день | часы, выделить сегодня)
      - Кнопка «Записаться» (secondary, large)
      - Бонусный блок (amber)
      - ДМС: чипы с названиями страховых
      - Сертификаты: список с галочками
      - Парковка: иконка + текст

- [ ] E2.6 Обновить `DoctorContentSections.tsx`:
      - В секции «Клиника» заменить самодельный адрес-блок на AddressMapBlock
      - Добавить кнопку «Как добраться» (ссылка на Google Maps)

- [ ] E2.7 Деплой + верификация
      - docker build / save / load / force-recreate
      - curl https://saas.med-as.ru/clinic/centr-sovremennoy-meditsiny → 200
      - grep бандл: «записей за последний месяц»

### Фаза F — Страница /doctor/[slug]/booking 🔄
**Статус:** in_progress
**Stitch-дизайн:** «Запись к врачу с бонусами» (screen.png) — зафиксирован
**Конкуренты:** НаПоправку/СберЗдоровье заблокировали fetch — опираемся на Stitch + SITE_STRUCTURE.md

**Что делаем лучше конкурентов (ни у кого нет):**
1. Прогресс-шаги: Услуга → Дата → Пациент → Подтверждение (шаг подсвечен)
2. «Популярные слоты» — зелёная отметка «Последние 2 места»
3. Блок бонусов с живым перерасчётом — сразу рублёвая экономия
4. Экран успеха встроен (без редиректа) — slide-in анимация
5. Sticky нижняя панель на мобиле с итогом + кнопкой

**Файлы:**
- `frontend/src/app/doctor/[slug]/booking/page.tsx` — ПЕРЕПИСАТЬ (server, await params)
- `frontend/src/components/doctor/booking/DoctorBookingCard.tsx` — СОЗДАТЬ (server)
- `frontend/src/components/doctor/booking/BookingForm.tsx` — СОЗДАТЬ («use client», весь интерактив)

- [ ] F.1 Переписать `booking/page.tsx`
      - `params: Promise<{slug}>`, await params, getDoctorBySlug → notFound()
      - generateMetadata: «Запись к [Имя] — [специальность] | MEDAS»
      - Layout: хлебные крошки + grid lg:col-span-8/4
      - Импорт: DoctorBookingCard (левая колонка) + BookingForm (правая / основная)
      - Убрать старый хардкод (Александр Волков, lh3 фото, inline цвета)

- [ ] F.2 Создать `DoctorBookingCard.tsx` (server component)
      - Фото врача (80×80 круглое, из doctor.photo) + имя + специальность + опыт
      - Рейтинг (StarIcon) + кол-во отзывов
      - Verified badge («Проверенный специалист»)
      - «← Назад к профилю» ссылка + «Изменить врача» (→ /search)
      - Клиника: название + адрес (из doctor.clinic)

- [ ] F.3 Создать `BookingForm.tsx` («use client», полный интерактив)
      Состояние: selectedService | selectedDay | selectedSlot | useBonuses | name | phone | forWhom | agreed | submitted
      
      **Секция 1 — Выбор услуги:**
      - 3 карточки: «Первичная» 2 500₽ / «Повторная» 1 800₽ / «Онлайн» 2 000₽
      - Активная карточка — border-primary + bg-primary/5
      
      **Секция 2 — Дата и время:**
      - 5 дней (из doctor.slots): Сегодня / Завтра / Пт 13 / Сб 14 / Пн 16
      - Активный день — подсвечен primary
      - Слоты по группам «Утро / День / Вечер»
      - Популярные слоты (первые 2 в каждой группе): зелёная точка + «Популярно»
      - Недоступные слоты: серые, cursor-not-allowed

      **Секция 3 — Данные пациента:**
      - Input имя + Input телефон (с +7 prefix)
      - «Для кого»: radio [Для себя / Для члена семьи]
      - Textarea «Жалобы / цель визита» (необязательно)
      - Чекбокс согласия на обработку данных

      **Секция 4 — Бонусы + итог (правый sticky сайдбар на desktop, внизу формы на мобиле):**
      - «Использовать бонусы» toggle (баланс: 1 500 бонусов = 1 500 ₽)
      - Скидка до 10% от суммы: -250₽ (живой перерасчёт)
      - Итог к оплате (зачёркнутая цена если есть скидка)
      - «Вы получите +X бонусов за этот визит» (5% от цены)
      - Кнопка «Подтвердить запись» (primary, large, disabled если не выбраны дата+слот+согласие)
      
      **После submit → BookingSuccess (state: submitted = true):**
      - Анимация slide-in (transition opacity+translate)
      - Иконка ✓ в зелёном кружке + «Запись подтверждена!»
      - Детали: врач + дата + время + клиника
      - Зелёная карточка: «Начислено X бонусов»
      - Кнопки: «Перейти в Личный кабинет» + «Вернуться на главную»

      **Мобильная нижняя панель (fixed bottom, lg:hidden):**
      - Итоговая сумма + «Подтвердить запись» кнопка
      - Видна только если выбран слот

- [ ] F.4 Деплой + верификация
      - git commit + push
      - SSH на VPS: git clone + docker build --no-cache -t medas-frontend:latest + force-recreate
      - curl https://saas.med-as.ru/doctor/anna-sokolova/booking → HTTP 200
      - grep бандл: «Подтвердить запись»

### Фаза G — /promotions и /articles ⏳
- [ ] G.1 Список акций (сейчас 404)
- [ ] G.2 Список статей / блог (сейчас 404)

### Фаза H — Бонусная программа (MEDAS Бонусы) ⏳

**Концепция (зафиксировано 2026-06-12):**
- Начисление: 5% от стоимости визита (2 500 ₽ → 125 бонусов)
- Списание: до 10% от стоимости визита бонусами
- Регистрация: 500 приветственных бонусов
- 1 бонус = 1 рубль при оплате

**Точки присутствия бонусов на сайте:**

| Страница | Место | Контент |
|---|---|---|
| /doctor/[slug] | Сайдбар (уже добавлено) | +X бонусов за визит / списать до Y бонусов |
| /doctor/[slug] | MobileBookingBar | «+X бонусов» рядом с ценой |
| /doctor/[slug]/booking | Сводка заказа | Начисление + опция списания |
| /doctor/[slug]/booking | Экран успеха | «Начислено X бонусов» |
| /search | Карточка врача | Маленький бейдж «+X бонусов» |
| /register (ЛК) | Промо-баннер | 500 приветственных бонусов |
| /profile (ЛК) | Баланс бонусов | История начислений |
| Любая страница | Header (авторизованный) | Баланс бонусов в шапке |

- [ ] H.1 Добавить бонусы в MobileBookingBar (цена + «+X бонусов»)
- [ ] H.2 Добавить бонусный бейдж в карточку врача на /search
- [ ] H.3 Бонусы на /doctor/[slug]/booking — логика списания (чекбокс «Использовать N бонусов»)
- [ ] H.4 Экран успеха бронирования — «Начислено X бонусов»
- [ ] H.5 Промо-баннер «500 бонусов за регистрацию» на публичных страницах

---

## Decisions

| # | Решение | Обоснование |
|---|---|---|
| 1 | Переписывать компоненты, не создавать новые файлы | Не нужно менять импорты в page.tsx |
| 2 | Без Stitch — чистый профессиональный дизайн | Игорь попросил "по навыкам, без Stitch" |
| 3 | whitespace-nowrap на числах цен | Предотвратит перенос "35 000 ₽" |
| 4 | page.tsx остаётся server component | App Router паттерн: интерактив → отдельные компоненты |
| 5 | framer-motion для анимаций | Уже в проекте, даёт плавность без лишнего кода |
| 6 | 21st.dev через MCP, не npm | Компоненты вдохновляют дизайн, код под токены MEDAS |
| 7 | lib/motion.ts (staggerContainer/fadeUpItem) | Убирает дублирование Variants во всех компонентах |
| 8 | Компоненты doctor/ — отдельная папка | Изоляция: не смешивать с home/ компонентами |
| 9 | Breadcrumb — ui/ (переиспользуемый) | Нужен и для /clinic/[slug], /articles, /speciality |
| 10 | AppointmentSidebar — sticky top-28 desktop / fixed bottom mobile | По паттерну конкурентов (СберЗдоровье, НаПоправку) |

---

## Errors Encountered

| Время | Ошибка | Статус |
|---|---|---|
| — | — | — |

# MEDAS — Полный план разработки
**Версия:** 4.0 | **Дата:** 2026-06-12 | **Статус:** 🔄 В работе

---

## Current Phase
Фаза K — Клиники: больше данных + пагинация + /doctors + сценарии пациентов

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

### Фаза F — Страница /doctor/[slug]/booking
**Статус:** ✅ complete (коммит ca5dd97, задеплоено 2026-06-13)
- Файлы: booking/page.tsx + BookingForm.tsx + DoctorBookingCard.tsx
- 3 услуги, 5 дней, слоты Утро/День/Вечер, бонусы-toggle, экран успеха, mobile bottom bar

### Фаза F — Страница /doctor/[slug]/booking ✅ (архив)
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

### Фаза G — Страница /clinics 🔄
**Статус:** in_progress
**Stitch-образец:** «Врачи» (screen.png) — горизонтальные карточки + фильтры в sidebar
**Конкуренты:** НаПоправку/СберЗдоровье заблокировали fetch — опираемся на Stitch + анализ структуры

**Что делаем лучше конкурентов:**
1. «Работает сейчас» — real-time статус через isOpenNow() (уже есть в ClinicHero)
2. Соцдоказательство «47 записей за месяц» прямо в карточке
3. Metro-бейдж: «м. Пушкинская · 5 мин» с иконкой метро
4. Фильтр-чипы быстрого доступа: «Открыто сейчас» / «С ДМС» / «Стоматология»
5. Trust signals: «25 специализаций · 150 врачей»
6. Hover на карточке: тень + translate-y-0.5

**Файлы:**
- `frontend/src/app/clinics/page.tsx` — СОЗДАТЬ (server component)
- `frontend/src/components/clinic/ClinicsClient.tsx` — СОЗДАТЬ («use client», фильтры + список)
- `frontend/src/lib/clinics.ts` — ОБНОВИТЬ (specialtyHighlights: string[] + добавить mock-клиники)

- [ ] G.1 Обновить `clinics.ts`:
      - Добавить в тип Clinic: `specialtyHighlights: string[]`
      - Мок «Центр Современной Медицины»: specialtyHighlights: ["Кардиология", "Неврология", "УЗИ"]
      - Мок «Клиника Здоровье»: specialtyHighlights: ["Стоматология", "Терапия", "Педиатрия"]
      - Добавить 2-3 дополнительных мока для полноты списка
      - Убедиться что getClinics() есть (уже должна быть)

- [ ] G.2 Создать `ClinicsClient.tsx` («use client»)
      Получает список клиник через пропс, управляет фильтрацией на клиенте.

      **Фильтр-чипы (сверху):** «Все» / «Открыто сейчас» / «С ДМС» / «Стоматология» / «Детская»

      **Левый sidebar фильтров:**
      - Специализация: чекбоксы (Кардиология / Стоматология / Неврология / Педиатрия / Онкология)
      - Рейтинг мин: radio 4.5+ / 4.0+ / Любой
      - ДМС: toggle-switch
      - Работает сейчас: toggle-switch (isOpenNow())
      - Кнопка «Сбросить фильтры»

      **Основная область:**
      - H1 «Клиники в Москве» + «Найдено N клиник» + Сортировка (по рейтингу / по отзывам / по записям)
      - Карточки клиник (горизонтальные):
        Левая: цветной аватар-заглушка (первые 2 буквы + цвет по хешу) + название + адрес + metro-бейдж
        Рейтинг ★ + кол-во отзывов + «Проверена MEDAS»
        Центр: specialtyHighlights чипы + «Врачей: N · Специализаций: N» + ДМС чип (если есть)
        Правая: «X записей за месяц» + статус Открыто/Закрыто + кнопка «Выбрать врача» → /clinic/[slug]
      - Empty state если нет результатов по фильтрам

- [ ] G.3 Создать `app/clinics/page.tsx` (server component)
      - Метаданные: «Клиники в Москве — запись онлайн | MEDAS»
      - getClinics() → передать в ClinicsClient
      - Header + main + Footer
      - Breadcrumb: Главная → Клиники

- [ ] G.4 Деплой + верификация
      - git commit + push
      - SSH на VPS: git clone + docker build --no-cache + force-recreate
      - curl https://saas.med-as.ru/clinics → HTTP 200
      - grep бандл: «Найдено»

### Фаза J — AppointmentCalendar shared + /clinics редизайн 🔄

#### J.1 — Shared AppointmentCalendar компонент
- [ ] J.1.1 Создать src/components/ui/AppointmentCalendar.tsx (извлечь из AppointmentSidebarV2)
- [ ] J.1.2 Обновить AppointmentSidebarV2 → использует AppointmentCalendar
- [ ] J.1.3 BookingForm Step 2: grid 2-col — слева AppointmentCalendar, справа flatSlots
- [ ] J.1.4 TypeScript --noEmit + deploy + verify

#### J.2 — Полный редизайн /clinics
- [ ] J.2.1 Переписать ClinicCard.tsx (убрать initials, добавить accent bar + иконка + вес)
- [ ] J.2.2 Переписать ClinicsClient.tsx (облегчить sidebar, hero-шапка, улучшить spacing)
- [ ] J.2.3 Deploy + verify https://saas.med-as.ru/clinics

---

### Фаза I — Календарь + Stitch «Врачи» 🔄

#### I.1 — Переработать секцию «Дата и время» в BookingForm.tsx
- [ ] I.1.1 Заменить таб-кнопки дней на мини-календарь (сетка Пн–Вс, текущий месяц)
- [ ] I.1.2 Убрать группировку Утро/День/Вечер → плоский список слотов (объединить all + sort по времени)
- [ ] I.1.3 Обновить правый сайдбар: убрать dashed placeholder, показывать «День · Время» текстом
- [ ] I.1.4 TypeScript --noEmit + deploy + grep бандл

#### I.2 — Stitch «Врачи» HTML на сайт
- [ ] I.2.1 Скопировать code.html → frontend/public/stitch/vrachi.html
- [ ] I.2.2 Deploy + verify https://saas.med-as.ru/stitch/vrachi.html → 200
- [ ] I.2.3 Анализ Stitch vs /clinics → список рекомендаций по переносу

---

### Фаза K — Клиники: больше данных + пагинация ⏳

**Цель:** из 5 клиник → 12+ клиник, пагинация 6/стр, полноценный функционал каталога.

#### K.1 — Расширить lib/clinics.ts
- [ ] K.1.1 Добавить 7 новых клиник (итого 12+):
      - Стоматология «Белая Улыбка» (Чистые Пруды, ДМС: true)
      - Клиника «Семейный Врач» (Таганская, педиатрия, ДМС: false)
      - МедСкан Диагностика (Полежаевская, МРТ/КТ/УЗИ, ДМС: true)
      - Клиника «Европейский доктор» (Арбатская, хирургия, ДМС: true)
      - «Детский Доктор» (Сокольники, педиатрия до 18 лет, ДМС: true)
      - «МедПлюс» (Павелецкая, многопрофильная, ДМС: false)
      - «ОнкоМед» (Онкологический центр, Войковская, ДМС: true)
      - И ещё 2–3 для разнообразия (разные районы, рейтинги, специализации)

#### K.2 — Пагинация в ClinicsClient.tsx
- [ ] K.2.1 Добавить state `page` (текущая страница, по умолчанию 1)
- [ ] K.2.2 Константа `PAGE_SIZE = 6` — карточек на странице
- [ ] K.2.3 `paginatedItems = sorted.slice((page-1)*6, page*6)`
- [ ] K.2.4 При смене фильтров — сбрасывать на страницу 1 (useEffect)
- [ ] K.2.5 Компонент пагинации: «← Предыдущая | 1 2 3 … N | Следующая →»
- [ ] K.2.6 Deploy + verify

#### K.3 — Рекомендации по функционалу (для согласования с Игорем)
> Что ещё нужно для полноценного каталога клиник:
> 1. **Карта** — отображение клиник на Яндекс.Картах или Leaflet (по lat/lng)
> 2. **Геопоиск** — «Рядом со мной» (браузерная геолокация → сортировка по расстоянию)
> 3. **Поиск по названию** — строка поиска над карточками (фильтр по clinic.name)
> 4. **Избранное** — иконка ♡ на карточке, список в /cabinet/patient/favorites
> 5. **Сравнение** — выбрать 2–3 клиники → таблица сравнения по параметрам
> 6. **Акции** — фильтр «Только с акциями», бейдж на карточке клиники
> 7. **Метро-фильтр** — выбор станции из dropdown (по полю clinic.metro)
> 8. **Рейтинг в режиме реального времени** — skeleton loading пока грузятся данные с API

---

### Фаза L — Страница /doctors (каталог врачей) ⏳

> **Контекст:** В ТЗ нет `/doctors` URL. Есть `/search` (поиск врачей + клиник).
> Решение: создать `/doctors` как SEO-лендинг с hero + специализации + топ-врачи → линкует на /search.
> Также `/search` переименовать в «Поиск врачей» и добавить табы Врачи / Клиники.

#### L.1 — Добавить /doctors в ТЗ
- [ ] L.1.1 Обновить MEDAS_ТЗ_v1.0.md секцию 5.1:
      - Добавить `/doctors` — каталог всех врачей (SEO, специализации, топ-врачи)
      - Добавить `/clinics` — каталог клиник (уже есть, нужно легализовать в ТЗ)
      - Уточнить `/search` — унифицированный поиск с табами Врачи / Клиники

#### L.2 — Создать страницу /doctors
- [ ] L.2.1 Создать `app/doctors/page.tsx` (server component):
      - generateMetadata: «Врачи в Москве — запись онлайн | MEDAS»
      - Hero-шапка (аналог /clinics): gradient bg-primary + статистика (150+ врачей, 30+ специализаций)
      - Секция «По специализации» — 12 карточек-иконок (Кардиолог, Терапевт, Невролог и т.д.) → /search?specialty=X
      - Секция «Топ врачи» — 6 горизонтальных карточек из getDoctors()
      - Кнопка CTA «Смотреть всех врачей» → /search
      - Header + Footer

- [ ] L.2.2 Создать lib/doctors.ts экспорт `getDoctors()` если отсутствует
- [ ] L.2.3 Создать компонент `DoctorCard.tsx` в components/doctor/ (горизонтальная карточка для списков)
- [ ] L.2.4 Deploy + verify

---

### Фаза M — Сценарии пациентов + обновление ТЗ ⏳

#### M.1 — Создать PATIENT_SCENARIOS.md
- [ ] M.1.1 Расписать 6+ полных user journey (шаг за шагом):
      **Сценарий 1:** Пациент ищет клинику
      **Сценарий 2:** Пациент ищет конкретного врача по имени
      **Сценарий 3:** Пациент ищет по симптому → статья → врач/клиника
      **Сценарий 4:** Повторный визит (пациент уже был в ЛК)
      **Сценарий 5:** Запись для члена семьи (семейный профиль)
      **Сценарий 6:** Запись через реферальную ссылку друга
      **Сценарий 7:** Экстренный случай (ближайший доступный врач)
      **Сценарий 8:** Корпоративный ДМС (ищет принимающую ДМС клинику)
      Для каждого: точки входа → шаги → запись → уведомления → поствизитный поток

#### M.2 — Обновить ТЗ на основе сценариев
- [ ] M.2.1 Добавить недостающие страницы выявленные из сценариев:
      - `/symptoms` или `/search?q=симптом` — поиск по симптому
      - `/articles` — медблог (уже есть в ТЗ но без деталей UX)
      - Уведомления в реальном времени (popup/toast при входе в ЛК)
- [ ] M.2.2 Расширить секцию 6.2 «Система записи» — добавить полный flow уведомлений
- [ ] M.2.3 Добавить новые сценарии в ТЗ секцию «7. Пользовательские сценарии» (создать секцию)

#### M.3 — Обновить plan + progress
- [ ] M.3.1 task_plan.md — добавить фазы из выявленных сценариев:
      - Фаза N: /articles + /articles/[slug] (блог для SEO + симптом-поиск)
      - Фаза O: Уведомления — front-end страницы и интеграция SMS/email
      - Фаза P: /search версия 2 — табы Врачи/Клиники + симптом-поиск + геолокация
- [ ] M.3.2 progress.md — обновить «следующие шаги»

---

### Фаза N — Медицинский блог /articles ⏳ (выявлено из сценариев)

> **Приоритет:** высокий. Сценарий «симптом → статья → врач» — главный SEO-трафик для медмаркетплейса.
> Структура: статья имеет specialty_id → в конце статьи виджет «Врачи по теме» + «Запишитесь к специалисту».

- [ ] N.1 Типы и моки: `lib/articles.ts` — Article (slug, title, excerpt, content, specialty, readTime, publishedAt)
- [ ] N.2 Страница `/articles` — список статей с фильтром по специальности
- [ ] N.3 Страница `/articles/[slug]` — статья + виджет врачей + виджет записи
- [ ] N.4 Блок «Похожие статьи» + SEO (OpenGraph, schema.org/Article)
- [ ] N.5 Связать статьи с /search: в статье «Кардиология» → CTA «Найти кардиолога»

---

### Фаза G2 — /promotions и /articles ⏳
- [ ] G2.1 Список акций (сейчас 404)
- [ ] G2.2 Список статей / блог (сейчас 404)

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

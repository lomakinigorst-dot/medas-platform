# MEDAS — Полный план разработки
**Версия:** 4.0 | **Дата:** 2026-06-12 | **Статус:** 🔄 В работе

---

## Current Phase
Фаза D — Страница /doctor/[slug] (профиль врача)

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
- [ ] E.1 После /doctor/[slug] — аналогичная структура для клиники

### Фаза F — Страница /doctor/[slug]/booking ⏳
- [ ] F.1 Форма записи (шаги): выбор слота → контакты → подтверждение

### Фаза G — /promotions и /articles ⏳
- [ ] G.1 Список акций (сейчас 404)
- [ ] G.2 Список статей / блог (сейчас 404)

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

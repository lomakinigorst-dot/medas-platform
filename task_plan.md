# MEDAS — Полный план разработки
**Версия:** 3.0 | **Дата:** 2026-06-12 | **Статус:** 🔄 В работе

---

## Current Phase
Фаза A — Настройка инструментов (framer-motion + 21st.dev MCP)

---

## Phases

### Фазы 1–4 — Главная страница (базовый редизайн)
**Статус:** ✅ complete (задеплоено 2026-06-12)

- [x] 1.1–1.3 HeroSection, OffersSection, StatsSection — критические фиксы
- [x] 2.1–2.4 Header v1 — логотип, навигация, topbar, CTA
- [x] 3.1–3.4 Логотип logo-dark.png везде
- [x] 4.1–4.3 Деплой + верификация бандла

---

### Фаза A — Настройка инструментов
**Статус:** ⏸️ pending → стартуем сейчас

- [ ] A.1 Подключить 21st.dev MCP (`@21st-dev/magic`) через /update-config скилл
      Токен: в .claude/settings.json (НЕ коммитить в git)
- [ ] A.2 Установить framer-motion: `cd frontend && npm install framer-motion`
      Проверить: grep framer-motion frontend/package.json

---

### Фаза B — Редизайн главной страницы с анимациями
**Статус:** ⏸️ pending (после A)
**Файлы:** components/layout/Header.tsx, components/home/*.tsx

- [ ] B.1 Header.tsx — мобильное гамбургер-меню (useState, lg:hidden)
- [ ] B.2 HeroSection.tsx — framer-motion fadeIn + slideUp при загрузке
- [ ] B.3 StatsSection.tsx — анимированные счётчики + секция «Доверие»
      (500 000+ пациентов, 10 000+ врачей, 95% довольных — с анимацией цифр)
- [ ] B.4 ClinicsSection.tsx + SpecialtiesSection.tsx — stagger hover-анимации карточек
- [ ] B.5 CTASection.tsx — viewport animation (появление при скролле)
- [ ] B.6 Деплой главной на VPS + верификация (`curl https://saas.med-as.ru/ | grep "Записаться"`)

---

### Фаза C — Страница /search (интерактивная)
**Статус:** ⏸️ pending (после B)
**Файлы:** app/search/page.tsx + NEW: components/search/SearchClient.tsx

- [ ] C.1 Создать `components/search/SearchClient.tsx` ('use client')
      - useState для query, filters, viewMode
      - useSearchParams для URL-параметров
- [ ] C.2 Поисковая строка вверху (по имени / специальности / симптому)
- [ ] C.3 Расширенные фильтры: +метро, +ДМС, +онлайн-приём
- [ ] C.4 Чипы активных фильтров с × (сброс конкретного)
- [ ] C.5 9 карточек врачей (добавить 6 моковых записей с разными специальностями)
- [ ] C.6 framer-motion stagger-анимация карточек при появлении/фильтрации
- [ ] C.7 Переключатель «Список / Карта» (карта = заглушка с иконой MapPin)
- [ ] C.8 Обновить `app/search/page.tsx` — импортировать SearchClient
- [ ] C.9 Деплой /search + верификация (`curl https://saas.med-as.ru/search | grep "ДМС"`)

---

## Decisions

| # | Решение | Обоснование |
|---|---|---|
| 1 | Переписывать компоненты, не создавать новые файлы | Не нужно менять импорты в page.tsx |
| 2 | Без Stitch — чистый профессиональный дизайн | Игорь попросил "по навыкам, без Stitch" |
| 3 | whitespace-nowrap на числах цен | Предотвратит перенос "35 000 ₽" |
| 4 | page.tsx остаётся server component | App Router паттерн: интерактив → SearchClient.tsx |
| 5 | framer-motion для анимаций | Уже нет в проекте, даст плавность без лишнего кода |
| 6 | 21st.dev через MCP, не npm | Компоненты вдохновляют дизайн, но код пишется под токены MEDAS |

---

## Errors Encountered

| Время | Ошибка | Статус |
|---|---|---|
| — | — | — |

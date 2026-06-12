# CODE_MAP — Карта кода MEDAS
> Обновлён: 2026-06-12 | Читать вместо поиска по коду каждую сессию

---

## БЫСТРЫЙ ПОИСК (TOC)

| Раздел | Строка |
|---|---|
| СТРУКТУРА ПРОЕКТА | 22 |
| СТРАНИЦЫ → КОМПОНЕНТЫ | 42 |
| КОМПОНЕНТЫ ГЛАВНОЙ | 58 |
| LAYOUT-КОМПОНЕНТЫ | 72 |
| BACKEND — API ENDPOINTS | 82 |
| ДИЗАЙН-СИСТЕМА | 87 |
| ДЕПЛОЙ — команды | 118 |
| ФАЙЛЫ — НЕ ТРОГАТЬ | 148 |
| ВАЖНЫЕ ПАТТЕРНЫ | 157 |

---

## СТРУКТУРА ПРОЕКТА

```
Сайт медас/
├── frontend/                   # Next.js 16.2.9 + React 19 + TypeScript
│   ├── src/
│   │   ├── app/                # App Router (страницы)
│   │   │   ├── page.tsx        # Главная /
│   │   │   ├── layout.tsx      # Root layout (шрифты, Header, Footer)
│   │   │   ├── globals.css     # Дизайн-токены MEDAS + Tailwind v4
│   │   │   ├── login/          # /login — страница входа
│   │   │   ├── search/         # /search — поиск врачей
│   │   │   ├── services/       # /services — услуги
│   │   │   ├── doctor/[slug]/  # /doctor/id — профиль врача + /booking
│   │   │   ├── clinic/[slug]/  # /clinic/id — профиль клиники
│   │   │   └── cabinet/        # ЛК: /patient /clinic /doctor
│   │   ├── components/
│   │   │   ├── home/           # Секции главной страницы
│   │   │   ├── layout/         # Header, Footer, CabinetLayout
│   │   │   └── ui/             # shadcn/ui компоненты (button.tsx)
│   │   └── lib/
│   │       └── utils.ts        # cn() helper
│   ├── public/
│   │   ├── logo-dark.png       # Логотип для светлых фонов (156×44)
│   │   └── logo-light.png      # Логотип для тёмных фонов (156×44)
│   ├── Dockerfile
│   └── package.json
├── deploy.sh                   # Скрипт деплоя (docker build → scp → VPS)
├── CODE_MAP.md                 # Этот файл
├── PLAN.md                     # Мастер-план (фазы разработки)
├── SITE_PLAN.md                # 35 страниц с ТЗ (v2.0, 2026-06-12)
├── progress.md                 # Трекер текущего шага
├── task_plan.md                # Детальный план текущего этапа
├── MEDAS_ТЗ_v1.0.md           # Техническое задание
└── MEDAS_Финплан_v1.0.md      # Финансовый план
```

---

## FRONTEND — СТРАНИЦЫ → КОМПОНЕНТЫ

| URL | Файл | Компоненты |
|---|---|---|
| `/` | `app/page.tsx` | HeroSection, StatsSection, SpecialtiesSection, OffersSection, ClinicsSection, ArticlesSection, CTASection |
| `/login` | `app/login/page.tsx` | inline (нет отдельного компонента) |
| `/search` | `app/search/page.tsx` | inline |
| `/services` | `app/services/page.tsx` | inline |
| `/doctor/[slug]` | `app/doctor/[slug]/page.tsx` | inline |
| `/doctor/[slug]/booking` | `app/doctor/[slug]/booking/page.tsx` | inline |
| `/clinic/[slug]` | `app/clinic/[slug]/page.tsx` | inline |
| `/cabinet/patient` | `app/cabinet/patient/page.tsx` | CabinetLayout |
| `/cabinet/patient/medcard` | `app/cabinet/patient/medcard/page.tsx` | CabinetLayout |
| `/cabinet/patient/family` | `app/cabinet/patient/family/page.tsx` | CabinetLayout |
| `/cabinet/patient/bonuses` | `app/cabinet/patient/bonuses/page.tsx` | CabinetLayout |
| `/cabinet/clinic` | `app/cabinet/clinic/page.tsx` | CabinetLayout |
| `/cabinet/clinic/reports` | `app/cabinet/clinic/reports/page.tsx` | CabinetLayout |
| `/cabinet/doctor` | `app/cabinet/doctor/page.tsx` | CabinetLayout |

---

## КОМПОНЕНТЫ ГЛАВНОЙ (`src/components/home/`)

| Компонент | Файл | Что делает |
|---|---|---|
| `HeroSection` | `HeroSection.tsx` | Hero с поисковой строкой и CTA. padding: `pb-20 lg:pb-28 pt-10 lg:pt-14` |
| `StatsSection` | `StatsSection.tsx` | 4 статистики (10 000+ врачей, 500+ клиник, 1 000 000+ пациентов, 4.9 рейтинг). IntersectionObserver. `"use client"` |
| `SpecialtiesSection` | `SpecialtiesSection.tsx` | Специализации (карточки). Ссылка → /search |
| `OffersSection` | `OffersSection.tsx` | 3 акции: Полный чекап / Дерматология / Семейный план. Цены с `&nbsp;` (без переносов) |
| `ClinicsSection` | `ClinicsSection.tsx` | Карточки клиник |
| `ArticlesSection` | `ArticlesSection.tsx` | 3 статьи (Кардиология / Неврология / Стоматология). Server component |
| `CTASection` | `CTASection.tsx` | Финальный призыв к действию |

---

## LAYOUT-КОМПОНЕНТЫ (`src/components/layout/`)

| Компонент | Файл | Ключевые детали |
|---|---|---|
| `Header` | `Header.tsx` | `"use client"`. Двухуровневый: topbar (телефон 8 800 123-45-67 + часы) + nav (лого, меню, CTA). Мобильный drawer. Лого: `/logo-dark.png` 156×44 |
| `Footer` | `Footer.tsx` | Лого: `/logo-dark.png` 120×34 |
| `CabinetLayout` | `CabinetLayout.tsx` | `"use client"`. Sidebar + header. Лого: `/logo-dark.png` 110×32. Роли: patient/clinic/doctor |

**Высота Header:**
- Mobile (только nav): ~68px → `<main>` получает `pt-[68px]`
- Desktop (topbar + nav): ~104px → `<main>` получает `lg:pt-[104px]`

---

## BACKEND — API ENDPOINTS

> Backend (FastAPI) ещё не реализован. Эндпоинты в разработке по PLAN.md Фаза 2+

---

## ДИЗАЙН-СИСТЕМА

**Файл токенов:** `frontend/src/app/globals.css`

```
Основной (primary):    #003087  (синий MEDAS)
Акцентный (secondary): #00a982  (зелёный MEDAS)
Tertiary:              #00598a  (голубой)
Фон (background):      #f7f9fb
Поверхность:           #ffffff
Текст основной:        #191c1e
Текст вторичный:       #434655
Outline:               #737686
Outline-variant:       #c3c6d7
Ошибка:                #ba1a1a
```

**CSS-переменные (Tailwind v4 `@theme`):**
```css
--color-primary            → text-primary, bg-primary, border-primary
--color-secondary          → text-secondary, bg-secondary
--color-surface            → bg-surface
--color-on-surface         → text-on-surface
--color-surface-container-lowest → bg-surface-container-lowest (белый)
```

**Шрифты:**
```
--font-headline: Manrope ExtraBold  → font-headline (заголовки)
--font-body:     Inter              → font-body (текст)
```

**Breakpoints (Tailwind default):**
```
sm:  640px
md:  768px
lg:  1024px  ← основной (мобиле vs десктоп)
xl:  1280px
2xl: 1536px
```

**Логотип:**
```
/logo-dark.png  — на светлых фонах (Header, Footer, Login, CabinetLayout)
/logo-light.png — на тёмных фонах (будущие тёмные секции)
ВСЕГДА: <Image src="/logo-dark.png" alt="MEDAS" width={N} height={N} />
НИКОГДА: CSS-имитация логотипа через span/div
```

**CSS-классы (globals.css):**
```
.glass-nav           — стекломорфизм навигации
.hero-gradient       — градиент hero секции
.btn-primary-gradient — градиент кнопки CTA
```

---

## ДЕПЛОЙ

**VPS:** `85.239.44.14` | SSH: `root@85.239.44.14 -i ~/.ssh/server_key`
**URL:** `https://saas.med-as.ru`
**Путь на VPS:** `/app/medas-platform`
**Docker Compose:** `docker-compose.yml` на VPS

### Деплой frontend
```bash
# Из корня проекта (Сайт медас/):
bash deploy.sh

# Что происходит внутри:
# 1. docker build --platform linux/amd64 -t medas-frontend:latest ./frontend
# 2. docker save → gzip → scp на VPS
# 3. docker load + docker compose up -d --force-recreate frontend
# 4. curl https://saas.med-as.ru/ → HTTP 200
```

### Верификация деплоя (обязательно после каждого деплоя)
```bash
# Проверить что новый код в бандле (HTTP 200 ≠ деплой)
ssh -i ~/.ssh/server_key root@85.239.44.14 \
  "docker exec $(docker ps -q -f name=frontend) grep -rl 'УНИКАЛЬНАЯ_СТРОКА' /app/.next/server/chunks/ 2>/dev/null"

# Примеры строк: 'Записаться к врачу', 'Полный чекап', 'Медицинский блог'
```

### SSH на VPS
```bash
ssh -i ~/.ssh/server_key root@85.239.44.14
cd /app/medas-platform
docker compose logs frontend --tail=50
```

---

## ФАЙЛЫ — НЕ ТРОГАТЬ БЕЗ ПРИЧИНЫ

| Файл | Почему осторожно |
|---|---|
| `frontend/src/app/globals.css` | Дизайн-токены всего проекта — изменение сломает все компоненты |
| `frontend/src/app/layout.tsx` | Root layout — шрифты, meta, глобальная структура |
| `frontend/public/logo-dark.png` | Бренд-актив — менять только новыми файлами от Игоря |
| `frontend/public/logo-light.png` | Бренд-актив |
| `deploy.sh` | Рабочий скрипт деплоя — менять осторожно, тестировать перед коммитом |

---

## ВАЖНЫЕ ПАТТЕРНЫ

### Добавление нового компонента главной страницы
```
1. Создать frontend/src/components/home/NewSection.tsx
2. Импортировать в frontend/src/app/page.tsx
3. Добавить в таблицу КОМПОНЕНТЫ ГЛАВНОЙ выше
4. Тестировать на https://saas.med-as.ru
```

### Использование логотипа (ОБЯЗАТЕЛЬНО везде)
```tsx
import Image from "next/image";
// Светлый фон:
<Image src="/logo-dark.png" alt="MEDAS" width={156} height={44} className="object-contain" />
// Тёмный фон:
<Image src="/logo-light.png" alt="MEDAS" width={156} height={44} className="object-contain" />
```

### Цены без переноса строки
```tsx
// ПРАВИЛЬНО — &nbsp; предотвращает перенос внутри числа:
<span className="whitespace-nowrap">25&nbsp;000&nbsp;₽</span>
// НЕПРАВИЛЬНО — "25 000 ₽" может разорваться на мобиле
```

### Клиентский компонент (анимации, состояние)
```tsx
"use client"; // первая строка файла
// Использовать для: StatsSection (IntersectionObserver), Header (drawer)
// НЕ использовать если компонент только рендерит статичный HTML — server component быстрее
```

---

> Этот файл — живой документ. Обновлять после каждой задачи которая добавляет новые компоненты, страницы или меняет архитектуру. При добавлении нового раздела — обновить TOC-таблицу выше.

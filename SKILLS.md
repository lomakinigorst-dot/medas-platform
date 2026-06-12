# SKILLS — Справочник скиллов Claude Code
> Обновлено: 2026-06-12 | Запустить `claude skills` для актуального списка

---

## Как вызвать скилл

В чате с Claude Code напиши `/имя-скилла` (например `/test`).
Некоторые скиллы имеют пространство имён: `/planning-with-files:plan`.

---

## ПЛАНИРОВАНИЕ И УПРАВЛЕНИЕ

### `/planning-with-files:plan`
**Что делает:** Создаёт структурированный PLAN.md с фазами, задачами и подзадачами в стиле Manus. Анализирует кодовую базу, выявляет зависимости, предлагает порядок выполнения.
**Когда использовать:**
- Получил 3+ задачи от пользователя
- Нетривиальная задача с неочевидными шагами
- Начало нового функционала или фазы разработки
**Пример:** `/planning-with-files:plan реализовать систему авторизации с JWT и ролями`

---

### `/planning-with-files:status`
**Что делает:** Показывает текущий статус активного плана — что выполнено, что в процессе, что осталось. Читает PLAN.md и progress.md.
**Когда использовать:** В начале сессии для проверки незавершённых задач, после перерыва в работе.
**Пример:** `/planning-with-files:status`

---

## КАЧЕСТВО КОДА

### `/test`
**Что делает:** Запускает smoke-тесты — быстрые проверки основного функционала. Проверяет что ничего не сломалось после изменений.
**Когда использовать:** После каждого завершённого блока кода. После деплоя на сервер.
**Пример:** `/test`

---

### `/simplify`
**Что делает:** Ревью изменённого кода — находит over-engineering, дублирование, нарушения стиля, избыточные абстракции. Предлагает упрощения.
**Когда использовать:** При изменении 3+ файлов или 100+ строк кода. Перед созданием PR.
**Пример:** `/simplify`

---

### `/security-review`
**Что делает:** Security-аудит текущей ветки. Проверяет: SQL-инъекции, XSS, открытые секреты в коде, незащищённые endpoint'ы, проблемы с авторизацией, OWASP Top 10.
**Когда использовать:** ОБЯЗАТЕЛЬНО — после любых изменений авторизации, API endpoint'ов, работы с пользовательскими данными.
**Пример:** `/security-review`

---

### `/review`
**Что делает:** Полное ревью pull request'а. Анализирует diff, проверяет логику, находит баги, предлагает улучшения.
**Когда использовать:** Перед мержем ветки в main. При работе в команде.
**Пример:** `/review` или `/review #42` (для конкретного PR на GitHub)

---

## UI/UX ДИЗАЙН

### `/ui-ux-pro-max:ui-ux-pro-max`
**Что делает:** Продвинутый UI/UX дизайн — 50+ стилей, 161 цветовая палитра. Создаёт дизайн-систему, компоненты, layout'ы с профессиональным уровнем полировки.
**Когда использовать:** Разработка дизайн-системы с нуля. Landing page. Когда нужен дизайн уровня Figma, но в коде.
**Пример:** `/ui-ux-pro-max:ui-ux-pro-max create modern SaaS pricing page, violet palette, glassmorphism`

---

### `/shadcnblocks:shadcn-ui`
**Что делает:** Готовые блоки для landing pages на основе shadcn/ui — hero, features, pricing, testimonials, CTA, footer.
**Когда использовать:** Быстрое создание landing page. Маркетинговые страницы. Когда уже используется shadcn/ui в проекте.
**Пример:** `/shadcnblocks:shadcn-ui create hero section with animated gradient background`

---

## ДЕПЛОЙ

### `/vercel:deploy`
**Что делает:** Деплоит проект на Vercel. Запускает build, проверяет конфигурацию, публикует.
**Когда использовать:** После завершения фичи для выкатки на Vercel.
**Пример:** `/vercel:deploy`

---

### `/vercel:logs`
**Что делает:** Показывает логи Vercel деплоя и runtime логи функций.
**Когда использовать:** Дебаггинг после неудачного деплоя. Поиск ошибок в production.
**Пример:** `/vercel:logs`

---

### `/vercel:setup`
**Что делает:** Настраивает Vercel для проекта — создаёт проект, подключает репозиторий, настраивает env variables.
**Когда использовать:** Первый деплой нового проекта на Vercel.
**Пример:** `/vercel:setup`

---

## РАЗРАБОТКА API

### `/claude-api`
**Что делает:** Помощник для работы с Anthropic API/SDK. Знает последние модели, методы, параметры. Помогает реализовать стриминг, tool use, vision, multi-turn conversations.
**Когда использовать:** Интеграция Claude в продукт. Вопросы по Anthropic SDK. Реализация AI-функций.
**Пример:** `/claude-api implement streaming chat with tool use and error handling`

---

## АВТОМАТИЗАЦИЯ

### `/loop`
**Что делает:** Запускает задачу повторно с заданным интервалом. Поддерживает итеративное улучшение — каждый цикл берёт результат предыдущего.
**Когда использовать:** Мониторинг состояния. Итеративное улучшение кода за несколько проходов. Polling внешних сервисов.
**Пример:** `/loop каждые 30 секунд проверяй статус деплоя`

---

### `/schedule`
**Что делает:** Планирует выполнение задачи — одноразово (в конкретное время) или по cron-расписанию.
**Когда использовать:** Запланировать ночной деплой. Регулярные отчёты. Автоматические проверки.
**Пример:** `/schedule запустить тесты каждый день в 9:00`

---

## УТИЛИТЫ

### `/init`
**Что делает:** Инициализирует CLAUDE.md для нового проекта интерактивно. Задаёт вопросы о стеке, командe, правилах и генерирует файл.
**Когда использовать:** Начало работы с чужим проектом без CLAUDE.md. Альтернатива ручному заполнению шаблона.
**Пример:** `/init`

---

### `/humanizer`
**Что делает:** Убирает AI-стиль из текста — делает его естественным, человеческим. Сохраняет смысл, убирает шаблонные фразы, излишнюю вежливость, структуру списков там где не нужна.
**Когда использовать:** После генерации маркетинговых текстов. Для email-рассылок. Для контента, который не должен выглядеть как AI.
**Пример:** `/humanizer [вставь текст]`

---

### `/update-config`
**Что делает:** Обновляет `.claude/settings.json` — добавляет хуки, настраивает разрешения, подключает MCP серверы.
**Когда использовать:** Настройка автоматических хуков (pre/post edit). Добавление нового MCP сервера. Изменение разрешений инструментов.
**Пример:** `/update-config добавь хук который запускает npm run lint после каждого редактирования .ts файла`

---

### `/keybindings-help`
**Что делает:** Показывает все доступные горячие клавиши Claude Code.
**Когда использовать:** Когда забыл шорткат. При начале работы с Claude Code.
**Пример:** `/keybindings-help`

---

## МЕДИА (Runway API)

### `/runway-api:*`
**Что делает:** Интеграция с Runway ML API — генерация видео из текста/изображений, генерация изображений, обработка аудио.
**Когда использовать:** Создание промо-видео. Генерация иллюстраций. AI-контент для маркетинга.
**Примеры:**
- `/runway-api:video generate 5-second product demo video from screenshot`
- `/runway-api:image generate hero image for landing page`

---

## ФИНАНСОВОЕ И БИЗНЕС-ПЛАНИРОВАНИЕ

> Установлено: 2026-06-12. Команды доступны как `/stratarts:имя-команды`. Skills доступны автоматически.
> Путь команд: `.claude/commands/stratarts/` | Путь skills: `.claude/skills/`

---

### Стратегия и бизнес-план (stratarts — 27 команд)

Используются для подготовки финансового плана, инвесторского питча и стратегии MEDAS.

| Команда | Что делает | Когда использовать |
|---|---|---|
| `/stratarts:business-idea-validator` | Валидация бизнес-идеи (JTBD, BMC, скоринг 1-10) | Перед началом — проверить гипотезы MEDAS |
| `/stratarts:market-opportunity-analyzer` | TAM/SAM/SOM + конкурентная карта | Оценить объём рынка медмаркетплейсов РФ |
| `/stratarts:financial-model-architect` | 3-5 летняя финансовая модель, P&L, cash flow, сценарии | **Основной** — строить финмодель MEDAS |
| `/stratarts:investor-pitch-deck-builder` | 10-15 слайдов pitch deck для инвесторов | Подготовка к инвесторским встречам |
| `/stratarts:investor-brief-writer` | Краткий инвестиционный меморандум (1-2 стр.) | Перед питч-деком — outline для инвестора |
| `/stratarts:fundraising-strategy-planner` | Стратегия привлечения инвестиций (раунд, оценка, тайминг) | Планирование раунда |
| `/stratarts:competitive-intelligence` | Глубокий анализ конкурентов | Анализ Напоправку / СберЗдоровье / Продокторов |
| `/stratarts:go-to-market-planner` | GTM стратегия: каналы, сегменты, тактика запуска | Как привлекать первые клиники и пациентов |
| `/stratarts:value-proposition-crafter` | Ценностное предложение для каждого сегмента | УТП для клиник, врачей, пациентов |
| `/stratarts:pricing-strategy-architect` | Модель ценообразования и тарифные планы | Комиссия / подписка / продвижение |
| `/stratarts:strategic-roadmap-builder` | Дорожная карта с OKR и milestones | Привязать фазы ТЗ к дате |
| `/stratarts:metrics-dashboard-designer` | Ключевые метрики и дашборд | KPI для инвесторов и команды |
| `/stratarts:customer-persona-builder` | Портреты целевых пользователей | Сегментация пациентов и клиник |
| `/stratarts:growth-hacking-playbook` | Тактики роста на ранних стадиях | Как масштабироваться с 0 до первых 1000 пользователей |
| `/stratarts:seo-content-planner` | SEO и контент-стратегия | Органический трафик — медицинские статьи, поиск врачей |
| `/stratarts:operational-playbook-creator` | Операционные процессы и команда | SOP для онбординга клиник |

**Полный список всех 27 команд:** `.claude/commands/stratarts/`

---

### Финансовый анализ (finance skills — 3 скилла)

Используются для расчётов: юнит-экономика, оценка, финансовые коэффициенты.

| Скилл | Что делает | Когда использовать |
|---|---|---|
| `saas-metrics-coach` | Рассчитывает ARR/MRR, CAC, LTV, churn, NRR, бенчмаркирует по индустрии | Проверить здоровье бизнеса, считать break-even |
| `financial-analyst` | DCF-оценка, коэффициентный анализ, бюджет vs факт, прогнозы | Углублённый финансовый анализ, оценка компании |
| `finance-skills` | Общий финансовый советник (сценарный анализ, тренды) | Быстрые финансовые расчёты и советы |

**Пример использования saas-metrics-coach:**
Просто напиши: «Текущий MRR — 150 000 руб., прошлый месяц — 120 000 руб., клиентов — 8 клиник, отток — 1 клиника»
Claude рассчитает MRR growth, churn rate, LTV:CAC и сравнит с бенчмарками SaaS.

---

### Рекомендованный порядок работы для финплана MEDAS

```
1. /stratarts:business-idea-validator     → проверить гипотезы (уже можно пропустить)
2. /stratarts:market-opportunity-analyzer → TAM/SAM/SOM рынка медмаркетплейсов РФ
3. /stratarts:competitive-intelligence   → анализ Напоправку, СберЗдоровье, Продокторов
4. /stratarts:value-proposition-crafter  → УТП MEDAS для клиник, врачей, пациентов
5. /stratarts:pricing-strategy-architect → финальная модель монетизации
6. saas-metrics-coach                    → юнит-экономика (CAC, LTV, break-even)
7. /stratarts:financial-model-architect  → 5-летняя финансовая модель с 3 сценариями
8. /stratarts:strategic-roadmap-builder  → дорожная карта с OKR по фазам
9. /stratarts:investor-pitch-deck-builder → pitch deck для инвесторов
```

---

### Как установить эти скиллы в новый проект

```bash
# Команды stratarts (27 команд)
git clone --depth=1 https://github.com/maigentic/stratarts.git /tmp/stratarts
mkdir -p .claude/commands/stratarts
cp /tmp/stratarts/stratarts/commands/*.md .claude/commands/stratarts/

# Finance skills (юнит-экономика, DCF, SaaS-метрики)
git clone --depth=1 --filter=blob:none --sparse https://github.com/alirezarezvani/claude-skills.git /tmp/claude-skills
cd /tmp/claude-skills && git sparse-checkout set finance
mkdir -p .claude/skills
cp -r /tmp/claude-skills/finance/skills/financial-analyst .claude/skills/
cp -r /tmp/claude-skills/finance/skills/saas-metrics-coach .claude/skills/
cp -r /tmp/claude-skills/finance/skills/finance-skills .claude/skills/
```

---

## БЫСТРАЯ ШПАРГАЛКА

| Задача | Команда |
|---|---|
| Спланировать 3+ задачи | `/planning-with-files:plan` |
| Проверить статус плана | `/planning-with-files:status` |
| Протестировать после изменений | `/test` |
| Ревью качества кода | `/simplify` |
| Security проверка | `/security-review` |
| Ревью PR | `/review` |
| UI компоненты / редизайн / дизайн-система | `/ui-ux-pro-max:ui-ux-pro-max` |
| Landing page | `/shadcnblocks:shadcn-ui` |
| Деплой на Vercel | `/vercel:deploy` |
| Интеграция Claude API | `/claude-api` |
| Повторять задачу по интервалу | `/loop` |
| Запланировать задачу на время | `/schedule` |
| Убрать AI-стиль из текста | `/humanizer` |
| Генерация видео/изображений | `/runway-api:*` |
| Настроить хуки/MCP | `/update-config` |
| **Финансовая модель (P&L, cash flow, сценарии)** | `/stratarts:financial-model-architect` |
| **Pitch deck для инвесторов** | `/stratarts:investor-pitch-deck-builder` |
| **Анализ рынка (TAM/SAM/SOM)** | `/stratarts:market-opportunity-analyzer` |
| **Конкурентный анализ** | `/stratarts:competitive-intelligence` |
| **GTM стратегия** | `/stratarts:go-to-market-planner` |
| **SaaS метрики (CAC/LTV/churn/NRR)** | `saas-metrics-coach` (skill) |
| **DCF оценка + финансовые коэффициенты** | `financial-analyst` (skill) |

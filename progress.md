# progress.md — Трекер текущего шага
> Обновлять после каждой завершённой задачи (Блок 0.5б в CLAUDE.md)

---

## БЫСТРОЕ ВОЗОБНОВЛЕНИЕ
Проект: MEDAS | Дата: 2026-06-16
Последнее ✅: Все файлы сохранены и запушены (3197d9a). MASTER_TZ.md v2.0 (56KB) + MASTER_TZ.docx (48KB) + task_plan.md (P0/P1/P2) + CODE_MAP.md (таблица 22 страниц).
Что сделано: Аудит 22 page.tsx — 16 broken flows задокументированы. 4 страницы = 404 (appointments, favorites, doctor/schedule, doctor/settings). 3/6 врачей → 404. 3/5 клиник → 404. Медкарта/семья = "Алекс Стерлинг" для всех. ClinicsSection = фейковые ID.
Следующее: Ждём подтверждения Игоря → Фаза P0 (6 задач): P0-1 профили врачей, P0-2 профили клиник, P0-3 /appointments, P0-4 /doctor/schedule, P0-5 ClinicsSection, P0-6 медкарта+реальное имя.
Важно: websms.ru контракт pending. Мастер-пароль OTP [REDACTED]. /register работает через мастер-код.
Проекты с открытыми issues: MEDAS — 16 broken flows, 4 отсутствующих страницы.

---

## Текущий шаг

**Что делаем сейчас:** Сессия 2026-06-16 — MASTER_TZ v2.0 полный аудит
**Фаза:** Фаза P0 — 5 критических исправлений (ждём подтверждения Игоря)
**Следующий шаг:** P0-1 (профили врачей), P0-2 (профили клиник), P0-3 (/appointments), P0-4 (/doctor/schedule), P0-5 (ClinicsSection)

---

## Выполненные шаги

### Сессия 2026-06-15 — SMS OTP + T9/T10 + план Этапа 2
- ✅ SMS-0: реальный OTP через SMSC.ru (логин=medas, Redis TTL 600s, 3 попытки→429, countdown UI, убран хинт 123456)
- ✅ T9: GET /doctors/{slug}/available-days endpoint — только рабочие дни из DoctorSchedule
- ✅ T10: AppointmentCalendar — нерабочие дни серые + некликабельные (guard size>0)
- ✅ Добавлен в план: Э2-3б DoctorDayOff (конкретные выходные дни), DoctorDayOff модель + миграция + admin UI
- ✅ Magic MCP (21st.dev) добавлен в конфиг — готов к Этапу 2
- Коммиты: 37d0e7c (SMS OTP), e7cee3b (normalize_phone), 622fc48 (calendar unavailable days)

### Фаза Л — Логотипы SVG + Favicon ✅ (2026-06-14)
- ✅ Л1: 5 SVG скопированы в public/logos/ + nginx volume /logos/ + VPS rsync
- ✅ Л2: icon.svg + apple-icon.png в src/app/ + layout.tsx icons metadata
- ✅ Л3: Header/Footer/CabinetLayout/LoginForm — /logo-dark.png → /logos/Medas_gor_b.svg + unoptimized
- ✅ Л4: 15 stitch HTML файлов — googleusercontent.com logo → /logos/Medas_gor_b.svg (30 замен)
- ✅ Л5: Deploy — VPS nginx force-recreate + frontend rebuild + git push (8660bda, 6ae7eee)

### Stitch preview pages ✅ (2026-06-15)
- 16 HTML файлов (index.html навигация + 15 страниц) на saas.med-as.ru/stitch/
- nginx location /stitch/ → alias /usr/share/nginx/html/stitch/
- rombik.conf убран из MEDAS nginx (бэкап: /app/rombik-backup/rombik.conf на VPS)

### Дашборд клиники — редизайн Stitch V1 ✅ (коммит b6ff5ea)
- DayTimeline, NewRequestsSidebar, DoctorLoad

### Дашборд клиники — реальные данные ✅ (коммит 83811e0)
- stats endpoint + 433 seed записи

### Фаза Д — Дашборд клиники (улучшения) ✅ (2026-06-14)
- ✅ Д1: Воронка пациентов (PatientFunnel) + 5-я KPI карточка бонусов (коммит f2842c6)
- ✅ Д2: DoctorLoad bar chart → таблица Врач/Сегодня/Месяц/Загрузка% (коммит 904eaff)
- ✅ Д3: /cabinet/clinic/reports — реальные данные (GET /clinic/analytics endpoint) (коммит e15e120)

### Сессия 2026-06-14 — план скорректирован ✅
- Финальный план-сверка: 3 этапа публичные, 6 пунктов ЛК клиники (2 работает), ЛК врача заглушка
- task_plan.md v6.0: добавлены Блокер перед prod (SMS OTP + Certbot), Этапы 1–6
- CODE_MAP.md: полный список endpoints со статусами, отмечены 404-страницы ЛК клиники
- Рекомендации учтены: /medcard + /family отложены, /appointments отделена от дашборда

### Фаза 0 — Настройка 🔄 (2026-06-10)
- ✅ Скопирован шаблон в папку "Сайт медас"
- ✅ Изучены PDF-макеты логотипа MEDAS (светлый + тёмный)
- ✅ Создан task_plan.md с 6 фазами разработки
- ✅ Создан findings.md с анализом конкурентов и архитектурными решениями
- 🔄 Ждём: дизайн из Stitch, IP VPS, домен
- ⏳ GitHub репозиторий
- ⏳ Заполнить CONTEXT.md, PLAN.md, DECISIONS.md
- ⏳ Инфраструктура Docker + Nginx

---

## Блокеры и проблемы

| Проблема | Статус | Решение |
|---|---|---|
| Нет доступа к дизайну (Stitch) | 🟢 Решено | stitch развёрнут на /stitch/ |
| Нет IP/доступа к VPS | 🟢 Решено | VPS 85.239.44.14, /app/medas-platform/ |

---

## Сессии разработки

### Сессия 2026-06-14 — Логотипы SVG + Favicon
**Сделано:**
- 5 SVG логотипов в public/logos/ + nginx /logos/ location
- Favicon: icon.svg + apple-icon.png
- 4 компонента: Header/Footer/CabinetLayout/LoginForm — SVG логотипы
- Stitch: 15 файлов — googleusercontent → /logos/ (30 замен)
- VPS: logos dir + nginx volume + force-recreate + frontend rebuild

**Следующая сессия:**
- Д1: Backend stats расширить (bonus_used, profile_views) + Frontend воронка пациентов + 5-я KPI карточка

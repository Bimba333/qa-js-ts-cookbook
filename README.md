# README.md

# JavaScript & TypeScript for Automation QA

Полный курс по JavaScript, TypeScript и Automation QA с практикой, инженерными объяснениями и реальными задачами.

---

# О проекте

Этот репозиторий — не краткий курс и не набор заметок.

Его цель — сформировать глубокое понимание JavaScript и TypeScript, а затем показать, как эти знания применяются при разработке промышленного Automation QA Framework.

Курс охватывает весь путь:

```text
JavaScript
        ↓
TypeScript
        ↓
Automation QA
        ↓
Playwright
        ↓
REST API
        ↓
gRPC
        ↓
Database
        ↓
Framework Architecture
```

Главный принцип курса:

> Сначала понять механизм. Затем изучить синтаксис. Затем применять знания в реальной разработке.

---

# Для кого этот курс

Курс предназначен для:

* Manual QA, переходящих в автоматизацию;
* Junior Automation QA;
* Middle Automation QA;
* SDET;
* JavaScript-разработчиков, желающих систематизировать знания;
* инженеров, использующих TypeScript без глубокого понимания JavaScript.

---

# Что будет изучено

## JavaScript

* Runtime
* Engine
* Execution Context
* Call Stack
* Scope
* Lexical Environment
* Hoisting
* Variables
* Primitive Types
* Objects
* References
* Stack & Heap
* Functions
* Closures
* this
* Prototype Chain
* Arrays
* Collections
* Modules
* Async JavaScript
* Event Loop
* Memory Management
* Debugging
* Performance

---

## TypeScript

* Type System
* Compiler
* Type Inference
* Interfaces
* Type Aliases
* Generics
* Utility Types
* Conditional Types
* Declaration Files
* Modules
* TypeScript в Playwright

---

## Automation QA

* Playwright
* API Testing
* REST
* gRPC
* PostgreSQL
* Helpers
* Assertions
* Fixtures
* Configuration
* Reporting
* Test Data
* Framework Architecture

---

# Структура репозитория

```text
docs/
    Главы книги

examples/
    Примеры кода

practice/
    Практические задания

solutions/
    Решения

assets/
    Иллюстрации и схемы

playground/
    Эксперименты

.meta/
    Архитектурная документация проекта

README.md
SUMMARY.md
AGENTS.md
```

---

# Как проходить курс

Каждая глава изучается полностью.

Последовательность работы:

1. Прочитать теорию.
2. Изучить внутренние механизмы.
3. Запустить примеры.
4. Выполнить практику.
5. Решить QA-задачи.
6. Выполнить мини-проект.
7. Проверить себя по решениям.
8. Только после этого переходить к следующей главе.

Не рекомендуется пропускать главы.

Материал построен последовательно.

---

# Практика

Каждая глава включает:

* вопросы на понимание;
* анализ кода;
* задачи на написание кода;
* задачи на поиск ошибок;
* задачи из Automation QA;
* мини-проект.

Практические задания находятся в каталоге `practice/`.

Разборы решений — в каталоге `solutions/`.

---

# Примеры кода

Все примеры находятся в каталоге `examples/`.

Каждый пример должен запускаться локально, если в описании не указано обратное.

---

# Архитектурные документы

Проект сопровождается набором внутренних документов:

* `PROJECT.md`
* `STYLE_GUIDE.md`
* `ROADMAP.md`
* `DECISIONS.md`
* `AGENTS.md`

Они определяют цели проекта, структуру курса, правила написания материала и инструкции для AI-агентов.

---

# Цель курса

После полного прохождения курса читатель должен самостоятельно:

* понимать устройство JavaScript;
* использовать TypeScript осознанно;
* проектировать архитектуру автотестов;
* разрабатывать собственные библиотеки и helper'ы;
* создавать масштабируемые Automation QA Framework.

---

# Статус проекта

Текущая версия находится в активной разработке.

Новые главы будут добавляться последовательно в соответствии с `.meta/ROADMAP.md`.

## Как пройти книгу локально

Нужен Node.js и, для части задач, Docker. Всё остальное поднимается командами
проекта.

### Только чтение и задачи в браузере

```bash
npm install
npm run docs:dev        # книга на http://localhost:5173/qa-js-ts-cookbook/
```

Из 350 задач 299 проверяются прямо в браузере — для них ничего, кроме этой
команды, не требуется.

По умолчанию открыты только бесплатные главы: их состав задаёт `book.access.mjs`.
Есть два способа читать книгу целиком.

**Способ первый — открыть всё.** В `book.access.mjs` поставить
`fallback: 'free'`. Прогресс тогда живёт в браузере и между устройствами не
переносится.

**Способ второй — учётная запись с подпиской.** Он же проверяет ту схему,
которая будет работать на сайте:

```bash
npm run platform:up     # сервис учётных записей на 127.0.0.1:4320
npm run docs:dev
```

Дальше на странице «Прогресс»: выбрать хранилище «свой сервис», указать адрес
`http://127.0.0.1:4320`, создать запись и нажать «Выдать подписку локально».
Кнопка появляется только для локального адреса и только когда сервис запущен с
`PLATFORM_ALLOW_DEV_GRANT=1` — в `platform/compose.yaml` это уже так. Прогресс
после входа синхронизируется и переносится между браузерами.

Проверить, что схема работает: `npm run docs:local:check`.

### Задачи против учебного стенда

51 задача решается локально против стенда с UI, REST, gRPC и PostgreSQL:

```bash
npm run sut:up                  # стенд в Docker
npm run task:verify <id задачи> # проверка решения из my-solutions/
```

### Финальный проект

```bash
npm run sut:up
npm run final-project:check     # типы и базовый прогон
npm run final-project:audit     # аудит готовности
```

Аудит учебного проекта намеренно заканчивается вердиктом «нужна доработка»: один
невыполненный блокер отменяет выпуск независимо от суммы весов.

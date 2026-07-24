# ROADMAP.md

> Version: 6.0
> Status: **FROZEN**
> Part: I / IV

---

# Общая структура курса

```text
Введение
│
├── Часть I. JavaScript
├── Часть II. TypeScript
├── Часть III. Automation QA
└── Часть IV. Финальный проект
```

---

# Архитектурные принципы

Этот roadmap является единственным источником истины для структуры курса.

После утверждения документа:

* не создаются новые главы между существующими;
* не меняется нумерация;
* новые идеи интегрируются в существующие главы;
* каждая глава отвечает только на один основной вопрос;
* каждая глава строится вокруг одной центральной ментальной модели.

Основной принцип курса:

```text
Один вопрос

↓

Одна глава

↓

Одна центральная идея
```

---

# Введение

## 0. Введение

### 0.1 О курсе

* Цели курса
* Для кого предназначен курс
* Как построено обучение

---

### 0.2 Как пользоваться курсом

* Как читать главы
* Как выполнять практику
* Как пользоваться решениями

---

### 0.3 Структура курса

* Устройство репозитория
* Структура директорий
* Примеры
* Практика
* Решения

---

### 0.4 Рабочее окружение

* Node.js
* npm
* VS Code
* Playground
* Git
* Терминал

---

# Часть I. JavaScript

---

# Раздел 1. Основы языка

---

## 1. Что такое JavaScript

Главный вопрос:

> Что такое JavaScript и где он выполняется?

Темы:

* История языка
* ECMAScript
* JavaScript Engine
* Browser Runtime
* Node.js Runtime

---

## 2. Как выполняется JavaScript

Главный вопрос:

> Что происходит после запуска программы?

Темы:

* Parsing
* AST
* Compilation
* Execution

---

## 3. Execution Context

Главный вопрос:

> Что создаётся перед выполнением кода?

Темы:

* Global Execution Context
* Function Execution Context
* Creation Phase
* Execution Phase

---

## 4. Call Stack

Главный вопрос:

> Как JavaScript понимает, какая функция выполняется сейчас?

Темы:

* Stack Frames
* Push
* Pop
* Stack Trace
* Stack Overflow

---

## 5. Memory

Главный вопрос:

> Где программа хранит данные?

Темы:

* Значения
* Идентификаторы
* Время жизни данных
* Создание данных
* Удаление данных

---

## 6. Variables

Главный вопрос:

> Как сохранить значение?

Темы:

* var
* let
* const
* Declaration
* Initialization
* Assignment

---

## 7. Scope

Главный вопрос:

> Где переменная доступна?

Темы:

* Global Scope
* Function Scope
* Block Scope
* Scope Chain

---

## 8. Lexical Environment

Главный вопрос:

> Как JavaScript связывает переменные со Scope?

Темы:

* Environment Record
* Outer Environment Reference
* Связь со Scope

---

## 9. Hoisting

Главный вопрос:

> Почему переменные и функции ведут себя по-разному до объявления?

Темы:

* Function Hoisting
* Variable Hoisting
* var
* let
* const

---

## 10. Temporal Dead Zone

Главный вопрос:

> Почему let и const нельзя использовать сразу?

Темы:

* TDZ
* Причины появления
* Типичные ошибки

---

## 11. Primitive Types

Главный вопрос:

> Какие значения существуют в JavaScript?

Темы:

* Number
* String
* Boolean
* Null
* Undefined
* Symbol
* BigInt

---

## 12. Object Type

Главный вопрос:

> Чем объекты отличаются от примитивов?

Темы:

* Object
* Array
* Function
* Date
* Другие встроенные объекты

---

## 13. References

Главный вопрос:

> Почему изменение одного объекта влияет на другой?

Темы:

* Reference
* Shared Object
* Mutability

---

## 14. Stack & Heap

Главный вопрос:

> Как мысленно представить память JavaScript?

Темы:

* Stack
* Heap
* Ограничения модели

---

## 15. Type Conversion

Главный вопрос:

> Почему JavaScript меняет типы автоматически?

Темы:

* Implicit Conversion
* Explicit Conversion
* Truthy
* Falsy

---

## 16. Equality

Главный вопрос:

> Как правильно сравнивать значения?

Темы:

* ==
* ===
* Object.is()
* Практические рекомендации

---

# Раздел 2. Управление программой

---

## 17. Operators

Главный вопрос:

> Как выполнять операции над значениями?

Темы:

* Арифметические
* Логические
* Сравнения
* Присваивание

---

## 18. Conditionals

Главный вопрос:

> Как принимать решения в программе?

Темы:

* if
* else
* switch
* ternary operator

---

## 19. Loops

Главный вопрос:

> Как повторять выполнение кода?

Темы:

* while
* do...while
* for

---

## 20. Error Handling

Главный вопрос:

> Как обрабатывать ошибки?

Темы:

* throw
* try
* catch
* finally

---

# Раздел 3. Functions

---

## 21. Function Declaration

Главный вопрос:

> Как объявить функцию?

---

## 22. Function Expression

Главный вопрос:

> Чем Function Expression отличается от Declaration?

---

## 23. Arrow Functions

Главный вопрос:

> Когда использовать стрелочные функции?

---

## 24. Parameters

Главный вопрос:

> Как функции получают данные?

---

## 25. Return

Главный вопрос:

> Как функция возвращает результат?

---

## 26. Rest Parameters

Главный вопрос:

> Как принять произвольное количество аргументов?

---

## 27. Spread

Главный вопрос:

> Как распаковать массив или объект?

---

## 28. Closures

Главный вопрос:

> Почему функция помнит своё окружение?

---

## 29. this

Главный вопрос:

> Как определяется получатель метода?

---

## 30. call()

Главный вопрос:

> Как явно задать this?

---

## 31. apply()

Главный вопрос:

> Чем apply отличается от call?

---

## 32. bind()

Главный вопрос:

> Как навсегда привязать this?

---

# Раздел 4. Objects

---

## 33. Objects

Главный вопрос:

> Как представить одну сущность?

---

## 34. Destructuring

Главный вопрос:

> Как удобно извлекать данные?

---

## 35. Optional Chaining

Главный вопрос:

> Как безопасно обращаться к вложенным свойствам?

---

## 36. Nullish Coalescing

Главный вопрос:

> Как задать значение по умолчанию только для null и undefined?

---

## 37. Object Methods

Главный вопрос:

> Как добавить поведение объекту?

---

## 38. Object Descriptors

Главный вопрос:

> Почему свойства ведут себя по-разному?

---

## 39. Prototype

Главный вопрос:

> Почему методы не копируются в каждый объект?

---

## 40. Prototype Chain

Главный вопрос:

> Как JavaScript ищет свойства?

---

## 41. Classes

Главный вопрос:

> Как удобно создавать много похожих объектов?

---

## 42. Class Inheritance

Главный вопрос:

> Как повторно использовать поведение между классами?

---

## 43. super

Главный вопрос:

> Как расширить базовое поведение, не копируя его?

---

# Раздел 5. Arrays

---

## 44. Arrays

Главный вопрос:

> Как хранить много значений вместе?

Темы:

* Ordered Collection
* Index
* length
* Object vs Array

---

## 45. push() / pop()

Главный вопрос:

> Как массив увеличивается и уменьшается?

Темы:

* push()
* pop()
* Return Value
* Изменение length

---

# ROADMAP.md

> Version: 6.0
> Status: **FROZEN**
> Part: II / IV

---

# Продолжение Part I

Главы **1–45** считаются утверждёнными и больше не изменяются.

Данная часть синхронизирована с фактически написанными JavaScript-главами до главы **96**.

---

# Раздел 5. Arrays (продолжение)

---

## 46. shift() / unshift()

**Главный вопрос**

> Как изменить начало массива?

Темы:

* Почему изменение начала отличается от изменения конца
* shift()
* unshift()
* Изменение индексов
* Изменение length
* Производительность (интуитивно)

---

## 47. splice()

**Главный вопрос**

> Как изменить середину массива?

Темы:

* Удаление элементов
* Добавление элементов
* Замена элементов
* Возвращаемое значение
* Изменение исходного массива

---

## 48. slice()

**Главный вопрос**

> Как получить часть массива?

Темы:

* Копирование массива
* Копирование диапазона
* Независимость нового массива
* Отличие от splice()

---

## 49. Iteration

**Главный вопрос**

> Как обработать каждый элемент коллекции?

Темы:

* Почему индексы перестают быть удобными
* Последовательный обход
* for...of
* Идея итерации

---

## 50. forEach()

**Главный вопрос**

> Как выполнить действие для каждого элемента?

Темы:

* Callback
* Последовательный обход
* Когда использовать
* Почему forEach ничего не возвращает

---

## 51. map()

**Главный вопрос**

> Как преобразовать каждый элемент?

Темы:

* Новый массив
* Один элемент → один элемент
* Не изменяет исходный массив

---

## 52. filter()

**Главный вопрос**

> Как оставить только нужные элементы?

Темы:

* Predicate
* true / false
* Новый массив

---

## 53. reduce()

**Главный вопрос**

> Как превратить коллекцию в одно значение?

Темы:

* Accumulator
* Initial Value
* Aggregation

---

## 54. Chaining basics

**Главный вопрос**

> Как объединять преобразования массива в цепочку?

Темы:

* Chaining
* Последовательные преобразования
* map() + filter()
* Читаемость цепочек

---

## 55. find()

**Главный вопрос**

> Как найти первый подходящий элемент?

Темы:

* Predicate
* Первый подходящий элемент
* undefined

---

## 56. some()

**Главный вопрос**

> Есть ли хотя бы один подходящий элемент?

Темы:

* Булев результат
* Раннее завершение

---

## 57. every()

**Главный вопрос**

> Все ли элементы удовлетворяют условию?

Темы:

* Проверка всей коллекции
* Булев результат
* Раннее завершение

---

## 58. includes()

**Главный вопрос**

> Как проверить, есть ли значение в массиве?

Темы:

* includes()
* Проверка наличия значения
* Простые массивы

---

## 59. sort()

**Главный вопрос**

> Как изменить порядок элементов?

Темы:

* Сортировка
* Compare Function
* Изменение исходного массива

---

## 60. reverse()

**Главный вопрос**

> Как инвертировать порядок массива?

Темы:

* Обратный порядок
* Изменение исходного массива
* Практическое использование

---

# Раздел 6. Execution Model Revisited

---

## 61. Execution Context

**Главный вопрос**

> Как JavaScript начинает выполнять код?

Темы:

* Execution Context
* Создание среды выполнения
* Глобальный и функциональный контекст

---

## 62. Call Stack

**Главный вопрос**

> Как функции выполняются шаг за шагом?

Темы:

* Stack of function calls
* Push
* Pop
* Активный вызов

---

## 63. Memory Model

**Главный вопрос**

> Где хранятся значения и объекты?

Темы:

* Stack
* Heap
* Примитивы
* Объекты
* References

---

## 64. Hoisting + TDZ

**Главный вопрос**

> Почему переменные ведут себя неожиданно до объявления?

Темы:

* Hoisting
* Temporal Dead Zone
* var
* let
* const

---

# Раздел 7. Function Context

---

## 65. Closures

**Главный вопрос**

> Как функция помнит данные после выполнения внешней функции?

Темы:

* Closure
* Lexical Environment
* Сохраненный доступ к окружению

---

## 66. this

**Главный вопрос**

> Как JavaScript определяет объект выполнения?

Темы:

* this
* Форма вызова
* object.method()

---

## 67. call(), apply(), bind()

**Главный вопрос**

> Как явно управлять объектом выполнения функции?

Темы:

* call()
* apply()
* bind()
* Привязанная функция

---

## 68. Practical Context Management

**Главный вопрос**

> Как управлять контекстом функции в реальном коде?

Темы:

* Потеря this
* Helper methods
* Практические сценарии Automation QA

---

# Раздел 8. Async JavaScript

---

## 69. Synchronous Execution

**Главный вопрос**

> Как выполняется синхронный JavaScript?

Темы:

* Последовательное выполнение
* Блокирующие операции
* Порядок строк

---

## 70. Asynchronous Programming

**Главный вопрос**

> Почему JavaScript нужна асинхронность?

Темы:

* Операция начинается сейчас
* Результат появляется позже
* Среда выполнения

---

## 71. Callback

**Главный вопрос**

> Как передать действие, которое выполнится позже?

Темы:

* Callback
* Обратный вызов
* callback(error, result)

---

## 72. Promise

**Главный вопрос**

> Как представить будущий результат операции?

Темы:

* Promise
* Будущий результат
* then()
* catch()

---

## 73. Event Loop

**Главный вопрос**

> Как JavaScript координирует асинхронное выполнение?

Темы:

* Event Loop
* Call Stack
* Очереди задач

---

## 74. Web APIs

**Главный вопрос**

> Откуда JavaScript получает дополнительные возможности среды выполнения?

Темы:

* Web APIs
* Runtime APIs
* Среда выполнения

---

## 75. Microtasks

**Главный вопрос**

> Почему Promise-обработчики выполняются раньше таймеров?

Темы:

* Microtask Queue
* Promise.then()
* queueMicrotask()

---

## 76. Macrotasks

**Главный вопрос**

> Какие задачи выполняются после Microtasks?

Темы:

* Macrotask Queue
* Timers
* Runtime Environment

---

## 77. Promise API

**Главный вопрос**

> Как работать с Promise-объектами?

Темы:

* then()
* catch()
* finally()

---

## 78. async and await

**Главный вопрос**

> Почему появились async и await?

Темы:

* async
* await
* Возвращаемый Promise

---

## 79. Error Handling in Asynchronous Code

**Главный вопрос**

> Как обрабатывать асинхронные ошибки?

Темы:

* rejected Promise
* try/catch
* Error propagation

---

## 80. Parallel Asynchronous Operations

**Главный вопрос**

> Когда асинхронную работу нужно запускать вместе?

Темы:

* Promise.all()
* Promise.allSettled()
* Promise.race()
* Promise.any()

---

# Раздел 9. Iteration Protocols

---

## 81. Iterable Protocol

**Главный вопрос**

> Почему for...of работает с массивами, но не работает с обычными объектами?

Темы:

* Iterable Protocol
* Symbol.iterator
* Array
* String
* Map
* Set

---

## 82. Iterators

**Главный вопрос**

> Что на самом деле происходит внутри for...of?

Темы:

* Iterator
* next()
* value
* done

---

## 83. Generators

**Главный вопрос**

> Почему появились генераторы?

Темы:

* function*
* yield
* Объект-генератор
* Iterator Protocol

---

## 84. Custom Iteration

**Главный вопрос**

> Как сделать собственный объект iterable?

Темы:

* Symbol.iterator
* Custom iterable object
* Generator-based iterator
* Manual iterator

---

# Раздел 10. Modules

---

## 85. JavaScript Modules

**Главный вопрос**

> Почему JavaScript-код нужно разделять на модули?

Темы:

* Module as responsibility unit
* export
* import
* Named Export
* Default Export
* Dependency Graph

---

## 86. Module Systems

**Главный вопрос**

> Почему в JavaScript существуют разные module systems?

Темы:

* ES Modules
* import / export
* CommonJS
* require()
* module.exports
* Practical comparison

---

# Раздел 11. Memory Management

---

## 87. Garbage Collector

**Главный вопрос**

> Почему JavaScript со временем не занимает всю память?

Темы:

* Automatic Memory Management
* Reachable Object
* Unreachable Object
* References
* Garbage Collector
* Runtime decides collection time

---

## 88. Memory Management

**Главный вопрос**

> Если в JavaScript есть Garbage Collector, почему memory leaks все еще происходят?

Темы:

* Long-lived References
* Accidental Globals
* Closures
* Event Listeners
* Timers
* Caches
* Memory Hygiene

---

# Раздел 12. Engineering Practice

---

## 89. Performance

**Главный вопрос**

> Как писать эффективный JavaScript без преждевременной оптимизации?

Темы:

* Readability First
* Measure Before Optimizing
* Bottleneck
* Avoiding Unnecessary Work
* Avoiding Duplicate Calculations
* Practical Optimization Priorities

---

## 90. Debugging

**Главный вопрос**

> Как профессиональные разработчики находят bugs?

Темы:

* Reproduce
* Isolate
* Inspect Assumptions
* console.log()
* Breakpoints
* Stack Trace
* Verify Fix

---

# Раздел 13. JavaScript Conclusion

---

## 91. Modern JavaScript Features

**Главный вопрос**

> Как обычно выглядит современный JavaScript-код?

Темы:

* Modules
* Destructuring
* Optional Chaining
* Nullish Coalescing
* async / await
* Spread / Rest
* Classes
* Iterators
* Generators

---

## 92. JavaScript Best Practices

**Главный вопрос**

> Что отличает поддерживаемый JavaScript от хаотичного JavaScript?

Темы:

* Small Functions
* Clear Naming
* Single Responsibility
* Avoid Duplication
* Predictable Flow
* Consistent Style
* Defensive Programming
* Readability over Cleverness

---

## 93. Error Objects

**Главный вопрос**

> Почему нужно выбрасывать Error objects, а не произвольные значения?

Темы:

* Error
* TypeError
* ReferenceError
* RangeError
* SyntaxError
* throw
* message
* name
* stack
* Custom Error Classes

---

## 94. JSON

**Главный вопрос**

> Почему JavaScript objects нельзя отправлять по сети напрямую?

Темы:

* JSON
* Сериализация
* Десериализация
* JSON.stringify()
* JSON.parse()
* Object vs JSON Text
* Supported Data Types
* Circular References

---

## 95. Date

**Главный вопрос**

> Как JavaScript представляет время?

Темы:

* Date
* new Date()
* Timestamp
* getTime()
* Date.now()
* toISOString()
* Comparing Dates
* Invalid Dates

---

## 96. Почему появился TypeScript

**Главный вопрос**

> Если JavaScript настолько способен, зачем появился TypeScript?

Темы:

* Large Projects
* Dynamic Typing
* Late Error Detection
* Refactoring Difficulty
* Tooling Limitations
* Maintainability
* TypeScript builds on JavaScript

---

# Статус

Фактически написанная JavaScript-часть синхронизирована до главы **96**.

Раздел JavaScript завершен.

Следующая часть ROADMAP продолжается с **TypeScript** (глава **97**).

# ROADMAP.md

> Version: 6.0
> Status: **FROZEN**
> Part: III / IV

---

# Продолжение Part II

Главы **1–96** считаются завершенной частью JavaScript.

Данная часть полностью посвящена **TypeScript**.

---

# Часть II. TypeScript

---

## Статус

```text
Status

FROZEN
```

После утверждения:

* не изменяется нумерация;
* новые главы не добавляются;
* новые темы интегрируются только в существующие главы;
* каждая глава отвечает на один инженерный вопрос: какую проблему JavaScript решает TypeScript.

---

# Главная цель раздела

После завершения JavaScript читатель уже понимает язык, runtime, асинхронность, модули, память и инженерные практики.

TypeScript не повторяет JavaScript.

TypeScript отвечает на следующий вопрос:

```text
JavaScript

↓

Большой проект

↓

Слишком много ошибок обнаруживается поздно

↓

Нужна проверка до запуска
```

Весь раздел строится вокруг одной идеи:

```text
JavaScript-код

↓

Типы

↓

Проверка компилятором

↓

Безопасный рефакторинг

↓

Поддерживаемый Automation QA Framework
```

---

# Модули TypeScript

| Модуль | Главы | Образовательная цель |
| ------ | ----- | -------------------- |
| 1. Компилятор и граница TypeScript | 97–101 | Понять, где TypeScript помогает, а где заканчивается его влияние |
| 2. Базовый словарь типов | 102–107 | Научиться описывать значения, которые уже знакомы по JavaScript |
| 3. Объектные контракты | 108–114 | Описывать форму объектов и публичные договоренности между частями кода |
| 4. Значения как типы и композиция | 115–120 | Ограничивать допустимые значения и собирать сложные состояния из простых типов |
| 5. Типизация функций | 121–126 | Делать параметры, callbacks, overloads и async-функции проверяемыми |
| 6. Narrowing и безопасные ветвления | 127–132 | Помогать TypeScript понимать, какой вариант данных находится в конкретной ветке кода |
| 7. Generics | 133–138 | Писать переиспользуемый код без потери информации о типах |
| 8. Операции над типами | 139–145 | Строить новые типы из существующих и уменьшать ручное дублирование |
| 9. Классы и объектные контракты | 146–149 | Использовать TypeScript для проверки классов, Page Objects и наследования |
| 10. Модули и декларации | 150–155 | Понять, как TypeScript работает с JavaScript-модулями и внешними типами |
| 11. Проектная практика | 156–159 | Применить TypeScript к структуре большого Automation QA проекта |

---

# Раздел 1. Компилятор и граница TypeScript

---

## 97. TypeScript Compiler

**Модуль:** Компилятор и граница TypeScript

**Предпосылки:** 96. Почему появился TypeScript

**Главный вопрос**

> Что делает TypeScript Compiler до запуска программы?

**Цель главы:** Показать, что TypeScript добавляет этап проверки перед выполнением JavaScript, но не меняет runtime напрямую.

Темы:

* Установка TypeScript
* tsc
* Проверка типов
* Генерация JavaScript
* Ошибки компиляции
* Связь с Automation QA проектом

---

## 98. Type Checking vs Runtime

**Модуль:** Компилятор и граница TypeScript

**Предпосылки:** 97. TypeScript Compiler

**Главный вопрос**

> Почему TypeScript находит ошибки до запуска, но не существует во время выполнения?

**Цель главы:** Разделить compile time и runtime, чтобы читатель не ожидал от TypeScript runtime-проверок.

Темы:

* Compile Time
* Runtime
* Type Checking
* JavaScript как результат компиляции
* Граница ответственности TypeScript

---

## 99. Type Erasure

**Модуль:** Компилятор и граница TypeScript

**Предпосылки:** 97. TypeScript Compiler, 98. Type Checking vs Runtime

**Главный вопрос**

> Почему типы исчезают после компиляции?

**Цель главы:** Объяснить, что типы служат для проверки кода, а не для хранения данных в выполняемой программе.

Темы:

* Удаление типов
* JavaScript output
* Ограничения TypeScript
* Почему нельзя полагаться на типы в runtime

---

## 100. tsconfig.json

**Модуль:** Компилятор и граница TypeScript

**Предпосылки:** 97. TypeScript Compiler

**Главный вопрос**

> Как TypeScript понимает правила проекта?

**Цель главы:** Показать tsconfig.json как договор между проектом и компилятором.

Темы:

* compilerOptions
* include
* exclude
* target
* module
* project boundary

---

## 101. strict mode

**Модуль:** Компилятор и граница TypeScript

**Предпосылки:** 100. tsconfig.json

**Главный вопрос**

> Почему строгая проверка делает проект надежнее?

**Цель главы:** Объяснить strict mode как набор правил, который заставляет явно описывать сомнительные места в коде.

Темы:

* strict
* Почему слабая проверка пропускает ошибки
* Nullability preview
* Практическая цена строгого режима
* Стратегия для большого QA проекта

---

# Раздел 2. Базовый словарь типов

---

## 102. Type Annotations and Type Inference

**Модуль:** Базовый словарь типов

**Предпосылки:** 97. TypeScript Compiler, 101. strict mode

**Главный вопрос**

> Когда TypeScript сам понимает тип, а когда ему нужно помочь?

**Цель главы:** Научить балансировать между явными аннотациями и выводом типов без лишнего шума в коде.

Темы:

* Type annotations
* Type inference
* Когда аннотация нужна
* Когда аннотация мешает
* Читаемость typed code

---

## 103. Primitive Types

**Модуль:** Базовый словарь типов

**Предпосылки:** 102. Type Annotations and Type Inference, 11. Primitive Types

**Главный вопрос**

> Как TypeScript описывает примитивные значения JavaScript?

**Цель главы:** Связать знакомые JavaScript-примитивы с TypeScript-типами.

Темы:

* string
* number
* boolean
* bigint
* symbol
* null
* undefined

---

## 104. any и unknown

**Модуль:** Базовый словарь типов

**Предпосылки:** 102. Type Annotations and Type Inference

**Главный вопрос**

> Как описывать данные, тип которых пока неизвестен?

**Цель главы:** Развести опасное отключение проверки через any и безопасную работу с неизвестными данными через unknown.

Темы:

* any
* unknown
* Потеря проверки
* Проверка перед использованием
* Данные из API и внешних источников

---

## 105. void и never

**Модуль:** Базовый словарь типов

**Предпосылки:** 25. Return, 102. Type Annotations and Type Inference

**Главный вопрос**

> Как типизировать отсутствие результата и невозможный результат?

**Цель главы:** Объяснить void и never через поведение функций, ошибок и недостижимых веток.

Темы:

* void
* never
* Функции без возвращаемого значения
* throw
* Недостижимый код

---

## 106. Arrays

**Модуль:** Базовый словарь типов

**Предпосылки:** 44. Arrays, 102. Type Annotations and Type Inference

**Главный вопрос**

> Как TypeScript защищает массив от элементов неправильного типа?

**Цель главы:** Научить описывать коллекции однотипных значений и понимать отличие T[] от Array<T>.

Темы:

* T[]
* Array<T>
* Массив объектов
* ReadonlyArray
* Test data collections

---

## 107. Tuples

**Модуль:** Базовый словарь типов

**Предпосылки:** 106. Arrays

**Главный вопрос**

> Когда массив превращается в структуру фиксированной формы?

**Цель главы:** Показать tuple как способ описывать позиционные данные с известной длиной и порядком.

Темы:

* Tuple
* Fixed length
* Optional tuple elements
* Readonly tuple
* Практические ограничения

---

# Раздел 3. Объектные контракты

---

## 108. Object Types

**Модуль:** Объектные контракты

**Предпосылки:** 12. Object Type, 33. Objects, 102. Type Annotations and Type Inference

**Главный вопрос**

> Как описать форму объекта в TypeScript?

**Цель главы:** Научить описывать свойства объекта как контракт между частями программы.

Темы:

* Object Types
* Required properties
* Nested objects
* Response objects
* Configuration objects

---

## 109. Optional and Readonly Properties

**Модуль:** Объектные контракты

**Предпосылки:** 108. Object Types, 35. Optional Chaining

**Главный вопрос**

> Как описывать необязательные и неизменяемые свойства?

**Цель главы:** Показать, как TypeScript отличает обязательные данные от опциональных и защищает свойства от переназначения.

Темы:

* Optional properties
* readonly
* Разница между отсутствием свойства и undefined
* Immutable configuration
* Test metadata

---

## 110. Index Signatures

**Модуль:** Объектные контракты

**Предпосылки:** 108. Object Types, 60. Map

**Главный вопрос**

> Как типизировать объект со заранее неизвестными ключами?

**Цель главы:** Объяснить index signature как контракт для словарей и динамических наборов свойств.

Темы:

* String index signature
* Number index signature
* Dictionary object
* Ограничения значений
* Headers и metadata

---

## 111. Type Alias

**Модуль:** Объектные контракты

**Предпосылки:** 108. Object Types

**Главный вопрос**

> Как дать имя сложному типу?

**Цель главы:** Научить выносить повторяющиеся типы в понятные именованные контракты.

Темы:

* type
* Именование типов
* Повторное использование
* Типы для test data
* Типы для API payload

---

## 112. Interface

**Модуль:** Объектные контракты

**Предпосылки:** 108. Object Types

**Главный вопрос**

> Как описывать объектный контракт, который будут реализовывать разные части проекта?

**Цель главы:** Показать interface как способ описывать форму объекта и публичный договор.

Темы:

* interface
* Object shape
* Method signatures
* Расширение interface
* Контракты Page Objects и helpers

---

## 113. Interface vs Type Alias

**Модуль:** Объектные контракты

**Предпосылки:** 111. Type Alias, 112. Interface

**Главный вопрос**

> Когда использовать interface, а когда type alias?

**Цель главы:** Дать практическое правило выбора без превращения темы в спор о стиле.

Темы:

* Object contracts
* Type composition
* Extending
* Declaration merging preview
* Практические рекомендации

---

## 114. Structural Typing

**Модуль:** Объектные контракты

**Предпосылки:** 108. Object Types, 111. Type Alias, 112. Interface

**Главный вопрос**

> Почему TypeScript сравнивает структуру, а не имя типа?

**Цель главы:** Объяснить structural typing как основу совместимости типов в TypeScript.

Темы:

* Structural Typing
* Shape compatibility
* Excess property checks
* Объекты из разных модулей
* Ошибки при передаче лишних свойств

---

# Раздел 4. Значения как типы и композиция

---

## 115. Literal Types

**Модуль:** Значения как типы и композиция

**Предпосылки:** 102. Type Annotations and Type Inference, 15. Type Conversion

**Главный вопрос**

> Как разрешить только конкретные значения?

**Цель главы:** Показать literal types как способ превратить допустимые значения в проверяемый контракт.

Темы:

* String literal types
* Number literal types
* Boolean literal types
* Status values
* Environment names

---

## 116. as const

**Модуль:** Значения как типы и композиция

**Предпосылки:** 115. Literal Types, 107. Tuples

**Главный вопрос**

> Как сохранить максимально точные типы значений?

**Цель главы:** Объяснить as const как способ зафиксировать литеральные значения и readonly-структуры.

Темы:

* as const
* Literal inference
* Readonly objects
* Readonly tuples
* Константы тестовых окружений

---

## 117. Enum

**Модуль:** Значения как типы и композиция

**Предпосылки:** 115. Literal Types

**Главный вопрос**

> Когда нужен enum, если есть literal types?

**Цель главы:** Показать enum как инструмент для ограниченных наборов значений и объяснить, когда он оправдан.

Темы:

* Numeric enum
* String enum
* Runtime presence
* Отличие от union literals
* Практические ограничения

---

## 118. Union Types

**Модуль:** Значения как типы и композиция

**Предпосылки:** 115. Literal Types, 20. Error Handling

**Главный вопрос**

> Как описать значение, у которого есть несколько допустимых вариантов?

**Цель главы:** Научить моделировать альтернативы без потери проверки типов.

Темы:

* Union
* Multiple allowed types
* Nullable values
* Discriminated unions
* Result states
* API response variants

---

## 119. Intersection Types

**Модуль:** Значения как типы и композиция

**Предпосылки:** 108. Object Types, 118. Union Types

**Главный вопрос**

> Как объединить несколько требований к одному значению?

**Цель главы:** Показать intersection types как способ собрать объект из нескольких контрактов.

Темы:

* Intersection
* Object composition
* Shared metadata
* Combining contracts
* Ограничения intersection

---

## 120. Type Composition in Practice

**Модуль:** Значения как типы и композиция

**Предпосылки:** 111. Type Alias, 112. Interface, 118. Union Types, 119. Intersection Types

**Главный вопрос**

> Как проектировать типы, чтобы они отражали реальные состояния системы?

**Цель главы:** Собрать aliases, interfaces, union и intersection в практическую модель данных Automation QA проекта.

Темы:

* Composition
* Test status model
* Report entries
* API result models
* Избежание дублирования типов

---

# Раздел 5. Типизация функций

---

## 121. Function Types

**Модуль:** Типизация функций

**Предпосылки:** 21. Function Declaration, 22. Function Expression, 102. Type Annotations and Type Inference

**Главный вопрос**

> Как описать параметры и результат функции?

**Цель главы:** Научить типизировать функции как контракты поведения.

Темы:

* Parameter types
* Return type
* Function type expressions
* Method signatures
* Helper functions

---

## 122. Optional, Default and Rest Parameters

**Модуль:** Типизация функций

**Предпосылки:** 24. Parameters, 26. Rest Parameters, 121. Function Types

**Главный вопрос**

> Как типизировать разные способы передачи аргументов?

**Цель главы:** Показать, как TypeScript проверяет optional, default и rest parameters.

Темы:

* Optional parameters
* Default parameters
* Rest parameters
* Порядок параметров
* Helper APIs

---

## 123. Callback Types

**Модуль:** Типизация функций

**Предпосылки:** 50. forEach(), 51. map(), 121. Function Types

**Главный вопрос**

> Как типизировать функцию, которую передают в другую функцию?

**Цель главы:** Научить описывать callbacks и higher-order functions без потери информации о параметрах.

Темы:

* Callback signature
* Higher-order functions
* Predicate types
* Array callbacks
* Custom assertions

---

## 124. Function Overloads

**Модуль:** Типизация функций

**Предпосылки:** 121. Function Types, 118. Union Types

**Главный вопрос**

> Как описать функцию с несколькими корректными способами вызова?

**Цель главы:** Показать overloads как способ описать разные входы и соответствующие выходы функции.

Темы:

* Overload signatures
* Implementation signature
* Union vs overload
* API helpers
* Ошибки перегрузок

---

## 125. this Parameter

**Модуль:** Типизация функций

**Предпосылки:** 29. this, 66. this: углубленное повторение, 121. Function Types

**Главный вопрос**

> Как TypeScript помогает контролировать this в функциях?

**Цель главы:** Связать JavaScript-модель this с TypeScript-проверкой контекста вызова.

Темы:

* this parameter
* noImplicitThis
* Methods vs functions
* Callback context
* Page Object methods

---

## 126. Async Function Types

**Модуль:** Типизация функций

**Предпосылки:** 78. async и await, 80. Parallel Asynchronous Operations, 121. Function Types

**Главный вопрос**

> Как типизировать асинхронный результат?

**Цель главы:** Показать Promise<T> как контракт результата async-функции.

Темы:

* Promise<T>
* async return type
* API client methods
* Fixture setup
* Ошибки с вложенными Promise

---

# Раздел 6. Narrowing и безопасные ветвления

---

## 127. Narrowing

**Модуль:** Narrowing и безопасные ветвления

**Предпосылки:** 18. Conditionals, 118. Union Types

**Главный вопрос**

> Как TypeScript уточняет тип внутри ветки кода?

**Цель главы:** Объяснить narrowing как анализ условий, который делает union types безопасными.

Темы:

* Control flow analysis
* Narrowing
* if
* switch
* Return-based narrowing

---

## 128. Built-in Type Guards

**Модуль:** Narrowing и безопасные ветвления

**Предпосылки:** 127. Narrowing, 15. Type Conversion

**Главный вопрос**

> Какие проверки TypeScript уже умеет понимать?

**Цель главы:** Показать typeof, instanceof и in как стандартные способы уточнения типа.

Темы:

* typeof
* instanceof
* in
* Equality narrowing
* Truthiness narrowing
* Проверка внешних данных

---

## 129. User Defined Type Guards

**Модуль:** Narrowing и безопасные ветвления

**Предпосылки:** 123. Callback Types, 128. Built-in Type Guards

**Главный вопрос**

> Как написать собственную проверку, которую понимает TypeScript?

**Цель главы:** Научить создавать type guards для доменных объектов Automation QA проекта.

Темы:

* value is Type
* Guard function
* Reusable validation
* API response guards
* Ошибки ложных guards

---

## 130. Type Assertions

**Модуль:** Narrowing и безопасные ветвления

**Предпосылки:** 104. any и unknown, 127. Narrowing

**Главный вопрос**

> Когда программист сообщает TypeScript больше, чем компилятор может вывести сам?

**Цель главы:** Объяснить type assertions как ручное утверждение и показать риск неправильного использования.

Темы:

* as
* Non-null assertion
* Ограничения assertions
* Отличие от runtime-проверки
* Безопасные альтернативы

---

## 131. satisfies

**Модуль:** Narrowing и безопасные ветвления

**Предпосылки:** 115. Literal Types, 130. Type Assertions

**Главный вопрос**

> Как проверить соответствие типу, не теряя точность значения?

**Цель главы:** Показать satisfies как инструмент проверки конфигураций и констант без расширения literal types.

Темы:

* satisfies
* Shape validation
* Literal preservation
* Config objects
* Отличие от annotation и assertion

---

## 132. Exhaustive Checks with never

**Модуль:** Narrowing и безопасные ветвления

**Предпосылки:** 105. void и never, 118. Union Types, 127. Narrowing

**Главный вопрос**

> Как убедиться, что обработаны все варианты состояния?

**Цель главы:** Научить использовать never для проверки полноты switch и безопасной обработки union-состояний.

Темы:

* Exhaustiveness
* never
* switch
* Discriminated state handling
* Report status processing

---

# Раздел 7. Generics

---

## 133. Generic Functions

**Модуль:** Generics

**Предпосылки:** 121. Function Types, 106. Arrays

**Главный вопрос**

> Как функция может сохранить тип данных, который получает на вход?

**Цель главы:** Объяснить generic functions как способ писать универсальный код без any.

Темы:

* Type parameter
* Generic function
* Inference for generics
* Identity helpers
* Typed data factories

---

## 134. Generic Constraints

**Модуль:** Generics

**Предпосылки:** 133. Generic Functions, 108. Object Types

**Главный вопрос**

> Как ограничить generic-параметр нужной формой?

**Цель главы:** Показать extends как способ требовать минимальный контракт от generic-типа.

Темы:

* extends
* Constraint
* Minimum required shape
* Safe property access
* Test entities

---

## 135. keyof Constraints

**Модуль:** Generics

**Предпосылки:** 134. Generic Constraints, 108. Object Types

**Главный вопрос**

> Как разрешить только ключи существующего объекта?

**Цель главы:** Показать связку keyof и generics для безопасного доступа к свойствам.

Темы:

* keyof with generics
* K extends keyof T
* Safe property picker
* Configuration helpers
* Ошибки с динамическими ключами

---

## 136. Generic Type Aliases and Interfaces

**Модуль:** Generics

**Предпосылки:** 111. Type Alias, 112. Interface, 133. Generic Functions

**Главный вопрос**

> Как сделать собственные типы параметризуемыми?

**Цель главы:** Научить создавать reusable containers, results и API response models.

Темы:

* Generic type alias
* Generic interface
* Result<T>
* ApiResponse<T>
* TestDataBuilder<T>

---

## 137. Generic Classes

**Модуль:** Generics

**Предпосылки:** 41. Classes, 136. Generic Type Aliases and Interfaces

**Главный вопрос**

> Как класс может работать с разными типами данных безопасно?

**Цель главы:** Показать generic classes на примере хранилищ, builders и clients.

Темы:

* Generic class
* Typed storage
* Builder pattern
* API client wrapper
* Ограничения generic classes

---

## 138. Default Generic Parameters

**Модуль:** Generics

**Предпосылки:** 136. Generic Type Aliases and Interfaces, 137. Generic Classes

**Главный вопрос**

> Как задать generic-тип по умолчанию?

**Цель главы:** Объяснить default generic parameters как способ сделать generic API удобнее без потери строгости.

Темы:

* Default type parameter
* Public API ergonomics
* Backward compatibility
* Defaults for helpers
* Ошибки слишком широких defaults

---

# Раздел 8. Операции над типами

---

## 139. keyof

**Модуль:** Операции над типами

**Предпосылки:** 108. Object Types, 135. keyof Constraints

**Главный вопрос**

> Как получить union всех ключей типа?

**Цель главы:** Показать keyof как способ превращать форму объекта в набор допустимых ключей.

Темы:

* keyof
* Key union
* Object contracts
* Safe selectors
* Locator maps

---

## 140. typeof Type Query

**Модуль:** Операции над типами

**Предпосылки:** 102. Type Annotations and Type Inference, 116. as const

**Главный вопрос**

> Как получить тип существующего значения?

**Цель главы:** Научить строить типы от реальных констант без ручного дублирования.

Темы:

* typeof in type position
* Value to type
* Config constants
* Test data constants
* Отличие от JavaScript typeof

---

## 141. Indexed Access Types

**Модуль:** Операции над типами

**Предпосылки:** 139. keyof, 140. typeof Type Query

**Главный вопрос**

> Как получить тип отдельного свойства?

**Цель главы:** Показать indexed access types как способ переиспользовать части существующих типов.

Темы:

* T[K]
* Property type extraction
* Array element type
* Response field types
* Ошибки несуществующих ключей

---

## 142. Mapped Types

**Модуль:** Операции над типами

**Предпосылки:** 139. keyof, 141. Indexed Access Types

**Главный вопрос**

> Как автоматически преобразовать каждое свойство типа?

**Цель главы:** Объяснить mapped types как цикл по ключам типа.

Темы:

* Mapped type
* Key iteration
* Modifiers
* Readonly and optional transformations
* Form models

---

## 143. Conditional Types

**Модуль:** Операции над типами

**Предпосылки:** 118. Union Types, 142. Mapped Types

**Главный вопрос**

> Как создавать типы с условной логикой?

**Цель главы:** Показать conditional types как способ выбирать тип на основе другого типа.

Темы:

* T extends U ? X : Y
* Type-level condition
* Distribution over unions
* Practical limits
* Helper types

---

## 144. infer

**Модуль:** Операции над типами

**Предпосылки:** 143. Conditional Types, 126. Async Function Types

**Главный вопрос**

> Как извлечь часть типа автоматически?

**Цель главы:** Объяснить infer как механизм извлечения типа внутри conditional type.

Темы:

* infer
* Extract return type
* Extract Promise value
* Extract array item
* Ограничения читаемости

---

## 145. Utility Types

**Модуль:** Операции над типами

**Предпосылки:** 139. keyof, 142. Mapped Types, 143. Conditional Types

**Главный вопрос**

> Какие типовые преобразования TypeScript уже предоставляет?

**Цель главы:** Научить использовать utility types как готовые строительные блоки вместо ручных mapped и conditional types.

Темы:

* Partial
* Required
* Readonly
* Pick
* Omit
* Record
* Exclude / Extract
* ReturnType / Parameters

---

# Раздел 9. Классы и объектные контракты

---

## 146. Typed Classes

**Модуль:** Классы и объектные контракты

**Предпосылки:** 41. Classes, 121. Function Types, 108. Object Types

**Главный вопрос**

> Как TypeScript проверяет поля, constructor и методы класса?

**Цель главы:** Связать JavaScript classes с TypeScript-проверкой экземпляров и методов.

Темы:

* Class fields
* Constructor parameters
* Method types
* Instance type
* Page Object shape

---

## 147. Access Modifiers and readonly Members

**Модуль:** Классы и объектные контракты

**Предпосылки:** 146. Typed Classes, 109. Optional and Readonly Properties

**Главный вопрос**

> Как ограничить доступ к деталям реализации класса?

**Цель главы:** Показать public, private, protected и readonly как инструменты контроля публичного API класса.

Темы:

* public
* private
* protected
* readonly members
* Parameter properties
* Инкапсуляция Page Object деталей

---

## 148. Abstract Classes

**Модуль:** Классы и объектные контракты

**Предпосылки:** 42. Class Inheritance, 146. Typed Classes, 147. Access Modifiers and readonly Members

**Главный вопрос**

> Как описать общий базовый класс, который нельзя использовать напрямую?

**Цель главы:** Объяснить abstract class как контракт с общей реализацией для наследников.

Темы:

* abstract class
* Abstract methods
* Shared behavior
* Base page object
* Ограничения наследования

---

## 149. implements and override

**Модуль:** Классы и объектные контракты

**Предпосылки:** 112. Interface, 146. Typed Classes, 148. Abstract Classes

**Главный вопрос**

> Как проверить, что класс соответствует контракту и корректно переопределяет поведение?

**Цель главы:** Показать implements и override как защиту от расхождения класса с ожидаемым API.

Темы:

* implements
* override
* Interface contract
* Inheritance checks
* Component objects

---

# Раздел 10. Модули и декларации

---

## 150. TypeScript and JavaScript Modules

**Модуль:** Модули и декларации

**Предпосылки:** 85. JavaScript Modules, 86. Module Systems, 100. tsconfig.json

**Главный вопрос**

> Как TypeScript добавляет типы к уже знакомым JavaScript-модулям?

**Цель главы:** Показать, что TypeScript использует JavaScript module system, но дополнительно проверяет импортируемые и экспортируемые типы.

Темы:

* ES Modules
* import / export
* Typed exports
* Public API modules
* Module boundaries

---

## 151. Type-only Imports and Exports

**Модуль:** Модули и декларации

**Предпосылки:** 99. Type Erasure, 150. TypeScript and JavaScript Modules

**Главный вопрос**

> Как импортировать типы отдельно от runtime-значений?

**Цель главы:** Объяснить type-only imports как способ явно отделять compile-time зависимости от runtime-кода.

Темы:

* import type
* export type
* Type erasure
* Runtime imports
* Dependency clarity

---

## 152. Module Resolution

**Модуль:** Модули и декларации

**Предпосылки:** 70. Module Resolution, 100. tsconfig.json, 150. TypeScript and JavaScript Modules

**Главный вопрос**

> Как TypeScript находит модуль и его типы?

**Цель главы:** Дать концептуальную модель module resolution без погружения в bundlers и build tools.

Темы:

* Relative imports
* Поиск типов внешних модулей
* paths concept
* type declarations lookup
* Ошибки Cannot find module

---

## 153. Declaration Files

**Модуль:** Модули и декларации

**Предпосылки:** 99. Type Erasure, 150. TypeScript and JavaScript Modules, 152. Module Resolution

**Главный вопрос**

> Как TypeScript узнает типы JavaScript-кода, которого сам не видит?

**Цель главы:** Показать .d.ts files как описание внешнего JavaScript API для компилятора.

Темы:

* .d.ts
* Ambient declarations
* Library types
* External API shape
* Ограничения деклараций

---

## 154. Declaration Merging

**Модуль:** Модули и декларации

**Предпосылки:** 112. Interface, 153. Declaration Files

**Главный вопрос**

> Почему некоторые объявления TypeScript могут объединяться?

**Цель главы:** Объяснить declaration merging как специальный механизм расширения деклараций без превращения его в повседневный стиль.

Темы:

* Declaration merging
* Interface merging
* Module augmentation overview
* Практические риски
* Когда избегать merging

---

## 155. Compiler Options for Real Projects

**Модуль:** Модули и декларации

**Предпосылки:** 100. tsconfig.json, 101. strict mode, 152. Module Resolution

**Главный вопрос**

> Какие compiler options действительно влияют на поддержку большого проекта?

**Цель главы:** Связать отдельные compiler options с инженерными последствиями для команды.

Темы:

* target
* module
* lib
* noEmit
* incremental
* noUncheckedIndexedAccess overview
* exactOptionalPropertyTypes overview

---

# Раздел 11. Проектная практика

---

## 156. Typed Configuration and Test Data

**Модуль:** Проектная практика

**Предпосылки:** 108. Object Types, 115. Literal Types, 131. satisfies, 155. Compiler Options for Real Projects

**Главный вопрос**

> Как TypeScript помогает держать configuration и test data согласованными?

**Цель главы:** Показать типизацию конфигураций, окружений и тестовых данных без обучения конкретному тестовому фреймворку.

Темы:

* Environment config
* Test data models
* satisfies for config
* Readonly constants
* Ошибки несогласованных данных

---

## 157. Typed Page Objects, Fixtures and Helpers

**Модуль:** Проектная практика

**Предпосылки:** 146. Typed Classes, 147. Access Modifiers and readonly Members, 149. implements and override

**Главный вопрос**

> Как типы помогают удерживать Page Objects, fixtures и helpers в понятных границах?

**Цель главы:** Применить классы, interfaces и function types к объектам страниц, fixtures и общим helper APIs.

Темы:

* Page Object contracts
* Fixture contracts
* Helper function contracts
* Public API of helper modules
* Reusable page components
* Ошибки архитектурного расползания

---

## 158. Typed API Clients and Assertions

**Модуль:** Проектная практика

**Предпосылки:** 126. Async Function Types, 129. User Defined Type Guards, 136. Generic Type Aliases and Interfaces, 145. Utility Types

**Главный вопрос**

> Как TypeScript помогает описывать API responses и проверки?

**Цель главы:** Показать типизацию API clients, response models и assertion helpers в Automation QA проекте.

Темы:

* ApiResponse<T>
* Typed request payload
* Typed response body
* Database result models
* gRPC request and response models
* Assertion helper contracts
* Runtime validation boundary

---

## 159. Maintaining Large TypeScript Test Projects

**Модуль:** Проектная практика

**Предпосылки:** 150. TypeScript and JavaScript Modules, 155. Compiler Options for Real Projects, 156. Typed Configuration and Test Data, 157. Typed Page Objects, Fixtures and Helpers, 158. Typed API Clients and Assertions

**Главный вопрос**

> Как поддерживать большой TypeScript-проект без превращения типов в хаос?

**Цель главы:** Завершить TypeScript-раздел инженерными правилами проектирования типов для больших Automation QA проектов.

Темы:

* Type ownership
* Public type API
* Avoiding overengineering
* Typed reporting boundaries
* Refactoring with compiler feedback
* Подготовка к Automation QA Framework разделу

---

# Итог раздела

После завершения TypeScript читатель:

* понимает, что TypeScript проверяет JavaScript до запуска, но не заменяет runtime;
* умеет проектировать типы для данных, функций, классов и модулей;
* уверенно использует narrowing, generics, utility types и declaration files;
* понимает границы compiler options и strict mode;
* умеет применять TypeScript для архитектуры крупного Automation QA проекта.

---

## Статус раздела

```text
TypeScript

97

↓

159

STATUS

FROZEN
```

# ROADMAP.md

> Version: 6.0
> Status: **FROZEN**
> Part: IV / IV

---

# Продолжение Part III

Главы **1–159** считаются утверждёнными.

Данная часть полностью посвящена **Automation QA** и финальному промышленному проекту.

---

# Часть III. Automation QA

---

# Инструментальный контур части

Практическая реализация строится на минимальном согласованном стеке:

* TypeScript и Node.js как язык и runtime тестового проекта;
* Playwright как библиотека browser automation;
* Playwright Test как test runner, fixture system и assertion system;
* `APIRequestContext` как HTTP client для REST API;
* Protocol Buffers и `@grpc/grpc-js` как Node gRPC client для gRPC-вызовов;
* PostgreSQL и `pg` как Node.js driver для доступа к базе данных;
* Allure и `allure-playwright` как внешний reporting tool после изучения общих принципов отчётности;
* GitHub Actions как CI-платформа практической реализации.

Конкретный protobuf code generator и runtime validator контрактов выбираются при реализации с учётом контракта учебного приложения. Этот выбор не меняет архитектуру курса и не вводит отдельную учебную тему.

---

# Раздел 1. Основы Automation QA Framework

**Назначение раздела:** отделить framework от отдельных инструментов и сформировать модель его слоёв, зависимостей и жизненного цикла.

**Предпосылки:** JavaScript 1–96, TypeScript 97–159.

**Результат:** читатель умеет объяснить ответственность framework и спроектировать минимальные границы проекта без привязки к одной структуре папок.

**Граница review/freeze:** главы 160–165.

---

## 160. Что такое Automation QA Framework

**Главный вопрос**

> Чем поддерживаемый Automation QA Framework отличается от набора тестовых скриптов?

Темы:

* Framework и отдельный тест
* Повторное использование
* Поддерживаемость
* Масштабирование проекта
* Границы ответственности

---

## 161. Инструменты и роли в Automation QA

**Главный вопрос**

> Какую задачу решает каждый инструмент внутри Automation QA проекта?

Темы:

* Application under test
* Playwright и browser automation
* Playwright Test и test runner
* Assertion system
* API client
* Reporting tool
* CI system
* Automation QA Framework как целое

---

## 162. Архитектурные слои и поток зависимостей

**Главный вопрос**

> Как разделить UI, API, gRPC, database и общую инфраструктуру без циклических зависимостей?

Темы:

* Слои framework
* Направление зависимостей
* Публичные границы модулей
* Composition Root
* Недопустимые циклические связи

---

## 163. Тестовый и инфраструктурный код

**Главный вопрос**

> Где проходит граница между сценарием теста и механизмами framework?

Темы:

* Test intent
* Test orchestration
* Infrastructure code
* Domain language
* Признаки утечки деталей реализации в тест

---

## 164. Жизненный цикл автотеста

**Главный вопрос**

> Какие этапы проходит автотест от загрузки конфигурации до сохранения диагностических данных?

Темы:

* Configuration
* Подготовка окружения и данных
* Выполнение сценария
* Проверки
* Cleanup
* Evidence и report

---

## 165. Структура проекта и границы модулей

**Главный вопрос**

> Как структура проекта отражает ответственность модулей, а не случайный набор папок?

Темы:

* Feature-first и layer-first организация
* `tests`, `pages`, `api`, `grpc`, `database`
* Общая инфраструктура
* Публичные точки входа
* Критерии выбора структуры

---

# Раздел 2. Playwright Test и основы UI-автоматизации

**Назначение раздела:** объяснить модель выполнения Playwright Test и базовые browser primitives до архитектурных паттернов.

**Предпосылки:** 160–165.

**Результат:** читатель пишет изолированные UI-тесты с устойчивыми locators, действиями, ожиданиями и web-first assertions.

**Граница review/freeze:** главы 166–175.

---

## 166. Playwright и Playwright Test

**Главный вопрос**

> Чем browser automation library отличается от test runner и как они работают вместе?

Темы:

* Playwright library
* Playwright Test
* Test runner
* Fixtures и assertions как отдельные роли
* Граница framework

---

## 167. Анатомия и модель выполнения теста

**Главный вопрос**

> Как Playwright Test обнаруживает, группирует и выполняет тесты?

Темы:

* `test()`
* `test.describe()`
* Test discovery
* Test execution
* Annotations overview
* Результат и exit code

---

## 168. Browser, BrowserContext и Page

**Главный вопрос**

> Как Playwright моделирует браузер, изолированную сессию и вкладку?

Темы:

* Browser
* BrowserContext
* Page
* Изоляция cookies и storage
* Жизненный цикл browser resources

---

## 169. Locator и стратегия поиска элементов

**Главный вопрос**

> Как находить элементы устойчиво и сохранять намерение пользователя в тесте?

Темы:

* Locator
* Role, label и text locators
* Test id
* Strictness
* Chaining и filtering
* Хрупкие CSS/XPath стратегии

---

## 170. Пользовательские действия

**Главный вопрос**

> Как Playwright выполняет действия пользователя и проверяет готовность элемента?

Темы:

* Click
* Fill
* Select
* Keyboard и mouse
* Actionability checks
* Ошибки взаимодействия

---

## 171. Web-first assertions

**Главный вопрос**

> Почему проверки UI должны ожидать наблюдаемое состояние, а не читать его один раз?

Темы:

* `expect()`
* Locator assertions
* Auto-retrying assertions
* Expected и actual
* Диагностические сообщения

---

## 172. Auto-waiting и явные ожидания

**Главный вопрос**

> Когда Playwright ждёт автоматически и когда тесту действительно нужно явное условие?

Темы:

* Auto-waiting
* Наблюдаемое условие
* `waitFor()`
* Ожидание response или event
* Запрет произвольных пауз как стратегии синхронизации

---

## 173. Timeouts и границы ожидания

**Главный вопрос**

> Как задавать временные границы без маскировки медленных или зависших сценариев?

Темы:

* Test timeout
* Action timeout
* Assertion timeout
* Navigation timeout
* Локальная и глобальная настройка
* Причина timeout до увеличения значения

---

## 174. Hooks и жизненный цикл теста

**Главный вопрос**

> Как подготовка и очистка связываются с жизненным циклом test suite?

Темы:

* `beforeAll()` и `afterAll()`
* `beforeEach()` и `afterEach()`
* Scope hooks
* Cleanup при ошибке
* Риск скрытых зависимостей

---

## 175. Изоляция UI-тестов и состояние браузера

**Главный вопрос**

> Почему каждый тест должен владеть своим состоянием и не зависеть от порядка запуска?

Темы:

* Test isolation
* Fresh BrowserContext
* Cookies и storage
* Независимость порядка
* Контролируемая подготовка состояния

---

# Раздел 3. Fixtures и архитектура UI-слоя

**Назначение раздела:** построить повторно используемый UI-слой после освоения Page, Locator, действий, ожиданий и lifecycle.

**Предпосылки:** 166–175.

**Результат:** читатель проектирует fixtures, authentication state, Page Objects и browser scenarios без скрытых зависимостей.

**Граница review/freeze:** главы 176–185.

---

## 176. Built-in fixtures

**Главный вопрос**

> Какие ресурсы Playwright Test предоставляет тесту и кто управляет их жизненным циклом?

Темы:

* `page`
* `context`
* `browser`
* Fixture scope
* Setup и teardown

---

## 177. Custom fixtures и граф зависимостей

**Главный вопрос**

> Как создавать собственные fixtures с явными зависимостями и гарантированным cleanup?

Темы:

* `test.extend()`
* Dependency Injection
* Test-scoped и worker-scoped fixtures
* Fixture dependencies
* Automatic fixtures
* Cleanup

---

## 178. Authentication state и управляемые сессии

**Главный вопрос**

> Как повторно использовать авторизованное состояние, не связывая тесты общей изменяемой сессией?

Темы:

* `storageState`
* Setup project
* Роли пользователей
* Срок жизни credentials
* Изоляция и безопасность состояния

---

## 179. Page Object

**Главный вопрос**

> Как отделить язык тестового сценария от деталей конкретной страницы?

Темы:

* Page Object Pattern
* Locator ownership
* User-facing actions
* Assertions boundary
* Признаки чрезмерного Page Object

---

## 180. Component Objects и композиция страниц

**Главный вопрос**

> Как переиспользовать независимые части интерфейса без наследования страниц?

Темы:

* Component Object
* Composition
* Root Locator
* Повторяющиеся widgets
* Граница page и component

---

## 181. Frames

**Главный вопрос**

> Как работать с элементами внутри iframe, не теряя границу контекста?

Темы:

* Frame
* FrameLocator
* Навигация frame
* Ожидания внутри frame
* Типичные ошибки контекста

---

## 182. Вкладки, окна и popups

**Главный вопрос**

> Как синхронизировать действие с появлением новой Page?

Темы:

* Page event
* Popup
* Несколько Page в BrowserContext
* Ожидание события до действия
* Закрытие ресурсов

---

## 183. Диалоги и работа с файлами

**Главный вопрос**

> Как автоматизировать browser interactions, которые не являются обычными DOM-действиями?

Темы:

* Dialog events
* File upload
* Download events
* Временные файлы
* Cleanup артефактов

---

## 184. Network interception и mocking

**Главный вопрос**

> Когда тесту нужно наблюдать или контролировать сетевое взаимодействие страницы?

Темы:

* Request и response events
* Route interception
* Mock response
* Modification и abort
* Граница между UI и API-тестом

---

## 185. Интеграция UI-слоя

**Главный вопрос**

> Как fixtures, Page Objects, components и browser state образуют единый UI-слой?

Темы:

* Dependency flow
* Fixture composition
* Page и component ownership
* Authentication flow
* Test readability
* Критерии архитектурного review

---

# Раздел 4. Тестирование REST API

**Назначение раздела:** перейти от HTTP-протокола к поддерживаемому API-слою и отделить transport checks, business assertions и contract validation.

**Предпосылки:** 160–165, TypeScript 126, 129, 158.

**Результат:** читатель создаёт REST API tests через `APIRequestContext`, управляет авторизацией и данными, проверяет позитивные и негативные сценарии.

**Граница review/freeze:** главы 186–196.

---

## 186. HTTP и REST для API-тестирования

**Главный вопрос**

> Какие свойства HTTP и REST определяют поведение API-теста?

Темы:

* Client и server
* Resource
* HTTP methods
* Idempotency для тестовых сценариев
* Stateless interaction
* REST как архитектурный стиль

---

## 187. Структура HTTP-запроса

**Главный вопрос**

> Из каких частей состоит запрос и какую ошибку может содержать каждая из них?

Темы:

* URL и path parameters
* Query parameters
* Headers
* Content type
* Request body
* JSON и form data

---

## 188. Структура HTTP-ответа

**Главный вопрос**

> Какие уровни результата нужно проверить в HTTP-ответе?

Темы:

* Status code
* Response headers
* Response body
* JSON parsing
* Transport result и business result

---

## 189. APIRequestContext

**Главный вопрос**

> Как выполнять независимые HTTP-запросы средствами Playwright Test?

Темы:

* `request` fixture
* Новый APIRequestContext
* Base URL
* Shared headers
* Cookies и storage state
* Dispose и lifecycle

---

## 190. API Client и граница HTTP-слоя

**Главный вопрос**

> Как скрыть детали HTTP-вызовов, не скрывая смысл API-операций?

Темы:

* API Client
* Resource clients
* Request и response models
* Transport errors
* Public API модуля
* Избыточная абстракция

---

## 191. Аутентификация API

**Главный вопрос**

> Как передавать credentials безопасно и отделять получение доступа от бизнес-запросов?

Темы:

* API key
* Bearer token
* OAuth overview для QA
* Token lifecycle
* Secrets boundary
* Негативные сценарии доступа

---

## 192. Request Builders и подготовка данных через API

**Главный вопрос**

> Как создавать сложные payloads и тестовые данные без копирования деталей запроса?

Темы:

* Request Builder
* Valid defaults
* Scenario overrides
* Unique data
* Setup through API
* Cleanup contract

---

## 193. Проверка API-ответов и бизнес-правил

**Главный вопрос**

> Как разделить проверку HTTP-контракта и проверку ожидаемого поведения системы?

Темы:

* Status и headers checks
* Response shape
* Business assertions
* Expected versus actual
* Диагностические сообщения

---

## 194. Негативные API-сценарии и ошибки

**Главный вопрос**

> Как проверять контролируемый отказ, а не только успешный ответ?

Темы:

* Invalid input
* Missing credentials
* Forbidden operation
* Not found и conflict
* Error response contract
* Побочные эффекты после ошибки

---

## 195. Проверка контрактов во время выполнения

**Главный вопрос**

> Как проверить внешний ответ во время выполнения, если TypeScript не валидирует runtime data?

Темы:

* TypeScript boundary
* OpenAPI и JSON Schema как источники контракта
* Runtime validator boundary
* Contract drift
* Contract test и business assertion
* Диагностика несовпадения

---

## 196. Совместные UI и API-сценарии

**Главный вопрос**

> Как использовать API для подготовки и очистки данных, сохраняя UI как предмет проверки?

Темы:

* API setup
* UI verification
* UI action и API verification
* Cleanup through API
* Общая identity данных
* Граница ответственности слоёв

---

# Раздел 5. Тестирование gRPC

**Назначение раздела:** научить читать protobuf-контракт, вызывать gRPC service из Node.js и проверять ответы, статусы и временные границы.

**Предпосылки:** 186–196, TypeScript 158.

**Результат:** читатель автоматизирует unary gRPC scenarios и интегрирует client в framework, понимая границу Node gRPC и grpc-web.

**Граница review/freeze:** главы 197–206.

---

## 197. gRPC и REST в тестовой архитектуре

**Главный вопрос**

> Чем gRPC-взаимодействие отличается от REST и что это меняет для теста?

Темы:

* RPC model
* Service и method
* Binary messages
* HTTP/2 boundary
* Node gRPC и grpc-web
* Выбор уровня проверки

---

## 198. Protocol Buffers: сервисы и сообщения

**Главный вопрос**

> Как `.proto`-контракт описывает доступные вызовы и данные?

Темы:

* `service`
* `rpc`
* Request и response messages
* Field numbers
* Package
* Совместимость контракта

---

## 199. Сгенерированный код и создание gRPC Client

**Главный вопрос**

> Как protobuf-контракт превращается в вызываемый и типизированный client API?

Темы:

* Code generation boundary
* Generated message types
* Generated service client
* Channel и endpoint
* Credentials
* Lifecycle client

---

## 200. Unary gRPC-вызовы

**Главный вопрос**

> Как выполнить unary call и получить его результат в тесте?

Темы:

* Unary request-response
* Promise wrapper boundary
* Request message
* Response message
* Call lifecycle
* Streaming overview без реализации

---

## 201. Поля protobuf-сообщений

**Главный вопрос**

> Как особенности protobuf fields влияют на подготовку запроса и проверку ответа?

Темы:

* Scalar fields
* Repeated fields
* Enums
* Optional fields
* Default values
* Nested messages

---

## 202. Metadata и аутентификация gRPC

**Главный вопрос**

> Как передавать служебные данные отдельно от request message?

Темы:

* Metadata
* Authorization metadata
* Correlation id
* Общие metadata interceptors
* Secrets boundary

---

## 203. Deadlines и timeouts gRPC

**Главный вопрос**

> Как ограничить время gRPC-вызова и отличить медленный ответ от зависшего запроса?

Темы:

* Deadline
* Client timeout
* Cancellation
* `DEADLINE_EXCEEDED`
* Диагностика времени вызова

---

## 204. Статусы gRPC и обработка ошибок

**Главный вопрос**

> Как gRPC сообщает об отказе и какие свойства ошибки должен проверять тест?

Темы:

* Status code
* Details
* Metadata ошибки
* Transport и business failure
* Негативные сценарии

---

## 205. Проверка gRPC-ответов и негативных сценариев

**Главный вопрос**

> Как проверить message contract, business result и отсутствие нежелательных побочных эффектов?

Темы:

* Message shape
* Repeated и optional fields
* Business assertions
* Invalid request
* Authorization failure
* Диагностические сообщения

---

## 206. gRPC Client в Automation Framework

**Главный вопрос**

> Как встроить generated client в framework и сравнивать gRPC-данные с другими слоями?

Темы:

* Client wrapper
* Configuration и channel ownership
* Metadata composition
* Fixture lifecycle
* Сравнение с API и database
* Граница generated и handwritten code

---

# Раздел 6. Тестирование PostgreSQL

**Назначение раздела:** использовать database как контролируемый test boundary для подготовки и проверки данных, не превращая курс в database administration.

**Предпосылки:** 186–206, TypeScript 158.

**Результат:** читатель безопасно выполняет parameterized queries, управляет connection lifecycle, cleanup и isolation, сравнивает database data с API и gRPC.

**Граница review/freeze:** главы 207–215.

---

## 207. PostgreSQL в Automation QA

**Главный вопрос**

> Когда тесту нужен прямой доступ к PostgreSQL и где проходит граница такой проверки?

Темы:

* Database как test boundary
* Source of truth
* Подготовка и verification
* Риск привязки к реализации
* Ownership тестовых данных

---

## 208. Connections, pools и lifecycle

**Главный вопрос**

> Как управлять соединениями с database без утечек и взаимного влияния тестов?

Темы:

* Connection
* Pool
* Acquire и release
* Test-scoped и worker-scoped lifecycle
* Ошибки подключения
* Graceful shutdown

---

## 209. Parameterized queries

**Главный вопрос**

> Как передавать данные в SQL безопасно и предсказуемо?

Темы:

* Query parameters
* SQL injection boundary
* `null` и типы database
* Query result
* Ошибки запроса

---

## 210. Database Access Layer

**Главный вопрос**

> Как отделить тестовый сценарий от SQL и схемы database?

Темы:

* Database client
* Query modules
* Repository Pattern как вариант
* Result mapping
* Public API слоя
* Риск универсального repository

---

## 211. Подготовка и очистка данных в database

**Главный вопрос**

> Как создавать и удалять test data с явным владельцем и предсказуемым lifecycle?

Темы:

* Data setup
* Cleanup
* Unique identifiers
* Foreign keys
* Idempotent cleanup
* Cleanup после падения

---

## 212. Transactions, rollback и test isolation

**Главный вопрос**

> Когда transaction помогает изолировать тест и когда rollback не покрывает внешние процессы?

Темы:

* Transaction boundary
* Commit и rollback
* Isolation levels overview
* Внешние соединения
* Background processing
* Ограничения transactional tests

---

## 213. Eventual consistency и polling

**Главный вопрос**

> Как проверять данные, которые появляются асинхронно, без произвольных пауз?

Темы:

* Eventual consistency
* Polling condition
* Interval и deadline
* Последняя наблюдаемая ошибка
* Timeout diagnostics

---

## 214. Сверка данных PostgreSQL с API и gRPC

**Главный вопрос**

> Как корректно сравнить database row с API или gRPC model?

Темы:

* Mapping
* Normalization
* Database types и transport types
* Stable identifiers
* Business fields
* Диагностика различий

---

## 215. Конфликты данных и параллельные тесты

**Главный вопрос**

> Почему общие database records создают нестабильность ещё до включения parallel execution?

Темы:

* Shared rows
* Unique namespace
* Ownership
* Cleanup race
* Worker identity
* Подготовка к parallel execution

---

# Раздел 7. Конфигурация, тестовые данные и общая инфраструктура

**Назначение раздела:** продолжить TypeScript-модели 156–159 конкретной runtime-реализацией configuration, test data, helpers и domain checks.

**Предпосылки:** 160–215, TypeScript 156–159.

**Результат:** читатель строит валидируемую конфигурацию, управляет жизненным циклом test data и создаёт узкие reusable APIs.

**Граница review/freeze:** главы 216–224.

---

## 216. Конфигурация Playwright и execution projects

**Главный вопрос**

> Как связать настройки Playwright Test с браузерами, окружениями и режимами запуска?

Темы:

* `playwright.config`
* Projects
* `use` options
* Base URL
* Reporter selection
* Execution profiles

---

## 217. Окружения, переменные и secrets

**Главный вопрос**

> Как передавать различия окружений и чувствительные данные без hardcode?

Темы:

* Environment variables
* Local и CI environment
* Secrets
* Required и optional values
* Redaction
* Запрет credentials в repository

---

## 218. Загрузка и runtime validation конфигурации

**Главный вопрос**

> Как завершить запуск сразу, если внешняя конфигурация неполна или некорректна?

Темы:

* Config loader
* Parse и normalize
* Runtime validation
* Typed configuration result
* Fail fast
* Диагностическая ошибка

---

## 219. Организация test data

**Главный вопрос**

> Когда использовать статические данные, а когда создавать их динамически?

Темы:

* Static fixtures data
* Dynamic data
* Scenario data
* Environment-dependent data
* Data ownership
* Секреты и персональные данные

---

## 220. Builders, factories и уникальные данные

**Главный вопрос**

> Как создавать валидные данные с минимальными изменениями для конкретного сценария?

Темы:

* Builder
* Factory
* Valid defaults
* Overrides
* Unique values
* Reproducibility и seed

---

## 221. Жизненный цикл тестовых данных

**Главный вопрос**

> Как связать создание, использование и cleanup данных в одну управляемую операцию?

Темы:

* Setup ownership
* Cleanup registration
* Cleanup order
* Failure-safe cleanup
* API и database cleanup
* Parallel-safe data

---

## 222. Helpers и границы повторного использования

**Главный вопрос**

> Какие операции действительно должны становиться shared helpers?

Темы:

* Повторяемая операция
* Domain helper и technical helper
* Узкий public API
* Side effects
* Dependency visibility
* Dumping ground anti-pattern

---

## 223. Пользовательские проверки и soft assertions

**Главный вопрос**

> Когда базовых assertions недостаточно и как сохранить полезную диагностику?

Темы:

* Custom matcher boundary
* Domain assertion
* Soft assertions
* Expected и actual
* Failure message
* Attachment from assertion

---

## 224. Нормализация и проверки между слоями

**Главный вопрос**

> Как сравнивать одну бизнес-сущность, представленную разными моделями UI, API, gRPC и database?

Темы:

* Canonical model
* Mapping
* Normalization
* Dates, numbers и optional values
* Field ownership
* Reusable comparison logic

---

# Раздел 8. Диагностика и отчётность

**Назначение раздела:** превратить падение теста в воспроизводимое расследование с достаточными runtime evidence и понятным report.

**Предпосылки:** 166–224.

**Результат:** читатель собирает logs, traces, screenshots, videos и attachments, а затем представляет их в общем report и Allure.

**Граница review/freeze:** главы 225–231.

---

## 225. Расследование падения автотеста

**Главный вопрос**

> Как перейти от симптома в отчёте к воспроизводимой root cause?

Темы:

* Symptom
* Reproduction
* Test, framework и application failure
* Сужение области поиска
* Root cause
* Verification исправления

---

## 226. Структурированное логирование

**Главный вопрос**

> Какие события нужно логировать, чтобы восстановить ход теста без информационного шума?

Темы:

* Log levels
* Structured fields
* Correlation id
* Request и response metadata
* Redaction
* Logger boundary

---

## 227. Screenshots, videos и Playwright Trace

**Главный вопрос**

> Какой вид evidence отвечает на какой вопрос при UI-падении?

Темы:

* Screenshot
* Video
* Trace
* DOM snapshot
* Network timeline
* Политика сохранения

---

## 228. Attachments и lifecycle артефактов

**Главный вопрос**

> Как прикреплять полезные данные к test result и управлять их размером и сроком хранения?

Темы:

* Attachments
* JSON и text evidence
* Request и response payloads
* File naming
* Retention
* Sensitive data

---

## 229. Принципы тестовой отчётности

**Главный вопрос**

> Какая информация делает report полезным для разработки, QA и CI?

Темы:

* Test identity
* Status и duration
* Steps
* Failure details
* Environment information
* Links и ownership

---

## 230. Отчётность в Allure

**Главный вопрос**

> Как представить test results и evidence в Allure без дублирования логики теста?

Темы:

* Allure adapter
* Steps
* Labels
* Links
* Attachments
* Environment information
* History overview

---

## 231. Диагностический поток Framework

**Главный вопрос**

> Как logs, Playwright evidence, attachments и report образуют единый путь расследования?

Темы:

* Evidence collection policy
* Failure hooks
* Correlation
* Report integration
* Storage boundary
* Проверка достаточности диагностики

---

# Раздел 9. Стабильность и масштабирование выполнения

**Назначение раздела:** сначала устранить причины нестабильности, затем безопасно ускорить выполнение через workers, parallel execution и sharding.

**Предпосылки:** 175, 215, 216–231.

**Результат:** читатель диагностирует flaky tests, ограниченно применяет retries и масштабирует запуск без конфликтов shared resources.

**Граница review/freeze:** главы 232–238.

---

## 232. Причины flaky tests

**Главный вопрос**

> Какие нарушения детерминированности делают результат теста нестабильным?

Темы:

* Неправильные ожидания
* Shared state
* Неуправляемые данные
* Внешние зависимости
* Race conditions
* Resource exhaustion

---

## 233. Расследование и quarantine flaky tests

**Главный вопрос**

> Как доказать причину нестабильности и временно защитить основной сигнал тестового запуска?

Темы:

* Reproduction strategy
* Повторяемые evidence
* Classification
* Quarantine
* Ownership и срок исправления
* Verification стабильности

---

## 234. Retry policy

**Главный вопрос**

> Когда повторный запуск даёт диагностический сигнал, а когда скрывает дефект?

Темы:

* Retry после анализа причин
* Retry configuration
* First-run и retry evidence
* Infrastructure failure
* Запрет retry как основного исправления
* Метрики нестабильности

---

## 235. Workers и shared resources

**Главный вопрос**

> Как Playwright Test распределяет работу и какие ресурсы нельзя разделять между workers без координации?

Темы:

* Worker process
* Worker-scoped fixtures
* Worker index
* Shared accounts
* Database records
* External service limits

---

## 236. Parallel execution

**Главный вопрос**

> Как ускорить suite, сохраняя isolation и предсказуемость результатов?

Темы:

* File-level parallelism
* Fully parallel mode
* Serial boundary
* Resource partitioning
* Duration balance
* Диагностика конфликтов

---

## 237. Sharding

**Главный вопрос**

> Как разделить suite между независимыми процессами или CI jobs?

Темы:

* Shard index и total
* Независимость shards
* Balanced distribution
* Report merge
* Общие внешние ресурсы

---

## 238. Tags, annotations и test selection

**Главный вопрос**

> Как выбирать нужный набор тестов без копирования suites и скрытых условий?

Темы:

* Tags
* Annotations
* Grep
* Projects
* Smoke и regression sets
* Skip и fixme policy

---

# Раздел 10. CI и эксплуатация проекта

**Назначение раздела:** перенести детерминированный локальный запуск в GitHub Actions и сохранить диагностику, безопасность и масштабирование.

**Предпосылки:** 216–238.

**Результат:** читатель создаёт воспроизводимый CI pipeline с browsers, secrets, artifacts, reports и распределённым запуском.

**Граница review/freeze:** главы 239–244.

---

## 239. CI fundamentals для Automation QA

**Главный вопрос**

> Какие условия делают тестовый запуск воспроизводимым в чистом CI environment?

Темы:

* Clean runner
* Deterministic install
* Test command
* Exit codes
* Environment parity
* Timeout job

---

## 240. GitHub Actions pipeline

**Главный вопрос**

> Как описать автоматический запуск Playwright Test для push и pull request?

Темы:

* Workflow
* Trigger
* Job и steps
* Checkout и Node.js setup
* Dependency installation
* Playwright test command

---

## 241. Browsers и системные зависимости в CI

**Главный вопрос**

> Как подготовить runner для browser automation и избежать различий с локальным запуском?

Темы:

* Browser installation
* System dependencies
* Browser versions
* Caching boundary
* Headless execution
* Local versus CI differences

---

## 242. Environments и secrets в CI

**Главный вопрос**

> Как безопасно передать environment configuration и credentials в pipeline?

Темы:

* Repository и environment secrets
* Variables
* Protected environments
* Secret masking
* Runtime validation
* Least privilege

---

## 243. Артефакты и отчёты в CI

**Главный вопрос**

> Как сохранить report, trace, screenshots и logs после завершения runner?

Темы:

* Artifact upload
* Upload on failure
* Retention
* Allure results
* Report publication boundary
* Sensitive evidence

---

## 244. CI jobs, sharding и диагностика запусков

**Главный вопрос**

> Как масштабировать pipeline и расследовать различия между pull-request, scheduled и локальным запуском?

Темы:

* Matrix jobs
* Sharding
* Report merge
* Pull-request runs
* Scheduled runs
* Failure diagnosis

---

# Раздел 11. Интеграция Automation Framework

**Назначение раздела:** собрать изученные слои в единую архитектуру до начала capstone, не вводя новых foundational topics.

**Предпосылки:** 160–244.

**Результат:** читатель может обосновать dependency flow, data lifecycle, observability и execution model промышленного framework.

**Граница review/freeze:** главы 245–249.

---

## 245. Интеграция слоёв и dependency flow

**Главный вопрос**

> Как UI, API, gRPC, database и shared infrastructure взаимодействуют без нарушения границ?

Темы:

* Layer ownership
* Dependency direction
* Public APIs
* Composition Root
* Cross-layer orchestration
* Запрет циклических зависимостей

---

## 246. Composition fixtures и configuration flow

**Главный вопрос**

> Как configuration превращается в управляемые clients, pages и test resources?

Темы:

* Config loading
* Client factories
* Fixture graph
* Resource scopes
* Cleanup order
* Dependency visibility

---

## 247. Жизненный цикл данных в сценариях между слоями

**Главный вопрос**

> Как одна test entity проходит создание, использование, проверку и cleanup через разные слои?

Темы:

* Entity identity
* API или database setup
* UI action
* API, gRPC и database verification
* Ownership
* Failure-safe cleanup

---

## 248. Диагностика, стабильность и CI в общей архитектуре

**Главный вопрос**

> Как framework сохраняет диагностический сигнал при локальном, parallel и CI execution?

Темы:

* Correlated logs
* Runtime evidence
* Reports
* Worker и shard identity
* CI artifacts
* Flaky signal

---

## 249. Architecture review и эволюция Framework

**Главный вопрос**

> Как оценить готовность framework к росту и выбрать следующий рефакторинг по фактической проблеме?

Темы:

* Architecture review checklist
* Coupling и cohesion
* Public boundaries
* Maintenance cost
* Incremental refactoring
* Запрет speculative abstractions

---

# Часть IV. Финальный проект

---

# Раздел 1. Финальный промышленный проект

**Назначение раздела:** поэтапно реализовать один Automation QA Framework, используя только уже изученные механизмы.

**Предпосылки:** 160–249.

**Результат:** читатель представляет работающий проект с UI, REST, gRPC и PostgreSQL слоями, диагностикой, parallel execution и GitHub Actions.

**Граница review/freeze:** главы 250–259.

---

# Замороженная спецификация финального проекта

```text
FINAL PROJECT SPECIFICATION

Version 1.1

STATUS

FROZEN
```

Спецификация фиксирует обязательный результат глав 250–259. Изменение mandatory scope, scenario minimums, milestones, Definition of Done или review rubric требует нового specification architecture review по `.meta/CHANGE_POLICY.md`.

## Модель System Under Test

Default путь финального проекта использует repository-owned учебное приложение
**Educational Work Items**. Репозиторий предоставляет его UI, REST API, unary
gRPC service, PostgreSQL persistence, test accounts, migrations и deterministic
seed data через ненумерованный infrastructure milestone SUT-0.

Educational Work Items обязан предоставлять:

* browser-accessible UI;
* REST API;
* unary gRPC service для того же бизнес-домена;
* PostgreSQL persistence с read access и согласованным write access для setup или cleanup;
* authentication минимум для UI и одного service layer;
* бизнес-сущность с create/read/update либо эквивалентным изменением состояния;
* детерминированный способ cleanup созданных данных;
* доступность обязательных сервисов локально и из GitHub Actions.

Распределение ресурсов:

* **Репозиторий предоставляет:** Educational Work Items SUT, требования,
  изученный стек, milestone structure, Definition of Done и review rubric.
* **Ученик реализует:** Automation QA Framework в
  `examples/04-final-project/`, используя только публичные SUT boundaries.
* **Настраивается:** локальные URLs, secret references, environment profiles,
  timeouts и identifiers учебных ресурсов.
* **Можно mock:** только необязательные third-party dependencies; mocks не заменяют mandatory UI, REST, unary gRPC и PostgreSQL integration.
* **Default orchestration:** локальный Docker Compose flow, реализуемый SUT-0.
* **Не предоставляется:** production-ready backend, production deployment или
  production credential management.

Другой SUT допускается только через отдельный compatibility review, который
доказывает соответствие всем mandatory capabilities, scenario contracts,
cleanup и CI requirements. Такой путь не является default и не меняет
repository-owned SUT requirements.

Если Educational Work Items не проходит Gate C или выбранный alternative SUT не
проходит compatibility review, главы 253–256 остаются заблокированы.

## Размер проекта

* Один repository и один бизнес-домен.
* Десять milestones, соответствующих главам 250–259.
* Девять mandatory automated scenarios.
* Ориентир реализации Automation QA Framework: 30–45 часов после завершения
  главы 249 и готовности SUT-0; реализация SUT не входит в работу ученика.
* Документация: один operational `README`, одна architecture diagram и минимум три кратких Architecture Decision Records.

Проект автоматизирует representative workflow, а не полное покрытие продукта.

## Mandatory scope

Для получения passing result обязательны:

* один устанавливаемый и запускаемый TypeScript repository;
* typed configuration с runtime validation;
* local profile и CI profile;
* UI Layer на Playwright с Page Objects и Component Objects там, где композиция оправдана;
* REST API Layer на `APIRequestContext`;
* gRPC Layer на `@grpc/grpc-js` с generated client integration;
* Database Layer на `pg` с connection pool и parameterized queries;
* fixtures с явным resource lifecycle;
* test-data strategy с owner, setup и cleanup;
* normalization strategy для cross-layer comparison;
* девять mandatory scenarios из frozen portfolio;
* минимум два authenticated scenarios: один UI и один REST или gRPC;
* минимум три negative scenarios: по одному UI, REST и gRPC;
* минимум два state-changing scenarios;
* минимум одна прямая проверка persisted state в PostgreSQL;
* минимум одна setup или cleanup operation через Database Layer, если write access разрешён; при read-only access обязательна документированная API cleanup alternative;
* runtime contract checking REST responses;
* structured diagnostics и Allure results;
* полный mandatory suite с двумя workers и retries, установленными в `0` для stability proof;
* GitHub Actions workflow, выполняющий полный mandatory suite;
* operational README, architecture documentation и известные ограничения.

## Mandatory scenario portfolio

| Layer | Количество | Обязательное поведение |
| ----- | ---------: | ---------------------- |
| UI | 2 | Один authenticated positive state-changing workflow и одна UI validation или negative scenario |
| REST | 2 | Один positive state-changing request и один negative request с ожидаемым error response |
| gRPC | 2 | Один successful unary call и один unary call с ожидаемым non-OK status |
| Cross-layer | 3 | API setup → UI verification; UI action → PostgreSQL verification; gRPC call → PostgreSQL или REST comparison |

Итого: **9 mandatory scenarios**. Один scenario не может одновременно закрывать две строки таблицы, но может дополнительно подтверждать authentication, negative, state-changing или database requirement.

Для каждого mandatory scenario фиксируются:

* source layer;
* business action;
* expected business result;
* verification layer;
* data owner;
* setup strategy;
* cleanup strategy;
* expected diagnostic evidence.

## Optional scope

Следующие extensions не влияют на passing result:

* дополнительные browsers;
* дополнительные environments;
* дополнительные UI, REST, gRPC, database или cross-layer scenarios;
* network interception и mocking сверх mandatory portfolio;
* advanced Allure labels, links и history;
* sharding;
* scheduled CI runs;
* CI matrix;
* gRPC streaming;
* дополнительный Docker mode сверх обязательного SUT-0 local flow;
* performance observations без load-testing программы;
* дополнительные database verification rules.

Optional work оценивается только после выполнения всех mandatory requirements и не компенсирует их отсутствие.

## Explicit exclusions

Финальный проект не требует:

* разработки или изменения System Under Test учеником;
* полного покрытия продукта;
* production deployment;
* полноценного DevOps pipeline;
* Kubernetes или multi-region infrastructure;
* обязательного Docker;
* load testing;
* security penetration testing;
* mobile automation;
* внешней visual regression platform;
* custom test runner, assertion framework или reporting system;
* dependency injection container или plugin architecture;
* monorepo и package publishing;
* реализации gRPC streaming;
* реализации OAuth provider;
* database administration и проектирования production schema.

## Architecture acceptance

Обязательные responsibility boundaries:

* tests выражают business scenarios и вызывают public APIs слоёв;
* UI abstractions владеют locators и browser actions;
* API Client владеет HTTP transport setup и request construction;
* gRPC Client владеет channel, metadata, deadline и generated client integration;
* Database Access Layer владеет pool и SQL operations;
* fixtures владеют creation, scope и teardown ресурсов;
* configuration module загружает, валидирует и выдаёт immutable runtime config;
* test-data module создаёт unique data и регистрирует cleanup;
* normalization module приводит layer models к сопоставимому виду;
* diagnostics и reporting собирают sanitized evidence.

Dependency direction документируется в architecture diagram. Tests могут зависеть от public APIs слоёв; transport и infrastructure modules не зависят от tests. Циклические зависимости запрещены.

Запрещены raw selectors, raw SQL, HTTP request construction и gRPC transport setup, продублированные в test scenarios; hidden global mutable state; scattered environment branching; hardcoded secrets; arbitrary sleeps; retry как исправление дефекта; cleanup только после успешного теста.

Folder structure остаётся свободным архитектурным решением, если responsibilities и dependency direction соблюдены.

## Configuration and secrets acceptance

* External configuration имеет TypeScript model и runtime validation.
* Required values перечислены явно; invalid configuration завершает запуск до tests с non-zero exit status.
* Реализованы local и CI profiles.
* Runtime-validation library выбирается в milestone 252 и обосновывается в ADR; конкретная library не предписывается.
* Real secrets отсутствуют в source control и загружаются через local secret storage или GitHub Secrets.
* Environment variables документированы.
* Logs, errors, reports и attachments redacted от tokens, passwords, connection strings и sensitive payload fields.

## Data lifecycle acceptance

* Каждая созданная entity имеет owner: test либо fixture.
* Shared environments используют unique identifiers, включающие worker-safe component.
* Setup и cleanup определены до реализации scenario.
* Cleanup выполняется fixture teardown или зарегистрированным failure-safe mechanism.
* API cleanup, database cleanup, rollback или isolated environment reset выбираются по границе scenario и документируются.
* Static accounts имеют назначение, scope, mutation policy и запрет конкурентного изменения без isolation.
* Generated data имеет naming и retention policy.
* Eventual consistency обрабатывается condition-based polling с deadline, без arbitrary sleep.
* Mandatory tests не зависят от порядка выполнения.

## Runtime contract validation acceptance

TypeScript annotation не считается runtime validation внешнего REST response.

Если System Under Test предоставляет стабильный OpenAPI или JSON Schema contract, mandatory REST responses проверяются по нему. Library выбирается в milestone 254 и фиксируется в ADR.

Если стабильный machine-readable contract отсутствует, обязательна документированная runtime validator function для business-critical fields, status-dependent shape и error response. Полный отказ от runtime checking не допускается.

Validation failure должна показывать безопасный field path, expected rule и sanitized actual value.

## Diagnostics and reporting acceptance

При падении соответствующего layer mandatory evidence включает:

* **UI:** screenshot, Playwright Trace, current URL, failed business step и business identifier при его наличии.
* **REST:** method, sanitized URL, status code, sanitized request/response details и contract-validation result.
* **gRPC:** service, method, sanitized metadata summary, status code, status details и configured deadline.
* **PostgreSQL:** operation name, safe query identifier и normalized expected/actual data без credentials или raw sensitive values.

Каждый mandatory test создаёт Allure result. Layer-specific failure evidence прикрепляется к Allure либо сохраняется как CI artifact со ссылкой из test result. Environment profile и correlation/business identifier указываются при наличии.

## Parallel and stability acceptance

* Полный mandatory suite проходит с двумя workers.
* Stability proof: три последовательных успешных запуска с двумя workers и `retries: 0`; минимум один запуск выполняется в GitHub Actions.
* Tests не зависят от порядка и не изменяют shared data без isolation.
* Fixtures и clients имеют controlled lifetime и не содержат unsafe global mutable state.
* Падение, прошедшее только после retry, не считается стабильным результатом.
* Flaky test получает owner, evidence, quarantine decision и срок исправления; он не может silently оставаться в mandatory passing suite.
* Sharding является optional extension.

## CI acceptance

GitHub Actions workflow обязан:

* запускаться через `pull_request` и `workflow_dispatch`;
* использовать поддерживаемую и зафиксированную major version Node.js;
* выполнять deterministic installation через lockfile;
* устанавливать требуемые Playwright browsers и system dependencies;
* получать endpoints и non-sensitive configuration через variables, secrets через GitHub Secrets;
* обеспечивать доступность UI, REST, gRPC и PostgreSQL либо запускать документированный training environment;
* выполнять одну documented command для полного mandatory suite;
* возвращать non-zero status при test failure;
* сохранять Allure results и общий report artifact;
* сохранять screenshots и traces при UI failures;
* документировать service availability, permissions, retention и известные CI limitations.

Если полный mandatory suite недоступен из CI, Definition of Done получает `FAIL`. Matrix, scheduled runs и sharding остаются optional.

## Documentation acceptance

Operational `README` содержит:

* purpose и System Under Test assumptions;
* prerequisites и installation;
* configuration, environment variables и secret handling;
* local command полного suite и commands по слоям;
* parallel command;
* report generation;
* GitHub Actions behavior;
* architecture overview и layer responsibilities;
* test-data lifecycle и cleanup strategy;
* known limitations;
* troubleshooting.

Architecture documentation содержит одну актуальную diagram, dependency direction и минимум три ADR с decision, alternatives и consequences. Другой QA engineer должен выполнить documented setup и mandatory command без устных инструкций автора.

## Code quality acceptance

* TypeScript compilation и обязательные validation commands завершаются успешно.
* В mandatory project code нет implicit или скрытого `any`, необоснованных unsafe assertions и unhandled rejected promises.
* Нет real secrets, mandatory `TODO`/`FIXME`, arbitrary sleeps, test-order dependency и retry-dependent passing.
* Raw selectors, SQL и transport setup не дублируются между tests.
* Database connections освобождаются; owned test data имеет cleanup.
* Public boundaries и names отражают ответственность; framework code остаётся inspectable и debuggable.
* Не требуются one-class-per-file, обязательные interfaces, одинаковая folder structure слоёв или generics без практической необходимости.

## Milestone specification

### Chapter 250

* **Input:** frozen specification и repository-owned Educational Work Items contract.
* **Deliverable:** подтверждённый default SUT scope, scope matrix, девять scenario records, initial Definition of Done и effort plan.
* **Evidence:** planned capabilities и Gate C requirements трассируются к scenario portfolio без framework implementation.
* **Failure:** mandatory capability, data cleanup или CI boundary не определены.
* **Excluded:** разработка System Under Test и test code.
* **Handoff:** approved scope и risks передаются в chapter 251.

### Chapter 251

* **Input:** approved scope, scenarios и risks.
* **Deliverable:** architecture diagram, responsibility table, dependency direction, минимум три initial ADR и plan milestones 252–259.
* **Evidence:** review подтверждает отсутствие cycles и ownership gaps.
* **Failure:** не определены layer boundaries, resource owners или dependency direction.
* **Excluded:** выбор универсальной folder structure и реализация слоёв.
* **Handoff:** architecture contract передаётся в chapter 252.

### Chapter 252

* **Input:** architecture contract и SUT configuration contract.
* **Deliverable:** compiling skeleton, package commands, Playwright configuration, runtime-validated local/CI profiles, secret handling, base fixtures и первый CI-compatible command.
* **Evidence:** clean install, compilation, invalid-config failure и dry startup command.
* **Failure:** hardcoded secret, unvalidated external config или broken command.
* **Excluded:** реализация business scenarios и clients всех слоёв.
* **Handoff:** runtime composition передаётся в chapter 253.

### Chapter 253

* **Input:** skeleton, config и UI contracts.
* **Deliverable:** UI Layer, authentication state, UI fixtures и два mandatory UI scenarios.
* **Evidence:** оба scenarios проходят независимо; negative scenario падает при намеренно нарушенном expectation с UI evidence.
* **Failure:** unstable locators, shared mutable session, arbitrary sleep или отсутствующий cleanup.
* **Excluded:** REST, gRPC и database layer implementation.
* **Handoff:** UI public API и data needs передаются в chapter 254.

### Chapter 254

* **Input:** architecture contract, REST contract и data needs.
* **Deliverable:** REST client, authentication, justified builders, runtime contract checks, setup/cleanup operations и два mandatory REST scenarios.
* **Evidence:** positive и negative scenarios проходят; invalid runtime response вызывает диагностическую validation failure.
* **Failure:** TypeScript annotation используется вместо runtime check или request construction дублируется в tests.
* **Excluded:** gRPC transport и database access.
* **Handoff:** REST setup/cleanup API передаётся в chapter 255.

### Chapter 255

* **Input:** `.proto`, generated code и architecture contract.
* **Deliverable:** gRPC Client integration, metadata, deadlines, status handling и два mandatory unary scenarios.
* **Evidence:** successful и non-OK status scenarios проходят с sanitized diagnostics.
* **Failure:** отсутствует deadline, status assertion или generated/handwritten boundary.
* **Excluded:** streaming implementation.
* **Handoff:** gRPC public API и comparison data передаются в chapter 256.

### Chapter 256

* **Input:** database access contract и required verification data.
* **Deliverable:** pool lifecycle, parameterized queries, Database Access Layer, setup/cleanup operation и persisted-state verification.
* **Evidence:** connections release after success/failure; unsafe interpolation check отсутствует; cleanup доказан повторным query.
* **Failure:** ad hoc connections, interpolated SQL, leaked connection или отсутствующий data owner.
* **Excluded:** database administration, schema redesign и migrations System Under Test.
* **Handoff:** database public API и normalized models передаются в chapter 257.

### Chapter 257

* **Input:** public APIs всех слоёв и scenario records.
* **Deliverable:** три mandatory cross-layer scenarios, canonical comparison model, unique data strategy, ownership map и failure-safe cleanup.
* **Evidence:** scenarios проходят независимо и оставляют no owned data; polling показывает deadline diagnostics.
* **Failure:** layer bypass, order dependency, leaked data или direct comparison без normalization.
* **Excluded:** новые transport clients и новые foundational abstractions.
* **Handoff:** полный mandatory portfolio передаётся в chapter 258.

### Chapter 258

* **Input:** полный mandatory portfolio и diagnostics requirements.
* **Deliverable:** structured logs, Allure integration, attachments, two-worker execution и GitHub Actions workflow с artifacts.
* **Evidence:** три stability runs, включая один CI run; controlled failure создаёт expected evidence и failed workflow.
* **Failure:** retry-dependent passing, missing secret redaction, missing CI layer или потерянные failure artifacts.
* **Excluded:** mandatory sharding, matrix и scheduled runs.
* **Handoff:** release candidate и evidence package передаются в chapter 259.

### Chapter 259

* **Input:** release candidate, evidence package и initial Definition of Done.
* **Deliverable:** final DoD audit, architecture/stability/security/CI reviews, known limitations, refactoring report, operational README и controlled development plan.
* **Evidence:** каждый DoD item имеет `PASS`, `FAIL` или обоснованный `NOT APPLICABLE`; independent runner воспроизводит setup и mandatory command.
* **Failure:** blocker, silently waived mandatory requirement или undocumented external dependency.
* **Excluded:** добавление новых features вместо закрытия audit findings.
* **Handoff:** frozen final assessment и готовый к демонстрации project repository.

## Definition of Done

Каждый пункт получает `PASS`, `FAIL` или `NOT APPLICABLE` с письменным обоснованием. Mandatory requirement нельзя отметить `NOT APPLICABLE`.

### Project setup

* Clean install по documented command проходит.
* TypeScript compilation и mandatory validation commands проходят.
* Full mandatory suite запускается одной documented command.
* Real secrets отсутствуют в repository и history проверяемой submission.

### Architecture

* Responsibilities обязательных слоёв документированы.
* Dependency direction соблюдён, cycles отсутствуют.
* Tests выражают business behavior и не дублируют transport/SQL/selector details.
* Reusable infrastructure имеет обоснованного consumer и не является speculative abstraction.

### Scenarios

* Реализованы ровно или больше девяти mandatory scenarios без подмены строк portfolio.
* Выполнены UI 2, REST 2, gRPC 2 и cross-layer 3 minimums.
* Выполнены authentication, negative, state-changing и PostgreSQL requirements.

### Data and runtime correctness

* Для created data указаны owner, setup и cleanup.
* Mandatory tests order-independent и используют parallel-safe identifiers.
* REST external data проверяется во время выполнения.
* gRPC statuses/deadlines обработаны.
* PostgreSQL comparisons normalized.
* Eventual consistency обрабатывается polling, если она присутствует.

### Diagnostics and stability

* Layer failures создают mandatory sanitized evidence.
* Allure results и CI artifacts доступны после запуска.
* Три runs с двумя workers и `retries: 0` успешны.
* Arbitrary sleeps и known retry-dependent flaky tests отсутствуют.

### CI and documentation

* GitHub Actions выполняет full mandatory suite и возвращает failed status при controlled failure.
* CI сохраняет report, Allure results и failure evidence.
* README и architecture documentation удовлетворяют frozen documentation acceptance.
* Known limitations и external dependencies перечислены.
* Другой QA engineer воспроизводит setup и run по документации.

### Final audit

* Blockers отсутствуют.
* Mandatory requirement не waived и не скрыт optional feature.
* Major findings закрыты либо project получает `FAIL`.
* Final limitations имеют owner, rationale и impact.

## Review rubric

Каждая категория оценивается от 0 до 10 и умножается на weight:

| Категория | Weight |
| --------- | -----: |
| Architecture | 10% |
| UI Layer | 7% |
| REST Layer | 7% |
| gRPC Layer | 7% |
| Database Layer | 7% |
| Cross-layer design | 10% |
| Configuration and secrets | 8% |
| Data lifecycle | 10% |
| Diagnostics and reporting | 8% |
| Stability and parallel safety | 8% |
| CI | 8% |
| Documentation | 5% |
| Code quality | 5% |

Passing result требует одновременно:

* weighted score не ниже 80%;
* отсутствие blockers;
* не более двух major findings;
* score каждой mandatory layer category не ниже 6/10;
* все mandatory DoD items имеют `PASS`.

**Blocker:** committed real secret; mandatory suite не запускается; обязательный layer отсутствует; GitHub Actions не выполняет tests; destructive data не имеет cleanup; REST external data доверяется только TypeScript annotation; SQL строится unsafe interpolation; tests зависят от порядка; retries нужны для обычного passing; undocumented external dependency делает запуск невоспроизводимым.

**Major finding:** нарушенная dependency direction; отсутствующая runtime evidence для целого layer; неполный mandatory portfolio; shared mutable data без isolation; CI не сохраняет обязательные artifacts; README не позволяет воспроизвести запуск.

**Minor finding:** локальное дублирование без изменения architecture boundary; неточная naming; неполное пояснение non-blocking decision; presentation defect, не влияющий на execution, diagnostics или cleanup.

Optional extensions не повышают score категории выше 10/10 и не компенсируют blocker, major finding или failed mandatory DoD item.

---

## 250. Требования и критерии готовности проекта

**Главный вопрос**

> Как ограничить scope финального проекта и превратить цели в проверяемые критерии?

Темы:

* Application under test
* Representative UI, REST, gRPC и database scenarios
* Functional requirements
* Quality requirements
* Definition of Done
* Явные exclusions

---

## 251. Архитектурные решения и план реализации

**Главный вопрос**

> Какие решения нужно принять до создания слоёв и в каком порядке их реализовывать?

Темы:

* Architecture decision records
* Layer boundaries
* Dependency flow
* Tool ownership
* Milestones
* Review points

---

## 252. Каркас, configuration и environments

**Главный вопрос**

> Как создать минимальный запускаемый каркас с валидируемой конфигурацией?

Темы:

* Project structure
* Playwright configuration
* Environment loader
* Secrets boundary
* Base fixtures
* Первый CI-compatible command

---

## SUT-0 — Educational SUT Infrastructure Milestone

**Статус:** authoritative unnumbered prerequisite.

**Позиция:** после главы 252 и до главы 253. SUT-0 не получает номер главы и не
изменяет нумерацию 250–259.

**Назначение:** предоставить default repository-owned Educational Work Items SUT
с воспроизводимыми UI, REST, unary gRPC и PostgreSQL boundaries, необходимыми
для практической реализации глав 253–259.

**Scope:**

* отдельная application boundary `sut/`;
* один TypeScript SUT process и отдельный PostgreSQL process;
* server-rendered UI, versioned REST API и unary gRPC;
* ordered migrations, deterministic seed и guarded reset;
* authentication, test-data ownership и failure-safe cleanup;
* liveness, readiness, local capability gate и CI-feasibility evidence;
* Docker Compose local orchestration;
* один root package и один lockfile.

**Deliverables:**

* runnable Educational Work Items SUT и PostgreSQL;
* reviewed public UI, REST, gRPC и database contracts;
* migrations, seed, health/readiness и cleanup boundaries;
* reproducible local startup and shutdown;
* mandatory capability report;
* technical, security и operational review evidence.

**Non-goals:**

* production-ready application или deployment;
* frontend framework, microservices, streaming gRPC или generalized platform;
* teaching content глав 253–259;
* реализация Automation QA Framework вместо ученика;
* самостоятельный chapter, baseline или content-freeze unit.

**Entry conditions:**

* главы 250–252 существуют как reviewed prerequisites и не изменяются при
  запуске implementation work;
* Gate A specification review имеет `PASS`;
* Gate B governance approval имеет `PASS`;
* governance ADRs SUT-001–SUT-004 приняты;
* implementation task явно ограничена разрешённой phase;
* dependency versions проверяются до installation;
* не требуются real secrets или production endpoints.

**Implementation phases:**

0. governance authorization;
1. skeleton и PostgreSQL foundation;
2. REST и authentication;
3. server-rendered UI;
4. unary gRPC и generated types;
5. reset/readiness hardening;
6. local capability gate;
7. CI feasibility;
8. reconciliation глав 250–251 и compatibility audit главы 252;
9. Gate D и возврат к обычному chapter workflow.

Каждая phase имеет отдельные entry, exit, evidence и stop conditions из
`.meta/FINAL_PROJECT_SUT_SPEC.md`. Gate B разрешает только Phase 1; следующие
phases требуют отдельного authorization после evidence предыдущей phase.

**Exit conditions:**

* Gate C имеет `PASS`;
* clean-clone startup, migrations, seed и shutdown воспроизводимы;
* UI, REST, unary gRPC, PostgreSQL и cleanup capabilities имеют runtime evidence;
* security, least privilege, isolation и redaction reviews пройдены;
* local capability gate имеет `PASS`;
* CI startup feasibility подтверждена;
* публичные contracts стабильны для глав 253–256.

**Stop conditions:**

* scope выходит за Educational Work Items;
* mandatory capability не реализуема в утверждённой architecture;
* unsafe cleanup, secret leakage или cross-run mutation;
* migration, seed, startup или shutdown недетерминированы;
* test framework импортирует SUT internals;
* implementation выходит за явно разрешённую phase;
* неизвестное prerequisite/evidence получает `BLOCKED`.

**Ownership:**

* Course Governance Reviewer владеет gates и scope;
* SUT Implementation Owner владеет application infrastructure;
* Database, Security, gRPC, UI и CI owners владеют соответствующими reviews;
* Chapter Owners не получают ownership SUT internals.

**Связи с курсом:**

* главы 250–252 являются prerequisites и позднее сверяются с runtime evidence;
* главы 253–256 зависят от Gate D и используют public SUT contracts;
* глава 257 по-прежнему владеет cross-layer scenarios;
* глава 258 по-прежнему владеет diagnostics, parallel execution и CI workflow;
* глава 259 по-прежнему владеет final audit и scoring.

Gate C подтверждает technical readiness всего SUT-0, но не разблокирует главы
самостоятельно. Gate D дополнительно требует reconciliation глав 250–251,
compatibility audit главы 252 и стабильность public contracts.

**Review requirements:** каждая implementation phase проходит scoped technical
review; перед Gate C обязательны architecture, security и operational reviews;
перед Gate D выполняются baseline reconciliation и chapter-252 compatibility
audit.

SUT-0 не имеет самостоятельного `CONTENT FROZEN` status. Финальная
content-freeze boundary остаётся ровно 250–259. SUT-0 не переносит teaching
ownership из глав 253–259.

---

## 253. Реализация UI Layer

**Главный вопрос**

> Как реализовать UI-сценарии через fixtures, Page Objects и components?

Темы:

* Stable locators
* Page Objects
* Component Objects
* Authentication state
* UI fixtures
* Web-first assertions

---

## 254. Реализация REST API Layer

**Главный вопрос**

> Как реализовать API setup, business scenarios и cleanup через `APIRequestContext`?

Темы:

* API Client
* Authentication
* Request Builders
* Runtime contract validation
* Negative scenarios
* Data setup и cleanup

---

## 255. Реализация gRPC Layer

**Главный вопрос**

> Как подключить generated gRPC client и реализовать unary scenarios?

Темы:

* Generated client
* Unary calls
* Metadata
* Deadlines
* Status errors
* Response checks

---

## 256. Реализация Database Layer

**Главный вопрос**

> Как реализовать безопасный доступ к PostgreSQL для setup, cleanup и verification?

Темы:

* Connection pool
* Parameterized queries
* Database Access Layer
* Transactions where applicable
* Cleanup
* Cross-layer verification

---

## 257. Cross-layer scenarios и data lifecycle

**Главный вопрос**

> Как объединить слои в сценариях с единым владельцем данных и гарантированным cleanup?

Темы:

* API setup и UI verification
* UI action и database verification
* gRPC и database comparison
* Canonical data model
* Unique data
* Failure-safe cleanup

---

## 258. Диагностика, parallel execution и CI

**Главный вопрос**

> Как обеспечить полезную диагностику и воспроизводимый масштабируемый запуск проекта?

Темы:

* Allure
* Structured logs
* Attachments
* GitHub Actions
* Parallel workers
* Sharding (optional)
* CI artifacts

---

## 259. Финальный аудит и подготовка к эксплуатации

**Главный вопрос**

> Соответствует ли реализованный framework требованиям и готов ли он к поддержке командой?

Темы:

* Definition of Done audit
* Architecture review
* Stability review
* Security и secrets review
* CI verification
* Final refactoring
* Что изучено
* Следующие шаги
* План контролируемого развития

---

# Итоговая статистика

| Часть            | Глав |
| ---------------- | ---: |
| Введение         |    4 |
| JavaScript       |   96 |
| TypeScript       |   63 |
| Automation QA    |   90 |
| Финальный проект |   10 |

**Всего глав: 263**

---

# Архитектурные принципы курса

Весь курс построен по единым правилам.

## 1. Одна глава — один вопрос

Каждая глава отвечает только на один главный вопрос.

```text
Вопрос

↓

Концепция

↓

Ментальная модель

↓

Практика
```

---

## 2. От причин к синтаксису

Во всех главах соблюдается последовательность:

```text
Проблема

↓

Почему существует механизм

↓

Как он работает

↓

Синтаксис

↓

Практическое применение
```

---

## 3. От простого к сложному

Каждая следующая глава использует знания предыдущих.

Новые концепции не вводятся без сформированного фундамента.

---

## 4. Единая терминология

Во всём курсе используются одни и те же определения, аналогии и ментальные модели.

---

## 5. Практическая направленность

Каждая концепция сопровождается примерами из реальной разработки и Automation QA.

---

# Статус документа

```text
ROADMAP Version 6.0

STATUS

FROZEN
```

После утверждения:

* не изменяется нумерация глав;
* новые главы не добавляются между существующими;
* развитие курса осуществляется только внутри уже утверждённых глав.

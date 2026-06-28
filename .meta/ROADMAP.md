# ROADMAP.md

> Version: 5.0
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

> Version: 5.0
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

> Version: 5.0
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
* новые темы интегрируются только в существующие главы.

---

# Главная цель раздела

После завершения JavaScript появляется естественный вопрос:

```text
JavaScript

↓

Как писать большие проекты безопаснее?
```

Ответом становится TypeScript.

Весь раздел строится вокруг одной идеи:

```text
JavaScript

↓

Types

↓

Safer Code

↓

Better Tooling

↓

Large Applications
```

---

# Раздел 1. Введение

---

## 97. TypeScript Compiler

**Главный вопрос**

> Что делает компилятор TypeScript?

Темы:

* tsc
* Компиляция
* Проверка типов
* Генерация JavaScript

---

## 98. tsconfig.json

**Главный вопрос**

> Как управлять компиляцией проекта?

Темы:

* compilerOptions
* include
* exclude
* strict
* target
* module

---

## 99. Type Erasure

**Главный вопрос**

> Почему после компиляции типы исчезают?

Темы:

* Compile Time
* Runtime
* Ограничения TypeScript

---

# Раздел 2. Базовые типы

---

## 100. Primitive Types

**Главный вопрос**

> Как описывать примитивные значения?

Темы:

* string
* number
* boolean
* bigint
* symbol
* null
* undefined

---

## 101. Object Types

**Главный вопрос**

> Как описывать объекты?

Темы:

* Object Types
* Optional Properties
* Nested Objects

---

## 102. Arrays

**Главный вопрос**

> Как типизировать массивы?

Темы:

* T[]
* Array<T>

---

## 103. Tuples

**Главный вопрос**

> Когда массив превращается в структуру фиксированной формы?

Темы:

* Tuple
* Readonly Tuple

---

## 104. Enum

**Главный вопрос**

> Как описывать ограниченный набор значений?

Темы:

* Numeric Enum
* String Enum
* const enum

---

## 105. Literal Types

**Главный вопрос**

> Как разрешить только конкретные значения?

Темы:

* String Literals
* Number Literals
* Boolean Literals

---

## 106. Union Types

**Главный вопрос**

> Как разрешить несколько возможных типов?

Темы:

* Union
* Narrowing Preview

---

## 107. Intersection Types

**Главный вопрос**

> Как объединить несколько типов?

Темы:

* Intersection
* Type Composition

---

# Раздел 3. Создание собственных типов

---

## 108. Type Alias

**Главный вопрос**

> Как дать имя сложному типу?

---

## 109. Interface

**Главный вопрос**

> Как описывать структуру объектов?

---

## 110. Interface vs Type

**Главный вопрос**

> Когда использовать Interface, а когда Type Alias?

---

## 111. Structural Typing

**Главный вопрос**

> Почему TypeScript сравнивает структуру, а не название типа?

---

# Раздел 4. Вывод типов

---

## 112. Type Inference

**Главный вопрос**

> Когда TypeScript способен вывести тип самостоятельно?

---

## 113. Narrowing

**Главный вопрос**

> Как TypeScript уточняет тип во время выполнения программы?

---

## 114. Type Guards

**Главный вопрос**

> Как помочь компилятору определить правильный тип?

Темы:

* typeof
* instanceof
* in
* User Defined Type Guards

---

## 115. Type Assertions

**Главный вопрос**

> Когда программист знает больше компилятора?

Темы:

* as
* Non-null Assertion
* Ограничения

---

## 116. satisfies

**Главный вопрос**

> Как проверить соответствие типа без изменения выводимого типа?

---

## 117. as const

**Главный вопрос**

> Как сохранить максимально точные литеральные типы?

---

# Раздел 5. Functions

---

## 118. Function Types

**Главный вопрос**

> Как описывать типы функций?

---

## 119. Function Overloads

**Главный вопрос**

> Как одна функция может иметь несколько сигнатур?

---

## 120. Generics

**Главный вопрос**

> Как писать универсальный код без потери типизации?

Темы:

* Generic Functions
* Generic Interfaces
* Generic Classes

---

## 121. Generic Constraints

**Главный вопрос**

> Как ограничивать Generic-параметры?

Темы:

* extends
* Ограничения Generic

---

# Раздел 6. Продвинутая система типов

---

## 122. keyof

**Главный вопрос**

> Как получить объединение всех ключей типа?

---

## 123. typeof

**Главный вопрос**

> Как получить тип существующего значения?

---

## 124. Indexed Access Types

**Главный вопрос**

> Как получить тип отдельного свойства?

---

## 125. Mapped Types

**Главный вопрос**

> Как автоматически преобразовывать существующие типы?

---

## 126. Conditional Types

**Главный вопрос**

> Как создавать типы с условиями?

---

## 127. infer

**Главный вопрос**

> Как автоматически извлекать типы?

---

## 128. Utility Types

**Главный вопрос**

> Какие готовые инструменты уже предоставляет TypeScript?

Темы:

* Partial
* Required
* Readonly
* Pick
* Omit
* Record
* Exclude
* Extract
* ReturnType
* Parameters

---

# Раздел 7. Экосистема

---

## 129. Declaration Files

**Главный вопрос**

> Откуда TypeScript знает типы сторонних библиотек?

---

## 130. Modules

**Главный вопрос**

> Как TypeScript работает с JavaScript-модулями?

---

## 131. Decorators

**Главный вопрос**

> Как расширять поведение классов декларативно?

Темы:

* Современные Decorators
* Практические сценарии

---

## 132. ESLint

**Главный вопрос**

> Как автоматически находить ошибки и поддерживать единый стиль кода?

---

## 133. Prettier

**Главный вопрос**

> Почему форматирование должно выполняться автоматически?

---

## 134. TypeScript в Playwright

**Главный вопрос**

> Как использовать возможности TypeScript в промышлененном Automation QA Framework?

Темы:

* Типизация Page Objects
* Типизация Fixtures
* Типизация API Client
* Типизация gRPC Client
* Типизация Test Data
* Практические рекомендации

---

# Итог раздела

После завершения TypeScript читатель:

* понимает ограничения JavaScript;
* умеет проектировать типы;
* уверенно использует Generics;
* понимает сложную систему типов TypeScript;
* умеет применять TypeScript в промышлененном Automation QA Framework.

---

## Статус раздела

```text
TypeScript

97

↓

134

STATUS

FROZEN
```

# ROADMAP.md

> Version: 5.0
> Status: **FROZEN**
> Part: IV / IV

---

# Продолжение Part III

Главы **1–134** считаются утверждёнными.

Данная часть полностью посвящена **Automation QA** и финальному промышленному проекту.

---

# Часть III. Automation QA

---

# Раздел 1. Архитектура Automation Framework

---

## 135. Что такое Automation QA Framework

**Главный вопрос**

> Почему одного Playwright недостаточно для большого проекта?

Темы:

* Framework
* Архитектура
* Масштабируемость
* Повторное использование

---

## 136. Структура проекта

**Главный вопрос**

> Как организовать большой проект?

Темы:

* src
* tests
* pages
* api
* grpc
* database
* helpers

---

## 137. Playwright Test

**Главный вопрос**

> Как работает тестовый раннер?

Темы:

* test()
* describe()
* hooks
* configuration

---

## 138. Fixtures

**Главный вопрос**

> Как избавиться от повторяющейся подготовки тестов?

Темы:

* Built-in Fixtures
* Custom Fixtures
* Dependency Injection

---

## 139. Page Object

**Главный вопрос**

> Как отделить тесты от UI?

Темы:

* Page Object Pattern
* Инкапсуляция
* Повторное использование

---

## 140. Components

**Главный вопрос**

> Как переиспользовать части страниц?

Темы:

* Component Objects
* Composition

---

# Раздел 2. API Testing

---

## 141. REST

**Главный вопрос**

> Как устроено взаимодействие клиента и сервера?

---

## 142. API Client

**Главный вопрос**

> Как инкапсулировать HTTP-запросы?

---

## 143. Authentication

**Главный вопрос**

> Как работать с авторизацией API?

Темы:

* Bearer Token
* OAuth Overview
* API Keys

---

## 144. Request Builders

**Главный вопрос**

> Как создавать сложные запросы?

---

## 145. Response Validation

**Главный вопрос**

> Как проверять ответы API?

---

## 146. Contract Testing

**Главный вопрос**

> Как убедиться, что контракт API не изменился?

---

# Раздел 3. gRPC

---

## 147. Основы gRPC

**Главный вопрос**

> Чем gRPC отличается от REST?

---

## 148. Protocol Buffers

**Главный вопрос**

> Почему gRPC использует protobuf?

---

## 149. gRPC Client

**Главный вопрос**

> Как выполнять gRPC-запросы?

---

## 150. Metadata

**Главный вопрос**

> Как передавать служебные данные?

---

## 151. Validation

**Главный вопрос**

> Как проверять ответы gRPC?

---

# Раздел 4. Database Testing

---

## 152. PostgreSQL

**Главный вопрос**

> Как работать с PostgreSQL в тестах?

---

## 153. Repository Pattern

**Главный вопрос**

> Как инкапсулировать SQL?

---

## 154. Database Verification

**Главный вопрос**

> Как сверять данные БД с API?

---

## 155. Transactions

**Главный вопрос**

> Почему тестам важно понимать транзакции?

---

# Раздел 5. Framework Infrastructure

---

## 156. Helpers

**Главный вопрос**

> Какие задачи должны решать вспомогательные классы?

---

## 157. Assertions

**Главный вопрос**

> Как писать понятные проверки?

---

## 158. Configuration

**Главный вопрос**

> Как управлять настройками проекта?

---

## 159. Environment

**Главный вопрос**

> Как поддерживать несколько окружений?

---

## 160. Test Data Builders

**Главный вопрос**

> Как удобно создавать тестовые данные?

---

## 161. Retry

**Главный вопрос**

> Когда повтор теста полезен, а когда вреден?

---

## 162. Logging

**Главный вопрос**

> Как собирать информацию для анализа ошибок?

---

## 163. Reporting

**Главный вопрос**

> Как получать качественные отчёты?

---

## 164. Allure

**Главный вопрос**

> Как использовать Allure максимально эффективно?

---

## 165. Parallel Execution

**Главный вопрос**

> Как ускорить выполнение тестов?

---

## 166. Flaky Tests

**Главный вопрос**

> Почему нестабильные тесты появляются и как их устранять?

---

## 167. Архитектура Framework

**Главный вопрос**

> Как все части проекта работают вместе?

Темы:

* Layers
* Dependency Flow
* Best Practices

---

# Часть IV. Финальный проект

---

## 168. Проектирование Framework

**Главный вопрос**

> Как спроектировать промышлененный Automation Framework?

---

## 169. Создание структуры проекта

**Главный вопрос**

> С чего начинается реальный проект?

---

## 170. Реализация UI Layer

Темы:

* Page Objects
* Components
* Fixtures

---

## 171. Реализация API Layer

Темы:

* API Client
* Validation
* Builders

---

## 172. Реализация gRPC Layer

Темы:

* Clients
* Validation
* Metadata

---

## 173. Реализация Database Layer

Темы:

* Repository
* Verification
* SQL

---

## 174. Общая инфраструктура

Темы:

* Helpers
* Config
* Environment
* Logging

---

## 175. Reporting

Темы:

* Allure
* Attachments
* Screenshots
* Videos

---

## 176. CI/CD

**Главный вопрос**

> Как автоматически запускать тесты?

Темы:

* GitHub Actions
* Pipelines
* Artifacts

---

## 177. Финальный рефакторинг

**Главный вопрос**

> Как подготовить Framework к промышленной эксплуатации?

---

## 178. Best Practices

**Главный вопрос**

> Какие инженерные правила позволяют поддерживать Framework годами?

---

## 179. Заключение

Темы:

* Что изучено
* Следующие шаги
* План дальнейшего развития

---

# Итоговая статистика

| Часть            | Глав |
| ---------------- | ---: |
| Введение         |    4 |
| JavaScript       |   96 |
| TypeScript       |   38 |
| Automation QA    |   33 |
| Финальный проект |   12 |

**Всего глав: 179**

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
ROADMAP Version 5.0

STATUS

FROZEN
```

После утверждения:

* не изменяется нумерация глав;
* новые главы не добавляются между существующими;
* развитие курса осуществляется только внутри уже утверждённых глав.

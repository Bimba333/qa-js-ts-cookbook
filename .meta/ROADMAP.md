# ROADMAP.md

# Полная структура курса

> Версия: 2.0
> Статус: Active

---

# Общая структура

```text
Введение
│
├── Часть I. JavaScript
│
├── Часть II. TypeScript
│
├── Часть III. Automation QA
│
└── Часть IV. Финальный проект
```

---

# Введение

## 0. О курсе

### 0.1 Цели курса

### 0.2 Как пользоваться книгой

### 0.3 Как устроен репозиторий

### 0.4 Рабочее окружение

### 0.5 Node.js

### 0.6 npm

### 0.7 VS Code

### 0.8 Playground

### 0.9 Как выполнять задания

### 0.10 Система уровней (L0–L6)

---

# Часть I. JavaScript

## Раздел 1. Как работает JavaScript

### 1. Что такое JavaScript

* История
* ECMAScript
* Engine
* Runtime
* Browser
* Node.js

---

### 2. Как выполняется JavaScript

* Parsing
* AST
* Compilation
* Execution

---

### 3. Execution Context

* Global Execution Context
* Function Execution Context
* Creation Phase
* Execution Phase

---

### 4. Call Stack

* Push
* Pop
* Stack Trace
* Stack Overflow

---

### 5. Memory

* Зачем программе память
* Значения
* Идентификаторы
* Жизненный цикл данных
* Временные и постоянные данные

---

### 6. Variables

* var
* let
* const
* Объявление
* Инициализация
* Присваивание

---

### 7. Scope

* Global Scope
* Function Scope
* Block Scope
* Scope Chain

---

### 8. Lexical Environment

* Environment Record
* Outer Environment
* Связь со Scope

---

### 9. Hoisting

* Function Hoisting
* Variable Hoisting
* Поведение var
* Поведение let и const

---

### 10. Temporal Dead Zone

* TDZ
* Почему существует TDZ
* Практические ошибки

---

## Раздел 2. Значения и типы

### 11. Primitive Types

* Number
* String
* Boolean
* Null
* Undefined
* Symbol
* BigInt

---

### 12. Object Type

* Object
* Array
* Function
* Date
* Другие встроенные объекты

---

### 13. References

* Что такое ссылка
* Передача по ссылке
* Изменяемость объектов

---

### 14. Stack & Heap

* Концептуальная модель памяти
* Где находятся примитивы
* Где находятся объекты
* Ограничения модели Stack & Heap

---

### 15. Type Conversion

* Implicit Conversion
* Explicit Conversion
* Truthy / Falsy

---

### 16. Equality

* ==
* ===
* Object.is()
* Практические рекомендации

---

## Раздел 3. Управление программой

### 17. Operators

---

### 18. Conditionals

---

### 19. Loops

---

### 20. Error Handling

* throw
* try
* catch
* finally

---

## Раздел 4. Functions

### 21. Function Declaration

---

### 22. Function Expression

---

### 23. Arrow Functions

---

### 24. Parameters

---

### 25. Return

---

### 26. Rest

---

### 27. Spread

---

### 28. Closures

---

### 29. this

---

### 30. call

---

### 31. apply

---

### 32. bind

---

## Раздел 5. Objects

### 33. Objects

---

### 34. Destructuring

---

### 35. Optional Chaining

---

### 36. Nullish Coalescing

---

### 37. Object Methods

---

### 38. Object Descriptors

---

### 39. Prototype

---

### 40. Prototype Chain

---

### 41. Classes

---

## Раздел 6. Arrays

### 42. Arrays

---

### 43. Iteration Methods

* map
* filter
* reduce
* find
* some
* every

---

### 44. Sorting

---

### 45. Searching

---

### 46. Immutable Operations

---

## Раздел 7. Collections

### 47. Map

---

### 48. Set

---

### 49. WeakMap

---

### 50. WeakSet

---

## Раздел 8. Modules

### 51. import

---

### 52. export

---

### 53. CommonJS

---

### 54. ES Modules

---

## Раздел 9. Async JavaScript

### 55. Callback

---

### 56. Promise

---

### 57. Promise API

---

### 58. async / await

---

### 59. Event Loop

---

### 60. Microtasks

---

### 61. Macrotasks

---

## Раздел 10. Advanced JavaScript

### 62. Iterators

---

### 63. Generators

---

### 64. Memory Management

---

### 65. Garbage Collector

---

### 66. Performance

---

### 67. Debugging

---

# Часть II. TypeScript

## Раздел 1. Основы

### 68. Почему появился TypeScript

### 69. Компилятор

### 70. tsconfig

### 71. Type Erasure

---

## Раздел 2. Типы

### 72. Primitive Types

### 73. Object Types

### 74. Arrays

### 75. Tuples

### 76. Enum

### 77. Literal Types

### 78. Union Types

### 79. Intersection Types

---

## Раздел 3. Описание типов

### 80. Type Alias

### 81. Interface

### 82. Interface vs Type

### 83. Structural Typing

---

## Раздел 4. Вывод типов

### 84. Type Inference

### 85. Narrowing

### 86. Type Guards

### 87. Assertions

### 88. satisfies

### 89. as const

---

## Раздел 5. Functions

### 90. Function Types

### 91. Overloads

### 92. Generics

### 93. Generic Constraints

---

## Раздел 6. Продвинутые типы

### 94. keyof

### 95. typeof

### 96. Indexed Access Types

### 97. Mapped Types

### 98. Conditional Types

### 99. infer

### 100. Utility Types

---

## Раздел 7. Экосистема

### 101. Declaration Files

### 102. Modules

### 103. Decorators

### 104. ESLint

### 105. Prettier

### 106. TypeScript в Playwright

---

# Часть III. Automation QA

## Раздел 1. Архитектура

### 107. Структура проекта

### 108. Playwright Test

### 109. Fixtures

### 110. Page Object

### 111. Components

---

## Раздел 2. API

### 112. REST

### 113. API Client

### 114. Validation

### 115. Contract Testing

---

## Раздел 3. gRPC

### 116. Основы

### 117. Клиенты

### 118. Проверки

---

## Раздел 4. Database

### 119. PostgreSQL

### 120. Data Verification

### 121. Repository Pattern

---

## Раздел 5. Framework

### 122. Helpers

### 123. Assertions

### 124. Config

### 125. Environment

### 126. Reporting

### 127. Allure

### 128. Test Data Builders

### 129. Retry

### 130. Logging

### 131. Архитектура Framework

---

# Часть IV. Финальный проект

### 132. Проектирование Framework

### 133. Создание структуры

### 134. Реализация

### 135. API Layer

### 136. gRPC Layer

### 137. Database Layer

### 138. Helpers

### 139. Fixtures

### 140. Assertions

### 141. Reporting

### 142. CI

### 143. Итоговый рефакторинг

### 144. Best Practices

### 145. Заключение

---

# Итог

Общее количество глав: **145**

После завершения курса читатель будет:

* понимать внутренние механизмы JavaScript, а не только синтаксис;
* уверенно использовать TypeScript и понимать, как он работает поверх JavaScript;
* самостоятельно проектировать промышлененный Automation QA Framework на Playwright;
* понимать причины поведения языка и уметь анализировать сложные ошибки;
* применять инженерный подход к разработке, отладке и сопровождению автотестов.

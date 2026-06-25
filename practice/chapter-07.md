# Практика. Глава 7. Call Stack

## Концептуальные вопросы

Ответьте своими словами.

1. Что такое Call Stack?
2. Почему Call Stack нужен после появления Execution Context?
3. Что означает push context onto the stack?
4. Что означает pop context from the stack?
5. Почему Call Stack работает по принципу last in — first out?
6. Как engine понимает, куда вернуться после завершения функции?
7. Когда Call Stack становится empty?
8. Что такое stack trace?
9. Что такое stack overflow на высоком уровне?
10. Почему Event Loop не объясняется в этой главе?

## Предскажите Call Stack

Перед запуском файла:

```text
examples/chapter-07/02-nested-calls.js
```

Запишите:

1. порядок вывода строк;
2. максимальное состояние Call Stack;
3. порядок pop операций.

## Нарисуйте stack вручную

Для кода:

```javascript
function loadConfig() {
  readFilePath();
}

function readFilePath() {
  normalizePath();
}

function normalizePath() {
  console.log('done');
}

loadConfig();
```

Нарисуйте Call Stack:

1. после старта программы;
2. после вызова `loadConfig`;
3. после вызова `readFilePath`;
4. после вызова `normalizePath`;
5. после завершения `normalizePath`;
6. после завершения всех функций.

## Debugging

### Задача 1

Запустите:

```bash
node examples/chapter-07/05-stack-trace.js
```

Ответьте:

1. В какой функции возникла ошибка?
2. Какая функция вызвала эту функцию?
3. Где началась цепочка вызовов?

### Задача 2

Инженер видит ошибку в utility-функции и сразу исправляет utility.

Объясните, почему сначала нужно прочитать всю цепочку stack trace.

## QA-сценарии

### Сценарий 1

Playwright-тест вызывает метод Page Object:

```text
test
└── profilePage.open()
    └── waitForLoaded()
        └── assertHeader()
```

Нарисуйте Call Stack в момент выполнения `assertHeader`.

### Сценарий 2

Fixture вызывает `createUser`, а `createUser` вызывает `buildUserData`.

Объясните, как Call Stack помогает понять, почему тест не дошел до первого шага.

### Сценарий 3

Helper вызывается два раза подряд.

Ответьте:

1. Сколько раз Function Execution Context helper окажется в Call Stack?
2. Будут ли эти contexts существовать одновременно?

## Мини-проект

Создайте файл:

```text
playground/manual-call-stack.js
```

В нем должно быть:

* функция `startTest`;
* функция `prepareData`;
* функция `normalizeData`;
* `startTest` вызывает `prepareData`;
* `prepareData` вызывает `normalizeData`;
* каждая функция выводит начало и завершение.

После кода нарисуйте полный Call Stack lifecycle:

```text
push Global
push startTest
push prepareData
push normalizeData
pop normalizeData
pop prepareData
pop startTest
pop Global
```

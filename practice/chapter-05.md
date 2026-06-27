# Практика. Глава 5. Как выполняется JavaScript

## Проверка понимания

Ответьте своими словами.

1. Что происходит после команды `node app.js` до начала execution?
2. Что такое source code?
3. Что делает engine во время lexical analysis?
4. Чем parsing отличается от lexical analysis?
5. Что такое AST?
6. Почему syntax error останавливает программу до execution?
7. Чем interpretation отличается от compilation?
8. Что означает preparation for execution?
9. Что такое runtime interaction?
10. Почему Automation QA Engineer должен понимать этап, на котором произошла ошибка?

## Чтение кода

Прочитайте код.

```javascript
console.log('Program started');
console.log('Program finished');
```

Ответьте:

1. Какие этапы должен пройти файл до вывода первой строки?
2. Когда начинается execution?
3. Какой runtime API используется для наблюдаемого результата?

## Предскажите результат перед запуском. Задание 1

Перед запуском предскажите вывод файла:

```text
examples/chapter-05/01-valid-program.js
```

Команда:

```bash
node examples/chapter-05/01-valid-program.js
```

Запишите ожидаемый результат и объясните, какие этапы прошел engine.

## Предскажите результат перед запуском. Задание 2

Перед запуском предскажите, выполнится ли первая строка файла:

```text
examples/chapter-05/02-syntax-error.js
```

Команда:

```bash
node examples/chapter-05/02-syntax-error.js
```

Ответьте:

1. Будет ли выведен текст из первой строки?
2. На каком этапе остановится engine?
3. Почему execution не начинается?

## Поиск syntax error

Найдите место ошибки.

```javascript
console.log('Before');
console.log('After'
```

Ответьте:

1. Что пропущено?
2. Почему parser не может построить корректный AST?
3. Какая строка помогает найти место проблемы?

## Объясните поведение engine

Для кода:

```javascript
console.log('QA');
```

Опишите, что engine делает на этапах:

1. source code;
2. lexical analysis;
3. parsing;
4. AST;
5. preparation;
6. execution;
7. runtime interaction.

## Задачи на отладку

### Задача 1

Вы видите ошибку:

```text
SyntaxError: missing ) after argument list
```

Ответьте:

1. Это ошибка до execution или во время execution?
2. Какой этап pipeline ее обнаружил?
3. Что нужно проверять первым?

### Задача 2

Тест Playwright не открыл браузер, а сразу упал из-за `SyntaxError` в тестовом файле.

Ответьте:

1. Почему браузер мог не открыться?
2. На каком этапе остановился запуск?
3. Почему это не ошибка locator или assertion?

## QA-задачи

### Задача 1

Составьте checklist диагностики для ситуации "тест не стартует".

Checklist должен различать:

* файл не найден;
* syntax error;
* runtime error;
* ошибка взаимодействия с браузером.

### Задача 2

Объясните, почему сообщение `SyntaxError` в CI нужно читать иначе, чем падение assertion.

## Мини-проект

Создайте в `playground/` два файла:

```text
playground/pipeline-valid.js
playground/pipeline-syntax-error.js
```

Первый файл должен успешно вывести две строки.

Второй файл должен содержать намеренную syntax error.

Для каждого файла запишите:

* ожидаемый результат;
* на каком этапе остановится или продолжит работу engine;
* какой вывод или ошибка появится;
* какой вывод полезен для Automation QA диагностики.

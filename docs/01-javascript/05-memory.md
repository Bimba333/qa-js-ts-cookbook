# Memory

## Связь с предыдущей главой

В предыдущих главах была собрана первая рабочая модель JavaScript:

```mermaid
flowchart TD
    N1["JavaScript Engine"]
    N2["подготавливает код"]
    N3["создает Execution Context"]
    N4["выполняет код внутри Runtime"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

Затем появилась модель Call Stack:

```mermaid
flowchart TD
    N1["Execution Context"]
    N2["рабочая среда выполнения"]
    N3["Call Stack"]
    N4["управляет активными Execution Contexts"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

Теперь возникает следующий естественный вопрос:

> Где JavaScript хранит информацию, пока программа выполняется?

Если программа вывела значение на одной строке, а потом использовала его через несколько строк, значит это значение где-то сохранилось. Если функция подготовила данные, а следующая строка использовала результат, значит engine не потерял эту информацию между шагами.

Эта глава строит концептуальную модель memory.

Важно: здесь мы не изучаем Stack & Heap, references, Garbage Collector, Scope, Closures и Lexical Environment. Эти темы будут разобраны в отдельных главах. Сейчас задача проще и фундаментальнее: понять, зачем программе нужна память и что engine делает с информацией во время выполнения.

---

## Предварительные требования

Для этой главы нужно понимать:

* что JavaScript-код выполняется engine;
* что runtime предоставляет внешние возможности вроде `console`;
* что Execution Context является рабочей средой выполнения;
* что Call Stack управляет активными Execution Contexts;
* что функция при вызове получает отдельный Function Execution Context;
* что синхронная программа заканчивается, когда Call Stack становится empty.

Не требуется знать типы данных, объекты, ссылки, Scope, Stack & Heap или Garbage Collector. Если эти слова появляются в главе, они используются только как мост к будущим темам.

---

## Время изучения

Ориентировочное время:

```text
Чтение главы:            90-120 минут
Разбор схем:             40-50 минут
Запуск примеров:         25-35 минут
Практика:                90-120 минут
Повторение материала:    30 минут
```

Уровень сложности: **L3**.

L3 означает фундаментальный уровень: глава не учит новым конструкциям языка, но формирует модель, без которой переменные, значения, параметры функций, объекты и references будут восприниматься как набор правил.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/04-call-stack.md
```

Следующая глава:

```text
docs/01-javascript/06-variables.md
```

Следующая глава объяснит, как программист работает с memory через `var`, `let`, `const`, declaration, initialization и assignment.

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем любой программе нужна memory;
* какую информацию JavaScript хранит во время выполнения;
* что такое значения на концептуальном уровне;
* зачем нужны identifiers;
* как можно представить conceptual memory locations;
* что значит сохранить информацию;
* что значит прочитать информацию;
* что значит обновить информацию;
* что значит удалить информацию на высоком уровне;
* как lifetime данных связан с выполнением программы;
* чем temporary information отличается от long-lived information;
* как memory связана с Execution Context;
* как memory связана с Call Stack;
* почему эта модель важна для Automation QA.

---

## Мотивация

Начнем с наблюдаемого поведения.

```javascript
const testStatus = 'passed';

console.log(testStatus);
```

Результат:

```text
passed
```

На первой строке появляется значение `'passed'`. На третьей строке JavaScript выводит это значение.

Вопрос:

```mermaid
flowchart TD
    N1["Line 1"]
    N2["значение появляется"]
    N3["Line 2"]
    N4["value is still available"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Почему значение не исчезло после первой строки?

Теперь другой пример:

```javascript
let retryCount = 1;

retryCount = 2;

console.log(retryCount);
```

Результат:

```text
2
```

Вопрос:

```mermaid
flowchart TD
    N1["retryCount было связано с 1"]
    N2["retryCount стало связано с 2"]
    N3["console.log читает новое значение"]
    N1 --> N2
    N2 --> N3
```

Где engine хранит эту связь? Как он понимает, что нужно прочитать именно последнее значение?

Если убрать memory из модели, программа становится невозможной.

```mermaid
flowchart TD
    N1["Program without memory"]
    N2["sees value"]
    N3["immediately loses value"]
    N4["cannot read it later"]
    N5["cannot update it"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N1 --> N5
```

Такая программа могла бы выполнять только одноразовые действия, где каждый шаг никак не связан с предыдущим.

Реальные программы так не работают. Тест хранит имя пользователя. Helper возвращает подготовленные данные. Fixture сохраняет состояние авторизации. Assertion сравнивает actual и expected. Все это требует memory.

Главный вопрос главы:

> Что engine делает с информацией прямо сейчас?

---

## Теория

### Программа без memory

Представим программу, которая не умеет ничего сохранять.

```mermaid
flowchart TD
    N1["Step 1: receive value &quot;admin&quot;"]
    N2["Step 2: value disappeared"]
    N3["Step 3: need value &quot;admin&quot;"]
    N4["Error in mental model: nothing to read"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Такая модель не может объяснить даже простое поведение:

```javascript
const role = 'admin';

console.log(role);
```

Engine должен где-то сохранить информацию, чтобы следующая операция могла ее прочитать.

Что происходит внутри engine прямо сейчас:

```text
Engine встречает значение.
Engine должен сохранить его в доступной внутренней модели.
Engine связывает сохраненную информацию с именем, чтобы найти ее позже.
```

### Зачем программе memory

Memory нужна, чтобы программа могла:

* помнить данные между строками;
* передавать результат одного шага в следующий;
* обновлять состояние;
* хранить промежуточные результаты;
* выполнять проверки;
* строить более сложное поведение из простых шагов.

```mermaid
flowchart TD
    N1["Input"]
    N2["store information"]
    N3["read information"]
    N4["use information"]
    N5["получить результат"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
```

Без memory программа не может иметь состояние.

State — это информация, которая описывает текущее состояние программы в конкретный момент. Подробные темы состояния, объектов и изменяемости будут изучаться позже.

### Что JavaScript хранит во время выполнения

На концептуальном уровне JavaScript хранит несколько видов информации:

* значения;
* identifiers;
* связи между identifiers и значения;
* временные результаты вычислений;
* информацию, нужную текущему Execution Context;
* результаты, которые используются позже.

```mermaid
flowchart TD
    N1["Memory during выполнение"]
    N2["value: &quot;qa-user&quot;"]
    N3["identifier: userName"]
    N4["relation: userName → &quot;qa-user&quot;"]
    N5["temporary результат: &quot;qa-&quot; + &quot;user&quot;"]
    N6["context information"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N1 --> N5
    N1 --> N6
```

Эта схема концептуальная. Она не описывает физическое устройство V8 или конкретные области памяти. Реальная реализация engine сложнее. Для обучения сейчас важнее другое: engine должен уметь хранить, находить и обновлять информацию.

### Values

Value — это данные, с которыми работает программа.

Примеры значения:

```text
"passed"
42
true
null
```

Primitive Types будут изучаться позже. Сейчас достаточно понимать:

```mermaid
flowchart TD
    N1["Value"]
    N2["конкретная информация, которую программа может сохранить и использовать"]
    N1 --> N2
```

Программа не работает с пустыми словами. Она работает с значения.

```javascript
console.log('ready');
```

Здесь `'ready'` — value, который передается в `console.log`.

Что происходит внутри engine прямо сейчас:

```text
Engine видит value.
Engine может использовать value сразу
или сохранить его, если value должен понадобиться позже.
```

### Identifiers

Identifier — имя, по которому программа обращается к сохраненной информации.

```javascript
const status = 'ready';

console.log(status);
```

`status` — identifier. Он помогает engine найти нужную информацию.

```mermaid
flowchart TD
    N1["Identifier"]
    N2["status"]
    N3["stored value"]
    N4["&quot;ready&quot;"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Identifier не является самим value. Это имя, через которое программа получает доступ к value.

Распространённая ошибка:

```text
status и "ready" воспринимаются как одно и то же
```

Исправленная модель:

```mermaid
flowchart TD
    N1["status"]
    N2["имя"]
    N3["&quot;ready&quot;"]
    N4["значение"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

Variables будут изучаться в следующей главе. Там будет подробно разобрано, как identifiers создаются через declarations и как получают значения через initialization и assignment.

### Концептуальные места в памяти

Чтобы хранить информацию, удобно представить memory как набор ячеек.

Это не физическая схема engine. Это учебная модель.

```mermaid
flowchart TD
    N1["Memory"]
    N2["location #1: &quot;ready&quot;"]
    N3["location #2: 3"]
    N4["location #3: true"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

Location — концептуальное место, где хранится информация.

Если добавить identifier, модель становится такой:

```mermaid
flowchart TD
    N1["Identifier table"]
    N2["status → location #1"]
    N3["retryCount → location #2"]
    N4["isLoggedIn → location #3"]
    N5["Memory"]
    N6["location #1: &quot;ready&quot;"]
    N7["location #2: 3"]
    N8["location #3: true"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N1 --> N5
    N5 --> N6
    N5 --> N7
    N5 --> N8
```

Важно: это не глава про references. Сейчас стрелка означает только учебную связь "по этому имени engine может найти сохраненную информацию". References как отдельный механизм будут изучаться позже.

### Store value

Сохранить value означает сделать так, чтобы программа могла использовать его позже.

```javascript
const browserName = 'chromium';
```

Концептуально:

```mermaid
flowchart TD
    N1["исходный код"]
    N2["const browserName = &quot;chromium&quot;"]
    N3["store value"]
    N4["Identifier: browserName"]
    N5["Stored value: &quot;chromium&quot;"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
```

Диаграмма хранения:

```mermaid
flowchart TD
    N1["Before"]
    N2["Memory"]
    N3["empty for browserName"]
    N4["Store"]
    N5["browserName = &quot;chromium&quot;"]
    N6["After"]
    N7["Memory"]
    N8["browserName → &quot;chromium&quot;"]
    N2 --> N3
    N2 --> N4
    N5 --> N6
    N7 --> N8
    N1 --> N2
    N4 --> N5
    N6 --> N7
```

Что происходит внутри engine прямо сейчас:

```text
Engine получает value.
Engine связывает value с identifier.
Engine может найти value позже по этому identifier.
```

### Read value

Прочитать value означает найти сохраненную информацию и использовать ее в текущей операции.

```javascript
const browserName = 'chromium';

console.log(browserName);
```

Концептуально:

```mermaid
flowchart TD
    N1["console.log(browserName)"]
    N2["need value for browserName"]
    N3["read memory"]
    N4["&quot;chromium&quot;"]
    N5["pass value to console.log"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
```

Диаграмма чтения:

```mermaid
flowchart TD
    N1["Identifier"]
    N2["browserName"]
    N3["Memory lookup"]
    N4["&quot;chromium&quot;"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Если value не был сохранен или identifier недоступен, программа не сможет корректно прочитать информацию. Подробности доступности имен относятся к Scope и будут изучаться позже.

### Update value

Обновить информацию означает изменить то, что программа будет читать по identifier в следующих шагах.

```javascript
let attempt = 1;

attempt = 2;

console.log(attempt);
```

Концептуально:

```mermaid
flowchart TD
    N1["Initial memory"]
    N2["attempt → 1"]
    N3["Update"]
    N4["attempt = 2"]
    N5["После: update"]
    N6["attempt → 2"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
    N3 --> N5
    N5 --> N6
```

Важно: эта глава не объясняет различия между `let`, `const` и `var`. Следующая глава будет посвящена variables и покажет, почему одни identifiers можно переназначать, а другие нельзя.

Сейчас важна механика:

```mermaid
flowchart TD
    N1["write old value"]
    N2["read or replace stored information"]
    N3["future reads see updated information"]
    N1 --> N2
    N2 --> N3
```

Что происходит внутри engine прямо сейчас:

```text
Engine находит место, связанное с identifier.
Engine обновляет сохраненную информацию.
Следующее чтение получает новое состояние.
```

### Removing information на высоком уровне

Данные не обязаны жить вечно.

Когда Execution Context завершает работу, часть информации, которая была нужна только этому context, больше не нужна программе.

```mermaid
flowchart TD
    N1["Function Execution Context starts"]
    N2["появляется временная информация"]
    N3["function завершается"]
    N4["temporary information is нет longer needed"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Это высокоуровневая модель. Garbage Collector — механизм автоматического освобождения памяти в JavaScript engines; он будет изучаться позже. В этой главе важно только понять:

```text
Some data is needed now.
Some data is needed later.
Some data becomes unnecessary.
```

### Lifetime of stored data

Lifetime — период, в течение которого информация нужна программе.

```mermaid
flowchart TD
    N1["данные появляются"]
    N2["Data is used"]
    N3["Data may be updated"]
    N4["Data is нет longer needed"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Пример:

```javascript
function printUserName() {
  const userName = 'Anna';

  console.log(userName);
}

printUserName();
```

Концептуально:

```mermaid
flowchart TD
    N1["вызвать printUserName()"]
    N2["Function Execution Context appears"]
    N3["userName stored for this выполнение"]
    N4["console.log reads userName"]
    N5["function завершается"]
    N6["information for this выполнение is нет longer active"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
    N5 --> N6
```

Scope и Lexical Environment объяснят, где именно identifier доступен. Сейчас важно только lifetime: не вся информация нужна всей программе.

### Temporary information

Temporary information нужна только для одного короткого шага.

```javascript
const message = 'Status: ' + 'passed';

console.log(message);
```

Концептуально:

```mermaid
flowchart TD
    N1["&quot;Status: &quot;"]
    N2["temporary combine"]
    N3["&quot;Status: passed&quot;"]
    N4["store final value as message"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

Диаграмма temporary data:

```mermaid
flowchart TD
    N1["Temporary workspace"]
    N2["value A: &quot;Status: &quot;"]
    N3["value B: &quot;passed&quot;"]
    N4["temporary результат: &quot;Status: passed&quot;"]
    N5["Stored memory"]
    N6["message → &quot;Status: passed&quot;"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N1 --> N5
    N5 --> N6
```

Temporary workspace — учебная модель места, где engine держит промежуточную информацию во время текущего шага. Это не отдельная физическая область, которую нужно запоминать как термин.

### Long-lived information

Long-lived information нужна дольше одного шага.

```javascript
const baseUrl = 'https://example.com';

console.log(baseUrl);
console.log(baseUrl);
console.log(baseUrl);
```

Концептуально:

```mermaid
flowchart TD
    N1["baseUrl stored once"]
    N2["read in step 1"]
    N3["read in step 2"]
    N4["read in step 3"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

Диаграмма long-lived data:

```mermaid
flowchart TD
    N1["Program timeline"]
    N2["store baseUrl"]
    N3["use baseUrl"]
    N4["use baseUrl again"]
    N5["use baseUrl later"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N1 --> N5
```

Long-lived не означает "навсегда". Это означает "дольше, чем один момент выполнения".

### Program execution timeline

Теперь соберем временная шкала:

```mermaid
flowchart TD
    N1["программа начинается"]
    N2["Global Execution Context appears"]
    N3["Memory for global выполнение is prepared"]
    N4["store value"]
    N5["read value"]
    N6["update value"]
    N7["вызвать function"]
    N8["function gets its own выполнение information"]
    N9["function завершается"]
    N10["temporary information is нет longer active"]
    N11["program ends"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
    N5 --> N6
    N6 --> N7
    N7 --> N8
    N8 --> N9
    N9 --> N10
    N10 --> N11
```

Это не замена Call Stack. Это следующий слой модели.

```mermaid
flowchart TD
    N1["Execution Context"]
    N2["where code runs"]
    N3["Call Stack"]
    N4["which context is active"]
    N5["Memory"]
    N6["what information is stored while code runs"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
    N3 --> N5
    N5 --> N6
```

### Memory during function execution

Каждый вызов функции может иметь информацию, нужную именно этому вызову.

```javascript
function printStatus() {
  const status = 'ready';

  console.log(status);
}

printStatus();
```

Концептуально:

```mermaid
flowchart TD
    N1["Call Stack"]
    N2["printStatus Context"]
    N3["Global Context"]
    N4["Memory for printStatus выполнение"]
    N5["status → &quot;ready&quot;"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N4 --> N5
```

Когда функция выполняется, engine хранит информацию, которая нужна для текущего function execution.

```mermaid
flowchart TD
    N1["enter function"]
    N2["prepare function выполнение information"]
    N3["store local values"]
    N4["read local values"]
    N5["leave function"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
```

Слово "local" здесь используется на бытовом уровне: информация нужна конкретному выполнению функции. Формальная тема Scope будет изучаться позже.

### Execution Context + Memory

Execution Context — рабочая среда. Memory — информация, с которой эта среда работает.

```mermaid
flowchart TD
    N1["Execution Context"]
    N2["code is executing here"]
    N3["engine knows current выполнение state"]
    N4["memory-related information is available here"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

Более полезная схема:

```mermaid
flowchart TD
    N1["Global Execution Context"]
    N2["current code"]
    N3["identifiers"]
    N4["stored values"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

Для function execution:

```mermaid
flowchart TD
    N1["Function Execution Context"]
    N2["current тело функции"]
    N3["identifiers for this выполнение"]
    N4["values needed by this выполнение"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

Это концептуальная модель. В будущих главах она будет уточнена через Variables, Scope, Lexical Environment, Primitive Types, Object Type, References и Stack & Heap.

### Call Stack + Memory

Call Stack отвечает на вопрос:

```text
Which Execution Context is active?
```

Memory отвечает на вопрос:

```text
What information is available for execution?
```

Вместе:

```mermaid
flowchart TD
    N1["Call Stack"]
    N2["Function Context: prepareUser"]
    N3["memory info: userName, userRole"]
    N4["Global Context"]
    N5["memory info: baseUrl"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N4 --> N5
```

Engine выполняет верхний context и работает с информацией, которая нужна этому context.

```mermaid
flowchart TD
    N1["Top of Call Stack"]
    N2["Active Execution Context"]
    N3["Read / store / update information"]
    N1 --> N2
    N2 --> N3
```

### Warehouse

Первая ментальная модель — склад.

```mermaid
flowchart TD
    N1["Warehouse"]
    N2["shelf: userName"]
    N3["box: &quot;Anna&quot;"]
    N4["shelf: retryCount"]
    N5["box: 2"]
    N6["shelf: isAuthorized"]
    N7["box: true"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N1 --> N5
    N1 --> N6
    N6 --> N7
```

Когда программа сохраняет value, она кладет информацию на склад. Когда читает value, она идет к нужной полке.

Модель полезна тем, что отделяет:

```mermaid
flowchart TD
    N1["label on shelf"]
    N2["identifier"]
    N3["content in box"]
    N4["значение"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

### Labeled shelves

Identifiers можно представить как подписи на полках.

```mermaid
flowchart TD
    N1["Shelf label"]
    N2["apiToken"]
    N3["Stored content"]
    N4["&quot;token-123&quot;"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Если подпись есть, engine может найти содержимое. Если подписи нет или она недоступна в текущем месте выполнения, engine не сможет использовать значение. Почему identifier может быть недоступен, объяснит глава про Scope.

### Numbered storage boxes

Иногда полезнее думать не о полках с именами, а о numbered boxes.

```text
Box #101: "chromium"
Box #102: "firefox"
Box #103: "webkit"
```

Identifier помогает найти нужную коробку:

```mermaid
flowchart TD
    N1["browserName"]
    N2["Box #101"]
    N3["&quot;chromium&quot;"]
    N1 --> N2
    N2 --> N3
```

Эта модель готовит к будущей теме references, но не объясняет ее. References будут отдельной главой.

### Notebook with records

Еще одна модель — блокнот записей.

```mermaid
flowchart TD
    N1["Notebook"]
    N2["testStatus: &quot;passed&quot;"]
    N3["retryCount: 2"]
    N4["browserName: &quot;chromium&quot;"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

Когда значение обновляется, запись меняется:

```text
Before
retryCount: 1

After
retryCount: 2
```

Модель блокнота полезна для debugging: можно мысленно вести таблицу "identifier → current value".

### Temporary workspace

Не вся информация достойна отдельной долгой записи.

```mermaid
flowchart TD
    N1["Temporary workspace"]
    N2["calculate intermediate value"]
    N3["use it immediately"]
    N4["discard when нет longer needed"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

Например:

```javascript
console.log('User: ' + 'Anna');
```

Концептуально:

```mermaid
flowchart TD
    N1["Temporary результат: &quot;User: Anna&quot;"]
    N2["console.log receives it"]
    N3["временный результат больше не нужен"]
    N1 --> N2
    N2 --> N3
```

Это помогает не думать, что каждое промежуточное значение обязательно становится долгоживущей записью программы.

### Переход к Variables

Эта глава объяснила, что программе нужна memory.

Следующая глава объяснит, как программист управляет этой memory через variables.

```mermaid
flowchart TD
    N1["Memory"]
    N2["values exist"]
    N3["identifiers name information"]
    N4["stored information can be read and updated"]
    N5["Variables"]
    N6["declare identifier"]
    N7["initialize with value"]
    N8["assign new value when allowed"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N1 --> N5
    N5 --> N6
    N5 --> N7
    N5 --> N8
```

Ключевой переход:

```text
Memory answers:
"Where is information kept?"

Variables answer:
"How do we create and use named access to that information?"
```

---

## Внутренний механизм

Внутренний механизм этой главы можно описать как цикл работы с информацией.

```mermaid
flowchart TD
    N1["Need information"]
    N2["создать or receive value"]
    N3["store value if needed later"]
    N4["read value when identifier is used"]
    N5["update stored information if program asks"]
    N6["stop keeping information when it is нет longer needed"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
    N5 --> N6
```

Engine постоянно делает три базовые операции:

```mermaid
flowchart TD
    N1["запись"]
    N2["store information"]
    N3["чтение"]
    N4["retrieve information"]
    N5["update"]
    N6["change current stored information"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
    N3 --> N5
    N5 --> N6
```

Для синхронного кода это происходит внутри активного Execution Context.

```mermaid
flowchart TD
    N1["Call Stack"]
    N2["active Function Context"]
    N3["engine works with information needed here"]
    N4["previous Context"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

Что происходит внутри engine прямо сейчас:

```mermaid
flowchart TD
    N1["If code создает data → engine stores information."]
    N2["If code uses identifier → engine reads information."]
    N3["If code changes data → engine updates information."]
    N4["If выполнение ends → some information is нет longer active."]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Важно не перепрыгивать вперед. В этой главе не нужно знать, где физически лежит value, как устроены references и когда именно работает Garbage Collector. Пока достаточно модели "engine хранит информацию, чтобы программа могла продолжать осмысленное выполнение".

---

## Ментальная модель

Соберем пять моделей в одну.

### Warehouse

```mermaid
flowchart TD
    N1["Memory as warehouse"]
    N2["information is stored"]
    N3["information can be found"]
    N4["information can be replaced"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

### Labeled shelves

```mermaid
flowchart TD
    N1["Identifier"]
    N2["Shelf label"]
    N3["Stored value"]
    N1 --> N2
    N2 --> N3
```

### Numbered storage boxes

```mermaid
flowchart TD
    N1["Identifier table"]
    N2["points conceptually to storage box"]
    N3["Storage box"]
    N4["contains value"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

### Notebook with records

```mermaid
flowchart TD
    N1["Current records"]
    N2["userName: &quot;Anna&quot;"]
    N3["attempt: 2"]
    N4["status: &quot;ready&quot;"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

### Temporary workspace

```mermaid
flowchart TD
    N1["Temporary workspace"]
    N2["short calculation"]
    N3["immediate usage"]
    N4["нет long lifetime"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

Главная итоговая модель:

```mermaid
flowchart TD
    N1["Execution Context"]
    N2["создает the выполнение environment"]
    N3["Call Stack"]
    N4["manages which context is active"]
    N5["Memory"]
    N6["stores everything the engine needs while the program runs"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
    N3 --> N5
    N5 --> N6
```

---

## Примеры кода

Примеры к этой главе находятся в папке:

```text
examples/01-javascript/chapter-05/
```

Запускайте их из корня проекта.

### Пример 1. Store value

Файл:

```text
examples/01-javascript/chapter-05/01-store-value.js
```

Показывает, что value может быть сохранен под identifier и использован позже.

### Пример 2. Read value

Файл:

```text
examples/01-javascript/chapter-05/02-read-value.js
```

Показывает чтение одного сохраненного value несколько раз.

### Пример 3. Update value

Файл:

```text
examples/01-javascript/chapter-05/03-update-value.js
```

Показывает обновление сохраненной информации.

### Пример 4. Function memory

Файл:

```text
examples/01-javascript/chapter-05/04-function-memory.js
```

Показывает, что информация может быть нужна только во время выполнения функции.

### Пример 5. Lifetime

Файл:

```text
examples/01-javascript/chapter-05/05-lifetime.js
```

Показывает difference между data, которая нужна нескольким шагам, и data, которая нужна только внутри одного вызова.

### Пример 6. Temporary data

Файл:

```text
examples/01-javascript/chapter-05/06-temporary-data.js
```

Показывает временный результат, который сразу используется.

---

## Частые вопросы

### Memory — это Stack & Heap?

Нет. В этой главе memory — общая концепция хранения информации. Stack & Heap — более конкретная модель размещения разных видов данных, она будет изучаться позже.

### Identifier хранит value внутри себя?

Нет. Identifier лучше воспринимать как имя для доступа к сохраненной информации. В этой главе мы не углубляемся в физическое устройство memory.

### Почему нельзя сразу изучать variables?

Можно выучить синтаксис variables без этой главы, но тогда `let`, `const`, assignment и lifetime будут казаться правилами. Модель memory объясняет, зачем variables вообще нужны.

### JavaScript сам удаляет ненужную информацию?

На высоком уровне да: JavaScript управляет памятью автоматически. Механизм Garbage Collector будет изучаться позже.

### Нужно ли Automation QA знать memory?

Да. Без этой модели сложно понимать, почему test data сохраняется между строками, почему helper result доступен дальше и почему ошибка может быть связана с неправильным обновлением значения.

---

## Распространенные мифы

### Миф 1. Значения существуют только в строке, где написаны

Реальность:

Если value сохранен и нужен позже, engine может прочитать его на следующих шагах.

### Миф 2. Identifier и value — одно и то же

Реальность:

Identifier — имя. Value — информация. Эта разница станет критичной в главах про variables, objects и references.

### Миф 3. Все данные живут одинаково долго

Реальность:

Одни данные нужны один шаг, другие — несколько строк, третьи — весь период выполнения конкретного context.

### Миф 4. Memory нужна только для сложных объектов

Реальность:

Memory нужна даже для простого значения вроде `'passed'`, если программа должна использовать его позже.

---

## Типичные ошибки

### Ошибка 1. Думать, что `console.log` хранит значение

Неправильная модель:

```text
console.log remembers previous values
```

Что произошло:

`console.log` выводит переданный value. Он не является местом хранения данных программы.

Исправленная модель:

```mermaid
flowchart TD
    N1["identifier"]
    N2["read stored value"]
    N3["pass value to console.log"]
    N1 --> N2
    N2 --> N3
```

### Ошибка 2. Не отличать storing от reading

Неправильная модель:

```text
const status = "ready"
console.log(status)

Both lines do the same thing
```

Что произошло:

Первая строка сохраняет информацию. Вторая строка читает сохраненную информацию.

Исправленная модель:

```mermaid
flowchart TD
    N1["store"]
    N2["чтение"]
    N1 --> N2
```

### Ошибка 3. Ожидать старое значение после update

Неправильная модель:

```javascript
let status = 'new';

status = 'done';

console.log(status);
```

Ожидание:

```text
new
```

Что произойдет:

```text
done
```

Почему:

Следующее чтение получает обновленную информацию.

### Ошибка 4. Смешивать lifetime и Scope

Неправильная модель:

```text
Если value существовал внутри функции, он должен быть доступен везде.
```

Что произошло:

Lifetime и доступность identifiers связаны, но это не одно и то же. Scope будет изучаться позже и объяснит правила доступности имен.

Исправленная модель:

```text
Function execution needs some information.
After function finishes, that execution information is no longer active.
```

---

## Практическое использование

Когда читаете код, задавайте четыре вопроса:

```text
1. Где появляется value?
2. Под каким identifier оно сохраняется?
3. Где value читается?
4. Где value обновляется?
```

Для простого кода можно вести таблицу:

```mermaid
flowchart TD
    N1["Step | Operation | Memory"]
    N2["1 | store | status → &quot;created&quot;"]
    N3["2 | update | status → &quot;finished&quot;"]
    N4["3 | read | status → &quot;finished&quot;"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Эта таблица особенно полезна перед тем, как запускать код. Она заставляет сначала построить mental model, а потом проверить себя через execution.

Мини-чек-лист:

```text
✓ Я вижу, где value появляется.
✓ Я понимаю, где оно сохраняется.
✓ Я понимаю, где оно читается.
✓ Я понимаю, где оно обновляется.
✓ Я отличаю temporary data от long-lived data.
```

---

## Использование в Automation QA

### Test data survives between инструкции

В автотесте данные часто готовятся в начале сценария и используются позже.

```javascript
const userName = 'qa-user';

console.log(userName);
```

Концептуально:

```mermaid
flowchart TD
    N1["prepare test data"]
    N2["store userName"]
    N3["later step reads userName"]
    N1 --> N2
    N2 --> N3
```

Без memory тест не мог бы подготовить данные и использовать их в следующих действиях.

### Helper results remain available

Helper может подготовить значение, которое тест использует дальше.

```javascript
function buildUserName() {
  return 'qa-user';
}

const userName = buildUserName();

console.log(userName);
```

`return` будет подробно изучаться позже. Сейчас важна идея: результат helper должен быть сохранен, иначе следующий шаг не сможет его использовать.

```mermaid
flowchart TD
    N1["helper создает result"]
    N2["тест сохраняет результат"]
    N3["последующая проверка читает результат"]
    N1 --> N2
    N2 --> N3
```

### Values survive between assertions

Тест может хранить expected value:

```javascript
const expectedStatus = 'active';

console.log(expectedStatus);
console.log(expectedStatus);
```

Memory объясняет, почему одно и то же expected value доступно для нескольких проверок.

### Отладка Playwright tests

Когда Playwright-тест падает, причина часто связана не с самим кликом или assertion, а с тем, какое значение было сохранено раньше.

```mermaid
flowchart TD
    N1["fixture stores baseUrl"]
    N2["test reads baseUrl"]
    N3["helper builds page URL"]
    N4["Playwright opens wrong URL"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Если URL неправильный, нужно смотреть не только на `page.goto`, но и на место, где значение было сохранено или обновлено.

### Fixture data

Fixture часто подготавливает long-lived data для теста:

```mermaid
flowchart TD
    N1["fixture"]
    N2["создать user"]
    N3["store userName"]
    N4["test reads userName"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

Memory model помогает понять, почему ошибка в подготовленных данных проявляется позже, в другом слое test framework.

---

## Итоги

Memory нужна любой программе, потому что выполнение состоит из связанных шагов. Если один шаг создал информацию, а другой шаг должен ее использовать, engine должен сохранить эту информацию.

В этой главе memory рассматривалась концептуально. Мы не изучали Stack & Heap, references, Garbage Collector, Scope или Lexical Environment. Вместо этого была построена базовая модель:

```mermaid
flowchart TD
    N1["Value"]
    N2["информация, с которой работает программа"]
    N3["Identifier"]
    N4["имя, по которому программа обращается к информации"]
    N5["Memory"]
    N6["концептуальное хранилище информации во время выполнения"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
    N3 --> N5
    N5 --> N6
```

Теперь общая модель JavaScript стала такой:

```text
Execution Context creates the execution environment.
Call Stack manages which context is active.
Memory stores everything the engine needs while the program runs.
```

Следующая глава объяснит variables: как программист создает identifiers, связывает их с значения и управляет сохраненной информацией через `var`, `let` и `const`.

---

## Что нужно запомнить

✓ Программа не может работать без memory.

✓ Memory нужна, чтобы сохранять информацию между шагами выполнения.

✓ Value — информация, с которой работает программа.

✓ Identifier — имя для доступа к сохраненной информации.

✓ Store value означает сохранить информацию для будущего использования.

✓ Read value означает получить сохраненную информацию.

✓ Update value означает изменить информацию, которую программа прочитает позже.

✓ Temporary information нужна только на короткий момент.

✓ Long-lived information нужна дольше одного шага.

✓ Execution Context, Call Stack и Memory описывают разные части одной модели выполнения.

---

## Проверьте себя

1. Почему программа не может работать без memory?

2. Чем value отличается от identifier?

3. Что значит store value?

4. Что значит read value?

5. Что значит update value?

6. Почему temporary data не обязательно живет долго?

7. Чем long-lived information отличается от temporary information?

8. Как memory связана с Execution Context?

9. Как memory связана с Call Stack?

10. Почему Automation QA engineer должен понимать memory model?

---

## Практика

Практика к этой главе находится в файле:

```text
practice/01-javascript/05-memory.md
```

Перед выполнением практики запустите примеры из `examples/01-javascript/chapter-05/` и для каждого файла составьте таблицу:

```mermaid
flowchart LR
    N1["identifier"]
    N2["current value"]
    N1 --> N2
```

---

## Решения

Решения находятся в файле:

```text
solutions/01-javascript/05-memory.md
```

Открывайте решения после самостоятельной попытки. В этой главе важно сравнивать не только итоговый ответ, но и путь изменения memory состояние.

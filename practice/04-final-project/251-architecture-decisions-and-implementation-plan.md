# Практика: Архитектурные решения и план реализации

## 1. Требование, решение или деталь реализации

Классифицируйте каждую запись:

1. Обязательный набор тестов запускается с двумя workers и `retries: 0`.
2. Зависимости исходного кода направлены от tests и adapters к contracts, а contracts не импортируют implementations.
3. Configuration validator будет вызван из конкретной функции загрузки.
4. Каждый созданный record имеет owner и failure-safe cleanup.
5. Сгенерированные gRPC-файлы сохраняются в repository.
6. Database adapter использует конкретное имя будущего method.

Для каждой записи укажите:

- категорию: требование главы 250, архитектурное решение или деталь реализации;
- требуемый документ или будущую главу-владельца;
- связанную запись главы 250: requirement, scenario, risk или constraint;
- почему неверная классификация опасна.

**Ожидаемый результат:** таблица из шести строк. Архитектурное решение должно быть отличено от обязательного результата и от детали будущего кода.

**Критерии оценки:** каждая строка классифицирована; архитектура не меняет scope; детали реализации не выдаются за ADR.

## 2. Аудит направления зависимостей

Команда предложила следующие исходные зависимости:

| Откуда | Куда |
| --- | --- |
| Tests | Business scenarios |
| Business scenarios | Public contracts |
| REST adapter | Public contracts |
| Public contracts | REST adapter |
| Database adapter | Test fixtures |
| UI Page Object | REST adapter |
| Fixtures | Composition Root |
| Composition Root | Validated configuration |
| Diagnostics adapter | CI workflow |

Найдите запрещённые направления. Для каждого объясните:

- почему это именно зависимость исходного кода, а не поток вызовов или данных;
- какой риск оно создаёт;
- как изменить границу без implementation code;
- с каким requirement или risk главы 250 связано исправление.

Дополнительно опишите допустимый поток вызовов для `XL-01` «API setup → UI verification», который не создаёт импорт UI layer → REST adapter.

**Ожидаемый результат:** исправленный концептуальный список зависимостей и отдельное описание потока вызовов.

**Критерии оценки:** contracts не импортируют implementations; adapters не импортируют fixtures; UI abstraction не координирует REST; diagnostics не зависит от CI; cycles отсутствуют.

## 3. Критика ADR

Дана запись:

| Поле | Значение |
| --- | --- |
| ID | `ADR-004` |
| Название | Использовать interface для каждого class |
| Статус | `ACCEPTED` |
| Контекст | Так принято в больших framework |
| Решение | Создать interface для всех classes |
| Альтернативы | Нет |
| Последствия | Код станет правильным |

Проведите аудит и перепишите ADR так, чтобы он решал реальную границу проекта. Можно выбрать authentication/session, database verification или diagnostics evidence boundary.

Новая запись должна содержать все обязательные поля главы 251, минимум две реалистичные alternatives, пользу и стоимость, ссылки минимум на одно требование и один scenario или risk главы 250.

**Ожидаемый результат:** один полноценный ADR со статусом `PROPOSED` или `ACCEPTED` и краткий список дефектов исходной записи.

**Критерии оценки:** отсутствует догма «interface для каждого class»; решение следует из consumer need; последствия двусторонние; owner и review trigger определены.

## 4. Область жизни и владение ресурсами

Для каждого ресурса выберите test scope, worker scope либо другую явно объяснённую область жизни:

| Ресурс | Факты |
| --- | --- |
| Browser context | Содержит authenticated storage и изменяется внутри test |
| API context | Stateless transport, но token уникален для test account |
| gRPC channel | Concurrency-safe, metadata передаётся на каждый call, создание дорогое |
| PostgreSQL pool | Ограничен четырьмя connections, не хранит текущий test transaction |
| Созданная business entity | Изменяется test и должна удаляться после failure |
| Static account | Один на environment, конкурентное изменение запрещено |

Для каждого укажите owner, момент регистрации cleanup, действие закрытия или очистки, поведение при partial setup failure и способ сохранить primary и cleanup errors. Для static account решите, можно ли его использовать в state-changing parallel scenario.

**Ожидаемый результат:** матрица областей жизни и порядок обратной очистки для одного сценария, использующего API context, business entity и database verification.

**Критерии оценки:** scope выбран по mutation, ownership и isolation; worker scope не объявлен data isolation; mutable data не разделяется по умолчанию; residue check указан.

## 5. Политика сгенерированного gRPC-кода

Сравните три варианта:

- commit generated files;
- generate during setup/build;
- isolated generation step.

Исходные факты:

- `.proto` разрешено хранить в учебном repository;
- generator доступен в CI;
- clean install должен оставаться простым;
- generated output занимает умеренный объём;
- команда SUT меняет contract редко, но требует review diff;
- tool version можно зафиксировать.

Выберите вариант и оформите краткое решение. Допустим другой выбор, если trade-offs доказаны. Укажите reproducibility, CI setup, version pinning, reviewability, drift detection, onboarding, owner и review trigger.

**Ожидаемый результат:** decision matrix и обоснованная политика без generation script или generated files.

**Критерии оценки:** решение связано с фактами выбранного SUT; drift и pinned version учтены; «всегда лучший вариант» не используется.

## 6. Мини-проект: этапы и отложенные решения

Проведите аудит плана:

- chapter 252 создаёт skeleton и сразу реализует REST, gRPC и database clients;
- chapter 253 начинает UI до утверждения configuration boundary;
- integration впервые проверяется в chapter 257;
- cleanup owner определяется после появления cross-layer tests;
- generated-code policy откладывается без owner до chapter 255;
- chapter 259 добавляет отсутствующие mandatory scenarios.

Исправьте план для глав 252–259. Для каждой главы укажите условие входа, результат, зависимость, проверку, доказательство, главный риск и условие выхода. Создайте отдельный журнал минимум для трёх отложенных решений с owner, причиной, блокирующим условием, последним моментом решения, необходимым доказательством, риском и статусом.

Завершите проверку готовности главы 252 со статусом `PASS`, `BLOCKED` или `FAIL`. Свяжите вывод с утверждёнными scope, scenarios и risks главы 250.

**Ожидаемый результат:** таблица этапов 252–259, журнал отложенных решений и аргументированный статус готовности.

**Критерии оценки:** chapter 252 не реализует business layers; shared boundaries предшествуют layers; integration feedback не отложен полностью; cleanup ownership определён заранее; chapter 259 проводит audit, а не спасает неполный scope.

# Решения: Архитектурные решения и план реализации

## 1. Требование, решение или деталь реализации

### Ответ

| Запись | Категория | Владелец | Связь с главой 250 |
| --- | --- | --- | --- |
| Два workers и `retries: 0` | Требование | Главы 258–259 | Parallel and stability acceptance |
| Зависимости направлены к contracts | Архитектурное решение | ADR главы 251 | Architecture acceptance и риск cycles |
| Вызов validator из конкретной функции | Деталь реализации | Глава 252 | Configuration acceptance |
| Owner и failure-safe cleanup | Требование | Главы 251, 257 | Data lifecycle acceptance и state-changing scenarios |
| Commit generated files | Архитектурное решение | ADR 251/252 | gRPC scenarios, reproducibility и drift risk |
| Имя database method | Деталь реализации | Глава 256 | PostgreSQL verification requirement |

Запись об owner имеет две стороны: глава 250 требует результат, а глава 251 обязана превратить его в ownership boundary. Конкретная cleanup implementation появится позже.

### Объяснение

Требование описывает проверяемый результат проекта. Архитектурное решение выбирает устойчивую границу или направление с альтернативами и последствиями. Деталь реализации определяет конкретную форму будущего кода. Если эти уровни смешать, ADR начнёт диктовать синтаксис, а scope станет зависеть от удобства реализации.

### Типичная ошибка

Считать любое технически звучащее утверждение архитектурой и записывать имена functions или classes в ADR.

### Связь с Automation QA

Разделение уровней позволяет сохранить mandatory stability и cleanup requirements при замене конкретной fixture, client или validation library.

## 2. Аудит направления зависимостей

### Ответ

Допустимы:

- Tests → Business scenarios;
- Business scenarios → Public contracts;
- REST adapter → Public contracts;
- Fixtures → Composition Root;
- Composition Root → Configuration module как source dependency; validated value во время startup движется из configuration module в Composition Root.

Запрещены и исправляются так:

| Запрещённая связь | Риск | Исправленная граница |
| --- | --- | --- |
| Public contracts → REST adapter | Contract зависит от implementation и создаёт cycle | REST adapter реализует contract; contract не знает adapter |
| Database adapter → Test fixtures | Lower layer зависит от test lifecycle | Fixture получает database capability из Composition Root |
| UI Page Object → REST adapter | UI abstraction координирует unrelated transport | Business scenario зависит отдельно от UI и REST contracts |
| Diagnostics adapter → CI workflow | Evidence недоступно локально | Diagnostics публикует environment-independent evidence, а CI сохраняет artifacts |

Runtime flow `XL-01`: test вызывает business scenario; scenario вызывает REST setup contract, получает owned identifier, затем вызывает UI verification contract; после проверки lifecycle owner запускает cleanup. Data проходит REST → scenario → UI, но UI source code не импортирует REST implementation.

### Объяснение

Зависимость исходного кода видна в imports и compile-time graph. Поток вызовов описывает последовательность calls, поток данных — движение данных, а поток очистки — обратный порядок освобождения ownership. Допустимый runtime-вызов через contract не оправдывает обратный import.

### Типичная ошибка

Рисовать стрелку ответа SUT как source dependency и на этом основании разрешать adapters импортировать orchestration или fixtures.

### Связь с Automation QA

Исправленный graph позволяет заменить REST transport, запускать diagnostics локально и сохранить UI Page Object сфокусированным на browser behavior.

## 3. Критика ADR

### Ответ

Дефекты исходной записи: context не содержит фактов проекта, alternatives отсутствуют, consequences односторонние и непроверяемые, links и owner не определены, trigger отсутствует, а решение вводит interface без consumer boundary.

| Поле | Исправленная запись |
| --- | --- |
| ID | `ADR-004` |
| Название | Граница database verification |
| Статус | `ACCEPTED` |
| Контекст | `XL-02` требует проверить persisted state, не раскрывая raw SQL в test; риск unsafe interpolation и coupling к schema |
| Решение | Scenario зависит от conceptual database verification contract, который принимает business identifier и возвращает normalized result или явное absence |
| Альтернативы | Raw query в test; generic repository, раскрывающий любую таблицу; verification через REST без mandatory PostgreSQL evidence |
| Последствия | Tests не знают SQL и schema details; требуется узкий adapter и согласованная normalization; изменение schema локализуется, но contract нужно поддерживать |
| Связанные требования | Database verification, parameterized queries, normalized comparison |
| Связанные сценарии | `XL-02` |
| Связанные риски | Raw SQL in tests, SUT details leaking into scenarios |
| Владелец | Владелец Database Layer главы 256 |
| Триггер пересмотра | Изменение разрешённой schema или второй consumer с отличающимся business result |

### Объяснение

Interface здесь возможен не потому, что существует будущий class, а потому, что scenario нуждается в границе, скрывающей SQL и schema details. Альтернативы реалистичны, а последствия включают пользу и стоимость.

### Типичная ошибка

Заменить догму «interface для каждого class» догмой «repository для каждой таблицы», не проверив consumer и business operation.

### Связь с Automation QA

ADR сохраняет обязательную PostgreSQL verification, но не заставляет cross-layer test напрямую владеть query construction.

## 4. Область жизни и владение ресурсами

### Ответ

| Ресурс | Scope | Owner | Registration и cleanup |
| --- | --- | --- | --- |
| Browser context | Test | Test fixture | Close регистрируется сразу после создания context |
| API context | Test | Test fixture | Уникальный token и mutable auth state не разделяются; close после test |
| gRPC channel | Worker | Worker fixture | Close один раз после последнего test; call metadata не хранится в channel state |
| PostgreSQL pool | Worker | Worker fixture/Composition Root | Pool закрывается в worker teardown; test transactions в нём не хранятся |
| Business entity | Test | Создавший scenario через cleanup registry | Cleanup регистрируется сразу после получения identifier; затем residue check |
| Static account | Environment owner, read-only для parallel suite | Не test | State-changing parallel scenario запрещён без отдельной isolation strategy |

Пример обратного порядка: создать API context → создать entity и сразу зарегистрировать cleanup → выполнить database verification → освободить временный database consumer → удалить entity → проверить absence → закрыть API context. При partial setup выполняются уже зарегистрированные actions.

Primary error сохраняется как главная причина. Cleanup error прикладывается как отдельное observable evidence; она не заменяет и не скрывает primary failure.

### Объяснение

Дорогой concurrency-safe channel и pool можно разделить, если они не хранят mutable per-test state. Business entity всегда имеет test owner. Worker resource не делает данные уникальными и не решает конфликт static account.

### Типичная ошибка

Назначить worker scope всем дорогим ресурсам, включая authenticated context и mutable business data.

### Связь с Automation QA

Явное ownership позволяет выполнить mandatory suite с двумя workers и доказать отсутствие owned residue после успеха и failure.

## 5. Политика сгенерированного gRPC-кода

### Ответ

| Критерий | Commit | Setup/build | Isolated step |
| --- | --- | --- | --- |
| Clean install | Простой | Требует generation | Требует отдельного step |
| Review contract change | Generated diff видим | Нужно отдельно сохранять/сравнивать output | Diff проверяется в generation boundary |
| CI | Может только проверить drift | Генерирует каждый раз | Запускает отдельную generation job/step |
| Repository size | Больше | Меньше | Зависит от хранения output |
| Onboarding | Проще | Нужен toolchain | Нужна документированная команда |

Выбор: commit generated files. `.proto` разрешено хранить, output умеренный, изменения редкие и команда требует review diff. Generator version фиксируется; CI повторяет generation в контролируемом шаге и проверяет отсутствие drift. Owner — владелец gRPC integration. Trigger — изменение `.proto`, generator major version или правил распространения contract.

Изолированный step также допустим, если автор докажет, что clean install и review diff остаются воспроизводимыми.

### Объяснение

Решение следует из фактов SUT и repository, а не из универсального правила. Commit упрощает onboarding и review, но добавляет обязанность синхронизировать source contract, pinned tool и generated output.

### Типичная ошибка

Хранить generated files без команды воспроизведения и считать наличие diff достаточной защитой от drift.

### Связь с Automation QA

Воспроизводимая policy гарантирует, что local и CI gRPC clients соответствуют одному `.proto` и одной версии generator.

## 6. Мини-проект: этапы и отложенные решения

### Ответ

| Глава | Условие входа | Зависимость | Результат | Проверка | Доказательство | Риск | Условие выхода |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 252 | Architecture gate `PASS` | Architecture contract и SUT config contract | Skeleton, config, profiles, secrets boundary, base fixtures | Compile, invalid-config failure, dry startup | Command logs и sanitized error | Scattered environment reads | Stable runtime composition |
| 253 | Shared boundaries стабильны | UI contracts и composition | UI layer и два UI scenarios | Independent runs и controlled failure | Results, screenshot и Trace | Shared auth state | UI public API стабилен |
| 254 | REST data needs утверждены | REST contracts и cleanup plan | REST layer и два scenarios | Runtime-validation failure и positive/negative checks | Sanitized request/response | Annotation instead of validation | Setup/cleanup API стабилен |
| 255 | Generated policy готова | `.proto` и gRPC contracts | gRPC layer и два unary scenarios | Success и expected non-OK status | Status, metadata summary и deadline | Drift или no deadline | Comparison data доступны |
| 256 | Database boundary подтверждена | Verification contract и access needs | Pool, DAL, persisted check | Connection release, parameterization, residue check | Safe query ID и normalized comparison | Unsafe query или leak | Normalized database API готов |
| 257 | Public APIs устойчивы | Scenario records и ownership map | Три cross-layer scenarios | Independent runs, polling, no residue | Results и cleanup evidence | Layer bypass | Portfolio complete |
| 258 | Portfolio завершён | Diagnostics и execution requirements | Diagnostics, two workers и CI | Три runs и controlled failure | Allure и CI artifacts | Retry-dependent result | Evidence package ready |
| 259 | Release candidate готов | Evidence package и initial DoD | Audits, README, limitations | Independent reproduction и DoD classification | Audit records | Feature creep | No blockers |

| Отложенное решение | Owner | Причина | Блокирующее условие | Последний момент | Доказательство | Риск | Статус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Config validation library | 252 | Нужна оценка errors и toolchain | Completion 252 | До schema implementation | API/errors/CI comparison | Unvalidated startup | `PROPOSED` |
| Generated storage policy | 252/255 | Нужны `.proto` rules | Completion 252, если влияет на commands | До clean-install command | License, tool version, drift proof | Different local/CI clients | `PROPOSED` |
| Database cleanup mechanism | 256/257 | Зависит от write access | State-changing scenarios | До first mutation | Allowed cleanup check | Residue | `PROPOSED` |

Готовность главы 252 получает `PASS`, если scope главы 250 и SUT остаются в состоянии `PASS`, направление зависимостей и owners утверждены, а указанные отложенные решения имеют owners и не блокируют начало skeleton. Если generated policy влияет на обязательную clean-install command, но owner ещё не получил evidence, статус — `BLOCKED`. Cycle, отсутствующий cleanup owner или необходимость уменьшить mandatory scope дают `FAIL`.

### Объяснение

Исправленный план сначала создаёт общую composition/config boundary, затем реализует layers. Integration assumptions проверяются по мере появления каждого public API, а глава 257 завершает portfolio. Cleanup ownership определяется до mutation. Глава 259 проверяет готовый результат и не добавляет пропущенные mandatory scenarios.

### Типичная ошибка

Считать номер будущей главы достаточным планом и не задавать entry, evidence и exit conditions.

### Связь с Automation QA

Проверки этапов позволяют находить ошибки configuration, ownership и contracts до того, как они проявятся одновременно в Playwright, REST, gRPC, PostgreSQL и CI.

# Educational Work Items SUT: Phase 1

## Governance status

Реализован только milestone `SUT-0 Phase 1 — Skeleton and PostgreSQL`.

- Gate A: `PASS`
- Gate B: `PASS`
- Gate C: `BLOCKED`
- Gate D: `BLOCKED`
- Implementation permission: `LIMITED — SUT-0 Phase 1 only`

Этот каталог не является частью Automation QA Framework из
`examples/04-final-project/`. Framework в следующих главах будет использовать
только публичные boundaries SUT.

## Предупреждение

SUT предназначен исключительно для локального обучения. Committed credentials
защищают только disposable local data, не являются production secrets и не
должны переиспользоваться. Production mode, внешние PostgreSQL hosts и
production deployment не поддерживаются.

## Возможности Phase 1

- один PostgreSQL service в Docker Compose;
- ordered immutable migrations с ledger, canonical LF checksum и advisory lock;
- таблицы `users` и `work_items`;
- роли migration, application и read-only verification;
- deterministic tester/viewer seed;
- guarded local reset;
- PostgreSQL, migration и seed readiness checks;
- внутренние `/health/live` и `/health/ready` как health-only foundation;
- real PostgreSQL integration tests;
- graceful close foundation для health process и database pools.

Phase 1 не предоставляет REST business API, authentication, browser UI, gRPC,
proto, generated code, cross-layer scenarios, CI workflow или capability gate.
`PASS` Phase 1 readiness не означает готовность полного SUT.

## Предпосылки

- Node.js 22;
- npm;
- запущенный Docker Engine;
- Docker Compose v2;
- свободный локальный port `55432`;
- выполнение команд из корня repository.

PostgreSQL использует reviewed exact image `postgres:17.10-bookworm` и
публикуется только на `127.0.0.1:55432`.

Browser, внешний SUT, gRPC tooling, frontend tooling и production credentials
для Phase 1 не требуются.

## Структура

- `compose.yaml` — локальный PostgreSQL;
- `docker/init/` — одноразовая bootstrap-настройка ролей;
- `migrations/` — immutable SQL migrations;
- `seed/` — deterministic минимальный seed;
- `src/config/` — validated raw-input boundary;
- `src/database/` — pools, migrations, seed и reset;
- `src/health/` — Phase 1 liveness/readiness;
- `src/lifecycle/` — bounded shutdown foundation;
- `src/logging/` — минимальные безопасные JSON logs;
- `tests/` — database-focused integration tests.

## Первый запуск

Рекомендуемый clean-clone flow:

```bash
npm ci
npm run sut:db:up
npm run sut:migrate
npm run sut:seed
npm run sut:health
npm run sut:test:db
npm run sut:db:down
```

Этот flow сохраняет именованный PostgreSQL volume после остановки. Он удобен
для изучения отдельных операций и диагностики. Успешное выполнение доказывает
работоспособность PostgreSQL foundation Phase 1, но не REST, authentication,
UI, gRPC, CI, Gate C или готовность полного SUT.

Для воспроизводимой проверки на чистой disposable database используйте:

```bash
npm run sut:phase1:check
```

Это рекомендуемая итоговая проверка Phase 1. Она удаляет только собственный
volume закреплённого SUT Compose project после завершения.

## Команды Phase 1

| Команда | Назначение и prerequisites | Side effects и сохранённое состояние |
| --- | --- | --- |
| `npm run sut:build` | Компилирует SUT TypeScript | Перезаписывает ignored `.sut-build/`; database не требуется |
| `npm run sut:typecheck` | Проверяет строгую TypeScript boundary | Не создаёт output и не меняет database |
| `npm run sut:db:config` | Валидирует resolved Compose configuration | Не запускает container |
| `npm run sut:db:up` | Запускает только PostgreSQL и ждёт его health | Создаёт container, network и при необходимости named volume |
| `npm run sut:db:down` | Останавливает PostgreSQL foundation | Удаляет container и network, сохраняет named volume |
| `npm run sut:migrate` | Применяет новые ordered migrations | Сохраняет schema и ledger в volume; повторный запуск является no-op |
| `npm run sut:seed` | Восстанавливает deterministic seed state | Сохраняет non-seed data; повторный запуск идемпотентен |
| `npm run sut:reset` | Удаляет только non-seed educational data | Сохраняет и повторно проверяет protected seed rows |
| `npm run sut:health` | Выполняет one-shot readiness check | Не запускает long-lived server и не меняет database |
| `npm run sut:test:db` | Запускает unit checks и real PostgreSQL integration tests | Требует prepared local database; тестовые изменения изолируются или очищаются |
| `npm run sut:phase1:check` | Выполняет полный clean Phase 1 gate | Использует закреплённый deterministic SUT Compose project и удаляет его container, network и volume |

Любая команда возвращает non-zero exit code при ошибке. Ни одна команда не
доказывает готовность future phases или не изменяет Gate C.

## Пошаговый flow

Проверить Compose и TypeScript:

```bash
npm run sut:db:config
npm run sut:typecheck
```

Запустить PostgreSQL:

```bash
npm run sut:db:up
```

Применить migrations и seed:

```bash
npm run sut:migrate
npm run sut:seed
```

Проверить Phase 1 readiness:

```bash
npm run sut:health
```

Запустить database tests:

```bash
npm run sut:test:db
```

Удалить только non-seed local data и восстановить seed:

```bash
npm run sut:reset
```

Остановить PostgreSQL:

```bash
npm run sut:db:down
```

`sut:db:down` удаляет container и network, но сохраняет именованный disposable
volume для следующего локального запуска. Полная Phase 1 проверка начинает с
чистого volume, использует фиксированный Compose project name, печатает
PostgreSQL logs при ошибке, переопределяет ambient `SUT_DB_*` известными local
defaults и удаляет test volume после завершения:

```bash
npm run sut:phase1:check
```

Фактическая последовательность gate:

1. валидировать TypeScript и Compose;
2. удалить только прежние ресурсы project `educational-work-items-phase1`;
3. создать clean volume и запустить PostgreSQL;
4. дождаться PostgreSQL health;
5. применить migrations дважды;
6. применить deterministic seed дважды;
7. проверить readiness;
8. выполнить 47 tests;
9. выполнить reset дважды и снова проверить readiness;
10. при любом результате удалить собственные container, network и volume.

При failure gate печатает PostgreSQL logs, сохраняет исходный failure status и
отдельно сообщает cleanup failure. Он не удаляет unrelated Docker resources.

## Compose и volume

- Compose project: `educational-work-items-phase1`;
- service: `postgres`;
- image: `postgres:17.10-bookworm`;
- binding: `127.0.0.1:55432:5432`;
- volume: `educational-work-items-phase1-postgres-data`.

Init script создаёт роли только при первом создании volume. Обычный
`sut:db:down` сохраняет данные, поэтому init script при следующем старте не
повторяется. Для полностью чистой disposable database предпочтителен
`sut:phase1:check`.

Для ручной очистки только ресурсов этого Compose project:

```bash
docker compose -f sut/compose.yaml down --volumes
```

После этого выполните `sut:db:up`, `sut:migrate` и `sut:seed`. Не удаляйте
произвольные Docker volumes и не используйте эту очистку для сокрытия
migration drift.

Проверить состояние и безопасно прочитать PostgreSQL logs:

```bash
docker compose -f sut/compose.yaml ps
docker compose -f sut/compose.yaml logs postgres
```

## Migrations

Runner читает только обычные UTF-8 files из `sut/migrations/` с contiguous
numeric versions, сортирует их по version и записывает migration name,
canonical LF SHA-256 checksum и timestamp в `schema_migrations`.

Advisory lock сериализует concurrent runners с bounded timeout. Каждая
migration и её ledger row выполняются в одной transaction. При failure runner
останавливается, откатывает migration и освобождает connection и lock.

Применённые migrations immutable. Checksum mismatch или обнаружение удалённой
migration означает drift: восстановите исходный applied file из version
control. Исправление schema оформляется новой migration. Не редактируйте
ledger, не отключайте drift checks и не переносите SQL из `tests/fixtures/` в
production migration flow.

## Deterministic seed

Seed создаёт двух deterministic users и один пример Work Item с фиксированными
UUID и UTC timestamps. Повторный запуск восстанавливает утверждённые значения
только для уже помеченных seed rows, не создаёт duplicates и отклоняет
конфликт с non-seed identity.

Seed выполняется в transaction, а readiness проверяет его точное состояние.
`password_salt` и `password_hash` содержат только структурные placeholders:
они не являются login credentials и не доказывают реализацию authentication.
Protected seed Work Item нельзя изменить или удалить application role.

## Reset

> `sut:reset` предназначен только для disposable educational data.

Reset разрешён только в educational mode для утверждённых local host и
database name. Одна transaction удаляет строки `is_seed = false`, сохраняет
seed rows и повторно валидирует deterministic seed. Failure откатывает все
удаления, а повторный reset даёт тот же результат.

Active-run tracking отсутствует. Поэтому reset выполняют только вне test run;
защита от удаления данных активного run принадлежит будущей отдельно
разрешённой phase. Не обходите mode, host или database guards.

## Health и lifecycle

`npm run sut:health` выполняет one-shot readiness check. Внутренний
`src/main.ts` доказывает health-process foundation и предоставляет только:

- `GET /health/live`;
- `GET /health/ready`.

`/health/live` доказывает только liveness process. `/health/ready` возвращает
`200`, когда database query проходит, migration versions/names/checksums
совпадают, а seed имеет ожидаемое состояние. Недоступная database, missing или
drifted migration, seed mismatch и bounded timeout дают безопасный `503`.

Health process не включён в Compose и не объявлен полным SUT application.
Database pools, migration connections и health server создаются явно и
закрываются владельцами. Long-lived process обрабатывает `SIGINT` и `SIGTERM`
с ограниченным временем shutdown.

Readiness не проверяет REST, authentication, UI, gRPC, capability gate, CI или
Gate C.

## Tests

`sut:test:db` выполняет 47 tests:

- configuration: 7;
- health/lifecycle: 11;
- logging: 2;
- migrations: 10;
- privileges: 5;
- schema: 7;
- seed/reset: 5.

Database behavior проверяется на real PostgreSQL; mocked PostgreSQL replacement
не используется. Configuration и logging также имеют unit-level checks.
Browser, REST, gRPC и external services не запускаются. Test count является
текущим inventory, а не стабильным публичным contract.

## Troubleshooting

| Симптом | Безопасная диагностика | Безопасное восстановление |
| --- | --- | --- |
| Docker daemon недоступен | `docker info` | Запустить Docker Engine; не обходить Compose checks |
| Port `55432` занят | `lsof -nP -iTCP:55432 -sTCP:LISTEN` | Остановить известный owning process или освободить port; не завершать случайные processes |
| PostgreSQL unhealthy | `docker compose -f sut/compose.yaml ps` и `docker compose -f sut/compose.yaml logs postgres` | Исправить reported cause и повторить `sut:db:up` |
| Existing volume несовместим с текущим init contract | Проверить Compose logs и убедиться, что данные disposable | Выполнить `docker compose -f sut/compose.yaml down --volumes`, затем startup flow; не удалять unrelated volumes |
| Migration checksum mismatch | Запустить `sut:migrate` и проверить version из safe error | Восстановить applied file из version control; correction делать новой migration |
| Applied migration удалена | Сопоставить ledger version с repository | Восстановить immutable file; не редактировать ledger вручную |
| Seed mismatch | Запустить `sut:seed`, затем `sut:health` | Устранить non-seed identity conflict или восстановить repository seed; не менять `is_seed` вручную |
| Readiness возвращает `503` | Запустить `sut:health`, проверить PostgreSQL state и migrations | Исправить конкретную database, migration или seed category |
| Reset отклонён guard | Проверить educational mode, local host и database name | Вернуть утверждённые local defaults; не ослаблять guards |
| Остались project resources | `docker compose -f sut/compose.yaml ps -a` | `npm run sut:db:down`; для disposable volume использовать только scoped `down --volumes` |
| `sut:phase1:check` завершился ошибкой | Использовать напечатанные PostgreSQL logs и запустить relevant command отдельно | Исправить первичную cause и повторить gate; не считать partial run успешным |

Операционные errors сообщают category и operation без raw credentials,
connection strings, полного SQL или raw PostgreSQL message. Migration lock
timeout требует завершить конкурирующий runner или дождаться его bounded
cleanup, а не отключать lock.

## Educational credentials

Committed role passwords являются только local educational defaults для
disposable data. Они не production secrets, но всё равно redacted из logs и не
должны логироваться или переиспользоваться. Production mode и external
PostgreSQL hosts отклоняются.

`sut_bootstrap` используется official image только для initial role/database
setup. Обычные operations выполняют least-privileged migration, application и
read-only roles. Cleanup role остаётся `NOLOGIN` без runtime authorization.

| Role | Назначение |
| --- | --- |
| `sut_bootstrap` | Только initial setup official PostgreSQL image |
| `sut_migrator` | Migrations, deterministic seed и guarded reset |
| `sut_app` | Ограниченный будущий application access к Work Items |
| `sut_reader` | Read-only verification и PostgreSQL healthcheck |
| `sut_cleanup` | Зарезервированная `NOLOGIN` role без privileges |

## Maintenance

- applied migrations не изменяют; correction оформляют новой migration;
- deterministic seed UUID и timestamps сохраняют стабильными;
- изменения grants сопровождают effective privilege tests;
- изменения readiness сопровождают real PostgreSQL tests;
- смена PostgreSQL image требует compatibility и clean-start review;
- изменения scripts проверяют независимым запуском и полным Phase 1 gate;
- изменения phase boundary требуют governance review;
- новые dependencies требуют отдельного обоснования;
- generated `.sut-build/` не коммитят без изменения policy.

Operational evidence, готовое для отдельных решений:

- SUT-008: schema, ordering, ledger, drift, rollback, concurrency, least
  privilege;
- SUT-009: deterministic seed, idempotency, protection, safe reset, rollback,
  repeatability;
- SUT-011: Compose validity, clean startup, health, shutdown, volume cleanup,
  repeatability.

Этот список не меняет ADR status: SUT-008, SUT-009 и SUT-011 остаются
`PROPOSED`.

## Ограничения

- Bootstrap role официального PostgreSQL image используется только при первом
  создании disposable database и не используется SUT runtime.
- Migration loader принимает только обычные UTF-8 files из разрешённых
  directories, отклоняет symlinks и нормализует CRLF перед checksum.
- Runner создаёт `schema_migrations` как собственный bootstrap metadata object
  и прекращает работу, если существующий ledger несовместим с его contract.
- Application и verification roles не имеют доступа к `password_salt` и
  `password_hash`; application role также не видит служебный `is_seed`.
- `sut_cleanup` подготовлена как `NOLOGIN` role без privileges. Cleanup function
  и transport authorization принадлежат будущей отдельно разрешённой фазе.
- Phase 1 reset использует migration role, разрешён только в educational mode и
  удаляет только строки с `is_seed = false`.
- Active-run tracking ещё не существует: Phase 1 reset запускается только до
  test run, а runtime guard принадлежит отдельно разрешаемому hardening phase.
- Seed password fields содержат структурные placeholders. Authentication ещё
  не реализована и не заявляется работающей. Повторный seed восстанавливает
  deterministic значения только для уже помеченных seed users и отклоняет
  конфликт с non-seed identity.
- Application-generated UUID policy для новых business records будет
  применяться будущим application layer; schema не устанавливает UUID extension.

Также отсутствуют final cleanup authorization, session/token flow, full
capability gate, final diagnostics и chapters 253–259.

Следующий возможный шаг — только отдельные ADR decision tasks для SUT-008,
SUT-009 и SUT-011. Этот README не принимает ADR, не изменяет Gate C и не
разрешает начало Phase 2.

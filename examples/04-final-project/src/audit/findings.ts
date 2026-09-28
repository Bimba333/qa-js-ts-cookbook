import type { Finding } from "./audit.js";

/**
 * Наблюдения текущего состояния проекта.
 *
 * Файл заполняется по фактическому прогону, а не по замыслу. Честный `FAIL`
 * полезнее подогнанного `PASS`: он превращается в строку отчёта о доработке,
 * а подгонка превращается в сюрприз у следующего инженера.
 */
export const CURRENT_FINDINGS: readonly Finding[] = Object.freeze([
  {
    id: "ARCH-01",
    status: "PASS",
    proof: "слои не импортируют тесты и фикстуры; приведение типа заперто в src/grpc/generated-boundary.ts",
  },
  {
    id: "CONF-01",
    status: "PASS",
    proof: "final-project:test — 20 тестов границы конфигурации",
  },
  {
    id: "SEC-01",
    status: "PASS",
    proof: "final-project:diagnostics — маскирование по имени поля, секрет не доходит до вложения",
  },
  {
    id: "ISO-01",
    status: "PASS",
    proof: "final-project:cross — идентичность содержит проект, процесс и повтор",
  },
  {
    id: "CLEAN-01",
    status: "PASS",
    proof: "final-project:cross — запись исчезает после освобождения реестра с ошибкой",
  },
  {
    id: "ERR-01",
    status: "PASS",
    proof: "final-project:diagnostics — цепочка cause и порядок в AggregateError",
  },
  {
    id: "DIAG-01",
    status: "PASS",
    proof: "final-project:diagnostics — пакет доказательств с признаками запуска",
  },
  {
    id: "RETRY-01",
    status: "PASS",
    proof: "final-project:stability — три прогона с retries=0 дали одинаковый результат",
  },
  {
    id: "PAR-01",
    status: "PASS",
    proof: "final-project:stability — 30 тестов в двух рабочих процессах",
  },
  {
    id: "CI-01",
    status: "PASS",
    proof: "final-project:ci-check — одиннадцать требований к сценарию сборки",
  },
  {
    id: "PORT-01",
    status: "FAIL",
    proof: "матрица сценариев: закрыты REST-01, REST-02, GRPC-01, GRPC-02, XL-03 и частично UI-02",
    note: "не закрыты UI-01 (изменение состояния через интерфейс), XL-01 (подготовка через API → проверка через UI) и XL-02 (действие в UI → проверка в PostgreSQL)",
  },
  {
    id: "DOC-01",
    status: "PASS",
    proof: "разделы «Команды и ожидаемый результат» в главах 252–258",
  },
]);

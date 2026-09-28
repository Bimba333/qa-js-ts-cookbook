/**
 * Замороженная спецификация аудита.
 *
 * Серьёзность области задаётся ДО прогона и не пересматривается по его
 * результатам. Иначе аудит превращается в подгонку: неудобное требование
 * тихо становится менее важным.
 */
export const severities = ["blocker", "major", "minor"] as const;

export type Severity = (typeof severities)[number];

export type AuditArea = Readonly<{
  id: string;
  title: string;
  severity: Severity;
  /** Чем подтверждается выполнение: команда, файл или сценарий. */
  evidence: string;
}>;

export const SEVERITY_WEIGHT: Readonly<Record<Severity, number>> = Object.freeze({
  blocker: 100,
  major: 10,
  minor: 1,
});

export const AUDIT_SPECIFICATION: readonly AuditArea[] = Object.freeze([
  {
    id: "ARCH-01",
    title: "Направление зависимостей описано, циклы отсутствуют",
    severity: "blocker",
    evidence: "граф импортов слоёв",
  },
  {
    id: "CONF-01",
    title: "Внешняя конфигурация проверяется во время выполнения",
    severity: "blocker",
    evidence: "npm run final-project:test",
  },
  {
    id: "SEC-01",
    title: "Секреты отсутствуют в коде, журналах и вложениях",
    severity: "blocker",
    evidence: "npm run final-project:diagnostics",
  },
  {
    id: "ISO-01",
    title: "Данные имеют уникальную идентичность для каждого процесса",
    severity: "major",
    evidence: "npm run final-project:cross",
  },
  {
    id: "CLEAN-01",
    title: "Данные проекта удаляются после успеха и после отказа",
    severity: "blocker",
    evidence: "npm run final-project:cross",
  },
  {
    id: "ERR-01",
    title: "Исходная ошибка и ошибки очистки остаются доступными",
    severity: "major",
    evidence: "npm run final-project:diagnostics",
  },
  {
    id: "DIAG-01",
    title: "Падение создаёт очищенное доказательство",
    severity: "major",
    evidence: "npm run final-project:diagnostics",
  },
  {
    id: "RETRY-01",
    title: "Успешность обязательного набора не зависит от повторов",
    severity: "blocker",
    evidence: "npm run final-project:stability",
  },
  {
    id: "PAR-01",
    title: "Обязательный набор проходит в двух рабочих процессах",
    severity: "major",
    evidence: "npm run final-project:stability",
  },
  {
    id: "CI-01",
    title: "Сценарий сборки проверяем и не подавляет ошибки",
    severity: "major",
    evidence: "npm run final-project:ci-check",
  },
  {
    id: "PORT-01",
    title: "Портфель из девяти сценариев закрыт",
    severity: "blocker",
    evidence: "матрица сценариев главы 250",
  },
  {
    id: "DOC-01",
    title: "Другой инженер воспроизводит настройку и запуск",
    severity: "minor",
    evidence: "раздел команд в главах 252–258",
  },
]);

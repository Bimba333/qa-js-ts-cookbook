export type FieldValue = string | number | boolean | null;

/**
 * Признаки чувствительного имени.
 *
 * Проверяется имя поля, а не значение: угадывать секрет по виду строки
 * ненадёжно, а имена в проекте мы задаём сами.
 */
const SENSITIVE_FRAGMENTS = [
  "apikey",
  "authorization",
  "connectionstring",
  "cookie",
  "credential",
  "password",
  "secret",
  "storagestate",
  "token",
] as const;

export const REDACTED = "[REDACTED]";

function isSensitive(key: string): boolean {
  const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, "");

  return SENSITIVE_FRAGMENTS.some((fragment) => normalized.includes(fragment));
}

/**
 * Маскирование выполняется ДО передачи значений журналу.
 *
 * Если прятать секрет внутри журнала, он всё равно окажется в памяти
 * процесса журналирования и попадёт наружу при первой же ошибке в нём.
 */
export function redactFields(
  fields: Readonly<Record<string, FieldValue>>,
): Readonly<Record<string, FieldValue>> {
  return Object.freeze(
    Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [
        key,
        isSensitive(key) ? REDACTED : value,
      ]),
    ),
  );
}

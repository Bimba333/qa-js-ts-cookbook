export type ErrorDescription = Readonly<{
  name: string;
  message: string;
  cause?: ErrorDescription;
}>;

const MAX_CAUSE_DEPTH = 5;

/**
 * Безопасное описание выброшенного значения.
 *
 * Выброшено может быть что угодно, а цепочка `cause` способна замкнуться на
 * себя. Поэтому глубина ограничена, а посещённые ошибки запоминаются.
 */
export function describeError(value: unknown): ErrorDescription {
  return describe(value, new Set(), 0);
}

function describe(
  value: unknown,
  seen: Set<unknown>,
  depth: number,
): ErrorDescription {
  if (!(value instanceof Error)) {
    return Object.freeze({ name: "не Error", message: String(value) });
  }

  if (seen.has(value) || depth >= MAX_CAUSE_DEPTH) {
    return Object.freeze({ name: value.name, message: value.message });
  }

  seen.add(value);

  const cause = value.cause;

  if (cause === undefined) {
    return Object.freeze({ name: value.name, message: value.message });
  }

  return Object.freeze({
    name: value.name,
    message: value.message,
    cause: describe(cause, seen, depth + 1),
  });
}

/** Ошибки `AggregateError` разворачиваются в список: первая — причина. */
export function describeFailure(value: unknown): readonly ErrorDescription[] {
  if (value instanceof AggregateError) {
    return Object.freeze(value.errors.map((error) => describeError(error)));
  }

  return Object.freeze([describeError(value)]);
}

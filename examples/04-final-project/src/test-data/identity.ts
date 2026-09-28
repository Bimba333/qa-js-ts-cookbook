/**
 * Уникальная и диагностируемая идентичность тестовых данных.
 *
 * Случайная строка тоже была бы уникальной, но она ничего не объясняет: по
 * названию оставшейся записи нельзя понять, какой прогон её создал.
 */
export type IdentityParts = Readonly<{
  project: string;
  workerIndex: number;
  retry: number;
  testId: string;
}>;

export class TestDataIdentity {
  readonly #prefix: string;
  #sequence = 0;

  constructor(parts: IdentityParts) {
    // Признаки идут от общего к частному: так записи одного прогона
    // группируются при сортировке.
    this.#prefix = [
      "fp",
      parts.project,
      `w${parts.workerIndex}`,
      `r${parts.retry}`,
      parts.testId.slice(0, 8),
    ].join("-");
  }

  get prefix(): string {
    return this.#prefix;
  }

  /** Следующее уникальное название: последовательность локальна для теста. */
  next(label: string): string {
    this.#sequence += 1;

    return `${this.#prefix}-${label}-${this.#sequence}`;
  }
}

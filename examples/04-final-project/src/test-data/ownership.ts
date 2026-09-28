export type Disposal = () => Promise<void> | void;

/**
 * Реестр владения тестовыми данными.
 *
 * Очистка регистрируется в момент создания, а не в конце сценария: между
 * этими точками находится сам сценарий, и он может упасть.
 */
export class OwnedData {
  readonly #disposals: Array<{ label: string; dispose: Disposal }> = [];
  #released = false;

  own(label: string, dispose: Disposal): void {
    if (this.#released) {
      throw new Error("Нельзя взять во владение данные после освобождения");
    }

    this.#disposals.push({ label, dispose });
  }

  get size(): number {
    return this.#disposals.length;
  }

  /**
   * Освобождает всё в обратном порядке.
   *
   * Ошибка одной очистки не останавливает остальные, но и не теряется:
   * исходная ошибка сценария остаётся первой причиной.
   */
  async release(...primary: [] | [primaryError: unknown]): Promise<void> {
    this.#released = true;

    const failures: unknown[] = [];

    for (const entry of this.#disposals.splice(0).reverse()) {
      try {
        await entry.dispose();
      } catch (error) {
        failures.push(
          new Error(`Не удалось освободить «${entry.label}»`, { cause: error }),
        );
      }
    }

    const hasPrimary = primary.length === 1;

    if (!hasPrimary && failures.length === 0) return;

    if (hasPrimary && failures.length === 0) throw primary[0];

    throw new AggregateError(
      hasPrimary ? [primary[0], ...failures] : failures,
      "Сценарий или очистка его данных завершились ошибкой",
    );
  }
}

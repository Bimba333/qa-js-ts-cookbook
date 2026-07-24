export type Cleanup = () => void | Promise<void>;

export class ResourceScope {
  readonly #cleanups: Cleanup[] = [];
  #closed = false;

  register(cleanup: Cleanup): void {
    if (this.#closed) {
      throw new Error("Нельзя зарегистрировать cleanup после закрытия ResourceScope");
    }

    this.#cleanups.push(cleanup);
  }

  async close(...primary: [] | [primaryError: unknown]): Promise<void> {
    if (this.#closed) {
      throw new Error("ResourceScope уже закрыт");
    }

    this.#closed = true;
    const hasPrimaryError = primary.length === 1;
    const primaryError = primary[0];
    const cleanupErrors: unknown[] = [];

    for (const cleanup of this.#cleanups.splice(0).reverse()) {
      try {
        await cleanup();
      } catch (error) {
        cleanupErrors.push(error);
      }
    }

    if (hasPrimaryError && cleanupErrors.length === 0) {
      throw primaryError;
    }

    if (hasPrimaryError || cleanupErrors.length > 0) {
      throw new AggregateError(
        !hasPrimaryError
          ? cleanupErrors
          : [primaryError, ...cleanupErrors],
        "Выполнение или очистка foundation-ресурсов завершились ошибкой",
      );
    }
  }
}

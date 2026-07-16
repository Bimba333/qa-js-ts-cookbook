type Cleanup = () => void | Promise<void>;

export class ResourceScope {
  readonly #cleanups: Cleanup[] = [];
  #closed = false;

  register(cleanup: Cleanup): void {
    if (this.#closed) {
      throw new Error("Нельзя зарегистрировать cleanup после закрытия ResourceScope");
    }
    this.#cleanups.push(cleanup);
  }

  async close(primaryError?: unknown): Promise<void> {
    if (this.#closed) {
      if (primaryError !== undefined) {
        throw new AggregateError(
          [primaryError],
          "Сценарий завершился ошибкой после закрытия ResourceScope",
        );
      }
      return;
    }
    this.#closed = true;

    const cleanupErrors: unknown[] = [];
    const cleanups = this.#cleanups.splice(0).reverse();

    for (const cleanup of cleanups) {
      try {
        await cleanup();
      } catch (error) {
        cleanupErrors.push(error);
      }
    }

    if (primaryError !== undefined || cleanupErrors.length > 0) {
      throw new AggregateError(
        primaryError === undefined ? cleanupErrors : [primaryError, ...cleanupErrors],
        "Сценарий или очистка ресурсов завершились ошибкой",
      );
    }
  }
}

export async function usingResources<T>(operation: (scope: ResourceScope) => Promise<T>): Promise<T> {
  const scope = new ResourceScope();
  let outcome: { ok: true; value: T } | { ok: false; error: unknown };

  try {
    outcome = { ok: true, value: await operation(scope) };
  } catch (error) {
    outcome = { ok: false, error };
  }

  if (!outcome.ok) {
    await scope.close(outcome.error);
    throw outcome.error;
  }

  await scope.close();
  return outcome.value;
}

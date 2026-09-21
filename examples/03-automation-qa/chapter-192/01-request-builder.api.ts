import { expect, test } from "../support/sut/fixtures.js";
import type { WorkItemPriority } from "../support/sut/types.js";

type WorkItemPayload = {
  title: string;
  description: string;
  priority: WorkItemPriority;
};

/**
 * Builder задаёт разумные значения по умолчанию и позволяет менять только то,
 * что важно для сценария. Тест перестаёт зависеть от полей, к которым он
 * безразличен.
 */
class WorkItemBuilder {
  private value: WorkItemPayload = {
    title: "Задача по умолчанию",
    description: "Описание по умолчанию",
    priority: "MEDIUM",
  };

  withTitle(title: string): this {
    this.value = { ...this.value, title };
    return this;
  }

  withPriority(priority: WorkItemPriority): this {
    this.value = { ...this.value, priority };
    return this;
  }

  /** Уникальность снимает конфликты между параллельными запусками. */
  unique(marker: string): this {
    return this.withTitle(`${this.value.title} ${marker}`);
  }

  build(): WorkItemPayload {
    return { ...this.value };
  }
}

test("строит данные и убирает за собой", async ({ workItems }, testInfo) => {
  const payload = new WorkItemBuilder()
    .withTitle("Отчёт главы 192")
    .withPriority("HIGH")
    .unique(String(testInfo.testId))
    .build();

  const created = await workItems.createOrThrow(payload);

  expect(created.title).toBe(payload.title);
  expect(created.priority).toBe("HIGH");

  // Очистка выполняется фикстурой в teardown, поэтому тест не обязан
  // помнить про удаление даже при падении проверки выше.
  const stored = await workItems.get(created.id);
  expect(stored.status()).toBe(200);
});

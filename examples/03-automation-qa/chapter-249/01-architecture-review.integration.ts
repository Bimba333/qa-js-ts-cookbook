import { expect, test } from "@playwright/test";
import { chooseNextRefactoring } from "../support/integration/architecture-review.js";

test("выбирает рефакторинг по наблюдаемой проблеме", async () => {
  const decision = chooseNextRefactoring([
    {
      name: "Дублирование construction logic",
      evidence: "Три fixtures создают одинаковый client",
      severity: "medium",
    },
    {
      name: "Циклический import",
      evidence: "Service импортирует composition fixture",
      severity: "high",
    },
  ]);

  expect(decision).toEqual({
    nextAction: "Устранить: Циклический import",
    reason: "Service импортирует composition fixture",
  });
  expect(chooseNextRefactoring([])).toEqual({
    nextAction: "Сохранить текущую архитектуру",
    reason: "Проверенных проблем для рефакторинга нет",
  });
});

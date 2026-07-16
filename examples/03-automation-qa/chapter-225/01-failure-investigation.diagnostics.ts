import { expect, test } from "@playwright/test";

type FailureOwner = "application" | "test" | "environment" | "framework";

interface Investigation {
  symptom: string;
  evidence: readonly string[];
  hypothesis: string;
  owner: FailureOwner;
  verification: string;
}

function narrowFailure(input: Investigation): Investigation {
  if (input.evidence.length === 0) {
    throw new Error("Гипотеза без доказательств не считается результатом расследования");
  }
  return Object.freeze({ ...input, evidence: Object.freeze([...input.evidence]) });
}

test("отделяет симптом от проверенной причины", async () => {
  const investigation = narrowFailure({
    symptom: "Ожидался статус completed, получен pending",
    evidence: ["API вернул pending", "database хранит pending"],
    hypothesis: "приложение не завершило обработку задачи",
    owner: "application",
    verification: "после исправления оба слоя возвращают completed",
  });

  expect(investigation.symptom).not.toBe(investigation.hypothesis);
  expect(investigation.owner).toBe("application");
  expect(investigation.verification).toContain("оба слоя");
});

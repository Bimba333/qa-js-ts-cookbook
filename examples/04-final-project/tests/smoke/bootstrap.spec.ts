import { expect, test } from "../../src/fixtures/foundation-fixture.js";

test("bootstrap создаёт минимальный контекст без внешнего SUT", async ({ foundation }) => {
  expect(foundation.profile).toBe("local");
  expect(foundation.isCi).toBe(false);
  expect(foundation.config.uiBaseUrl).toBe("https://ui.example.invalid/");
  expect(foundation.config.artifactDirectory).toBe("test-results/final-project");
});

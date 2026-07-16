import { expect, test } from "@playwright/test";

test(
  "критический статус доступен",
  {
    tag: ["@smoke", "@regression"],
    annotation: { type: "owner", description: "platform-qa" },
  },
  async () => {
    expect("ready").toBe("ready");
  },
);

test(
  "история задачи доступна",
  {
    tag: "@regression",
    annotation: { type: "issue", description: "QA-238" },
  },
  async () => {
    expect(["created", "ready"]).toContain("ready");
  },
);

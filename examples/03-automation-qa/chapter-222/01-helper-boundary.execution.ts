import { expect, test } from "@playwright/test";

interface TaskQuery {
  ownerId: string;
  status?: "open" | "closed";
}

function buildTaskSearchParams(query: TaskQuery): URLSearchParams {
  const params = new URLSearchParams({ ownerId: query.ownerId });
  if (query.status) {
    params.set("status", query.status);
  }
  return params;
}

test("оставляет side effect вызывающему коду", async () => {
  const params = buildTaskSearchParams({ ownerId: "qa-222", status: "open" });

  expect(params.toString()).toBe("ownerId=qa-222&status=open");
});

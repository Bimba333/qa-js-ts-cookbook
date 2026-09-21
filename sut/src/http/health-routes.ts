import type { Database } from "../database/database.js";
import { checkReadinessWithClient } from "../health/readiness.js";
import { sendJson } from "./responses.js";
import type { Route } from "./router.js";

const READINESS_TIMEOUT_MS = 6_000;

export function createHealthRoutes(
  verificationDatabase: Database,
): readonly Route[] {
  return Object.freeze([
    {
      method: "GET",
      pattern: "/health/live",
      handler: async (context) => {
        // Liveness отвечает за сам процесс и намеренно не трогает базу:
        // иначе недоступная база выглядела бы как мёртвый процесс.
        sendJson(context.response, 200, {
          status: "PASS",
          capability: "process-liveness",
        });
      },
    },
    {
      method: "GET",
      pattern: "/health/ready",
      handler: async (context) => {
        let timeout: NodeJS.Timeout | undefined;

        try {
          const readiness = await Promise.race([
            verificationDatabase.withClient((client) =>
              checkReadinessWithClient(client),
            ),
            new Promise<never>((_, reject) => {
              timeout = setTimeout(
                () => reject(new Error("Health readiness timeout")),
                READINESS_TIMEOUT_MS,
              );
            }),
          ]);

          sendJson(
            context.response,
            readiness.status === "PASS" ? 200 : 503,
            readiness,
          );
        } catch {
          sendJson(context.response, 503, {
            status: "BLOCKED",
            capability: "sut-foundation",
            checks: [],
          });
        } finally {
          if (timeout) clearTimeout(timeout);
        }
      },
    },
  ]);
}

import { DomainError } from "../domain/errors.js";
import type { AuthService } from "../services/auth-service.js";
import type { WorkItemService } from "../services/work-item-service.js";
import type { Principal } from "../repositories/auth-repository.js";
import {
  bearerToken,
  headerValue,
  readJsonBody,
} from "./request.js";
import { sendJson, sendNoContent } from "./responses.js";
import type { RequestContext, Route } from "./router.js";

export const API_BASE = "/api/v1";

/**
 * Идентификатор теста по умолчанию.
 *
 * Автотест обязан передавать свой идентификатор, но ручное изучение API через
 * curl не должно упираться в обязательный заголовок.
 */
const DEFAULT_CREATOR_TEST_ID = "manual";

export type RestDependencies = Readonly<{
  authService: AuthService;
  workItemService: WorkItemService;
}>;

function creatorTestId(context: RequestContext): string {
  return (
    headerValue(context.request, "x-creator-test-id") ??
    DEFAULT_CREATOR_TEST_ID
  );
}

export function createRestRoutes(
  dependencies: RestDependencies,
): readonly Route[] {
  const { authService, workItemService } = dependencies;

  async function requirePrincipal(
    context: RequestContext,
  ): Promise<Principal> {
    const token = bearerToken(context.request);

    if (!token) {
      throw new DomainError(
        "UNAUTHENTICATED",
        "Требуется заголовок Authorization с bearer token",
      );
    }

    return authService.authenticateBearer(token);
  }

  return Object.freeze([
    {
      method: "POST",
      pattern: `${API_BASE}/auth/token`,
      handler: async (context) => {
        const body = await readJsonBody(context.request);
        const issued = await authService.issueToken(
          body["login"],
          body["password"],
          context.correlationId,
        );

        sendJson(context.response, 200, {
          accessToken: issued.token,
          tokenType: issued.tokenType,
          expiresAt: issued.expiresAt,
          testRunId: issued.testRunId,
          principal: {
            userId: issued.principal.userId,
            login: issued.principal.login,
            role: issued.principal.role,
          },
          correlationId: context.correlationId,
        });
      },
    },
    {
      method: "GET",
      pattern: `${API_BASE}/me`,
      handler: async (context) => {
        const principal = await requirePrincipal(context);

        sendJson(context.response, 200, {
          userId: principal.userId,
          login: principal.login,
          role: principal.role,
          testRunId: principal.testRunId,
          correlationId: context.correlationId,
        });
      },
    },
    {
      method: "POST",
      pattern: `${API_BASE}/work-items`,
      handler: async (context) => {
        const principal = await requirePrincipal(context);
        const body = await readJsonBody(context.request);
        const created = await workItemService.create(
          principal,
          {
            title: body["title"],
            description: body["description"],
            priority: body["priority"],
          },
          creatorTestId(context),
          context.correlationId,
        );

        sendJson(context.response, 201, created);
      },
    },
    {
      method: "GET",
      pattern: `${API_BASE}/work-items`,
      handler: async (context) => {
        const principal = await requirePrincipal(context);
        const query = context.url.searchParams;
        const result = await workItemService.search(principal, {
          status: query.get("status") ?? undefined,
          priority: query.get("priority") ?? undefined,
          ownerId: query.get("ownerId") ?? undefined,
          limit: query.get("limit") ?? undefined,
          offset: query.get("offset") ?? undefined,
        });

        sendJson(context.response, 200, result);
      },
    },
    {
      method: "GET",
      pattern: `${API_BASE}/work-items/:id`,
      handler: async (context) => {
        const principal = await requirePrincipal(context);
        const item = await workItemService.getById(
          principal,
          context.params["id"],
        );

        sendJson(context.response, 200, item);
      },
    },
    {
      method: "PATCH",
      pattern: `${API_BASE}/work-items/:id`,
      handler: async (context) => {
        const principal = await requirePrincipal(context);
        const body = await readJsonBody(context.request);
        const updated = await workItemService.update(
          principal,
          context.params["id"],
          {
            ...("title" in body ? { title: body["title"] } : {}),
            ...("description" in body
              ? { description: body["description"] }
              : {}),
            ...("priority" in body ? { priority: body["priority"] } : {}),
            ...("status" in body ? { status: body["status"] } : {}),
            expectedVersion: body["expectedVersion"],
          },
          context.correlationId,
        );

        sendJson(context.response, 200, updated);
      },
    },
    {
      method: "DELETE",
      pattern: `${API_BASE}/work-items/:id`,
      handler: async (context) => {
        const principal = await requirePrincipal(context);
        await workItemService.delete(
          principal,
          context.params["id"],
          context.correlationId,
        );

        sendNoContent(context.response);
      },
    },
    {
      method: "DELETE",
      pattern: `${API_BASE}/test-runs/current/work-items`,
      handler: async (context) => {
        const principal = await requirePrincipal(context);
        const deletedCount = await workItemService.cleanupCurrentRun(
          principal,
          context.correlationId,
        );

        sendJson(context.response, 200, {
          deletedCount,
          testRunId: principal.testRunId,
          correlationId: context.correlationId,
        });
      },
    },
  ]);
}

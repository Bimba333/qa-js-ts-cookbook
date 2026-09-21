import type { IncomingMessage, ServerResponse } from "node:http";

export type RouteParams = Readonly<Record<string, string>>;

export type RequestContext = Readonly<{
  request: IncomingMessage;
  response: ServerResponse;
  url: URL;
  params: RouteParams;
  correlationId: string;
}>;

export type RouteHandler = (context: RequestContext) => Promise<void>;

export type Route = Readonly<{
  method: "GET" | "POST" | "PATCH" | "DELETE";
  pattern: string;
  handler: RouteHandler;
}>;

export type RouteMatch = Readonly<{
  handler: RouteHandler;
  params: RouteParams;
}>;

function splitPath(pathname: string): readonly string[] {
  return pathname.split("/").filter((segment) => segment.length > 0);
}

function matchPattern(
  pattern: string,
  pathname: string,
): RouteParams | null {
  const patternSegments = splitPath(pattern);
  const pathSegments = splitPath(pathname);

  if (patternSegments.length !== pathSegments.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (const [index, segment] of patternSegments.entries()) {
    const actual = pathSegments[index]!;

    if (segment.startsWith(":")) {
      params[segment.slice(1)] = decodeURIComponent(actual);
      continue;
    }

    if (segment !== actual) {
      return null;
    }
  }

  return Object.freeze(params);
}

export type RouterResult =
  | Readonly<{ outcome: "matched"; match: RouteMatch }>
  | Readonly<{ outcome: "method_not_allowed"; allowed: readonly string[] }>
  | Readonly<{ outcome: "not_found" }>;

/**
 * Ищет обработчик по методу и пути.
 *
 * Несовпадение метода при совпавшем пути отличается от отсутствия маршрута:
 * клиент должен получить 405 со списком допустимых методов, а не 404.
 */
export function resolveRoute(
  routes: readonly Route[],
  method: string,
  pathname: string,
): RouterResult {
  const allowed = new Set<string>();

  for (const route of routes) {
    const params = matchPattern(route.pattern, pathname);
    if (params === null) continue;

    if (route.method === method) {
      return Object.freeze({
        outcome: "matched" as const,
        match: Object.freeze({ handler: route.handler, params }),
      });
    }

    allowed.add(route.method);
  }

  if (allowed.size > 0) {
    return Object.freeze({
      outcome: "method_not_allowed" as const,
      allowed: Object.freeze([...allowed].sort()),
    });
  }

  return Object.freeze({ outcome: "not_found" as const });
}

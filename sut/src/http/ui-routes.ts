import { DomainError, isDomainError } from "../domain/errors.js";
import {
  allowedTransitionsFrom,
  WORK_ITEM_PRIORITIES,
  WORK_ITEM_STATUSES,
  type WorkItem,
  type WorkItemStatus,
} from "../domain/work-item.js";
import type { Principal } from "../repositories/auth-repository.js";
import type { AuthService } from "../services/auth-service.js";
import type { WorkItemService } from "../services/work-item-service.js";
import {
  escapeHtml,
  renderError,
  renderOptions,
  renderPage,
} from "./html.js";
import { headerValue, parseCookies, readFormBody } from "./request.js";
import { sendHtml, sendRedirect, statusForDomainError } from "./responses.js";
import type { RequestContext, Route } from "./router.js";

export const SESSION_COOKIE = "sut_session";

const SESSION_MAX_AGE_SECONDS = 2 * 60 * 60;
const UI_CREATOR_TEST_ID = "ui-session";
const PAGE_SIZE = 20;

export type UiDependencies = Readonly<{
  authService: AuthService;
  workItemService: WorkItemService;
}>;

type SessionContext = Readonly<{
  principal: Principal;
  csrfToken: string;
}>;

function sessionCookieHeader(sessionId: string): string {
  return `${SESSION_COOKIE}=${encodeURIComponent(sessionId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}`;
}

function clearedCookieHeader(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

/**
 * Проверка Origin для state-changing запросов.
 *
 * `SameSite=Lax` — дополнительная защита, а не замена: заголовок проверяется
 * явно, когда браузер его прислал.
 */
function assertSameOrigin(context: RequestContext): void {
  const origin = headerValue(context.request, "origin");
  if (!origin) return;

  if (origin !== context.url.origin) {
    throw new DomainError(
      "PERMISSION_DENIED",
      "Запрос отклонён: источник не совпадает",
    );
  }
}

function assertCsrf(session: SessionContext, form: URLSearchParams): void {
  const provided = form.get("csrfToken") ?? "";

  if (provided.length !== session.csrfToken.length || provided !== session.csrfToken) {
    throw new DomainError("PERMISSION_DENIED", "CSRF-токен недействителен");
  }
}

function renderLoginPage(
  errorMessage: string | undefined,
  login: string,
  status = 200,
): { status: number; html: string } {
  return {
    status,
    html: renderPage({
      title: "Вход",
      body: `
<h1>Вход в систему</h1>
${errorMessage === undefined ? "" : renderError(errorMessage)}
<form class="stacked" method="post" action="/login">
  <label>Логин
    <input name="login" type="text" autocomplete="username" value="${escapeHtml(login)}" required>
  </label>
  <label>Пароль
    <input name="password" type="password" autocomplete="current-password" required>
  </label>
  <div class="actions">
    <button class="primary" type="submit">Войти</button>
  </div>
</form>`,
    }),
  };
}

function renderWorkItemRow(item: WorkItem): string {
  return `<tr>
  <td><a href="/work-items/${escapeHtml(item.id)}">${escapeHtml(item.title)}</a></td>
  <td>${escapeHtml(item.status)}</td>
  <td>${escapeHtml(item.priority)}</td>
  <td>${escapeHtml(item.version)}</td>
</tr>`;
}

export function createUiRoutes(
  dependencies: UiDependencies,
): readonly Route[] {
  const { authService, workItemService } = dependencies;

  async function loadSession(
    context: RequestContext,
  ): Promise<SessionContext | null> {
    const sessionId = parseCookies(context.request)[SESSION_COOKIE];
    if (!sessionId) return null;

    const session = await authService.findSession(sessionId);
    if (!session) return null;

    return Object.freeze({
      principal: Object.freeze({
        userId: session.userId,
        login: session.login,
        role: session.role,
        testRunId: session.testRunId,
        source: "ui" as const,
      }),
      csrfToken: session.csrfToken,
    });
  }

  async function requireSession(
    context: RequestContext,
  ): Promise<SessionContext | null> {
    const session = await loadSession(context);

    if (!session) {
      sendRedirect(context.response, "/login", {
        "set-cookie": clearedCookieHeader(),
      });
      return null;
    }

    return session;
  }

  function page(
    context: RequestContext,
    session: SessionContext,
    title: string,
    body: string,
    status = 200,
  ): void {
    sendHtml(
      context.response,
      status,
      renderPage({
        title,
        body,
        currentUser: {
          login: session.principal.login,
          role: session.principal.role,
        },
        csrfToken: session.csrfToken,
      }),
    );
  }

  /** Доменная ошибка на UI показывается как сообщение страницы, а не как JSON. */
  async function withFormErrors(
    context: RequestContext,
    session: SessionContext,
    title: string,
    render: (errorMessage: string | undefined) => string,
    operation: () => Promise<void>,
  ): Promise<void> {
    try {
      await operation();
    } catch (error) {
      if (!isDomainError(error)) throw error;

      page(
        context,
        session,
        title,
        render(error.message),
        error.code === "VALIDATION_FAILED" ? 400 : 403,
      );
    }
  }

  const routes: readonly Route[] = Object.freeze([
    {
      method: "GET",
      pattern: "/",
      handler: async (context) => {
        sendRedirect(context.response, "/work-items");
      },
    },
    {
      method: "GET",
      pattern: "/login",
      handler: async (context) => {
        const existing = await loadSession(context);
        if (existing) {
          sendRedirect(context.response, "/work-items");
          return;
        }

        const rendered = renderLoginPage(undefined, "");
        sendHtml(context.response, rendered.status, rendered.html);
      },
    },
    {
      method: "POST",
      pattern: "/login",
      handler: async (context) => {
        assertSameOrigin(context);
        const form = await readFormBody(context.request);
        const login = form.get("login") ?? "";

        try {
          const issued = await authService.login(
            login,
            form.get("password") ?? "",
            context.correlationId,
          );

          // Идентификатор сессии всегда новый, поэтому вход выполняет ротацию.
          sendRedirect(context.response, "/work-items", {
            "set-cookie": sessionCookieHeader(issued.sessionId),
          });
        } catch (error) {
          if (!isDomainError(error)) throw error;

          const rendered = renderLoginPage(
            error.message,
            login,
            error.code === "VALIDATION_FAILED" ? 400 : 401,
          );
          sendHtml(context.response, rendered.status, rendered.html);
        }
      },
    },
    {
      method: "POST",
      pattern: "/logout",
      handler: async (context) => {
        assertSameOrigin(context);
        const sessionId = parseCookies(context.request)[SESSION_COOKIE];
        const form = await readFormBody(context.request);
        const session = await loadSession(context);

        if (session) {
          assertCsrf(session, form);
        }

        if (sessionId) {
          await authService.logout(sessionId);
        }

        sendRedirect(context.response, "/login", {
          "set-cookie": clearedCookieHeader(),
        });
      },
    },
    {
      method: "GET",
      pattern: "/work-items",
      handler: async (context) => {
        const session = await requireSession(context);
        if (!session) return;

        const query = context.url.searchParams;
        const status = query.get("status") ?? "";
        const priority = query.get("priority") ?? "";
        const offset = Number(query.get("offset") ?? "0");

        const result = await workItemService.search(session.principal, {
          status: status === "" ? undefined : status,
          priority: priority === "" ? undefined : priority,
          limit: PAGE_SIZE,
          offset: Number.isSafeInteger(offset) && offset >= 0 ? offset : 0,
        });

        const filterQuery = (nextOffset: number): string => {
          const params = new URLSearchParams();
          if (status !== "") params.set("status", status);
          if (priority !== "") params.set("priority", priority);
          if (nextOffset > 0) params.set("offset", String(nextOffset));

          return params.size > 0 ? `?${params.toString()}` : "";
        };

        const table =
          result.items.length === 0
            ? `<p class="empty" data-testid="empty-state">Нет задач, удовлетворяющих условиям фильтра.</p>`
            : `<table>
  <caption>Найдено задач: ${escapeHtml(result.total)}</caption>
  <thead>
    <tr><th scope="col">Заголовок</th><th scope="col">Статус</th><th scope="col">Приоритет</th><th scope="col">Версия</th></tr>
  </thead>
  <tbody>
    ${result.items.map(renderWorkItemRow).join("\n")}
  </tbody>
</table>`;

        const hasPrevious = result.offset > 0;
        const hasNext = result.offset + result.limit < result.total;

        page(
          context,
          session,
          "Задачи",
          `
<h1>Задачи</h1>
<form class="filters" method="get" action="/work-items" aria-label="Фильтр задач">
  <label>Статус
    <select name="status">${renderOptions([...WORK_ITEM_STATUSES], status, "Любой")}</select>
  </label>
  <label>Приоритет
    <select name="priority">${renderOptions([...WORK_ITEM_PRIORITIES], priority, "Любой")}</select>
  </label>
  <button type="submit">Применить фильтр</button>
</form>
<div class="actions"><a href="/work-items/new">Создать задачу</a></div>
${table}
<nav class="pagination" aria-label="Постраничная навигация">
  ${
    hasPrevious
      ? `<a href="/work-items${filterQuery(Math.max(0, result.offset - PAGE_SIZE))}">Назад</a>`
      : `<span>Назад</span>`
  }
  <span data-testid="page-range">${escapeHtml(result.offset + 1)}–${escapeHtml(
    Math.min(result.offset + result.limit, result.total),
  )} из ${escapeHtml(result.total)}</span>
  ${
    hasNext
      ? `<a href="/work-items${filterQuery(result.offset + PAGE_SIZE)}">Вперёд</a>`
      : `<span>Вперёд</span>`
  }
</nav>`,
        );
      },
    },
    {
      method: "GET",
      pattern: "/work-items/new",
      handler: async (context) => {
        const session = await requireSession(context);
        if (!session) return;

        page(
          context,
          session,
          "Новая задача",
          renderCreateForm(session.csrfToken, undefined, "", "", "MEDIUM"),
        );
      },
    },
    {
      method: "POST",
      pattern: "/work-items",
      handler: async (context) => {
        assertSameOrigin(context);
        const session = await requireSession(context);
        if (!session) return;

        const form = await readFormBody(context.request);
        const title = form.get("title") ?? "";
        const description = form.get("description") ?? "";
        const priority = form.get("priority") ?? "MEDIUM";

        await withFormErrors(
          context,
          session,
          "Новая задача",
          (message) =>
            renderCreateForm(
              session.csrfToken,
              message,
              title,
              description,
              priority,
            ),
          async () => {
            assertCsrf(session, form);
            const created = await workItemService.create(
              session.principal,
              { title, description, priority },
              UI_CREATOR_TEST_ID,
              context.correlationId,
            );

            sendRedirect(context.response, `/work-items/${created.id}`);
          },
        );
      },
    },
    {
      method: "GET",
      pattern: "/work-items/:id",
      handler: async (context) => {
        const session = await requireSession(context);
        if (!session) return;

        const item = await workItemService.getById(
          session.principal,
          context.params["id"],
        );
        const mutable =
          item.testRunId !== null &&
          item.ownerId === session.principal.userId &&
          session.principal.role === "tester";

        page(
          context,
          session,
          item.title,
          `
<h1>${escapeHtml(item.title)}</h1>
<dl class="details">
  <dt>Идентификатор</dt><dd data-testid="work-item-id">${escapeHtml(item.id)}</dd>
  <dt>Описание</dt><dd data-testid="work-item-description">${escapeHtml(item.description)}</dd>
  <dt>Статус</dt><dd data-testid="work-item-status">${escapeHtml(item.status)}</dd>
  <dt>Приоритет</dt><dd data-testid="work-item-priority">${escapeHtml(item.priority)}</dd>
  <dt>Версия</dt><dd data-testid="work-item-version">${escapeHtml(item.version)}</dd>
  <dt>Создана</dt><dd>${escapeHtml(item.createdAt)}</dd>
  <dt>Изменена</dt><dd>${escapeHtml(item.updatedAt)}</dd>
</dl>
<div class="actions">
  <a href="/work-items">К списку</a>
  ${
    mutable
      ? `<a href="/work-items/${escapeHtml(item.id)}/edit">Редактировать</a>
         <a href="/work-items/${escapeHtml(item.id)}/delete">Удалить</a>`
      : `<span data-testid="read-only-notice">Запись доступна только для чтения</span>`
  }
</div>`,
        );
      },
    },
    {
      method: "GET",
      pattern: "/work-items/:id/edit",
      handler: async (context) => {
        const session = await requireSession(context);
        if (!session) return;

        const item = await workItemService.getById(
          session.principal,
          context.params["id"],
        );

        page(
          context,
          session,
          "Редактирование",
          renderEditForm(session.csrfToken, item, undefined),
        );
      },
    },
    {
      method: "POST",
      pattern: "/work-items/:id/edit",
      handler: async (context) => {
        assertSameOrigin(context);
        const session = await requireSession(context);
        if (!session) return;

        const form = await readFormBody(context.request);
        const current = await workItemService.getById(
          session.principal,
          context.params["id"],
        );
        const submittedStatus = form.get("status") ?? current.status;

        await withFormErrors(
          context,
          session,
          "Редактирование",
          (message) => renderEditForm(session.csrfToken, current, message),
          async () => {
            assertCsrf(session, form);
            await workItemService.update(
              session.principal,
              current.id,
              {
                title: form.get("title") ?? "",
                description: form.get("description") ?? "",
                priority: form.get("priority") ?? current.priority,
                // Статус передаётся только при фактическом изменении:
                // переход в тот же статус недопустим по доменным правилам.
                ...(submittedStatus === current.status
                  ? {}
                  : { status: submittedStatus }),
                expectedVersion: form.get("expectedVersion") ?? "",
              },
              context.correlationId,
            );

            sendRedirect(context.response, `/work-items/${current.id}`);
          },
        );
      },
    },
    {
      method: "GET",
      pattern: "/work-items/:id/delete",
      handler: async (context) => {
        const session = await requireSession(context);
        if (!session) return;

        const item = await workItemService.getById(
          session.principal,
          context.params["id"],
        );

        page(
          context,
          session,
          "Удаление задачи",
          `
<h1>Удалить задачу?</h1>
<p>Будет удалена задача «${escapeHtml(item.title)}». Действие необратимо.</p>
<form class="stacked" method="post" action="/work-items/${escapeHtml(item.id)}/delete">
  <input type="hidden" name="csrfToken" value="${escapeHtml(session.csrfToken)}">
  <div class="actions">
    <button class="primary" type="submit">Удалить задачу</button>
    <a href="/work-items/${escapeHtml(item.id)}">Отмена</a>
  </div>
</form>`,
        );
      },
    },
    {
      method: "POST",
      pattern: "/work-items/:id/delete",
      handler: async (context) => {
        assertSameOrigin(context);
        const session = await requireSession(context);
        if (!session) return;

        const form = await readFormBody(context.request);
        assertCsrf(session, form);

        await workItemService.delete(
          session.principal,
          context.params["id"],
          context.correlationId,
        );

        sendRedirect(context.response, "/work-items");
      },
    },
  ]);

  /**
   * Доменная ошибка, не обработанная конкретной страницей, превращается в
   * HTML-страницу с тем же статусом. Браузер не должен получать JSON там,
   * где он запрашивал документ.
   */
  return Object.freeze(
    routes.map((route) => ({
      ...route,
      handler: async (context: RequestContext) => {
        try {
          await route.handler(context);
        } catch (error) {
          if (!isDomainError(error) || context.response.headersSent) {
            throw error;
          }

          const session = await loadSession(context);
          sendHtml(
            context.response,
            statusForDomainError(error.code),
            renderPage({
              title: "Ошибка",
              body: `<h1>Не удалось выполнить действие</h1>${renderError(
                error.message,
              )}<div class="actions"><a href="/work-items">К списку</a></div>`,
              currentUser: session
                ? {
                    login: session.principal.login,
                    role: session.principal.role,
                  }
                : undefined,
              csrfToken: session?.csrfToken,
            }),
          );
        }
      },
    })),
  );
}

function renderCreateForm(
  csrfToken: string,
  errorMessage: string | undefined,
  title: string,
  description: string,
  priority: string,
): string {
  return `
<h1>Новая задача</h1>
${errorMessage === undefined ? "" : renderError(errorMessage)}
<form class="stacked" method="post" action="/work-items">
  <input type="hidden" name="csrfToken" value="${escapeHtml(csrfToken)}">
  <label>Заголовок
    <input name="title" type="text" value="${escapeHtml(title)}" maxlength="400">
  </label>
  <label>Описание
    <textarea name="description">${escapeHtml(description)}</textarea>
  </label>
  <label>Приоритет
    <select name="priority">${renderOptions([...WORK_ITEM_PRIORITIES], priority)}</select>
  </label>
  <div class="actions">
    <button class="primary" type="submit">Создать задачу</button>
    <a href="/work-items">Отмена</a>
  </div>
</form>`;
}

function renderEditForm(
  csrfToken: string,
  item: WorkItem,
  errorMessage: string | undefined,
): string {
  const statuses: readonly WorkItemStatus[] = [
    item.status,
    ...allowedTransitionsFrom(item.status),
  ];

  return `
<h1>Редактирование задачи</h1>
${errorMessage === undefined ? "" : renderError(errorMessage)}
<form class="stacked" method="post" action="/work-items/${escapeHtml(item.id)}/edit">
  <input type="hidden" name="csrfToken" value="${escapeHtml(csrfToken)}">
  <input type="hidden" name="expectedVersion" value="${escapeHtml(item.version)}">
  <label>Заголовок
    <input name="title" type="text" value="${escapeHtml(item.title)}" maxlength="400">
  </label>
  <label>Описание
    <textarea name="description">${escapeHtml(item.description)}</textarea>
  </label>
  <label>Приоритет
    <select name="priority">${renderOptions([...WORK_ITEM_PRIORITIES], item.priority)}</select>
  </label>
  <label>Статус
    <select name="status">${renderOptions([...statuses], item.status)}</select>
  </label>
  <div class="actions">
    <button class="primary" type="submit">Сохранить изменения</button>
    <a href="/work-items/${escapeHtml(item.id)}">Отмена</a>
  </div>
</form>`;
}

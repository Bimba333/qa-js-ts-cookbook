const ESCAPE_MAP: Readonly<Record<string, string>> = Object.freeze({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
});

/**
 * Экранирование текста и значений атрибутов.
 *
 * Seed намеренно содержит заголовок с HTML-разметкой, поэтому страница без
 * экранирования сразу выдаёт себя: учебный пример работает как проверка.
 */
export function escapeHtml(value: unknown): string {
  return String(value).replaceAll(/[&<>"']/g, (character) => ESCAPE_MAP[character]!);
}

export type LayoutOptions = Readonly<{
  title: string;
  body: string;
  currentUser?: Readonly<{ login: string; role: string }> | undefined;
  csrfToken?: string | undefined;
}>;

const STYLES = `
  :root { color-scheme: light dark; --line: #d5d8de; --accent: #4f46e5; }
  * { box-sizing: border-box; }
  body {
    margin: 0; font: 16px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif;
    background: Canvas; color: CanvasText;
  }
  header.app-header {
    display: flex; gap: 16px; align-items: center; justify-content: space-between;
    padding: 12px 24px; border-bottom: 1px solid var(--line);
  }
  header.app-header a { color: inherit; }
  main { max-width: 960px; margin: 0 auto; padding: 24px; }
  h1 { font-size: 24px; margin: 0 0 16px; }
  form.stacked { display: grid; gap: 14px; max-width: 520px; }
  label { display: grid; gap: 4px; font-weight: 500; }
  input, select, textarea, button {
    font: inherit; padding: 8px 10px; border: 1px solid var(--line); border-radius: 8px;
    background: Canvas; color: CanvasText;
  }
  textarea { min-height: 110px; resize: vertical; }
  button { cursor: pointer; }
  button.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
  table { border-collapse: collapse; width: 100%; }
  caption { text-align: left; padding-bottom: 8px; color: GrayText; }
  th, td { border-bottom: 1px solid var(--line); padding: 8px; text-align: left; vertical-align: top; }
  .filters { display: flex; gap: 12px; align-items: end; flex-wrap: wrap; margin-bottom: 20px; }
  .filters label { font-weight: 400; }
  .actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; }
  .error {
    border: 1px solid #b42318; background: rgba(180, 35, 24, 0.08);
    color: #b42318; padding: 10px 12px; border-radius: 8px;
  }
  .field-error { color: #b42318; font-weight: 400; font-size: 14px; }
  .empty { padding: 24px; border: 1px dashed var(--line); border-radius: 12px; color: GrayText; }
  dl.details { display: grid; grid-template-columns: max-content 1fr; gap: 8px 20px; }
  dt { color: GrayText; }
  dd { margin: 0; overflow-wrap: anywhere; }
  nav.pagination { display: flex; gap: 12px; margin-top: 16px; align-items: center; }
`;

export function renderPage(options: LayoutOptions): string {
  const user = options.currentUser;

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(options.title)} — Educational Work Items</title>
<style>${STYLES}</style>
</head>
<body>
<header class="app-header">
  <a href="/work-items">Educational Work Items</a>
  ${
    user
      ? `<div>
      <span data-testid="current-user">${escapeHtml(user.login)} (${escapeHtml(user.role)})</span>
      <form method="post" action="/logout" style="display:inline">
        <input type="hidden" name="csrfToken" value="${escapeHtml(options.csrfToken ?? "")}">
        <button type="submit">Выйти</button>
      </form>
    </div>`
      : ""
  }
</header>
<main>
${options.body}
</main>
</body>
</html>`;
}

export function renderError(message: string): string {
  return `<p class="error" role="alert">${escapeHtml(message)}</p>`;
}

export function renderFieldError(message: string | undefined): string {
  return message === undefined
    ? ""
    : `<span class="field-error">${escapeHtml(message)}</span>`;
}

export function renderOptions(
  values: readonly string[],
  selected: string | undefined,
  emptyLabel?: string,
): string {
  const head =
    emptyLabel === undefined
      ? ""
      : `<option value="">${escapeHtml(emptyLabel)}</option>`;

  return (
    head +
    values
      .map(
        (value) =>
          `<option value="${escapeHtml(value)}"${
            value === selected ? " selected" : ""
          }>${escapeHtml(value)}</option>`,
      )
      .join("")
  );
}

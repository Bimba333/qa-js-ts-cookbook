import type { AuthService } from "../services/auth-service.js";
import { escapeHtml, renderPage } from "./html.js";
import { parseCookies, readRawBody } from "./request.js";
import { sendHtml, sendRedirect } from "./responses.js";
import type { RequestContext, Route } from "./router.js";
import { SESSION_COOKIE } from "./ui-routes.js";

/**
 * Учебная площадка для приёмов автоматизации интерфейса.
 *
 * Основные страницы стенда намеренно просты: серверная разметка, никаких
 * скриптов. Но фреймы, всплывающие окна, диалоги браузера и файлы — обычная
 * часть работы SDET, и учиться им негде, если в стенде их нет. Эта страница
 * собирает их в одном месте и ничего не хранит: все операции идут только на
 * чтение состояния стенда.
 */
export type PlaygroundDependencies = Readonly<{
  authService: AuthService;
}>;

const DOWNLOAD_FILE_NAME = "work-items-report.txt";
const DOWNLOAD_CONTENT = [
  "Учебный отчёт",
  "строка 1: login test — passed",
  "строка 2: checkout test — failed",
  "",
].join("\n");

type UploadedFile = Readonly<{
  fieldName: string;
  fileName: string;
  sizeBytes: number;
}>;

/**
 * Минимальный разбор multipart/form-data.
 *
 * Полноценный парсер здесь не нужен и был бы лишним шумом: странице хватает
 * имени файла и его размера. Разбор идёт по байтам, потому что файл не обязан
 * быть текстом, а размер должен совпадать с тем, что отправил браузер.
 */
function parseUploadedFile(
  body: Buffer,
  contentType: string | undefined,
): UploadedFile | null {
  const boundaryMatch = /boundary=(?<boundary>[^;]+)/.exec(contentType ?? "");
  const boundary = boundaryMatch?.groups?.boundary?.trim().replace(/^"|"$/g, "");

  if (boundary === undefined || boundary.length === 0) {
    return null;
  }

  const separator = Buffer.from(`--${boundary}`, "utf8");
  const parts: Buffer[] = [];
  let offset = 0;

  while (offset < body.length) {
    const start = body.indexOf(separator, offset);
    if (start === -1) break;

    const next = body.indexOf(separator, start + separator.length);
    if (next === -1) break;

    parts.push(body.subarray(start + separator.length, next));
    offset = next;
  }

  for (const part of parts) {
    const headerEnd = part.indexOf("\r\n\r\n");
    if (headerEnd === -1) continue;

    const headers = part.subarray(0, headerEnd).toString("utf8");
    const disposition = /filename="(?<fileName>[^"]*)"/.exec(headers);
    if (disposition === null) continue;

    const fieldMatch = /name="(?<fieldName>[^"]*)"/.exec(headers);

    // Между заголовками и содержимым — пустая строка, а в конце части
    // остаётся перевод строки перед следующей границей: он не данные.
    const content = part.subarray(headerEnd + 4, Math.max(headerEnd + 4, part.length - 2));

    return Object.freeze({
      fieldName: fieldMatch?.groups?.fieldName ?? "file",
      fileName: disposition.groups?.fileName ?? "",
      sizeBytes: content.length,
    });
  }

  return null;
}

function playgroundBody(upload: UploadedFile | null): string {
  const uploadResult =
    upload === null
      ? `<p class="empty" data-testid="upload-empty">Файл ещё не загружен.</p>`
      : `<dl data-testid="upload-result">
  <dt>Поле</dt><dd data-testid="upload-field">${escapeHtml(upload.fieldName)}</dd>
  <dt>Имя файла</dt><dd data-testid="upload-name">${escapeHtml(upload.fileName)}</dd>
  <dt>Размер, байт</dt><dd data-testid="upload-size">${escapeHtml(upload.sizeBytes)}</dd>
</dl>`;

  return `
<h1>Учебная площадка</h1>
<p>Страница собирает приёмы, которых нет на остальных экранах стенда: фрейм,
всплывающее окно, диалог браузера и работу с файлами. Данные она не меняет.</p>

<section aria-labelledby="frame-heading">
  <h2 id="frame-heading">Фрейм</h2>
  <p>Внутренний документ живёт отдельно: его элементы недоступны обычному поиску по странице.</p>
  <iframe
    src="/playground/frame"
    title="Учебный фрейм"
    data-testid="training-frame"
    width="100%"
    height="180"
    style="border:1px solid var(--line); border-radius:8px"
  ></iframe>
</section>

<section aria-labelledby="popup-heading">
  <h2 id="popup-heading">Новая вкладка</h2>
  <p>Ссылка открывает отдельную страницу в новой вкладке.</p>
  <p><a href="/playground/popup" target="_blank" rel="noopener" data-testid="popup-link">Открыть отчёт в новой вкладке</a></p>
</section>

<section aria-labelledby="dialog-heading">
  <h2 id="dialog-heading">Диалоги браузера</h2>
  <p>Диалог блокирует страницу, пока его не закроют. Результат появляется ниже.</p>
  <div class="actions">
    <button type="button" data-testid="confirm-button">Подтвердить удаление</button>
    <button type="button" data-testid="prompt-button">Спросить имя прогона</button>
    <button type="button" data-testid="alert-button">Показать сообщение</button>
  </div>
  <p data-testid="dialog-result">Диалог ещё не вызывался</p>
</section>

<section aria-labelledby="files-heading">
  <h2 id="files-heading">Файлы</h2>
  <p>Скачивание отдаёт файл с именем, заданным сервером.</p>
  <p><a href="/playground/download" data-testid="download-link">Скачать отчёт</a></p>

  <form
    class="stacked"
    method="post"
    action="/playground/upload"
    enctype="multipart/form-data"
    aria-label="Загрузка файла"
  >
    <label>Файл отчёта
      <input type="file" name="report" data-testid="file-input">
    </label>
    <button type="submit" class="primary">Загрузить</button>
  </form>

  ${uploadResult}
</section>

<script>
  (function () {
    var result = document.querySelector('[data-testid="dialog-result"]');

    document.querySelector('[data-testid="confirm-button"]').addEventListener('click', function () {
      var accepted = window.confirm('Удалить запись?');
      result.textContent = accepted ? 'Подтверждено' : 'Отменено';
    });

    document.querySelector('[data-testid="prompt-button"]').addEventListener('click', function () {
      var value = window.prompt('Имя прогона', 'run-1');
      result.textContent = value === null ? 'Ввод отменён' : 'Имя прогона: ' + value;
    });

    document.querySelector('[data-testid="alert-button"]').addEventListener('click', function () {
      window.alert('Прогон завершён');
      result.textContent = 'Сообщение закрыто';
    });
  })();
</script>`;
}

function framePage(): string {
  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<title>Учебный фрейм</title>
<style>
  body { margin: 0; padding: 16px; font: 16px/1.5 system-ui, sans-serif; }
  h1 { font-size: 18px; margin: 0 0 8px; }
</style>
</head>
<body>
<h1 data-testid="frame-heading">Содержимое фрейма</h1>
<p data-testid="frame-text">Этот документ загружен отдельно от основной страницы.</p>
<button type="button" data-testid="frame-button">Отметить прочитанным</button>
<p data-testid="frame-result">Не отмечено</p>
<script>
  document.querySelector('[data-testid="frame-button"]').addEventListener('click', function () {
    document.querySelector('[data-testid="frame-result"]').textContent = 'Отмечено';
  });
</script>
</body>
</html>`;
}

export function createPlaygroundRoutes(
  dependencies: PlaygroundDependencies,
): readonly Route[] {
  const { authService } = dependencies;

  async function requireSession(
    context: RequestContext,
  ): Promise<Readonly<{ login: string; role: string; csrfToken: string }> | null> {
    const sessionId = parseCookies(context.request)[SESSION_COOKIE];
    const session = sessionId ? await authService.findSession(sessionId) : null;

    if (!session) {
      sendRedirect(context.response, "/login");
      return null;
    }

    return Object.freeze({
      login: session.login,
      role: session.role,
      csrfToken: session.csrfToken,
    });
  }

  function render(
    context: RequestContext,
    session: Readonly<{ login: string; role: string; csrfToken: string }>,
    upload: UploadedFile | null,
  ): void {
    sendHtml(
      context.response,
      200,
      renderPage({
        title: "Учебная площадка",
        body: playgroundBody(upload),
        currentUser: { login: session.login, role: session.role },
        csrfToken: session.csrfToken,
      }),
    );
  }

  return Object.freeze([
    {
      method: "GET",
      pattern: "/playground",
      handler: async (context) => {
        const session = await requireSession(context);
        if (!session) return;

        render(context, session, null);
      },
    },
    {
      method: "POST",
      pattern: "/playground/upload",
      handler: async (context) => {
        const session = await requireSession(context);
        if (!session) return;

        const body = await readRawBody(context.request);
        const upload = parseUploadedFile(
          body,
          context.request.headers["content-type"],
        );

        render(context, session, upload);
      },
    },
    {
      method: "GET",
      pattern: "/playground/frame",
      handler: async (context) => {
        const session = await requireSession(context);
        if (!session) return;

        sendHtml(context.response, 200, framePage());
      },
    },
    {
      method: "GET",
      pattern: "/playground/popup",
      handler: async (context) => {
        const session = await requireSession(context);
        if (!session) return;

        sendHtml(
          context.response,
          200,
          renderPage({
            title: "Отчёт прогона",
            body: `
<h1 data-testid="popup-heading">Отчёт прогона</h1>
<p data-testid="popup-text">Страница открыта в отдельной вкладке.</p>
<p><a href="/playground">Вернуться на площадку</a></p>`,
            currentUser: { login: session.login, role: session.role },
            csrfToken: session.csrfToken,
          }),
        );
      },
    },
    {
      method: "GET",
      pattern: "/playground/download",
      handler: async (context) => {
        const session = await requireSession(context);
        if (!session) return;

        const payload = Buffer.from(DOWNLOAD_CONTENT, "utf8");

        context.response.writeHead(200, {
          "content-type": "text/plain; charset=utf-8",
          "content-length": payload.length,
          "content-disposition": `attachment; filename="${DOWNLOAD_FILE_NAME}"`,
          "cache-control": "no-store",
        });
        context.response.end(payload);
      },
    },
  ]);
}

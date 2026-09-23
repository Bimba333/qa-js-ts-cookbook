/**
 * Проверяет решение задачи, которую нельзя выполнить в браузере.
 *
 * Такие задачи работают против учебного стенда: SQL-запросы выполняются
 * read-only ролью, а решения уровня API обращаются к публичному REST.
 * Отчёт совпадает по форме с браузерным ранером.
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'

import pg from 'pg'

import { expect } from './book-engine/expect.mjs'

const ROOT = process.cwd()
const TASKS_FILE = path.join(ROOT, '.vitepress', 'tasks.generated.json')
const WORKSPACE = path.join(ROOT, 'my-solutions')

const HTTP_BASE = process.env.SUT_BASE_URL ?? 'http://127.0.0.1:4310'
const GRPC_TARGET = process.env.SUT_GRPC_TARGET ?? '127.0.0.1:4311'
const PROTO_PATH = path.join(ROOT, 'sut/contracts/proto/work_items.proto')
const API_BASE = `${HTTP_BASE}/api/v1`

const DATABASE = {
  host: '127.0.0.1',
  port: Number(process.env.SUT_DB_PORT ?? 55_432),
  database: 'educational_work_items',
  user: 'sut_reader',
  password: 'educational_reader_only',
  application_name: 'qa-book-task-verify'
}

const EXTENSIONS = { sql: 'sql', api: 'mjs', playwright: 'mjs' }

const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor

function loadTasks() {
  if (!fs.existsSync(TASKS_FILE)) {
    console.error('Данные задач не собраны. Выполните: npm run tasks:build')
    process.exit(1)
  }

  return JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'))
}

function findTask(taskId) {
  for (const tasks of Object.values(loadTasks())) {
    const found = tasks.find(task => task.id === taskId)

    if (found) return found
  }

  return undefined
}

function listStandTasks() {
  return Object.values(loadTasks())
    .flat()
    .filter(task => task.runner === 'stand')
}

async function assertStandIsReady() {
  try {
    const response = await fetch(`${HTTP_BASE}/health/ready`)
    const readiness = await response.json()

    if (!response.ok || readiness.status !== 'PASS') {
      throw new Error(JSON.stringify(readiness))
    }
  } catch (error) {
    console.error(
      `\nУчебный стенд не готов (${HTTP_BASE}).\n` +
        'Поднимите его командой:\n\n  npm run sut:up\n\n' +
        `Подробности: ${error instanceof Error ? error.message : String(error)}\n`
    )
    process.exit(1)
  }
}

/** Создаёт файл решения из заготовки, если читатель ещё не начинал. */
function ensureSolutionFile(task) {
  const extension = EXTENSIONS[task.lang] ?? 'mjs'
  const file = path.join(WORKSPACE, `${task.id}.${extension}`)

  if (fs.existsSync(file)) return { file, created: false }

  fs.mkdirSync(WORKSPACE, { recursive: true })
  fs.writeFileSync(file, `${task.starter}\n`, 'utf8')

  return { file, created: true }
}

async function withReaderClient(operation) {
  const client = new pg.Client(DATABASE)

  await client.connect()
  try {
    return await operation(client)
  } finally {
    await client.end()
  }
}

/** Минимальный REST-клиент стенда для решений уровня API. */
async function createApiClient(creatorTestId) {
  const tokenResponse = await fetch(`${API_BASE}/auth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      login: 'educational_tester',
      password: 'educational-tester-password'
    })
  })

  if (!tokenResponse.ok) {
    throw new Error(`Не удалось получить токен: ${tokenResponse.status}`)
  }

  const { accessToken, testRunId } = await tokenResponse.json()
  const headers = {
    authorization: `Bearer ${accessToken}`,
    'content-type': 'application/json',
    'x-creator-test-id': creatorTestId
  }

  const request = async (method, pathname, body) => {
    const response = await fetch(`${API_BASE}${pathname}`, {
      method,
      headers,
      ...(body === undefined ? {} : { body: JSON.stringify(body) })
    })
    const text = await response.text()

    return {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: text.length > 0 ? JSON.parse(text) : null
    }
  }

  return {
    testRunId,
    accessToken,
    get: (pathname) => request('GET', pathname),
    post: (pathname, body) => request('POST', pathname, body),
    patch: (pathname, body) => request('PATCH', pathname, body),
    delete: (pathname) => request('DELETE', pathname),
    cleanup: () => request('DELETE', '/test-runs/current/work-items')
  }
}

async function runSqlTask(task, file, api) {
  const query = fs.readFileSync(file, 'utf8').trim()

  if (query === '' || query === task.starter.trim()) {
    return { skipped: true }
  }

  return withReaderClient(async client => {
    if (!task.transaction) {
      return toSqlContext(await client.query(query), api)
    }

    // Решение может писать: транзакция откатывается всегда, поэтому на общем
    // стенде не остаётся ни строк, ни созданных объектов схемы.
    await client.query('BEGIN')

    try {
      return toSqlContext(await client.query(query), api)
    } finally {
      await client.query('ROLLBACK')
    }
  })
}

/**
 * Приводит результат к одной форме.
 *
 * Запрос из нескольких инструкций возвращает массив результатов — проверкам
 * нужен последний, иначе `rows` оказывается undefined и падает вся задача.
 */
function toSqlContext(result, api) {
  const last = Array.isArray(result) ? result[result.length - 1] : result

  return { rows: last?.rows ?? [], rowCount: last?.rowCount ?? 0, api }
}

/**
 * Готовит данные, без которых проверки не отличат верное решение от неверного.
 *
 * Данные создаются через публичный API и принадлежат отдельному test run,
 * поэтому удаляются вместе с ним.
 */
async function runStandSetup(task, api) {
  if (!task.standSetup) return

  const setup = new AsyncFunction('api', task.standSetup)

  await setup(api)
}

async function runApiTask(task, file, api) {
  const module = await import(`${pathToFileURL(file).href}?t=${Date.now()}`)

  if (typeof module.default !== 'function') {
    throw new Error('Файл решения должен экспортировать функцию по умолчанию')
  }

  // Вторым аргументом идёт адрес стенда: он нужен решениям, которые
  // выполняют запрос в обход подготовленного клиента — например, без токена.
  return { result: await module.default(api, HTTP_BASE), api, baseUrl: HTTP_BASE }
}

/**
 * Выполняет решение уровня gRPC против стенда.
 *
 * Контракт берётся из `sut/contracts/proto` — того же файла, по которому
 * работает сервер, поэтому расхождение клиента и сервера видно сразу.
 *
 * Решение получает готовый client и metadata с токеном, но не получает
 * обёртки над callback: превращение вызова в промис — это и есть тема глав
 * про unary-вызовы, и читатель пишет его сам.
 */
async function runGrpcTask(task, file, api) {
  const module = await import(`${pathToFileURL(file).href}?t=${Date.now()}`)

  if (typeof module.default !== 'function') {
    throw new Error('Файл решения должен экспортировать функцию по умолчанию')
  }

  let grpc
  let protoLoader

  try {
    grpc = await import('@grpc/grpc-js')
    protoLoader = await import('@grpc/proto-loader')
  } catch {
    throw new Error('Пакеты gRPC не установлены. Выполните: npm install')
  }

  const definition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })

  const loaded = grpc.loadPackageDefinition(definition)
  const Service = loaded.qa.educational.workitems.v1.WorkItemService
  const client = new Service(GRPC_TARGET, grpc.credentials.createInsecure())

  const metadata = new grpc.Metadata()
  metadata.set('authorization', `Bearer ${api.accessToken}`)
  metadata.set('creator-test-id', `task.${task.id}`)

  // Канал закрывает вызывающий код: проверки выполняются после решения.
  const dispose = async () => {
    client.close()
  }

  const context = { client, metadata, grpc, token: api.accessToken, target: GRPC_TARGET, api }

  try {
    return {
      result: await module.default(context),
      api,
      grpc,
      client,
      metadata,
      dispose
    }
  } catch (error) {
    await dispose()
    throw error
  }
}

/**
 * Выполняет решение уровня интерфейса в настоящем браузере.
 *
 * Решение получает `page` и `baseUrl`, поэтому работает так же, как обычный
 * UI-тест. Браузер закрывается всегда: иначе процесс проверки не завершится.
 *
 * Важно: данные, созданные через интерфейс, принадлежат test run сессии UI,
 * а не токену API — `api.cleanup()` их не удаляет. Поэтому задачи уровня
 * интерфейса читают состояние, а не создают записи.
 */
async function runPlaywrightTask(task, file, api) {
  const module = await import(`${pathToFileURL(file).href}?t=${Date.now()}`)

  if (typeof module.default !== 'function') {
    throw new Error('Файл решения должен экспортировать функцию по умолчанию')
  }

  let chromium

  try {
    ({ chromium } = await import('@playwright/test'))
  } catch {
    throw new Error('Playwright не установлен. Выполните: npm install')
  }

  const browser = await chromium.launch()
  const browserContext = await browser.newContext({ baseURL: HTTP_BASE })
  const page = await browserContext.newPage()

  // Браузер закрывает вызывающий код: проверки выполняются после решения
  // и должны видеть ту же страницу.
  const dispose = async () => {
    await browserContext.close()
    await browser.close()
  }

  try {
    const result = await module.default({ page, baseUrl: HTTP_BASE, api })

    return { result, api, page, baseUrl: HTTP_BASE, dispose }
  } catch (error) {
    await dispose()
    throw error
  }
}

async function main() {
  const taskId = process.argv[2]

  if (!taskId) {
    const available = listStandTasks()

    console.log('Укажите идентификатор задачи: npm run task:verify <id>\n')
    console.log(
      available.length > 0
        ? `Задачи стенда:\n${available.map(task => `  ${task.id} — ${task.title}`).join('\n')}`
        : 'Задач для стенда пока нет.'
    )
    process.exit(1)
  }

  const task = findTask(taskId)

  if (!task) {
    console.error(`Задача "${taskId}" не найдена. Соберите данные: npm run tasks:build`)
    process.exit(1)
  }

  if (task.runner === 'browser') {
    console.log(
      `Задача "${task.title}" проверяется прямо на странице книги — ` +
        'откройте главу и нажмите «Проверить».'
    )
    return
  }

  await assertStandIsReady()

  const { file, created } = ensureSolutionFile(task)
  const relative = path.relative(ROOT, file)

  if (created) {
    console.log(`Создан файл решения: ${relative}`)
    console.log('Напишите решение и запустите проверку снова.')
    return
  }

  console.log(`Задача: ${task.title}`)
  console.log(`Решение: ${relative}\n`)

  // Текст решения нужен проверкам глав, где предмет урока — форма кода,
  // а не только результат: например, что селекторы живут в page object.
  const solutionSource = fs.readFileSync(file, 'utf8')

  const api = await createApiClient(`task.${task.id}`)
  let context
  let passed = 0

  try {
    await runStandSetup(task, api)

    if (task.lang === 'sql') {
      context = await runSqlTask(task, file, api)
    } else if (task.lang === 'playwright') {
      context = await runPlaywrightTask(task, file, api)
    } else if (task.lang === 'grpc') {
      context = await runGrpcTask(task, file, api)
    } else {
      context = await runApiTask(task, file, api)
    }

    if (context.skipped) {
      console.log('Файл решения ещё не изменён — напишите решение и запустите проверку снова.')
      return
    }

    const query = statement =>
      withReaderClient(client => client.query(statement).then(result => result.rows))

    for (const check of task.tests) {
      try {
        const run = new AsyncFunction(
          'expect',
          'rows',
          'rowCount',
          'result',
          'api',
          'query',
          'baseUrl',
          'page',
          'source',
          'grpc',
          'client',
          'metadata',
          check.code
        )

        await run(
          expect,
          context.rows,
          context.rowCount,
          context.result,
          context.api,
          query,
          context.baseUrl,
          context.page,
          solutionSource,
          context.grpc,
          context.client,
          context.metadata
        )
        console.log(`  ✓  ${check.name}`)
        passed += 1
      } catch (error) {
        console.log(`  ✕  ${check.name}`)
        console.log(`     ${error instanceof Error ? error.message : String(error)}`)
      }
    }
  } catch (error) {
    console.log(`  ОШИБКА  ${error instanceof Error ? error.message : String(error)}`)
    process.exitCode = 1
    return
  } finally {
    // Браузер закрывается до очистки: иначе открытая страница может держать
    // соединение, и процесс проверки не завершится.
    if (context?.dispose) await context.dispose()

    // Данные подготовки и решения принадлежат одному запуску и удаляются
    // вместе с ним — учебная база остаётся в исходном состоянии.
    await api.cleanup()
  }

  console.log(
    passed === task.tests.length
      ? '\nВсе проверки пройдены.'
      : `\nПройдено проверок: ${passed} из ${task.tests.length}.`
  )

  if (passed !== task.tests.length) process.exitCode = 1
}

await main()

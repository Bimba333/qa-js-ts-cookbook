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
    const result = await client.query(query)

    return { rows: result.rows, rowCount: result.rowCount, api }
  })
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

  return { result: await module.default(api), api }
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

  const api = await createApiClient(`task.${task.id}`)
  let context
  let passed = 0

  try {
    await runStandSetup(task, api)

    context =
      task.lang === 'sql'
        ? await runSqlTask(task, file, api)
        : await runApiTask(task, file, api)

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
          check.code
        )

        await run(expect, context.rows, context.rowCount, context.result, context.api, query)
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

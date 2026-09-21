/**
 * Собирает проверяемые задачи в один файл данных.
 *
 * Плагин markdown-it работает синхронно и не может импортировать модули,
 * поэтому задачи заранее сводятся в JSON. Здесь же выполняется проверка
 * формата: ошибка в задаче должна останавливать сборку, а не превращаться
 * в сломанную страницу.
 */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = process.cwd()
const TASKS_DIR = path.join(ROOT, 'tasks')
const OUTPUT = path.join(ROOT, '.vitepress', 'tasks.generated.json')

const DIFFICULTIES = new Set(['easy', 'medium', 'hard'])
const BROWSER_LANGS = new Set(['js', 'ts'])
const STAND_LANGS = new Set(['playwright', 'api', 'sql'])
const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

function fail(message) {
  throw new Error(`Проверяемые задачи: ${message}`)
}

function collectTaskFiles(directory) {
  if (!fs.existsSync(directory)) return []

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap(entry => {
      const full = path.join(directory, entry.name)

      if (entry.isDirectory()) return collectTaskFiles(full)

      return entry.name.endsWith('.tasks.mjs') ? [full] : []
    })
    .sort((left, right) => left.localeCompare(right, 'en'))
}

/** `tasks/01-javascript/07-scope.tasks.mjs` → `01-javascript/07-scope` */
function chapterKeyFromFile(file) {
  return path
    .relative(TASKS_DIR, file)
    .replaceAll(path.sep, '/')
    .replace(/\.tasks\.mjs$/, '')
}

function validateTask(task, chapterKey, seenIds) {
  const where = `${chapterKey}`

  if (typeof task.id !== 'string' || !ID_PATTERN.test(task.id)) {
    fail(`${where}: id должен быть строкой вида "js-07-counter"`)
  }
  if (seenIds.has(task.id)) {
    fail(`${where}: id "${task.id}" уже используется в другой задаче`)
  }
  seenIds.add(task.id)

  for (const field of ['title', 'prompt', 'starter', 'solution']) {
    if (typeof task[field] !== 'string' || task[field].trim() === '') {
      fail(`${where}/${task.id}: поле ${field} обязательно`)
    }
  }

  if (!DIFFICULTIES.has(task.difficulty)) {
    fail(`${where}/${task.id}: difficulty должен быть easy, medium или hard`)
  }

  if (!BROWSER_LANGS.has(task.lang) && !STAND_LANGS.has(task.lang)) {
    fail(`${where}/${task.id}: недопустимый lang "${task.lang}"`)
  }

  if (!Array.isArray(task.tests) || task.tests.length === 0) {
    fail(`${where}/${task.id}: нужна хотя бы одна проверка`)
  }

  for (const [index, check] of task.tests.entries()) {
    if (typeof check?.name !== 'string' || check.name.trim() === '') {
      fail(`${where}/${task.id}: проверка №${index + 1} без имени`)
    }
    if (typeof check?.code !== 'string' || check.code.trim() === '') {
      fail(`${where}/${task.id}: проверка "${check.name}" без кода`)
    }
  }

  const hints = task.hints ?? []
  if (!Array.isArray(hints) || hints.some(hint => typeof hint !== 'string')) {
    fail(`${where}/${task.id}: hints должен быть массивом строк`)
  }

  return {
    id: task.id,
    title: task.title,
    difficulty: task.difficulty,
    lang: task.lang,
    runner: BROWSER_LANGS.has(task.lang) ? 'browser' : 'stand',
    prompt: task.prompt,
    starter: task.starter,
    hints,
    tests: task.tests.map(check => ({ name: check.name, code: check.code })),
    solution: task.solution,
    chapter: chapterKey
  }
}

export async function generateTasks() {
  const files = collectTaskFiles(TASKS_DIR)
  const byChapter = {}
  const seenIds = new Set()
  let total = 0
  let standTotal = 0

  for (const file of files) {
    const chapterKey = chapterKeyFromFile(file)
    const module = await import(pathToFileURL(file).href)
    const exported = module.default

    if (!Array.isArray(exported)) {
      fail(`${chapterKey}: файл должен экспортировать массив задач по умолчанию`)
    }

    const tasks = exported.map(task => validateTask(task, chapterKey, seenIds))

    byChapter[chapterKey] = tasks
    total += tasks.length
    standTotal += tasks.filter(task => task.runner === 'stand').length
  }

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true })
  fs.writeFileSync(OUTPUT, `${JSON.stringify(byChapter, null, 2)}\n`, 'utf8')

  return { chapters: Object.keys(byChapter).length, total, standTotal }
}

const invokedDirectly =
  process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url

if (invokedDirectly) {
  const stats = await generateTasks()

  console.log(`Generated ${path.relative(ROOT, OUTPUT)}`)
  console.log(`- Chapters with tasks: ${stats.chapters}`)
  console.log(`- Checked tasks: ${stats.total}`)
  console.log(`- Of them run against the stand: ${stats.standTotal}`)
}

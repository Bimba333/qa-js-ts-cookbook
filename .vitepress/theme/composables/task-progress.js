import { ref } from 'vue'

/**
 * Прогресс по проверяемым задачам.
 *
 * Хранилище сейчас локальное, но доступ к нему идёт через одну функцию:
 * когда появится учётная запись, синхронизация с сервером заменит реализацию,
 * а вызывающий код останется прежним.
 */
const STORAGE_KEY = 'book:task-progress:v1'

export const TASK_STATUS = Object.freeze({
  notStarted: 'not-started',
  attempted: 'attempted',
  solved: 'solved'
})

const state = ref(null)

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readAll() {
  if (state.value) return state.value
  if (!isBrowser()) {
    state.value = {}
    return state.value
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    state.value = raw ? JSON.parse(raw) : {}
  } catch {
    // Повреждённое или недоступное хранилище не должно ломать страницу:
    // прогресс — вспомогательные данные, а не условие работы задачи.
    state.value = {}
  }

  return state.value
}

function persist() {
  if (!isBrowser()) return

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value ?? {}))
  } catch {
    // Переполненное или отключённое хранилище игнорируется осознанно.
  }
}

export function readTaskProgress(taskId) {
  const all = readAll()

  return all[taskId] ?? { status: TASK_STATUS.notStarted, attempts: 0, hintsUsed: 0 }
}

export function recordAttempt(taskId, { solved, hintsUsed }) {
  const all = readAll()
  const previous = all[taskId] ?? { status: TASK_STATUS.notStarted, attempts: 0, hintsUsed: 0 }

  all[taskId] = {
    // Решённая задача не возвращается в статус «попытка»:
    // читатель уже доказал, что умеет её решать.
    status: solved || previous.status === TASK_STATUS.solved
      ? TASK_STATUS.solved
      : TASK_STATUS.attempted,
    attempts: previous.attempts + 1,
    hintsUsed: Math.max(previous.hintsUsed, hintsUsed ?? 0),
    updatedAt: new Date().toISOString()
  }

  state.value = { ...all }
  persist()

  return all[taskId]
}

export function recordHintUsage(taskId, hintsUsed) {
  const all = readAll()
  const previous = all[taskId] ?? { status: TASK_STATUS.notStarted, attempts: 0, hintsUsed: 0 }

  all[taskId] = { ...previous, hintsUsed: Math.max(previous.hintsUsed, hintsUsed) }
  state.value = { ...all }
  persist()
}

/**
 * Читатель отказался от самостоятельного решения.
 *
 * Отметка нужна не для наказания, а чтобы прогресс отражал правду: задача с
 * открытым решением не равна задаче, решённой самому.
 */
export function recordSurrender(taskId) {
  const all = readAll()
  const previous = all[taskId] ?? { status: TASK_STATUS.notStarted, attempts: 0, hintsUsed: 0 }

  all[taskId] = { ...previous, surrendered: true }
  state.value = { ...all }
  persist()
}

export function progressSummary(taskIds) {
  const all = readAll()
  let solved = 0
  let attempted = 0

  for (const id of taskIds) {
    const status = all[id]?.status

    if (status === TASK_STATUS.solved) solved += 1
    else if (status === TASK_STATUS.attempted) attempted += 1
  }

  return { solved, attempted, total: taskIds.length }
}

export function resetTaskProgress(taskId) {
  const all = readAll()

  delete all[taskId]
  state.value = { ...all }
  persist()
}

/**
 * Снимок всего прогресса.
 *
 * Пока учётной записи нет, единственный способ не потерять решённое при
 * смене браузера — унести снимок с собой. Формат намеренно простой: версия
 * и словарь задач, чтобы будущая синхронизация с сервером приняла те же данные.
 */
export function exportProgress() {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    tasks: { ...readAll() }
  }
}

const KNOWN_STATUSES = new Set(Object.values(TASK_STATUS))

function isValidEntry(entry) {
  return Boolean(entry)
    && typeof entry === 'object'
    && KNOWN_STATUSES.has(entry.status)
}

/**
 * Возвращает снимок в хранилище.
 *
 * Слияние идёт в пользу большего: решённая задача не может стать попыткой,
 * а число попыток не уменьшается. Так импорт старого снимка не откатывает
 * прогресс, сделанный после его создания.
 */
export function importProgress(snapshot) {
  if (!snapshot || typeof snapshot !== 'object' || typeof snapshot.tasks !== 'object') {
    throw new Error('Снимок не похож на прогресс: нет раздела задач')
  }

  const all = readAll()
  let imported = 0
  let skipped = 0

  for (const [taskId, entry] of Object.entries(snapshot.tasks)) {
    if (!isValidEntry(entry)) {
      skipped += 1
      continue
    }

    const previous = all[taskId]

    if (!previous) {
      all[taskId] = { ...entry }
      imported += 1
      continue
    }

    all[taskId] = {
      status: previous.status === TASK_STATUS.solved || entry.status === TASK_STATUS.solved
        ? TASK_STATUS.solved
        : (previous.status === TASK_STATUS.attempted || entry.status === TASK_STATUS.attempted
          ? TASK_STATUS.attempted
          : TASK_STATUS.notStarted),
      attempts: Math.max(previous.attempts ?? 0, entry.attempts ?? 0),
      hintsUsed: Math.max(previous.hintsUsed ?? 0, entry.hintsUsed ?? 0),
      updatedAt: entry.updatedAt ?? previous.updatedAt
    }

    imported += 1
  }

  state.value = { ...all }
  persist()

  return { imported, skipped }
}

/** Статусы всех задач разом: нужен странице прогресса. */
export function readAllProgress() {
  return { ...readAll() }
}

/**
 * Реактивный доступ к тем же данным.
 *
 * Полоса шагов главы живёт на одной странице с задачами, поэтому ей нужно
 * не «прочитать один раз», а видеть изменение сразу после проверки.
 */
export function progressState() {
  readAll()

  return state
}

export function clearAllProgress() {
  state.value = {}
  persist()
}

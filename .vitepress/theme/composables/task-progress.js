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

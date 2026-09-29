/**
 * Доступ к главам книги.
 *
 * Три состояния читателя:
 *   гость       — читает бесплатные главы, прогресс не сохраняется;
 *   вошедший    — читает бесплатные главы, прогресс сохраняется;
 *   подписчик   — читает всё.
 *
 * ВАЖНО И ЧЕСТНО: этот модуль отвечает за то, что читатель ВИДИТ. Пока книга
 * собирается как статический сайт, текст платной главы физически лежит в
 * сборке, и замок в интерфейсе его не скрывает. Настоящее разграничение — это
 * доставка: платные главы не должны попадать в статическую сборку, их отдаёт
 * сервис после проверки права доступа. См. platform/README.md.
 */
import { computed, ref } from 'vue'
import { bookEngineData } from '../../book.generated.mjs'
import { createProvider, readSession, readSettings } from './progress-sync.js'

const ENTITLEMENT_KEY = 'book:entitlement:v1'

export const READER_STATES = Object.freeze({
  guest: 'guest',
  signedIn: 'signed-in',
  subscriber: 'subscriber'
})

const entitlement = ref({ subscribed: false, plan: null, validUntil: null, checkedAt: null })
const signedIn = ref(false)

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readCached() {
  if (!isBrowser()) return null

  try {
    const raw = window.localStorage.getItem(ENTITLEMENT_KEY)

    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeCached(value) {
  if (!isBrowser()) return

  try {
    if (value === null) window.localStorage.removeItem(ENTITLEMENT_KEY)
    else window.localStorage.setItem(ENTITLEMENT_KEY, JSON.stringify(value))
  } catch {
    // Недоступное хранилище не должно ломать чтение книги.
  }
}

function chapterKey(docPath) {
  const key = docPath.startsWith('docs/') ? docPath : `docs/${docPath}`

  return key.endsWith('.md') ? key : `${key}.md`
}

/** Является ли страница главой книги. Прогресс, главная и служебные — нет. */
export function isChapter(docPath) {
  return Object.hasOwn(bookEngineData.chapters, chapterKey(docPath))
}

/**
 * Уровень главы: `free` или `paid`; `null` — страница не является главой.
 *
 * Различие важное: страница прогресса и главная не должны попадать под правила
 * доступа, иначе подписка закроет собственный интерфейс книги.
 */
export function chapterAccess(docPath) {
  const chapter = bookEngineData.chapters[chapterKey(docPath)]

  return chapter ? chapter.access : null
}

/** Сколько глав открыто и сколько закрыто — для главной и страницы подписки. */
export function accessSummary() {
  return {
    free: bookEngineData.statistics.freeChapters,
    paid: bookEngineData.statistics.paidChapters,
    total: bookEngineData.statistics.chapters
  }
}

export const readerState = computed(() => {
  if (entitlement.value.subscribed) return READER_STATES.subscriber
  if (signedIn.value) return READER_STATES.signedIn

  return READER_STATES.guest
})

export const entitlementState = computed(() => entitlement.value)

export function canRead(docPath) {
  const level = chapterAccess(docPath)

  return level !== 'paid' || entitlement.value.subscribed
}

/**
 * Восстанавливает состояние из локального хранилища.
 *
 * Вызывается в `onMounted`: на сервере хранилища нет, а отрендеренная страница
 * не должна расходиться с тем, что увидит читатель.
 */
export function restoreAccess() {
  signedIn.value = readSession() !== null

  const cached = readCached()

  if (cached) entitlement.value = cached
}

/** Спрашивает право доступа у сервиса и запоминает ответ. */
export async function refreshAccess() {
  const session = readSession()

  signedIn.value = session !== null

  if (!session) {
    entitlement.value = { subscribed: false, plan: null, validUntil: null, checkedAt: null }
    writeCached(null)

    return entitlement.value
  }

  const provider = createProvider(readSettings())

  if (typeof provider.entitlement !== 'function') {
    return entitlement.value
  }

  const result = await provider.entitlement(session)
  const next = { ...result, checkedAt: new Date().toISOString() }

  entitlement.value = next
  writeCached(next)

  return next
}

/** Сбрасывает состояние при выходе из учётной записи. */
export function forgetAccess() {
  signedIn.value = false
  entitlement.value = { subscribed: false, plan: null, validUntil: null, checkedAt: null }
  writeCached(null)
}

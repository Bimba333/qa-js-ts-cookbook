/**
 * Синхронизация прогресса с учётной записью.
 *
 * Провайдер — это четыре операции: регистрация, вход, чтение снимка и запись
 * снимка. Всё остальное (слияние, хранение локально, поведение страницы)
 * одинаково, поэтому свой сервис и внешний BaaS отличаются только этим файлом
 * и настройками, а не логикой книги.
 */
import { exportProgress, importProgress } from './task-progress.js'

const SETTINGS_KEY = 'book:sync-settings:v1'
const SESSION_KEY = 'book:sync-session:v1'

export const PROVIDERS = Object.freeze({
  none: 'none',
  service: 'service',
  supabase: 'supabase'
})

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readJson(key, fallback) {
  if (!isBrowser()) return fallback

  try {
    const raw = window.localStorage.getItem(key)

    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  if (!isBrowser()) return

  try {
    if (value === null) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Недоступное хранилище не должно ломать страницу: синхронизация
    // вспомогательная возможность, а не условие работы книги.
  }
}

export function readSettings() {
  return readJson(SETTINGS_KEY, { provider: PROVIDERS.none, baseUrl: '', projectUrl: '', anonKey: '' })
}

export function writeSettings(settings) {
  writeJson(SETTINGS_KEY, settings)
}

export function readSession() {
  return readJson(SESSION_KEY, null)
}

export function writeSession(session) {
  writeJson(SESSION_KEY, session)
}

async function asJson(response) {
  const text = await response.text()

  return text.length > 0 ? JSON.parse(text) : null
}

function failure(body, fallbackMessage) {
  const message = body?.message ?? body?.error_description ?? body?.msg ?? fallbackMessage

  return new Error(message)
}

/** Свой сервис: контракт описан в platform/README.md. */
function createServiceProvider(settings) {
  const base = settings.baseUrl.replace(/\/+$/, '')

  const call = async (method, path, { token, body } = {}) => {
    const response = await fetch(`${base}${path}`, {
      method,
      headers: {
        'content-type': 'application/json',
        ...(token ? { authorization: `Bearer ${token}` } : {})
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) })
    })

    return { ok: response.ok, status: response.status, body: await asJson(response) }
  }

  const authenticate = async (path, email, password) => {
    const result = await call('POST', path, { body: { email, password } })

    if (!result.ok) throw failure(result.body, 'Сервис отклонил запрос')

    return { token: result.body.token, email: result.body.user.email }
  }

  return {
    register: (email, password) => authenticate('/api/v1/auth/register', email, password),
    signIn: (email, password) => authenticate('/api/v1/auth/login', email, password),

    async signOut(session) {
      await call('POST', '/api/v1/auth/logout', { token: session.token })
    },

    async pull(session) {
      const result = await call('GET', '/api/v1/progress', { token: session.token })

      if (!result.ok) throw failure(result.body, 'Не удалось прочитать прогресс')

      return result.body.tasks ?? {}
    },

    async push(session, tasks) {
      const result = await call('PUT', '/api/v1/progress', { token: session.token, body: { tasks } })

      if (!result.ok) throw failure(result.body, 'Не удалось сохранить прогресс')

      return result.body.tasks ?? {}
    }
  }
}

/**
 * Supabase: тот же контракт поверх готового сервиса.
 *
 * Слияние здесь делает клиент — своего кода на стороне Supabase нет. Правило
 * то же самое, поэтому результат совпадает с собственным сервисом.
 */
function createSupabaseProvider(settings) {
  const base = settings.projectUrl.replace(/\/+$/, '')
  const key = settings.anonKey

  const authCall = async (path, body) => {
    const response = await fetch(`${base}/auth/v1/${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: key },
      body: JSON.stringify(body)
    })

    const payload = await asJson(response)

    if (!response.ok) throw failure(payload, 'Supabase отклонил запрос')

    if (!payload?.access_token) {
      throw new Error('Supabase не вернул токен: возможно, требуется подтверждение адреса')
    }

    return { token: payload.access_token, email: payload.user?.email ?? body.email }
  }

  const restHeaders = session => ({
    apikey: key,
    authorization: `Bearer ${session.token}`,
    'content-type': 'application/json'
  })

  return {
    register: (email, password) => authCall('signup', { email, password }),
    signIn: (email, password) => authCall('token?grant_type=password', { email, password }),

    async signOut(session) {
      await fetch(`${base}/auth/v1/logout`, { method: 'POST', headers: restHeaders(session) })
    },

    async pull(session) {
      const response = await fetch(`${base}/rest/v1/progress?select=tasks`, {
        headers: restHeaders(session)
      })

      const payload = await asJson(response)

      if (!response.ok) throw failure(payload, 'Не удалось прочитать прогресс')

      return payload?.[0]?.tasks ?? {}
    },

    async push(session, tasks) {
      const response = await fetch(`${base}/rest/v1/progress`, {
        method: 'POST',
        headers: { ...restHeaders(session), prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify([{ tasks }])
      })

      const payload = await asJson(response)

      if (!response.ok) throw failure(payload, 'Не удалось сохранить прогресс')

      return payload?.[0]?.tasks ?? tasks
    }
  }
}

export function createProvider(settings) {
  if (settings.provider === PROVIDERS.service) {
    if (!settings.baseUrl) throw new Error('Не задан адрес сервиса')

    return createServiceProvider(settings)
  }

  if (settings.provider === PROVIDERS.supabase) {
    if (!settings.projectUrl || !settings.anonKey) {
      throw new Error('Не заданы адрес проекта или публичный ключ')
    }

    return createSupabaseProvider(settings)
  }

  throw new Error('Синхронизация выключена')
}

/**
 * Один проход синхронизации.
 *
 * Порядок важен: сначала забрать снимок с сервера и слить его с локальным,
 * потом отправить результат. Обратный порядок потерял бы то, что читатель
 * решил на другом устройстве, между чтением и записью.
 */
export async function syncNow(settings, session) {
  const provider = createProvider(settings)

  const remote = await provider.pull(session)
  const afterPull = importProgress({ version: 1, tasks: remote })

  const local = exportProgress()
  const stored = await provider.push(session, local.tasks)

  const afterPush = importProgress({ version: 1, tasks: stored })

  return {
    pulled: afterPull.imported,
    pushed: Object.keys(local.tasks).length,
    total: Object.keys(stored).length,
    skipped: afterPull.skipped + afterPush.skipped
  }
}

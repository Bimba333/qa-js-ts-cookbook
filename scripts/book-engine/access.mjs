import path from 'node:path'
import { pathToFileURL } from 'node:url'

const CONFIG_FILE = 'book.access.mjs'

/** Читает файл уровней доступа. Отсутствие файла — не ошибка: тогда всё открыто. */
export async function loadAccessConfig(root = process.cwd()) {
  const file = path.join(root, CONFIG_FILE)

  try {
    const module = await import(pathToFileURL(file).href)
    const config = module.default ?? {}

    return {
      fallback: config.fallback === 'free' ? 'free' : 'paid',
      rules: Array.isArray(config.rules) ? config.rules : [],
      preview: Number.isInteger(config.preview) ? config.preview : 0
    }
  } catch (error) {
    if (error.code === 'ERR_MODULE_NOT_FOUND') {
      return { fallback: 'free', rules: [], preview: 0 }
    }

    throw error
  }
}

/** Приводит `docs/01-javascript/07-scope.md` к `01-javascript/07-scope`. */
export function toChapterKey(docPath) {
  return docPath.replace(/^docs\//, '').replace(/\.md$/, '')
}

/**
 * Уровень доступа главы. Правила проверяются в порядке объявления, побеждает
 * первое подходящее — поэтому точечное исключение ставят выше общего правила.
 */
export function resolveAccess(docPath, config) {
  const key = toChapterKey(docPath)
  const part = key.split('/')[0]

  for (const rule of config.rules) {
    const byPart = Array.isArray(rule.parts) && rule.parts.includes(part)
    const byChapter = Array.isArray(rule.chapters) && rule.chapters.includes(key)

    if (byPart || byChapter) {
      return rule.level === 'free' ? 'free' : 'paid'
    }
  }

  return config.fallback
}

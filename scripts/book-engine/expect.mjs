/**
 * Проверки для задач, выполняемых локально.
 *
 * Сообщения совпадают с браузерным ранером: читатель видит один и тот же
 * текст независимо от того, где решает задачу.
 */
export function format(value) {
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'undefined') return 'undefined'
  if (typeof value === 'function') return `function ${value.name || 'anonymous'}`
  if (value instanceof Error) return `${value.name}: ${value.message}`

  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

export function deepEqual(left, right) {
  if (Object.is(left, right)) return true
  if (typeof left !== typeof right) return false
  if (left === null || right === null) return false
  if (typeof left !== 'object') return false
  if (Array.isArray(left) !== Array.isArray(right)) return false
  if (left instanceof Date && right instanceof Date) {
    return left.getTime() === right.getTime()
  }

  const leftKeys = Object.keys(left)
  const rightKeys = Object.keys(right)
  if (leftKeys.length !== rightKeys.length) return false

  return leftKeys.every(
    key => Object.hasOwn(right, key) && deepEqual(left[key], right[key])
  )
}

function failure(message) {
  throw new Error(message)
}

export function expect(actual) {
  return {
    toBe(expected) {
      if (!Object.is(actual, expected)) {
        failure(`ожидалось ${format(expected)}, получено ${format(actual)}`)
      }
    },
    toEqual(expected) {
      if (!deepEqual(actual, expected)) {
        failure(`ожидалось ${format(expected)}, получено ${format(actual)}`)
      }
    },
    toBeTruthy() {
      if (!actual) failure(`ожидалось истинное значение, получено ${format(actual)}`)
    },
    toBeFalsy() {
      if (actual) failure(`ожидалось ложное значение, получено ${format(actual)}`)
    },
    toBeUndefined() {
      if (actual !== undefined) failure(`ожидалось undefined, получено ${format(actual)}`)
    },
    toBeNull() {
      if (actual !== null) failure(`ожидалось null, получено ${format(actual)}`)
    },
    toBeGreaterThan(expected) {
      if (!(actual > expected)) {
        failure(`ожидалось значение больше ${format(expected)}, получено ${format(actual)}`)
      }
    },
    toBeLessThan(expected) {
      if (!(actual < expected)) {
        failure(`ожидалось значение меньше ${format(expected)}, получено ${format(actual)}`)
      }
    },
    toHaveLength(expected) {
      if (actual?.length !== expected) {
        failure(`ожидалась длина ${expected}, получено ${format(actual?.length)}`)
      }
    },
    toContain(expected) {
      const ok =
        typeof actual === 'string' || Array.isArray(actual) ? actual.includes(expected) : false

      if (!ok) failure(`ожидалось, что ${format(actual)} содержит ${format(expected)}`)
    },
    toMatch(pattern) {
      if (!pattern.test(String(actual))) {
        failure(`значение ${format(actual)} не соответствует ${String(pattern)}`)
      }
    }
  }
}

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'

import {
  readTaskProgress,
  recordAttempt,
  recordHintUsage,
  resetTaskProgress,
  TASK_STATUS
} from '../composables/task-progress.js'

const props = defineProps({
  taskB64: { type: String, required: true }
})

const { lang } = useData()
const isEn = computed(() => String(lang.value || '').toLowerCase().startsWith('en'))

const T = {
  check: () => (isEn.value ? '✓ Check' : '✓ Проверить'),
  checking: () => (isEn.value ? '⏳ Checking…' : '⏳ Проверяем…'),
  reset: () => (isEn.value ? '↺ Reset' : '↺ Сбросить'),
  hint: () => (isEn.value ? '💡 Hint' : '💡 Подсказка'),
  showSolution: () => (isEn.value ? 'Show solution' : 'Показать решение'),
  hideSolution: () => (isEn.value ? 'Hide solution' : 'Скрыть решение'),
  solutionTitle: () => (isEn.value ? 'Reference solution' : 'Эталонное решение'),
  solved: () => (isEn.value ? 'Solved' : 'Решена'),
  attempted: () => (isEn.value ? 'In progress' : 'Есть попытки'),
  notStarted: () => (isEn.value ? 'Not started' : 'Не начата'),
  allPassed: () => (isEn.value ? 'All checks passed.' : 'Все проверки пройдены.'),
  somePassed: (ok, total) =>
    isEn.value ? `${ok} of ${total} checks passed.` : `Пройдено проверок: ${ok} из ${total}.`,
  output: () => (isEn.value ? 'Output' : 'Вывод'),
  fatal: () => (isEn.value ? 'The code could not run.' : 'Код не удалось выполнить.'),
  timeout: () =>
    isEn.value
      ? 'Checking took too long. The code may contain an infinite loop.'
      : 'Проверка выполняется слишком долго. Возможно, в коде бесконечный цикл.',
  syntax: message => (isEn.value ? `Syntax error: ${message}` : `Ошибка синтаксиса: ${message}`),
  standTitle: () =>
    isEn.value ? '💻 This task runs against the local stand' : '💻 Задача выполняется на локальном стенде',
  standBody: () =>
    isEn.value
      ? 'Start the stand, write your solution locally and check it with the command below.'
      : 'Поднимите стенд, напишите решение локально и проверьте его командой ниже.',
  difficulty: value =>
    ({
      easy: isEn.value ? 'easy' : 'простая',
      medium: isEn.value ? 'medium' : 'средняя',
      hard: isEn.value ? 'hard' : 'сложная'
    })[value] ?? value,
  hintsLeft: count =>
    isEn.value ? `${count} hint(s) left` : `Подсказок осталось: ${count}`,
  solutionLocked: () =>
    isEn.value
      ? 'Try solving it yourself first — the solution opens after a check run.'
      : 'Сначала попробуйте решить сами — решение откроется после проверки.'
}

const RUN_TIMEOUT_MS = 5000

const task = computed(() => {
  const binary = atob(props.taskB64)
  const bytes = Uint8Array.from(binary, character => character.charCodeAt(0))

  return JSON.parse(new TextDecoder().decode(bytes))
})

const source = ref('')
const results = ref([])
const consoleOutput = ref('')
const fatalError = ref('')
const running = ref(false)
const revealedHints = ref(0)
const solutionVisible = ref(false)
const status = ref(TASK_STATUS.notStarted)
const attempts = ref(0)
let timeoutId = 0
let worker = null
let workerUrl = ''

watch(
  task,
  value => {
    source.value = value.starter
    results.value = []
    consoleOutput.value = ''
    fatalError.value = ''
    revealedHints.value = 0
    solutionVisible.value = false
  },
  { immediate: true }
)

onMounted(() => {
  const saved = readTaskProgress(task.value.id)

  status.value = saved.status
  attempts.value = saved.attempts
  revealedHints.value = saved.hintsUsed ?? 0
})

const isStandTask = computed(() => task.value.runner === 'stand')
const passedCount = computed(() => results.value.filter(item => item.ok).length)
const allPassed = computed(
  () => results.value.length > 0 && passedCount.value === results.value.length
)
const hintsLeft = computed(() => Math.max(0, task.value.hints.length - revealedHints.value))
const canRevealSolution = computed(
  () => status.value === TASK_STATUS.solved || attempts.value > 0
)

const statusLabel = computed(() => {
  if (status.value === TASK_STATUS.solved) return T.solved()
  if (status.value === TASK_STATUS.attempted) return T.attempted()

  return T.notStarted()
})

function clearRunTimeout() {
  if (timeoutId) {
    window.clearTimeout(timeoutId)
    timeoutId = 0
  }
}

/**
 * Проверка выполняется в Web Worker.
 *
 * У worker собственный поток, поэтому бесконечный цикл в коде читателя не
 * блокирует страницу: основной поток остаётся живым и может прервать
 * выполнение по таймауту.
 */
function terminateWorker() {
  if (worker) {
    worker.terminate()
    worker = null
  }

  if (workerUrl) {
    URL.revokeObjectURL(workerUrl)
    workerUrl = ''
  }
}

function revealHint() {
  if (hintsLeft.value === 0) return

  revealedHints.value += 1
  recordHintUsage(task.value.id, revealedHints.value)
}

function resetTask() {
  clearRunTimeout()
  source.value = task.value.starter
  results.value = []
  consoleOutput.value = ''
  fatalError.value = ''
  solutionVisible.value = false
  running.value = false
  terminateWorker()
  resetTaskProgress(task.value.id)
  status.value = TASK_STATUS.notStarted
  attempts.value = 0
  revealedHints.value = 0
}

function buildHarness() {
  return `
    const send = (type, value) => postMessage({ type, value })

    const format = value => {
      if (typeof value === 'string') return JSON.stringify(value)
      if (typeof value === 'undefined') return 'undefined'
      if (typeof value === 'function') return 'function ' + (value.name || 'anonymous')
      if (value instanceof Error) return value.name + ': ' + value.message
      try { return JSON.stringify(value) } catch { return String(value) }
    }

    const deepEqual = (left, right) => {
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

      return leftKeys.every(key =>
        Object.prototype.hasOwnProperty.call(right, key) && deepEqual(left[key], right[key])
      )
    }

    const failure = message => { throw new Error(message) }

    function expect(actual) {
      return {
        toBe(expected) {
          if (!Object.is(actual, expected)) {
            failure('ожидалось ' + format(expected) + ', получено ' + format(actual))
          }
        },
        toEqual(expected) {
          if (!deepEqual(actual, expected)) {
            failure('ожидалось ' + format(expected) + ', получено ' + format(actual))
          }
        },
        toBeTruthy() {
          if (!actual) failure('ожидалось истинное значение, получено ' + format(actual))
        },
        toBeFalsy() {
          if (actual) failure('ожидалось ложное значение, получено ' + format(actual))
        },
        toBeUndefined() {
          if (actual !== undefined) failure('ожидалось undefined, получено ' + format(actual))
        },
        toBeNull() {
          if (actual !== null) failure('ожидалось null, получено ' + format(actual))
        },
        toBeGreaterThan(expected) {
          if (!(actual > expected)) {
            failure('ожидалось значение больше ' + format(expected) + ', получено ' + format(actual))
          }
        },
        toBeLessThan(expected) {
          if (!(actual < expected)) {
            failure('ожидалось значение меньше ' + format(expected) + ', получено ' + format(actual))
          }
        },
        toBeCloseTo(expected, precision = 2) {
          if (Math.abs(actual - expected) >= Math.pow(10, -precision) / 2) {
            failure('ожидалось примерно ' + format(expected) + ', получено ' + format(actual))
          }
        },
        toHaveLength(expected) {
          if (actual?.length !== expected) {
            failure('ожидалась длина ' + expected + ', получено ' + format(actual?.length))
          }
        },
        toContain(expected) {
          const ok = typeof actual === 'string' || Array.isArray(actual)
            ? actual.includes(expected)
            : false
          if (!ok) failure('ожидалось, что ' + format(actual) + ' содержит ' + format(expected))
        },
        toMatch(pattern) {
          if (!pattern.test(String(actual))) {
            failure('значение ' + format(actual) + ' не соответствует ' + String(pattern))
          }
        },
        toThrow(expected) {
          if (typeof actual !== 'function') failure('toThrow ожидает функцию')
          try {
            actual()
          } catch (error) {
            if (expected instanceof RegExp && !expected.test(error.message)) {
              failure('сообщение ошибки ' + format(error.message) + ' не соответствует ' + String(expected))
            }
            return
          }
          failure('ожидалось исключение, но его не было')
        }
      }
    }

    const write = (...args) => send('log', args.map(
      value => typeof value === 'string' ? value : format(value)
    ).join(' '))

    self.console = { log: write, info: write, warn: write, error: write, table: write }
  `
}

function buildScript(userCode, checks) {
  const blocks = checks
    .map(
      (check, index) => `
  try {
${check.code}
    __results.push({ index: ${index}, ok: true })
  } catch (error) {
    __results.push({ index: ${index}, ok: false, message: (error && error.message) || String(error) })
  }`
    )
    .join('\n')

  return `
(async () => {
${userCode}

const __results = []
${blocks}
send('result', __results)
})().catch(error => send('fatal', (error && error.message) || String(error)))
`
}

async function prepareScript(script) {
  if (task.value.lang !== 'ts') return script

  const { transform } = await import('sucrase')

  return transform(script, { transforms: ['typescript'] }).code
}

function handleMessage(event) {
  const message = event.data

  if (!message || typeof message.type !== 'string') {
    return
  }

  if (message.type === 'log') {
    consoleOutput.value = consoleOutput.value
      ? `${consoleOutput.value}\n${message.value}`
      : message.value
    return
  }

  if (message.type === 'fatal') {
    fatalError.value = message.value || T.fatal()
    finishRun(false)
    return
  }

  if (message.type === 'result') {
    results.value = task.value.tests.map((check, index) => {
      const outcome = message.value.find(item => item.index === index)

      return {
        name: check.name,
        ok: Boolean(outcome?.ok),
        message: outcome?.message ?? ''
      }
    })

    finishRun(results.value.every(item => item.ok))
  }
}

function finishRun(solved) {
  clearRunTimeout()
  running.value = false
  terminateWorker()

  const saved = recordAttempt(task.value.id, {
    solved,
    hintsUsed: revealedHints.value
  })

  status.value = saved.status
  attempts.value = saved.attempts
}

async function runCheck() {
  clearRunTimeout()
  results.value = []
  consoleOutput.value = ''
  fatalError.value = ''
  terminateWorker()
  running.value = true

  let script = ''

  try {
    script = await prepareScript(buildScript(source.value, task.value.tests))
  } catch (error) {
    running.value = false
    fatalError.value = T.syntax(error.message || String(error))
    finishRun(false)
    return
  }

  await nextTick()

  const blob = new Blob([`${buildHarness()}\n${script}`], {
    type: 'text/javascript'
  })

  workerUrl = URL.createObjectURL(blob)
  worker = new Worker(workerUrl)
  worker.onmessage = handleMessage
  worker.onerror = event => {
    fatalError.value = event.message || T.fatal()
    finishRun(false)
  }

  timeoutId = window.setTimeout(() => {
    // Worker прерывается принудительно: сам он остановиться уже не может.
    terminateWorker()
    running.value = false
    fatalError.value = T.timeout()
    recordAttemptAfterTimeout()
  }, RUN_TIMEOUT_MS)
}

function recordAttemptAfterTimeout() {
  const saved = recordAttempt(task.value.id, {
    solved: false,
    hintsUsed: revealedHints.value
  })

  status.value = saved.status
  attempts.value = saved.attempts
}

onBeforeUnmount(() => {
  clearRunTimeout()
  terminateWorker()
})
</script>

<template>
  <section class="code-task" :class="`code-task--${status}`">
    <header class="code-task__header">
      <div class="code-task__title">{{ task.title }}</div>
      <div class="code-task__badges">
        <span class="code-task__badge">{{ T.difficulty(task.difficulty) }}</span>
        <span class="code-task__badge code-task__badge--status">{{ statusLabel }}</span>
      </div>
    </header>

    <p class="code-task__prompt">{{ task.prompt }}</p>

    <template v-if="isStandTask">
      <div class="code-task__stand">
        <strong>{{ T.standTitle() }}</strong>
        <p>{{ T.standBody() }}</p>
        <pre><code>npm run sut:up
npm run task:verify {{ task.id }}</code></pre>
      </div>
      <pre class="code-task__starter"><code>{{ task.starter }}</code></pre>
    </template>

    <template v-else>
      <textarea
        v-model="source"
        class="code-task__editor"
        spellcheck="false"
        :aria-label="task.title"
        rows="12"
      ></textarea>

      <div class="code-task__actions">
        <button class="code-task__button code-task__button--primary" :disabled="running" @click="runCheck">
          {{ running ? T.checking() : T.check() }}
        </button>
        <button class="code-task__button" @click="resetTask">{{ T.reset() }}</button>
        <button
          v-if="task.hints.length"
          class="code-task__button"
          :disabled="hintsLeft === 0"
          @click="revealHint"
        >
          {{ T.hint() }}
          <span v-if="hintsLeft" class="code-task__hint-count">{{ hintsLeft }}</span>
        </button>
      </div>

      <ol v-if="revealedHints" class="code-task__hints">
        <li v-for="hint in task.hints.slice(0, revealedHints)" :key="hint">{{ hint }}</li>
      </ol>

      <p v-if="fatalError" class="code-task__fatal" role="alert">{{ fatalError }}</p>

      <div v-if="results.length" class="code-task__results">
        <p class="code-task__summary" :class="{ 'code-task__summary--ok': allPassed }">
          {{ allPassed ? T.allPassed() : T.somePassed(passedCount, results.length) }}
        </p>
        <ul>
          <li
            v-for="result in results"
            :key="result.name"
            :class="result.ok ? 'is-passed' : 'is-failed'"
          >
            <span class="code-task__mark">{{ result.ok ? '✓' : '✕' }}</span>
            <span class="code-task__check-name">{{ result.name }}</span>
            <span v-if="!result.ok && result.message" class="code-task__check-message">
              {{ result.message }}
            </span>
          </li>
        </ul>
      </div>

      <div v-if="consoleOutput" class="code-task__output">
        <div class="code-task__output-title">{{ T.output() }}</div>
        <pre><code>{{ consoleOutput }}</code></pre>
      </div>

      <div class="code-task__solution">
        <button
          v-if="canRevealSolution"
          class="code-task__button code-task__button--link"
          @click="solutionVisible = !solutionVisible"
        >
          {{ solutionVisible ? T.hideSolution() : T.showSolution() }}
        </button>
        <p v-else class="code-task__solution-locked">{{ T.solutionLocked() }}</p>

        <div v-if="solutionVisible" class="code-task__solution-body">
          <div class="code-task__output-title">{{ T.solutionTitle() }}</div>
          <pre><code>{{ task.solution }}</code></pre>
        </div>
      </div>

    </template>
  </section>
</template>

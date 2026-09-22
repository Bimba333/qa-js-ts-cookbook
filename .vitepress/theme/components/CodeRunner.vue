<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()
const isEn = computed(() => String(lang.value || '').toLowerCase().startsWith('en'))

// Строки интерфейса запускалки — переключаются по локали страницы.
const T = {
  localBadge: () => (isEn.value ? '💻 Run locally' : '💻 Для локального запуска'),
  run: () => (isEn.value ? '▶ Run' : '▶ Запустить'),
  running: () => (isEn.value ? '⏳ Running…' : '⏳ Выполняется…'),
  reset: () => (isEn.value ? '↺ Reset' : '↺ Сбросить'),
  result: () => (isEn.value ? 'Result' : 'Результат'),
  errorTitle: () => (isEn.value ? 'Error' : 'Ошибка'),
  nodeNote: () => (isEn.value
    ? '⚙️ This example uses Node.js APIs, so it does not run in the browser. Try running it locally in Node.js — the expected output is discussed in the chapter text.'
    : '⚙️ Этот пример использует Node.js API, поэтому в браузере он не выполняется. Попробуйте запустить его локально в Node.js — ожидаемый вывод разобран в тексте главы.'),
  intentionalNote: () => (isEn.value
    ? '✓ This is intended: the example deliberately demonstrates an error — see the walkthrough in the chapter text.'
    : '✓ Так и задумано: этот пример намеренно демонстрирует ошибку — разбор смотрите в тексте главы.'),
  noOutput: () => (isEn.value ? 'Code ran with no output.' : 'Код выполнен без вывода.'),
  runtimeError: () => (isEn.value ? 'Execution error.' : 'Ошибка выполнения.'),
  nodeOnlyError: () => (isEn.value
    ? 'This code uses import, require or Node.js APIs — they are not available in the browser sandbox. Remove them and try again.'
    : 'Этот код использует import, require или Node.js API — в песочнице браузера они недоступны. Уберите их и попробуйте снова.'),
  syntaxError: message => (isEn.value ? `Syntax error: ${message}` : `Ошибка синтаксиса: ${message}`),
  timeoutError: () => (isEn.value
    ? 'The code is taking too long. It may contain an infinite loop.'
    : 'Код выполняется слишком долго. Возможно, в нем бесконечный цикл.')
}

const RUN_TIMEOUT_MS = 5000
// После синхронного завершения скрипта ждем отложенный вывод:
// setTimeout, промисы и другие задачи event loop из учебных примеров.
const ASYNC_GRACE_MS = 1500

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  sourceB64: {
    type: String,
    required: true
  },
  lang: {
    type: String,
    default: 'js'
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const output = ref('')
const error = ref('')
const running = ref(false)
const editableSource = ref('')
let timeoutId = 0
let graceTimeoutId = 0
let worker = null
let workerUrl = ''

const initialSource = computed(() => {
  const binary = atob(props.sourceB64)
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))

  return new TextDecoder().decode(bytes)
})

const displayedSource = computed(() => {
  return props.readonly ? initialSource.value : editableSource.value || initialSource.value
})

const isNodeOnly = computed(() => isNodeOnlySource(displayedSource.value))

// Учебные примеры, которые намеренно завершаются ошибкой.
const isIntentionalError = computed(() =>
  /INTENTIONAL|EDUCATIONAL INVALID|намеренно (выбрасывает|содержит|демонстрирует)/i.test(initialSource.value)
)

watch(initialSource, source => {
  if (!props.readonly) {
    editableSource.value = source
  }
}, { immediate: true })

function isNodeOnlySource(source) {
  return /(^|\W)(process|__dirname|__filename)(\W|$)/.test(source) ||
    /(^|\W)require\s*\(/.test(source) ||
    /^\s*import\s/m.test(source) ||
    /^\s*export\s+\{?[\w\s,*]*\}?\s+from\s/m.test(source)
}

function hasExportStatements(source) {
  return /^\s*export\s/m.test(source)
}

function clearTimeoutIfNeeded() {
  if (timeoutId) {
    window.clearTimeout(timeoutId)
    timeoutId = 0
  }

  if (graceTimeoutId) {
    window.clearTimeout(graceTimeoutId)
    graceTimeoutId = 0
  }
}

function finalizeRun() {
  clearTimeoutIfNeeded()
  running.value = false

  if (!output.value && !error.value) {
    output.value = T.noOutput()
  }

  terminateWorker()
}

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

function resetRunner() {
  clearTimeoutIfNeeded()
  output.value = ''
  error.value = ''
  running.value = false
  terminateWorker()

  if (!props.readonly) {
    editableSource.value = initialSource.value
  }
}

/**
 * Убирает служебный адрес песочницы из стек-трейсов.
 *
 * Главы про call stack и отладку учат читать трассировку, а случайный
 * идентификатор blob-адреса только мешает: вместо него показывается
 * понятное имя файла примера.
 */
function sanitizeTrace(value) {
  return String(value).replace(/blob:https?:\/\/[^/]+\/[0-9a-f-]+/gi, 'example.js')
}

function appendOutput(value) {
  const line = sanitizeTrace(value)

  output.value = output.value ? `${output.value}\n${line}` : line
}

async function prepareRunnableSource(source) {
  const transforms = []

  if (props.lang === 'ts') {
    transforms.push('typescript')
  }

  if (hasExportStatements(source)) {
    transforms.push('imports')
  }

  if (!transforms.length) {
    return source
  }

  const { transform } = await import('sucrase')

  return transform(source, { transforms }).code
}

/**
 * Код примера выполняется в Web Worker.
 *
 * У worker отдельный поток, поэтому бесконечный цикл в коде не блокирует
 * страницу: основной поток остаётся живым и прерывает выполнение по таймауту.
 */
function createWorkerSource(source) {
  return `
    const send = (type, value) => postMessage({ type, value })

    const format = value => {
      if (typeof value === 'string') return value
      if (typeof value === 'undefined') return 'undefined'
      if (typeof value === 'function') return value.toString()

      try {
        return JSON.stringify(value, null, 2)
      } catch {
        return String(value)
      }
    }

    const write = (type, args) => send(type, Array.from(args).map(format).join(' '))

    self.console = {
      log: (...args) => write('log', args),
      info: (...args) => write('log', args),
      warn: (...args) => write('log', args),
      error: (...args) => write('log', args),
      table: value => send('log', format(value))
    }

    self.addEventListener('error', event => {
      send('error', event.message || ${JSON.stringify(T.runtimeError())})
    })

    self.addEventListener('unhandledrejection', event => {
      send('error', event.reason?.message || format(event.reason))
    })

    var exports = {}
    var module = { exports };

// Ведущая точка с запятой отделяет обёртку от предыдущего выражения.
// Async-обертка разрешает top-level await и позволяет дождаться
// завершения асинхронного кода перед сигналом done.
;(async () => {
${source}
})().then(
  () => send('done', ''),
  err => send('error', (err && err.message) || String(err))
)
`
}

function handleMessage(event) {
  const message = event.data

  if (!message || typeof message.type !== 'string') {
    return
  }

  if (message.type === 'log') {
    appendOutput(message.value)
  }

  if (message.type === 'error') {
    error.value = sanitizeTrace(message.value || T.runtimeError())
    running.value = false
    clearTimeoutIfNeeded()
    terminateWorker()
  }

  if (message.type === 'done') {
    if (graceTimeoutId) {
      window.clearTimeout(graceTimeoutId)
    }

    graceTimeoutId = window.setTimeout(finalizeRun, ASYNC_GRACE_MS)
  }
}

async function runCode() {
  clearTimeoutIfNeeded()
  output.value = ''
  error.value = ''
  terminateWorker()

  if (isNodeOnly.value) {
    if (!props.readonly) {
      error.value = T.nodeOnlyError()
    }

    return
  }

  running.value = true

  let runnableSource = ''

  try {
    runnableSource = await prepareRunnableSource(displayedSource.value)
  } catch (transpileError) {
    running.value = false
    error.value = T.syntaxError(transpileError.message || transpileError)
    return
  }

  await nextTick()

  timeoutId = window.setTimeout(() => {
    // Worker прерывается принудительно: сам он остановиться уже не может.
    running.value = false
    error.value = T.timeoutError()
    terminateWorker()
    clearTimeoutIfNeeded()
  }, RUN_TIMEOUT_MS)

  const blob = new Blob([createWorkerSource(runnableSource)], { type: 'text/javascript' })

  workerUrl = URL.createObjectURL(blob)
  worker = new Worker(workerUrl)
  worker.onmessage = handleMessage
  worker.onerror = event => {
    error.value = sanitizeTrace(event.message || T.runtimeError())
    running.value = false
    clearTimeoutIfNeeded()
    terminateWorker()
  }
}

function handleEditorTab(event) {
  const target = event.target
  const start = target.selectionStart
  const end = target.selectionEnd

  editableSource.value = `${editableSource.value.slice(0, start)}  ${editableSource.value.slice(end)}`

  nextTick(() => {
    target.selectionStart = start + 2
    target.selectionEnd = start + 2
  })
}

onBeforeUnmount(() => {
  clearTimeoutIfNeeded()
  terminateWorker()
})
</script>

<template>
  <div class="code-runner" :class="{ 'code-runner--sandbox': !readonly }">
    <div class="code-runner__header">
      <div class="code-runner__title">
        <span class="code-runner__badge" :class="`code-runner__badge--${lang}`">{{ lang === 'ts' ? 'TS' : 'JS' }}</span>
        {{ title }}
      </div>

      <div v-if="readonly && isNodeOnly" class="code-runner__local-badge">
        {{ T.localBadge() }}
      </div>

      <div v-else class="code-runner__actions">
        <button
          class="code-runner__button"
          type="button"
          :disabled="running"
          @click="runCode"
        >
          {{ running ? T.running() : T.run() }}
        </button>

        <button
          class="code-runner__button code-runner__button--secondary"
          type="button"
          @click="resetRunner"
        >
          {{ T.reset() }}
        </button>
      </div>
    </div>

    <pre v-if="readonly" class="code-runner__code"><code>{{ initialSource }}</code></pre>

    <textarea
      v-else
      v-model="editableSource"
      class="code-runner__editor"
      spellcheck="false"
      @keydown.tab.prevent="handleEditorTab"
    />

    <div v-if="readonly && isNodeOnly" class="code-runner__node">
      <p>{{ T.nodeNote() }}</p>
    </div>

    <div v-if="output" class="code-runner__output">
      <div class="code-runner__output-title">{{ T.result() }}</div>
      <pre>{{ output }}</pre>
    </div>

    <div v-if="error" class="code-runner__error">
      <div class="code-runner__output-title">{{ T.errorTitle() }}</div>
      <pre>{{ error }}</pre>
      <p v-if="isIntentionalError" class="code-runner__expected-note">
        {{ T.intentionalNote() }}
      </p>
    </div>

  </div>
</template>

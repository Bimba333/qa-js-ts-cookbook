<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

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
const iframeSource = ref('')
const iframeKey = ref(0)
const runId = ref(0)
const editableSource = ref('')
let timeoutId = 0
let graceTimeoutId = 0

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

function escapeScriptEnd(source) {
  return source.replace(/<\/script/gi, '<\\/script')
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
    output.value = 'Код выполнен без вывода.'
  }

  destroyIframe()
}

function destroyIframe() {
  iframeSource.value = ''
  iframeKey.value += 1
}

function resetRunner() {
  clearTimeoutIfNeeded()
  output.value = ''
  error.value = ''
  running.value = false
  destroyIframe()

  if (!props.readonly) {
    editableSource.value = initialSource.value
  }
}

function appendOutput(value) {
  output.value = output.value ? `${output.value}\n${value}` : value
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

function createIframeSource(source) {
  const safeSource = escapeScriptEnd(source)

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body>
  <script>
    const send = (type, value) => {
      parent.postMessage({
        source: 'book-code-runner',
        runId: ${runId.value},
        type,
        value
      }, '*')
    }

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

    console.log = (...args) => write('log', args)
    console.info = (...args) => write('log', args)
    console.warn = (...args) => write('log', args)
    console.error = (...args) => write('log', args)
    console.table = value => send('log', format(value))

    window.addEventListener('error', event => {
      send('error', event.message || 'Ошибка выполнения.')
    })

    window.addEventListener('unhandledrejection', event => {
      send('error', event.reason?.message || format(event.reason))
    })

    var exports = {}
    var module = { exports }
  <\/script>
  <script>
// Async-обертка: разрешает top-level await и позволяет дождаться
// завершения асинхронного кода перед сигналом done.
(async () => {
${safeSource}
})().then(
  () => send('done', ''),
  err => send('error', (err && err.message) || String(err))
)
  <\/script>
</body>
</html>`
}

function handleMessage(event) {
  const message = event.data

  if (!message || message.source !== 'book-code-runner' || message.runId !== runId.value) {
    return
  }

  if (message.type === 'log') {
    appendOutput(message.value)
  }

  if (message.type === 'error') {
    error.value = message.value || 'Ошибка выполнения.'
    running.value = false
    clearTimeoutIfNeeded()
    destroyIframe()
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
  destroyIframe()
  runId.value += 1

  if (isNodeOnly.value) {
    if (!props.readonly) {
      error.value = 'Этот код использует import, require или Node.js API — в песочнице браузера они недоступны. Уберите их и попробуйте снова.'
    }

    return
  }

  running.value = true

  let runnableSource = ''

  try {
    runnableSource = await prepareRunnableSource(displayedSource.value)
  } catch (transpileError) {
    running.value = false
    error.value = `Ошибка синтаксиса: ${transpileError.message || transpileError}`
    return
  }

  window.removeEventListener('message', handleMessage)
  window.addEventListener('message', handleMessage)

  await nextTick()

  timeoutId = window.setTimeout(() => {
    running.value = false
    error.value = 'Код выполняется слишком долго. Возможно, в нем бесконечный цикл.'
    destroyIframe()
    clearTimeoutIfNeeded()
  }, RUN_TIMEOUT_MS)

  iframeSource.value = createIframeSource(runnableSource)
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
  window.removeEventListener('message', handleMessage)
})
</script>

<template>
  <div class="code-runner" :class="{ 'code-runner--sandbox': !readonly }">
    <div class="code-runner__header">
      <div class="code-runner__title">
        <span class="code-runner__badge" :class="`code-runner__badge--${lang}`">{{ lang === 'ts' ? 'TS' : 'JS' }}</span>
        {{ title }}
      </div>

      <div class="code-runner__actions">
        <button
          class="code-runner__button"
          type="button"
          :disabled="(readonly && isNodeOnly) || running"
          @click="runCode"
        >
          {{ running ? '⏳ Выполняется…' : '▶ Запустить' }}
        </button>

        <button
          class="code-runner__button code-runner__button--secondary"
          type="button"
          @click="resetRunner"
        >
          ↺ Сбросить
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
      <p>⚙️ Этот пример рассчитан на серверную среду Node.js, поэтому в браузере он не запускается. Прочитайте код — ожидаемый вывод разобран в тексте главы.</p>
    </div>

    <div v-if="output" class="code-runner__output">
      <div class="code-runner__output-title">Результат</div>
      <pre>{{ output }}</pre>
    </div>

    <div v-if="error" class="code-runner__error">
      <div class="code-runner__output-title">Ошибка</div>
      <pre>{{ error }}</pre>
      <p v-if="isIntentionalError" class="code-runner__expected-note">
        ✓ Так и задумано: этот пример намеренно демонстрирует ошибку — разбор смотрите в тексте главы.
      </p>
    </div>

    <iframe
      v-if="iframeSource"
      :key="iframeKey"
      class="code-runner__iframe"
      title="Изолированное выполнение примера"
      sandbox="allow-scripts"
      :srcdoc="iframeSource"
    />
  </div>
</template>

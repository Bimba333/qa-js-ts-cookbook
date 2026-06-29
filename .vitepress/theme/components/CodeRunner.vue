<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

const RUN_TIMEOUT_MS = 2000

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  sourceB64: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    default: ''
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const output = ref('')
const error = ref('')
const iframeSource = ref('')
const iframeKey = ref(0)
const runId = ref(0)
const editableSource = ref('')
let timeoutId = 0

const initialSource = computed(() => {
  const binary = atob(props.sourceB64)
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))

  return new TextDecoder().decode(bytes)
})

const displayedSource = computed(() => {
  return props.readonly ? initialSource.value : editableSource.value || initialSource.value
})

const isNodeOnly = computed(() => isNodeOnlySource(displayedSource.value))

const runCommand = computed(() => {
  return props.filePath ? `node ${props.filePath}` : 'node path/to/file.js'
})

watch(initialSource, source => {
  if (!props.readonly) {
    editableSource.value = source
  }
}, { immediate: true })

function isNodeOnlySource(source) {
  return /(^|\W)(process|__dirname|__filename)(\W|$)/.test(source) ||
    /(^|\W)require\s*\(/.test(source) ||
    /(^|\n)\s*import\s+.+\s+from\s+['"](?:fs|path|node:fs|node:path)['"]/.test(source) ||
    /(^|\n)\s*import\s+['"](?:fs|path|node:fs|node:path)['"]/.test(source)
}

function escapeScriptEnd(source) {
  return source.replace(/<\/script/gi, '<\\/script')
}

function clearTimeoutIfNeeded() {
  if (timeoutId) {
    window.clearTimeout(timeoutId)
    timeoutId = 0
  }
}

function destroyIframe() {
  iframeSource.value = ''
  iframeKey.value += 1
}

function resetRunner() {
  clearTimeoutIfNeeded()
  output.value = ''
  error.value = ''
  destroyIframe()

  if (!props.readonly) {
    editableSource.value = initialSource.value
  }
}

function appendOutput(value) {
  output.value = output.value ? `${output.value}\n${value}` : value
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
    console.warn = (...args) => write('log', args)
    console.error = (...args) => write('log', args)
    console.table = value => send('log', format(value))

    window.addEventListener('error', event => {
      send('error', event.message || 'Ошибка выполнения.')
    })

    window.addEventListener('unhandledrejection', event => {
      send('error', event.reason?.message || format(event.reason))
    })
  <\/script>
  <script>
${safeSource}
  <\/script>
  <script>
    send('done', '')
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
    clearTimeoutIfNeeded()
    destroyIframe()
  }

  if (message.type === 'done') {
    clearTimeoutIfNeeded()

    if (!output.value && !error.value) {
      output.value = 'Код выполнен без вывода.'
    }

    destroyIframe()
  }
}

async function runCode() {
  clearTimeoutIfNeeded()
  output.value = ''
  error.value = ''
  destroyIframe()
  runId.value += 1

  if (isNodeOnly.value) {
    return
  }

  window.removeEventListener('message', handleMessage)
  window.addEventListener('message', handleMessage)

  await nextTick()

  timeoutId = window.setTimeout(() => {
    error.value = 'Код выполняется слишком долго. Возможно, в нем бесконечный цикл.'
    destroyIframe()
    clearTimeoutIfNeeded()
  }, RUN_TIMEOUT_MS)

  iframeSource.value = createIframeSource(displayedSource.value)
}

onBeforeUnmount(() => {
  clearTimeoutIfNeeded()
  window.removeEventListener('message', handleMessage)
})
</script>

<template>
  <div class="code-runner">
    <div class="code-runner__header">
      <div class="code-runner__title">{{ title }}</div>

      <div class="code-runner__actions">
        <button
          class="code-runner__button"
          type="button"
          :disabled="isNodeOnly"
          @click="runCode"
        >
          ▶ Запустить
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
    />

    <div v-if="isNodeOnly" class="code-runner__node">
      <p>Этот пример предназначен для Node.js.</p>
      <p>Запустите локально:</p>
      <pre><code>{{ runCommand }}</code></pre>
    </div>

    <div v-if="output" class="code-runner__output">
      <div class="code-runner__output-title">Результат</div>
      <pre>{{ output }}</pre>
    </div>

    <div v-if="error" class="code-runner__error">
      <div class="code-runner__output-title">Ошибка</div>
      <pre>{{ error }}</pre>
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

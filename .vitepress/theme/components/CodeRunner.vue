<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  sourceB64: {
    type: String,
    required: true
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const output = ref('')
const error = ref('')
const iframeSource = ref('')
const runId = ref(0)

const initialSource = computed(() => {
  const binary = atob(props.sourceB64)
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
})

const editableSource = ref('')

function currentSource() {
  return props.readonly ? initialSource.value : editableSource.value || initialSource.value
}

function isNodeOnlySource(source) {
  return /(^|\W)(process|require|__dirname|__filename)(\W|$)/.test(source) ||
    /(^|\n)\s*import\s+.+\s+from\s+['"]node:/.test(source) ||
    /(^|\n)\s*import\s+.+\s+from\s+['"](fs|path|node:fs|node:path)['"]/.test(source)
}

function escapeScriptEnd(source) {
  return source.replace(/<\/script/gi, '<\\/script')
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

      try {
        return JSON.stringify(value)
      } catch {
        return String(value)
      }
    }

    console.log = (...args) => send('log', args.map(format).join(' '))
    console.warn = (...args) => send('log', args.map(format).join(' '))
    console.error = (...args) => send('log', args.map(format).join(' '))

    window.addEventListener('error', event => {
      send('error', event.message)
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
    output.value = output.value
      ? `${output.value}\n${message.value}`
      : message.value
  }

  if (message.type === 'error') {
    error.value = message.value || 'Ошибка выполнения.'
  }

  if (message.type === 'done' && !output.value && !error.value) {
    output.value = 'Код выполнен без вывода.'
  }
}

function runCode() {
  output.value = ''
  error.value = ''
  iframeSource.value = ''
  runId.value += 1

  const source = currentSource()

  if (isNodeOnlySource(source)) {
    error.value = 'Этот пример предназначен для Node.js.'
    return
  }

  window.removeEventListener('message', handleMessage)
  window.addEventListener('message', handleMessage)
  iframeSource.value = createIframeSource(source)
}
</script>

<template>
  <div class="code-runner">
    <div class="code-runner__header">
      <div class="code-runner__title">{{ title }}</div>

      <button class="code-runner__button" type="button" @click="runCode">
        ▶ Запустить
      </button>
    </div>

    <pre v-if="readonly" class="code-runner__code"><code>{{ initialSource }}</code></pre>

    <textarea
      v-else
      v-model="editableSource"
      class="code-runner__editor"
      spellcheck="false"
      :placeholder="initialSource"
    />

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
      class="code-runner__iframe"
      title="Изолированное выполнение примера"
      sandbox="allow-scripts"
      :srcdoc="iframeSource"
    />
  </div>
</template>

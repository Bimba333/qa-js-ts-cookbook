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

const initialSource = computed(() => {
  const binary = atob(props.sourceB64)
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
})

const editableSource = ref('')

function currentSource() {
  return props.readonly ? initialSource.value : editableSource.value || initialSource.value
}

function runCode() {
  output.value = ''
  error.value = ''

  const logs = []

  const fakeConsole = {
    log: (...args) => logs.push(args.map(String).join(' ')),
    warn: (...args) => logs.push(args.map(String).join(' ')),
    error: (...args) => logs.push(args.map(String).join(' '))
  }

  try {
    const fn = new Function('console', currentSource())
    fn(fakeConsole)
    output.value = logs.join('\n') || 'Код выполнен без вывода.'
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  }
}
</script>

<template>
  <div class="code-runner">
    <div class="code-runner__header">
      <div class="code-runner__title">{{ title }}</div>

      <button class="code-runner__button" type="button" @click="runCode">
        Пуск
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
      <div class="code-runner__output-title">Вывод</div>
      <pre>{{ output }}</pre>
    </div>

    <div v-if="error" class="code-runner__error">
      <div class="code-runner__output-title">Ошибка</div>
      <pre>{{ error }}</pre>
    </div>
  </div>
</template>
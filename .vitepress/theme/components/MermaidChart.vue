<template>
  <div class="book-mermaid">
    <div ref="container" class="book-mermaid__canvas"></div>
    <div v-if="error" class="book-mermaid__error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import mermaid from 'mermaid'

const props = defineProps<{
  sourceB64: string
}>()

const container = ref<HTMLElement | null>(null)
const error = ref('')

let renderId = 0

function sourceFromBase64(value: string): string {
  return decodeURIComponent(
    Array.from(atob(value), char => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`).join('')
  )
}

function currentTheme(): 'dark' | 'default' {
  if (typeof document === 'undefined') {
    return 'default'
  }

  return document.documentElement.classList.contains('dark') ? 'dark' : 'default'
}

async function renderChart() {
  if (!container.value) {
    return
  }

  const source = sourceFromBase64(props.sourceB64)
  const id = `book-mermaid-${++renderId}-${Math.random().toString(36).slice(2)}`

  error.value = ''
  container.value.innerHTML = ''

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: currentTheme()
  })

  try {
    const result = await mermaid.render(id, source)
    container.value.innerHTML = result.svg
  } catch {
    error.value = 'Не удалось отрисовать Mermaid-диаграмму.'
  }
}

onMounted(async () => {
  await nextTick()
  await renderChart()

  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(() => renderChart())
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
  }
})

watch(() => props.sourceB64, renderChart)
</script>

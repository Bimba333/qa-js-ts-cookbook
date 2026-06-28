<template>
  <div class="book-mermaid">
    <button
      v-if="svgContent && !error"
      class="book-mermaid__open"
      type="button"
      @click="openViewer"
    >
      Увеличить
    </button>
    <div
      ref="container"
      class="book-mermaid__canvas"
      :class="{ 'book-mermaid__canvas--clickable': svgContent && !error }"
      role="button"
      tabindex="0"
      aria-label="Открыть диаграмму"
      @click="svgContent && !error && openViewer()"
      @keydown.enter="svgContent && !error && openViewer()"
      @keydown.space.prevent="svgContent && !error && openViewer()"
    ></div>
    <div v-if="error" class="book-mermaid__error">{{ error }}</div>

    <Teleport to="body">
      <div
        v-if="isViewerOpen"
        class="book-mermaid-viewer"
        role="dialog"
        aria-modal="true"
        aria-label="Просмотр диаграммы"
        @click.self="closeViewer"
      >
        <div class="book-mermaid-viewer__panel">
          <div class="book-mermaid-viewer__toolbar">
            <button type="button" @click="decreaseZoom">−</button>
            <span>{{ zoomLabel }}</span>
            <button type="button" @click="increaseZoom">+</button>
            <button type="button" @click="resetZoom">100%</button>
            <button type="button" @click="closeViewer">Закрыть</button>
          </div>
          <div class="book-mermaid-viewer__viewport">
            <div
              class="book-mermaid-viewer__content"
              :style="{ transform: `scale(${zoom})` }"
              v-html="svgContent"
            ></div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import mermaid from 'mermaid'

const props = defineProps<{
  sourceB64: string
}>()

const container = ref<HTMLElement | null>(null)
const error = ref('')
const svgContent = ref('')
const isViewerOpen = ref(false)
const zoom = ref(1)
const zoomLabel = computed(() => `${Math.round(zoom.value * 100)}%`)

let renderId = 0
let observer: MutationObserver | null = null

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
  svgContent.value = ''
  container.value.innerHTML = ''

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: currentTheme()
  })

  try {
    const result = await mermaid.render(id, source)
    svgContent.value = result.svg
    container.value.innerHTML = result.svg
  } catch {
    error.value = 'Не удалось отрисовать Mermaid-диаграмму.'
  }
}

function openViewer() {
  isViewerOpen.value = true
}

function closeViewer() {
  isViewerOpen.value = false
  resetZoom()
}

function increaseZoom() {
  zoom.value = Math.min(zoom.value + 0.25, 3)
}

function decreaseZoom() {
  zoom.value = Math.max(zoom.value - 0.25, 0.5)
}

function resetZoom() {
  zoom.value = 1
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isViewerOpen.value) {
    closeViewer()
  }
}

onMounted(async () => {
  await nextTick()
  await renderChart()

  window.addEventListener('keydown', handleKeydown)

  if (typeof MutationObserver !== 'undefined') {
    observer = new MutationObserver(() => renderChart())
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  observer?.disconnect()
})

watch(() => props.sourceB64, renderChart)
</script>

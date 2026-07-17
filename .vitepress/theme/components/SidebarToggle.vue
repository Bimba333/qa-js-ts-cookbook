<script setup>
import { onMounted, ref } from 'vue'

const STORAGE_KEY = 'book-sidebar-hidden'
const hidden = ref(false)

function applyState() {
  document.documentElement.classList.toggle('book-sidebar-hidden', hidden.value)
}

function toggle() {
  hidden.value = !hidden.value

  try {
    localStorage.setItem(STORAGE_KEY, hidden.value ? '1' : '')
  } catch {
    // localStorage может быть недоступен (private mode) — состояние живет до перезагрузки.
  }

  applyState()
}

onMounted(() => {
  try {
    hidden.value = localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    hidden.value = false
  }

  applyState()
})
</script>

<template>
  <button
    class="book-sidebar-toggle"
    type="button"
    :title="hidden ? 'Показать список глав' : 'Скрыть список глав'"
    :aria-label="hidden ? 'Показать список глав' : 'Скрыть список глав'"
    :aria-pressed="hidden"
    @click.prevent.stop="toggle"
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <line x1="9.5" y1="4" x2="9.5" y2="20" />
      <line v-if="!hidden" x1="5.5" y1="8" x2="7.5" y2="8" />
      <line v-if="!hidden" x1="5.5" y1="11" x2="7.5" y2="11" />
      <line v-if="!hidden" x1="5.5" y1="14" x2="7.5" y2="14" />
    </svg>
  </button>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useData } from 'vitepress'

const SIDEBAR_KEY = 'book-sidebar-hidden'
const OUTLINE_KEY = 'book-outline-hidden'

const { frontmatter } = useData()
const sidebarHidden = ref(false)
const outlineHidden = ref(false)

function readFlag(key) {
  try {
    return localStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

function writeFlag(key, value) {
  try {
    localStorage.setItem(key, value ? '1' : '')
  } catch {
    // localStorage недоступен — состояние живет до перезагрузки.
  }
}

function applyState() {
  document.documentElement.classList.toggle('book-sidebar-hidden', sidebarHidden.value)
  document.documentElement.classList.toggle('book-outline-hidden', outlineHidden.value)
}

function toggleSidebar() {
  sidebarHidden.value = !sidebarHidden.value
  writeFlag(SIDEBAR_KEY, sidebarHidden.value)
  applyState()
}

function toggleOutline() {
  outlineHidden.value = !outlineHidden.value
  writeFlag(OUTLINE_KEY, outlineHidden.value)
  applyState()
}

onMounted(() => {
  sidebarHidden.value = readFlag(SIDEBAR_KEY)
  outlineHidden.value = readFlag(OUTLINE_KEY)
  applyState()
})
</script>

<template>
  <template v-if="frontmatter.layout !== 'home'">
    <button
      class="book-panel-toggle book-panel-toggle--left"
      type="button"
      :title="sidebarHidden ? 'Показать список глав' : 'Скрыть список глав'"
      :aria-label="sidebarHidden ? 'Показать список глав' : 'Скрыть список глав'"
      :aria-expanded="!sidebarHidden"
      @click="toggleSidebar"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline v-if="sidebarHidden" points="9 6 15 12 9 18" />
        <polyline v-else points="15 6 9 12 15 18" />
      </svg>
    </button>

    <button
      class="book-panel-toggle book-panel-toggle--right"
      type="button"
      :title="outlineHidden ? 'Показать оглавление страницы' : 'Скрыть оглавление страницы'"
      :aria-label="outlineHidden ? 'Показать оглавление страницы' : 'Скрыть оглавление страницы'"
      :aria-expanded="!outlineHidden"
      @click="toggleOutline"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline v-if="outlineHidden" points="15 6 9 12 15 18" />
        <polyline v-else points="9 6 15 12 9 18" />
      </svg>
    </button>
  </template>
</template>

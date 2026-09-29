<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vitepress'

/**
 * Оглавление главы и полоса прочитанного.
 *
 * Глава книги — это 20–35 экранов текста, и главная трудность чтения не в
 * размере шрифта, а в потере ориентира. Полоса шагов отвечает «в какой части
 * главы я нахожусь», оглавление — «что внутри теории и куда перейти».
 *
 * Список строится из разметки страницы, а не из данных сборки: тогда он всегда
 * совпадает с тем, что читатель видит, включая скрытые полосой шагов разделы.
 */
const route = useRoute()
const sections = ref([])
const progress = ref(0)
const open = ref(true)

let observer = null
let container = null

function headingText(node) {
  return node.textContent?.replace('​', '').replace(/#$/, '').trim() ?? ''
}

function visible(node) {
  return node.offsetParent !== null
}

function collect() {
  if (typeof document === 'undefined') return

  const doc = document.querySelector('.vp-doc')

  if (!doc) return

  sections.value = [...doc.querySelectorAll('h2')]
    .filter(visible)
    .map(node => ({ id: node.id, text: headingText(node) }))
    .filter(section => section.id && section.text)
}

function onScroll() {
  if (typeof window === 'undefined') return

  const doc = document.documentElement
  const scrollable = doc.scrollHeight - window.innerHeight

  progress.value = scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 0
}

onMounted(() => {
  collect()
  onScroll()

  window.addEventListener('scroll', onScroll, { passive: true })

  container = document.querySelector('.vp-doc')

  if (container && typeof MutationObserver !== 'undefined') {
    // Полоса шагов показывает и скрывает разделы классами: оглавление должно
    // следовать за ней, не зная о её устройстве.
    observer = new MutationObserver(collect)
    observer.observe(container, { attributes: true, subtree: true, attributeFilter: ['class'] })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  observer?.disconnect()
})
</script>

<template>
  <div class="chapter-outline" v-if="sections.length > 2" :key="route.path">
    <div class="chapter-outline__bar" aria-hidden="true">
      <i :style="{ width: `${progress}%` }"></i>
    </div>

    <button
      class="chapter-outline__toggle"
      type="button"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span>В этой главе</span>
      <span class="chapter-outline__count">{{ sections.length }} разделов · прочитано {{ progress }}%</span>
    </button>

    <ol v-show="open" class="chapter-outline__list">
      <li v-for="section in sections" :key="section.id">
        <a :href="`#${section.id}`">{{ section.text }}</a>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.chapter-outline {
  margin: 0 0 26px;
  border: 1px solid var(--book-rule);
  background: var(--book-surface);
}

.chapter-outline__bar {
  height: 2px;
  background: var(--book-rule-soft);
}

.chapter-outline__bar i {
  display: block;
  height: 100%;
  background: var(--vp-c-brand-1);
  transition: width 0.1s linear;
}

.chapter-outline__toggle {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  padding: 10px 16px;
  background: transparent;
  border: 0;
  cursor: pointer;
  font-family: var(--book-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--book-ink-2);
  text-align: left;
}

.chapter-outline__toggle:hover { color: var(--book-ink); }

.chapter-outline__count {
  color: var(--book-ink-3);
  font-variant-numeric: tabular-nums;
  text-transform: none;
  letter-spacing: 0;
}

.chapter-outline__list {
  list-style: none;
  margin: 0;
  padding: 0 16px 14px;
  columns: 2;
  column-gap: 28px;
}

.chapter-outline__list li {
  margin: 0 0 4px;
  break-inside: avoid;
}

.chapter-outline__list a {
  font-family: var(--book-serif);
  font-size: 14px;
  line-height: 1.45;
  color: var(--book-ink-2);
  text-decoration: none;
}

.chapter-outline__list a:hover {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}

@media (max-width: 720px) {
  .chapter-outline__list { columns: 1; }
}
</style>

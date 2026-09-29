<script setup>
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import tasksByChapter from '../../tasks.generated.json'
import { bookEngineData } from '../../book.generated.mjs'
import { TASK_STATUS, readAllProgress } from '../composables/task-progress.js'
import { refreshAccess, restoreAccess } from '../composables/access.js'

// Карта книги: одно место, где видно все 263 главы, положение читателя и
// границу доступа. Боковая панель отвечает на вопрос «куда дальше», карта —
// на вопрос «где я и что осталось».
const progress = ref({})
const ready = ref(false)
const query = ref('')
const onlyUnsolved = ref(false)
const onlyFree = ref(false)
const activePart = ref('все')

const chapters = Object.values(bookEngineData.chapters).map(chapter => {
  const key = chapter.path.replace(/^docs\//, '').replace(/\.md$/, '')
  const tasks = tasksByChapter[key] ?? []

  return {
    key,
    part: chapter.part,
    section: chapter.section,
    number: chapter.number,
    title: chapter.title,
    link: chapter.link,
    access: chapter.access,
    readingMinutes: chapter.readingMinutes,
    taskIds: tasks.map(task => task.id)
  }
})

const partNames = ['все', ...bookEngineData.parts.map(part => part.title)]

function solvedIn(taskIds) {
  let solved = 0

  for (const id of taskIds) {
    if (progress.value[id]?.status === TASK_STATUS.solved) solved += 1
  }

  return solved
}

/** Убирает разметку кода из заголовка: в списке нужен текст, а не `filter()`. */
function plainTitle(title) {
  return title.replace(/`/g, '')
}

const normalized = computed(() => query.value.trim().toLowerCase())

const visible = computed(() => chapters.filter(chapter => {
  if (activePart.value !== 'все' && chapter.part !== activePart.value) return false
  if (onlyFree.value && chapter.access !== 'free') return false

  if (onlyUnsolved.value) {
    const total = chapter.taskIds.length

    if (total === 0 || solvedIn(chapter.taskIds) === total) return false
  }

  if (normalized.value === '') return true

  const haystack = `${chapter.number} ${plainTitle(chapter.title)} ${chapter.section}`.toLowerCase()

  return haystack.includes(normalized.value)
}))

/** Группировка по части и разделу — порядок берётся из книги, не из фильтра. */
const groups = computed(() => {
  const byPart = new Map()

  for (const chapter of visible.value) {
    if (!byPart.has(chapter.part)) byPart.set(chapter.part, new Map())

    const sections = byPart.get(chapter.part)
    const section = chapter.section || '—'

    if (!sections.has(section)) sections.set(section, [])
    sections.get(section).push(chapter)
  }

  return [...byPart.entries()].map(([part, sections]) => ({
    part,
    sections: [...sections.entries()].map(([section, items]) => ({ section, items }))
  }))
})

const next = computed(() => chapters.find(chapter => {
  const total = chapter.taskIds.length

  return total > 0 && solvedIn(chapter.taskIds) < total
}) ?? null)

const counts = computed(() => ({
  shown: visible.value.length,
  total: chapters.length,
  free: chapters.filter(chapter => chapter.access === 'free').length
}))

function chapterState(chapter) {
  const total = chapter.taskIds.length

  if (total === 0) return { label: '—', kind: 'none' }

  const solved = solvedIn(chapter.taskIds)

  if (solved === total) return { label: `${solved}/${total}`, kind: 'solved' }
  if (solved > 0) return { label: `${solved}/${total}`, kind: 'started' }

  return { label: `0/${total}`, kind: 'open' }
}

function reset() {
  query.value = ''
  onlyUnsolved.value = false
  onlyFree.value = false
  activePart.value = 'все'
}

onMounted(async () => {
  progress.value = readAllProgress()
  restoreAccess()
  ready.value = true

  try {
    await refreshAccess()
  } catch {
    // Карта должна работать и без сервиса: замки останутся по последнему
    // известному состоянию.
  }
})
</script>

<template>
  <div class="book-map">
    <header class="book-map__head">
      <div>
        <p class="book-map__eyebrow">Состав книги</p>
        <p class="book-map__lede">
          Показано {{ counts.shown }} из {{ counts.total }} глав. Открыто без
          подписки: {{ counts.free }}.
        </p>
      </div>

      <a v-if="ready && next" class="book-map__continue" :href="withBase(next.link)">
        Продолжить
        <small>{{ next.number }}. {{ plainTitle(next.title) }}</small>
      </a>
    </header>

    <div class="book-map__controls">
      <label class="book-map__search">
        <span class="book-map__search-label">Поиск по главам</span>
        <input v-model="query" type="search" placeholder="номер, название или раздел" />
      </label>

      <div class="book-map__parts">
        <button
          v-for="name in partNames"
          :key="name"
          type="button"
          class="book-map__chip"
          :class="{ 'book-map__chip--active': activePart === name }"
          @click="activePart = name"
        >{{ name }}</button>
      </div>

      <div class="book-map__toggles">
        <label><input v-model="onlyUnsolved" type="checkbox" /> только нерешённые</label>
        <label><input v-model="onlyFree" type="checkbox" /> только открытые</label>
        <button type="button" class="book-map__reset" @click="reset">сбросить</button>
      </div>
    </div>

    <p v-if="counts.shown === 0" class="book-map__empty">
      Под условия не подошла ни одна глава. Попробуйте сбросить фильтры.
    </p>

    <section v-for="group in groups" :key="group.part" class="book-map__part">
      <h2 class="book-map__part-title">{{ group.part }}</h2>

      <div v-for="section in group.sections" :key="section.section" class="book-map__section">
        <h3 class="book-map__section-title">{{ section.section }}</h3>

        <ul class="book-map__list">
          <li v-for="chapter in section.items" :key="chapter.key" class="book-map__row">
            <span class="book-map__number">{{ chapter.number || '' }}</span>
            <a class="book-map__link" :href="withBase(chapter.link)">{{ plainTitle(chapter.title) }}</a>
            <span
              class="book-map__tasks"
              :class="`book-map__tasks--${chapterState(chapter).kind}`"
              :title="chapter.taskIds.length ? 'решено задач' : 'задач с проверкой нет'"
            >{{ ready ? chapterState(chapter).label : '' }}</span>
            <span class="book-map__minutes">{{ chapter.readingMinutes }} мин</span>
            <span
              class="book-map__access"
              :class="`book-map__access--${chapter.access}`"
            >{{ chapter.access === 'free' ? 'открыта' : 'подписка' }}</span>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.book-map {
  margin: 0 auto;
  padding: 8px 0 60px;
}

.book-map__eyebrow {
  margin: 0;
  font-family: var(--book-mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--book-ink-3);
}

.book-map__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  flex-wrap: wrap;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--book-ink);
}

.book-map__lede {
  margin: 0;
  font-family: var(--book-serif);
  font-size: 16px;
  color: var(--book-ink-2);
}

.book-map__continue {
  display: inline-flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 16px;
  background: var(--book-ink);
  color: var(--book-paper);
  text-decoration: none;
  font-weight: 600;
  border: 1px solid var(--book-ink);
}

.book-map__continue small {
  font-family: var(--book-mono);
  font-size: 11px;
  font-weight: 400;
  opacity: 0.75;
}

.book-map__controls {
  display: grid;
  gap: 14px;
  padding: 18px 0;
  border-bottom: 1px solid var(--book-rule);
  position: sticky;
  top: var(--vp-nav-height, 64px);
  background: var(--vp-c-bg);
  z-index: 5;
}

.book-map__search {
  display: grid;
  gap: 6px;
}

.book-map__search-label {
  font-family: var(--book-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--book-ink-3);
}

.book-map__search input {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid var(--book-rule);
  background: var(--vp-c-bg);
  color: var(--book-ink);
  font-family: var(--book-mono);
  font-size: 13px;
}

.book-map__search input:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 1px;
}

.book-map__parts,
.book-map__toggles {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.book-map__chip,
.book-map__reset {
  padding: 5px 12px;
  border: 1px solid var(--book-rule);
  background: var(--vp-c-bg);
  color: var(--book-ink-2);
  font-family: var(--book-mono);
  font-size: 12px;
  cursor: pointer;
}

.book-map__chip--active {
  border-color: var(--book-ink);
  background: var(--book-ink);
  color: var(--book-paper);
}

.book-map__toggles label {
  font-family: var(--book-mono);
  font-size: 12px;
  color: var(--book-ink-2);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.book-map__empty {
  margin: 28px 0;
  font-family: var(--book-serif);
  color: var(--book-ink-2);
}

.book-map__part-title {
  font-family: var(--book-serif);
  font-size: 26px;
  margin: 36px 0 0;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--book-rule);
}

.book-map__section-title {
  font-family: var(--book-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--book-ink-3);
  margin: 22px 0 6px;
}

.book-map__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.book-map__row {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) 54px 62px 84px;
  gap: 12px;
  align-items: baseline;
  padding: 6px 0;
  border-bottom: 1px solid var(--book-rule-soft);
}

.book-map__number,
.book-map__tasks,
.book-map__minutes,
.book-map__access {
  font-family: var(--book-mono);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  color: var(--book-ink-3);
}

.book-map__link {
  font-family: var(--book-serif);
  font-size: 16px;
  color: var(--book-ink);
  text-decoration: none;
}

.book-map__link:hover {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}

.book-map__tasks--solved { color: var(--book-pass); }
.book-map__tasks--started { color: var(--book-started); }

.book-map__access--free { color: var(--book-pass); }
.book-map__access--paid { color: var(--book-ink-3); }

@media (max-width: 720px) {
  .book-map__row {
    grid-template-columns: 34px minmax(0, 1fr) 48px;
  }

  .book-map__minutes,
  .book-map__access { display: none; }
}
</style>

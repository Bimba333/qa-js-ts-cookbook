<script setup>
import { computed, onMounted, ref } from 'vue'
import AccountPanel from './AccountPanel.vue'
import tasksByChapter from '../../tasks.generated.json'
import { bookEngineData } from '../../book.generated.mjs'
import {
  TASK_STATUS,
  clearAllProgress,
  exportProgress,
  importProgress,
  readAllProgress
} from '../composables/task-progress.js'

// Прогресс живёт в localStorage, поэтому на сервере его нет: до монтирования
// страница показывает нули, а не расходится с тем, что увидит читатель.
const progress = ref({})
const ready = ref(false)
const message = ref('')
const fileInput = ref(null)

const PART_TITLES = {
  '00-introduction': 'Введение',
  '01-javascript': 'JavaScript',
  '02-typescript': 'TypeScript',
  '03-automation-qa': 'Automation QA',
  '04-final-project': 'Финальный проект'
}

const chapters = computed(() => {
  const rows = []

  for (const [chapterKey, tasks] of Object.entries(tasksByChapter)) {
    const [part] = chapterKey.split('/')
    const meta = bookEngineData.chapters[`docs/${chapterKey}.md`]

    rows.push({
      key: chapterKey,
      part,
      partTitle: PART_TITLES[part] ?? part,
      number: meta?.number ?? 0,
      title: meta?.title ?? chapterKey,
      link: meta?.link ?? `/docs/${chapterKey}`,
      taskIds: tasks.map(task => task.id),
      standOnly: tasks.every(task => task.runner === 'stand')
    })
  }

  return rows.sort((a, b) => a.number - b.number)
})

function statusOf(taskId) {
  return progress.value[taskId]?.status ?? TASK_STATUS.notStarted
}

function countIn(taskIds) {
  let solved = 0
  let attempted = 0

  for (const id of taskIds) {
    const status = statusOf(id)

    if (status === TASK_STATUS.solved) solved += 1
    else if (status === TASK_STATUS.attempted) attempted += 1
  }

  return { solved, attempted, total: taskIds.length }
}

const parts = computed(() => {
  const grouped = new Map()

  for (const chapter of chapters.value) {
    const current = grouped.get(chapter.part) ?? {
      part: chapter.part,
      title: chapter.partTitle,
      chapters: [],
      taskIds: []
    }

    current.chapters.push(chapter)
    current.taskIds.push(...chapter.taskIds)
    grouped.set(chapter.part, current)
  }

  return [...grouped.values()].map(group => ({
    ...group,
    counts: countIn(group.taskIds)
  }))
})

const overall = computed(() =>
  countIn(chapters.value.flatMap(chapter => chapter.taskIds)))

const nextChapter = computed(() =>
  chapters.value.find(chapter => countIn(chapter.taskIds).solved < chapter.taskIds.length))

function percent(counts) {
  return counts.total === 0 ? 0 : Math.round((counts.solved / counts.total) * 100)
}

function refresh() {
  progress.value = readAllProgress()
}

onMounted(() => {
  refresh()
  ready.value = true
})

function download() {
  const snapshot = exportProgress()
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'js-ts-qa-book-progress.json'
  link.click()

  URL.revokeObjectURL(url)
  message.value = 'Снимок прогресса сохранён.'
}

async function upload(event) {
  const file = event.target.files?.[0]
  if (!file) return

  try {
    const result = importProgress(JSON.parse(await file.text()))

    refresh()
    message.value = result.skipped === 0
      ? `Перенесено задач: ${result.imported}.`
      : `Перенесено задач: ${result.imported}, пропущено непонятных записей: ${result.skipped}.`
  } catch (error) {
    message.value = `Снимок не принят: ${error instanceof Error ? error.message : String(error)}`
  } finally {
    event.target.value = ''
  }
}

function reset() {
  const confirmed = window.confirm(
    'Удалить весь сохранённый прогресс? Это действие нельзя отменить.'
  )

  if (!confirmed) return

  clearAllProgress()
  refresh()
  message.value = 'Прогресс очищен.'
}
</script>

<template>
  <section class="progress-board">
    <div class="progress-board__summary">
      <div class="progress-board__total">
        <span class="progress-board__value">{{ overall.solved }}</span>
        <span class="progress-board__label">решено из {{ overall.total }}</span>
      </div>
      <div class="progress-board__bar" :aria-label="`Решено ${percent(overall)} процентов`">
        <i :style="{ width: `${percent(overall)}%` }"></i>
      </div>
      <p v-if="overall.attempted > 0" class="progress-board__hint">
        Начато, но не решено: {{ overall.attempted }}.
      </p>
      <p v-if="ready && nextChapter" class="progress-board__hint">
        Продолжить:
        <a :href="nextChapter.link">{{ nextChapter.number }}. {{ nextChapter.title }}</a>
      </p>
      <p v-else-if="ready" class="progress-board__hint">Все задачи книги решены.</p>
    </div>

    <div class="progress-board__actions">
      <button type="button" @click="download">Сохранить снимок</button>
      <button type="button" @click="fileInput?.click()">Перенести снимок</button>
      <button type="button" class="progress-board__danger" @click="reset">Очистить</button>
      <input
        ref="fileInput"
        type="file"
        accept="application/json"
        hidden
        @change="upload"
      >
    </div>

    <p v-if="message" class="progress-board__message" role="status">{{ message }}</p>

    <AccountPanel @changed="refresh" />

    <p class="progress-board__note">
      Прогресс хранится в этом браузере. Снимок переносит решённое на другое
      устройство: при переносе статусы объединяются, и решённая задача не
      становится обратно попыткой.
    </p>

    <details v-for="part in parts" :key="part.part" class="progress-board__part">
      <summary>
        <span class="progress-board__part-title">{{ part.title }}</span>
        <span class="progress-board__part-counts">
          {{ part.counts.solved }} / {{ part.counts.total }}
        </span>
      </summary>

      <table class="progress-board__table">
        <thead>
          <tr>
            <th scope="col">Глава</th>
            <th scope="col">Задачи</th>
            <th scope="col">Где решать</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="chapter in part.chapters" :key="chapter.key">
            <td><a :href="chapter.link">{{ chapter.number }}. {{ chapter.title }}</a></td>
            <td>
              {{ countIn(chapter.taskIds).solved }} / {{ chapter.taskIds.length }}
              <span
                v-if="countIn(chapter.taskIds).attempted > 0"
                class="progress-board__attempted"
              >
                (начато {{ countIn(chapter.taskIds).attempted }})
              </span>
            </td>
            <td>{{ chapter.standOnly ? 'на стенде' : 'в браузере' }}</td>
          </tr>
        </tbody>
      </table>
    </details>
  </section>
</template>

<style scoped>
.progress-board {
  display: grid;
  gap: 20px;
  margin-top: 24px;
}

.progress-board__summary {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 20px;
}

.progress-board__total {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.progress-board__value {
  font-size: 34px;
  font-weight: 700;
}

.progress-board__label {
  color: var(--vp-c-text-2);
}

.progress-board__bar {
  margin-top: 12px;
  height: 10px;
  border-radius: 999px;
  background: var(--vp-c-default-soft);
  overflow: hidden;
}

.progress-board__bar i {
  display: block;
  height: 100%;
  background: var(--vp-c-brand-1);
  transition: width 0.3s ease;
}

.progress-board__hint {
  margin: 10px 0 0;
  color: var(--vp-c-text-2);
}

.progress-board__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.progress-board__actions button {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 8px 14px;
  background: var(--vp-c-bg-soft);
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.progress-board__actions button:hover {
  border-color: var(--vp-c-brand-1);
}

.progress-board__danger:hover {
  border-color: var(--vp-c-danger-1);
  color: var(--vp-c-danger-1);
}

.progress-board__message {
  margin: 0;
  color: var(--vp-c-brand-1);
}

.progress-board__note {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.progress-board__part {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 12px 16px;
}

.progress-board__part summary {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  cursor: pointer;
  font-weight: 600;
}

.progress-board__part-counts {
  color: var(--vp-c-text-2);
  font-weight: 400;
}

.progress-board__table {
  width: 100%;
  margin-top: 12px;
  border-collapse: collapse;
  display: block;
  overflow-x: auto;
}

.progress-board__table th,
.progress-board__table td {
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 8px;
  text-align: left;
  vertical-align: top;
}

.progress-board__attempted {
  color: var(--vp-c-text-2);
  font-size: 14px;
}
</style>

<script setup>
import { computed, onMounted, ref } from 'vue'
import tasksByChapter from '../../tasks.generated.json'
import { bookEngineData } from '../../book.generated.mjs'
import { TASK_STATUS, readAllProgress } from '../composables/task-progress.js'

// Прогресс есть только в браузере: до монтирования страница показывает
// маршрут без отметок, а не расходится с тем, что увидит читатель.
const progress = ref({})
const ready = ref(false)

const PARTS = [
  {
    key: '01-javascript',
    title: 'JavaScript',
    goal: 'Модель языка: от области видимости до событийного цикла',
    entry: '/docs/01-javascript/01-what-is-javascript'
  },
  {
    key: '02-typescript',
    title: 'TypeScript',
    goal: 'Типы как инструмент проверки до запуска и его границы',
    entry: '/docs/02-typescript/97-typescript-compiler'
  },
  {
    key: '03-automation-qa',
    title: 'Automation QA',
    goal: 'Playwright, REST, gRPC и база данных в одном фреймворке',
    entry: '/docs/03-automation-qa/160-what-is-automation-qa-framework'
  },
  {
    key: '04-final-project',
    title: 'Финальный проект',
    goal: 'Свой фреймворк против учебного стенда',
    entry: '/docs/04-final-project/250-project-requirements-and-readiness-criteria'
  }
]

const chapters = computed(() =>
  Object.entries(tasksByChapter)
    .map(([chapterKey, tasks]) => {
      const meta = bookEngineData.chapters[`docs/${chapterKey}.md`]

      return {
        key: chapterKey,
        part: chapterKey.split('/')[0],
        number: meta?.number ?? 0,
        title: meta?.title ?? chapterKey,
        link: meta?.link ?? `/docs/${chapterKey}`,
        taskIds: tasks.map(task => task.id)
      }
    })
    .sort((a, b) => a.number - b.number))

function countIn(taskIds) {
  let solved = 0

  for (const id of taskIds) {
    if (progress.value[id]?.status === TASK_STATUS.solved) solved += 1
  }

  return { solved, total: taskIds.length }
}

const parts = computed(() =>
  PARTS.map(part => {
    const own = chapters.value.filter(chapter => chapter.part === part.key)
    const taskIds = own.flatMap(chapter => chapter.taskIds)

    return { ...part, chapters: own.length, counts: countIn(taskIds) }
  }))

const overall = computed(() => countIn(chapters.value.flatMap(chapter => chapter.taskIds)))

const next = computed(() => {
  const unfinished = chapters.value.find(chapter => {
    const counts = countIn(chapter.taskIds)

    return counts.solved < counts.total
  })

  return unfinished ?? null
})

const started = computed(() => Object.keys(progress.value).length > 0)

function percent(counts) {
  return counts.total === 0 ? 0 : Math.round((counts.solved / counts.total) * 100)
}

onMounted(() => {
  progress.value = readAllProgress()
  ready.value = true
})
</script>

<template>
  <div class="home-board">
    <header class="home-board__top">
      <div>
        <p class="home-board__eyebrow">JavaScript и TypeScript для Automation QA</p>
        <h1 class="home-board__title">Учебник, в котором работают руками</h1>
        <p class="home-board__lede">
          Теория, запускаемые примеры и задачи с проверкой — на одной странице.
          Код выполняется прямо в браузере, а задачи уровня фреймворка решаются
          против учебного стенда в Docker.
        </p>

        <div class="home-board__actions">
          <a v-if="ready && started && next" class="home-board__cta" :href="next.link">
            Продолжить
            <small>{{ next.number }}. {{ next.title }}</small>
          </a>
          <a v-else class="home-board__cta" href="/docs/00-introduction/01-about-course">
            Начать с введения
            <small>как устроен курс</small>
          </a>
          <a class="home-board__cta home-board__cta--ghost" href="/docs/progress">Прогресс</a>
        </div>
      </div>

      <dl class="home-board__facts">
        <div><dt>Глав</dt><dd>249</dd></div>
        <div><dt>Задач с проверкой</dt><dd>281</dd></div>
        <div><dt>Запускаемых примеров</dt><dd>805</dd></div>
        <div><dt>Диаграмм</dt><dd>695</dd></div>
      </dl>
    </header>

    <section class="home-board__progress" v-if="ready && started">
      <div class="home-board__progress-head">
        <span class="home-board__eyebrow">Решено задач</span>
        <span class="home-board__progress-value">{{ overall.solved }} / {{ overall.total }}</span>
      </div>
      <div class="home-board__bar"><i :style="{ width: `${percent(overall)}%` }"></i></div>
    </section>

    <section class="home-board__parts">
      <article v-for="part in parts" :key="part.key" class="home-board__part">
        <header>
          <span class="home-board__eyebrow">
            {{ part.counts.total > 0 ? `${part.chapters} глав с задачами` : 'финальная работа' }}
          </span>
          <h2><a :href="part.entry">{{ part.title }}</a></h2>
        </header>
        <p>{{ part.goal }}</p>
        <template v-if="part.counts.total > 0">
          <div class="home-board__bar home-board__bar--thin">
            <i :style="{ width: `${percent(part.counts)}%` }"></i>
          </div>
          <span class="home-board__part-counts">
            {{ part.counts.solved }} / {{ part.counts.total }} задач
          </span>
        </template>
        <span v-else class="home-board__part-counts">задания проекта, без автопроверки</span>
      </article>
    </section>

    <section class="home-board__how">
      <h2 class="home-board__section-title">Как устроена работа</h2>
      <ol class="home-board__steps">
        <li>
          <h3>Читаете главу</h3>
          <p>Каждая тема строит модель языка и разбирает, где интуиция подводит.</p>
        </li>
        <li>
          <h3>Запускаете примеры</h3>
          <p>Примеры выполняются на странице: можно менять код и сразу видеть результат.</p>
        </li>
        <li>
          <h3>Решаете задачу</h3>
          <p>Решение проверяется набором проверок, а отчёт показывает, что именно не сошлось.</p>
        </li>
        <li>
          <h3>Работаете против стенда</h3>
          <p>UI, REST, gRPC и PostgreSQL поднимаются локально одной командой.</p>
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.home-board {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  display: grid;
  gap: 48px;
}

.home-board__eyebrow {
  font-family: var(--book-mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--book-ink-3);
  margin: 0;
}

.home-board__top {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
  gap: 48px;
  align-items: start;
  padding-bottom: 40px;
  border-bottom: 2px solid var(--book-ink);
}

.home-board__title {
  font-family: var(--book-serif);
  font-size: 46px;
  line-height: 1.1;
  letter-spacing: -0.02em;
  text-wrap: balance;
  margin: 10px 0 16px;
}

.home-board__lede {
  font-family: var(--book-serif);
  font-size: 18px;
  line-height: 1.6;
  color: var(--book-ink-2);
  max-width: 54ch;
  margin: 0;
}

.home-board__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 26px;
}

.home-board__cta {
  display: inline-flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 20px;
  background: var(--book-ink);
  color: var(--book-paper);
  font-weight: 600;
  text-decoration: none;
  border: 1px solid var(--book-ink);
}

.home-board__cta small {
  font-family: var(--book-mono);
  font-size: 11px;
  font-weight: 400;
  opacity: 0.75;
}

.home-board__cta--ghost {
  background: transparent;
  color: var(--book-ink);
  justify-content: center;
}

.home-board__cta:hover { border-color: var(--vp-c-brand-1); }

.home-board__facts {
  margin: 0;
  display: grid;
  gap: 1px;
  background: var(--book-rule);
  border: 1px solid var(--book-rule);
}

.home-board__facts > div {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  background: var(--vp-c-bg);
  padding: 12px 16px;
}

.home-board__facts dt {
  font-family: var(--book-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--book-ink-3);
}

.home-board__facts dd {
  margin: 0;
  font-family: var(--book-serif);
  font-size: 24px;
  font-variant-numeric: tabular-nums;
}

.home-board__progress-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
}

.home-board__progress-value {
  font-family: var(--book-mono);
  font-variant-numeric: tabular-nums;
  font-size: 14px;
}

.home-board__bar {
  height: 8px;
  background: var(--book-rule-soft);
}

.home-board__bar i {
  display: block;
  height: 100%;
  background: var(--vp-c-brand-1);
}

.home-board__bar--thin { height: 4px; }

.home-board__parts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1px;
  background: var(--book-rule);
  border: 1px solid var(--book-rule);
}

.home-board__part {
  background: var(--vp-c-bg);
  padding: 22px;
  display: grid;
  gap: 10px;
  align-content: start;
}

.home-board__part h2 {
  font-family: var(--book-serif);
  font-size: 22px;
  margin: 6px 0 0;
}

.home-board__part h2 a {
  color: inherit;
  text-decoration: none;
}

.home-board__part h2 a:hover { color: var(--vp-c-brand-1); }

.home-board__part p {
  margin: 0;
  color: var(--book-ink-2);
  font-size: 15px;
}

.home-board__part-counts {
  font-family: var(--book-mono);
  font-size: 11px;
  color: var(--book-ink-3);
  font-variant-numeric: tabular-nums;
}

.home-board__section-title {
  font-family: var(--book-serif);
  font-size: 26px;
  margin: 0 0 18px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--book-rule);
}

.home-board__steps {
  list-style: none;
  counter-reset: step;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 24px;
}

.home-board__steps li {
  counter-increment: step;
  display: grid;
  gap: 6px;
  align-content: start;
}

.home-board__steps li::before {
  content: counter(step);
  font-family: var(--book-mono);
  font-size: 11px;
  color: var(--book-ink-3);
}

.home-board__steps h3 {
  font-family: var(--book-serif);
  font-size: 18px;
  margin: 0;
}

.home-board__steps p {
  margin: 0;
  color: var(--book-ink-2);
  font-size: 15px;
}

@media (max-width: 860px) {
  .home-board__top { grid-template-columns: 1fr; gap: 32px; }
  .home-board__title { font-size: 34px; }
}
</style>

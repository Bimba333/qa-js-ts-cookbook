<script setup>
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import tasksByChapter from '../../tasks.generated.json'
import { bookEngineData } from '../../book.generated.mjs'
import { TASK_STATUS, readAllProgress } from '../composables/task-progress.js'
import {
  READER_STATES,
  accessSummary,
  readerState,
  refreshAccess,
  restoreAccess
} from '../composables/access.js'

// Прогресс и состояние читателя есть только в браузере: до монтирования
// страница показывает маршрут без отметок, а не расходится с тем, что увидит
// читатель.
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
    goal: 'Типы как проверка до запуска — и граница, где они бессильны',
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
    goal: 'Свой фреймворк против учебного стенда и честный аудит',
    entry: '/docs/04-final-project/250-project-requirements-and-readiness-criteria'
  }
]

const access = accessSummary()

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

/** Сколько глав части открыто без подписки — считается по данным сборки. */
function accessIn(partKey) {
  const own = Object.values(bookEngineData.chapters).filter(chapter => chapter.part === partKey)

  return {
    total: own.length,
    free: own.filter(chapter => chapter.access === 'free').length
  }
}

const parts = computed(() =>
  PARTS.map(part => {
    const own = chapters.value.filter(chapter => chapter.part === part.key)
    const taskIds = own.flatMap(chapter => chapter.taskIds)
    const byDirectory = Object.values(bookEngineData.chapters)
      .filter(chapter => chapter.path.startsWith(`docs/${part.key}/`))

    return {
      ...part,
      chapters: byDirectory.length,
      tasks: taskIds.length,
      counts: countIn(taskIds),
      free: byDirectory.filter(chapter => chapter.access === 'free').length
    }
  }))

const overall = computed(() => countIn(chapters.value.flatMap(chapter => chapter.taskIds)))

// Числа берутся из собранных данных книги, а не переписываются руками:
// иначе после каждой новой главы они молча расходятся с содержимым.
const facts = computed(() => {
  const statistics = bookEngineData.statistics

  return [
    { label: 'Глав', value: statistics.chapters },
    {
      label: 'Задач с проверкой',
      value: Object.values(tasksByChapter).reduce((sum, list) => sum + list.length, 0)
    },
    { label: 'Запускаемых примеров', value: statistics.examples },
    { label: 'Диаграмм', value: statistics.mermaid }
  ]
})

const next = computed(() => {
  const unfinished = chapters.value.find(chapter => {
    const counts = countIn(chapter.taskIds)

    return counts.solved < counts.total
  })

  return unfinished ?? null
})

const started = computed(() => Object.keys(progress.value).length > 0)

const state = computed(() => (ready.value ? readerState.value : READER_STATES.guest))

function percent(counts) {
  return counts.total === 0 ? 0 : Math.round((counts.solved / counts.total) * 100)
}

onMounted(async () => {
  progress.value = readAllProgress()
  restoreAccess()
  ready.value = true

  try {
    await refreshAccess()
  } catch {
    // Недоступный сервис не должен ломать главную: состояние доступа
    // остаётся последним известным.
  }
})
</script>

<template>
  <div class="home-board">
    <header class="home-board__top">
      <div>
        <p class="home-board__eyebrow">JavaScript и TypeScript для Automation QA</p>
        <h1 class="home-board__title">
          От синтаксиса до своего фреймворка автотестов
        </h1>
        <p class="home-board__lede">
          Книга для тестировщика, который хочет писать автотесты на JavaScript и
          TypeScript: разобраться в языке, а затем собрать фреймворк с UI, REST,
          gRPC и базой данных — против настоящего стенда, а не учебных заглушек.
        </p>

        <div class="home-board__actions">
          <a v-if="ready && started && next" class="home-board__cta" :href="withBase(next.link)">
            Продолжить
            <small>{{ next.number }}. {{ next.title }}</small>
          </a>
          <a
            v-else
            class="home-board__cta"
            :href="withBase('/docs/00-introduction/01-about-course')"
          >
            Начать читать
            <small>бесплатно, без регистрации</small>
          </a>
          <a class="home-board__cta home-board__cta--ghost" :href="withBase('/docs/progress')">
            {{ state === READER_STATES.guest ? 'Войти' : 'Прогресс и подписка' }}
          </a>
        </div>
      </div>

      <dl class="home-board__facts">
        <div v-for="fact in facts" :key="fact.label">
          <dt>{{ fact.label }}</dt><dd>{{ fact.value }}</dd>
        </div>
      </dl>
    </header>

    <section class="home-board__why">
      <h2 class="home-board__section-title">Чем эта книга отличается</h2>
      <div class="home-board__why-grid">
        <article>
          <h3>Задачи проверяет машина</h3>
          <p>
            Решение прогоняется набором проверок прямо в браузере, и отчёт
            говорит, <em>что именно</em> не сошлось. Не «правильный ответ
            откроется ниже», а падение с объяснением.
          </p>
        </article>
        <article>
          <h3>Настоящий стенд, а не заглушки</h3>
          <p>
            UI, REST, gRPC и PostgreSQL поднимаются одной командой в Docker.
            Часть задач решается против него локально — с оптимистической
            блокировкой, кодами gRPC и живыми ошибками базы.
          </p>
        </article>
        <article>
          <h3>Разбор ошибок, которые не падают</h3>
          <p>
            Главная опасность автотеста — зелёный отчёт при неверной проверке.
            Книга показывает такие места отдельно: перекрытый элемент, промис
            вместо значения, пустой массив, который всё подтверждает.
          </p>
        </article>
        <article>
          <h3>Финальный проект с аудитом</h3>
          <p>
            В конце читатель собирает фреймворк по слоям и проводит аудит
            готовности. Аудит учебного проекта намеренно заканчивается вердиктом
            «нужна доработка» — так честнее, чем выдуманное «всё готово».
          </p>
        </article>
      </div>
    </section>

    <section class="home-board__access">
      <h2 class="home-board__section-title">Что открыто и что даёт подписка</h2>
      <div class="home-board__access-grid">
        <article class="home-board__tier">
          <p class="home-board__eyebrow">Без регистрации</p>
          <p class="home-board__tier-value">{{ access.free }}</p>
          <p class="home-board__tier-text">
            глав открыто сразу, с примерами и задачами. Прогресс при этом не
            сохраняется — он живёт только до закрытия браузера.
          </p>
        </article>
        <article class="home-board__tier">
          <p class="home-board__eyebrow">После входа</p>
          <p class="home-board__tier-value">{{ access.free }}</p>
          <p class="home-board__tier-text">
            те же главы, но решённые задачи запоминаются и переносятся между
            устройствами вместе с учётной записью.
          </p>
        </article>
        <article
          class="home-board__tier home-board__tier--paid"
          :class="{ 'home-board__tier--active': state === READER_STATES.subscriber }"
        >
          <p class="home-board__eyebrow">Подписка</p>
          <p class="home-board__tier-value">{{ access.total }}</p>
          <p class="home-board__tier-text">
            все главы, включая TypeScript, Automation QA и финальный проект —
            остальные {{ access.paid }} главы книги.
          </p>
          <p v-if="ready && state === READER_STATES.subscriber" class="home-board__tier-note">
            Подписка активна.
          </p>
          <p v-else class="home-board__tier-note">
            <a :href="withBase('/docs/progress')">Открыть подписку</a>
          </p>
        </article>
      </div>
    </section>

    <section class="home-board__progress" v-if="ready && started">
      <div class="home-board__progress-head">
        <span class="home-board__eyebrow">Решено задач</span>
        <span class="home-board__progress-value">{{ overall.solved }} / {{ overall.total }}</span>
      </div>
      <div class="home-board__bar"><i :style="{ width: `${percent(overall)}%` }"></i></div>
    </section>

    <section class="home-board__parts-block">
      <h2 class="home-board__section-title">
        Маршрут
        <a class="home-board__section-link" :href="withBase('/docs/map')">карта всех глав →</a>
      </h2>
      <div class="home-board__parts">
        <article v-for="part in parts" :key="part.key" class="home-board__part">
          <header>
            <span class="home-board__eyebrow">
              {{ part.chapters }} глав · {{ part.tasks }} задач
            </span>
            <h2><a :href="withBase(part.entry)">{{ part.title }}</a></h2>
          </header>
          <p>{{ part.goal }}</p>
          <div class="home-board__bar home-board__bar--thin">
            <i :style="{ width: `${percent(part.counts)}%` }"></i>
          </div>
          <span class="home-board__part-counts">
            {{ part.counts.solved }} / {{ part.counts.total }} задач решено ·
            {{ part.free > 0 ? `${part.free} глав открыто` : 'по подписке' }}
          </span>
        </article>
      </div>
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

    <section class="home-board__limits">
      <h2 class="home-board__section-title">Чего в книге нет</h2>
      <ul>
        <li>Готовых решений «скопировать в свой проект» — код собирается по ходу и объясняется.</li>
        <li>Обзора всех инструментов рынка: стек один — Playwright, REST, gRPC, PostgreSQL.</li>
        <li>Английской версии: переведено несколько глав, работа заморожена в пользу русской.</li>
        <li>Обещания «выучить за неделю»: объём книги — {{ facts[0].value }} глав.</li>
      </ul>
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

.home-board__why-grid,
.home-board__access-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1px;
  background: var(--book-rule);
  border: 1px solid var(--book-rule);
}

.home-board__why-grid article,
.home-board__tier {
  background: var(--vp-c-bg);
  padding: 22px;
  display: grid;
  gap: 8px;
  align-content: start;
}

.home-board__why-grid h3 {
  font-family: var(--book-serif);
  font-size: 19px;
  margin: 0;
}

.home-board__why-grid p,
.home-board__tier-text {
  margin: 0;
  color: var(--book-ink-2);
  font-size: 15px;
  line-height: 1.55;
}

.home-board__tier-value {
  margin: 0;
  font-family: var(--book-serif);
  font-size: 40px;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.home-board__tier--paid {
  border-top: 3px solid var(--vp-c-brand-1);
}

.home-board__tier--active {
  border-top-color: var(--book-pass);
}

.home-board__tier-note {
  margin: 4px 0 0;
  font-family: var(--book-mono);
  font-size: 12px;
  color: var(--book-ink-3);
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
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  flex-wrap: wrap;
}

.home-board__section-link {
  font-family: var(--book-mono);
  font-size: 12px;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.home-board__section-link:hover { text-decoration: underline; }

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

.home-board__limits ul {
  margin: 0;
  padding-left: 20px;
  display: grid;
  gap: 8px;
}

.home-board__limits li {
  color: var(--book-ink-2);
  font-size: 15px;
  line-height: 1.55;
}

@media (max-width: 860px) {
  .home-board__top { grid-template-columns: 1fr; gap: 32px; }
  .home-board__title { font-size: 34px; }
}
</style>

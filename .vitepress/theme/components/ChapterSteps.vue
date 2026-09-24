<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import tasksByChapter from '../../tasks.generated.json'
import { TASK_STATUS, progressState } from '../composables/task-progress.js'

const props = defineProps({
  chapter: { type: String, required: true }
})

const QUESTION_HEADINGS = ['Проверьте себя', 'Быстрая проверка', 'Quick Check']
const PRACTICE_HEADINGS = ['Практика', 'Practice']

const progress = ref({})
const ready = ref(false)
const active = ref('theory')

// Разметка страницы — единый поток, поэтому разделы находятся один раз
// после монтирования и дальше только показываются или скрываются.
// Ссылка реактивна: от найденных разделов зависит состав шагов.
const segments = ref(null)

const tasks = computed(() => tasksByChapter[props.chapter] ?? [])

const steps = computed(() => {
  const found = segments.value
  const list = [{ key: 'theory', kind: 'theory', label: 'Т', title: 'Теория', state: 'theory' }]

  // Вопросы и практика есть не в каждой главе, а задачи с проверкой — тем
  // более: шаг появляется только там, где ему соответствует содержимое.
  if (found?.questions.length) {
    list.push({
      key: 'questions',
      kind: 'questions',
      label: '?',
      title: 'Вопросы для самопроверки',
      state: 'questions'
    })
  }

  tasks.value.forEach((task, index) => {
    const state = ready.value
      ? progress.value[task.id]?.status ?? TASK_STATUS.notStarted
      : TASK_STATUS.notStarted

    const stateTitle = {
      [TASK_STATUS.solved]: 'решена',
      [TASK_STATUS.attempted]: 'есть попытки',
      [TASK_STATUS.notStarted]: 'не начата'
    }[state]

    list.push({
      key: `task-${index}`,
      kind: 'task',
      index,
      label: String(index + 1),
      title: `${task.title} — ${stateTitle}`,
      taskId: task.id,
      state,
      stand: task.runner === 'stand'
    })
  })

  if (found?.practice.length) {
    list.push({ key: 'practice', kind: 'practice', label: 'П', title: 'Практика', state: 'practice' })
  }

  return list
})

const solved = computed(() =>
  steps.value.filter(step => step.state === TASK_STATUS.solved).length)

const activeIndex = computed(() => steps.value.findIndex(step => step.key === active.value))
const activeStep = computed(() => steps.value[activeIndex.value] ?? steps.value[0])

function headingText(node) {
  return node.textContent?.replace('​', '').trim() ?? ''
}

/**
 * Делит содержимое главы на шаги.
 *
 * Границы — заголовки второго уровня: до самопроверки идёт теория, дальше
 * вопросы, затем блок задач с проверкой и практика. Карточка главы и сама
 * полоса в деление не попадают: они видны на любом шаге.
 */
function collectSegments(container) {
  const found = { theory: [], questions: [], tasks: null, practice: [], always: [] }
  let current = 'theory'

  for (const node of container.children) {
    if (node.classList.contains('book-chapter-card') || node.classList.contains('chapter-steps')) {
      continue
    }

    // Песочница — инструмент, а не часть раздела: она нужна и при чтении
    // теории, и при решении задачи, поэтому в деление на шаги не попадает.
    if (node.querySelector?.('.code-runner--sandbox')) {
      found.always.push(node)
      continue
    }

    if (node.classList.contains('book-checked-tasks')) {
      found.tasks = node
      current = 'practice'
      continue
    }

    if (node.tagName === 'H2') {
      const text = headingText(node)

      if (QUESTION_HEADINGS.some(title => text.startsWith(title))) {
        current = 'questions'
      } else if (PRACTICE_HEADINGS.some(title => text.startsWith(title))) {
        current = 'practice'
      }
    }

    found[current].push(node)
  }

  return found
}

function show(nodes, visible) {
  for (const node of nodes) {
    node.classList.toggle('chapter-step-hidden', !visible)
  }
}

function apply() {
  const found = segments.value

  if (!found) return

  const step = activeStep.value

  show(found.theory, step.kind === 'theory')
  show(found.questions, step.kind === 'questions')
  show(found.practice, step.kind === 'practice')

  if (found.tasks) {
    found.tasks.classList.toggle('chapter-step-hidden', step.kind !== 'task')

    const cards = found.tasks.querySelectorAll('.code-task')

    cards.forEach((card, index) => {
      card.classList.toggle('chapter-step-hidden', index !== step.index)
    })
  }
}

function select(key, { scroll = true } = {}) {
  active.value = key

  nextTick(() => {
    apply()

    if (!scroll) return

    // Шаг всегда открывается сверху: иначе читатель попадает в середину
    // нового содержимого на позиции прокрутки от предыдущего.
    const anchor = document.querySelector('.chapter-steps')

    if (anchor) {
      const top = anchor.getBoundingClientRect().top + window.scrollY - 72

      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    }
  })
}

function move(offset) {
  const next = steps.value[activeIndex.value + offset]

  if (next) select(next.key)
}

function openFromHash() {
  const hash = decodeURIComponent(window.location.hash.replace('#', ''))

  if (!hash) return false

  const taskIndex = tasks.value.findIndex(task => `task-${task.id}` === hash)

  if (taskIndex >= 0) {
    active.value = `task-${taskIndex}`

    return true
  }

  return false
}

onMounted(() => {
  progress.value = progressState().value ?? {}
  ready.value = true

  const card = document.querySelector('.book-chapter-card')
  const container = card?.parentElement

  if (!container) return

  segments.value = collectSegments(container)

  openFromHash()
  apply()
})

onBeforeUnmount(() => {
  const found = segments.value

  // Страница уходит целиком, но при навигации внутри сайта элементы могут
  // переиспользоваться: возвращаем их в обычное состояние.
  if (!found) return

  show(found.theory, true)
  show(found.questions, true)
  show(found.practice, true)

  if (found.tasks) {
    found.tasks.classList.remove('chapter-step-hidden')
    found.tasks
      .querySelectorAll('.code-task')
      .forEach(card => card.classList.remove('chapter-step-hidden'))
  }
})

watch(progress, apply, { deep: true })
</script>

<template>
  <nav v-if="steps.length > 1" class="chapter-steps" aria-label="Шаги главы">
    <button
      class="chapter-steps__arrow"
      type="button"
      :disabled="activeIndex <= 0"
      aria-label="Предыдущий шаг"
      @click="move(-1)"
    >←</button>

    <ol class="chapter-steps__list" role="tablist">
      <li v-for="step in steps" :key="step.key">
        <button
          type="button"
          role="tab"
          class="chapter-steps__step"
          :class="[
            `chapter-steps__step--${step.state}`,
            {
              'chapter-steps__step--stand': step.stand,
              'chapter-steps__step--active': step.key === active
            }
          ]"
          :aria-selected="step.key === active"
          :title="step.title"
          :aria-label="step.title"
          @click="select(step.key)"
        >{{ step.label }}</button>
      </li>
    </ol>

    <button
      class="chapter-steps__arrow"
      type="button"
      :disabled="activeIndex >= steps.length - 1"
      aria-label="Следующий шаг"
      @click="move(1)"
    >→</button>

    <span class="chapter-steps__current">{{ activeStep?.title }}</span>
    <span v-if="tasks.length" class="chapter-steps__counter">
      решено {{ solved }} / {{ tasks.length }}
    </span>
  </nav>
</template>

<style scoped>
.chapter-steps {
  position: sticky;
  top: var(--vp-nav-height, 64px);
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin: 0 0 24px;
  padding: 10px 0;
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--book-rule);
}

.chapter-steps__list {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
}

.chapter-steps__step,
.chapter-steps__arrow {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border: 1px solid var(--book-rule);
  background: var(--vp-c-bg);
  color: var(--book-ink-3);
  font-family: var(--book-mono);
  font-size: 11px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
}

.chapter-steps__arrow:disabled {
  opacity: 0.35;
  cursor: default;
}

.chapter-steps__step:hover,
.chapter-steps__arrow:not(:disabled):hover {
  border-color: var(--book-ink);
  color: var(--book-ink);
}

.chapter-steps__step--theory,
.chapter-steps__step--questions,
.chapter-steps__step--practice {
  border-color: var(--book-ink);
  color: var(--book-ink);
}

.chapter-steps__step--solved {
  border-color: var(--book-pass);
  background: var(--book-pass);
  color: var(--book-paper);
}

.chapter-steps__step--attempted {
  border-color: var(--book-started);
  background: var(--book-started-soft);
  color: var(--book-started);
}

/* Задача стенда решается локально — угол срезан, чтобы это было видно
   до нажатия. */
.chapter-steps__step--stand {
  clip-path: polygon(0 0, 100% 0, 100% 72%, 72% 100%, 0 100%);
}

/* Текущий шаг отмечен снизу, как закладка: заливка уже занята состоянием. */
.chapter-steps__step--active {
  box-shadow: inset 0 -3px 0 var(--vp-c-brand-1);
}

.chapter-steps__current {
  font-family: var(--book-serif);
  font-size: 15px;
  color: var(--book-ink);
}

.chapter-steps__counter {
  margin-left: auto;
  font-family: var(--book-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--book-ink-3);
  font-variant-numeric: tabular-nums;
}

.chapter-steps__step:focus-visible,
.chapter-steps__arrow:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

@media (max-width: 640px) {
  .chapter-steps__current { display: none; }
}
</style>

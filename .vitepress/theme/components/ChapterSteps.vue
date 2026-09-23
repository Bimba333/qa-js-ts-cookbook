<script setup>
import { computed, onMounted, ref } from 'vue'
import tasksByChapter from '../../tasks.generated.json'
import { TASK_STATUS, progressState } from '../composables/task-progress.js'

const props = defineProps({
  chapter: { type: String, required: true }
})

// Прогресс живёт в браузере: до монтирования все шаги выглядят нерешёнными,
// иначе отрисованная на сервере полоса разошлась бы с настоящей.
const progress = ref({})
const ready = ref(false)

onMounted(() => {
  progress.value = progressState().value ?? {}
  ready.value = true
})

const tasks = computed(() => tasksByChapter[props.chapter] ?? [])

const steps = computed(() => {
  const theory = {
    key: 'theory',
    kind: 'theory',
    label: 'Т',
    title: 'Теория главы',
    state: 'theory',
    href: null
  }

  // Теоретические вопросы — отдельный шаг: они проверяют понимание,
  // а не код, и потому не смешиваются с задачами.
  const questions = {
    key: 'questions',
    kind: 'questions',
    label: '?',
    title: 'Теоретические вопросы',
    state: 'questions',
    href: '#questions'
  }

  const taskSteps = tasks.value.map((task, index) => {
    const state = ready.value
      ? progress.value[task.id]?.status ?? TASK_STATUS.notStarted
      : TASK_STATUS.notStarted

    const stateTitle = {
      [TASK_STATUS.solved]: 'решена',
      [TASK_STATUS.attempted]: 'есть попытки',
      [TASK_STATUS.notStarted]: 'не начата'
    }[state]

    return {
      key: task.id,
      kind: 'task',
      label: String(index + 1),
      title: `${task.title} — ${stateTitle}`,
      state,
      href: `#task-${task.id}`,
      stand: task.runner === 'stand'
    }
  })

  return [theory, questions, ...taskSteps]
})

const solved = computed(() =>
  steps.value.filter(step => step.state === TASK_STATUS.solved).length)

const QUESTION_HEADINGS = ['Проверьте себя', 'Быстрая проверка', 'Quick Check']

function findQuestionsSection() {
  const headings = document.querySelectorAll('.vp-doc h2')

  for (const heading of headings) {
    const text = heading.textContent?.replace('\u200b', '').trim() ?? ''

    if (QUESTION_HEADINGS.some(title => text.startsWith(title))) {
      return heading
    }
  }

  return null
}

function goTo(step, event) {
  event.preventDefault()

  const target = step.kind === 'questions'
    ? findQuestionsSection()
    : step.href
      ? document.querySelector(step.href)
      : document.querySelector('.book-chapter-card')

  if (!target) return

  target.scrollIntoView({ behavior: 'smooth', block: 'start' })

  if (step.kind === 'task') {
    // Адрес обновляется без перезагрузки: ссылкой на задачу можно поделиться.
    history.replaceState(null, '', step.href)
  }
}
</script>

<template>
  <nav v-if="tasks.length" class="chapter-steps" aria-label="Шаги главы">
    <ol class="chapter-steps__list">
      <li v-for="step in steps" :key="step.key">
        <a
          class="chapter-steps__step"
          :class="[
            `chapter-steps__step--${step.state}`,
            { 'chapter-steps__step--stand': step.stand }
          ]"
          :href="step.href ?? '#'"
          :title="step.title"
          :aria-label="step.title"
          @click="goTo(step, $event)"
        >{{ step.label }}</a>
      </li>
    </ol>

    <span class="chapter-steps__counter">
      {{ solved }} / {{ tasks.length }}
    </span>
  </nav>
</template>

<style scoped>
.chapter-steps {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin: 14px 0 0;
}

.chapter-steps__list {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
}

.chapter-steps__step {
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
  text-decoration: none;
  transition: border-color 0.15s ease, color 0.15s ease;
}

.chapter-steps__step:hover {
  border-color: var(--book-ink);
  color: var(--book-ink);
}

/* Первый шаг — теория: он всегда доступен и потому отмечен чернилами,
   а не цветом состояния. */
.chapter-steps__step--theory {
  border-color: var(--book-ink);
  color: var(--book-ink);
}

.chapter-steps__step--questions {
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

.chapter-steps__counter {
  font-family: var(--book-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--book-ink-3);
  font-variant-numeric: tabular-nums;
}

.chapter-steps__step:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .chapter-steps__step { transition: none; }
}
</style>

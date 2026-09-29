<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import {
  READER_STATES,
  accessSummary,
  canRead,
  chapterAccess,
  entitlementState,
  isChapter,
  readerState,
  refreshAccess,
  restoreAccess
} from '../composables/access.js'

// Состояние читателя известно только в браузере: в отрендеренной на сервере
// странице учётной записи ещё нет, и расходиться с ней нельзя.
const ready = ref(false)
const route = useRoute()
const { page } = useData()

const docPath = computed(() => `docs/${page.value.relativePath.replace(/^docs\//, '')}`)
const level = computed(() => chapterAccess(docPath.value))
const allowed = computed(() => canRead(docPath.value))
const summary = accessSummary()

const state = computed(() => {
  if (!ready.value) return READER_STATES.guest

  return readerState.value
})

// Страницы прогресса и главная главами не являются: правила доступа их не
// касаются, иначе подписка закрыла бы собственный интерфейс книги.
const chapterPage = computed(() => isChapter(docPath.value))
const shouldHide = computed(() => ready.value && chapterPage.value && level.value === 'paid' && !allowed.value)

/**
 * Скрывает содержимое главы, оставляя видимыми первые абзацы.
 *
 * Работает по разметке страницы, как полоса шагов: элементы не удаляются, а
 * получают класс. Это осознанно — текст всё равно лежит в сборке, поэтому
 * прятать его «надёжнее» здесь бессмысленно (см. комментарий в access.js).
 */
function applyHiding() {
  if (typeof document === 'undefined') return

  const container = document.querySelector('.vp-doc > div')

  if (!container) return

  const nodes = [...container.children]
  let visibleParagraphs = 0

  for (const node of nodes) {
    if (node.classList.contains('chapter-access')) continue

    // Карточка главы остаётся видимой всегда: в ней заголовок и состав главы —
    // именно то, по чему читатель решает, нужна ли ему подписка.
    const isCard = node.classList.contains('book-chapter-card')
    const isHeading = node.tagName === 'H1'
    const isParagraph = node.tagName === 'P'

    if (!shouldHide.value) {
      node.classList.remove('chapter-access-hidden')
      continue
    }

    if (isCard || isHeading || (isParagraph && visibleParagraphs < 2)) {
      if (isParagraph) visibleParagraphs += 1
      node.classList.remove('chapter-access-hidden')
      continue
    }

    node.classList.add('chapter-access-hidden')
  }
}

onMounted(async () => {
  restoreAccess()
  ready.value = true
  applyHiding()

  try {
    await refreshAccess()
  } catch {
    // Недоступный сервис не должен ломать чтение: остаётся последнее
    // известное состояние из локального хранилища.
  }

  applyHiding()
})

watch([shouldHide, () => route.path], applyHiding)
</script>

<template>
  <aside v-if="chapterPage && level === 'paid'" class="chapter-access" :class="{ 'chapter-access--open': allowed }">
    <p class="chapter-access__label">
      {{ allowed ? 'Глава подписки — открыта' : 'Глава входит в подписку' }}
    </p>

    <template v-if="!allowed">
      <p class="chapter-access__text">
        Открыто без подписки: {{ summary.free }} из {{ summary.total }} глав. Эта — из остальных
        {{ summary.paid }}.
      </p>

      <p v-if="state === READER_STATES.guest" class="chapter-access__text">
        Прогресс сейчас не сохраняется: он появится после входа в учётную запись.
      </p>

      <p v-else class="chapter-access__text">
        Вы вошли, прогресс сохраняется. Полный доступ к книге даёт подписка.
      </p>

      <p class="chapter-access__actions">
        <a class="chapter-access__link" :href="withBase('/docs/progress')">
          {{ state === READER_STATES.guest ? 'Войти или создать запись' : 'Открыть подписку' }}
        </a>
      </p>
    </template>

    <p v-else-if="entitlementState.validUntil" class="chapter-access__text">
      Подписка действует до
      {{ new Date(entitlementState.validUntil).toLocaleDateString('ru-RU') }}.
    </p>
  </aside>
</template>

<style scoped>
.chapter-access {
  margin: 0 0 28px;
  padding: 16px 18px;
  border: 1px solid var(--book-rule);
  border-left: 3px solid var(--vp-c-brand-1);
  background: var(--book-surface);
}

.chapter-access--open {
  border-left-color: var(--book-pass);
}

.chapter-access__label {
  margin: 0 0 8px;
  font-family: var(--book-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--book-ink-3);
}

.chapter-access__text {
  margin: 0 0 6px;
  font-family: var(--book-serif);
  font-size: 15px;
  line-height: 1.5;
  color: var(--book-ink-2);
}

.chapter-access__actions {
  margin: 12px 0 0;
}

.chapter-access__link {
  display: inline-block;
  padding: 7px 14px;
  border: 1px solid var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  font-family: var(--book-mono);
  font-size: 12px;
  text-decoration: none;
}

.chapter-access__link:hover {
  background: var(--vp-c-brand-1);
  color: var(--book-paper);
}
</style>

<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  PROVIDERS,
  createProvider,
  readSession,
  readSettings,
  syncNow,
  writeSession,
  writeSettings
} from '../composables/progress-sync.js'

const emit = defineEmits(['changed'])

const settings = ref({ provider: PROVIDERS.none, baseUrl: '', projectUrl: '', anonKey: '' })
const session = ref(null)
const email = ref('')
const password = ref('')
const busy = ref(false)
const message = ref('')
const problem = ref('')

onMounted(() => {
  settings.value = readSettings()
  session.value = readSession()
})

const needsService = computed(() => settings.value.provider === PROVIDERS.service)
const needsSupabase = computed(() => settings.value.provider === PROVIDERS.supabase)
const configured = computed(() =>
  needsService.value
    ? settings.value.baseUrl.trim().length > 0
    : needsSupabase.value
      ? settings.value.projectUrl.trim().length > 0 && settings.value.anonKey.trim().length > 0
      : false)

function saveSettings() {
  writeSettings({ ...settings.value })
  message.value = 'Настройки сохранены в этом браузере.'
  problem.value = ''
}

async function run(action, successMessage) {
  busy.value = true
  message.value = ''
  problem.value = ''

  try {
    const result = await action()

    message.value = typeof successMessage === 'function' ? successMessage(result) : successMessage
    emit('changed')
  } catch (error) {
    problem.value = error instanceof Error ? error.message : String(error)
  } finally {
    busy.value = false
  }
}

function authenticate(kind) {
  return run(async () => {
    const provider = createProvider(settings.value)
    const account = kind === 'register'
      ? await provider.register(email.value.trim(), password.value)
      : await provider.signIn(email.value.trim(), password.value)

    session.value = account
    writeSession(account)
    password.value = ''

    // Сразу после входа прогресс сводится: иначе читатель увидит пустую
    // картину до первого нажатия «Синхронизировать».
    return syncNow(settings.value, account)
  }, result => `Вход выполнен. Перенесено с сервера: ${result.pulled}, отправлено: ${result.pushed}.`)
}

function sync() {
  return run(
    () => syncNow(settings.value, session.value),
    result => `Синхронизировано. С сервера: ${result.pulled}, отправлено: ${result.pushed}, всего в учётной записи: ${result.total}.`
  )
}

function signOut() {
  return run(async () => {
    const provider = createProvider(settings.value)

    await provider.signOut(session.value)
    session.value = null
    writeSession(null)
  }, 'Выход выполнен. Прогресс остался в этом браузере.')
}
</script>

<template>
  <section class="account-panel">
    <h3 class="account-panel__title">Учётная запись</h3>

    <p class="account-panel__note">
      Без учётной записи прогресс хранится только в этом браузере. Учётная запись
      переносит его между устройствами: снимки объединяются, и решённая задача
      не становится обратно попыткой.
    </p>

    <label class="account-panel__field">
      Где хранить прогресс
      <select v-model="settings.provider" @change="saveSettings">
        <option :value="PROVIDERS.none">Только в этом браузере</option>
        <option :value="PROVIDERS.service">Свой сервис книги</option>
        <option :value="PROVIDERS.supabase">Supabase</option>
      </select>
    </label>

    <template v-if="needsService">
      <label class="account-panel__field">
        Адрес сервиса
        <input v-model="settings.baseUrl" type="url" placeholder="http://127.0.0.1:4320" @change="saveSettings">
      </label>
    </template>

    <template v-if="needsSupabase">
      <label class="account-panel__field">
        Адрес проекта
        <input v-model="settings.projectUrl" type="url" placeholder="https://project.supabase.co" @change="saveSettings">
      </label>
      <label class="account-panel__field">
        Публичный ключ
        <input v-model="settings.anonKey" type="text" autocomplete="off" @change="saveSettings">
      </label>
    </template>

    <template v-if="configured && !session">
      <label class="account-panel__field">
        Почта
        <input v-model="email" type="email" autocomplete="username">
      </label>
      <label class="account-panel__field">
        Пароль
        <input v-model="password" type="password" autocomplete="current-password">
      </label>
      <div class="account-panel__actions">
        <button type="button" :disabled="busy" @click="authenticate('login')">Войти</button>
        <button type="button" :disabled="busy" @click="authenticate('register')">Создать запись</button>
      </div>
    </template>

    <template v-if="session">
      <p class="account-panel__signed">Вход выполнен: {{ session.email }}</p>
      <div class="account-panel__actions">
        <button type="button" :disabled="busy" @click="sync">Синхронизировать</button>
        <button type="button" :disabled="busy" @click="signOut">Выйти</button>
      </div>
    </template>

    <p v-if="message" class="account-panel__message" role="status">{{ message }}</p>
    <p v-if="problem" class="account-panel__problem" role="alert">{{ problem }}</p>
  </section>
</template>

<style scoped>
.account-panel {
  display: grid;
  gap: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 20px;
}

.account-panel__title {
  margin: 0;
  font-size: 18px;
}

.account-panel__note {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.account-panel__field {
  display: grid;
  gap: 4px;
  max-width: 420px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.account-panel__field input,
.account-panel__field select {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 8px 10px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font: inherit;
}

.account-panel__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.account-panel__actions button {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 8px 14px;
  background: var(--vp-c-bg-soft);
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.account-panel__actions button:disabled {
  opacity: 0.6;
  cursor: default;
}

.account-panel__signed {
  margin: 0;
  font-weight: 600;
}

.account-panel__message {
  margin: 0;
  color: var(--vp-c-brand-1);
}

.account-panel__problem {
  margin: 0;
  color: var(--vp-c-danger-1);
}
</style>

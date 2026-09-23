/**
 * Проверка сервиса прогресса от начала до конца.
 *
 * Проверяется не только «двести ответов»: слияние снимков должно быть таким,
 * чтобы прогресс нельзя было откатить устаревшим устройством.
 */
const BASE = process.env.PLATFORM_BASE_URL ?? 'http://127.0.0.1:4320'

const failures = []

function check(name, condition, details = '') {
  if (condition) {
    console.log(`  PASS  ${name}`)
  } else {
    console.log(`  FAIL  ${name}${details ? ` — ${details}` : ''}`)
    failures.push(name)
  }
}

async function call(method, path, { token, body } = {}) {
  const response = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {})
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  })

  const text = await response.text()

  return { status: response.status, body: text.length > 0 ? JSON.parse(text) : null }
}

const ready = await call('GET', '/health/ready')
check('сервис отвечает на проверку готовности', ready.status === 200)

const email = `reader-${Date.now()}-${Math.floor(Math.random() * 100000)}@example.test`
const password = 'educational-password'

const registered = await call('POST', '/api/v1/auth/register', { body: { email, password } })
check('регистрация проходит', registered.status === 201, `код ${registered.status}`)
check('выдан токен', typeof registered.body?.token === 'string')

const duplicate = await call('POST', '/api/v1/auth/register', { body: { email, password } })
check('повторная регистрация отклоняется', duplicate.status === 409)

const shortPassword = await call('POST', '/api/v1/auth/register', {
  body: { email: `short-${Date.now()}@example.test`, password: '123' }
})
check('короткий пароль отклоняется', shortPassword.status === 400)

const wrong = await call('POST', '/api/v1/auth/login', { body: { email, password: 'неверный-пароль' } })
check('неверный пароль отклоняется', wrong.status === 401)

const loggedIn = await call('POST', '/api/v1/auth/login', { body: { email, password } })
check('вход выдаёт новый токен', loggedIn.status === 200 && loggedIn.body.token !== registered.body.token)

const token = loggedIn.body.token

const anonymous = await call('GET', '/api/v1/progress')
check('без токена прогресс недоступен', anonymous.status === 401)

const empty = await call('GET', '/api/v1/progress', { token })
check('у нового читателя прогресс пуст', empty.status === 200 && Object.keys(empty.body.tasks).length === 0)

const firstPush = await call('PUT', '/api/v1/progress', {
  token,
  body: { tasks: { 'js-07-counter': { status: 'solved', attempts: 2, hintsUsed: 1 } } }
})
check('снимок принимается', firstPush.status === 200)
check('задача сохранена', firstPush.body.tasks['js-07-counter'].status === 'solved')

const stalePush = await call('PUT', '/api/v1/progress', {
  token,
  body: { tasks: { 'js-07-counter': { status: 'attempted', attempts: 1, hintsUsed: 0 } } }
})
check('устаревший снимок не откатывает решённое',
  stalePush.body.tasks['js-07-counter'].status === 'solved')
check('счётчики не уменьшаются',
  stalePush.body.tasks['js-07-counter'].attempts === 2 &&
  stalePush.body.tasks['js-07-counter'].hintsUsed === 1)

const secondDevice = await call('PUT', '/api/v1/progress', {
  token,
  body: { tasks: { 'ts-117-enum-leaves-code': { status: 'solved', attempts: 1 } } }
})
check('второе устройство добавляет своё, не стирая чужое',
  Object.keys(secondDevice.body.tasks).sort().join(',') ===
  'js-07-counter,ts-117-enum-leaves-code')

const broken = await call('PUT', '/api/v1/progress', { token, body: { tasks: { 'x': { status: 'придумал' } } } })
check('снимок неверной формы отклоняется', broken.status === 400)

const stillThere = await call('GET', '/api/v1/progress', { token })
check('после отказа данные на месте', Object.keys(stillThere.body.tasks).length === 2)

const otherEmail = `other-${Date.now()}@example.test`
const other = await call('POST', '/api/v1/auth/register', { body: { email: otherEmail, password } })
const otherProgress = await call('GET', '/api/v1/progress', { token: other.body.token })
check('чужой прогресс не виден', Object.keys(otherProgress.body.tasks).length === 0)

const loggedOut = await call('POST', '/api/v1/auth/logout', { token })
check('выход принимается', loggedOut.status === 204)

const afterLogout = await call('GET', '/api/v1/progress', { token })
check('после выхода токен не работает', afterLogout.status === 401)

console.log(`\nИтог: ${failures.length === 0 ? 'все проверки пройдены' : `не пройдено ${failures.length}`}`)
process.exit(failures.length === 0 ? 0 : 1)

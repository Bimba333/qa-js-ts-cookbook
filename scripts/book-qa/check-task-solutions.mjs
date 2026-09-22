/**
 * Проверяет, что эталонное решение каждой задачи проходит её собственные
 * проверки, а стартовый код — нет.
 *
 * Без первого условия в книгу попадёт задача, которую невозможно решить.
 * Без второго — задача, которая засчитывается сразу, не требуя работы.
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import { transform } from 'sucrase'

import { expect } from '../book-engine/expect.mjs'

const TASKS_FILE = path.join(process.cwd(), '.vitepress', 'tasks.generated.json')
const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor

if (!fs.existsSync(TASKS_FILE)) {
  console.error('Данные задач не собраны. Выполните: npm run tasks:build')
  process.exit(1)
}

const tasks = Object.values(JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'))).flat()
const browserTasks = tasks.filter(task => task.runner === 'browser')
const problems = []

function prepare(code, lang) {
  return lang === 'ts' ? transform(code, { transforms: ['typescript'] }).code : code
}

/** Запускает проверки задачи поверх переданного кода и считает пройденные. */
async function runChecks(task, code) {
  let passed = 0
  const failures = []

  for (const check of task.tests) {
    try {
      // Код решения и код проверки выполняются в одном теле функции:
      // объявления решения видны проверке, а ошибка доходит до await.
      const script = `${prepare(code, task.lang)}\n${prepare(check.code, task.lang)}`
      const run = new AsyncFunction('expect', script)

      await run(expect)
      passed += 1
    } catch (error) {
      failures.push(`${check.name}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return { passed, failures }
}

for (const task of browserTasks) {
  const solution = await runChecks(task, task.solution)

  if (solution.passed !== task.tests.length) {
    problems.push(
      `${task.id}: эталонное решение не проходит собственные проверки\n     ${solution.failures.join('\n     ')}`
    )
    continue
  }

  const starter = await runChecks(task, task.starter)

  if (starter.passed === task.tests.length) {
    problems.push(`${task.id}: стартовый код уже проходит все проверки — задача ничего не требует`)
    continue
  }

  console.log(`  ✓  ${task.id} (${solution.passed}/${task.tests.length}, стартовый код: ${starter.passed})`)
}

const standTasks = tasks.filter(task => task.runner === 'stand')

console.log(
  `\nПроверено задач браузера: ${browserTasks.length}.` +
    (standTasks.length > 0
      ? ` Задачи стенда (${standTasks.length}) проверяются командой npm run task:verify.`
      : '')
)

if (problems.length > 0) {
  console.log(`\nПроблемы:\n  ${problems.join('\n  ')}`)
  process.exitCode = 1
}

/**
 * Проверяет учебный сценарий сборки, не запуская его.
 *
 * Сценарий — такой же код, как тесты, и так же устаревает. Незакреплённая
 * версия действия или подавление ошибки обязательной команды превращают
 * сигнал в декорацию, и заметить это можно только проверкой.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const file = path.resolve(process.cwd(), "examples/04-final-project/ci/final-project.yml");
const text = readFileSync(file, "utf8");
const problems = [];

function require(condition, message) {
  if (!condition) problems.push(message);
}

require(!file.includes(`${path.sep}.github${path.sep}workflows`), "учебный сценарий не должен лежать в активном каталоге");
require(/^on:/m.test(text), "не объявлены события запуска");
require(/pull_request/.test(text), "нет запуска по запросу на слияние");
require(/permissions:\s*\n\s*contents: read/.test(text), "права не сведены к чтению");
require(/timeout-minutes:\s*\d+/.test(text), "не задано ограничение времени задачи");
require(!/continue-on-error:\s*true/.test(text), "обязательная проверка не должна подавлять ошибку");
require(!/contents:\s*write/.test(text), "права на запись в репозиторий не нужны");
require(/npm ci/.test(text) && !/npm install/.test(text), "установка должна идти строго по файлу фиксации версий");
require(/if:\s*always\(\)/.test(text), "артефакты должны сохраняться и после падения");
require(/if-no-files-found:\s*error/.test(text), "отсутствие артефактов должно быть ошибкой");
require(/retention-days:\s*\d+/.test(text), "срок хранения артефактов не ограничен");

for (const action of text.match(/uses:\s*\S+/g) ?? []) {
  require(/@v\d+$/.test(action.trim()), `версия действия не закреплена: ${action.trim()}`);
}

assert.deepEqual(problems, [], `Сценарий сборки не прошёл проверку:\n- ${problems.join("\n- ")}`);

console.log("Сценарий сборки проверен: замечаний нет.");

/**
 * Роли инструментов и то, что остаётся команде.
 *
 * Пример показывает не «как настроить Playwright», а как ответить на вопрос
 * «кто владеет этой ответственностью»: именно он сокращает область
 * расследования при падении.
 */
type Role =
  | "браузер"
  | "запуск тестов"
  | "проверки"
  | "тестовые данные"
  | "отчётность";

type Tool = {
  name: string;
  covers: Role[];
};

const tools: Tool[] = [
  { name: "Playwright", covers: ["браузер"] },
  { name: "Playwright Test", covers: ["запуск тестов", "проверки"] },
  { name: "Allure", covers: ["отчётность"] },
];

const required: Role[] = [
  "браузер",
  "запуск тестов",
  "проверки",
  "тестовые данные",
  "отчётность",
];

function ownersOf(role: Role): string[] {
  return tools.filter((tool) => tool.covers.includes(role)).map((tool) => tool.name);
}

for (const role of required) {
  const owners = ownersOf(role);

  // Роль без инструмента не исчезает: её владельцем становится команда.
  console.log(`${role}: ${owners.length > 0 ? owners.join(", ") : "команда проекта"}`);
}

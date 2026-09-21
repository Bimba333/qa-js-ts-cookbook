/**
 * Единственный источник истины для учебных данных.
 *
 * Seed детерминирован: одинаковые идентификаторы, timestamps и распределение
 * полей при каждом запуске. Тест может опираться на конкретную строку, а
 * проверка готовности — пересчитать ожидаемое состояние вместо хранения копии.
 */

export type SeedRole = "tester" | "viewer";

export type SeedUser = Readonly<{
  id: string;
  login: string;
  password: string;
  passwordSalt: string;
  role: SeedRole;
  isActive: boolean;
}>;

export type WorkItemStatus = "NEW" | "IN_PROGRESS" | "DONE" | "CANCELLED";
export type WorkItemPriority = "LOW" | "MEDIUM" | "HIGH";

export type SeedWorkItem = Readonly<{
  id: string;
  title: string;
  description: string;
  status: WorkItemStatus;
  priority: WorkItemPriority;
  ownerId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}>;

export const TESTER_USER_ID = "10000000-0000-4000-8000-000000000001";
export const VIEWER_USER_ID = "10000000-0000-4000-8000-000000000002";
export const SECOND_TESTER_USER_ID = "10000000-0000-4000-8000-000000000003";
export const DISABLED_USER_ID = "10000000-0000-4000-8000-000000000004";

/**
 * Пароли учебные и намеренно известны читателю. Они защищают только
 * одноразовые локальные данные и не являются секретами.
 */
export const SEED_USERS: readonly SeedUser[] = Object.freeze([
  Object.freeze({
    id: TESTER_USER_ID,
    login: "educational_tester",
    password: "educational-tester-password",
    passwordSalt: "a1b2c3d4e5f60718293a4b5c6d7e8f90",
    role: "tester",
    isActive: true,
  }),
  Object.freeze({
    id: VIEWER_USER_ID,
    login: "educational_viewer",
    password: "educational-viewer-password",
    passwordSalt: "b2c3d4e5f60718293a4b5c6d7e8f90a1",
    role: "viewer",
    isActive: true,
  }),
  Object.freeze({
    id: SECOND_TESTER_USER_ID,
    login: "educational_tester_two",
    password: "educational-tester-two-password",
    passwordSalt: "c3d4e5f60718293a4b5c6d7e8f90a1b2",
    role: "tester",
    isActive: true,
  }),
  Object.freeze({
    id: DISABLED_USER_ID,
    login: "educational_disabled",
    password: "educational-disabled-password",
    passwordSalt: "d4e5f60718293a4b5c6d7e8f90a1b2c3",
    role: "tester",
    isActive: false,
  }),
]);

const SEED_EPOCH_MS = Date.UTC(2026, 0, 1, 0, 0, 0);
const HOUR_MS = 3_600_000;

function seedWorkItemId(index: number): string {
  return `20000000-0000-4000-8000-${index.toString(16).padStart(12, "0")}`;
}

function seedTimestamp(offsetHours: number): string {
  return new Date(SEED_EPOCH_MS + offsetHours * HOUR_MS).toISOString();
}

/** Детерминированный генератор: тот же порядок при каждом запуске. */
function createSequence(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;

    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

const STATUSES: readonly WorkItemStatus[] = Object.freeze([
  "NEW",
  "IN_PROGRESS",
  "DONE",
  "CANCELLED",
]);

const PRIORITIES: readonly WorkItemPriority[] = Object.freeze([
  "LOW",
  "MEDIUM",
  "HIGH",
]);

const AREAS: readonly string[] = Object.freeze([
  "форме входа",
  "списке задач",
  "карточке задачи",
  "фильтре статусов",
  "экспорте отчёта",
  "загрузке вложений",
  "пагинации списка",
  "поиске по заголовку",
  "уведомлениях",
  "настройках профиля",
  "истории изменений",
  "массовых операциях",
]);

const ACTIONS: readonly string[] = Object.freeze([
  "Исправить валидацию",
  "Добавить проверку прав",
  "Ускорить загрузку",
  "Починить сортировку",
  "Описать контракт",
  "Покрыть тестами",
  "Убрать дублирование",
  "Обработать пустое состояние",
  "Согласовать текст ошибки",
  "Поддержать длинные значения",
]);

const DESCRIPTIONS: readonly string[] = Object.freeze([
  "Воспроизводится стабильно на учебном стенде.",
  "Обнаружено при ручной проверке сценария.",
  "Требует согласования с ожидаемым контрактом.",
  "Найдено автотестом на слое API.",
  "Затрагивает поведение при параллельном запуске.",
  "Проявляется только на граничных значениях.",
]);

/**
 * Строки с заранее известными свойствами. Главы ссылаются на них, когда нужен
 * предсказуемый объект: терминальный статус, граничная длина или Unicode.
 */
const EDGE_CASE_ITEMS: readonly Omit<
  SeedWorkItem,
  "createdAt" | "updatedAt" | "version"
>[] = Object.freeze([
  Object.freeze({
    id: seedWorkItemId(1),
    title: "Я",
    description: "Заголовок минимально допустимой длины в один символ.",
    status: "NEW" as const,
    priority: "LOW" as const,
    ownerId: TESTER_USER_ID,
    createdBy: TESTER_USER_ID,
  }),
  Object.freeze({
    id: seedWorkItemId(2),
    title: "Г".repeat(120),
    description: "Заголовок максимально допустимой длины в 120 символов.",
    status: "NEW" as const,
    priority: "MEDIUM" as const,
    ownerId: TESTER_USER_ID,
    createdBy: TESTER_USER_ID,
  }),
  Object.freeze({
    id: seedWorkItemId(3),
    title: "Проверка Unicode: 🧪 café naïve Ω ĳ",
    description:
      "Заголовок содержит эмодзи, диакритику и лигатуру для проверки нормализации.",
    status: "IN_PROGRESS" as const,
    priority: "HIGH" as const,
    ownerId: TESTER_USER_ID,
    createdBy: TESTER_USER_ID,
  }),
  Object.freeze({
    id: seedWorkItemId(4),
    title: "Экранирование <script>alert(1)</script> & \"кавычки\"",
    description:
      "Заголовок содержит HTML-разметку и кавычки: UI обязан выводить их как текст.",
    status: "NEW" as const,
    priority: "HIGH" as const,
    ownerId: TESTER_USER_ID,
    createdBy: TESTER_USER_ID,
  }),
  Object.freeze({
    id: seedWorkItemId(5),
    title: "Терминальная задача в статусе DONE",
    description:
      "Используется для проверки отказа при недопустимом переходе статуса.",
    status: "DONE" as const,
    priority: "MEDIUM" as const,
    ownerId: TESTER_USER_ID,
    createdBy: TESTER_USER_ID,
  }),
  Object.freeze({
    id: seedWorkItemId(6),
    title: "Терминальная задача в статусе CANCELLED",
    description:
      "Используется для проверки отказа при недопустимом переходе статуса.",
    status: "CANCELLED" as const,
    priority: "LOW" as const,
    ownerId: TESTER_USER_ID,
    createdBy: TESTER_USER_ID,
  }),
  Object.freeze({
    id: seedWorkItemId(7),
    title: "Задача другого владельца",
    description:
      "Принадлежит второму тестировщику: используется для проверки отказа по правам.",
    status: "NEW" as const,
    priority: "HIGH" as const,
    ownerId: SECOND_TESTER_USER_ID,
    createdBy: SECOND_TESTER_USER_ID,
  }),
  Object.freeze({
    id: seedWorkItemId(8),
    title: "Задача с описанием максимальной длины",
    description: "Ш".repeat(2_000),
    status: "IN_PROGRESS" as const,
    priority: "MEDIUM" as const,
    ownerId: SECOND_TESTER_USER_ID,
    createdBy: SECOND_TESTER_USER_ID,
  }),
]);

export const GENERATED_WORK_ITEM_COUNT = 240;

const OWNER_ROTATION: readonly string[] = Object.freeze([
  TESTER_USER_ID,
  TESTER_USER_ID,
  SECOND_TESTER_USER_ID,
  VIEWER_USER_ID,
]);

function buildWorkItems(): readonly SeedWorkItem[] {
  const items: SeedWorkItem[] = EDGE_CASE_ITEMS.map((item, index) =>
    Object.freeze({
      ...item,
      createdAt: seedTimestamp(index),
      updatedAt: seedTimestamp(index),
      version: 1,
    }),
  );

  const next = createSequence(20_260_101);
  const firstGeneratedIndex = EDGE_CASE_ITEMS.length + 1;

  for (let offset = 0; offset < GENERATED_WORK_ITEM_COUNT; offset += 1) {
    const index = firstGeneratedIndex + offset;
    const action = ACTIONS[Math.floor(next() * ACTIONS.length)] ?? ACTIONS[0]!;
    const area = AREAS[Math.floor(next() * AREAS.length)] ?? AREAS[0]!;
    const description =
      DESCRIPTIONS[Math.floor(next() * DESCRIPTIONS.length)] ??
      DESCRIPTIONS[0]!;

    // Циклическое распределение гарантирует, что каждая комбинация
    // статуса и приоритета встречается достаточно часто для фильтров.
    const status = STATUSES[offset % STATUSES.length]!;
    const priority = PRIORITIES[Math.floor(offset / STATUSES.length) % PRIORITIES.length]!;
    const ownerId = OWNER_ROTATION[offset % OWNER_ROTATION.length]!;

    // Строки с изменённым статусом выглядят как прошедшие обновление.
    const version = status === "NEW" ? 1 : 2;
    const createdAt = seedTimestamp(index);

    items.push(
      Object.freeze({
        id: seedWorkItemId(index),
        title: `${action} в ${area} (#${String(index).padStart(3, "0")})`,
        description,
        status,
        priority,
        ownerId,
        createdBy: ownerId,
        createdAt,
        updatedAt: version === 1 ? createdAt : seedTimestamp(index + 1),
        version,
      }),
    );
  }

  return Object.freeze(items);
}

export const SEED_WORK_ITEMS: readonly SeedWorkItem[] = buildWorkItems();

export const SEED_WORK_ITEM_COUNT = SEED_WORK_ITEMS.length;

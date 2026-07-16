import type {
  DiagnosticSink,
  TaskCreator,
  TaskDraft,
  TaskEditor,
  TaskEntity,
  TaskReader,
  TaskRepository,
} from "./contracts.js";

export class InMemoryTaskStore {
  readonly #tasks = new Map<string, TaskEntity>();

  create(draft: TaskDraft): TaskEntity {
    if (this.#tasks.has(draft.id)) {
      throw new Error(`Task ${draft.id} уже существует`);
    }
    const task: TaskEntity = Object.freeze({ ...draft, status: "open" });
    this.#tasks.set(task.id, task);
    return task;
  }

  get(id: string): TaskEntity {
    const task = this.#tasks.get(id);
    if (!task) throw new Error(`Task ${id} не найден`);
    return task;
  }

  find(id: string): TaskEntity | null {
    return this.#tasks.get(id) ?? null;
  }

  close(id: string): TaskEntity {
    const current = this.get(id);
    const closed: TaskEntity = Object.freeze({ ...current, status: "closed" });
    this.#tasks.set(id, closed);
    return closed;
  }

  remove(id: string): void {
    this.#tasks.delete(id);
  }
}

export class ApiTaskAdapter implements TaskCreator {
  constructor(private readonly store: InMemoryTaskStore) {}

  async create(draft: TaskDraft): Promise<TaskEntity> {
    return this.store.create(draft);
  }
}

export class GrpcTaskAdapter implements TaskReader {
  constructor(private readonly store: InMemoryTaskStore) {}

  async get(id: string): Promise<TaskEntity> {
    return this.store.get(id);
  }
}

export class UiTaskAdapter implements TaskEditor {
  constructor(private readonly store: InMemoryTaskStore) {}

  async close(id: string): Promise<TaskEntity> {
    return this.store.close(id);
  }
}

export class DatabaseTaskAdapter implements TaskRepository {
  constructor(private readonly store: InMemoryTaskStore) {}

  async find(id: string): Promise<TaskEntity | null> {
    return this.store.find(id);
  }

  async remove(id: string): Promise<void> {
    this.store.remove(id);
  }
}

export class MemoryDiagnosticSink implements DiagnosticSink {
  readonly #entries: string[] = [];

  async write(payload: string): Promise<void> {
    this.#entries.push(payload);
  }

  entries(): readonly string[] {
    return Object.freeze([...this.#entries]);
  }
}

export type TaskStatus = "open" | "closed";

export interface TaskDraft {
  readonly id: string;
  readonly title: string;
}

export interface TaskEntity extends TaskDraft {
  readonly status: TaskStatus;
}

export interface TaskCreator {
  create(draft: TaskDraft): Promise<TaskEntity>;
}

export interface TaskReader {
  get(id: string): Promise<TaskEntity>;
}

export interface TaskEditor {
  close(id: string): Promise<TaskEntity>;
}

export interface TaskRepository {
  find(id: string): Promise<TaskEntity | null>;
  remove(id: string): Promise<void>;
}

export interface DiagnosticSink {
  write(payload: string): Promise<void>;
}

export interface IntegrationContext {
  readonly api: TaskCreator;
  readonly grpc: TaskReader;
  readonly ui: TaskEditor;
  readonly database: TaskRepository;
  close(primaryError?: unknown): Promise<void>;
}

import {
  createDiagnosticEvent,
  serializeDiagnostic,
  withDiagnosticCause,
} from "../diagnostics/diagnostic-tools.js";
import type {
  DiagnosticSink,
  TaskCreator,
  TaskEditor,
  TaskEntity,
  TaskReader,
  TaskRepository,
} from "./contracts.js";

export class TaskScenario {
  constructor(
    private readonly api: TaskCreator,
    private readonly grpc: TaskReader,
    private readonly ui: TaskEditor,
    private readonly database: TaskRepository,
    private readonly diagnostics: DiagnosticSink,
    private readonly correlationId: string,
    private readonly registerOwnedTask: (id: string) => void,
  ) {}

  async createCloseAndVerify(id: string, title: string): Promise<TaskEntity> {
    try {
      const created = await this.api.create({ id, title });
      this.registerOwnedTask(created.id);
      await this.ui.close(id);
      const transportView = await this.grpc.get(id);
      const persisted = await this.database.find(id);

      if (!persisted || persisted.status !== transportView.status) {
        throw new Error(`Слои вернули разные состояния task ${id}`);
      }
      return transportView;
    } catch (error) {
      const event = createDiagnosticEvent(
        "error",
        "task.scenario.failed",
        this.correlationId,
        "2026-07-16T09:00:00.000Z",
        { taskId: id },
      );
      const scenarioError = withDiagnosticCause(
        `Не удалось выполнить сценарий для ${id}`,
        error,
      );

      try {
        await this.diagnostics.write(serializeDiagnostic({ event }));
      } catch (diagnosticError) {
        throw new AggregateError(
          [scenarioError, diagnosticError],
          `Сценарий и запись диагностики завершились ошибкой для ${id}`,
        );
      }

      throw scenarioError;
    }
  }
}

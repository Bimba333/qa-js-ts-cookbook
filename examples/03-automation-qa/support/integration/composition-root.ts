import type { RuntimeConfig } from "../execution/runtime-config.js";
import { ResourceScope } from "../execution/resource-scope.js";
import {
  ApiTaskAdapter,
  DatabaseTaskAdapter,
  GrpcTaskAdapter,
  InMemoryTaskStore,
  MemoryDiagnosticSink,
  UiTaskAdapter,
} from "./adapters.js";
import type { IntegrationContext } from "./contracts.js";
import { TaskScenario } from "./task-scenario.js";

export interface ComposedFramework extends IntegrationContext {
  readonly config: RuntimeConfig;
  readonly tasks: TaskScenario;
  readonly diagnosticEntries: () => readonly string[];
  registerOwnedTask(id: string): void;
}

export function createFramework(
  config: RuntimeConfig,
  correlationId: string,
): ComposedFramework {
  const scope = new ResourceScope();
  const store = new InMemoryTaskStore();
  const api = new ApiTaskAdapter(store);
  const grpc = new GrpcTaskAdapter(store);
  const ui = new UiTaskAdapter(store);
  const database = new DatabaseTaskAdapter(store);
  const diagnostics = new MemoryDiagnosticSink();
  const registerOwnedTask = (id: string) => scope.register(() => database.remove(id));
  const tasks = new TaskScenario(
    api,
    grpc,
    ui,
    database,
    diagnostics,
    correlationId,
    registerOwnedTask,
  );

  return Object.freeze({
    config,
    api,
    grpc,
    ui,
    database,
    tasks,
    diagnosticEntries: () => diagnostics.entries(),
    registerOwnedTask,
    close: (primaryError?: unknown) => scope.close(primaryError),
  });
}

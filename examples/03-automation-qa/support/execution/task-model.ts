export type TaskPriority = "low" | "high";

export interface TaskData {
  id: string;
  title: string;
  priority: TaskPriority;
  description: string | null;
}

export interface TaskOverrides {
  id?: string;
  title?: string;
  priority?: TaskPriority;
  description?: string | null;
}

export function createTaskFactory(seed: string): (overrides?: TaskOverrides) => TaskData {
  let sequence = 0;
  return (overrides = {}) => {
    sequence += 1;
    return {
      id: overrides.id ?? `${seed}-task-${sequence}`,
      title: overrides.title ?? "Проверить отчёт",
      priority: overrides.priority ?? "low",
      description: overrides.description ?? null,
    };
  };
}

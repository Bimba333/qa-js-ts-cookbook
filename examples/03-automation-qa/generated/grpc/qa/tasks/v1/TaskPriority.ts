// Original file: examples/03-automation-qa/proto/tasks.proto

export const TaskPriority = {
  TASK_PRIORITY_UNSPECIFIED: 'TASK_PRIORITY_UNSPECIFIED',
  TASK_PRIORITY_LOW: 'TASK_PRIORITY_LOW',
  TASK_PRIORITY_HIGH: 'TASK_PRIORITY_HIGH',
} as const;

export type TaskPriority =
  | 'TASK_PRIORITY_UNSPECIFIED'
  | 0
  | 'TASK_PRIORITY_LOW'
  | 1
  | 'TASK_PRIORITY_HIGH'
  | 2

export type TaskPriority__Output = typeof TaskPriority[keyof typeof TaskPriority]

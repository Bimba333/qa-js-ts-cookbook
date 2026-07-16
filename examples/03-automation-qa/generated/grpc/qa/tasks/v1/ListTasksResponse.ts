// Original file: examples/03-automation-qa/proto/tasks.proto

import type { Task as _qa_tasks_v1_Task, Task__Output as _qa_tasks_v1_Task__Output } from '../../../qa/tasks/v1/Task.js';

export interface ListTasksResponse {
  'tasks'?: (_qa_tasks_v1_Task)[];
}

export interface ListTasksResponse__Output {
  'tasks': (_qa_tasks_v1_Task__Output)[];
}

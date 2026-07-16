// Original file: examples/03-automation-qa/proto/tasks.proto

import type { TaskPriority as _qa_tasks_v1_TaskPriority, TaskPriority__Output as _qa_tasks_v1_TaskPriority__Output } from '../../../qa/tasks/v1/TaskPriority.js';
import type { Owner as _qa_tasks_v1_Owner, Owner__Output as _qa_tasks_v1_Owner__Output } from '../../../qa/tasks/v1/Owner.js';

export interface Task {
  'id'?: (string);
  'title'?: (string);
  'completed'?: (boolean);
  'labels'?: (string)[];
  'priority'?: (_qa_tasks_v1_TaskPriority);
  'description'?: (string);
  'owner'?: (_qa_tasks_v1_Owner | null);
  '_description'?: "description";
}

export interface Task__Output {
  'id': (string);
  'title': (string);
  'completed': (boolean);
  'labels': (string)[];
  'priority': (_qa_tasks_v1_TaskPriority__Output);
  'description'?: (string);
  'owner': (_qa_tasks_v1_Owner__Output | null);
  '_description'?: "description";
}

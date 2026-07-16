import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { CreateTaskRequest as _qa_tasks_v1_CreateTaskRequest, CreateTaskRequest__Output as _qa_tasks_v1_CreateTaskRequest__Output } from './qa/tasks/v1/CreateTaskRequest.js';
import type { GetTaskRequest as _qa_tasks_v1_GetTaskRequest, GetTaskRequest__Output as _qa_tasks_v1_GetTaskRequest__Output } from './qa/tasks/v1/GetTaskRequest.js';
import type { ListTasksRequest as _qa_tasks_v1_ListTasksRequest, ListTasksRequest__Output as _qa_tasks_v1_ListTasksRequest__Output } from './qa/tasks/v1/ListTasksRequest.js';
import type { ListTasksResponse as _qa_tasks_v1_ListTasksResponse, ListTasksResponse__Output as _qa_tasks_v1_ListTasksResponse__Output } from './qa/tasks/v1/ListTasksResponse.js';
import type { Owner as _qa_tasks_v1_Owner, Owner__Output as _qa_tasks_v1_Owner__Output } from './qa/tasks/v1/Owner.js';
import type { SlowTaskRequest as _qa_tasks_v1_SlowTaskRequest, SlowTaskRequest__Output as _qa_tasks_v1_SlowTaskRequest__Output } from './qa/tasks/v1/SlowTaskRequest.js';
import type { Task as _qa_tasks_v1_Task, Task__Output as _qa_tasks_v1_Task__Output } from './qa/tasks/v1/Task.js';
import type { TaskServiceClient as _qa_tasks_v1_TaskServiceClient, TaskServiceDefinition as _qa_tasks_v1_TaskServiceDefinition } from './qa/tasks/v1/TaskService.js';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  qa: {
    tasks: {
      v1: {
        CreateTaskRequest: MessageTypeDefinition<_qa_tasks_v1_CreateTaskRequest, _qa_tasks_v1_CreateTaskRequest__Output>
        GetTaskRequest: MessageTypeDefinition<_qa_tasks_v1_GetTaskRequest, _qa_tasks_v1_GetTaskRequest__Output>
        ListTasksRequest: MessageTypeDefinition<_qa_tasks_v1_ListTasksRequest, _qa_tasks_v1_ListTasksRequest__Output>
        ListTasksResponse: MessageTypeDefinition<_qa_tasks_v1_ListTasksResponse, _qa_tasks_v1_ListTasksResponse__Output>
        Owner: MessageTypeDefinition<_qa_tasks_v1_Owner, _qa_tasks_v1_Owner__Output>
        SlowTaskRequest: MessageTypeDefinition<_qa_tasks_v1_SlowTaskRequest, _qa_tasks_v1_SlowTaskRequest__Output>
        Task: MessageTypeDefinition<_qa_tasks_v1_Task, _qa_tasks_v1_Task__Output>
        TaskPriority: EnumTypeDefinition
        TaskService: SubtypeConstructor<typeof grpc.Client, _qa_tasks_v1_TaskServiceClient> & { service: _qa_tasks_v1_TaskServiceDefinition }
      }
    }
  }
}


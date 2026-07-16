// Original file: examples/03-automation-qa/proto/tasks.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { CreateTaskRequest as _qa_tasks_v1_CreateTaskRequest, CreateTaskRequest__Output as _qa_tasks_v1_CreateTaskRequest__Output } from '../../../qa/tasks/v1/CreateTaskRequest.js';
import type { GetTaskRequest as _qa_tasks_v1_GetTaskRequest, GetTaskRequest__Output as _qa_tasks_v1_GetTaskRequest__Output } from '../../../qa/tasks/v1/GetTaskRequest.js';
import type { ListTasksRequest as _qa_tasks_v1_ListTasksRequest, ListTasksRequest__Output as _qa_tasks_v1_ListTasksRequest__Output } from '../../../qa/tasks/v1/ListTasksRequest.js';
import type { ListTasksResponse as _qa_tasks_v1_ListTasksResponse, ListTasksResponse__Output as _qa_tasks_v1_ListTasksResponse__Output } from '../../../qa/tasks/v1/ListTasksResponse.js';
import type { SlowTaskRequest as _qa_tasks_v1_SlowTaskRequest, SlowTaskRequest__Output as _qa_tasks_v1_SlowTaskRequest__Output } from '../../../qa/tasks/v1/SlowTaskRequest.js';
import type { Task as _qa_tasks_v1_Task, Task__Output as _qa_tasks_v1_Task__Output } from '../../../qa/tasks/v1/Task.js';

export interface TaskServiceClient extends grpc.Client {
  CreateAuthorizedTask(argument: _qa_tasks_v1_CreateTaskRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  CreateAuthorizedTask(argument: _qa_tasks_v1_CreateTaskRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  CreateAuthorizedTask(argument: _qa_tasks_v1_CreateTaskRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  CreateAuthorizedTask(argument: _qa_tasks_v1_CreateTaskRequest, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  createAuthorizedTask(argument: _qa_tasks_v1_CreateTaskRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  createAuthorizedTask(argument: _qa_tasks_v1_CreateTaskRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  createAuthorizedTask(argument: _qa_tasks_v1_CreateTaskRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  createAuthorizedTask(argument: _qa_tasks_v1_CreateTaskRequest, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  
  CreateTask(argument: _qa_tasks_v1_CreateTaskRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  CreateTask(argument: _qa_tasks_v1_CreateTaskRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  CreateTask(argument: _qa_tasks_v1_CreateTaskRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  CreateTask(argument: _qa_tasks_v1_CreateTaskRequest, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  createTask(argument: _qa_tasks_v1_CreateTaskRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  createTask(argument: _qa_tasks_v1_CreateTaskRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  createTask(argument: _qa_tasks_v1_CreateTaskRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  createTask(argument: _qa_tasks_v1_CreateTaskRequest, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  
  GetTask(argument: _qa_tasks_v1_GetTaskRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  GetTask(argument: _qa_tasks_v1_GetTaskRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  GetTask(argument: _qa_tasks_v1_GetTaskRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  GetTask(argument: _qa_tasks_v1_GetTaskRequest, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  getTask(argument: _qa_tasks_v1_GetTaskRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  getTask(argument: _qa_tasks_v1_GetTaskRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  getTask(argument: _qa_tasks_v1_GetTaskRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  getTask(argument: _qa_tasks_v1_GetTaskRequest, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  
  ListTasks(argument: _qa_tasks_v1_ListTasksRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_tasks_v1_ListTasksResponse__Output>): grpc.ClientUnaryCall;
  ListTasks(argument: _qa_tasks_v1_ListTasksRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_qa_tasks_v1_ListTasksResponse__Output>): grpc.ClientUnaryCall;
  ListTasks(argument: _qa_tasks_v1_ListTasksRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_tasks_v1_ListTasksResponse__Output>): grpc.ClientUnaryCall;
  ListTasks(argument: _qa_tasks_v1_ListTasksRequest, callback: grpc.requestCallback<_qa_tasks_v1_ListTasksResponse__Output>): grpc.ClientUnaryCall;
  listTasks(argument: _qa_tasks_v1_ListTasksRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_tasks_v1_ListTasksResponse__Output>): grpc.ClientUnaryCall;
  listTasks(argument: _qa_tasks_v1_ListTasksRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_qa_tasks_v1_ListTasksResponse__Output>): grpc.ClientUnaryCall;
  listTasks(argument: _qa_tasks_v1_ListTasksRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_tasks_v1_ListTasksResponse__Output>): grpc.ClientUnaryCall;
  listTasks(argument: _qa_tasks_v1_ListTasksRequest, callback: grpc.requestCallback<_qa_tasks_v1_ListTasksResponse__Output>): grpc.ClientUnaryCall;
  
  SlowTask(argument: _qa_tasks_v1_SlowTaskRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  SlowTask(argument: _qa_tasks_v1_SlowTaskRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  SlowTask(argument: _qa_tasks_v1_SlowTaskRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  SlowTask(argument: _qa_tasks_v1_SlowTaskRequest, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  slowTask(argument: _qa_tasks_v1_SlowTaskRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  slowTask(argument: _qa_tasks_v1_SlowTaskRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  slowTask(argument: _qa_tasks_v1_SlowTaskRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  slowTask(argument: _qa_tasks_v1_SlowTaskRequest, callback: grpc.requestCallback<_qa_tasks_v1_Task__Output>): grpc.ClientUnaryCall;
  
}

export interface TaskServiceHandlers extends grpc.UntypedServiceImplementation {
  CreateAuthorizedTask: grpc.handleUnaryCall<_qa_tasks_v1_CreateTaskRequest__Output, _qa_tasks_v1_Task>;
  
  CreateTask: grpc.handleUnaryCall<_qa_tasks_v1_CreateTaskRequest__Output, _qa_tasks_v1_Task>;
  
  GetTask: grpc.handleUnaryCall<_qa_tasks_v1_GetTaskRequest__Output, _qa_tasks_v1_Task>;
  
  ListTasks: grpc.handleUnaryCall<_qa_tasks_v1_ListTasksRequest__Output, _qa_tasks_v1_ListTasksResponse>;
  
  SlowTask: grpc.handleUnaryCall<_qa_tasks_v1_SlowTaskRequest__Output, _qa_tasks_v1_Task>;
  
}

export interface TaskServiceDefinition extends grpc.ServiceDefinition {
  CreateAuthorizedTask: MethodDefinition<_qa_tasks_v1_CreateTaskRequest, _qa_tasks_v1_Task, _qa_tasks_v1_CreateTaskRequest__Output, _qa_tasks_v1_Task__Output>
  CreateTask: MethodDefinition<_qa_tasks_v1_CreateTaskRequest, _qa_tasks_v1_Task, _qa_tasks_v1_CreateTaskRequest__Output, _qa_tasks_v1_Task__Output>
  GetTask: MethodDefinition<_qa_tasks_v1_GetTaskRequest, _qa_tasks_v1_Task, _qa_tasks_v1_GetTaskRequest__Output, _qa_tasks_v1_Task__Output>
  ListTasks: MethodDefinition<_qa_tasks_v1_ListTasksRequest, _qa_tasks_v1_ListTasksResponse, _qa_tasks_v1_ListTasksRequest__Output, _qa_tasks_v1_ListTasksResponse__Output>
  SlowTask: MethodDefinition<_qa_tasks_v1_SlowTaskRequest, _qa_tasks_v1_Task, _qa_tasks_v1_SlowTaskRequest__Output, _qa_tasks_v1_Task__Output>
}

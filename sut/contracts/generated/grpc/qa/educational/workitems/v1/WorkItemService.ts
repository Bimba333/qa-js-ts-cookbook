// Original file: sut/contracts/proto/work_items.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { GetWorkItemRequest as _qa_educational_workitems_v1_GetWorkItemRequest, GetWorkItemRequest__Output as _qa_educational_workitems_v1_GetWorkItemRequest__Output } from '../../../../qa/educational/workitems/v1/GetWorkItemRequest.js';
import type { SearchWorkItemsRequest as _qa_educational_workitems_v1_SearchWorkItemsRequest, SearchWorkItemsRequest__Output as _qa_educational_workitems_v1_SearchWorkItemsRequest__Output } from '../../../../qa/educational/workitems/v1/SearchWorkItemsRequest.js';
import type { SearchWorkItemsResponse as _qa_educational_workitems_v1_SearchWorkItemsResponse, SearchWorkItemsResponse__Output as _qa_educational_workitems_v1_SearchWorkItemsResponse__Output } from '../../../../qa/educational/workitems/v1/SearchWorkItemsResponse.js';
import type { TransitionWorkItemRequest as _qa_educational_workitems_v1_TransitionWorkItemRequest, TransitionWorkItemRequest__Output as _qa_educational_workitems_v1_TransitionWorkItemRequest__Output } from '../../../../qa/educational/workitems/v1/TransitionWorkItemRequest.js';
import type { TransitionWorkItemResponse as _qa_educational_workitems_v1_TransitionWorkItemResponse, TransitionWorkItemResponse__Output as _qa_educational_workitems_v1_TransitionWorkItemResponse__Output } from '../../../../qa/educational/workitems/v1/TransitionWorkItemResponse.js';
import type { WorkItem as _qa_educational_workitems_v1_WorkItem, WorkItem__Output as _qa_educational_workitems_v1_WorkItem__Output } from '../../../../qa/educational/workitems/v1/WorkItem.js';

export interface WorkItemServiceClient extends grpc.Client {
  GetWorkItem(argument: _qa_educational_workitems_v1_GetWorkItemRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_educational_workitems_v1_WorkItem__Output>): grpc.ClientUnaryCall;
  GetWorkItem(argument: _qa_educational_workitems_v1_GetWorkItemRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_qa_educational_workitems_v1_WorkItem__Output>): grpc.ClientUnaryCall;
  GetWorkItem(argument: _qa_educational_workitems_v1_GetWorkItemRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_educational_workitems_v1_WorkItem__Output>): grpc.ClientUnaryCall;
  GetWorkItem(argument: _qa_educational_workitems_v1_GetWorkItemRequest, callback: grpc.requestCallback<_qa_educational_workitems_v1_WorkItem__Output>): grpc.ClientUnaryCall;
  getWorkItem(argument: _qa_educational_workitems_v1_GetWorkItemRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_educational_workitems_v1_WorkItem__Output>): grpc.ClientUnaryCall;
  getWorkItem(argument: _qa_educational_workitems_v1_GetWorkItemRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_qa_educational_workitems_v1_WorkItem__Output>): grpc.ClientUnaryCall;
  getWorkItem(argument: _qa_educational_workitems_v1_GetWorkItemRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_educational_workitems_v1_WorkItem__Output>): grpc.ClientUnaryCall;
  getWorkItem(argument: _qa_educational_workitems_v1_GetWorkItemRequest, callback: grpc.requestCallback<_qa_educational_workitems_v1_WorkItem__Output>): grpc.ClientUnaryCall;
  
  SearchWorkItems(argument: _qa_educational_workitems_v1_SearchWorkItemsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_educational_workitems_v1_SearchWorkItemsResponse__Output>): grpc.ClientUnaryCall;
  SearchWorkItems(argument: _qa_educational_workitems_v1_SearchWorkItemsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_qa_educational_workitems_v1_SearchWorkItemsResponse__Output>): grpc.ClientUnaryCall;
  SearchWorkItems(argument: _qa_educational_workitems_v1_SearchWorkItemsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_educational_workitems_v1_SearchWorkItemsResponse__Output>): grpc.ClientUnaryCall;
  SearchWorkItems(argument: _qa_educational_workitems_v1_SearchWorkItemsRequest, callback: grpc.requestCallback<_qa_educational_workitems_v1_SearchWorkItemsResponse__Output>): grpc.ClientUnaryCall;
  searchWorkItems(argument: _qa_educational_workitems_v1_SearchWorkItemsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_educational_workitems_v1_SearchWorkItemsResponse__Output>): grpc.ClientUnaryCall;
  searchWorkItems(argument: _qa_educational_workitems_v1_SearchWorkItemsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_qa_educational_workitems_v1_SearchWorkItemsResponse__Output>): grpc.ClientUnaryCall;
  searchWorkItems(argument: _qa_educational_workitems_v1_SearchWorkItemsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_educational_workitems_v1_SearchWorkItemsResponse__Output>): grpc.ClientUnaryCall;
  searchWorkItems(argument: _qa_educational_workitems_v1_SearchWorkItemsRequest, callback: grpc.requestCallback<_qa_educational_workitems_v1_SearchWorkItemsResponse__Output>): grpc.ClientUnaryCall;
  
  TransitionWorkItem(argument: _qa_educational_workitems_v1_TransitionWorkItemRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_educational_workitems_v1_TransitionWorkItemResponse__Output>): grpc.ClientUnaryCall;
  TransitionWorkItem(argument: _qa_educational_workitems_v1_TransitionWorkItemRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_qa_educational_workitems_v1_TransitionWorkItemResponse__Output>): grpc.ClientUnaryCall;
  TransitionWorkItem(argument: _qa_educational_workitems_v1_TransitionWorkItemRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_educational_workitems_v1_TransitionWorkItemResponse__Output>): grpc.ClientUnaryCall;
  TransitionWorkItem(argument: _qa_educational_workitems_v1_TransitionWorkItemRequest, callback: grpc.requestCallback<_qa_educational_workitems_v1_TransitionWorkItemResponse__Output>): grpc.ClientUnaryCall;
  transitionWorkItem(argument: _qa_educational_workitems_v1_TransitionWorkItemRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_educational_workitems_v1_TransitionWorkItemResponse__Output>): grpc.ClientUnaryCall;
  transitionWorkItem(argument: _qa_educational_workitems_v1_TransitionWorkItemRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_qa_educational_workitems_v1_TransitionWorkItemResponse__Output>): grpc.ClientUnaryCall;
  transitionWorkItem(argument: _qa_educational_workitems_v1_TransitionWorkItemRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_qa_educational_workitems_v1_TransitionWorkItemResponse__Output>): grpc.ClientUnaryCall;
  transitionWorkItem(argument: _qa_educational_workitems_v1_TransitionWorkItemRequest, callback: grpc.requestCallback<_qa_educational_workitems_v1_TransitionWorkItemResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface WorkItemServiceHandlers extends grpc.UntypedServiceImplementation {
  GetWorkItem: grpc.handleUnaryCall<_qa_educational_workitems_v1_GetWorkItemRequest__Output, _qa_educational_workitems_v1_WorkItem>;
  
  SearchWorkItems: grpc.handleUnaryCall<_qa_educational_workitems_v1_SearchWorkItemsRequest__Output, _qa_educational_workitems_v1_SearchWorkItemsResponse>;
  
  TransitionWorkItem: grpc.handleUnaryCall<_qa_educational_workitems_v1_TransitionWorkItemRequest__Output, _qa_educational_workitems_v1_TransitionWorkItemResponse>;
  
}

export interface WorkItemServiceDefinition extends grpc.ServiceDefinition {
  GetWorkItem: MethodDefinition<_qa_educational_workitems_v1_GetWorkItemRequest, _qa_educational_workitems_v1_WorkItem, _qa_educational_workitems_v1_GetWorkItemRequest__Output, _qa_educational_workitems_v1_WorkItem__Output>
  SearchWorkItems: MethodDefinition<_qa_educational_workitems_v1_SearchWorkItemsRequest, _qa_educational_workitems_v1_SearchWorkItemsResponse, _qa_educational_workitems_v1_SearchWorkItemsRequest__Output, _qa_educational_workitems_v1_SearchWorkItemsResponse__Output>
  TransitionWorkItem: MethodDefinition<_qa_educational_workitems_v1_TransitionWorkItemRequest, _qa_educational_workitems_v1_TransitionWorkItemResponse, _qa_educational_workitems_v1_TransitionWorkItemRequest__Output, _qa_educational_workitems_v1_TransitionWorkItemResponse__Output>
}

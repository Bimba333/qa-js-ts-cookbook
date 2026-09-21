import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { GetWorkItemRequest as _qa_educational_workitems_v1_GetWorkItemRequest, GetWorkItemRequest__Output as _qa_educational_workitems_v1_GetWorkItemRequest__Output } from './qa/educational/workitems/v1/GetWorkItemRequest.js';
import type { SearchWorkItemsRequest as _qa_educational_workitems_v1_SearchWorkItemsRequest, SearchWorkItemsRequest__Output as _qa_educational_workitems_v1_SearchWorkItemsRequest__Output } from './qa/educational/workitems/v1/SearchWorkItemsRequest.js';
import type { SearchWorkItemsResponse as _qa_educational_workitems_v1_SearchWorkItemsResponse, SearchWorkItemsResponse__Output as _qa_educational_workitems_v1_SearchWorkItemsResponse__Output } from './qa/educational/workitems/v1/SearchWorkItemsResponse.js';
import type { TransitionWorkItemRequest as _qa_educational_workitems_v1_TransitionWorkItemRequest, TransitionWorkItemRequest__Output as _qa_educational_workitems_v1_TransitionWorkItemRequest__Output } from './qa/educational/workitems/v1/TransitionWorkItemRequest.js';
import type { TransitionWorkItemResponse as _qa_educational_workitems_v1_TransitionWorkItemResponse, TransitionWorkItemResponse__Output as _qa_educational_workitems_v1_TransitionWorkItemResponse__Output } from './qa/educational/workitems/v1/TransitionWorkItemResponse.js';
import type { WorkItem as _qa_educational_workitems_v1_WorkItem, WorkItem__Output as _qa_educational_workitems_v1_WorkItem__Output } from './qa/educational/workitems/v1/WorkItem.js';
import type { WorkItemServiceClient as _qa_educational_workitems_v1_WorkItemServiceClient, WorkItemServiceDefinition as _qa_educational_workitems_v1_WorkItemServiceDefinition } from './qa/educational/workitems/v1/WorkItemService.js';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  qa: {
    educational: {
      workitems: {
        v1: {
          GetWorkItemRequest: MessageTypeDefinition<_qa_educational_workitems_v1_GetWorkItemRequest, _qa_educational_workitems_v1_GetWorkItemRequest__Output>
          SearchWorkItemsRequest: MessageTypeDefinition<_qa_educational_workitems_v1_SearchWorkItemsRequest, _qa_educational_workitems_v1_SearchWorkItemsRequest__Output>
          SearchWorkItemsResponse: MessageTypeDefinition<_qa_educational_workitems_v1_SearchWorkItemsResponse, _qa_educational_workitems_v1_SearchWorkItemsResponse__Output>
          TransitionWorkItemRequest: MessageTypeDefinition<_qa_educational_workitems_v1_TransitionWorkItemRequest, _qa_educational_workitems_v1_TransitionWorkItemRequest__Output>
          TransitionWorkItemResponse: MessageTypeDefinition<_qa_educational_workitems_v1_TransitionWorkItemResponse, _qa_educational_workitems_v1_TransitionWorkItemResponse__Output>
          WorkItem: MessageTypeDefinition<_qa_educational_workitems_v1_WorkItem, _qa_educational_workitems_v1_WorkItem__Output>
          WorkItemPriority: EnumTypeDefinition
          WorkItemService: SubtypeConstructor<typeof grpc.Client, _qa_educational_workitems_v1_WorkItemServiceClient> & { service: _qa_educational_workitems_v1_WorkItemServiceDefinition }
          WorkItemStatus: EnumTypeDefinition
        }
      }
    }
  }
}


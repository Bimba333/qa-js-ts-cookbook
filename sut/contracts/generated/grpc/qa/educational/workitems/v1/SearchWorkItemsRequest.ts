// Original file: sut/contracts/proto/work_items.proto

import type { WorkItemStatus as _qa_educational_workitems_v1_WorkItemStatus, WorkItemStatus__Output as _qa_educational_workitems_v1_WorkItemStatus__Output } from '../../../../qa/educational/workitems/v1/WorkItemStatus.js';
import type { WorkItemPriority as _qa_educational_workitems_v1_WorkItemPriority, WorkItemPriority__Output as _qa_educational_workitems_v1_WorkItemPriority__Output } from '../../../../qa/educational/workitems/v1/WorkItemPriority.js';

export interface SearchWorkItemsRequest {
  'status'?: (_qa_educational_workitems_v1_WorkItemStatus);
  'priority'?: (_qa_educational_workitems_v1_WorkItemPriority);
  'ownerId'?: (string);
  'limit'?: (number);
  'offset'?: (number);
}

export interface SearchWorkItemsRequest__Output {
  'status': (_qa_educational_workitems_v1_WorkItemStatus__Output);
  'priority': (_qa_educational_workitems_v1_WorkItemPriority__Output);
  'ownerId': (string);
  'limit': (number);
  'offset': (number);
}

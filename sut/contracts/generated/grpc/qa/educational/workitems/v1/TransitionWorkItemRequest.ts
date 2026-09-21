// Original file: sut/contracts/proto/work_items.proto

import type { WorkItemStatus as _qa_educational_workitems_v1_WorkItemStatus, WorkItemStatus__Output as _qa_educational_workitems_v1_WorkItemStatus__Output } from '../../../../qa/educational/workitems/v1/WorkItemStatus.js';

export interface TransitionWorkItemRequest {
  'id'?: (string);
  'targetStatus'?: (_qa_educational_workitems_v1_WorkItemStatus);
  'expectedVersion'?: (number);
}

export interface TransitionWorkItemRequest__Output {
  'id': (string);
  'targetStatus': (_qa_educational_workitems_v1_WorkItemStatus__Output);
  'expectedVersion': (number);
}

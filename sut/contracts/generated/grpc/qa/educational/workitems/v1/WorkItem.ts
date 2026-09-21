// Original file: sut/contracts/proto/work_items.proto

import type { WorkItemStatus as _qa_educational_workitems_v1_WorkItemStatus, WorkItemStatus__Output as _qa_educational_workitems_v1_WorkItemStatus__Output } from '../../../../qa/educational/workitems/v1/WorkItemStatus.js';
import type { WorkItemPriority as _qa_educational_workitems_v1_WorkItemPriority, WorkItemPriority__Output as _qa_educational_workitems_v1_WorkItemPriority__Output } from '../../../../qa/educational/workitems/v1/WorkItemPriority.js';

export interface WorkItem {
  'id'?: (string);
  'title'?: (string);
  'description'?: (string);
  'status'?: (_qa_educational_workitems_v1_WorkItemStatus);
  'priority'?: (_qa_educational_workitems_v1_WorkItemPriority);
  'ownerId'?: (string);
  'createdBy'?: (string);
  'testRunId'?: (string);
  'creatorTestId'?: (string);
  'createdAt'?: (string);
  'updatedAt'?: (string);
  'version'?: (number);
}

export interface WorkItem__Output {
  'id': (string);
  'title': (string);
  'description': (string);
  'status': (_qa_educational_workitems_v1_WorkItemStatus__Output);
  'priority': (_qa_educational_workitems_v1_WorkItemPriority__Output);
  'ownerId': (string);
  'createdBy': (string);
  'testRunId': (string);
  'creatorTestId': (string);
  'createdAt': (string);
  'updatedAt': (string);
  'version': (number);
}

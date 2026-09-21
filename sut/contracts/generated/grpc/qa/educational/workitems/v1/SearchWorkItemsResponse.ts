// Original file: sut/contracts/proto/work_items.proto

import type { WorkItem as _qa_educational_workitems_v1_WorkItem, WorkItem__Output as _qa_educational_workitems_v1_WorkItem__Output } from '../../../../qa/educational/workitems/v1/WorkItem.js';

export interface SearchWorkItemsResponse {
  'items'?: (_qa_educational_workitems_v1_WorkItem)[];
  'total'?: (number);
}

export interface SearchWorkItemsResponse__Output {
  'items': (_qa_educational_workitems_v1_WorkItem__Output)[];
  'total': (number);
}

// Original file: sut/contracts/proto/work_items.proto

export const WorkItemStatus = {
  WORK_ITEM_STATUS_UNSPECIFIED: 'WORK_ITEM_STATUS_UNSPECIFIED',
  NEW: 'NEW',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
  CANCELLED: 'CANCELLED',
} as const;

export type WorkItemStatus =
  | 'WORK_ITEM_STATUS_UNSPECIFIED'
  | 0
  | 'NEW'
  | 1
  | 'IN_PROGRESS'
  | 2
  | 'DONE'
  | 3
  | 'CANCELLED'
  | 4

export type WorkItemStatus__Output = typeof WorkItemStatus[keyof typeof WorkItemStatus]

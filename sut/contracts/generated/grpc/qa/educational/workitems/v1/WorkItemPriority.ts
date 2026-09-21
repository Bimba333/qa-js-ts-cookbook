// Original file: sut/contracts/proto/work_items.proto

export const WorkItemPriority = {
  WORK_ITEM_PRIORITY_UNSPECIFIED: 'WORK_ITEM_PRIORITY_UNSPECIFIED',
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const;

export type WorkItemPriority =
  | 'WORK_ITEM_PRIORITY_UNSPECIFIED'
  | 0
  | 'LOW'
  | 1
  | 'MEDIUM'
  | 2
  | 'HIGH'
  | 3

export type WorkItemPriority__Output = typeof WorkItemPriority[keyof typeof WorkItemPriority]

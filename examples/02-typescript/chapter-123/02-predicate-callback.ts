export {};

type StatusPredicate = (status: 'passed' | 'failed' | 'skipped') => boolean;

function hasMatchingStatus(
  statuses: Array<'passed' | 'failed' | 'skipped'>,
  predicate: StatusPredicate,
): boolean {
  return statuses.some(predicate);
}

const hasFailure = hasMatchingStatus(['passed', 'failed'], (status) => status === 'failed');

console.log(hasFailure);

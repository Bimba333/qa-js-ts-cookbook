export {};

const statusOrder = ['passed', 'failed', 'skipped'] as const;

const firstStatus: 'passed' = statusOrder[0];

console.log(firstStatus);

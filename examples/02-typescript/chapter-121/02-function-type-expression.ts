export {};

type StatusFormatter = (status: 'passed' | 'failed') => string;

const formatStatus: StatusFormatter = (status) => `status: ${status}`;

console.log(formatStatus('failed'));

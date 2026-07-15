export {};

function formatStatus(status: 'passed' | 'failed'): string {
  return `status: ${status}`;
}

const message = formatStatus('passed');

console.log(message);

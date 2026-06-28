const testResult = {
  id: 'T-2',
  status: 'fail',
};

console.log('expected status:', 'failed');
console.log('actual status:', testResult.status);
console.log('condition result:', testResult.status === 'failed');

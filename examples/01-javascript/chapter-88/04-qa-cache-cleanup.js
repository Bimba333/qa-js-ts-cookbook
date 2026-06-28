const testDataCache = new Map();

function saveTestData(testId, data) {
  testDataCache.set(testId, data);
}

function clearTestData(testId) {
  testDataCache.delete(testId);
}

saveTestData('T-1', { user: 'Anna', role: 'admin' });

console.log(testDataCache.has('T-1'));

clearTestData('T-1');

console.log(testDataCache.has('T-1'));

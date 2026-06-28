const config = {
  baseUrl: 'https://example.test',
  retries: 2,
};

function log(message) {
  console.log(`[runner] ${message}`);
}

function assertStatus(actual, expected) {
  return actual === expected;
}

function createReport(testName, passed) {
  return `${testName}: ${passed ? 'passed' : 'failed'}`;
}

log(`run against ${config.baseUrl}`);

const passed = assertStatus(200, 200);
const report = createReport('login test', passed);

console.log(report);

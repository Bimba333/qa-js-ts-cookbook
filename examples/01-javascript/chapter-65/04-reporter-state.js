function createReporter(configuration) {
  const results = [];

  return function report(testName, status) {
    results.push({ testName, status });
    console.log(`${configuration.environment}: ${testName} -> ${status}`);
    console.log(`total results: ${results.length}`);
  };
}

const report = createReporter({ environment: 'staging' });

report('login smoke', 'passed');
report('create order', 'failed');

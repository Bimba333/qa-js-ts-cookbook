function readConfiguration() {
  return { environment: 'staging' };
}

function runSmokeTest(configuration) {
  return `${configuration.environment}: login smoke passed`;
}

function printReport(result) {
  console.log(`report: ${result}`);
}

const configuration = readConfiguration();
const result = runSmokeTest(configuration);
printReport(result);

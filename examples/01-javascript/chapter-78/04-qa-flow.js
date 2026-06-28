function prepareEnvironment() {
  return Promise.resolve({ environment: 'staging' });
}

function executeTest(configuration) {
  return Promise.resolve(`${configuration.environment}: login smoke passed`);
}

async function runFramework() {
  const configuration = await prepareEnvironment();
  const result = await executeTest(configuration);
  console.log(result);
}

runFramework();

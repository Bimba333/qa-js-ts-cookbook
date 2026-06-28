async function loadTestConfig() {
  return {
    baseUrl: 'https://example.test',
    retries: 1,
  };
}

async function createRunOptions(extraOptions = {}) {
  const config = await loadTestConfig();

  return {
    ...config,
    ...extraOptions,
  };
}

createRunOptions({ retries: 2 }).then((options) => {
  console.log(options);
});

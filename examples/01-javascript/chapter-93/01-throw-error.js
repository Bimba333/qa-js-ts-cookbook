function readConfig(config) {
  if (!config.baseUrl) {
    throw new Error('baseUrl is required');
  }

  return config.baseUrl;
}

try {
  const baseUrl = readConfig({});
  console.log(baseUrl);
} catch (error) {
  console.log(error.name);
  console.log(error.message);
}

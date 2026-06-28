function createConfiguredUrl(configuration) {
  return function buildUrl(path) {
    return `${configuration.baseUrl}${path}`;
  };
}

const configuration = {
  baseUrl: 'https://example.test',
};

const buildUrl = createConfiguredUrl(configuration);

console.log(buildUrl('/login'));
console.log(buildUrl('/orders'));

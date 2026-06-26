const smokeStatuses = [200, 201];
const regressionStatuses = [204, 301];
const allStatuses = [...smokeStatuses, ...regressionStatuses];

const baseConfig = {
  retries: 1
};

const localConfig = {
  ...baseConfig,
  baseUrl: 'http://localhost'
};

console.log(allStatuses);
console.log(localConfig);

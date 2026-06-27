const config = {
  baseUrl: 'https://api.example.test'
};

const { baseUrl, timeout = 5000 } = config;

console.log(baseUrl);
console.log(timeout);
console.log(config.timeout);

const { baseUrl, getEnvironment } = require('./02-commonjs-config.cjs');

console.log(`CommonJS: ${getEnvironment()} ${baseUrl}`);

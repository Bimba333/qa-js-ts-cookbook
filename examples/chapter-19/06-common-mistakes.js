const expectedRetries = 3;
const retriesFromEnv = '3';

console.log(expectedRetries == retriesFromEnv);
console.log(expectedRetries === retriesFromEnv);
console.log(expectedRetries === Number(retriesFromEnv));

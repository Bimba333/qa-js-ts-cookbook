const headlessFromEnv = 'false';
const retriesFromEnv = '3';

const wrongHeadless = Boolean(headlessFromEnv);
const correctRetries = Number(retriesFromEnv);

console.log(wrongHeadless);
console.log(correctRetries + 1);

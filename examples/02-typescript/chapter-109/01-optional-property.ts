const passedResult: { name: string; errorMessage?: string } = {
  name: 'login form',
};

const failedResult: { name: string; errorMessage?: string } = {
  name: 'checkout submit',
  errorMessage: 'button is disabled',
};

console.log(passedResult.name);
console.log(failedResult.errorMessage);

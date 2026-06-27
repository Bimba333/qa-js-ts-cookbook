const testRun = ['login smoke', 'create order'];

const result = testRun.forEach(function (testCase) {
  console.log(`Executed: ${testCase}`);
});

console.log(result);

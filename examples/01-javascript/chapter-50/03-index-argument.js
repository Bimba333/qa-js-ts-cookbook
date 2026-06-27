const testRun = ['login smoke', 'create order', 'pay order'];

testRun.forEach(function (testCase, index) {
  console.log(`${index + 1}. ${testCase}`);
});

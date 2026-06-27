const testRun = [
  { title: 'login smoke', status: 'ready' },
  { title: 'create order', status: 'ready' },
  { title: 'pay order', status: 'ready' },
];

testRun.forEach(function (testCase) {
  console.log(`Runner starts: ${testCase.title}`);
});

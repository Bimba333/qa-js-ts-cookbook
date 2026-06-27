const testRun = [
  { title: 'login smoke', priority: 'high' },
  { title: 'create order', priority: 'medium' },
  { title: 'pay order', priority: 'high' },
];

for (const testCase of testRun) {
  console.log(`Queue ${testCase.priority} priority test: ${testCase.title}`);
}

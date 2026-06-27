const regressionPlan = [
  'login smoke',
  'create order',
  'apply discount',
  'pay order',
  'logout smoke',
];

const smokeRun = regressionPlan.slice(0, 2);

for (const testCase of smokeRun) {
  console.log(`Smoke run includes: ${testCase}`);
}

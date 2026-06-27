const regressionPlan = [
  'login smoke',
  'create order',
  'pay order',
  'logout smoke',
];

regressionPlan.splice(2, 0, 'apply discount');
// state after step 1:
// ['login smoke', 'create order', 'apply discount', 'pay order', 'logout smoke']

regressionPlan.splice(3, 1, 'pay order with saved card');
// state after step 2:
// ['login smoke', 'create order', 'apply discount', 'pay order with saved card', 'logout smoke']

console.log(regressionPlan);

const regressionPlan = [
  'login smoke',
  'create order',
  'apply discount',
  'pay order',
  'logout smoke',
];

const paymentFlowSnapshot = regressionPlan.slice(2, 4);

console.log('Full plan:', regressionPlan);
console.log('Payment flow:', paymentFlowSnapshot);

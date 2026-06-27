const executedRequests = [
  'GET /users',
  'POST /orders'
];

const lastRequest = executedRequests.pop();

console.log(lastRequest);
console.log(executedRequests);

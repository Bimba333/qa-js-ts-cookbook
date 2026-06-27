const requestTasks = ['GET /users', 'GET /orders'];

requestTasks.unshift('POST /login');

const nextRequest = requestTasks.shift();

console.log(`Execute first: ${nextRequest}`);
console.log(requestTasks);

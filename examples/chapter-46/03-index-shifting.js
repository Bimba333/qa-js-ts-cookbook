const requestTasks = ['GET /users', 'GET /orders'];

console.log(requestTasks[0]);

requestTasks.unshift('POST /login');

console.log(requestTasks[0]);
console.log(requestTasks[1]);
console.log(requestTasks[2]);

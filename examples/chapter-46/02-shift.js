const requestTasks = ['POST /login', 'GET /users', 'GET /orders'];

const firstTask = requestTasks.shift();

console.log(firstTask);
console.log(requestTasks);

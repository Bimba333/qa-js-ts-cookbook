const requestTasks = ['POST /login', 'GET /users'];

const nextTask = requestTasks.shift();

console.log(nextTask);
console.log(requestTasks.length);

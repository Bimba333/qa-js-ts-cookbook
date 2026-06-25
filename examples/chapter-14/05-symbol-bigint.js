const firstId = Symbol('id');
const secondId = Symbol('id');
const largeOrderId = 9007199254740993n;

console.log(firstId === secondId);
console.log(largeOrderId);
console.log(typeof firstId);
console.log(typeof largeOrderId);

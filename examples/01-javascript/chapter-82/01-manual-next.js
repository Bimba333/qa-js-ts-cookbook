const testCases = ['login', 'checkout'];
const iterator = testCases[Symbol.iterator]();

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());

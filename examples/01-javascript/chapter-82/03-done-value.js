const artifacts = ['logs'];
const iterator = artifacts[Symbol.iterator]();

console.log(iterator.next());
console.log(iterator.next());

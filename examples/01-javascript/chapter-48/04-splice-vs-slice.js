const sourceForSlice = ['login smoke', 'create order', 'pay order'];
const sourceForSplice = ['login smoke', 'create order', 'pay order'];

const copied = sourceForSlice.slice(1, 2);
const removed = sourceForSplice.splice(1, 1);

console.log('slice source:', sourceForSlice);
console.log('slice result:', copied);
console.log('splice source:', sourceForSplice);
console.log('splice result:', removed);

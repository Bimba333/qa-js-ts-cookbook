const testCases = [
  { id: 'T-1', title: 'login' },
  { id: 'T-2', title: 'checkout' },
];

const iterator = testCases[Symbol.iterator]();

let current = iterator.next();

while (!current.done) {
  console.log(`execute ${current.value.id}: ${current.value.title}`);
  current = iterator.next();
}

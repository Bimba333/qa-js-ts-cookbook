const reportEntries = ['logs', 'screenshot', 'trace'];
const iterator = reportEntries[Symbol.iterator]();

let result = iterator.next();

while (!result.done) {
  console.log(result.value);
  result = iterator.next();
}

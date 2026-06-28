const testOwners = new Map([
  ['login', 'Anna'],
  ['checkout', 'Maksim'],
]);

const priorities = new Set(['high', 'medium', 'low']);

for (const entry of testOwners) {
  console.log(entry);
}

for (const priority of priorities) {
  console.log(priority);
}

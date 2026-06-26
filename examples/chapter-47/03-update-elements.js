const testUsers = [
  'anna@example.test',
  'kate@example.test',
  'max@example.test'
];

testUsers[1] = 'kate.updated@example.test';

console.log(testUsers[1]);
console.log(testUsers);

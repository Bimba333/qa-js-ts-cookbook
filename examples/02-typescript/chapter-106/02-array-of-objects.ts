const users: Array<{ name: string; role: string }> = [
  { name: 'Anna', role: 'admin' },
  { name: 'Ivan', role: 'viewer' },
];

for (const user of users) {
  console.log(`${user.name}: ${user.role}`);
}

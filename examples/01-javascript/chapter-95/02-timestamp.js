const createdAt = new Date('2026-06-28T10:00:00.000Z');

console.log(createdAt.getTime());
console.log(typeof createdAt.getTime());
console.log(Date.now() > createdAt.getTime());

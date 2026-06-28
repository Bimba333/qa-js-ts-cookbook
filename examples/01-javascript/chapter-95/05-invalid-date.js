const date = new Date('not-a-date');
const timestamp = date.getTime();

console.log(Number.isNaN(timestamp));

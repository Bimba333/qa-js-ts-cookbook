let currentUser = {
  name: 'Anna',
};

const firstUser = currentUser;

currentUser = {
  name: 'Kate',
};

console.log(firstUser.name);
console.log(currentUser.name);

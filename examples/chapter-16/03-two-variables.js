const user = {
  name: 'Anna',
  role: 'user',
};

const currentUser = user;

console.log(user.name);
console.log(currentUser.name);
console.log(user === currentUser);

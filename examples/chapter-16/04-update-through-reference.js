const user = {
  name: 'Anna',
  role: 'user',
};

const currentUser = user;

currentUser.role = 'admin';

console.log(user.role);
console.log(currentUser.role);

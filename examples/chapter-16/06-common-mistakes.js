const expectedUser = {
  name: 'Anna',
  role: 'user',
};

const actualUser = expectedUser;

actualUser.role = 'admin';

console.log(expectedUser.role);
console.log(actualUser.role);

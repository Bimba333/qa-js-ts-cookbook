const user = {
  firstName: 'Anna',
  lastName: 'Smith',
  temporaryCode: '1234',
};

delete user.temporaryCode;

console.log(user);
console.log(user.temporaryCode);

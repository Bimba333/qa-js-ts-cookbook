const user = {
  name: 'Anna',
  role: 'user',
};

const admin = user;

admin.role = 'admin';

console.log(user.role);
console.log(admin.role);

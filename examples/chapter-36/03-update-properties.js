const user = {
  id: 101,
  name: 'Anna',
  role: 'admin',
  active: true
};

user.role = 'owner';
user.lastLogin = '2026-06-26';

console.log(user.role);
console.log(user.lastLogin);

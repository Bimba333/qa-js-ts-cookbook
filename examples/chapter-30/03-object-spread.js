const baseUser = {
  role: 'user',
  active: true
};

const adminUser = {
  ...baseUser,
  role: 'admin'
};

console.log(adminUser);

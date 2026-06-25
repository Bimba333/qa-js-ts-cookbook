function updateRole(user) {
  user.role = 'admin';
}

const testUser = {
  name: 'Anna',
  role: 'user',
};

updateRole(testUser);

console.log(testUser.role);

function createUserPayload(user) {
  return {
    name: user.name,
    role: user.role,
  };
}

const user = {
  fullName: 'Anna',
  role: 'admin',
};

console.log(createUserPayload(user));

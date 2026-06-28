function createUserPayload(name, role) {
  return {
    name,
    role,
    active: true,
  };
}

const admin = createUserPayload('Anna', 'admin');
const viewer = createUserPayload('Ivan', 'viewer');

console.log(admin);
console.log(viewer);

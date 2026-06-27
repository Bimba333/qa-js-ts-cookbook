const userBehavior = {
  describe() {
    return `${this.name} [${this.role}]`;
  }
};

const adminUser = {
  name: 'Anna',
  role: 'admin'
};

const editorUser = {
  name: 'Kate',
  role: 'editor'
};

Object.setPrototypeOf(adminUser, userBehavior);
Object.setPrototypeOf(editorUser, userBehavior);

console.log(adminUser.describe());
console.log(editorUser.describe());
console.log(adminUser.describe === editorUser.describe);

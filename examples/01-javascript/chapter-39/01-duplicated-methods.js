const adminUser = {
  name: 'Anna',
  role: 'admin',
  describe() {
    return `${this.name} [${this.role}]`;
  }
};

const editorUser = {
  name: 'Kate',
  role: 'editor',
  describe() {
    return `${this.name} [${this.role}]`;
  }
};

console.log(adminUser.describe());
console.log(editorUser.describe());
console.log(adminUser.describe === editorUser.describe);

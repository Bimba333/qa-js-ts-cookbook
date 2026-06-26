const userBehavior = {
  describe() {
    return `${this.name} [${this.role}]`;
  }
};

const user = {
  name: 'Anna',
  role: 'admin'
};

Object.setPrototypeOf(user, userBehavior);

console.log(user.name);
console.log(user.describe());
console.log(Object.getPrototypeOf(user) === userBehavior);

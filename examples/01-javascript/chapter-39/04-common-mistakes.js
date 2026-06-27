const userBehavior = {
  lastAction: 'none',
  describe() {
    return `${this.name}: ${this.lastAction}`;
  }
};

const firstUser = {
  name: 'Anna',
  lastAction: 'created order'
};

const secondUser = {
  name: 'Kate',
  lastAction: 'updated profile'
};

Object.setPrototypeOf(firstUser, userBehavior);
Object.setPrototypeOf(secondUser, userBehavior);

console.log(firstUser.describe());
console.log(secondUser.describe());
console.log(userBehavior.lastAction);

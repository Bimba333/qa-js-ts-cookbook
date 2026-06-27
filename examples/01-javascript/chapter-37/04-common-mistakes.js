const user = {
  name: 'Anna',
  describe() {
    return this.name;
  }
};

const describe = user.describe;

console.log(user.describe());
console.log(typeof describe);

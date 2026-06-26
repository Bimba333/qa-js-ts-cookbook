const sharedBehavior = {
  status: 'shared',
  describeStatus() {
    return this.status;
  }
};

const testRun = {
  status: 'local'
};

Object.setPrototypeOf(testRun, sharedBehavior);

console.log(testRun.status);
console.log(testRun.describeStatus());

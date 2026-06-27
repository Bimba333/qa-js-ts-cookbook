const reportingBehavior = {
  formatFailure() {
    return `${this.name}: expected ${this.expected}, actual ${this.actual}`;
  }
};

const validatorBehavior = {
  isValid() {
    return this.expected === this.actual;
  }
};

const statusValidator = {
  name: 'StatusValidator',
  expected: 200,
  actual: 201
};

Object.setPrototypeOf(validatorBehavior, reportingBehavior);
Object.setPrototypeOf(statusValidator, validatorBehavior);

console.log(statusValidator.isValid());
console.log(statusValidator.formatFailure());

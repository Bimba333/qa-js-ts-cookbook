class BaseValidator {
  formatFailure(expected, actual) {
    return `expected ${expected}, actual ${actual}`;
  }
}

class StatusValidator extends BaseValidator {
  formatFailure(expected, actual) {
    const baseMessage = super.formatFailure(expected, actual);
    return `Status mismatch: ${baseMessage}`;
  }
}

const validator = new StatusValidator();

console.log(validator.formatFailure(200, 201));

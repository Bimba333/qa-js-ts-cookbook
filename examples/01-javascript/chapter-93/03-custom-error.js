class InvalidTestDataError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidTestDataError';
  }
}

function validateUserData(user) {
  if (!user.email) {
    throw new InvalidTestDataError('email is required');
  }

  if (!user.role) {
    throw new InvalidTestDataError('role is required');
  }

  return user;
}

try {
  validateUserData({ role: 'admin' });
} catch (error) {
  console.log(error.name);
  console.log(error.message);
}

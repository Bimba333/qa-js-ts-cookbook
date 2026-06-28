// EDUCATIONAL INVALID EXAMPLE
// Файл намеренно выбрасывает ошибку, чтобы показать stack trace.

function testScenario() {
  createUser();
}

function createUser() {
  buildUserData();
}

function buildUserData() {
  throw new Error('Invalid user data');
}

testScenario();

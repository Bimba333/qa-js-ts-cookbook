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

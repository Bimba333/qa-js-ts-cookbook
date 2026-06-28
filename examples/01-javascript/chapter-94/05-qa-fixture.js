function saveFixture(data) {
  return JSON.stringify(data);
}

function loadFixture(text) {
  return JSON.parse(text);
}

const userFixture = {
  email: 'qa@example.com',
  role: 'admin',
};

const savedFixture = saveFixture(userFixture);
const loadedFixture = loadFixture(savedFixture);

console.log(savedFixture);
console.log(loadedFixture.email);

type TestUser = {
  email: string;
  password: string;
  active: boolean;
};

const testUser: TestUser = {
  email: 'qa@example.test',
  password: 'secret',
  active: true,
};

console.log(testUser.email);

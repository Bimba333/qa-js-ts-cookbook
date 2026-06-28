const fixture = {
  email: 'qa@example.com',
  role: undefined,
  prepare() {
    return 'ready';
  },
};

const jsonText = JSON.stringify(fixture);

console.log(jsonText);

function buildLoginRequest(credentials) {
  return {
    login: credentials.username,
    password: credentials.password,
  };
}

const credentials = {
  userName: 'qa-user',
  password: 'secret',
};

console.log(buildLoginRequest(credentials));

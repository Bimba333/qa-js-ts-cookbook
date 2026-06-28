function login(userName) {
  if (!userName) {
    return Promise.reject('user name is required');
  }

  return Promise.resolve(`${userName}: logged in`);
}

login('').catch(function handleLoginError(error) {
  console.log(`login error: ${error}`);
});

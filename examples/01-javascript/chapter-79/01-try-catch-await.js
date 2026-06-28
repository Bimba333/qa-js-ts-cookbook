function login(userName) {
  if (!userName) {
    return Promise.reject('user name is required');
  }

  return Promise.resolve(`${userName}: logged in`);
}

async function runLogin() {
  try {
    const result = await login('');
    console.log(result);
  } catch (error) {
    console.log(`caught: ${error}`);
  }
}

runLogin();

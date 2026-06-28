function login() {
  return Promise.resolve('login completed');
}

async function runTest() {
  const loginStatus = await login();
  console.log(loginStatus);
  console.log('test executed');
}

runTest();

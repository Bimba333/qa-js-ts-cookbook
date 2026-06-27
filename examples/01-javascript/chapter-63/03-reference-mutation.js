function c() {
  const user = { name: 'Anna', status: 'created' };
  const sameUser = user;

  sameUser.status = 'active';

  console.log(user.status);
}

function b() {
  c();
}

function a() {
  b();
}

a();

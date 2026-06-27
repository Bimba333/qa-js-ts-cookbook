function c() {
  const user = { name: 'Anna' };

  console.log(user.name);
}

function b() {
  c();
}

function a() {
  b();
}

a();

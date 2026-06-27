function c() {
  const count = 3;
  const user = { name: 'Anna' };

  console.log(count);
  console.log(user.name);
}

function b() {
  c();
}

function a() {
  b();
}

a();

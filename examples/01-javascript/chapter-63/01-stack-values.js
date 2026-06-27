function c() {
  const count = 3;

  console.log(count);
}

function b() {
  c();
}

function a() {
  b();
}

a();

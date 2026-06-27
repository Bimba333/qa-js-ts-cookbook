function c() {
  console.log('inside c');
}

function b() {
  c();
}

function a() {
  b();
}

a();

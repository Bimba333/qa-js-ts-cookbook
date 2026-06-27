function c() {
  console.log(value);

  var value = 'inside c';

  console.log(value);
}

function b() {
  c();
}

function a() {
  b();
}

a();

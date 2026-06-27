function c() {
  console.log('enter c');
  console.log('leave c');
}

function b() {
  console.log('enter b');
  c();
  console.log('leave b');
}

function a() {
  console.log('enter a');
  b();
  console.log('leave a');
}

a();

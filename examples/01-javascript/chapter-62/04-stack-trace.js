function c() {
  throw new Error('Failure inside c');
}

function b() {
  c();
}

function a() {
  b();
}

try {
  a();
} catch (error) {
  console.log(error.stack.split('\n').slice(0, 4).join('\n'));
}

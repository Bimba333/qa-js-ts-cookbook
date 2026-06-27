function c() {
  try {
    console.log(message);

    let message = 'inside c';
  } catch (error) {
    console.log(error.name);
  }
}

function b() {
  c();
}

function a() {
  b();
}

a();

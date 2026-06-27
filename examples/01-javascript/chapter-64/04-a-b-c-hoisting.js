a();

function a() {
  const label = 'a';

  b(label);
}

function b(previousLabel) {
  const label = `${previousLabel} -> b`;

  c(label);
}

function c(previousLabel) {
  const label = `${previousLabel} -> c`;

  console.log(label);
}

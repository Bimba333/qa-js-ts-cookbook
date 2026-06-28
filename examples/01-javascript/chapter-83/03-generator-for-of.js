function* artifactNames() {
  yield 'logs';
  yield 'screenshot';
  yield 'trace';
}

for (const artifact of artifactNames()) {
  console.log(artifact);
}

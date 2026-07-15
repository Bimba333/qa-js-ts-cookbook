function failTest(message: string): never {
  throw new Error(message);
}

try {
  failTest('Required response body is missing');
} catch {
  console.log('test was stopped by an error');
}

const rawValue: any = { status: 'ok' };

console.log(rawValue.status);

try {
  console.log(rawValue.missing.deep.value);
} catch {
  console.log('runtime error was hidden from TypeScript by any');
}

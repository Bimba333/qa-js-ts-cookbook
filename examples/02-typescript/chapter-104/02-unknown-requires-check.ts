function printUpperCase(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
    return;
  }

  console.log('value is not a string');
}

printUpperCase('ready');
printUpperCase(42);

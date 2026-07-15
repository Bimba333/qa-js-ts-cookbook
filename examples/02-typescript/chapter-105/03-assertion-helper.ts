function missingConfig(name: string): never {
  throw new Error(`Missing config: ${name}`);
}

function readRequiredConfig(name: string, value: string): string {
  if (value.length === 0) {
    missingConfig(name);
  }

  return value;
}

console.log(readRequiredConfig('BASE_URL', 'https://api.example.test'));

export {};

function buildTitle(name: string, prefix?: string): string {
  return prefix ? `${prefix}: ${name}` : name;
}

function retryLabel(retries = 2): string {
  return `retries: ${retries}`;
}

console.log(buildTitle('login'));
console.log(buildTitle('checkout', 'smoke'));
console.log(retryLabel());

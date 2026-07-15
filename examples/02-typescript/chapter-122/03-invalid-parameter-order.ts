export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE

// @ts-expect-error required parameter cannot follow an optional parameter.
function buildTitle(prefix?: string, name: string): string {
  return prefix ? `${prefix}: ${name}` : name;
}

console.log(buildTitle('smoke', 'login'));

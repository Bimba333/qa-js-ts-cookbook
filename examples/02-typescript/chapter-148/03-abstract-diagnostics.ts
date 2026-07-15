export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
abstract class BasePage {
  abstract route: string;

  getRoute(): string {
    return this.route;
  }
}

// @ts-expect-error Abstract class cannot be instantiated directly.
const page = new BasePage();

console.log(page.getRoute());

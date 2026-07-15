export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
class TestCase {
  title: string;

  constructor(title: string) {
    this.title = title;
  }
}

// @ts-expect-error Constructor expects a string title.
const test = new TestCase(123);

console.log(test);

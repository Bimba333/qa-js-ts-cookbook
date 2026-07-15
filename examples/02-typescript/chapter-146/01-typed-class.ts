export {};

class TestCase {
  title: string;
  retries: number;

  constructor(title: string, retries: number) {
    this.title = title;
    this.retries = retries;
  }

  buildLabel(): string {
    return `${this.title} (${this.retries})`;
  }
}

const test = new TestCase("opens login page", 2);

console.log(test.buildLabel());

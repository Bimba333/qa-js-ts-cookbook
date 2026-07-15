export {};

interface AssertionMessageBuilder {
  buildMessage(actual: string, expected: string): string;
}

class DefaultMessageBuilder implements AssertionMessageBuilder {
  buildMessage(actual: string, expected: string): string {
    return `Expected ${expected}, received ${actual}`;
  }
}

const builder = new DefaultMessageBuilder();

console.log(builder.buildMessage("error", "success"));

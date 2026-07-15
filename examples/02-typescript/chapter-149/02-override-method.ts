export {};

class JsonReporter {
  serialize(value: string): string {
    return JSON.stringify({ value });
  }
}

class PrettyJsonReporter extends JsonReporter {
  override serialize(value: string): string {
    return JSON.stringify({ value }, null, 2);
  }
}

const reporter = new PrettyJsonReporter();

console.log(reporter.serialize("passed"));

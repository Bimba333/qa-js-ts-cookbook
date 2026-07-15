export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
interface Runner {
  run(): void;
}

// @ts-expect-error SmokeRunner does not implement run().
class SmokeRunner implements Runner {
  title = "smoke";
}

const runner = new SmokeRunner();

console.log(runner.title);

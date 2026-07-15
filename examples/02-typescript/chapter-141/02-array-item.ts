export {};

type TestResults = Array<{
  title: string;
  status: "passed" | "failed";
}>;

type TestResult = TestResults[number];

const result: TestResult = {
  title: "opens login page",
  status: "passed",
};

console.log(result.title);


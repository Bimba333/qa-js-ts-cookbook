export {};

declare const testEnvironment: {
  name: "local" | "staging";
  baseUrl: string;
};

function readEnvironmentName(): string {
  return testEnvironment.name;
}

console.log(typeof readEnvironmentName);


export {};

function buildTitle(suite: string, test: string) {
  return `${suite}: ${test}`;
}

type BuildTitleArgs = Parameters<typeof buildTitle>;
type BuildTitleResult = ReturnType<typeof buildTitle>;

const args: BuildTitleArgs = ["Smoke", "opens login page"];
const title: BuildTitleResult = buildTitle(...args);

console.log(title);


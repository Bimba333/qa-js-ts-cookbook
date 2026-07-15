export {};

interface LoginPage {
  open(): Promise<void>;
}

type TestFixtures = {
  loginPage: LoginPage;
  environmentName: "local" | "staging" | "production";
};

type BuildReportTitle = (suiteName: string, status: "passed" | "failed") => string;

const buildReportTitle: BuildReportTitle = (suiteName, status) => {
  return `${suiteName}: ${status}`;
};

async function prepareScenario(fixtures: TestFixtures): Promise<string> {
  await fixtures.loginPage.open();

  return buildReportTitle(`login on ${fixtures.environmentName}`, "passed");
}

const fixtures: TestFixtures = {
  loginPage: {
    async open() {
      console.log("open login page");
    },
  },
  environmentName: "staging",
};

void prepareScenario(fixtures).then((title) => console.log(title));

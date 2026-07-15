export {};

function readSetting<Settings, Key extends keyof Settings>(
  settings: Settings,
  key: Key,
): Settings[Key] {
  return settings[key];
}

const environment = {
  name: "staging",
  baseUrl: "https://staging.example.test",
  retries: 1,
};

console.log(readSetting(environment, "baseUrl"));

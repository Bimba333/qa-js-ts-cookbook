export {};

const config = {
  baseUrl: "https://stage.example.com",
  retries: 2,
};

type Config = typeof config;

const copiedConfig: Config = {
  baseUrl: "https://dev.example.com",
  retries: 1,
};

console.log(copiedConfig.baseUrl);


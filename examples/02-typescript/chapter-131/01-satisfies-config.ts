export {};

type EnvironmentConfig = {
  baseUrl: string;
  retries: number;
};

const config = {
  baseUrl: "https://service.local",
  retries: 2,
} satisfies EnvironmentConfig;

console.log(config.retries);

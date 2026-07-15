export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
type EnvironmentName = "local" | "staging" | "production";

type EnvironmentConfig = {
  name: EnvironmentName;
  baseUrl: string;
  retries: number;
};

type EnvironmentMap = Record<EnvironmentName, EnvironmentConfig>;

const environments = {
  local: {
    name: "local",
    baseUrl: "http://localhost:3000",
    retries: 0,
  },
  staging: {
    name: "staging",
    baseUrl: "https://staging.example.test",
    retries: 2,
  },
  // @ts-expect-error production обязателен в Record<EnvironmentName, EnvironmentConfig>.
} satisfies EnvironmentMap;

console.log(Object.keys(environments));

export type EnvironmentConfig = {
  protocol: "http" | "https";
  host: string;
};

export const defaultConfig: EnvironmentConfig = {
  protocol: "https",
  host: "app.test",
};


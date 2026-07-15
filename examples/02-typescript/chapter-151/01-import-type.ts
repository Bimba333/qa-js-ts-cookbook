import { defaultConfig } from "./environment-config.js";
import type { EnvironmentConfig } from "./environment-config.js";

function buildBaseUrl(config: EnvironmentConfig): string {
  return `${config.protocol}://${config.host}`;
}

console.log(buildBaseUrl(defaultConfig));


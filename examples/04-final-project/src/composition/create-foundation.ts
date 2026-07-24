import type { RuntimeConfig } from "../config/index.js";
import { ResourceScope } from "./resource-scope.js";

export type FoundationContext = Readonly<{
  config: RuntimeConfig;
  profile: RuntimeConfig["profile"];
  isCi: boolean;
}>;

export type FoundationRuntime = Readonly<{
  context: FoundationContext;
  close(...primary: [] | [primaryError: unknown]): Promise<void>;
}>;

export function createFoundation(config: RuntimeConfig): FoundationRuntime {
  const scope = new ResourceScope();
  const context: FoundationContext = Object.freeze({
    config,
    profile: config.profile,
    isCi: config.isCi,
  });

  return Object.freeze({
    context,
    close: (...primary: [] | [primaryError: unknown]) =>
      scope.close(...primary),
  });
}

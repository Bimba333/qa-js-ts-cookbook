export type ConfigurationErrorCode =
  | "missing"
  | "unsupported"
  | "invalid_format"
  | "invalid_range"
  | "inconsistent";

export class ConfigurationError extends Error {
  readonly code: ConfigurationErrorCode;
  readonly key: string;

  constructor(
    code: ConfigurationErrorCode,
    key: string,
    reason: string,
    cause?: unknown,
  ) {
    super(
      `Ошибка конфигурации ${key}: ${reason}`,
      cause === undefined ? undefined : { cause },
    );
    this.name = "ConfigurationError";
    this.code = code;
    this.key = key;
  }
}

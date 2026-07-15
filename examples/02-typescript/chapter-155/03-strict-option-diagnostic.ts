export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
type StrictConfig = {
  strict: boolean;
  noEmit: boolean;
};

// @ts-expect-error noEmit обязателен в типе конфигурации проекта.
const config: StrictConfig = {
  strict: true,
};

console.log(config.strict);

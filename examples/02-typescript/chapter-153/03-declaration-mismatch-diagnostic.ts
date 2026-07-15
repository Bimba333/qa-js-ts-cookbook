export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
declare function createReportLine(title: string, passed: boolean): string;

// @ts-expect-error Согласно декларации второй аргумент должен быть boolean.
const line = createReportLine("login", "passed");

console.log(line);

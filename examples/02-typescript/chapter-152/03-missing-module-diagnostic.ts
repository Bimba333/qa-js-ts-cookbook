export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
// @ts-expect-error Импортируемого модуля не существует.
import { buildMissingReport } from "./missing-report.js";

console.log(typeof buildMissingReport);

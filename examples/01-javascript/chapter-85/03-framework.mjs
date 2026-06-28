import { assertStatus } from './03-assertions.mjs';
import { createReport } from './03-reporter.mjs';

const passed = assertStatus(200, 200);
const report = createReport('login test', passed);

console.log(`${report.testName}: ${report.status}`);

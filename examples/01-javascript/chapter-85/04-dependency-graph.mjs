import { config } from './02-config.mjs';
import log from './02-logger.mjs';
import { assertStatus } from './03-assertions.mjs';
import { createReport } from './03-reporter.mjs';

log('dependency graph example');

const passed = assertStatus(201, 201);
const report = createReport(`api test at ${config.baseUrl}`, passed);

console.log(report);

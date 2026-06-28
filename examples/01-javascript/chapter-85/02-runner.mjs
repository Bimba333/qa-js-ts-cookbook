import { config } from './02-config.mjs';
import log from './02-logger.mjs';

log(`run against ${config.baseUrl}`);
console.log(`retries: ${config.retries}`);

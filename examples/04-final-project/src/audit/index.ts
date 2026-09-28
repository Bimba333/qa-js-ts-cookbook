export {
  AUDIT_SPECIFICATION,
  SEVERITY_WEIGHT,
  severities,
} from "./specification.js";
export type { AuditArea, Severity } from "./specification.js";
export { audit, AuditError, formatReport, statuses } from "./audit.js";
export type { AuditLine, AuditReport, AuditStatus, Finding } from "./audit.js";

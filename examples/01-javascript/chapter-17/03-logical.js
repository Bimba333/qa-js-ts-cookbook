const isStatusOk = true;
const hasUserId = true;
const isDeleted = false;

const canContinue = isStatusOk && hasUserId;
const shouldReportProblem = !isStatusOk || isDeleted;

console.log(canContinue);
console.log(shouldReportProblem);

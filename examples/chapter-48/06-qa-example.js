const failedAssertions = [];

failedAssertions.push('status expected 200, actual 500');
failedAssertions.push('role expected admin, actual viewer');

const lastFailure = failedAssertions.pop();

console.log(lastFailure);
console.log(failedAssertions.length);
console.log(failedAssertions[0]);

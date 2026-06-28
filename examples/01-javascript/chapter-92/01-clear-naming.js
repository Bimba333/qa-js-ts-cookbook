function isSuccessfulStatus(status) {
  return status === 'passed' || status === 'skipped';
}

const status = 'passed';

console.log(isSuccessfulStatus(status));

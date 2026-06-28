const testResult = {
  title: 'checkout creates order',
  status: 'passed',
  meta: {
    owner: 'qa-team',
    environment: {
      browser: 'chromium',
    },
  },
};

const { title, status, meta = {} } = testResult;
const owner = meta.owner ?? 'unknown';
const browser = meta.environment?.browser ?? 'chromium';

console.log(`${title}: ${status}`);
console.log(`owner: ${owner}`);
console.log(`browser: ${browser}`);

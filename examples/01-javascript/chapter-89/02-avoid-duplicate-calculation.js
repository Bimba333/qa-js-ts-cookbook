const testRuns = [
  { id: 'R-1', durationMs: 300 },
  { id: 'R-2', durationMs: 700 },
  { id: 'R-3', durationMs: 200 },
];

function getTotalDuration(runs) {
  return runs.reduce((total, run) => total + run.durationMs, 0);
}

const totalDuration = getTotalDuration(testRuns);

console.log(`total duration: ${totalDuration}`);
console.log(`average duration: ${totalDuration / testRuns.length}`);

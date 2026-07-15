function buildRunLabel(suiteName: string, runNumber: number): string {
  return `${suiteName} run #${runNumber}`;
}

const label = buildRunLabel('api smoke', 12);

console.log(label);

const startedAt = new Date('2026-06-28T10:00:00.000Z').getTime();
const finishedAt = new Date('2026-06-28T10:00:05.000Z').getTime();

const durationMs = finishedAt - startedAt;

console.log(durationMs);

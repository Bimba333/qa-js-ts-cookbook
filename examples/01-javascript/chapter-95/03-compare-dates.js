const startedAt = new Date('2026-06-28T10:00:00.000Z');
const finishedAt = new Date('2026-06-28T10:00:03.000Z');

const startedTimestamp = startedAt.getTime();
const finishedTimestamp = finishedAt.getTime();

console.log(finishedTimestamp > startedTimestamp);

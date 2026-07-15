export {};

function joinTags(...tags: string[]): string {
  return tags.join(', ');
}

console.log(joinTags('smoke', 'critical', 'api'));

const metadata: {
  readonly testId: string;
  title: string;
  owner?: string;
} = {
  testId: 'T-102',
  title: 'checkout submit',
};

console.log(`${metadata.testId}: ${metadata.title}`);

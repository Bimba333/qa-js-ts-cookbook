const testRun: {
  id: string;
  environment: {
    name: string;
    baseUrl: string;
  };
} = {
  id: 'RUN-42',
  environment: {
    name: 'staging',
    baseUrl: 'https://api.example.test',
  },
};

console.log(`${testRun.id}: ${testRun.environment.baseUrl}`);

export {};

async function failSetup(): Promise<void> {
  throw new Error('setup failed');
}

failSetup()
  .then(() => {
    console.log('setup complete');
  })
  .catch((error: unknown) => {
    if (error instanceof Error) {
      console.log(error.message);
    }
  });

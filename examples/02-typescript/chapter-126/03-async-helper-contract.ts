export {};

type SetupResult = {
  status: 'ready';
  retries: number;
};

async function prepareEnvironment(): Promise<SetupResult> {
  return {
    status: 'ready',
    retries: 2,
  };
}

prepareEnvironment()
  .then((result) => {
    console.log(result.status, result.retries);
  })
  .catch((error: unknown) => {
    console.error(error);
  });

export {};

async function loadStatus(): Promise<'passed'> {
  return 'passed';
}

loadStatus()
  .then((status) => {
    console.log(status);
  })
  .catch((error: unknown) => {
    console.error(error);
  });

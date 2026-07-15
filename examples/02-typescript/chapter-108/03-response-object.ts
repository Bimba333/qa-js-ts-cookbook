// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE

const responseSummary: { statusCode: number; statusText: string } = {
  statusCode: 200,
  // @ts-expect-error statusText must be a string.
  statusText: true,
};

console.log(responseSummary);

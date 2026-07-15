// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE

const headers: { [key: string]: string } = {
  accept: 'application/json',
  // @ts-expect-error header value must be a string.
  retries: 2,
};

console.log(headers);

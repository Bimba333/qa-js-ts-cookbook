const expectedStatusCode = 200;
const actualStatusCode = '200';
const parsedStatusCode = Number(actualStatusCode);

console.log(expectedStatusCode === actualStatusCode);
console.log(expectedStatusCode === parsedStatusCode);

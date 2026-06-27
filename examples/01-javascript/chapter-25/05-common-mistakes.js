function printStatusCheck(statusCode) {
  console.log(statusCode === 200);
}

function returnStatusCheck(statusCode) {
  return statusCode === 200;
}

const printedResult = printStatusCheck(200);
const returnedResult = returnStatusCheck(200);

console.log('Printed function returned:', printedResult);
console.log('Returned function returned:', returnedResult);

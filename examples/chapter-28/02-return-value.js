function getStatusMessage(statusCode) {
  return statusCode === 200 ? 'Status is successful' : 'Status is not successful';
}

const message = getStatusMessage(200);

console.log(message);

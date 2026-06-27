function getStatusMessage(statusCode) {
  if (statusCode === 200) {
    return 'Status is successful';
  }

  return 'Status is not successful';
}

console.log(getStatusMessage(200));
console.log(getStatusMessage(500));

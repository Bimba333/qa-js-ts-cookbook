function validateStatus(statusCode) {
  console.log('Received status:', statusCode);
}

validateStatus();
validateStatus(200);
validateStatus(200, 201);

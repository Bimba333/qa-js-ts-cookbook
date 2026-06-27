function validateSuccessfulResponse() {
  const statusCode = 200;

  if (statusCode !== 200) {
    throw new Error('Expected status 200');
  }

  console.log('Response status is valid');
}

validateSuccessfulResponse();

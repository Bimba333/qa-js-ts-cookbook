function assertStatusCode(response, expectedStatus) {
  if (response.status !== expectedStatus) {
    throw new Error(`Expected status ${expectedStatus}, received ${response.status}`);
  }
}

const response = {
  status: 500,
  body: {
    message: 'Internal error',
  },
};

try {
  assertStatusCode(response, 200);
  console.log('Response status is correct');
} catch (error) {
  console.log(error.name);
  console.log(error.message);
}

const statusCode = 500;

try {
  if (statusCode !== 200) {
    throw new Error(`Expected status 200, received ${statusCode}`);
  }

  console.log('Validate response body');
} catch (error) {
  console.log(error.message);
}

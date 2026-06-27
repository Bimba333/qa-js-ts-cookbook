const response = {
  statusCode: 500,
  rawBody: '{ "id": 101 }',
};

try {
  if (response.statusCode !== 200) {
    throw new Error(`Expected status 200, received ${response.statusCode}`);
  }

  const body = JSON.parse(response.rawBody);
  console.log(body.id);
} catch (error) {
  console.log('Test should stop:', error.message);
} finally {
  console.log('Cleanup test data');
}

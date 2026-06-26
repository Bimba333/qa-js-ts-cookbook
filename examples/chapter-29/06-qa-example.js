function validateStatuses(expectedStatus, ...actualStatuses) {
  console.log('Expected status:', expectedStatus);
  console.log('Received statuses:', actualStatuses);
}

validateStatuses(200, 200, 200, 201);

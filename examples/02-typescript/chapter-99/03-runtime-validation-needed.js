function parseStatus(response) {
  if (!response || typeof response.status !== 'string') {
    throw new Error('Response status must be a string');
  }

  return response.status;
}

console.log(parseStatus({ status: 'ok' }));

const rawBody = 'not valid json';

try {
  const body = JSON.parse(rawBody);
  console.log(body.id);
} catch (error) {
  console.log('Could not parse response body');
}

console.log('Program continues in controlled path');

const responses = [
  { statusCode: 200 },
  { statusCode: 200 },
  { statusCode: 500 },
];

for (let index = 0; index < responses.length; index += 1) {
  const response = responses[index];

  if (response.statusCode !== 200) {
    console.log('Invalid response at index', index);
    break;
  }

  console.log('Valid response at index', index);
}

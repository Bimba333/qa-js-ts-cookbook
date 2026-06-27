const rawBody = '{ "id": 101, "name": "Anna"';

try {
  JSON.parse(rawBody);
  console.log('Parsed response');
} catch (error) {
  console.log('Runtime error was handled');
}

const rawBody = 'not valid json';

try {
  JSON.parse(rawBody);
} catch (error) {
  console.log('Something failed, but original details were hidden');
}

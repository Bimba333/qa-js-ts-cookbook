const rawBody: unknown = JSON.parse('{"status":"ok"}');

if (
  typeof rawBody === 'object' &&
  rawBody !== null &&
  'status' in rawBody
) {
  console.log('response has status');
} else {
  console.log('unexpected response shape');
}

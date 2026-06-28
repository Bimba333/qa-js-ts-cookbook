const responseText = '{"status":"passed","duration":1200}';

const responseBody = JSON.parse(responseText);

console.log(responseBody.status);
console.log(responseBody.duration);

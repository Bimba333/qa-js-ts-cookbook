const baseUrl = 'https://example.com';

function printLoginUrl() {
  const loginPath = '/login';

  console.log(baseUrl + loginPath);
}

printLoginUrl();
console.log(baseUrl);

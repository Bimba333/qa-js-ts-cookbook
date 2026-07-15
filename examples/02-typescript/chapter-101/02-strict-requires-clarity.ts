function buildUserUrl(baseUrl: string, userId: string) {
  return `${baseUrl}/users/${userId}`;
}

console.log(buildUserUrl('https://api.example.test', '42'));

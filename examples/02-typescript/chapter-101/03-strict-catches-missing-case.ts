function normalizeBaseUrl(baseUrl: string | undefined) {
  if (baseUrl === undefined) {
    throw new Error('baseUrl is required');
  }

  return baseUrl.toLowerCase();
}

console.log(normalizeBaseUrl('https://api.example.test'));

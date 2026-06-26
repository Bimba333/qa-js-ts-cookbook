function formatRequest(method, path, body) {
  return method + ' ' + this.baseUrl + path + ' ' + body;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

const requestParts = ['POST', '/users', '{"name":"Anna"}'];

console.log(formatRequest.apply(apiClient, requestParts));

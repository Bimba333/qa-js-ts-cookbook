const apiClient = {
  baseUrl: 'https://api.example.test',
  buildUrl: function (path) {
    return this.baseUrl + path;
  },
  validateStatus: function (response) {
    return response.status === 200;
  }
};

const response = {
  status: 200
};

console.log(apiClient.buildUrl('/users'));
console.log(apiClient.validateStatus(response));

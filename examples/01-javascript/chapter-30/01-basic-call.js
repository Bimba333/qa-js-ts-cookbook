function printBaseUrl() {
  console.log(this.baseUrl);
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

printBaseUrl.call(apiClient);

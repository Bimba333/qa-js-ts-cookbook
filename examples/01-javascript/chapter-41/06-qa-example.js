class ApiClient {
  constructor(name, baseUrl) {
    this.name = name;
    this.baseUrl = baseUrl;
  }

  describeRequest(endpoint) {
    return `${this.name}: ${this.baseUrl}${endpoint}`;
  }
}

const stagingClient = new ApiClient('staging', 'https://staging.example.test');
const productionClient = new ApiClient('production', 'https://api.example.test');

console.log(stagingClient.describeRequest('/users'));
console.log(productionClient.describeRequest('/users'));

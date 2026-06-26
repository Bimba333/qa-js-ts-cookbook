const apiClientBehavior = {
  describeRequest(endpoint) {
    return `${this.name}: ${this.baseUrl}${endpoint}`;
  }
};

const stagingClient = {
  name: 'staging',
  baseUrl: 'https://staging.example.test'
};

const productionClient = {
  name: 'production',
  baseUrl: 'https://api.example.test'
};

Object.setPrototypeOf(stagingClient, apiClientBehavior);
Object.setPrototypeOf(productionClient, apiClientBehavior);

console.log(stagingClient.describeRequest('/users'));
console.log(productionClient.describeRequest('/users'));

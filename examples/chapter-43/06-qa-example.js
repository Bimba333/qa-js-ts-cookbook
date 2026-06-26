const frameworkBehavior = {
  describeRequest(endpoint) {
    return `${this.name}: ${this.baseUrl}${endpoint}`;
  }
};

const apiServiceBehavior = {
  userEndpoint(userId) {
    return `/users/${userId}`;
  }
};

const usersClient = {
  name: 'UsersClient',
  baseUrl: 'https://api.example.test'
};

Object.setPrototypeOf(apiServiceBehavior, frameworkBehavior);
Object.setPrototypeOf(usersClient, apiServiceBehavior);

const endpoint = usersClient.userEndpoint('42');

console.log(endpoint);
console.log(usersClient.describeRequest(endpoint));

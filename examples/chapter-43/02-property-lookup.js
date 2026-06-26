const frameworkBehavior = {
  describeRequest() {
    return `${this.serviceName} -> ${this.baseUrl}`;
  }
};

const serviceBehavior = {
  buildEndpoint(resource) {
    return `/api/${this.serviceName}/${resource}`;
  }
};

const usersClient = {
  serviceName: 'users',
  baseUrl: 'https://api.example.test'
};

Object.setPrototypeOf(serviceBehavior, frameworkBehavior);
Object.setPrototypeOf(usersClient, serviceBehavior);

console.log(usersClient.serviceName);
console.log(usersClient.buildEndpoint('42'));
console.log(usersClient.describeRequest());

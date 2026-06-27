class BaseApiClient {
  describeRequest(serviceName, endpoint) {
    return `${serviceName}: ${endpoint}`;
  }
}

class UsersClient extends BaseApiClient {
  describeRequest(endpoint) {
    const baseDescription = super.describeRequest('users', endpoint);
    return `${baseDescription} [authenticated]`;
  }
}

const usersClient = new UsersClient();

console.log(usersClient.describeRequest('/users/42'));

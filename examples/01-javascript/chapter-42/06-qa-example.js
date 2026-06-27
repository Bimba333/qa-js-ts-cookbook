class BaseApiClient {
  describeRequest(serviceName, endpoint) {
    return `${serviceName}: ${endpoint}`;
  }
}

class UsersClient extends BaseApiClient {
  userEndpoint(userId) {
    return `/users/${userId}`;
  }
}

class OrdersClient extends BaseApiClient {
  orderEndpoint(orderId) {
    return `/orders/${orderId}`;
  }
}

const usersClient = new UsersClient();
const ordersClient = new OrdersClient();

console.log(usersClient.describeRequest('users', usersClient.userEndpoint('42')));
console.log(ordersClient.describeRequest('orders', ordersClient.orderEndpoint('100')));

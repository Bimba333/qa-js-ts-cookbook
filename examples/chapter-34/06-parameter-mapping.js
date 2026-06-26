function describeRequest(method, path, status) {
  return method + ' ' + path + ' -> ' + status + ' for ' + this.serviceName;
}

const serviceConfig = {
  serviceName: 'users-api'
};

const requestData = ['GET', '/users/1', 200];

console.log(describeRequest.apply(serviceConfig, requestData));

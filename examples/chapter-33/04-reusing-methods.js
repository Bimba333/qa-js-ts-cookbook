function buildUrl(path) {
  return this.baseUrl + path;
}

const usersApi = {
  baseUrl: 'https://users.example.test'
};

const ordersApi = {
  baseUrl: 'https://orders.example.test'
};

console.log(buildUrl.call(usersApi, '/list'));
console.log(buildUrl.call(ordersApi, '/list'));

const apiResponse = {
  status: 200,
  body: {
    id: 101,
    name: 'Anna',
    role: 'admin'
  }
};

const expectedUser = {
  id: 101,
  name: 'Anna',
  role: 'admin'
};

console.log(apiResponse.status);
console.log(apiResponse.body.name);
console.log(expectedUser.role);

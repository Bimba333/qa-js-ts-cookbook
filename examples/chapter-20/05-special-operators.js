const responseBody = {
  id: 101,
  status: 'active',
  temporaryCode: '1234',
};

console.log(typeof responseBody.status);
console.log('id' in responseBody);

delete responseBody.temporaryCode;
console.log('temporaryCode' in responseBody);

const createdAt = new Date();
console.log(createdAt instanceof Date);

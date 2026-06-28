function getOrderStatus(apiResponse) {
  return apiResponse.order.status;
}

const apiResponse = {
  order: {
    id: 'O-100',
    status: 'pending',
  },
};

const expectedStatus = 'paid';
const actualStatus = getOrderStatus(apiResponse);

console.log('expected:', expectedStatus);
console.log('actual:', actualStatus);
console.log('matches:', actualStatus === expectedStatus);

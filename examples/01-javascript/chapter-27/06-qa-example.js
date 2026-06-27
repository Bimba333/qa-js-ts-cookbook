const basePayload = {
  active: true,
  role: 'user'
};

const adminPayload = {
  ...basePayload,
  role: 'admin',
  email: 'anna@example.com'
};

function validateThreeStatuses(firstStatus, secondStatus, thirdStatus) {
  console.log(firstStatus, secondStatus, thirdStatus);
}

const statuses = [200, 201, 204];

console.log(adminPayload);
validateThreeStatuses(...statuses);

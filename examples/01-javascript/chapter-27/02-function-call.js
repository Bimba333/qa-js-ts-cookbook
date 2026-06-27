function validateThreeStatuses(firstStatus, secondStatus, thirdStatus) {
  console.log('First:', firstStatus);
  console.log('Second:', secondStatus);
  console.log('Third:', thirdStatus);
}

const statuses = [200, 201, 204];

validateThreeStatuses(...statuses);

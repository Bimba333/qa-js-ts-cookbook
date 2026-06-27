const validateCurrentStatus = () => {
  console.log('Current status is valid');
};

const validateStatus = statusCode => {
  console.log('Status:', statusCode);
};

const compareStatus = (actualStatus, expectedStatus) => {
  console.log(actualStatus === expectedStatus);
};

validateCurrentStatus();
validateStatus(200);
compareStatus(200, 200);

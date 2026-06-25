const statusCode = 200;
const responseBody = {
  id: 101,
};

if (statusCode === 200) {
  if ('id' in responseBody) {
    console.log('Valid user response');
  } else {
    console.log('Missing user id');
  }
} else {
  console.log('Status is not OK');
}

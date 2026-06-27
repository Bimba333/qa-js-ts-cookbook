const statusCode = 404;

if (statusCode === 200) {
  console.log('Success');
} else if (statusCode === 404) {
  console.log('Not found');
} else if (statusCode >= 500) {
  console.log('Server error');
} else {
  console.log('Unexpected status');
}

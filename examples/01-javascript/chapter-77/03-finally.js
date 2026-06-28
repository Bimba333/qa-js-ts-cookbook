function uploadReport() {
  return Promise.resolve('report uploaded');
}

uploadReport()
  .then(function printResult(result) {
    console.log(result);
  })
  .finally(function cleanup() {
    console.log('cleanup finished');
  });

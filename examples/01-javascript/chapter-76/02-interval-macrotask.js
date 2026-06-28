let uploadAttempt = 0;

const intervalId = setInterval(function retryUpload() {
  uploadAttempt += 1;
  console.log(`macrotask: upload attempt ${uploadAttempt}`);

  if (uploadAttempt === 2) {
    clearInterval(intervalId);
  }
}, 50);

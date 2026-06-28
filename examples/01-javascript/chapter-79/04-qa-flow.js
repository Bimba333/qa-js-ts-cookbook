function executeTest() {
  return Promise.resolve('test passed');
}

function uploadReport() {
  return Promise.reject('upload failed');
}

async function runFramework() {
  try {
    const result = await executeTest();
    console.log(result);
    await uploadReport();
  } catch (error) {
    console.log(`framework error: ${error}`);
  } finally {
    console.log('cleanup finished');
  }
}

runFramework();

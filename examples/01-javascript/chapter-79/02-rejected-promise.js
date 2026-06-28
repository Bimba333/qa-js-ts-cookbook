function captureScreenshot(pageName) {
  if (!pageName) {
    return Promise.reject('page name is required');
  }

  return Promise.resolve(`${pageName}: screenshot captured`);
}

captureScreenshot('').catch(function handleError(error) {
  console.log(`screenshot error: ${error}`);
});

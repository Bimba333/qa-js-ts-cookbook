function getBrowserName(config) {
  return config.environment.browser;
}

const config = {
  environment: {
    browser: 'chromium',
  },
};

console.log(getBrowserName(config));

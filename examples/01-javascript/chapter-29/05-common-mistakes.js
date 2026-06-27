'use strict';

const helper = {
  prefix: 'API',
  log: function (message) {
    console.log(this.prefix + ': ' + message);
  }
};

helper.log('Request failed');

const detachedLog = helper.log;

try {
  detachedLog('Request failed');
} catch (error) {
  console.log(error.name + ': call helper.log() to keep receiver');
}

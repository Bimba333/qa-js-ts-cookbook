'use strict';

const apiClient = {
  name: 'staging',
  getName: function () {
    return this.name;
  }
};

const getClientName = apiClient.getName;

try {
  console.log(getClientName());
} catch (error) {
  console.log(error.name + ': receiver is lost');
}

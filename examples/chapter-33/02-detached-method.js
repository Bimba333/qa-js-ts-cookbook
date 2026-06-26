'use strict';

const apiClient = {
  baseUrl: 'https://api.example.test',
  buildUrl: function (path) {
    return this.baseUrl + path;
  }
};

const buildUrl = apiClient.buildUrl;

console.log(buildUrl.call(apiClient, '/users'));

'use strict';

let config = null;

if (__DEV__) {
  console.log('using dev config file');
  config = require('../../config.dev.json');
}
else {
  console.log('using production config file');
  config = require('../../config.prod.json');
}

module.exports = config;

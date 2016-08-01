'use strict';

import Mixpanel from 'react-native-mixpanel';

import config from './config';



const init = () => {
  // initialize mixpanel with project token
  console.log('initializing mixpanel');
  Mixpanel.sharedInstanceWithToken('41130295cdda0093d7540ae45a7388f6');
};


// disable eslint quote-props because of Mixpanel usage of quoted properties
// like "$email"
/* eslint-disable quote-props */
const test = () => {
  console.log('testing mixpanel');

  // The "createAlias" function must be called ONCE per user (at signup)
  // to associate the Mixpanel distinct_id to a specific user
  // Mixpanel.createAlias('Developer')

  // The "identify" function must be called at every login to identify the
  // current user.
  Mixpanel.identify('Developer');

  // The "setOnce" method should be called at every signup to store the
  // user properties that will never change. If you call this multiple times
  // only new properties are added, but the existing ones do not change.
  Mixpanel.setOnce({
    "$email": "alessandro@develer.com",
    "Created": new Date().toISOString(),
  });

  // The "set" function updates user properties.
  Mixpanel.set({
    "Update": new Date().toISOString(),
  });

  // "track"-related methods are used to track events
  Mixpanel.trackWithProperties(
    'Test Track',
    { prop1: 'hello', prop2: 'world'},
    );
};
/* eslint-enable quote-props */


// build the exported api based on mixpanel config flag
let api = {
  init, test,
};

if (!config.mixpanel) {
  const emptyApi = {};

  for (const k of Object.keys(api)) {
    emptyApi[k] = (...args) => {
      args;
    };
  }

  api = emptyApi;
}


module.exports = api;

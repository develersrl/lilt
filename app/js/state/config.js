'use strict';

/*
  App configuration.
 */
module.exports = {
  mixpanel: {
    enabled: false,  // whether mixpanel service is enabled or not
    token: '41130295cdda0093d7540ae45a7388f6',
  },
  usersSpreadsheet: {
    enabled: true,  // whether the users backend is enabled or not
    url: 'https://script.google.com/macros/s/AKfycbx6BxoBZuWC9CkQvkfnythFSp2nIIi3TGezCLM0K058l_h_BQQ/exec',
  },
  removeStoredUser: false,  // set this to true to wipe local storage
  // if network actions fail we retry with the following interval in seconds
  dataSenderRetryInterval: 30,
};

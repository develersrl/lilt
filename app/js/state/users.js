'use strict';

import config from './config';
import { enableApi } from '../misc';


/* eslint-disable no-console */
const test = () => {
  console.log('testing user');

  const userData = {
    auth: {
      user: '__LILT_BreastApp__',
      password: 'J4XQh6UeZKjKmzTxz5ZVGXSe',
    },
    action: 'registerUser',
    data: {
      email: 'test@domain.com',
      name: 'Carla',
      surname: 'Fracci',
      gender: 'F',
      created: new Date().toISOString(),
    },
  };

  /* eslint-disable quote-props */
  fetch(config.usersSpreadsheet.url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  /* eslint-enable quote-props */
};
/* eslint-enable no-console */


const api = {
  test,
};

module.exports = enableApi(api, config.usersSpreadsheet.enabled);

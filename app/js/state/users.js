'use strict';

import config from './config';
import { enableApi } from '../misc';


const createRequestBody = (action, data) => ({
  auth: {
    user: '__LILT_BreastApp__',
    password: 'J4XQh6UeZKjKmzTxz5ZVGXSe',
  },
  action,
  data,
});


const sendRequest = (body) => {
  return fetch(config.usersSpreadsheet.url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',  // eslint-disable-line quote-props
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};


const register = (userData) => {
  const data = {
    ...userData,
    created: new Date().toISOString(),
    lastModified: new Date().toISOString(),
  };
  sendRequest(createRequestBody('setUserData', data))
    .then((response) => console.log(response))
    .catch((e) => console.log(e));
};


/* eslint-disable no-console */
const test = () => {
  console.log('testing user');

  const userData = {
    auth: {
      user: '__LILT_BreastApp__',
      password: 'J4XQh6UeZKjKmzTxz5ZVGXSe',
    },
    action: 'setUserData',
    data: {
      email: 'test@domain.com',
      name: 'Carla',
      surname: 'Fracci',
      gender: 'F',
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
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
  register,
};

module.exports = enableApi(api, config.usersSpreadsheet.enabled);

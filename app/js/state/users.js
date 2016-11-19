'use strict';

import config from './config';
import { enableApi } from '../misc';


const createRequestBody = (action, data) => ({
  auth: {
    user: config.usersSpreadsheet.username,
    password: config.usersSpreadsheet.password,
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
  return sendRequest(createRequestBody('setUserData', data))
    .then((response) => response.json())
    .then((json) => json.result.toLowerCase() === 'ok');
};


/* eslint-disable no-console */
const test = () => {
  console.log('testing user');

  const userData = {
    auth: {
      user: config.usersSpreadsheet.username,
      password: config.usersSpreadsheet.password,
    },
    action: 'setUserData',
    data: {
      email: 'test@domain.com',
      name: 'Mario',
      surname: 'Rossi',
      gender: 'M',
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

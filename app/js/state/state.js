'use strict';

/* ---------------- imports ------------------------------------------------- */
import { localKeyExists, saveLocal, loadLocal, removeLocal } from '../misc';
import { init as mixpanelInit, test as mixpanelTest } from './mixpanel';
import { test as usersTest, register } from './users';
import { removeStoredUser } from './config';
/* -------------------------------------------------------------------------- */


/* ---------------- state definition ---------------------------------------- */
const SendState = {
  UNKNOWN: 0,
  NOT_SENT: 1,
  SENDING: 2,
  SENT: 3,
};

const initialState = {
  initialized: false,
  user: {
    sentState: SendState.UNKNOWN,
    data: {
      email: '',
      name: '',
      surname: '',
      address: '',
      age: '',
      cap: '',
    },
  },
};

const state = { ...initialState };
/* -------------------------------------------------------------------------- */


/* ---------------- state api ----------------------------------------------- */
// initialize application state
const init = () => {
  if (!state.initialized) {
    Promise.resolve()
      .then(mixpanelInit)
      .then(userInit)
      .then(() => state.initialized = true);
  }
};


const test = () => {
  mixpanelTest();
  usersTest();
};


const userValidate = (userObj) => {
  if (userObj.email === '' ||
      userObj.name === '' ||
      userObj.surname === '' ||
      userObj.address === '' ||
      userObj.age === '' ||
      userObj.cap === '')
    return 'campi mancanti';
  return 'OK';
};


const userRegister = (userObj) => {
  state.user.data = userObj;
  saveLocal('liltUser', state.user)
    .then(() => register(userObj))
    .then(() => console.log('registered'));
};


const userInit = () => {
  const initState = initialState.user;
  return Promise.resolve()
    .then(() => removeStoredUser ? removeLocal('liltUser') : {})
    .then(() => localKeyExists('liltUser'))
    .then((b) => b ? loadLocal('liltUser') : saveLocal('liltUser', initState))
    .then((localUser) => state.user = localUser);
};


const api = {
  init,
  test,
  userValidate,
  userRegister,
};
/* -------------------------------------------------------------------------- */


module.exports = { state, api };

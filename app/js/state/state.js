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
      .then(() => {state.initialized = true; console.log(state)});
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
  Promise.resolve()
    .then(() => {
      state.user.data = userObj;
      state.user.sentState = SendState.SENDING;
      return saveLocal('liltUser', state.user);
    })
    .then(() => register(userObj))
    .then((ok) => {
      state.user.sentState = ok ? SendState.SENT : SendState.NOT_SENT;
      return Promise.all([ok, saveLocal('liltUser', state.user)]);
    })
    .then((values) => console.log(values[0] ? 'ok' : 'fail'));
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

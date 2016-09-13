'use strict';

/* ---------------- imports ------------------------------------------------- */
import { localKeyExists, saveLocal, loadLocal } from '../misc';
import { init as mixpanelInit, test as mixpanelTest } from './mixpanel';
import { test as usersTest, register } from './users';
import { ignoreStoredUser } from './config';
/* -------------------------------------------------------------------------- */


/* ---------------- state definition ---------------------------------------- */
const initialState = {
  initialized: false,
  user: {
    email: '',
    name: '',
    surname: '',
    address: '',
    age: '',
    cap: '',
  }
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
  state.user = userObj;
  saveLocal('liltUser', userObj)
    .then(() => register(userObj))
    .then(() => console.log('registered'));
};


const userInit = () => {
  const initState = initialState.user;
  return localKeyExists('liltUser')
    .then((b) => b ? loadLocal('liltUser') : saveLocal('liltUser', initState))
    .then((localUser) => state.user = ignoreStoredUser ? initState : localUser);
};


const api = {
  init,
  test,
  userValidate,
  userRegister,
};
/* -------------------------------------------------------------------------- */


module.exports = { state, api };

'use strict';

import { init as mpInit, test as mpTest } from './mixpanel';
import { test as usersTest, register } from './users';


/* ---------------- state definition ---------------------------------------- */
const initialState = {
  initialized: false,
  user: {
    loaded: false,
    email: 'ahahah@ah.com',
    name: 'Homer',
    surname: 'Simpson',
    address: 'Via Ciao 14',
    age: '18-25 anni',
    cap: '50121',
  }
};

const state = { ...initialState };
/* -------------------------------------------------------------------------- */


/* ---------------- state api ----------------------------------------------- */
// initialize application state
const init = () => {
  if (!state.initialized) {
    mpInit();  // initialize mixpanel
    state.initialized = true;
  }
};


const test = () => {
  mpTest();
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
  register(userObj);
};


const api = {
  init,
  test,
  userValidate,
  userRegister,
};
/* -------------------------------------------------------------------------- */


module.exports = { state, api };

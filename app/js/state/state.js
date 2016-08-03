'use strict';

import { init as mpInit, test as mpTest } from './mixpanel';
import { test as usersTest } from './users';


/* ---------------- state definition ---------------------------------------- */
const initialState = {
  initialized: false,
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


const api = {
  init,
  test,
};
/* -------------------------------------------------------------------------- */


module.exports = { state, api };

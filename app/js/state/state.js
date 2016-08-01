'use strict';

import { init as mpInit, test as mpTest } from './mixpanel';


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

    // initialize and test Mixpanel
    mpInit();
    mpTest();

    state.initialized = true;
  }
};


const api = {
  init,
};
/* -------------------------------------------------------------------------- */


module.exports = { state, api };

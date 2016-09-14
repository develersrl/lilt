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
  listener: null,
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

let state = { ...initialState };
/* -------------------------------------------------------------------------- */


/* ---------------- state api ----------------------------------------------- */
// initialize application state
const init = () => {
  if (!state.initialized) {
    Promise.resolve()
      .then(mixpanelInit)
      .then(userInit)
      .then(() => {
        _setState({...state, initialized: true });
        console.log(state);
      });
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


const saveRegistrationResult = (ok) => {
  const newSentState = ok ? SendState.SENT : SendState.NOT_SENT;
  _setState({ ...state, user: { ...state.user, sentState: newSentState }});
  return Promise.all([ok, saveLocal('liltUser', state.user)]);
};


const userRegister = (userObj) => {
  Promise.resolve()
    .then(() => {
      _setState({
        ...state,
        user: {
          ...state.user,
          sentState: SendState.SENDING,
          data: userObj,
        },
      });
      return register(userObj);
    })
    .then((ok) => saveRegistrationResult(ok))
    .then((values) => console.log(values[0] ? 'ok' : 'fail'))
    .catch(() => {
      // we catch offline status here
      saveRegistrationResult(false);
    });
};


const userInit = () => {
  const initState = initialState.user;
  return Promise.resolve()
    .then(() => removeStoredUser ? removeLocal('liltUser') : {})
    .then(() => localKeyExists('liltUser'))
    .then((b) => b ? loadLocal('liltUser') : saveLocal('liltUser', initState))
    .then((localUser) => _setState({ ...state, user: localUser }));
};

const setListener = (l) => state.listener = l;

const notifyListeners = () => {
  if (state.listener !== null)
    state.listener.onStateChange();
};

const _setState = (s) => {
  state = s;
  notifyListeners();
};


const api = {
  init,
  test,
  userValidate,
  userRegister,
  setListener,
  getState: () => state,
  isSendingUserData: () => state.user.sentState === SendState.SENDING,
};
/* -------------------------------------------------------------------------- */


module.exports = { api };

'use strict';

/* ---------------- imports ------------------------------------------------- */
import {
  localKeyExists,
  saveLocal,
  loadLocal,
  removeLocal,
  validateEmail,
} from '../misc';

import { init as mixpanelInit, test as mixpanelTest } from './mixpanel';
import { test as usersTest, register } from './users';
import { removeStoredUser, dataSenderRetryInterval } from './config';
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
        setInterval(_userDataSender, dataSenderRetryInterval * 1000);
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

  if (!validateEmail(userObj.email))
    return 'campo email non valido';

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
    .catch(() => saveRegistrationResult(false));  // catch offline status, too
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


const userExists = () => state.user.data.email !== '';
const userDataNotSent = () => state.user.sentState === SendState.NOT_SENT;
const isSendingUserData = () => state.user.sentState === SendState.SENDING;

const _userDataSender = () => {
  if (userExists() && userDataNotSent()) {
    console.log('retrying user registration');
    userRegister(state.user.data);
  }
};


const userData = (standard) => {
  if (standard)
    return state.user.data;
  else
    return null;  // should return questionnaire data
};


const api = {
  init,
  test,
  userValidate,
  userRegister,
  setListener,
  getState: () => state,
  isSendingUserData,
  userExists,
  userData,
};
/* -------------------------------------------------------------------------- */


module.exports = { api };

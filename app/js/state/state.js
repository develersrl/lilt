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
import { getAnswersInitialState } from './questions_data';
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
  listeners: [],
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
    savedAnswers: getAnswersInitialState(),
  },
  view: {
    selectedTab: 'path',
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
  return Promise.resolve()
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
    .then((localUser) => _setState({
      ...state,
      user: localUser,
      answers: { ...localUser.savedAnswers },
    }));
};


const userForget = () => {
  const initState = initialState.user;
  return Promise.resolve()
    .then(() => removeLocal('liltUser'))
    .then(() => saveLocal('liltUser', initState))
    .then((localUser) => _setState({
      ...state,
      user: localUser,
      answers: { ...localUser.savedAnswers },
    }));
};


const addListener = (l) => state.listeners.push(l);

const removeListener = (l) => {
  state.listeners = state.listeners.filter((e) => e !== l);
};

const notifyListeners = () => {
  for (let i = 0; i < state.listeners.length; ++i)
    state.listeners[i].onStateChange();
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
    // eslint-disable-next-line no-console
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


const getAnswer = (targetField) => state.answers[targetField];

const saveAnswer = (targetField, answerValue) => {
  state.answers[targetField] = answerValue;
};

const commitAnswers = () => {
  state.user.savedAnswers = { ...state.answers };
  return saveLocal('liltUser', state.user);
};


const selectedTab = () => state.view.selectedTab;

const setSelectedTab = (tabId) => {
  if (tabId !== state.view.selectedTab) {
    state.view.selectedTab = tabId;
    notifyListeners();
  }
};


const api = {
  init,
  test,
  userValidate,
  userRegister,
  userForget,
  addListener,
  removeListener,
  getState: () => state,
  isSendingUserData,
  userExists,
  userData,
  getAnswer,
  saveAnswer,
  commitAnswers,
  selectedTab,
  setSelectedTab,
};
/* -------------------------------------------------------------------------- */


module.exports = { api };

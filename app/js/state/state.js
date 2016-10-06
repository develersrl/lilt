'use strict';

/* ---------------- imports ------------------------------------------------- */
import {
  localKeyExists,
  saveLocal,
  loadLocal,
  removeLocal,
  validateEmail,
  eqSet,
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
      birthdate: '',
      cap: '',
      height: '',
      weight: '',
    },
    savedAnswers: getAnswersInitialState(),
  },
  view: {
    selectedTab: 'path',
  },
};

const mandatoryFields = {
  email: 'Email',
  name: 'Nome',
  surname: 'Cognome',
  address: 'Indirizzo',
  birthdate: 'Data di Nascita',
  cap: 'CAP',
};

const optionalFields = {
  height: 'Altezza',
  weight: 'Peso',
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
        console.log(state);  // eslint-disable-line no-console
      });
  }
};


const test = () => {
  mixpanelTest();
  usersTest();
};


const userValidate = (userObj) => {
  const fields = Object.keys(mandatoryFields);
  for (let i = 0; i < fields.length; ++i)
    if (userObj[fields[i]] === '')
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


const checkLoadedUser = (loadedUser) => {
  // This is the "official" array of user fields (e.g. name, surname ecc..)
  const userDataFields = new Set(Object.keys(initialState.user.data));

  // This is the array of user fields that have been loaded from async storage.
  // This array should contain the same set of user fields defined in user
  // initial state, but this could not be the case when LILT decides to change
  // the field set.. So we need to compare the two field set, and if we detect
  // a difference we "forget" the loaded user, in order to trigger a new
  // registration process for the missing fields.
  const loadedDataFields = new Set(Object.keys(loadedUser.data));

  // If field set is the same there is nothing to do
  if (eqSet(userDataFields, loadedDataFields))
    return loadedUser;

  // Otherwise we "forget" the current user
  // eslint-disable-next-line no-console
  console.warn('User field set changed. Erasing local user data.');
  return removeLocal('liltUser')
    .then(() => saveLocal('liltUser', initialState.user));
};


const userInit = () => {
  const initState = initialState.user;
  return Promise.resolve()
    .then(() => removeStoredUser ? removeLocal('liltUser') : {})
    .then(() => localKeyExists('liltUser'))
    .then((b) => b ? loadLocal('liltUser') : saveLocal('liltUser', initState))
    .then(checkLoadedUser)
    .then((loadedUser) => _setState({
      ...state,
      user: loadedUser,
      answers: { ...loadedUser.savedAnswers },
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


const getRenderableUserFields = () => {
  const fields = { ...mandatoryFields };

  for (const k in optionalFields) {
    if (state.user.data[k] !== '') {
      fields[k] = optionalFields[k];
    }
  }

  console.log(fields);

  return fields;
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
  getRenderableUserFields,
};
/* -------------------------------------------------------------------------- */


module.exports = { api };

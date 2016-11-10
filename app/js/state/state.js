'use strict';

import Mixpanel from 'react-native-mixpanel';


/* ---------------- imports ------------------------------------------------- */
import {
  localKeyExists,
  saveLocal,
  loadLocal,
  removeLocal,
  validateEmail,
  eqSet,
  AgeRange,
  BMIRange,
} from '../misc';

import { init as mixpanelInit, test as mixpanelTest } from './mixpanel';
import { test as usersTest, register } from './users';
import { removeStoredUser, dataSenderRetryInterval } from './config';

import {
  getAnswersInitialState,
  getAnswersTranslations,
  getQuestionData,
} from './questions_data';

import {
  getParagraphFromUserAnswer,
  getParagraphFromBMIRange,
} from './prevention_path_data';
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
    selectedTab: 'home',
  },
};

const initialTab = 'home';

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


const structuresData = require('../../content/structures.json');


const structuresTranslations = {
  callcenter: 'Call Center',
  breastunit: 'Centri Seno',
  ispo: 'ISPO',
  cerion: 'CeRiOn',
};


let state = { ...initialState };
/* -------------------------------------------------------------------------- */


/* ---------------- state api ----------------------------------------------- */
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


const answersRegister = () => userRegister(state.user.data, state.answers);


const userRegister = (userObj, answers) => {
  const _answers = answers ? answers : state.user.savedAnswers;
  const totalUserData = { ...userObj, ..._answers };

  return Promise.resolve()
    .then(() => {
      _setState({
        ...state,
        user: {
          ...state.user,
          sentState: SendState.SENDING,
          data: userObj,
          savedAnswers: _answers,
        },
      });
      return register(totalUserData);
    })
    .then((ok) => saveRegistrationResult(ok))
    .catch(() => saveRegistrationResult(false));  // catch offline status, too
};


const checkLoadedUser = (loadedUser) => {
  // This is the "official" array of user fields (e.g. name, surname ecc..)
  // The array includes mandatory and optional fields
  const userDataFields = new Set(Object.keys(initialState.user.data));

  // This is the "official" array of answers fields
  const answersFields = new Set(Object.keys(initialState.user.savedAnswers));

  // This is the array of user fields that have been loaded from async storage.
  // This array should contain the same set of user fields defined in user
  // initial state, but this could not be the case when LILT decides to change
  // the field set.. So we need to compare the two field set, and if we detect
  // a difference we "forget" the loaded user, in order to trigger a new
  // registration process for the missing fields.
  const loadedDataFields = new Set(Object.keys(loadedUser.data));

  // This is the array of question fields that have been loaded from async
  // storage. This set could be different from the initial state one for
  // the reasons explained above.
  const loadedAnswersFields = new Set(Object.keys(loadedUser.savedAnswers));

  const fieldSetOk = eqSet(userDataFields, loadedDataFields) &&
                      eqSet(answersFields, loadedAnswersFields);

  // If field set is the same there is nothing to do
  if (fieldSetOk)
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


/**
 * Tells which questionnaire answers can be rendered.
 * It returns an object where keys are answers keys and values are answers
 * keys translations.
 */
const getRenderableUserAnswers = () => {
  // If user did not complete the questionnaire then all answers are empty
  // so we check the first one for emptiness.
  // If there are no answers we return null (i.e. nothing is to be rendered)
  const allAnswers = Object.keys(state.user.savedAnswers);
  if (allAnswers.length === 0 || !state.user.savedAnswers[allAnswers[0]])
    return null;

  // If we reach this point then the questionnaire has been done and we can
  // render all the answers.
  return getAnswersTranslations();
};


const userData = (standard) => {
  if (standard)
    return state.user.data;
  else
    return state.user.savedAnswers;
};


const getAnswer = (targetField) => state.answers[targetField];


const getSavedAnswerValue = (questionIndex) => {
  const questionData = getQuestionData(questionIndex);
  return state.user.savedAnswers[questionData.targetField];
};


const getSavedAnswerText = (questionIndex) => {
  const questionData = getQuestionData(questionIndex);
  const savedAnswerValue = state.user.savedAnswers[questionData.targetField];

  if (savedAnswerValue === null)
    return '';

  for (let i = 0; i < questionData.answers.length; ++i) {
    const answer = questionData.answers[i];
    if (answer.value === savedAnswerValue) {
      return answer.text;
    }
  }

  return '';
};


const saveAnswer = (targetField, answerValue) => {
  state.answers[targetField] = answerValue;
};

const commitAnswers = () => {
  state.user.savedAnswers = { ...state.answers };
  return saveLocal('liltUser', state.user);
};

/**
 * Returns true if the user has completed the questionnaire.
 */
const isQuestionnaireDone = () => {
  // If there is no registered user the questionnaire cannot be completed
  if (!userExists())
    return false;

  // We assume that the questionnaire contains at least one question, and that
  // the questionnaire is completed when ALL questions have been answered.
  // With this assumption the answers can be in two possible states: either
  // all of them have been answered or none of them have been answered.
  // So if the first answer exists (i.e. it is not null) we can say that all
  // the questionnaire is completed.
  const firstQuestionData = getQuestionData(0);
  const targetField = firstQuestionData.targetField;
  return state.user.savedAnswers[targetField] !== null;
};


const selectedTab = () => state.view.selectedTab;

const setSelectedTab = (tabId) => {
  const tabToMixpanelEvent = {
    profile: 'Tab Profilo',
    structures: 'Tab Strutture',
    home: 'Tab Home',
    about: 'Tab About',
    sponsor: 'Tab Sponsor',
  };

  if (tabId !== state.view.selectedTab) {
    state.view.selectedTab = tabId;
    Mixpanel.track(tabToMixpanelEvent[tabId]);
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

  return fields;
};


const translateStructureType = (sType) => {
  if (structuresTranslations.hasOwnProperty(sType))
    return structuresTranslations[sType];
  return sType;
};


const untranslateStructureType = (sTypeTranslation) => {
  for (const sType of Object.keys(structuresTranslations))
    if (structuresTranslations[sType] === sTypeTranslation)
      return sType;
  return sTypeTranslation;
};


const getStructureTypes = () => {
  const sTypes = [];
  for (const k of Object.keys(structuresData))
    sTypes.push(translateStructureType(k));
  sTypes.sort();
  return sTypes;
};


const getStructuresForTranslatedType = (translatedType) => {
  const sType = untranslateStructureType(translatedType);
  return structuresData[sType];
};


/**
 * Compute age range from user birthdate.
 * It returns a misc.AgeRange enum value.
 */
const getUserAgeRange = () => {
  // This should not happen...
  if (!userExists())
    return AgeRange.LESS_THAN_45;

  const age = getUserAge();

  if (age < 45)
    return AgeRange.LESS_THAN_45;
  else if (age >= 45 && age < 50)
    return AgeRange.FROM_45_TO_49;
  else if (age >= 50 && age < 70)
    return AgeRange.FROM_50_TO_69;
  else if (age >= 70 && age < 75)
    return AgeRange.FROM_70_TO_74;
  else
    return AgeRange.MORE_THAN_74;
};


const getUserAge = () => {
  // User birthdate is a date with format dd-mm-yyyy
  const tokens = state.user.data.birthdate.split('-');
  const birthdate = new Date(tokens[2], tokens[1], tokens[0]);

  // Sometimes an user inserts a fake birthdate that is today or in the future.
  // We handle these cases manually
  const thisYear = new Date().getFullYear();
  if (birthdate.getFullYear() >= thisYear)
    return AgeRange.LESS_THAN_45;

  // https://stackoverflow.com/questions/4060004/calculate-age-in-javascript
  const elapsedMs = Date.now() - birthdate.getTime();
  const elapsedDate = new Date(elapsedMs);  // ms from epoch
  return Math.abs(elapsedDate.getUTCFullYear() - 1970);
};


const isBMIAvailable = () => {
  // BMI is not available if there is no registered user
  if (!userExists())
    return false;

  // BMI is not available if height or weight is not available
  const { height, weight } = state.user.data;
  return (height !== '' && weight !== '');
};

/*
 * Return the computed BMI (called also IMC) for the user.
 */
const getUserBMI = () => {
  const { height, weight } = state.user.data;
  return (weight * 10000 / (height * height));
};


const getUserBMIRange = () => {
  const bmi = getUserBMI();

  if (bmi < 18.5)
    return BMIRange.LESS_THAN_18_5;
  else if (bmi >= 18.5 && bmi < 25)
    return BMIRange.FROM_18_5_TO_24_9;
  else if (bmi >= 25 && bmi < 30)
    return BMIRange.FROM_25_TO_29_9;
  else
    return BMIRange.MORE_THAN_29_9;
};


const getUserBMILabel = (range) => {
  switch (range) {
  case 0:
    return 'Sottopeso';
  case 1:
    return 'Normopeso';
  case 2:
    return 'Sovrappeso';
  case 3:
    return 'Obeso';
  }
};


const getParagraphForBMIRange = (bmiRange) => {
  return getParagraphFromBMIRange(bmiRange);
};


const api = {
  init,
  test,
  userValidate,
  userRegister,
  getUserAge,
  getUserAgeRange,
  answersRegister,
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
  getSavedAnswerText,
  getSavedAnswerValue,
  isQuestionnaireDone,
  selectedTab,
  setSelectedTab,
  getRenderableUserFields,
  getRenderableUserAnswers,
  getStructureTypes,
  getStructuresForTranslatedType,
  getParagraphFromUserAnswer,
  isBMIAvailable,
  getUserBMI,
  getUserBMIRange,
  getUserBMILabel,
  getParagraphForBMIRange,
  initialTab,
};
/* -------------------------------------------------------------------------- */


module.exports = { api };

'use strict';

import { AsyncStorage, Linking, Navigator, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import FileOpener from 'react-native-file-opener';
import buildStyleInterpolator from 'buildStyleInterpolator';
import Share from 'react-native-share';
import RNFetchBlob from 'react-native-fetch-blob';

const AgeRange = {
  LESS_THAN_45: 0,
  FROM_45_TO_49: 1,
  FROM_50_TO_69: 2,
  FROM_70_TO_74: 3,
  MORE_THAN_74: 4,
};


const BMIRange = {
  LESS_THAN_18_5: 0,
  FROM_18_5_TO_24_9: 1,
  FROM_25_TO_29_9: 2,
  MORE_THAN_29_9: 3,
};


/*
  Enable or disable a given api.
  @param api Input api, represented as a javascript object of functions.
  @param enabled Enabled/disabled flag.
  @return The input api if enabled, an api of "empty" functions otherwise.

  Example of input api:

  inputApi = {
    foo1: (x) => x * x,
    foo2: () => console.log('hello'),
  }

  Example of disabled output api:

  outputApi = {
    foo1: (x) => {},
    foo2: () => {},
  }
 */
const enableApi = (api, enabled) => {
  if (enabled)
    return api;

  const disabledApi = {};

  for (const k of Object.keys(api)) {
    disabledApi[k] = (...args) => {
      args;
    };
  }

  return disabledApi;
};


/**
 * Open a pdf file by name.
 * The file is searched in the "pdf" dir of application bundle.
 * If the specified pdf is not found this method does not do anything,
 * otherwise the pdf is natively opened with its default application.
 */
const openPdf = (pdfName) => {
  // Nothing to do if pdf name is empty
  if (pdfName === '')
    return;

  const { fs, android, ios } = RNFetchBlob;
  if (Platform.OS === 'android') {
    fs.cp(
      fs.asset(`pdf/${pdfName}`), `${fs.dirs.DownloadDir}/${pdfName}`)
      .then(() => {
        fs.exists(`${fs.dirs.DownloadDir}/${pdfName}`)
          .then((exist) => {
            if (exist) {
              android.actionViewIntent(`${fs.dirs.DownloadDir}/${pdfName}`, 'application/pdf');
            }
          });
      })
      .catch(() => {
        // eslint-disable-next-line no-console
        console.warn('(ignore on simulator) cannot copy: ' + pdfName);
      });

    return;
  }

  // TODO: refactor to remove the dependency from react native fs
  RNFS.readDir(RNFS.MainBundlePath)
    .then((result) => {
      // search pdf dir in application bundle (the pdf directory name is
      // hardcoded to "pdf")
      let pdfdir = '';
      for (let i = 0; i < result.length; ++i) {
        if (result[i].name === 'pdf' && result[i].isDirectory()) {
          pdfdir = result[i].path;
          break;
        }
      }

      // do nothing if directory is not found
      if (pdfdir === '') {
        // eslint-disable-next-line no-console
        console.warn('cannot find pdf directory');
        return;
      }

      // search pdf file in pdf dir
      return RNFS.readDir(pdfdir);
    })
    .then((result) => {
      // result is undefined if pdf directory is not found in the bundle
      if (result === undefined)
        return;

      // search pdf in pdfdir
      let pdfobj = null;
      for (let i = 0; i < result.length; ++i) {
        if (result[i].name === pdfName) {
          pdfobj = result[i];
          break;
        }
      }

      // do nothing if pdf file is not found
      if (pdfobj === null) {
        // eslint-disable-next-line no-console
        console.warn('cannot find pdf: ' + pdfName);
        return;
      }

      // open pdf with its native application (it does not work in simulator)
      return ios.openDocument(pdfobj.path);
    })
    .catch(() => {
      /* eslint-disable no-console */
      console.warn('(ignore on simulator) cannot open: ' + pdfName);
      /* eslint-enable no-console */
    });
};


const saveLocal = (k, v) => {
  return new Promise((resolve, reject) => {
    AsyncStorage.setItem(k, JSON.stringify(v), (e) => {
      if (e)
        reject(e);
      else
        resolve(v);
    });
  });
};


const loadLocal = (k) => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(k, (e, res) => {
      if (e)
        reject(e);
      else
        resolve(JSON.parse(res));
    });
  });
};


const removeLocal = (k) => {
  return new Promise((resolve, reject) => {
    AsyncStorage.removeItem(k, (e) => {
      if (e)
        reject(e);
      else
        resolve(k);
    });
  });
};


const getStorageKeys = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getAllKeys((e, keys) => {
      if (e)
        reject(e);
      else
        resolve(keys);
    });
  });
};


const localKeyExists = (k) => {
  return getStorageKeys()
    .then((keys) => keys.includes(k));
};


const printStorageKeys = () => {
  return getStorageKeys()
    .then((k) => console.log(k));  // eslint-disable-line no-console
};


const printStorageValue = (k) => {
  return loadLocal(k)
    .then((v) => console.log(v));  // eslint-disable-line no-console
};


// https://stackoverflow.com/questions/36147276
const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};


const share = (text) => {
  // Nothing to do if there is nothing to share
  if (text === '')
    return;

  Share.open({
    message: text
  });
};


const openURL = (url) => {
  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        return Linking.openURL(url);
      }
      else {
        // eslint-disable-next-line no-console
        console.warn('Cannot open URL: ' + url);
      }
    })
    .catch((e) => console.warn(e));
};


const eqSet = (s1, s2) => {
  if (s1.size !== s2.size) return false;
  for (const a of s1) if (!s2.has(a)) return false;
  return true;
};


/**
 * Extract a phone number from the beginning of a string.
 * It returns an array of two elements, where the first is the phone number
 * and the second is the text after the number.
 * If there is no text after the number, the second array element is the
 * empty string.
 */
const extractPhoneNumber = (phoneString) => {
  const re = new RegExp('^([0-9 ]+[0-9])(.*)$');
  const tokens = phoneString.match(re);
  return [tokens[1].trim(), tokens[2] || ''];
};


// https://github.com/facebook/react-native/issues/1953#issuecomment-252522870
const NoTransition = {
  opacity: {
    value: 1.0,
    type: 'constant',
  },
};

const Transitions = {
  NONE: {
    ...Navigator.SceneConfigs.FadeAndroid,
    gestures: null,
    defaultTransitionVelocity: 1000,
    animationInterpolators: {
      into: buildStyleInterpolator(NoTransition),
      out: buildStyleInterpolator(NoTransition)
    },
  },
};


module.exports = {
  enableApi,
  openPdf,
  openURL,
  localKeyExists,
  saveLocal,
  loadLocal,
  removeLocal,
  getStorageKeys,
  printStorageKeys,
  printStorageValue,
  validateEmail,
  share,
  eqSet,
  extractPhoneNumber,
  AgeRange,
  BMIRange,
  Transitions,
};

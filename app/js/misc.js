'use strict';

import RNFS from 'react-native-fs';
import FileOpener from 'react-native-file-opener';


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
      return FileOpener.open(pdfobj.path, '');
    })
    .catch(() => {
      /* eslint-disable no-console */
      console.warn('(ignore on simulator) cannot open: ' + pdfName);
      /* eslint-enable no-console */
    });
};


module.exports = {
  enableApi,
  openPdf,
};

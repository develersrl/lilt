/**
 * Miscellaneous utilities.
 */

/* ---------------- Imports ------------------------------------------------- */
const remote = require('electron').remote;
const path = require('path');
/* -------------------------------------------------------------------------- */



/* ---------------- Variables ----------------------------------------------- */
// remote process variable (see main.js)
const shared = remote.getGlobal('sharedArgs');
const remoteProcess = shared.proc;
/* -------------------------------------------------------------------------- */



/* ---------------- Functions ----------------------------------------------- */
/**
 * We need to simulate ckeditor actions to load/save markdown properly.
 * These actions must be done one after another with some delay in order to
 * avoid editor errors.
 * This is a simple promise to wait for editor actions to be completed.
 */
// eslint-disable-next-line no-unused-vars
const wait = () => new Promise((resolve, reject) => {
  setTimeout(resolve, 300);
});


/**
 * Start window title
 */
const windowTitle = remote.getCurrentWindow().getTitle();


/**
 * Shortcut method to obtain the ckeditor instance
 */
const editor = () => CKEDITOR.instances.editor1;


/**
 * App environment detection (https://github.com/electron/electron/pull/5421)
 */
const isProdEnvironment = () => (remoteProcess.defaultApp === undefined);


/**
 * Platform detection
 */
const isMac = () => (remoteProcess.platform.startsWith('darwin'));


/**
 * Function to transform a relative src path to an absolute one
 */
const relativeToAbsolute = (currDir, rel) => {
  return path.resolve(path.join(currDir, path.basename(rel)));
};
/* -------------------------------------------------------------------------- */



/* ---------------- Exports ------------------------------------------------- */
module.exports = {
  wait,
  windowTitle,
  editor,
  isProdEnvironment,
  isMac,
  relativeToAbsolute,
};
/* -------------------------------------------------------------------------- */

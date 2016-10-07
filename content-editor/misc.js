/**
 * Miscellaneous utilities.
 */

/* ---------------- Imports ------------------------------------------------- */
const remote = require('electron').remote;
const path = require('path');
const uuid = require('node-uuid');
const fse = require('fs-extra');
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


const resetInput = (e) => {
  // Reset input content
  // https://stackoverflow.com/questions/1043957
  e.wrap('<form>').closest('form').get(0).reset();
  e.unwrap();
};


const copyFile = (sourceFile, targetDir, options = {mangle: true}) => {
  const sourceName = path.basename(sourceFile);
  const sourceExt = path.extname(sourceName);

  if (path.join(targetDir, sourceName) === sourceFile)
    return sourceFile;

  const targetName = (options.mangle) ? uuid.v4() + sourceExt : sourceName;
  const targetFile = path.join(path.resolve(targetDir), targetName);

  /* eslint-disable no-console */
  try {
    fse.copySync(sourceFile, targetFile);
    console.log(sourceFile + ' -> ' + targetFile);
  }
  catch (err) {
    console.error(err);
  }
  /* eslint-enable no-console */

  return targetFile;
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
  resetInput,
  copyFile,
};
/* -------------------------------------------------------------------------- */

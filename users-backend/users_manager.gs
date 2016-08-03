/* ------------------ Info -------------------------------------------------- */
/**
 * This Google Apps Script manages the users spreadsheet of LILT Breast App.
 * A simple webapp is exposed through this script.
 * The mobile app sends a POST request to the webapp to save relevant
 * informations (e.g. app users data). This script saves these informations
 * to a Google Spreadsheet, identified by id (see "Main Parameters" section).
 */


/**
 * Script version number.
 */
var version = '1.0';
/* -------------------------------------------------------------------------- */



/* ----------------- Main Parameters ---------------------------------------- */
/**
 * The users spreadsheet id.
 * The spreadsheet is part of spreadsheet url:
 * https://docs.google.com/spreadsheets/d/<spreadsheet_id>/edit#gid=0
 */
var spreadsheetId = '1nAjN9vGYAPilzWVlCfcxcUG_ux_bbJgHeSdrbATWQ4M';

/**
 * Name of users sheet inside the spreadsheet.
 */
var usersSheetName = 'Users';

/**
 * Mobile App user.
 */
var appUser = '__LILT_BreastApp__';

/**
 * Mobile App password.
 */
var appPassword = 'J4XQh6UeZKjKmzTxz5ZVGXSe';
/* -------------------------------------------------------------------------- */



/* ----------------- Global Vars -------------------------------------------- */
// instance of BetterLog object
var logger = null;

// spreadsheet instance
var doc = null;

// users sheet instance
var usersSheet = null;

// this map associates field names (e.g. 'email') to their column index inside
// the users spreadsheet
var fieldToCol = {};
/* -------------------------------------------------------------------------- */



/* ----------------- Support Functions -------------------------------------- */
/**
 * Utility function to log an object.
 */
function printObject(obj) {
  if (obj === undefined)
    return;

  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; ++i) {
     logger.log('' + keys[i] + ' -> ' + obj[keys[i]]);
  }
}


/**
 * Print values inside a range.
 */
function printValues(values) {
  for (var row = 0; row < values.length; ++row) {
    for (var col = 0; col < values[row].length; ++col) {
      logger.log('(' + row + ', ' + col + ') -> ' + values[row][col]);
    }
  }
}


/**
 * Return a test request object, to be used for script testing purposes.
 */
function getTestRequestObj() {
  return {
    action: 'registerUser',
    auth: {
      user: appUser,
      password: appPassword,
    },
    data: {
      email: 'prova@test.com',
      name: 'Mario',
      surname: 'Rossi',
      gender: 'M',
      created: new Date().toISOString(),
      age: 46,
      unknown: 2,  // invalid field test
    },
  };
}
/* -------------------------------------------------------------------------- */



/* ---------------- Requests Execution -------------------------------------- */
function initVars() {
  // check that main variables are set, otherwise log an error (using the
  // standard Logger class)
  if (spreadsheetId === '' || usersSheetName === '') {
    Logger.log('main global variables not initialized');
    return false;
  }

  // obtain Spreadsheet instance
  try {
    doc = SpreadsheetApp.openById(spreadsheetId);
  }
  catch (err) {
    Logger.log('cannot open the spreadsheet with the specified id');
    return false;
  }

  // initialize BetterLog logger
  try {
    logger = BetterLog.useSpreadsheet(spreadsheetId, 'Log');
  }
  catch (err) {
    Logger.log('cannot find BetterLog object (did you install the library?)');
    return false;
  }

  // this shouldn't happen
  if (doc === null || logger === null) {
    Logger.log('cannot initialize variables');
    return false;
  }

  // from this moment on we can use the logger object to log on the
  // users spreadsheet inside the 'Log' sheet

  // we require app user and password variables to be set
  if (appUser === '' || appPassword === '') {
    logger.log('app user and password variables not set');
    return false;
  }

  return true;
}


/**
 * Search for the users sheet inside the spreadsheet.
 */
function findUsersSheet() {
  var sheets = doc.getSheets();
  for (var i = 0; i < sheets.length; ++i) {
    if (sheets[i].getName() === usersSheetName) {
      usersSheet = sheets[i];
      return true;
    }
  }

  logger.log('cannot find sheet: ' + usersSheetName);
  return false;
}


/**
 * Initialize the fieldToCol map global variable.
 */
function initFieldMap() {
  // obtain the data in the first row, which is supposed to contain
  // the headers (i.e. 'email', 'name', etc..)
  var firstRow = usersSheet.getSheetValues(1, 1, 1, -1)[0];

  // fill the fieldToCol map case insensitive (col + 1 is needed because
  // column indexes are 1-based)
  emailCol = -1;
  for (var col = 0; col < firstRow.length; ++col) {
    var colName = firstRow[col].toLowerCase();
    fieldToCol[colName] = col + 1;

    if (colName === 'email')
      emailCol = col;
  }

  // email column is required in the sheet because it is the user primary key
  return (emailCol >= 0);
}


/**
 * Register a new user in the users spreadsheet.
 * If the user is already registered nothing happens.
 * Each user is identified by an email, which must be passed along
 * the other registration infos.
 * Column order is not important: the user may reorganize the columns in the
 * spreadsheet and the script will user infos in the appropriate columns.
 */
function registerUser(req) {
  // email is required to identify the user
  if (!req.hasOwnProperty('email')) {
    logger.log('cannot find email field, which is needed for user registration');
    return false;
  }

  // read all emails from the sheet
  var emailCol = fieldToCol.email;
  var emailValues = usersSheet.getSheetValues(2, emailCol, -1, 1);
  var emailKey = req.email.toLowerCase();

  // search the user email inside the sheet to see if this user is
  // already registered
  var userRow = -1;
  for (var row = 0; row < emailValues.length; ++row) {
    if (emailValues[row][0] === emailKey) {
      userRow = row;
      break;
    }
  }

  // do nothing if the user is already registered
  if (userRow >= 0) {
    logger.log('user ' + emailKey + ' is already registered - ignoring request');
    return true;
  }

  // obtain the index of last row that contains data
  var lastRow = usersSheet.getLastRow();

  // the number of columns to "write" is exactly the number of headers declared
  // in the first row of the sheet
  var columnsCount = Object.keys(fieldToCol).length;

  // initialize new values as empty strings
  var newValues = [];
  for (var col = 0; col < columnsCount; ++col)
    newValues.push('');

  // iterate over user fields sent by the mobile application
  var requestKeys = Object.keys(req);
  for (var i = 0; i < requestKeys.length; ++i) {
    var requestKey = requestKeys[i].toLowerCase();

    // if a sent field has no correspondence in the sheet we discard the info
    if (!fieldToCol.hasOwnProperty(requestKey)) {
      logger.log('ignoring sent field "' + requestKeys[i] + '" because ' +
                 'it is not a valid user field');
      continue;
    }

    // store the sent field in the newValues array
    var columnIndex = fieldToCol[requestKey];
    newValues[columnIndex - 1] = req[requestKeys[i]];
  }

  // add the new user to the sheet
  logger.log('registering new user: ' + req.email);
  var newRange = usersSheet.getRange(lastRow + 1, 1, 1, columnsCount);
  newRange.setValues([newValues]);

  return true;
}


/**
 * Every action that involves interaction with the users spreadsheet passes
 * from here.
 * A "req" is a Javascript object that describes the action itself.
 * The action object must have an "action" key that identifies the action
 * to be taken (e.g. "registerUser").
 * Each action is then executed by a specific routine.
 */
function executeRequestObject(req) {
  // each request must specify the action to be taken with the "action" key
  if (!req.hasOwnProperty('action') || !req.hasOwnProperty('data')) {
    logger.log('cannot find requested action or data object');
    return false;
  }

  // execute the specified action (if recognized)
  if (req.action === 'registerUser') {
    return registerUser(req.data);
  }

  logger.log('unknown action requested: ' + req.action);
  return false;
}


/**
 * Perform user request authentication.
 */
function authenticateUser(requestObj) {
  // "auth" sub-object must exist
  if (!requestObj.hasOwnProperty('auth')) {
    logger.log('cannot authenticate user from request object');
    return false;
  }

  // ..and must contain user and password fields
  if (!requestObj.auth.hasOwnProperty('user') ||
      !requestObj.auth.hasOwnProperty('password'))
  {
    logger.log('malformed authentication object');
    return false;
  }

  if (requestObj.auth.user !== appUser ||
      requestObj.auth.password !== appPassword)
  {
    logger.log('user authentication failed');
    return false;
  }

  return true;
}


/**
 * This is the entry point of html requests execution.
 */
function executeRequest(requestObj) {
  return initVars() &&
         authenticateUser(requestObj) &&
         findUsersSheet() &&
         initFieldMap() &&
         executeRequestObject(requestObj);
}
/* -------------------------------------------------------------------------- */



/* ------------------ WebApp GET/POST Hooks --------------------------------- */
/**
 * GET requests handler.
 * Used only for test purposes.
 */
function doGet() {
  // uncomment the following block to execute a test user registration
  /*
  // execute a test request and return html result
  var ok = executeRequest(getTestRequestObj());
  return HtmlService.createHtmlOutput(ok ? 'OK' : 'FAIL');
  */

  return HtmlService.createHtmlOutput('Hello');
}


/**
 * POST requests handler.
 *
 * @param req POST request object.
 *     Details about requests can be found here:
 *     https://developers.google.com/apps-script/guides/web
 */
function doPost(req) {
  // assume a JSON body and translate it into JS object
  var requestObj = {};
  var ok = true;

  try {
    requestObj = JSON.parse(req.postData.contents);
    ok = executeRequest(requestObj);
  }
  catch (err) {
    Logger.log('malformed JSON request');
    ok = false;
  }

  // execute request and send response back to the client
  var response = { result: (ok ? 'OK' : 'FAIL') };
  return ContentService.createTextOutput(JSON.stringify(response));
}
/* -------------------------------------------------------------------------- */

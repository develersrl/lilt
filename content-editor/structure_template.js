/**
 * Template module for structures pages.
 * See contents_template.js for methods documentation.
 */

const { windowTitle } = require('./misc');


const folderName = 'Strutture';


const init = (/* updateFormDataFn */) => {};


const formDataFromJson = (jsonObj) => ({
  title: jsonObj.title,
});


const formDataToJson = (formData) => ({
  title: formData.title,
});


const onShow = () => {
  $('#structure-before-editor').show();
  $('#structure-after-editor').show();
};


const onHide = () => {
  $('#structure-before-editor').hide();
  $('#structure-after-editor').hide();
};


const render = (formData) => {
  document.title = windowTitle + ' — ' + formData.title;
  $('#title').val(formData.title);
  $('#shared-text-div').hide();
  $('#header-image-div').hide();
  $('#pdf-file-div').hide();
};


const collectFormFiles = (/* formData, orgFormData, targetDir, copyFn */) => {
  // Nothing to copy for this template
};


module.exports = {
  init,
  folderName,
  formDataFromJson,
  formDataToJson,
  render,
  collectFormFiles,
  onShow,
  onHide,
};

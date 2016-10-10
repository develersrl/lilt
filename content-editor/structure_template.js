/**
 * Template module for structures pages.
 * See contents_template.js for methods documentation.
 */

const { windowTitle } = require('./misc');


const folderName = 'Strutture';
let updateFormData = null;


const init = (updateFormDataFn) => {
  updateFormData = updateFormDataFn;
  $('#structure-subtitle').on('input', onSubtitleInput);
};


const formDataFromJson = (jsonObj) => ({
  title: jsonObj.title,
  subtitle: jsonObj.subtitle,
});


const formDataToJson = (formData) => ({
  title: formData.title,
  subtitle: formData.subtitle,
});


const onShow = () => {
  $('#structure-before-editor').show();
  $('#structure-after-editor').show();
};


const onHide = () => {
  $('#structure-before-editor').hide();
  $('#structure-after-editor').hide();
};


const onSubtitleInput = () => {
  updateFormData({ subtitle: $('#structure-subtitle').val() });
};


const collectFormFiles = (/* formData, orgFormData, targetDir, copyFn */) => {
  // Nothing to copy for this template
};


const render = (formData) => {
  document.title = windowTitle + ' — ' + formData.title;
  $('#title').val(formData.title);
  $('#structure-subtitle').val(formData.subtitle);
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

/**
 * Template module for glossary word pages.
 * See contents_template.js for methods documentation.
 */

const { windowTitle } = require('./misc');


const folderName = 'Glossario';


const init = (/* updateFormDataFn */) => {};


const formDataFromJson = (jsonObj) => ({
  title: jsonObj.title,
});


const formDataToJson = (formData) => ({
  title: formData.title,
});


const onShow = () => {};
const onHide = () => {};


const render = (formData) => {
  document.title = windowTitle + ' — ' + formData.title;
  $('#title').val(formData.title);

  $('#shared-text').val(formData.sharedText);
  $('#shared-text-div').hide();

  $('#header-image-div').hide();
  $('#header-pic').attr('src', '');
  $('#header-image-container').addClass('hidden');

  $('#pdf-file-div').hide();
  $('#pdf-name').addClass('hidden');
};


const collectFormFiles = (/* formData, orgFormData, targetDir, copyFn */) => {
  // Nothing to copy for this template but reset some fields anyway
  $('#header-image').val('');
  $('#pdf-input').val('');
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

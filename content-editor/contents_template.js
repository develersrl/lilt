/**
 * Template module for contents pages.
 */

const path = require('path');
const fse = require('fs-extra');

const { windowTitle, resetInput, copyFile } = require('./misc');


let updateFormData = null;

/**
 * Directory name for these templates inside data folder
 */
const folderName = 'Contenuti';



/* ---------------- initialization ------------------------------------------ */
const init = (updateFormDataFn) => {
  updateFormData = updateFormDataFn;
  $('#header-image').on('change', onHeaderImageChanged);
  $('#shared-text').on('input', onSharedTextInput);
  $('#pdf-input').on('change', onPdfChanged);
};
/* -------------------------------------------------------------------------- */



/* ---------------- serialization / deserialization ------------------------- */
/**
 * Create a JS object from json data.
 * Such object will be attached to a node tree.
 */
const formDataFromJson = (jsonObj, pageDir) => {
  let headerImage = '';
  if (jsonObj.headerImage)
    headerImage = path.join(pageDir, jsonObj.headerImage);

  let pdfFile = '';
  if (jsonObj.pdfFile)
    pdfFile = path.join(pageDir, jsonObj.pdfFile);

  return {
    title: jsonObj.title,
    headerImage,
    pdfFile,
    sharedText: jsonObj.sharedText,
  };
};


/**
 * Create a JS object from the renderer info.
 * Such object will be saved to the template json descriptor.
 */
const formDataToJson = (formData) => ({
  title: formData.title,
  sharedText: formData.sharedText,
  pdfFile: formData.pdfFile ? path.basename(formData.pdfFile) : '',
  headerImage: formData.headerImage ? path.basename(formData.headerImage) : '',
});
/* -------------------------------------------------------------------------- */



/* ---------------- gui events management ----------------------------------- */
const onShow = () => {
  $('#shared-text-div').show();
  $('#header-image-div').show();
  $('#pdf-file-div').show();
  $('#editor1-label').html('Testo Pagina');
};


const onHide = () => {
  $('#shared-text-div').hide();
  $('#header-image-div').hide();
  $('#pdf-file-div').hide();
};


const onHeaderImageChanged = () => {
  const inputField = $('#header-image');
  const selectedImage = inputField[0].files[0].path;
  resetInput(inputField);
  updateFormData({ headerImage: selectedImage });
};


const onSharedTextInput = () => {
  updateFormData({ sharedText: $('#shared-text').val() });
};


const onPdfChanged = () => {
  const inputField = $('#pdf-input');
  const pdfPath = inputField[0].files[0].path;
  resetInput(inputField);
  updateFormData({ pdfFile: pdfPath });
};
/* -------------------------------------------------------------------------- */



/* ---------------- rendering ----------------------------------------------- */
/**
 * Render template data (the result of "formDataFromJson" function) to screen.
 */
const render = (formData) => {
  document.title = windowTitle + ' — ' + formData.title;
  $('#title').val(formData.title);

  $('#shared-text').val(formData.sharedText);

  if (formData.pdfFile) {
    $('#pdf-name').text(path.basename(formData.pdfFile));
    $('#pdf-name').removeClass('hidden');
  }
  else {
    $('#pdf-name').addClass('hidden');
  }

  if (formData.headerImage) {
    $('#header-pic').attr('src', formData.headerImage);
    $('#header-image-container').removeClass('hidden');
  }
  else {
    $('#header-pic').attr('src', '');
    $('#header-image-container').addClass('hidden');
  }
};
/* -------------------------------------------------------------------------- */



/* ---------------- other --------------------------------------------------- */
/**
 * Use this hook to copy form files inside template target directory.
 * Remember to use the passed copy function instead of your own function.
 */
const collectFormFiles = (formData, orgFormData, targetDir /* , copyFn */) => {
  if (orgFormData.headerImage &&
        orgFormData.headerImage !== formData.headerImage)
    fse.removeSync(orgFormData.headerImage);

  if (formData.headerImage)
    formData.headerImage = copyFile(formData.headerImage, targetDir);

  if (orgFormData.pdfFile && orgFormData.pdfFile !== formData.pdfFile)
    fse.removeSync(orgFormData.pdfFile);

  if (formData.pdfFile)
    formData.pdfFile = copyFile(formData.pdfFile, targetDir, {mangle: false});
};
/* -------------------------------------------------------------------------- */


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

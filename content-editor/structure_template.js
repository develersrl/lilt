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
  $('#structure-tel-1').on('input', onPhone1Input);
  $('#structure-tel-2').on('input', onPhone2Input);
  $('#structure-tel-3').on('input', onPhone3Input);
  $('#structure-openings').on('input', onOpeningsInput);
  $('#structure-mail').on('input', onMailInput);
  $('#structure-web').on('input', onWebInput);
  $('#structure-address').on('input', onAddressInput);
};


const formDataFromJson = (jsonObj) => ({
  title: jsonObj.title,
  subtitle: jsonObj.subtitle,
  phone1: jsonObj.phone1,
  phone2: jsonObj.phone2,
  phone3: jsonObj.phone3,
  openings: jsonObj.openings,
  mail: jsonObj.mail,
  web: jsonObj.web,
  address: jsonObj.address,
});


const formDataToJson = (formData) => ({
  title: formData.title,
  subtitle: formData.subtitle,
  phone1: formData.phone1,
  phone2: formData.phone2,
  phone3: formData.phone3,
  openings: formData.openings,
  mail: formData.mail,
  web: formData.web,
  address: formData.address,
});


const onShow = () => {
  $('#structure-subtitle-div').show();
  $('#structure-tel-div').show();
  $('#structure-after-editor').show();
  $('#structure-openings-div').show();
  $('#structure-mail-div').show();
  $('#structure-web-div').show();
  $('#structure-address-div').show();
};


const onHide = () => {
  $('#structure-subtitle-div').hide();
  $('#structure-tel-div').hide();
  $('#structure-after-editor').hide();
  $('#structure-openings-div').hide();
  $('#structure-mail-div').hide();
  $('#structure-web-div').hide();
  $('#structure-address-div').hide();
};


const onSubtitleInput = () => {
  updateFormData({ subtitle: $('#structure-subtitle').val() });
};


const onPhone1Input = () => {
  updateFormData({ phone1: $('#structure-tel-1').val() });
};


const onPhone2Input = () => {
  updateFormData({ phone2: $('#structure-tel-2').val() });
};


const onPhone3Input = () => {
  updateFormData({ phone3: $('#structure-tel-3').val() });
};


const onOpeningsInput = () => {
  updateFormData({ openings: $('#structure-openings').val() });
};


const onMailInput = () => {
  updateFormData({ mail: $('#structure-mail').val() });
};


const onWebInput = () => {
  updateFormData({ web: $('#structure-web').val() });
};


const onAddressInput = () => {
  updateFormData({ address: $('#structure-address').val() });
};


const collectFormFiles = (/* formData, orgFormData, targetDir, copyFn */) => {
  // Nothing to copy for this template
};


const render = (formData) => {
  document.title = windowTitle + ' — ' + formData.title;
  $('#title').val(formData.title);
  $('#structure-subtitle').val(formData.subtitle);
  $('#structure-tel-1').val(formData.phone1);
  $('#structure-tel-2').val(formData.phone2);
  $('#structure-tel-3').val(formData.phone3);
  $('#structure-openings').val(formData.openings);
  $('#structure-mail').val(formData.mail);
  $('#structure-web').val(formData.web);
  $('#structure-address').val(formData.address);
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

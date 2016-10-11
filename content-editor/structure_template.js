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
  $('#structure-web-1').on('input', onWeb1Input);
  $('#structure-web-2').on('input', onWeb2Input);
  $('#structure-address').on('input', onAddressInput);
  $('#structure-type').on('change', onStructureTypeChange);
};


const formDataFromJson = (jsonObj) => ({
  title: jsonObj.title,
  subtitle: jsonObj.subtitle,
  phone1: jsonObj.phone1,
  phone2: jsonObj.phone2,
  phone3: jsonObj.phone3,
  openings: jsonObj.openings,
  mail: jsonObj.mail,
  web1: jsonObj.web1,
  web2: jsonObj.web2,
  address: jsonObj.address,
  structuretype: jsonObj.structuretype,
});


const formDataToJson = (formData) => ({
  title: formData.title,
  subtitle: formData.subtitle,
  phone1: formData.phone1,
  phone2: formData.phone2,
  phone3: formData.phone3,
  openings: formData.openings,
  mail: formData.mail,
  web1: formData.web1,
  web2: formData.web2,
  address: formData.address,
  structuretype: formData.structuretype,
});


const onShow = () => {
  $('#structure-subtitle-div').show();
  $('#structure-tel-div').show();
  $('#structure-openings-div').show();
  $('#structure-mail-div').show();
  $('#structure-web-div').show();
  $('#structure-address-div').show();
  $('#structure-type-div').show();
  $('#editor1-label').html('Testo Libero');
};


const onHide = () => {
  $('#structure-subtitle-div').hide();
  $('#structure-tel-div').hide();
  $('#structure-openings-div').hide();
  $('#structure-mail-div').hide();
  $('#structure-web-div').hide();
  $('#structure-address-div').hide();
  $('#structure-type-div').hide();
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


const onWeb1Input = () => {
  updateFormData({ web1: $('#structure-web-1').val() });
};


const onWeb2Input = () => {
  updateFormData({ web2: $('#structure-web-2').val() });
};


const onAddressInput = () => {
  updateFormData({ address: $('#structure-address').val() });
};


const onStructureTypeChange = () => {
  updateFormData({ structuretype: $('#structure-type').val() });
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
  $('#structure-web-1').val(formData.web1);
  $('#structure-web-2').val(formData.web2);
  $('#structure-address').val(formData.address);
  $('#structure-type').val(formData.structuretype);
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

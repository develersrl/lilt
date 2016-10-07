const path = require('path');


// Load marked.js inside ckeditor plugin 'markdown'
CKEDITOR.scriptLoader.load(
  path.join('ckeditor', 'plugins', 'markdown', 'js', 'marked.js')
);

// Load to-markdown.js inside ckeditor plugin 'markdown'
CKEDITOR.scriptLoader.load(
  path.join('ckeditor', 'plugins', 'markdown', 'js', 'to-markdown.js')
);


// eslint-disable-next-line no-unused-vars
const ckInit = (onDocumentChanged) => {
  // this is a little hack: to prevent the editor to appear for an
  // instant during initialization phase we show the overlay
  $('#overlay-text').html("Scegli un documento oppure");
  $('#overlay').css('visibility', 'visible');

  // it must be initialized here :(
  CKEDITOR.replace('editor1', {  // eslint-disable-line no-undef
    toolbarGroups: [
      { name: 'clipboard', groups: ['clipboard', 'undo'] },
      { name: 'basicstyles'},
      { name: 'styles', groups: ['styles'] },
      { name: 'insert', groups: ['insert'] },
      { name: 'links', groups: ['links'] },
      // { name: 'others' },  // uncomment to show "Markdown" btn
    ],
    removeButtons: 'Underline,Subscript,Superscript,Strike,' +
        'Styles,Cut,Copy,Paste,PasteText,PasteFromWord,Table,' +
        'HorizontalRule,SpecialChar,Image,Anchor',
    extraPlugins: 'markdown,fs-image',
    format_tags: 'p;h1;h2;h3;pre',  // eslint-disable-line camelcase
    removeDialogTabs: 'image:advanced;link:advanced;link:target',
    width: '100%',
    removePlugins: 'elementspath',
    // allowedContent: 'h1 h2 h3 p strong em pre; img[!src]',
  })
  .on('change', onDocumentChanged);
};


module.exports = { ckInit };

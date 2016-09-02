CKEDITOR.plugins.add('fs-image', {
  icons: 'fs-image', // this is the button name
  init: function(editor) {
    editor.addCommand('insertImage', insertImageCommand);
    editor.ui.addButton('fs-image', insertImageButton);
  }
});

const insertImageCommand = {
  exec: function(editor) {
    const file = remote.dialog.showOpenDialog({
      buttonLabel: "Select image",
      filters: [{name: 'Images', extensions: ['jpg', 'png']}],
      properties: ['openFile']
    });
    if (file)
      editor.insertHtml('<img src="'+file[0]+'"></img>');
  }
};

const insertImageButton = {
  label: 'Insert an image',
  command: 'insertImage',
  toolbar: 'insert'
};

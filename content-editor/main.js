'use strict';

const { app, BrowserWindow, dialog } = require('electron');

// sharedArgs is a global object shared with browser windows
global.sharedArgs = {
  proc: process,
  selectDirectory,
};


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;


function selectDirectory(cb) {
  dialog.showOpenDialog(
    win,
    { properties: ['openDirectory'] },
    (result) => cb(result)
    );
}


function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'LILT App Content Editor v.' + app.getVersion(),
  });

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  if (process.env.LILT_EDITOR_SHOW_DEVTOOLS &&
        (process.env.LILT_EDITOR_SHOW_DEVTOOLS === 1 ||
         process.env.LILT_EDITOR_SHOW_DEVTOOLS === '1'))
    win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);


// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

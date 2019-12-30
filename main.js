const electron = require('electron')
const fs = require('fs');
const os = require('os');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const Tray = electron.Tray;
const ipc = electron.ipcMain;
const http = require('http');
const path = require('path');
const url = require('url');
const shell = electron.shell;
const { autoUpdater, dialog } = require('electron');



require('update-electron-app')()

let win
var winA
function createWindow () {
  // Crea la finestra del browser
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: __dirname + 'icon.ico',
    webPreferences: {
      nodeIntegration: true
    }
  })
  // e carica l'index.html dell'app.
  win.loadFile('SL.html');
  Menu.setApplicationMenu(null);
}





app.on('ready', () => {
  createWindow();
});

ipc.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});


// *Boom* Create PDF
ipc.on('print-to-pdf', event => {
  const pdfPath = path.join(os.tmpdir(), 'prova.pdf');
  var winA = BrowserWindow.fromWebContents(event.sender);

  winA.webContents.printToPDF({}, (error, data) => {
    
  
    if (error) return console.log(error.message);

    fs.writeFile(pdfPath, data, err => {
      if (err) return console.log(err.message);
      shell.openExternal('file://' + pdfPath);
      event.sender.send('wrote-pdf', pdfPath);
    })
    
  })
});

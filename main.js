const electron = require('electron')
const fs = require('fs');
const os = require('os');
const app = electron.app;
const dialog = require('electron');
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const Tray = electron.Tray;
const ipc = electron.ipcMain;
const http = require('http');
const path = require('path');
const url = require('url');
const shell = electron.shell;
const { autoUpdater } = require('electron-updater');
const DownloadManager = require("electron-download-manager");
 
DownloadManager.register({
    downloadFolder: app.getPath("downloads") + "\\my-app"
});

let win
var winA
let fesci = false;
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
  
  //crea menu
  var menu = Menu.buildFromTemplate([
    
        {
		label: 'File',
            submenu: [
            {label:'Nuovo', click(){win.webContents.send('pulisci')}, accelerator: 'CmdOrCtrl+N'},
			{type: 'separator'},
            {label:'Salva', click(){win.webContents.send('salva')}, accelerator: 'CmdOrCtrl+S'},
			{label:'Salva con nome', click(){win.webContents.send('salvacon')}, accelerator: 'CmdOrCtrl+Shift+S'},
			{label:'Apri', click(){win.webContents.send('apri')}, accelerator: 'CmdOrCtrl+O'},
			{type: 'separator'},
			{label:'Esporta PDF', click(){win.webContents.send('pdf')}, accelerator: 'CmdOrCtrl+P'},
			{type: 'separator'},
			{label:'Invia email', click(){win.webContents.send('mail')},accelerator: 'CmdOrCtrl+I'},
			{type: 'separator'},
            {label:'Esci', click(){win.webContents.send('esci')}, accelerator: 'CmdOrCtrl+Q'}
        ]
		},
		{
		label: 'Modifica',
            submenu: [
            {label:'Compila Dati', click(){win.webContents.send('compilad')}, accelerator: 'CmdOrCtrl+Shift+D'},
			{label:'Compila Commenti', click(){win.webContents.send('compilac')}, accelerator: 'CmdOrCtrl+Shift+R'},
			{label:'Compila Ore', click(){win.webContents.send('compilao')}, accelerator: 'CmdOrCtrl+Shift+O'},
        ]
		},
		{label: 'Impostazioni',submenu: [{label: 'Coefficiente km', accelerator: 'CmdOrCtrl+k', click(){win.webContents.send('km')}}]},
		{label: 'Archivio',submenu: [{label: 'Apri Archivio S.L.', accelerator: 'CmdOrCtrl+a', click(){win.webContents.send('arch')}}]},
		//{label: 'View',submenu: [{label: 'DevTools', accelerator: 'CmdOrCtrl+Shift+I', click: function(item, focusedWindow) {if (focusedWindow) focusedWindow.toggleDevTools();}}, {label: 'Reload', accelerator: 'CmdOrCtrl+R', click: function(item, focusedWindow) {if (focusedWindow) focusedWindow.reload()}},]},
  ])
  
  
  // e carica l'index.html dell'app.
  win.loadFile('SL.html');
  Menu.setApplicationMenu(menu);
  win.maximize();
  console.log(app.getPath("downloads") + "\\my-app");
  
  
  
	win.on('close', function(e){
		if(!fesci){
			e.preventDefault();
			e.sender.send('escisalva')
			fesci = true
		}
	})

}


app.on('ready', () => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

//TEST


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


autoUpdater.on('update-available', () => {
  win.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
  win.webContents.send('update_downloaded');
});


ipc.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});


ipc.on('get-file-data', function(event) {
  var data = null
  if (process.platform == 'win32' && process.argv.length >= 2) {
    var openFilePath = process.argv[1]
    data = openFilePath
  }
  event.returnValue = data
})







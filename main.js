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
const { autoUpdater } = require('electron-updater');
const DownloadManager = require("electron-download-manager");
 
DownloadManager.register({
    downloadFolder: app.getPath("downloads") + "\\my-app"
});

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
		}
	
  ])
  
  
  // e carica l'index.html dell'app.
  win.loadFile('SL.html');
  Menu.setApplicationMenu(menu);
  win.maximize();
  console.log(app.getPath("downloads") + "\\my-app");
}

var menu = Menu.buildFromTemplate([
    {
        label: 'Menu',
            submenu: [
            {label:'Nuovo', click(event){event.sender.send('pulisci')}},
			{type: 'separator'},
            {label:'Salva'},
			{label:'Salva con nome'},
			{label:'Apri'},
			{type: 'separator'},
			{label:'Invia email'},
			{type: 'separator'},
            {label:'Exit', click() {app.quit()}}
        ]
    }
  ])



app.on('ready', () => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

app.on('before-quit', () => {
  if(document.getElementById('agg').innerText !== ""){
	 function esegui(a){
		var child = require('child_process').execFile;
		var executablePath = a;
		child(executablePath, function(err, data) {
			if(err){
			   console.error(err);
			return;}
				console.log(data.toString());
			})
	}
  }
  app.quit()
})

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
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
  // e carica l'index.html dell'app.
  win.loadFile('SL.html');
  Menu.setApplicationMenu(null);
  win.maximize();
  console.log(app.getPath("downloads") + "\\my-app");
}





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
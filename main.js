const electron = require('electron');
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
const fe = require('node-fetch')

DownloadManager.register({
    downloadFolder: app.getPath("downloads") + "\\my-app"
});

let win
var winA
let fesci = false;

//crea menu
  const menu = Menu.buildFromTemplate([
    
        {
		label: 'File',
            submenu: [
				{
					label:'Nuovo', 
					icon: path.join(__dirname, "img/menu/nuovo.png"), 
					click(){win.webContents.send('pulisci')}, 
					accelerator: 'CmdOrCtrl+R'
				},
				{type: 'separator'},
				{
					label:'Salva', 
					icon: path.join(__dirname, "img/menu/save.png"),  
					click(){win.webContents.send('salva')}, 
					accelerator: 'CmdOrCtrl+S'
				},
				{
					label:'Salva con nome', 
					icon: path.join(__dirname, "img/menu/save.png"),   
					click(){win.webContents.send('salvacon')}, 
					accelerator: 'CmdOrCtrl+Shift+S'
				},
				{
					label:'Apri', 
					icon: path.join(__dirname, "img/menu/apri.png"),  
					click(){win.webContents.send('apri')}, 
					accelerator: 'CmdOrCtrl+O'
				},
				{type: 'separator'},
				{
					label:'Esporta PDF', 
					icon: path.join(__dirname, "img/menu/pdf.png"), 
					click(){win.webContents.send('pdf')}, 
					accelerator: 'CmdOrCtrl+P'
				},
				{type: 'separator'},
				{
					label:'Invia email', 
					icon: path.join(__dirname, "img/menu/mail.png"),  
					click(){win.webContents.send('mail')},
					accelerator: 'CmdOrCtrl+I'
				},
				{type: 'separator'},
				{
					label:'Stampa', 
					icon: path.join(__dirname, "img/menu/print.png"), 
					click(){win.webContents.send('print')},
					accelerator: 'CmdOrCtrl+Shift+P'
				},
				{type: 'separator'},
				{
					label:'Esci', 
					icon: path.join(__dirname, "img/menu/close.png"), 
					click(){win.webContents.send('esci')}, 
					accelerator: 'CmdOrCtrl+Q'
				}
			]
		},
		{
		label: 'Modifica',
            submenu: [
				{
					label:'Compila Dati', 
					icon: path.join(__dirname, "img/menu/dati.png"), 
					click(){win.webContents.send('compilad')}, 
					accelerator: 'CmdOrCtrl+Shift+D'
				},
				{
					label:'Compila Commenti', 
					icon: path.join(__dirname, "img/menu/dati.png"), 
					click(){win.webContents.send('compilac')}, 
					accelerator: 'CmdOrCtrl+Shift+R'
				},
				{
					label:'Compila Ore', 
					icon: path.join(__dirname, "img/menu/dati.png"), 
					click(){win.webContents.send('compilao')}, 
					accelerator: 'CmdOrCtrl+Shift+O'
				},
				{type: 'separator'},
				{
					label:'Admin Menu', 
					icon: path.join(__dirname, "img/menu/admin.png"), 
					enabled: false, 
					click(){win.webContents.send('su')}, 
					accelerator: 'CmdOrCtrl+Shift+U'
				},
			]
		},
		{label: 'Impostazioni', 
			submenu: [
				{
					label: 'Coefficiente km', 
					icon: path.join(__dirname, "img/menu/car.png"), 
					accelerator: 'CmdOrCtrl+k', 
					click(){win.webContents.send('km')}
				},
				{
					label: 'DevTools',
					icon: path.join(__dirname, "img/menu/dev.png"),					
					enabled: true, 
					accelerator: 'CmdOrCtrl+Shift+I', 
					click: function(item, focusedWindow) {if (focusedWindow) focusedWindow.toggleDevTools();},
				}
			]
		},
		{label: 'Archivio',
			submenu: [
				{
					label: 'Apri Archivio S.L.', 
					icon: path.join(__dirname, "img/menu/archivio.png"),	
					accelerator: 'CmdOrCtrl+a', 
					click(){win.webContents.send('arch')}
				},
				{
					label: 'Apri File Vecchi',
					icon: path.join(__dirname, "img/menu/apri.png"),
					accelerator: 'CmdOrCtrl+Shift+V',
					click(){win.webContents.send('vecchi')}
				}
			]
		},
  ])
  

async function createWindow () {
  // Crea la finestra del browser
  win = new BrowserWindow({
    width: 1200,
    height: 800,
	show: false,
    icon: __dirname + '\\icon.ico',
    webPreferences: {
      nodeIntegration: true
    }
  })


win.loadFile('SL.html')
Menu.setApplicationMenu(menu)
win.maximize();
  
	win.on('close', e=>{
		if(!fesci){
			e.preventDefault();
			e.sender.send('escisalva')
			ipc.on('si', ()=>{fesci = true})
		}
	})

}

function update(){
	const path = __dirname
	fe("http://raw.githubusercontent.com/marcoa5/episjob/master/JS/command.js")
	.then(a=>{
		a.text().then(b=>{
			fs.writeFileSync(path + '\\js\\command.js', b)
		})
	})
	fe("http://raw.githubusercontent.com/marcoa5/episjob/master/JS/mail.js")
	.then(a=>{
		a.text().then(b=>{
			fs.writeFileSync(path + '\\js\\mail.js', b)
		})
	})
	fe("http://raw.githubusercontent.com/marcoa5/episjob/master/JS/fire.js")
	.then(a=>{
		a.text().then(b=>{
			fs.writeFileSync(path + '\\js\\fire.js', b)
		})
	})
	fe("http://raw.githubusercontent.com/marcoa5/episjob/master/SL.html")
	.then(a=>{
		a.text().then(b=>{
			fs.writeFileSync(path + '\\SL.html', b)
		})
	})
}



app.on('ready', async () => {
	await update()
	createWindow()
	autoUpdater.checkForUpdatesAndNotify()	
});

ipc.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
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

ipc.on('attmenu', function(){
	menu.items[1].submenu.items[4].enabled=true;
	menu.items[2].submenu.items[1].enabled=true;
	menu.items[3].submenu.items[1].enabled=true;
})

async function getUser(){
	var userConf = require('path').join(require('os').homedir(), 'documents', 'ServiceJobConfig', 'user.conf')
	return fs.readFileSync(userConf, 'utf-8')
}




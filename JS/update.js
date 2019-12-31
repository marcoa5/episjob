	const { ipcRenderer } = require('electron');
    const version = document.getElementById('upd');
    ipcRenderer.send('app_version');
    ipcRenderer.on('app_version', (event, arg) => {
      ipcRenderer.removeAllListeners('app_version');
      version.innerText = 'V' + arg.version;
	});
	
	const notification = document.getElementById('notification');
	const message = document.getElementById('message');
	const restartButton = document.getElementById('restart-button');
	ipcRenderer.on('update_available', () => {
	ipcRenderer.removeAllListeners('update_available');
	message.innerText = 'È disponibile un aggiornamento. Scarica l''ultima versione...';
	notification.classList.remove('hidden');
	});


	function closeNotification() {
		const Indir = "https://github.com/marcoa5/episjob/releases"
		window.open(indir, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');;
	}

var utenti=[]
const url = 'https://episjobreq.herokuapp.com/'//'http://localhost:3000/' 
var showSU = false

async function createEconf(nomeF,subject, to1, son1, son2, son3,rap, rAss, userN, userC, userM){
    var dati = [{subject: subject, to1 : to1, son1: son1, son2:son2, son3:son3, rap:rap, rAss:rAss, userN:userN,userC:userC,userM:userM}];
	addMail(to1)
	require('fs').writeFileSync(nomeF,JSON.stringify(dati))
}

var path1 = require('path').join(require('os').homedir(),'Documents','ServiceJobConfig','emails.list')
var pathmol = require('path').join(require('os').homedir(),'Documents','ServiceJobConfig','mol.list')

async function addMail(to){
	var a = ''
	if(require('fs').existsSync(path1)){
		a = await require('fs').readFileSync(path1,'utf-8').replace(' ','').replace(' ','')
		var c = a.split(';')
		var h = to.replace(' ','').split(';')
		for(i in h){
			if(c.indexOf(h[i])==-1){a+=h[i] + ';'}
		}		
		require('fs').writeFileSync(path1,a.replace(' ',''))
	} else {
		a=to
		require('fs').writeFileSync(path1,a.replace(' ',''))
	}
	firebase.default.database().ref('mails/' + $('#user').text()).set(a.replace(' ',''))
	.catch(err=>
		console.log(err))
}

async function contaSchede(){
	var con = 0;
	var path = os.tmpdir() + '\\ServiceJobTemp';
	fs.readdir(path, (err, files)=>{
		files.forEach(file=>{
			if(pathfs.extname(file)=='.econf'){
				con+=1;
			}
		})
	})
	setTimeout(() => {
		$('#unsent').text(con)
	}, 500);
}

async function contEconf(){
	contaSchede();
	var path = os.tmpdir() + '\\ServiceJobTemp';
	fs.readdir(path, (err, files)=>{
		files.forEach(async file=>{
			if(pathfs.extname(file)=='.econf'){
				var nome = file.substring(0,file.length - 6)
				var nomeL = path + '\\' + nome
				var user = `${$('#userN').text()} ${$('#userC').text()}`
				var refpdf = firebase.default.storage().ref().child(user + '/' + nome + '.pdf')
				var refma = firebase.default.storage().ref().child(user +'/' + nome + '.ma')
				var urlPdf; var urlMa;
				if (user && refpdf && refma) {
					if(require('fs').existsSync(nomeL + '.pdf')){
						await uplFB(nomeL, '.pdf', refpdf)
						.catch(err=>console.error(err))
						.then(a=>{
							urlPdf=a
						})
					} else {
						await refpdf.getDownloadURL()
						.then(url=>urlPdf=url)
					}
					if(require('fs').existsSync(nomeL + '.ma')){
						await uplFB(nomeL, '.ma', refma)
						.catch(err=>console.error(err))
						.then(a=>{
							urlMa=a
						})
					} else {
						await refma.getDownloadURL()
						.then(url=>urlMa=url)
					}	
					var t
					var n = require('path').basename(nomeL)
					await $.get(os.tmpdir() + '\\ServiceJobTemp\\' + nome + '.econf', data=>{t=data})
					callEmail(urlPdf,urlMa,n,t)
					readHrs()
					await require('fs').renameSync(os.tmpdir() + '\\ServiceJobTemp\\' + nome + '.econf', os.tmpdir() + '\\ServiceJobTemp\\' + nome + '.econf_') 					
				}
			}
		})
	})   
}

async function uplFB(fName, ext, ref){
	var nome = require('path').basename(fName)
	return new Promise((res,rej)=>{
		fetch(fName + ext)
		.catch(err=>console.error(err))
		.then(a=>{
			a.blob().then(b=>{
				ref.put(b)
				.catch(err=>console.error(err))
				.then(()=>{
					ref.getDownloadURL()
					.catch(err=>console.error(err))
					.then(url=>{
						if(url) {
							require('fs').renameSync(fName + ext, os.tmpdir() + '\\ServiceJob\\' + nome + ext)
							res(url)
						} else {rej('Errore!')}
					})
				})
			})
		})
	})
}

//Invia Mail
function preparaMail(r) { 	
	var a = os.tmpdir() + '\\ServiceJobTemp'; 
	var son = $('#rissondaggio').text();
	if(son.substring(0,1)=="u"){
		son = ""
    }
    var rap = '';
    if($('#rappl1').text()!=''){
        rap +=  "\n\nRapporto di Lavoro:\n" + $('#rappl1').text();
    }
    if($('#oss1').text()!=''){
        rap +=  "\n\nOsservazioni:\n" + $('#oss1').text();
	}
	var elenco = $('.mail');
	var lista = "";
	for(var i=0;i<elenco.length;i++){lista += elenco[i].innerText +";"}
    var nomeL = r + ".econf"
    var subject = "Scheda Lavoro - " + $('#data11').text() + " - " + $('#cliente11').text() + " - " + $('#prodotto1').text() + " - " + $('#matricola').text()
    var to1 = lista
    var son1 = son.substring(0,1)
    var son2 = son.substring(1,2)
    var son3  =son.substring(2,3)
	var rAss = riskass()
	var userN = $('#userN').text()
	var userC= $('#userC').text()
	var userM = $('#userM').text()
	createEconf(nomeL,subject, to1, son1, son2, son3,rap, rAss, userN, userC,userM)
	.then(()=>{
		require('dns').lookup('google.com',(err)=> {
			if (err && err.code == "ENOTFOUND") {} else{
				contEconf(a)
			}
		})
	})
}

async function Notif(to1){
	var to = to1.replace("; ", " ")
	var i = 5;
	var len = $('div', $('#notContainer')).length+1;
	var wo = moment(new Date()).format("YYYYMMDDHHmmss") + Math.round(Math.random()*100)
	$('#notContainer').append('<div class="not" id="not' + wo +'">Email inviata a: ' + to +'<div class="pnot" id="p' + wo + '">' + i + '</div></div>')
	setInterval(() => {
		i-=1;
		if(i>0){
			$('#p'+wo).text(i);	
		} else {
			$('#not' + wo).hide(200)
		}	
	}, 1000);
}


async function callEmail(urlPdf, urlMa, n, dati){
	//console.log(urlPdf,urlMa,nome,dati)
	
	var urlp=url + 'mail/'
	const options = {
		type: 'question',
		buttons: ['No', 'Si'],
		title: 'Mail',
		message: `Utilizzare Debug Mode?`,
		noLink: true,
	};
	var t = JSON.parse(dati)[0]
	t['urlPdf'] = urlPdf
	t['urlMa'] = urlMa
	t['fileN'] = n
	if($('#userP').text()=='SU'){
		var w = dialog.showMessageBoxSync(remote.getCurrentWindow(), options)
		if (w==0){
			urlp = url + 'mail/'
		} else if(w==1){
			urlp = url + 'maildebug/'
		}
	}
	              
	var request = $.ajax({
		url: urlp,
		type: 'GET',
		data: jQuery.param(t) ,
		contentType: 'application/json; charset=utf-8',
		success: res=>{
			contaSchede()
			Notif(res)
		},
		fail: err=>{
			console.log(err)
		}
	})
}


function userClean(){
	$('#uNome').val('')
	$('#uCognome').val('')
	$('#uMail').val('')
	$('#uPos').val('')
	$('#userAddBut').prop('disabled',true)
}

function rigClean(){
	$('#rigSnr').val('')
	$('#rigMod').val('')
	$('#rigCus').val('')
	$('#rigSit').val('')
	$('#rigAddBut').prop('disabled',true)
}

function custClean(){
	$('#custC1').val('')
	$('#custC2').val('')
	$('#custC3').val('')
	$('#custAddBut').prop('disabled',true)
}

function userAdd(){
	var p = {Nome: $('#uNome').val(), Cognome:$('#uCognome').val(),Mail:$('#uMail').val(),Pos:$('#uPos').val(),km:0.07}
	$.ajax({
		url: url + 'createuser',
		type: 'GET',
		data: jQuery.param(p),
		success: res=>{
			userClean()
			getUsers()
		}
	})	
}

function rigMod(a){
	$('#rigSnr').val($('#r' + a + '1').text())
	$('#rigMod').val($('#r' + a + '2').text())
	$('#rigCus').val($('#r' + a + '3').text())
	$('#rigSit').val($('#r' + a + '4').text())
	$('#rigAddBut').prop('disabled',false)
}

function custMod(a){
	$('#custC1').val($('#c' + a + 1).text())
	$('#custC2').val($('#c' + a + 2).text())
	$('#custC3').val($('#c' + a + 3).text())
	$('#custAddBut').prop('disabled',false)
} 

function chComp(){
	var a = $('#uNome').val()
	var b = $('#uCognome').val()
	var c = $('#uMail').val()
	var d = $('#uPos').val()
	if(a=='' || b=='' || c=='' || d==''){
		$('#userAddBut').prop('disabled',true)
	} else {
		$('#userAddBut').prop('disabled',false)
	}
}

function chRigComp(){
	var a = $('#rigSnr').val()
	var b = $('#rigMod').val()
	var c = $('#rigCus').val()
	var d = $('#rigSit').val()
	if(a=='' || b=='' || c=='' || d==''){
		$('#rigAddBut').prop('disabled',true)
	} else {
		$('#rigAddBut').prop('disabled',false)
	}
}

function chCustComp(){
	var a = $('#custC1').val()
	var b = $('#custC2').val()
	var c = $('#custC3').val()
	if(a=='' || b=='' || c==''){
		$('#custAddBut').prop('disabled',true)
	} else {
		$('#custAddBut').prop('disabled',false)
	}
}

function userDel(a){
	utenti.find((item,i)=>{
		if(item.uid==a){
			const options = {
				type: 'question',
				buttons: ['No', 'Si'],
				title: 'Eliminazione',
				message: `Vuoi eliminare ${item.nome} ${item.cognome}?`,
				noLink: true,
			};
			var sc = dialog.showMessageBoxSync(remote.getCurrentWindow(), options);
			if(sc==1){
			$.get(url + 'delete', {id:a})
			.done(()=>{
				getUsers()
			})
			.fail((e)=>{
				console.log(e)
			})
			}
		}
	})
}

function rigDel(a){
	const options = {
		type: 'question',
		buttons: ['No', 'Si'],
		title: 'Eliminazione',
		message: `Vuoi eliminare ${$('#r' + a + '1').text()} - ${$('#r' + a + '2').text()}?`,
		noLink: true,
	};
	var sc = dialog.showMessageBoxSync(remote.getCurrentWindow(), options);
	if(sc==1){
		firebase.default.database().ref('MOL/' + $('#r' + a + '1').text()).remove()
		aggiornamol()
		getRigs()
	}
}

function rigAdd(){
	var a = $('#rigSnr').val()
	var b = $('#rigMod').val()
	var c = $('#rigCus').val()
	var d = $('#rigSit').val()
	firebase.default.database().ref('MOL/' + a).set({
		sn: a,
		model: b,
		customer: c,
		site:d
	})
	.then(()=>{
		aggiornamol()
		getRigs()
		rigClean()
	})
}

function sortSUTable(q, tabN) {
	var table, rows, switching, i, x1, x, y, shouldSwitch;
	table = document.getElementById(tabN);
	switching = true;
	while (switching) {
	  //start by saying: no switching is done:
	  switching = false;
	  rows = table.rows;
	  for (i = 0; i < (rows.length-1); i++) {
			//start by saying there should be no switching:
			shouldSwitch = false;
			if(rows[i].getElementsByTagName("TD")[q]){
				x = rows[i].getElementsByTagName("TD")[q].innerText;
				y = rows[i + 1].getElementsByTagName("TD")[q].innerText;
				//check if the two rows should switch place:
				if (x.toLowerCase() > y.toLowerCase()) {
				//if so, mark as a switch and break the loop:
				shouldSwitch = true;
				break;
				}
			}
	  	}
	  if (shouldSwitch) {
		rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
		switching = true;
	  } 
	}
}

async function showAdmin(){
	require('dns').lookup('google.com',async (err)=> {
        if (err && err.code == "ENOTFOUND") {
			const options = {
				type: 'error',
				buttons: ['Ok'],
				title: 'Errore',
				message: `Per accedere al menu devi essere connesso ad Internet`,
				noLink: true,
			};
			dialog.showMessageBoxSync(remote.getCurrentWindow(), options);
		} else {
			if(showSU){
				$('#salva').show()
				$('#contSU').css( "display", "none" )
				showSU=!showSU
			} else {
				$('#salva').hide()
				$('#contSU').css( "display", "flex" )
				$('#chBUSers').prop('checked',false)
				$('#chBRigs').prop('checked',true)
				$('#chBCust').prop('checked',true)
				$('#chBTech').prop('checked',true)
				$('#chBFiles').prop('checked',false)
				$('#usersCont').hide()
				$('#rigsCont').show()
				$('#custCont').show()
				$('#techCont').show()
				$('#filesCont').hide()
				await getCust()
				getUsers()
				getRigs()
				getTech()
				getFolders()
				showSU=!showSU
			}
		}
	})
}

function getUsers(){
	//$('#usersTab').html('')
	utenti=[]
	$.get(url + 'getusers', (data,err)=>{
		//if(err) console.log(err)
		data.forEach(a=>{
			var info = $.ajax({
				url: url + 'getuserinfo',
				type: 'GET',
				data: jQuery.param({id: a.uid}),
				success: res=>{
					utenti.push({uid: a.uid, mail: a.email, nome: res.Nome, cognome:res.Cognome, pos:res.Pos})
					if (utenti.length==data.length){
						$('#spinnerUsers').hide()
						$('#usersTab').html('<tr><th onclick="sortSUTable(0,\'usersTab\')">Nome</th><th onclick="sortSUTable(1,\'usersTab\')">Cognome</th><th onclick="sortSUTable(2,\'usersTab\')">Pos</th><th onclick="sortSUTable(3,\'usersTab\')">Mail</th><th>Elimina</th></tr>')
						//.click(sortSUTable(0,'usersTab'))
						utenti.forEach(ut=>{
							if(ut.pos!='SU'){
								$('#usersTab').append('<tr><td>'+ut.nome+'</td><td>'+ut.cognome+'</td><td>'+ut.pos+'</td><td>' + ut.mail + '</td><td style="text-align: center;"><button class="pulsante pulEl" onclick="userDel(\'' + ut.uid + '\')">E</button></td></tr>')
								sortSUTable(0,'usersTab')
							}
						})
					}
				}
			})
		})
	})
}

function getRigs(){
	$('#rigsTab').html('')
	firebase.default.database().ref('MOL/').on('value',s=>{
		$('#spinnerRigs').hide()
		$('#rigsTab').html('<tr><th>s/n</th><th>Modello</th><th>Cliente</th><th>Cantiere</th><th>M</th><th>E</th></tr>')
		var i = 1
		s.forEach(rigs=>{
			var r = rigs.val()
			$('#rigsTab').append('<tr><td id="r'+ i +'1">'+r.sn+'</td><td id="r'+ i +'2">'+r.model+'</td><td id="r'+ i +'3">'+r.customer+'</td><td id="r'+ i +'4">' + r.site + '</td><td class="tabB"><button class="pulsante pulEl" onclick="rigMod('+i+')">M</button></td><td class="tabB"><button class="pulsante pulEl" onclick="rigDel('+i+')">E</button></td></tr>')
			i++
		})
	})
}

function filterTab(e,a){
	var input, filter, table, tr, td, i, td1,td2,td3;
  input = e.target.value;
  filter = input.toUpperCase();
  table = document.getElementById(a);
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0]; // for column one
	if(tr[i].getElementsByTagName("td")[1]) td1 = tr[i].getElementsByTagName("td")[1];
	if(tr[i].getElementsByTagName("td")[2]) td2 = tr[i].getElementsByTagName("td")[2];
	if(tr[i].getElementsByTagName("td")[3]) td3 = tr[i].getElementsByTagName("td")[3]; 
    if (td) {
      if ( (td.innerHTML.toUpperCase().indexOf(filter) > -1) || (td1.innerHTML.toUpperCase().indexOf(filter) > -1) || (td2.innerHTML.toUpperCase().indexOf(filter) > -1) ||(td3.innerHTML.toUpperCase().indexOf(filter) > -1) )  {            
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function custDel(a){
	const options = {
		type: 'question',
		buttons: ['No', 'Si'],
		title: 'Eliminazione',
		message: `Vuoi eliminare ${$('#c' + a + '1').text()}?`,
		noLink: true,
	};
	var sc = dialog.showMessageBoxSync(remote.getCurrentWindow(), options);
	if(sc==1){
		firebase.default.database().ref('Customers/' + $('#c' + a + '1').text()).remove()
		aggiornacli()
		getCust()
	}
}

function getCust(){
	$('#custTab').html('')
	firebase.default.database().ref('Customers').on('value',s=>{
		$('#spinnerCust').hide()
		$('#custTab').append('<tr><th>Rag Soc</th><th>Ind1</th><th>Ind2</th><th>M</th><th>E</th></tr>')
		var i = 1
		$('#rigCus').append(new Option('','none'))
		s.forEach(a=>{
			$('#custTab').append('<tr><td id="c' + i + '1">' + a.val().c1 + '</td><td id="c' + i + '2">' + a.val().c2 + '</td><td id="c' + i + '3">' + a.val().c3 + '</td><td class="tabB"><button class="pulsante pulEl"  onclick="custMod(\'' + i + '\')">M</button></td><td class="tabB"><button class="pulsante pulEl" onclick="custDel(\''+i+'\')">E</button></td></tr>')	
			$('#rigCus').append(new Option(a.val().c1, a.val().c1));
			i++
		})
		
	})
}

function chTechComp(){
	var a = $('#inTechN').val()
	var b = $('#inTechS').val()
	if(a=='' || b ==''){
		$('#techAddBut').prop('disabled',true)
	} else {
		$('#techAddBut').prop('disabled',false)
	}
}

function techClean(){
	$('#inTechN').val('')
	$('#inTechS').val('')
	$('#techAddBut').prop('disabled',true)
}

function getTech(){
	$('#techTab').html('')
	var i=1
	firebase.default.database().ref('Tech').on('value',s=>{
		$('#techTab').append('<tr><th>Nome</th><th>Short</th><th>M</th><th>M</th></tr>')
		$('#spinnerTech').hide()
		s.forEach(a=>{
			$('#techTab').append('<tr><td id="t'+  i + '1">' + a.key + '</td><td id="t'+  i + '2">' + a.val().s + '</td><td class="tabB"><button class="pulsante pulEl"  onclick="techMod(\'' + i + '\')">M</button></td><td class="tabB"><button class="pulsante pulEl" onclick="techDel(\''+i+'\')">E</button></td></tr>')
			i++
		})
	})
}

function techMod(a){
	$('#inTechN').val($('#t' + a + '1').text())
	$('#inTechS').val($('#t' + a + '2').text())
	$('#techAddBut').prop('disabled',false)
}

function custAdd(){
	var a = $('#custC1').val()
	var b = $('#custC2').val()
	var c = $('#custC3').val()
	firebase.default.database().ref('Customers/' + a).set({
		c1: a,
		c2:b,
		c3:c
	})
	.then(()=>{
		aggiornacli()
		custClean()
		getCust()
	})
}

function techAdd(){
	var a = $('#inTechN').val()
	var b = $('#inTechS').val()
	firebase.default.database().ref('Tech/' + a).set({
		s: b
	})
	.then(()=>{
		aggiornatech()
		techClean()
		getTech()
	})
}

function techDel(a){
	const options = {
		type: 'question',
		buttons: ['No', 'Si'],
		title: 'Eliminazione',
		message: `Vuoi eliminare ${$('#t' + a + '1').text()}?`,
		noLink: true,
	};
	var sc = dialog.showMessageBoxSync(remote.getCurrentWindow(), options);
	if(sc==1){
		firebase.default.database().ref('Tech/' + $('#t' + a + '1').text()).remove()
		.then(()=>{
			aggiornatech()
			getTech()
		})
	}
}

function chShow(e,a){
	if(e.target.checked){
		$('#'+a).show()
	} else {
		$('#'+a).hide()
	}
}

function renderHtml(){
	let optionsOpen = {
		title : "Seleziona Scheda Lavoro", 
		defaultPath : require('path').join(require('os').homedir(),'Desktop'),
		buttonLabel : "Apri Scheda Lavoro", 
		filters :[
			{name: 'Schede Lavoro', extensions: ['ma']},
		   ],   
		properties: ['openFile']
	}
	
	var filename =  dialog.showOpenDialogSync(optionsOpen, "");
	if(filename!==undefined){
		$.get(filename, data=> {
			var fullFN = require('path').parse(filename.toString())
			var n = fullFN.name
			var g = JSON.parse(data)
			g.ris=''
			g.sondaggio=''
			var request = $.post(url + 'rendersj', g)
			.done(data=>{
				let optionsSave = {
					title : "Salva HTML", 
					defaultPath : require('path').join(require('os').homedir(),'Desktop', n + '.html'),
					buttonLabel : "Salva HTML", 
					filters :[
						{name: 'html', extensions: ['html']},
					   ],   
					properties: ['saveFile']
				}
				var htmlName = dialog.showSaveDialogSync(optionsSave, "")
				if(htmlName!=undefined){
					if(!pathtech) fs.createWriteStream(htmlName, { overwrite: false })
					require('fs').writeFile(htmlName, data, (err)=>{
						if(err) console.log (err)
						var wan = window.open(htmlName)
					})
				}
			})
		})
	}
}

function getFolders(){
	$('#fileList').hide()
	$('#folderList').show()
	$('#folderList').html('')
	$('#contFileFil').hide()
	var ref = firebase.default.storage().ref()
	ref.listAll()
	.then(a=>{
		a.prefixes.forEach(b=>{
			$('#spinnerFiles').hide()
			$('#folderList').append('<div class="folder" name="'+b.name+'" onclick="openFolder(\''+ b.name + '\', event)">'+
			'<img src="https://www.astille.fr/wp-content/plugins/ee-simple-file-list-pro/images/thumbnails/folder.svg" width="50" height="50">'+
			'<p class="folderName">'+b.name+'</p></div>')
		})
	})
}

function openFolder(Nom ,e){
	var nome = e.target.parentNode.children[1].innerText
	$('#folderList').hide()
	$('#fileList').show()
	$('#contFileFil').show()
	$('#fileList').html('')
	var ref = firebase.default.storage().ref(nome).listAll()
	.then(a=>{
		a.items.forEach(b=>{
			var nome = b.name
			if(nome.substring(nome.length-2,nome.length)=='df'){
				$('#fileList').append('<div class="file" id="'+b.name+'"name="'+b.name+'" onclick="openFile(\''+ Nom +'\',event)">'+
				'<img src="https://artigianatopadovano.org/wp-content/uploads/2019/02/pdf-icon.png" width="45" height="45">'+
				'<p class="fileName">'+b.name+'</p></div>')
			} else {
				$('#fileList').append('<div class="file" name="'+b.name+'" onclick="openFile(\''+ Nom +'\',event)">'+
				'<img src="./img/docicon.ico" width="45" height="45">'+
				'<p class="fileName">'+b.name+'</p></div>')
			}
			
		})
	})
}

function openFile(a,e){
	var fileN = e.target.parentNode.children[1].innerHTML
	firebase.default.storage().ref(a + '/' + fileN).getDownloadURL()
	.then(url=>{
		var est = require('path').extname(require('url').parse(url).pathname)
		var ext = est.substring(1,est.length)
		let optionsSave = {
			title : "Salva File", 
			defaultPath : require('path').join(require('os').homedir(),'Desktop', fileN),
			buttonLabel : "Salva File", 
			filters :[
				{name: ext, extensions: [ext]},
			   ],   
			properties: ['saveFile']
		}
		var fileName = dialog.showSaveDialogSync(optionsSave, "")
		if(fileName){
			var gh = require('fs').createWriteStream(fileName)
			require('https').get(url, (data)=>{
			data.pipe(gh)
			})
		}
	})
}

function searchFile(e){
	var bm = e.target.value.toLowerCase()
	$('#fileList')[0].childNodes.forEach(y=>{
		var g = y.innerText.toLowerCase()
		if(g.includes(bm)){
			$('div[name="' + y.innerText + '"]').show()
		} else {
			$('div[name="' + y.innerText + '"]').hide()
		}
	})
}

function renderPdf(){
	let optionsOpen = {
		title : "Seleziona Scheda Lavoro", 
		defaultPath : require('path').join(require('os').homedir(),'Desktop'),
		buttonLabel : "Apri Scheda Lavoro", 
		filters :[
			{name: 'Schede Lavoro', extensions: ['ma']},
		   ],   
		properties: ['openFile']
	}
	
	var filename =  dialog.showOpenDialogSync(optionsOpen, "");
	if(filename!==undefined){
		$.get(filename, data=> {
			var fullFN = require('path').parse(filename.toString())
			var n = fullFN.name
			var g = JSON.parse(data)
			g.ris=''
			g.sondaggio=''
			$.post(url + 'sjpdffile',g,(a,b,c)=>{
				console.log(c)
			})
		})
	}
}


async function salvaMaPdf(){
	await closeMenu()
	closeSU()
	var cartel1 = 'https://home.intranet.epiroc.com/sites/cc/iyc/MRService/Documents/'
	var maName=`\\\\home.intranet.epiroc.com@SSL\\DavWWWRoot\\sites\\cc\\iyc\\MRService\\Documents\\`
	$('#docbpcs').text($('#sudocbpcs').val())
	var fName = `${$('#sudocbpcs').val()} - `
	for (var i = 7;i>0;i--){
		if($('#dat' + i + '1').text()!==''){
			fName += `${$('#dat' + i + '3').text()}${$('#dat' + i + '2').text()}${$('#dat' + i + '1').text()} - ${$('#cliente11').text()} - ${$('#prodotto1').text()} - ${$('#matricola').text()}`
			break
		}
	}
	
	setTimeout(() => {
		/*let optionsSaveMa = {
			title : "Salva Files", 
			defaultPath : cartel1,
			buttonLabel : "Salva",  
			properties: ['openDirectory']
		}
		var maName = dialog.showOpenDialogSync(optionsSaveMa, "")
		if(maName!=undefined){*/
			if(require('fs').existsSync(`${maName}${fName}.ma`)){
				var sc = dialog.showMessageBoxSync(remote.getCurrentWindow(), optOW(maName,fName,'ma'))
				if(sc==0) require('fs').writeFileSync(`${maName}${fName}.ma`,creasalvataggio())
			} else {
				require('fs').writeFileSync(`${maName}${fName}.ma`,creasalvataggio())	
			}

			if(require('fs').existsSync(`${maName}${fName}.pdf`)){
				var sc = dialog.showMessageBoxSync(remote.getCurrentWindow(), optOW(maName,fName,'pdf'))
				if(sc==0) remote.getCurrentWindow().webContents.printToPDF({pageSize: 'A4', marginsType: '0'}).then(data => {fs.writeFileSync(`${maName}${fName}.pdf`, data)});
			} else {
				remote.getCurrentWindow().webContents.printToPDF({pageSize: 'A4', marginsType: '0'}).then(data => {fs.writeFileSync(`${maName}${fName}.pdf`, data)});
			}
		//}
	}, 100)
	
	setTimeout(() => {
		openMenu('menuSU')
		openSU()
	}, 150);
}

function attBottone(){
	if($('#sudocbpcs').val().length ==6){
		$('button[name="maPdf"]').prop('disabled', false)
	} else {
		$('button[name="maPdf"]').prop('disabled', true)
	}
}

function prova(){
	var c2=`\\\\home.intranet.epiroc.com@SSL\\DavWWWRoot\\sites\\cc\\iyc\\MRService\\Documents\\`
	console.log(c2)
}

function optOW(maName,fName,a){
	return {
		title : "Sovrascrivere",
		icon: 'question',
		message: `Il file ${maName}/${fName}.${a} esiste già, vuoi sovrascriverlo?`,
		buttons : ['Sì', 'No'],  
		noLink: true
	}
}

async function readHrs(){
	var engH = $('#orem1').text()
	var perc1H = $('#perc11').text()
	var perc2H = $('#perc21').text()
	var perc3H = $('#perc31').text()
	var matr = $('#matricola').text()
	var techNa = $('#user').text()
	var timeS = moment(new Date()).format('YYYYMMDDHHmmss')
	if(matr!=''){
		var data ={
			tech: techNa,
			time: timeS,
			engine: engH,
			perc1: perc1H,
			perc2: perc2H,
			perc3: perc3H
		}
		firebase.default.database().ref('hours/' + matr).set(data)
		.catch(err=>{if(err) console.log(err)})
	}
}
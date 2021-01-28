const { timeStamp } = require('console');
const { SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG } = require('constants');
const { get } = require('http');
const { allowedNodeEnvironmentFlags } = require('process');
var utenti=[]
const url = 'https://episjobreq.herokuapp.com/'

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
		files.forEach(file=>{
			if(pathfs.extname(file)=='.econf'){
				var nome = file.substring(0,file.length - 6)
				var nomeL = path + '\\' + nome
				var user = `${$('#userN').text()} ${$('#userC').text()}`
				var refpdf = firebase.storage().ref().child(user + '/' + nome + '.pdf')
				var refma = firebase.storage().ref().child(user +'/' + nome + '.ma')
				fetch(nomeL + '.pdf')
				.then((a)=>{
					a.blob().then(b=>{
						refpdf.put(b)
						.catch(err=>{
							console.error(err.message)
						})
						.then(()=>{
							fetch(nomeL + '.ma')
							.then(c=>{
								c.blob().then(d=>{
									refma.put(d)
									.then(async ()=>{
										var urlPdf = ''
										await refpdf.getDownloadURL().then((url)=> {urlPdf = url})
										var urlMa = ''
										await refma.getDownloadURL().then((url)=> {urlMa = url})
										await callEmail(urlPdf, urlMa, nomeL)
									})
									.catch((err)=>{
										console.error(err.message)
									})
								})
							})
						})
					})
				})
            }
        })
    })    
}


//Invia Mail
function preparaMail() { 	
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
		
	var datalo = moment(new Date()).format("YYYYMMDDHHmmss")
	var nomef = a + '\\' + datalo + " - " + $('#cliente11').text() + " - " + $('#prodotto1').text() + " - " + $('#matricola').text()
	
	fs.rename(a + '\\Scheda Lavoro.pdf', nomef + ".pdf", function(err) {if ( err ) console.log('ERROR: ' + err);});
	fs.rename(a + '\\Scheda Lavoro.ma', nomef + ".ma", function(err) {if ( err ) console.log('ERROR: ' + err);});
	var elenco = $('.mail');
	var lista = "";
	for(var i=0;i<elenco.length;i++){lista += elenco[i].innerText +";"}
    var nomeL = nomef + ".econf"
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
	.then(contEconf(a))
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


async function callEmail(urlPdf, urlMa, nome){
	var urlp=url + 'mail/'
	const options = {
		type: 'question',
		buttons: ['No', 'Si'],
		title: 'Mail',
		message: `Utilizzare Debug Mode?`,
		noLink: true,
	};
	var n = require('path').basename(nome)
	await $.get(nome + '.econf', dati=>{
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
				fs.unlinkSync(nome + '.econf')
				fs.renameSync(nome + '.pdf', os.tmpdir() + '\\ServiceJob\\' + n + '.pdf')
				fs.renameSync(nome + '.ma', os.tmpdir() + '\\ServiceJob\\' + n + '.ma')
				contaSchede()
				Notif(res)
			}
		})
	})
}

function test(){
	readConf()
}

function getUsers(){
	utenti=[]
	$('#listaUtenti').html('')
	$('#newUt').html('')
	$('#newUt').append('<div id="nUtente"></div>')
	$('#nUtente').append('<p class="userTesto">Nuovo Utente</p>')
	$('#nUtente').append('<div id="nuovoUtente"></div>')
	$('#nuovoUtente').append('<input id="uNome" type="text" placeholder="Nome" onkeyup="chComp()">')
	$('#nuovoUtente').append('<input id="uCognome" type="text" placeholder="Cognome" onkeyup="chComp()">')
	$('#nuovoUtente').append('<input id="uMail" type="text" placeholder="email" onkeyup="chComp()">')
	$('#nuovoUtente').append('<select id="uPos"  onkeyup="chComp()" onchange="chComp()"><option></option><option>tech</option><option>admin</option></select>')
	$('#nUtente').append('<div id="userButton"></div>')
	$('#userButton').append('<button class="pulsante" style="width: 40%;" onclick="userClean()">Pulisci</button>')
	$('#userButton').append('<button id="userAddBut" class="pulsante" style="width: 40%;" onclick="userAdd(event)">Aggiungi</button>')
	$('#userAddBut').prop('disabled',true)
	$('#nUtente').append('<p class="userTesto" style="margin: 20px 0 0 0;">Utenti Attivi</p>')
	$('#listaUtenti').append('<div id="ff"></div>')
	$('#ff').append('<br><table class="tabUtenti" id="tabUtenti"></table>')
	$('#tabUtenti').append('<th onclick="sortUserTable(0, \'tabUtenti\')">Nome</th><th onclick="sortUserTable(1, \'tabUtenti\')">Cognome</th><th onclick="sortUserTable(2, \'tabUtenti\')">Ruolo</th><th onclick="sortUserTable(3, \'tabUtenti\')" colspan=2>Mail</th><th>Elimina</th>')
	$.get(url + 'getusers', (data,err)=>{
		if(err) console.log(err)
		data.forEach(a=>{
			var info = $.ajax({
				url: url + 'getuserinfo',
				type: 'GET',
				data: jQuery.param({id: a.uid}),
				success: res=>{
					utenti.push({uid: a.uid, mail: a.email, nome: res.Nome, cognome:res.Cognome, pos:res.Pos})
					if (utenti.length==data.length){
						utenti.forEach(ut=>{
							if(ut.pos!='SU'){
								$('#tabUtenti').append('<tr><td>'+ut.nome+'</td><td>'+ut.cognome+'</td><td>'+ut.pos+'</td><td colspan=2>' + ut.mail + '</td><td style="text-align: center;"><button class="pulsante" onclick="userDel(\'' + ut.uid + '\')">E</button></td></tr>')
								sortUserTable(0, 'tabUtenti')
							}
						})
					}
				}
			})
		})
	})
}

function userClean(){
	$('#uNome').val('')
	$('#uCognome').val('')
	$('#uMail').val('')
	$('#uPos').val('')
	$('#userAddBut').text('Aggiungi')
	$('#userAddBut').prop('disabled',true)
}

function userAdd(e){
	var p = {Nome: $('#uNome').val(), Cognome:$('#uCognome').val(),Mail:$('#uMail').val(),Pos:$('#uPos').val(),km:0.05}
	$.ajax({
		url: url + 'createuser',
		type: 'GET',
		data: jQuery.param(p),
		success: res=>{
			getUsers()
		}
	})	
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

function sortUserTable(q, tabN) {
	var table, rows, switching, i, x1, x, y, shouldSwitch;
	table = document.getElementById(tabN);
	switching = true;
	/*Make a loop that will continue until
	no switching has been done:*/
	while (switching) {
	  //start by saying: no switching is done:
	  switching = false;
	  rows = table.rows;
	  /*Loop through all table rows (except the
	  first, which contains table headers):*/
	  for (i = 0; i < (rows.length-1); i++) {
		//start by saying there should be no switching:
		shouldSwitch = false;
		/*Get the two elements you want to compare,
		one from current row and one from the next:*/
		x = rows[i].getElementsByTagName("TD")[q].innerText;
		y = rows[i + 1].getElementsByTagName("TD")[q].innerText;
		//check if the two rows should switch place:
		if (x.toLowerCase() > y.toLowerCase()) {
		  //if so, mark as a switch and break the loop:
		  shouldSwitch = true;
		  break;
		}
	  }
	  if (shouldSwitch) {
		/*If a switch has been marked, make the switch
		and mark that a switch has been done:*/
		rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
		switching = true;
	  } 
	}
}

function showUsers(){
	openMenu('UserAdmin')
}

function showRigs(){
	openMenu('RigAdmin')
	
}

async function loadRigs(){
	var rigs = require('fs').readFileSync(pathmol, 'utf-8')
	$('#listaMacchine').html('')
	$('#listaMacchine').append('<table id="tabRig"></table>')
	//$('#tabRig').append('<tr><th>s/n</th><th>Modello</th><th>Cliente</th><th>Cantiere</th></tr>')
	$.each(JSON.parse(rigs), (i,v)=>{
		$('#tabRig').append('<tr><td style="width:20%">'+v.sn+'</td><td style="width:20%">'+v.model+'</td><td style="width:20%">'+v.customer+'</td><td style="width:20%">'+v.site+'</td>'
		+'<td style="width:10%"><button onclick="modRig(\''+v.sn+'\',\''+v.model+'\',\''+v.customer+'\',\''+v.site+'\')" class="pulsante">M</td style="width:10%"><td><button  onclick="delRig(\''+v.sn+'\')"  class="pulsante">E</td></tr>')	
	})
	sortUserTable(0,'tabRig')
}

function filterRigs(e){
	var filter = e.target.value.toUpperCase();
    var rows = document.querySelector("#tabRig").rows;
    
    for (var i = 0; i < rows.length; i++) {
        var c0 = rows[i].cells[0].textContent.toUpperCase();
		var c1 = rows[i].cells[1].textContent.toUpperCase();
		var c2 = rows[i].cells[2].textContent.toUpperCase();
		var c3 = rows[i].cells[3].textContent.toUpperCase();
        if (c0.indexOf(filter) > -1 || c1.indexOf(filter) > -1 || c2.indexOf(filter) > -1 || c3.indexOf(filter) > -1) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }      
    }
}

function chRig(){
	var a = $('#newSn').val()
	var b = $('#newMo').val()
	var c=$('#newCu').val()
	var d=$('#newSi').val()
	if(a=='' || b=='' || c=='' || d==''){
		$('#butPiu').prop('disabled', true)
	} else {
		$('#butPiu').prop('disabled', false)
	}
}

function addRig(){
	var a = $('#newSn').val()
	var b = $('#newMo').val()
	var c=$('#newCu').val()
	var d=$('#newSi').val()
	firebase.default.database().ref('MOL/' + a).set({
		customer: c,
		site: d,
		sn: a,
		model: b
	})
	.then((err,a)=>{
		$('#listaMacchine').html('')
		aggiornamol()
		setTimeout(() => {
			showRigs()
		}, 1500);
	})	
}

function delRig(e){
	const options = {
		type: 'question',
		buttons: ['No', 'Si'],
		title: 'Eliminare',
		message: `Vuoi eliminare ${e}?`,
		noLink: true,
	};
	var w = dialog.showMessageBoxSync(remote.getCurrentWindow(), options)
	if(w==1){
		firebase.default.database().ref('MOL/' + e).remove()
		.then(()=>{
			$('#listaMacchine').html('')
			aggiornamol()
			setTimeout(() => {
				showRigs()
			}, 1500);
		})
	}
}

function modRig(sn,model,customer,site){
	$('#newSn').val(sn)
	$('#newMo').val(model)
	$('#newCu').val(customer)
	$('#newSi').val(site)
}

function caricaCust(){
	firebase.default.database().ref('Customers').once('value',s=>{
		console.log(JSON.stringify(s.val()))
	})
}
const { timeStamp } = require('console');
const { SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG } = require('constants');
const { get } = require('http');
const { allowedNodeEnvironmentFlags } = require('process');
var utenti=[]
const url = 'https://episjobreq.herokuapp.com/'
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

function rigMod(a){
	$('#rigSnr').val($('#r' + a + '1').text())
	$('#rigMod').val($('#r' + a + '2').text())
	$('#rigCus').val($('#r' + a + '3').text())
	$('#rigSit').val($('#r' + a + '4').text())
	$('#rigAddBut').prop('disabled',false)
}

function custMod(a){
	console.log($('#c' + a + 1).text())
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
		getRigs()
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
	if(showSU){
		$('#salva').show()
		$('#contSU').css( "display", "none" )
		showSU=!showSU
	} else {
		$('#salva').hide()
		$('#contSU').css( "display", "flex" )
		await getCust()
		getUsers()
		getRigs()
		
		showSU=!showSU
	}
}

function getUsers(){
	//$('#usersTab').html('')
	utenti=[]
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
	var input, filter, table, tr, td, i;
  input = e.target.value;
  filter = input.toUpperCase();
  table = document.getElementById(a);
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    if(tr[i].getElementsByTagName("td")[0]) td = tr[i].getElementsByTagName("td")[0]; // for column one
	if(tr[i].getElementsByTagName("td")[1]) td1 = tr[i].getElementsByTagName("td")[1];
	if(tr[i].getElementsByTagName("td")[2]) td2 = tr[i].getElementsByTagName("td")[2];
	if(tr[i].getElementsByTagName("td")[3]) td3 = tr[i].getElementsByTagName("td")[3]; // for column two
/* ADD columns here that you want you to filter to be used on */
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
		getCust()
	}
}

function getCust(){
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

function io(){
	var s="ANDREA LAINI_A. LAINI-GIORGIO RIZZI_G. RIZZI-GABRIELE PICCIONI_G. PICCIONI-ROBERTO BOTRE_R. BOTRE-ENZO FELICI_E. FELICI-CLAUDIO MICHIELOTTO_C. MICHIELOTTO-WALTER BIAGIONI_W. BIAGIONI-RAFFAELE RECH_R. RECH-IVAN OVACIUC_I. OVACIUC-PIETRO CIANGOLI_P. CIANGOLI-SAID ELAKHRAS_S. ELAKHRAS-ALESSANDRO MOLLO_A. MOLLO-FABRIZIO VERNIA_F. VERNIA-GIANFRANCO MURA_G. MURA-FRANCESCO MURA_F. MURA-NATALINO CARUSO_N. CARUSO-ALESSANDRO ALESCIO_A. ALESCIO-VITO ERRICO_V. ERRICO-MAURIZIO BERARDI_M. BERARDI-MICHEL PASCAL_M. PASCAL"
	var t = s.split("-")
	t.forEach(e=>{
		firebase.default.database().ref('Tech/' + e.split("_")[0]).set({
			s: e.split("_")[1]
		})
	})
}
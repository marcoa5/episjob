var remote = require('electron').remote;
var fs = require('fs');
var mkdirp = require('mkdirp');
const tmp = require('tmp');
const prompt = require('electron-prompt');
const {shell} = require('electron');
const homedir = require('os').homedir();
var sprLib = require("sprestlib");
var moment = require("moment");
var campi = [];
var acc = "";
var murl = 'https://home.intranet.epiroc.com/sites/cc/iyc/MRService/';
require('winax');


function openMenu(n){
    $('#modifiche').text("1");;
    var f = document.getElementsByClassName("finestra")
    for(var c=0;c<f.length;c++){
        f[c].style.display = "none";
    }
    document.getElementById(n).style.display = "block";
    dimen();
    document.getElementsByClassName("foglio")[0].style.filter = "blur(8px)"
	var x=window.scrollX;
    var y=window.scrollY;
    window.onscroll=function(){window.scrollTo(x, y);}
    if(n == 'firmac1'){init("firmac")};
    if(n == 'firmat1'){init("firmat")};
    if(n=='menuRapporto'){$('#rappl').focus()};
    if(n=='menuOre'){oggi()};
	if(n=='menuSU'){openSU()};
	if(n=='menuMatricola'){Apri()};
	if(n=='menurisk'){Apri()};
    var iu = $('#stdspe').text();
    if(iu=='SPE'){document.getElementById('manspe').checked = true};
	$("#pagina *").attr("disabled", "disabled").off('click');
    $('#myinput').val($('#matricola').text());
    myFunction();
    $('#matricolas').val($('#matricola').text());
    $('#prodotto').val($('#prodotto1').text());
    $('#cliente').val($('#cliente11').text());
	$('#clientead1').val($('#cliente12').text());
	$('#clientead2').val($('#cliente13').text());
    $('#cantiere').val($('#cantiere1').text());
    $('#orem').val($('#orem1').text().replace(".",""));
    $('#perc1').val($('#perc11').text().replace(".",""));
    $('#perc2').val($('#perc21').text().replace(".",""));
    $('#perc3').val($('#perc31').text().replace(".",""));
    $('#rappl').val($('#rappl1').text());
    $('#oss').val($('#oss1').text());
	$('#ordine').val($('#vsordine').text());
	if($('#data11').text()!==""){
		var frdata = $('#data11').text().split("/");
		var gdata = frdata[2]+"-"+frdata[1]+"-"+frdata[0];
	}
}

window.onresize = dimen();
dimen();

function dimen(){
  var fff = $(".finestrai")
  for(var u=0;u<fff.length;u++){
      fff[u].style.maxHeight = window.innerHeight- 200 +"px";
  }
}

function closeMenu(){
	window.onscroll=function(){};
    var fin = $(".finestra")
    for(var i =0;i<fin.length;i++){
        fin[i].style.display="none"
    }
    $(".foglio")[0].style.filter = ""
}

var canvas, ctx = false

function init(h){
	if(h=='firmac'){
		$('#nomecognome').val($('#contnomec').text())
		caricasond();
	}
	canvas=document.getElementById(h);
	function resizeCanvas(){
		var ratio =  Math.max(window.devicePixelRatio || 1, 1);
		canvas.width = "700";
		canvas.height = "300";
	}
	//window.onresize = resizeCanvas;
	resizeCanvas();
	var signaturePad = new SignaturePad(canvas, {});
	var er, sa, fi = false
	if(h=="firmat"){
		er = "erase1";
		sa = "save1";
		fi = "firmatt1"
	} else if(h=="firmac"){
		er = "erase2";
		sa = "save2";
		fi="firmacc1";
	}
	document.getElementById(er).addEventListener('click', function () {
		signaturePad.clear();
		$('#' + sa).attr("disabled", true);
		$('#' + fi).attr('src', "./img/white.png");
		$('#contfirmac').text('');
		$('#contnomec').text('');
		$('#contsondc').text('');
		$('#nomecognome').val('');
		for(var i=0;i<5;i++){
			document.getElementsByName('int')[i].checked=false;
			document.getElementsByName('ric')[i].checked=false;
			document.getElementsByName('ese')[i].checked=false;
		}
		$('#rissondaggio').text('');
		
	});
	document.getElementById(sa).addEventListener('click', function () {
		var dataURL = canvas.toDataURL();
		sondaggio();
		if(h=="firmac"){
			document.getElementById("firmacc1").src = dataURL;
			closeMenu();
			controllafirme();
		} else if(h=="firmat"){
			document.getElementById("firmatt1").src = dataURL;
			closeMenu();
		} else {
		}
	});  
	canvas.getContext("2d").drawImage(document.getElementById(fi),0,0);
}

function salvadati(){
    $("#matricola").text($("#matricolas").val());
    $("#prodotto1").text($("#prodotto").val());
    $("#cliente11").text($("#cliente").val()) ;
	$("#cliente12").text($("#clientead1").val());
	$("#cliente13").text($("#clientead2").val());
    $("#cantiere1").text($("#cantiere").val());
    $("#orem1").text(mille($("#orem").val().toString()));
    $("#perc11").text(mille($("#perc1").val().toString()));
    $("#perc21").text(mille($("#perc2").val().toString()));
    $("#perc31").text(mille($("#perc3").val().toString()));
	var aggdata = convdata($('#data2').val());
	$("#data11").text(aggdata);
    if(document.getElementById("manstd").checked){$('#stdspe').text("STD"); $('#spostd').text("STD"); $('#spsstr').text("STR")}else{$('#stdspe').text("SPE");$('#spostd').text("SPO");$('#spsstr').text("SPS")}
    closeMenu();
	$("#vsordine").text($("#ordine").val());
}

function salvacomm(){
	$("#rappl1").text($("#rappl").val().toUpperCase());
	$("#oss1").text($("#oss").val().toUpperCase());
	closeMenu();
}

function copiaore(){
	//salvadati();
	var datiinput = document.getElementById('ris');
	var righe = datiinput.getElementsByTagName('tr');
	var datioutput = document.getElementById('tabset');
	var righeout = datioutput.getElementsByTagName('tr');
	for(var i=3;i<10;i++){
	  for(var j=0;j<22;j++){
		  righeout[i].getElementsByTagName('td')[j].innerText="";
	  }
	}
	var elenco=[];
	var riga=[];
	for(var i=0;i<righe.length;i++){
	datioutput.getElementsByTagName('tr')[i+3].getElementsByTagName('td')[0].innerText = righe[i].getElementsByTagName('td')[1].innerText;
	var dd = righe[i].getElementsByTagName('td')[2].innerText;
	datioutput.getElementsByTagName('tr')[i+3].getElementsByTagName('td')[1].innerText = dd.substring(6,8);
	datioutput.getElementsByTagName('tr')[i+3].getElementsByTagName('td')[2].innerText = dd.substring(4,6);
	datioutput.getElementsByTagName('tr')[i+3].getElementsByTagName('td')[3].innerText = dd.substring(0,4);
	var che = document.getElementById('stdspe').innerText;
	if(che=="STD"){
	for(var f=3; f<17;f++){
	  datioutput.getElementsByTagName('tr')[i+3].getElementsByTagName('td')[f+5].innerText = righe[i].getElementsByTagName('td')[f].innerText;
	}
	} else {
	for(var f=3; f<7;f++){
	  datioutput.getElementsByTagName('tr')[i+3].getElementsByTagName('td')[f+1].innerText = righe[i].getElementsByTagName('td')[f].innerText;
	}
		for(var f=7; f<17;f++){
	  datioutput.getElementsByTagName('tr')[i+3].getElementsByTagName('td')[f+5].innerText = righe[i].getElementsByTagName('td')[f].innerText;
	}
	}
	datioutput.getElementsByTagName('tr')[i+3].getElementsByTagName('td')[18].innerText = mille(righe[i].getElementsByTagName('td')[13].innerText);
	}
	closeMenu();
}

//permette di scrivere solo numeri nelle caselle 'ore'
function isNumber(evt) {
	evt = (evt) ? evt : window.event;
	var charCode = (evt.which) ? evt.which : evt.keyCode;
	if (charCode > 31 && (charCode < 48 || charCode > 57)) {
	  return false;
	}
	return true;
}

//verifica l'inserimento delle ore nella maschera
function controllaore(n, id){
	const options = {
		type: 'error',
		buttons: ['OK'],
		title: 'Errore',
		message: 'Non puoi superare le 8 ore',
	};
	const options2 = {
		type: 'error',
		buttons: ['OK'],
		title: 'Errore',
		message: 'Non puoi superare le 16 ore',
	};
	if(n=='spo'){
		var a = $('#spov1').val();
		var b= $('#spol1').val();
		if((a*1+b*1)<9){return} else {
		  dialog.showMessageBox(remote.getCurrentWindow(), options);
			if(id=='1'){
				document.getElementById('spov1').value = 8 - document.getElementById('spol1').value*1
			} else {
				document.getElementById('spol1').value = 8 - document.getElementById('spov1').value*1
			}
		}
	}
	if(n=='sps'){
		var a = document.getElementById('spsv1').value;
		var b= document.getElementById('spsl1').value;
		if((a*1+b*1)<9){return} else {
		  dialog.showMessageBox(remote.getCurrentWindow(), options);
			if(id=='1'){
				document.getElementById('spsv1').value = 8 - document.getElementById('spsl1').value*1
			} else {
				document.getElementById('spsl1').value = 8 - document.getElementById('spsv1').value*1
			}
		}
	}
	if(n=='mnt'){
		var a = document.getElementById('mntv1').value;
		var b= document.getElementById('mntl1').value;
		if((a*1+b*1)<9){return} else {
			dialog.showMessageBox(remote.getCurrentWindow(), options);
			if(id=='1'){
				document.getElementById('mntv1').value = 8 - document.getElementById('mntl1').value*1
			} else {
				document.getElementById('mntl1').value = 8 - document.getElementById('mntv1').value*1
			}
		}
	}
	if(n=='mf'){
		var a = document.getElementById('mfv1').value;
		var b= document.getElementById('mfl1').value;
		if((a*1+b*1)<17){return} else {
			dialog.showMessageBox(remote.getCurrentWindow(), options2);
			if(id=='1'){
				document.getElementById('mfv1').value = 16 - document.getElementById('mfl1').value*1
			} else {
				document.getElementById('mfl1').value = 16 - document.getElementById('mfv1').value*1
			}
		}
	}
	if(n=='mnf'){
		var a = document.getElementById('mnfv1').value;
		var b= document.getElementById('mnfl1').value;
		if((a*1+b*1)<9){return} else {
			dialog.showMessageBox(remote.getCurrentWindow(), options);
			if(id=='1'){
				document.getElementById('mnfv1').value = 8 - document.getElementById('mnfl1').value*1
			} else {
				document.getElementById('mnfl1').value = 8 - document.getElementById('mnfv1').value*1
			}
		}
	}
	if(n=='off'){
		var a = document.getElementById('off1').value;
		if((a*1)<9){return} else {
			dialog.showMessageBox(remote.getCurrentWindow(), options);
			document.getElementById('off1').value = 8 
		}
	}
	if(n=='ofs'){
		var a = document.getElementById('ofs1').value;
		if((a*1)<9){return} else {
			dialog.showMessageBox(remote.getCurrentWindow(), options);
			document.getElementById('ofs1').value = 8 
		}
	}
}

//disabilita l'inserimento in base al giorno dell'anno
function controlladata(){
	var fd = $('#data1').val();
	var param = verificadata(fd, moment(fd).format("DD"),moment(fd).format("MM"),moment(fd).format("YYYY"));
	if(param=="fest"){
		document.getElementById('spov1').disabled= true;
		document.getElementById('spol1').disabled= true;
		document.getElementById('spsv1').disabled= true;
		document.getElementById('spsl1').disabled= true;
		document.getElementById('mntv1').disabled= true;
		document.getElementById('mntl1').disabled= true;
		document.getElementById('mfv1').disabled= false;
		document.getElementById('mfl1').disabled= false;
		document.getElementById('mnfv1').disabled= false;
		document.getElementById('mnfl1').disabled= false;
		document.getElementById('off1').disabled= true;
		document.getElementById('ofs1').disabled= false;
	} else if (param=="fer"){
		document.getElementById('spov1').disabled= false;
		document.getElementById('spol1').disabled= false;
		document.getElementById('spsv1').disabled= false;
		document.getElementById('spsl1').disabled= false;
		document.getElementById('mntv1').disabled= false;
		document.getElementById('mntl1').disabled= false;
		document.getElementById('mfv1').disabled= true;
		document.getElementById('mfl1').disabled= true;
		document.getElementById('mnfv1').disabled= true;
		document.getElementById('mnfl1').disabled= true;
		document.getElementById('off1').disabled= false;
		document.getElementById('ofs1').disabled= false;
	} else if (param=="sab"){
		document.getElementById('spov1').disabled= true;
		document.getElementById('spol1').disabled= true;
		document.getElementById('spsv1').disabled= false;
		document.getElementById('spsl1').disabled= false;
		document.getElementById('mntv1').disabled= false;
		document.getElementById('mntl1').disabled= false;
		document.getElementById('mfv1').disabled= true;
		document.getElementById('mfl1').disabled= true;
		document.getElementById('mnfv1').disabled= true;
		document.getElementById('mnfl1').disabled= true;
		document.getElementById('off1').disabled= true;
		document.getElementById('ofs1').disabled= false;
	};
}

//Esporta PDF
function printpdf (a) {
	if(a=="a"){
		tmp.dir(function _tempDirCreated(err, path, cleanupCallback) {
			if (err) throw err;
			var gin = path.indexOf("tmp");
			path = path.substring(0, gin) + "ServiceJob";
			mkdirp(path, function(err) {});
			function ma(path, callback){
				fs.writeFileSync(path + "\\Scheda Lavoro.ma", creasalvataggio());
				remote.getCurrentWindow().webContents.printToPDF({pageSize: 'A4', marginsType: '0'}).then(data => {fs.writeFileSync(path + "\\Scheda Lavoro.pdf", data)});
				callback();
			}
			ma(path, function(){setTimeout(function(){send_mail(path)}, 3000)});
		})
	}else {
		remote.getCurrentWindow().webContents.printToPDF({pageSize: 'A4', marginsType: '0'}).then(data => {
			fs.writeFileSync(a, data, (err) => {
				if (err) throw err;
			})
			  shell.openItem(a);
		})}
	
}

//Invia Mail
function send_mail(a) { 	
	var son = $('#rissondaggio').text();
	if(son.substring(0,1)=="u"){
		son = ""
	}
	var ora = new Date()
	var anno = ora.getFullYear().toString();
	var mese = (ora.getMonth()+1).toString();
	var giorno = ora.getDate().toString();
	var hr = ora.getHours().toString();
	var mi = ora.getMinutes().toString();
	var se = ora.getSeconds().toString();
	var datalo = anno.padStart(4,'0')+mese.padStart(2,'0')+giorno.padStart(2,'0')+hr.padStart(2,'0')+mi.padStart(2,'0')+se.padStart(2,'0'); 
	var nomef = a + '\\' + datalo + " - " + $('#cliente11').text() + " - " + $('#prodotto1').text() + " - " + $('#matricola').text()
	fs.rename(a + '\\Scheda Lavoro.pdf', nomef + ".pdf", function(err) {if ( err ) console.log('ERROR: ' + err);});
	fs.rename(a + '\\Scheda Lavoro.ma', nomef + ".ma", function(err) {if ( err ) console.log('ERROR: ' + err);});
	var objO = new ActiveXObject('Outlook.Application');     
	var objNS = objO.GetNameSpace('MAPI');     
	var mItm = objO.CreateItem(0);     
	mItm.Display();   
	//aggiunge gli indirizzi mail
	var elenco = document.getElementsByClassName('mail');
	var lista = "";
	for(var i=0;i<elenco.length;i++){lista += elenco[i].innerText +"; "}
	mItm.To = lista;
	mItm.Subject = "Scheda Lavoro - " + $('#data11').text() + " - " + $('#cliente11').text() + " - " + $('#prodotto1').text() + " - " + $('#matricola').text();
	mItm.Body = "In allegato scheda lavoro relativa all'intervento da noi effettuato.\nVi ringraziamo qualora abbiate aderito al nostro sondaggio."  + "\n\n\nRisultato sondaggio:\n\nOrganizzazione intervento: " + son.substring(0,1) + "\nConsegna Ricambi: " + son.substring(1,2) + "\nEsecuzione Intervento: " + son.substring(2,3);
	mItm.Attachments.Add(nomef + ".pdf");    
	mItm.GetInspector.WindowState = 2;
	mItm.send();
	var objO = new ActiveXObject('Outlook.Application');     
	var objNS = objO.GetNameSpace('MAPI');     
	var mItm = objO.CreateItem(0);     
	mItm.Display();    
	mItm.To = 'marco.fumagalli@epiroc.com; carlo.colombo@epiroc.com; mario.parravicini@epiroc.com';
	mItm.Subject = "Scheda Lavoro - " + $('#data11').text() + " - " + $('#cliente11').text() + " - " + $('#prodotto1').text() + " - " + $('#matricola').text();
	mItm.Body = "Risultato sondaggio:\n\nOrganizzazione intervento: " + son.substring(0,1) + "\nConsegna Ricambi: " + son.substring(1,2) + "\nEsecuzione Intervento: " + son.substring(2,3) + '\n\n\nRisk Assessment \n' + riskass();
	mItm.Attachments.Add(nomef + ".ma");    
	mItm.GetInspector.WindowState = 2;
	mItm.send();
}

//Filtra elenco macchine
function myFunction() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("myinput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("listam");
    li = ul.getElementsByTagName("tr");
    for (i = 0; i < li.length; i++) {
		a = li[i].getElementsByTagName("td")[0];
		txtValue = a.textContent || a.innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
			li[i].style.display = "";
		} else {
			li[i].style.display = "none";
		};
    }
}

//carica elenco clienti e macchine
function Apri(){
	if($('#data11').text()!==""){
		$('#data2').val(convdata($('#data11').text()));
	} else {
		$('#data2').val(convdata(today()));
	}

	$('#listac tr').remove();
    var i = 1
    $.get('.\\customers.txt', function(data) {
		var linee = data.split("\n");
		$.each(linee, function(n, elem) {
			var record = elem.split("_");
			var il = 'ele' + i;
			if(record[0]!==""){
				var stringa= '<tr id=' + il + ' onclick="copia(' + "'" + il + "'" + ')">';
				stringa += '<td>' + record[0] + '</td>';
				stringa += '<td>' + record[1] + '</td>';
				stringa += '<td>' + record[2] + '</td>';
				stringa += '</tr>';
				$('#listac').append(stringa);
				i++;
			}
		});
    });
	$('#listam tr').remove();
	var i = 1
	$.get('.\\mol.txt', function(data) {
		var linee = data.split("\n");
		$.each(linee, function(n, elem) {
			var record = elem.split("_")
			var il = 'ele' + i
			if(record[0]!==""){
				var stringa= '<tr id=' + il + ' onclick="copia(' + "'" + il + "'" + ')">';
				stringa += '<td>' + record[0] + '</td>';
				stringa += '<td>' + record[4] + '</td>';
				stringa += '<td>' + record[1] + '</td>';
				stringa += '<td>' + record[7] + '</td>';
				stringa += '</tr>';
				$('#listam').append(stringa);
				i++;
			}
		});
	});
}

function copia(a){
    var riga = document.getElementById(a)
    var elementi = riga.getElementsByTagName('td');
    for (var t=0; t<elementi.length;t++){
		document.getElementById("matricolas").value = elementi[0].innerText;
		document.getElementById("myinput").value = elementi[0].innerText;
		document.getElementById("prodotto").value = elementi[1].innerText;
		document.getElementById("cliente").value = elementi[2].innerText;
		document.getElementById("cantiere").value = elementi[3].innerText;
    }
	indirizzo_cliente();
    myFunction();
}

//Crea nome del file in base al giorno
function creanomefile(){
	var ora = new Date()
    var anno = ora.getFullYear().toString();
    var mese = (ora.getMonth()+1).toString();
    var giorno = ora.getDate().toString();
    var datalo = anno.padStart(4,'0')+mese.padStart(2,'0')+giorno.padStart(2,'0');
    var cli = document.getElementById('cliente11').innerText;
    if(cli!==""){datalo += " - " + cli};
    var mac = document.getElementById('prodotto1').innerText;
    if(mac!==""){datalo += " - " + mac};
    var mat = document.getElementById('matricola').innerText;
    if(mat!==""){datalo += " - " + mat};
	return datalo;
}

//salva
function salvafile(nome, callback){
	if(nome!==""){
		var cartella =  nome;
	} else {
		var desk = finddesktop().toString();
		let options = {
			title: "Salva Scheda Lavoro con nome",
			defaultPath : desk + '\\' + creanomefile() + ".ma",
			buttonLabel : "Salva Scheda Lavoro",
			filters :[{name: 'Scheda Lavoro', extensions: ['ma']}],
		}
		var cartella =  dialog.showSaveDialogSync(options, "");
	}
	$('#modifiche').text("0");
	$('#salvataggio').text(cartella);        
	fs.writeFile(cartella, creasalvataggio(), function(err) {
		if(err) {return console.log(err)};
		$('#modifiche').text("0");
		$('#salvataggio').text(cartella);
		const options = {
			type: 'info',
			buttons: ['Ok'],
			title: 'Salvataggio',
			message: 'File salvato: ' + cartella,
			noLink: true
		}
	var f = dialog.showMessageBoxSync(remote.getCurrentWindow(), options);
	callback();
		})
}

function esportapdf(){
	var desk = finddesktop();
    let options = {
        title: "Esporta Scheda Lavoro PDF",
        defaultPath : desk + '\\' + creanomefile() + ".pdf",
        buttonLabel : "Esporta Scheda Lavoro PDF",
        filters :[
			{name: 'PDF', extensions: ['pdf']},
        ]
       }
    var cartella =  dialog.showSaveDialogSync(options, "");
	var che = cartella.substring(cartella.length-2,cartella.length);
	printpdf(cartella);
}

//controlla se il file è stato modificato
function controllamodifiche(a, callback){
	var c = $('#modifiche').text();
	if(c=="1"){
		const options = {
			type: 'question', 
			buttons: ['Salva Scheda Lavoro', 'Non Salvare', 'Annulla'], 
			title: 'Salva', 
			message: 'Vuoi Salvare le modifiche alla Scheda Lavoro?', 
			noLink: true
		};
		var sce = dialog.showMessageBoxSync(remote.getCurrentWindow(), options);
		if(sce==0){
			if(a=='esci'){
				salvafile(document.getElementById('salvataggio').innerText, function(){remote.app.quit()})
			} else if(a=='apri'){
				salvafile(document.getElementById('salvataggio').innerText, function(){aprifile('a')})
			} else if(a=='pulisci'){
				salvafile(document.getElementById('salvataggio').innerText, function(){pulisci()})
			} else {};
		} else if(sce==1){
			ipcRenderer.send('si');
			callback();
		} else{
		}
	} else {ipcRenderer.send('si');callback()}
}

//Apri file
function aprifile(a){
	if(a=="a"){
		var desk = finddesktop();
		let options = {
			title : "Seleziona Scheda Lavoro", 
			defaultPath : desk,
			buttonLabel : "Apri Scheda Lavoro", 
			filters :[
				{name: 'Schede Lavoro', extensions: ['ma']},
			   ],   
			properties: ['openFile']
        }
		var filename =  dialog.showOpenDialogSync(options, "");
		if(filename!==undefined){
			$.get(filename, function(data) {
				estraidati(JSON.parse(data));
				//document.getElementById('salva').innerHTML = data
			})
		}
		$('#modifiche').text("0");
		$('#salvataggio').text(filename);
		$('#menuMatricola').draggable();
		$('#menuRapporto').draggable();
		$('#menuOre').draggable();
		$('#menuSU').draggable();
		$('#menuMail').draggable();
		closeMenu()
	} else {
		$.get(a, function(data) {
			estraidati(JSON.parse(data));
			$('#modifiche').text("0");
			$('#salvataggio').text(a);
			$('#menuMatricola').draggable();
			$('#menuRapporto').draggable();
			$('#menuOre').draggable();
			$('#menuSU').draggable();
			$('#menuMail').draggable();
        })
	}
}

//Cancella tutti i dati
function pulisci(){
	remote.getCurrentWindow().reload();
}
 
function ver_pulisci(){
	const options = {
		type: 'info',
		buttons: ['Elimina', 'Mantieni'],
		title: 'Eliminare?',
		message: 'Vuoi eliminare i dati non salvati?',
		noLink: true
	};
	var resp = dialog.showMessageBoxSync(remote.getCurrentWindow(), options) 
	if (resp==0){pulisci(); closeMenu();}
}
		
function oggi(){
	n =  new Date();
	y = n.getFullYear();
	m = n.getMonth() + 1;
	d = n.getDate();
	$('#data1').val(convdata(today()));	
	var i=1;
	$('#tec').html("");
	$.get('.\\tech.txt', function(data) {
		var linee = data.split("\n");
		$.each(linee, function(n, elem) {
			var record = elem.split("_");
			if(record[0]!==""){
				var stringa= '<option value="' + record[0] + '">' + record[1] + '</option>';
				$('#tec').append(stringa);
				i++;
			}
		});
	controlladata();
	});
}

function aggiungi() {
	const options = {
		type: 'error',
		buttons: ['OK'],
		title: 'Errore',
		message: 'Massimo 7 giorni',
	};
	var riga = document.getElementById('ris').getElementsByTagName('tr');
	var ind = riga.length;
	//verifica che le righe siano < 7
	if(ind<=6){    
		var parts = document.getElementById("data1").value.toString().split("-");
		var mydate = parts[0]+ parts[1]+ parts[2]; 
		document.getElementById('ris').appendChild(document.createElement("TR"));
		var ele = [document.getElementById('tec').value, mydate];
		//controlla le festività
		var fd=$('#data1').val();
		var fest = verificadata(fd, moment(fd).format("DD"),moment(fd).format("MM"),moment(fd).format("YYYY"));
		//copia tutti gli elementi "ore"
		var orr = document.getElementsByClassName('ore');
		//aggiunge le ore all'array ele
		for(t=0;t<orr.length;t++){ele.push(orr[t].value)};
		//crea l'indice di riga nella prima colonna
		var n = document.createElement('TD');
		var t = document.createTextNode(ind+1);
		document.getElementById('ris').getElementsByTagName('tr')[ind].appendChild(n);
		n.appendChild(t); 
		//aggiunge tutti gli elementi contenuti in 'ele' all'interno della tabella 'ris'   
		for(var i=0; i<ele.length;i++){
			n = document.createElement('TD');
			var t = document.createTextNode(ele[i]);
			if(i>1){
				var att = document.createAttribute("class");
				att.value= "ores";
				n.setAttributeNode(att);
			}
			n.appendChild(t);
			document.getElementById('ris').getElementsByTagName('tr')[ind].appendChild(n);
		}
		//aggiunge il modifica riga
		var n = document.createElement('TD');
		var t = document.createTextNode("Modifica");
		n.appendChild(t);
		att = document.createAttribute("class");
		att.value="elim";
		n.setAttributeNode(att);
		att = document.createAttribute("onClick");
		att.value="modifica(this.parentNode.rowIndex)";
		n.setAttributeNode(att);
		document.getElementById('ris').getElementsByTagName('tr')[ind].appendChild(n);
		//aggiunge l'elimina riga
		var n = document.createElement('TD');
		var t = document.createTextNode("Elimina");
		n.appendChild(t);
		att = document.createAttribute("class");
		att.value="elim";
		n.setAttributeNode(att);
		att = document.createAttribute("onClick");
		att.value="cancella(this.parentNode.rowIndex)";
		n.setAttributeNode(att);
		document.getElementById('ris').getElementsByTagName('tr')[ind].appendChild(n);
		//canCella le ore
		clearore();
		sortTable();
		var numrig = document.getElementById('ris').getElementsByTagName('tr');
		for(var z=0;z<numrig.length;z++){
			numrig[z].getElementsByTagName('td')[0].innerText = z+1;
		}             
	} else {dialog.showMessageBox(remote.getCurrentWindow(), options);}
	
}

function cancella(n){
	document.getElementById('ris').getElementsByTagName('tr')[n].remove();
	var a1a = document.getElementById('ris').getElementsByTagName('tr');
	var inc = 1;
	for (var y=0;y<a1a.length;y++){
		a1a[y].getElementsByTagName('td')[0].innerText=inc;
		inc++;
	}
}

function eliminatutto(){
	var nrrighe = document.getElementById('ris').getElementsByTagName('tr');
	if(nrrighe.length>0){
		var g = document.getElementById('ris').getElementsByTagName('tr');
		for (var y=g.length - 1;y>-1;y--){
			g[y].remove();
		}
	}
}
            
function clearore(){
	var or = document.getElementsByClassName('ore');
	for(var i=0;i<or.length;i++){or[i].value="";}
}

function sortTable() {
	var table, rows, switching, i, x1, x, y, shouldSwitch;
	table = document.getElementById("ris");
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
		x = rows[i].getElementsByTagName("TD")[2].innerText;
		y = rows[i + 1].getElementsByTagName("TD")[2].innerText;
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
		  
function verificadata(g, gg,mm,an){
    var feste = ["01/01", "06/01", "25/04", "05/01", "02/06", "15/08", "16/08", "01/11", "07/12", "08/12", "24/12", "25/12", "26/12", "31/12"];
    var dd = new Date(g);
    var pasqua = Easter(an);
    var pasquetta =  padout(pasqua.substring(0,2)*1+1) + "/" + padout(pasqua.substring(4,5));
	feste.push(pasqua, pasquetta);
    var wd = dd.getDay();
	var fest = false;
    if(wd==0){fest="fest"}
    else if(wd==6){fest="sab"}
    else {fest = "fer"};
	var test = gg + "/" + mm;
	feste.forEach(function(el){if(el==test){fest="fest";}});
    return fest;
}    

function Easter(Y) {
    var C = Math.floor(Y/100);
    var N = Y - 19*Math.floor(Y/19);
    var K = Math.floor((C - 17)/25);
    var I = C - Math.floor(C/4) - Math.floor((C - K)/3) + 19*N + 15;
    I = I - 30*Math.floor((I/30));
    I = I - Math.floor(I/28)*(1 - Math.floor(I/28)*Math.floor(29/(I + 1))*Math.floor((21 - N)/11));
    var J = Y + Math.floor(Y/4) + I + 2 - C + Math.floor(C/4);
    J = J - 7*Math.floor(J/7);
    var L = I - J;
    var M = 3 + Math.floor((L + 40)/44);
    var D = L + 28 - 31*Math.floor(M/4)-1;
    return padout(D) + '/' + padout(M);
}

function padout(number) { return (number < 10) ? '0' + number : number; }

function indirizzo_cliente(){
	var elclienti = document.getElementById('listac');
	var clienti = elclienti.rows
	var cliente = document.getElementById('cliente').value;
	for(var i = 0; i<clienti.length;i++){
		if(cliente==clienti[i].getElementsByTagName('td')[0].innerText){
			document.getElementById('clientead1').value= clienti[i].getElementsByTagName('td')[1].innerText;
			document.getElementById('clientead2').value= clienti[i].getElementsByTagName('td')[2].innerText;
			break;
		}
	}
}

function openSU(){	 
	document.getElementById('sucommessa').value=document.getElementById('commessa1').innerText;
	document.getElementById('sunsofferta').value=document.getElementById('nsofferta1').innerText;
	document.getElementById('suapbpcs').value=convdata(document.getElementById('apbpcs').innerText);
	document.getElementById('suchbpcs').value=convdata(document.getElementById('chbpcs').innerText);
	document.getElementById('sudocbpcs').value=document.getElementById('docbpcs').innerText;
	addsp();
}

function closeSU(){
	document.getElementById('commessa1').innerText=document.getElementById('sucommessa').value;
	document.getElementById('nsofferta1').innerText=document.getElementById('sunsofferta').value;
	document.getElementById('apbpcs').innerText=convdata(document.getElementById('suapbpcs').value);
	document.getElementById('chbpcs').innerText=convdata(document.getElementById('suchbpcs').value);
	document.getElementById('docbpcs').innerText=document.getElementById('sudocbpcs').value;
	closeMenu();
}

function sondaggio(){
	var sondint = document.getElementsByName('int');
	var sondric = document.getElementsByName('ric');
	var sondese = document.getElementsByName('ese');
	for(var i=0;i<5;i++){
		if(sondint[i].checked){
			var a1 = i
			a1++
		}
		if(sondric[i].checked){
			var a2 = i
			a2++
		}
		if(sondese[i].checked){
			var a3 = i
			a3++
		}
	}
	var risultato=document.getElementById('rissondaggio');
	risultato.innerText = "" + a1 + a2 + a3;
}

//update dell'appCodeName
function aggiorna(){
	$.getJSON("https://api.github.com/repos/marcoa5/episjob/releases/latest").done(function (data){
		var items = [];
		$.each( data, function( key, val ) {
			if(key=="name"){
				if(val!==$('#upd').text().substring(1)){
					document.getElementById('message').innerText = "Download in corso. Al termine l'applicazione si riavvierà automaticamente...";
					document.getElementById('restart-button').classList.add('hidden');
					document.getElementById('close-button').classList.add('hidden');
					require("electron").remote.require("electron-download-manager").download({
					url: "https://github.com/marcoa5/episjob/releases/download/v"+val+"/servicejob-Setup-"+val+".exe"
					}, function (error, info) {
						if (error) {
							console.log(error);
							return;
						}
						console.log("DONE: " + info.filePath);
						shell.openItem(info.filePath);
						document.getElementById('modifiche').innerText = "0";
						remote.app.quit();
					});
				}
			}
		});
	})
}

function nuovamail(a,b){
	var te = document.getElementById('indmail').checkValidity();
	if(te==true){
		var inse = '<div class="mail">' + document.getElementById('indmail').value + "</div><br>";
		var node = document.createElement("div");
		node.className = "mail";
		var textnode = document.createTextNode(document.getElementById('indmail').value);
		node.appendChild(textnode);
		node.addEventListener("click", eliminamail);
		document.getElementById('elencomail').appendChild(node) ;
		document.getElementById('indmail').value="";
		document.getElementById('indmail').focus();
		var elem = document.getElementsByClassName('mail');
		a();
		b();
	} else {
		const options = {
		type: 'error',
		buttons: ['OK'],
		title: 'Errore',
		message: 'Mail non valida'
		};
		dialog.showMessageBoxSync(remote.getCurrentWindow(), options);
	}
}

function riaprimenumail(){
	var c = document.getElementsByClassName('mail');
	for(var i=0;i<c.length;i++){
		c[i].addEventListener("click", eliminamail);
	}
}

function eliminamail(){
	const options = {
		type: 'question',
		buttons: ['No','Si'],
		title: 'Elimina',
		noLink: true,
		message: 'Vuoi eliminare?'}
	var sce = dialog.showMessageBoxSync(remote.getCurrentWindow(), options);
	if(sce==1){this.remove();}
}

function controllaindirizzi(){
	const options = {
		type: 'error',
		buttons: ['Ok'],
		title: 'Indirizzi',
		noLink: true,
		message: 'Indirizzi Mail non presenti'
	}
	var el = document.getElementsByClassName('mail');
	var st="";
	for(var i=0;i<el.length;i++){
		st+="- " + el[i].innerText + "\n";
	}
	const options1 = {
		type: 'question',
		buttons: ['No', 'Si'],
		title: 'Invio',
		noLink: true,
		message: 'Inviare la mail ai seguenti indirizzi?\n' + st
	}
	
	if(el.length!==0){
		var sce=dialog.showMessageBoxSync(remote.getCurrentWindow(), options1);
		if(sce==1){closeMenu(); printpdf('a')}
		} else {
			if($('#indmail').val()!==""){nuovamail(closeMenu, controllaindirizzi);}
			//dialog.showMessageBoxSync(remote.getCurrentWindow(), options)
		}
}

function controllafirme(){
	var ft = document.getElementById('firmatt1').getAttribute('src');
	ft = ft.substring(ft.length - 9, ft.length);
	const options = {
		type: 'error',
		buttons: ['Ok'],
		title: 'Firme',
		noLink: true,
		message: 'Il documento non è stato firmato dal tecnico Epiroc'
	}
	if(ft=="white.png"){dialog.showMessageBoxSync(remote.getCurrentWindow(), options)} else {riaprimenumail();openMenu('menuMail');}
}

function abilitaok(a){
	if(a=='t'){
		$("#save1").attr("disabled", false);
	} else{
		$('#contfirmac').text('1');
	}
}

function scrivikm(){
	$.get('km.txt', function(data){
		prompt({
			title: 'KM',
			label: 'Km di autostrada:',
			value: parseFloat(($('#spv1').val()).replace(",",".")/data).toFixed(0),
			type: 'input'
		})
		.then((r) => {
			if(r == 0) {
				$('#spv1').val('');
			} else if(r!==null){
				$('#spv1').val(parseFloat(r*data).toFixed(0) + ",00");
			} else if(r==0){$('#spv1').val('')}
		})
		.catch(console.error);
		$('#off1').focus();
	})
}

function controllafirmac(){
	$('#contfirmac').text('1');
	abilitainvia();
}

function controllanomec(){
	if($('#nomecognome').val()!==""){
		$('#contnomec').text($('#nomecognome').val());
		} else {
			$('#contnomec').text('');
		}
	abilitainvia()
}


function controllasondc(){
	var int1 = document.getElementsByName("int");
	var ric1 = document.getElementsByName("ric");
	var ese1 = document.getElementsByName("ese");
	var g=0;
	for(var t=0;t<5;t++){
		if(int1[t].checked){g++};
		if(ric1[t].checked){g++};
		if(ese1[t].checked){g++};		
	}
	if(g>=2){$('#contsondc').text('1')}
	abilitainvia()
}

function abilitainvia(){
	if($('#contfirmac').text()!=="" && $('#contsondc').text()!=="" && $('#contnomec').text()!==""){
		$('#save2').attr("disabled", false);
	} else {
		$('#save2').attr("disabled", true);
	}
}

function caricasond(){
	var risso = $('#rissondaggio').text();
	if(risso>0){
		var s1 = risso.substring(0,1);
		var s2 = risso.substring(1,2);
		var s3 = risso.substring(2,3);
		document.getElementsByName('int')[s1-1].checked=true;
		document.getElementsByName('ric')[s2-1].checked=true;
		document.getElementsByName('ese')[s3-1].checked=true;
	}
}

function mille(a){
	var l = a.length;
	if(l>3){
		var d = a.substring(l-3,l);
		var f = l-d.length;
		var w = a.substring(0,f)
		var mig = (w+"."+d);
		return mig;
	} else {
		return a;
	}
	
}

function coeffkm(){
	var cart = window.location.pathname.substr(0, window.location.pathname.lastIndexOf('/'));
	$.get(cart + '\\km.txt', function(data){
	prompt({
		title: 'Coefficiente km',
		label: 'Imposta Coefficiente:',
		value: data,
		type: 'input'
	})
	.then((r) => {
		if(r === null) {
		} else {
			fs.writeFileSync(cart + '\\km.txt', r.replace(",","."));
		}
	})
	.catch(console.error);
	})
}


function temp(){
	tmp.dir(function tep(err,path){
		var gin = path.indexOf("tmp");
			path = path.substring(0, gin) + "ServiceJob";
			mkdirp(path, function(err) {shell.openItem(path)});
	})
}

function finddesktop(){
	var desk="";
	var test = homedir + "\\Onedrive - Epiroc\\desktop";
	if(fs.existsSync(test)){
		desk = test;
	} else {
		desk = require('path').join(require('os').homedir(), 'Desktop');
	}
	return desk
}
  
function today(){
	var og = new Date();
	var anno = og.getFullYear();
	var mese = (og.getMonth()+1).toString().padStart(2,'0');
	var giorno = og.getDate().toString().padStart(2,'0');
	var fg = giorno + "/" + mese + "/" + anno;
	return fg
}

function controllaviaggi(){
	var a1 = $('#spov1').val();
	var a2 = $('#spsv1').val();
	var a3 = $('#mntv1').val();
	var a4 = $('#mnfv1').val();
	var a5 = $('#mfv1').val();
	if(a1!=="" | a2!=="" | a3!=="" | a4!=="" | a5!=""){
		$('#km1').attr("disabled", false);
		$('#spv1').attr("disabled", false);
	} else {
		$('#km1').attr("disabled", true);
		$('#spv1').attr("disabled", true);
	}
}

$( document ).ready(function(e) {
	$('#km1').attr("disabled", true);
	$('#spv1').attr("disabled", true);
});

$(document).keyup(function(e){
	if(e.key === "Escape"){closeMenu()};
})


$( document ).ready(function(e) {
	var chiave ="";
	var colonne = [];
	sprLib.user({'baseUrl': murl}).info()
	.then(function(obj){
		
		var ch = obj.Email;
		if(obj.Title!==undefined){
			$('#user').text(obj.Title);
			var a = obj.Title;
			if(a=="Marco Arato" | a =="Marco Fumagalli" | a=="Nicolo Tuppo" | a=="Mario Parravicini" | a=="Carlo Colombo"){ipcRenderer.send('attmenu');}
		} else {
			$('#user').text('External user');
		}			
	});
	sprLib.rest({ url:murl + 'Lists/Sondaggio/_api/contextinfo', type:'POST' })
	.then(function(arr,err){
		if(arr==""){
		} else {
			chiave = arr[0].GetContextWebInformation.FormDigestValue;
			campi[0]=chiave;
			sprLib.list({name:'Sondaggio', baseUrl: murl, requestDigest: chiave }).cols()
			.then(function(arrayResults){
				colonne=arrayResults; 
				colonne.forEach(function(id){
					if(id.dataType=="Text"){
						campi.push(id.dataName);
					}
				})
			});
		}
	})
});


function addsp(){
	var risu = ['a'];
	var con = "";
	var f = [];
	var t=0;
	var a=0;
	risu.push($('#cliente11').text());
	risu.push($('#matricola').text());
	risu.push($('#contnomec').text());
	risu.push($('#prodotto1').text());
	risu.push($('#nom').text());
	risu.push($('#rissondaggio').text().substring(0,1));
	risu.push($('#rissondaggio').text().substring(1,2));
	risu.push($('#rissondaggio').text().substring(2,3));
	risu.push($('#dat3').text()+$('#dat2').text()+$('#dat1').text());
	risu.push($('#stdspe').text());
	risu.forEach(function(val){
		if(val==""){con = "1"};
	})
	if(con!=="1"){
		sprLib.list({name:'Sondaggio', baseUrl: murl, requestDigest: campi[0] }).items()
		.then(function(val){
			val.forEach(function(d, id){
				f.push(id);
				f.push(d.Title);
				f.push(d.Matricola);
				f.push(d.Nome_x0020_Cliente);
				f.push(d.macchina);
				f.push(d.tecnico);
				f.push(d.sondaggio1);
				f.push(d.sondaggio2);
				f.push(d.sondaggio3);
				f.push(d.data_x0020_intervento);
				f.push(d.tipo_x0020_intervento);
				for(var i=1;i<11;i++){
					if(risu[i]==f[i]){a++}else{break}
				}
				if(a==10){t++}
				a=0;
				f = [];
			})
			if(t==0){
				sprLib.list({name:'Sondaggio', baseUrl: murl, requestDigest: campi[0] })
				.create({
					Title: risu[1],
					Matricola: risu[2],
					Nome_x0020_Cliente: risu[3],
					macchina: risu[4],
					tecnico: risu[5],
					sondaggio1: risu[6],
					sondaggio2: risu[7],
					sondaggio3: risu[8],
					data_x0020_intervento: risu[9],
					tipo_x0020_intervento: risu[10],
				})
				.then(function(objItem){
					const options = {
						type: 'info',
						buttons: ['OK'],
						title: 'SharePoint',
						message: 'Sondaggio caricato su SP',
						};
						dialog.showMessageBoxSync(remote.getCurrentWindow(), options);
				})
				//.catch(function(strErr){ console.error(strErr); });
			} else {
				const options = {
				type: 'error',
				buttons: ['OK'],
				title: 'Errore',
				message: 'Sondaggio già presente in SP',
				};
				dialog.showMessageBoxSync(remote.getCurrentWindow(), options);
			}
		})
	}
}

function convdata(v){
	if(v!==""){
	var n;
	var g;
	var m;
	var a;
	var o;
	if(v.substring(2,3)=="/"){
		n = v.split("/");
		g = n[0];
		m = n[1];
		a = n[2];
		o = a +"-" + m +"-" + g
		return o
	} else {
		n = v.split("-");
		a = n[0];
		m = n[1];
		g = n[2];
		o = g +"/" + m +"/" + a
		return o
	}
	} else {return ""}
}

function modifica(r){
	var a = document.getElementById("ris").getElementsByTagName("tr")[r].getElementsByTagName("td");
	var b = document.getElementById("main").getElementsByTagName("tr")[3].getElementsByTagName("td");
	for(var i=1;i<17;i++){
		if(i>2){
			b[i-1].getElementsByTagName("input")[0].value=a[i].innerText;
		}
		document.getElementById("tec").value = a[1].innerText
		document.getElementById("data1").value = a[2].innerText.substring(0,4) + "-" + a[2].innerText.substring(4,6)+ "-" + a[2].innerText.substring(6,8);
	}
	controllaviaggi();
	cancella(r);
}

function stampa(){
	const op = { margins: 'none' }
	remote.getCurrentWindow().webContents.print(op, (success, errorType) => {
	if (!success) console.log(errorType)
})
}

function adminmenu(){
	openMenu('menuSU');
}

function creasalvataggio(){
	var s = {};
	s[$('#commessa1').attr('id')] = $('#commessa1').text();
	s[$('#vsordine').attr('id')]= $('#vsordine').text();
	s[$('#nsofferta1').attr('id')]= $('#nsofferta1').text();
	s[$('#prodotto1').attr('id')]= $('#prodotto1').text();
	s[$('#matricola').attr('id')]= $('#matricola').text();
	s[$('#orem1').attr('id')]= $('#orem1').text();
	s[$('#perc11').attr('id')]= $('#perc11').text();
	s[$('#perc21').attr('id')]= $('#perc21').text();
	s[$('#perc31').attr('id')]= $('#perc31').text();
	s[$('#data11').attr('id')]= $('#data11').text();
	s[$('#cliente11').attr('id')]= $('#cliente11').text();
	s[$('#cliente12').attr('id')]= $('#cliente12').text();
	s[$('#cliente13').attr('id')]= $('#cliente13').text();
	s[$('#cantiere1').attr('id')]= $('#cantiere1').text();
	s[$('#rappl1').attr('id')]= $('#rappl1').text();
	s[$('#oss1').attr('id')]= $('#oss1').text();
	s[$('#stdspe').attr('id')]= $('#stdspe').text();
	s[$('#apbpcs').attr('id')]= $('#apbpcs').text();
	s[$('#chbpcs').attr('id')]= $('#chbpcs').text();
	s[$('#docbpcs').attr('id')]= $('#docbpcs').text();
	s[$('#rissondaggio').attr('id')]= $('#rissondaggio').text();
	s[$('#contnomec').attr('id')]= $('#contnomec').text();
	s[$('#contfirmac').attr('id')]= $('#contfirmac').text();
	s[$('#contsondc').attr('id')]= $('#contsondc').text();
	s[$('#tabset').attr('id')]= $('#tabset').html();
	s[$('#ris').attr('id')]= $('#ris').html();
	s[$('#sondaggio').attr('id')]= $('#sondaggio').html();
	s[$('#elencomail').attr('id')]= $('#elencomail').html();
	s[$('#firmatt1').attr('id')]= $('#firmatt1').attr('src');
	s[$('#firmacc1').attr('id')]= $('#firmacc1').attr('src');
	var ar = [];
	$('#rs input:radio').each(function (index) {

		if($(this).is(':checked')){
			ar.push($(this).attr('id'));
		}
	});
	s['rs']=ar;
	var p = JSON.stringify(s);
	return p;
}

function estraidati(a){
	var p = Object.keys(a);
	p.forEach(function(key){
		if(key!=="sondaggio" && key!=="ris" &&  key!=="tabset" && key!=="elencomail" && key!=="firmacc1" && key!=="firmatt1" && key!=="rs"){
			$('#' + key).text(a[key]);
		} else if(key=="sondaggio" | key=="ris" |  key=="tabset" | key=="elencomail"){
			$('#' + key).html(a[key]);
		}  else if(key=="firmatt1" | key=="firmacc1"){
			$('#' + key).attr('src', a[key]);
		} else {
			a[key].forEach(el =>{
				$('#' + el).prop('checked', true);
			});
		}
		
	})
	abilitainvia();
}

function vecchi(){
	var desk = finddesktop();
	let options = {
		title : "Seleziona Scheda Lavoro", 
		defaultPath : desk,
		buttonLabel : "Apri Scheda Lavoro", 
		filters :[
			{name: 'Schede Lavoro', extensions: ['ma']},
		   ],   
		properties: ['openFile']
	}
	var filename =  dialog.showOpenDialogSync(options, "");
	if(filename!==undefined){
		$.get(filename, function(data) {
			document.getElementById('salva').innerHTML = data
		})
	}
}

function riskass(){
	var a="";
	var b = "";
	var s={};
	$('#rs tr').each(function (index) {
		if($('#rs').find('tr').eq(index).find('input:radio').eq(0).is(':checked')){b = 'OK'}
		if($('#rs').find('tr').eq(index).find('input:radio').eq(1).is(':checked')){b = 'NO'}
		if($('#rs').find('tr').eq(index).find('input:radio').eq(2).is(':checked')){b = 'NA'}
		if(b!==""){
			a += b + "\t-\t" + $('#rs').find('tr').eq(index).find('td').eq(0).text() + '\n';
		} else {
			a += '\n';
		}
		b="";
	});
	return a;
	
}



function openMenu(n){
    
    var f = document.getElementsByClassName("finestra")
    for(var c=0;c<f.length;c++){
        f[c].style.display = "none";
    }
    document.getElementById(n).style.display = "block";
    dimen();
    document.getElementsByClassName("foglio")[0].style.filter = "blur(8px)"
    document.getElementsByClassName("foglio")[0].disabled = true;
    if(n == 'firmac1'){init("firmac")};
    if(n == 'firmat1'){init("firmat")};
    if(n=='menuOre'){oggi()};
	if(n=='manuSU'){openSU()};
	if(n=='menuMatricola'){Apri()};
    var iu = document.getElementById('stdspe').innerText;
        if(iu=='SPE'){document.getElementById('manspe').checked = true}
    ;

    


    document.getElementById("myinput").value=document.getElementById("matricola").innerText;
    myFunction();
    document.getElementById("matricolas").value=document.getElementById("matricola").innerText;
    document.getElementById("prodotto").value=document.getElementById("prodotto1").innerText;
    document.getElementById("cliente").value=document.getElementById("cliente11").innerText;
	document.getElementById("clientead1").value=document.getElementById("cliente12").innerText;
	document.getElementById("clientead2").value=document.getElementById("cliente13").innerText;
    document.getElementById("cantiere").value=document.getElementById("cantiere1").innerText;
    document.getElementById("orem").valu=document.getElementById("orem1").innerTexte;
    document.getElementById("perc1").value=document.getElementById("perc11").innerText;
    document.getElementById("perc2").value=document.getElementById("perc21").innerText;
    document.getElementById("perc3").value=document.getElementById("perc31").innerText;
    document.getElementById("rappl").value=document.getElementById("rappl1").innerText;
    document.getElementById("oss").value=document.getElementById("oss1").innerText;
	
	if(document.getElementById("data11").innerText!==""){
	var giorno =  new Date(document.getElementById("data11").innerText);
	var manno = giorno.getFullYear();
	var mmese = (giorno.getMonth()+1).toString().padStart(2,'0');
	var mgiorno = giorno.getDate().toString().padStart(2,'0');
	document.getElementById("data2").value= manno + "-" + mmese.padStart(2,'0') +"-" + mgiorno.padStart(2,'0');}
}

window.onresize = dimen();
dimen();

function dimen(){
  var fff = document.getElementsByClassName("finestrai")
  for(var u=0;u<fff.length;u++){
      fff[u].style.maxHeight = window.innerHeight- 200 +"px";
  }
}


function closeMenu(){
    var fin = document.getElementsByClassName("finestra")
    for(var i =0;i<fin.length;i++){
        fin[i].style.display="none"
    }
    
    document.getElementsByClassName("foglio")[0].style.filter = ""
    }


    var canvas, ctx = false

    function init(h){
      
      canvas=document.getElementById(h);
      
      // Adjust canvas coordinate space taking into account pixel ratio,
      // to make it look crisp on mobile devices.
      // This also causes canvas to be cleared.
      function resizeCanvas() {
          // When zoomed out to less than 100%, for some very strange reason,
          // some browsers report devicePixelRatio as less than 1
          // and only part of the canvas is cleared then.
          var ratio =  Math.max(window.devicePixelRatio || 1, 1);
          canvas.width = "552";
          canvas.height = "240";
          //canvas.getContext("2d").scale(ratio, ratio);
      }
      
      window.onresize = resizeCanvas;
      resizeCanvas();

      
      var signaturePad = new SignaturePad(canvas, {});
      var er, sa = false
      if(h=="firmat"){
        er = "erase1";
        sa = "save1";
      } else if(h=="firmac"){
        er = "erase2";
        sa = "save2";
      }

        document.getElementById(er).addEventListener('click', function () {
        signaturePad.clear();
      });
      document.getElementById(sa).addEventListener('click', function () {
        var dataURL = canvas.toDataURL();
        if(h=="firmac"){
          document.getElementById("firmacc1").src = dataURL;
          closeMenu();
        } else if(h=="firmat"){
          document.getElementById("firmatt1").src = dataURL;
          closeMenu();
        } else {}
      });  
      
     
    }
      



function salvadati(){
    document.getElementById("matricola").innerText = document.getElementById("matricolas").value;
    document.getElementById("prodotto1").innerText = document.getElementById("prodotto").value;
    document.getElementById("cliente11").innerText = document.getElementById("cliente").value;
	document.getElementById("cliente12").innerText = document.getElementById("clientead1").value;
	document.getElementById("cliente13").innerText = document.getElementById("clientead2").value;
    document.getElementById("cantiere1").innerText = document.getElementById("cantiere").value;
    document.getElementById("orem1").innerText = document.getElementById("orem").value;
    document.getElementById("perc11").innerText = document.getElementById("perc1").value;
    document.getElementById("perc21").innerText = document.getElementById("perc2").value;
    document.getElementById("perc31").innerText = document.getElementById("perc3").value;
	document.getElementById("data11").innerText= new Date(document.getElementById("data2").value).toLocaleDateString();
    if(document.getElementById("manstd").checked){document.getElementById('stdspe').innerText = "STD"}else{document.getElementById('stdspe').innerText = "SPE"}
    openMenu('menuRapporto');
}


function salvacomm(){
  document.getElementById("rappl1").innerText = document.getElementById("rappl").value;
  document.getElementById("oss1").innerText = document.getElementById("oss").value;
  openMenu('menuOre');
}


function copiaore(){
  //salvadati();
  var datiinput = document.getElementById('ris');
  var righe = datiinput.getElementsByTagName('tr');
  var datioutput = document.getElementById('tabset');
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
    var a = document.getElementById('spov1').value;
    var b= document.getElementById('spol1').value;
    if((a*1+b*1)<9){return} else {
      dialog.showMessageBox(null, options);
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
      dialog.showMessageBox(null, options);
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
      dialog.showMessageBox(null, options);
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
      dialog.showMessageBox(null, options2);
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
      dialog.showMessageBox(null, options);
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
      dialog.showMessageBox(null, options);
      document.getElementById('off1').value = 8 
    }
  }
  if(n=='ofs'){
    var a = document.getElementById('ofs1').value;
    if((a*1)<9){return} else {
      dialog.showMessageBox(null, options);
      document.getElementById('ofs1').value = 8 
    }
  }
}

//disabilita l'inserimento in base al giorno dell'anno
function controlladata(){
  var param = verificadata(document.getElementById('data1').value);
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
  } else {

  };

}

var remote = require('electron').remote;
var fs = require('fs');
var mkdirp = require('mkdirp');
function printpdf (a) {
if(a=="a"){
	  const tmp = require('tmp')
	  var s = document.getElementById('salva').innerHTML; 
	  
	tmp.dir(function _tempDirCreated(err, path, cleanupCallback) {
		if (err) throw err;
		var gin = path.indexOf("tmp");
		path = path.substring(0, gin) + "ServiceJob";
		mkdirp(path, function(err) {});
		function ma(path, callback){
			fs.writeFileSync(path + "\\Scheda Lavoro.ma", s);
			remote.getCurrentWindow().webContents.printToPDF({pageSize: 'A4', marginsType: '0'}).then(data => {fs.writeFileSync(path + "\\Scheda Lavoro.pdf", data)});
			callback();
		}
		
		ma(path, function(){setTimeout(function(){send_mail(path)}, 3000)});
		})
}else {
		remote.getCurrentWindow().webContents.printToPDF({pageSize: 'A4', marginsType: '0'}).then(data => {
		  fs.writeFileSync(a, data, (err) => {if (err) throw err})})}
		}

    function send_mail(a) {  
	    var ora = new Date()
		var anno = ora.getFullYear().toString();
		var mese = (ora.getMonth()+1).toString();
		var giorno = ora.getDate().toString();
		var hr = ora.getHours().toString();
		var mi = ora.getMinutes().toString();
		var se = ora.getSeconds().toString();
		var datalo = anno.padStart(4,'0')+mese.padStart(2,'0')+giorno.padStart(2,'0')+hr.padStart(2,'0')+mi.padStart(2,'0')+se.padStart(2,'0');
      /*var path = require('path');
      var loc = window.location.pathname; 
      var dir = path.dirname(loc);*/
      var winax = require('winax'); 
      var objO = new ActiveXObject('Outlook.Application');     
      var objNS = objO.GetNameSpace('MAPI');     
      var mItm = objO.CreateItem(0);     
      mItm.Display();    
      mItm.To = 'xxx.xxx@epiroc.com';
      mItm.Subject = "Prova";
      mItm.Body = "Email di prova";
      mItm.Attachments.Add(a + '\\Scheda Lavoro.pdf');    
      mItm.GetInspector.WindowState = 2;
      //mItm.send();
	  var objO = new ActiveXObject('Outlook.Application');     
      var objNS = objO.GetNameSpace('MAPI');     
      var mItm = objO.CreateItem(0);     
      mItm.Display();    
      mItm.To = 'xxx.xxx@epiroc.com';
      mItm.Subject = "Prova";
      mItm.Body = "Email di prova"  + " - Risultato sondaggio: " + document.getElementById('rissondaggio').innerText;
      mItm.Attachments.Add(a + '\\Scheda Lavoro.ma');    
      mItm.GetInspector.WindowState = 2;
      //mItm.send();
	  fs.rename(a + '\\Scheda Lavoro.pdf', a + "\\" + datalo + " - " + document.getElementById('cliente11').innerText + ".pdf", function(err) {if ( err ) console.log('ERROR: ' + err);});
	  fs.rename(a + '\\Scheda Lavoro.ma', a + "\\" + datalo +  " - " + document.getElementById('cliente11').innerText + ".ma", function(err) {if ( err ) console.log('ERROR: ' + err);});
	}


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
            }
    }
}


function Apri(){
	
		//carica_clienti
	
	$('#listac tr').remove();
    var i = 1
    $.get('customers.txt', function(data) {
            var linee = data.split("\n");
            $.each(linee, function(n, elem) {
                var record = elem.split("_")
                var il = 'ele' + i
                var stringa= '<tr id=' + il + ' onclick="copia(' + "'" + il + "'" + ')">';
                     stringa += '<td>' + record[0] + '</td>';
                     stringa += '<td>' + record[1] + '</td>';
                     stringa += '<td>' + record[2] + '</td>';
                stringa += '</tr>'
                $('#listac').append(stringa)
            i++
            });
    });
	
	$('#listam tr').remove();
    var i = 1
    $.get('mol.txt', function(data) {
            var linee = data.split("\n");
            $.each(linee, function(n, elem) {
                var record = elem.split("_")
                var il = 'ele' + i
                var stringa= '<tr id=' + il + ' onclick="copia(' + "'" + il + "'" + ')">';
                     stringa += '<td>' + record[0] + '</td>';
                     stringa += '<td>' + record[4] + '</td>';
                     stringa += '<td>' + record[1] + '</td>';
                     stringa += '<td>' + record[7] + '</td>';
                stringa += '</tr>'
                $('#listam').append(stringa)
            i++
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


//salva
function salvafile(){
    var ora = new Date()
    var anno = ora.getFullYear().toString();
    var mese = (ora.getMonth()+1).toString();
    var giorno = ora.getDate().toString();
    //var hr = ora.getHours().toString();
    //var mi = ora.getMinutes().toString();
    //var se = ora.getSeconds().toString();
    var datalo = anno.padStart(4,'0')+mese.padStart(2,'0')+giorno.padStart(2,'0')/*+hr.padStart(2,'0')+mi.padStart(2,'0')+se.padStart(2,'0')*/;
    
    var cli = document.getElementById('cliente11').innerText;
    if(cli!==""){datalo += " - " + cli};
    var mac = document.getElementById('prodotto1').innerText;
    if(mac!==""){datalo += " - " + mac};
    var mat = document.getElementById('matricola').innerText;
    if(mat!==""){datalo += " - " + mat};

    var desk = require('path').join(require('os').homedir(), 'Desktop');
    let options = {
        //Placeholder 1
        title: "Salva File",
        
        //Placeholder 2
        defaultPath : desk + '\\' + datalo + ".ma",
        
        //Placeholder 4
        buttonLabel : "Salva Scheda Lavoro",
        
        //Placeholder 3
        filters :[
         {name: 'Scheda Lavoro', extensions: ['ma']},{name: 'PDF', extensions: ['pdf']},
        ]
       }
    
    

    
    var cartella =  dialog.showSaveDialogSync(options, "");
	var che = cartella.substring(cartella.length-2,cartella.length);
    if(che=="ma"){
        var s = document.getElementById('salva').innerHTML;           
        fs.writeFile(cartella, s, function(err) {
            if(err) {
                return console.log(err);
            }
        });
    } else {printpdf(cartella)};
}

  function aprifile(){
    var desk = require('path').join(require('os').homedir(), 'Desktop');
    let options = {
        title : "Seleziona File", 
        defaultPath : desk,
        buttonLabel : "Apri File", 
        filters :[
            {name: 'Schede Lavoro', extensions: ['ma']},
           ],   
        properties: ['openFile']
       }
    
    
    
    var filename =  dialog.showOpenDialogSync(options, "");
    if(filename!==undefined){
        $.get(filename, function(data) {
            /*console.log(data)
            document.getElementById('salva').innerHTML = ""*/
            document.getElementById('salva').innerHTML = data
        })}
        closeMenu()
    }





    function pulisci(){
        document.getElementById('data2').value="";
        var filename =  "blank.ma"
        if(filename!==undefined){
            $.get(filename, function(data) {
                /*console.log(data)
                document.getElementById('salva').innerHTML = ""*/
                document.getElementById('salva').innerHTML = data
                $('#menuMatricola').draggable();
                $('#menuRapporto').draggable();
                $('#menuOre').draggable();
				$('#SU').draggable();
            })}
        
            closeMenu();
    
        }
    
function ver_pulisci(){
	const options = {
				type: 'info',
                buttons: ['Elimina', 'Mantieni'],
                title: 'Eliminare?',
                message: 'Vuoi eliminare i dati non salvati?',
				noLink: true
              };
	
			var resp = dialog.showMessageBoxSync(null, options) 
            if (resp==0){
                pulisci();
                closeMenu();
            }
        }
		
function oggi(){
            n =  new Date();
            y = n.getFullYear();
            m = n.getMonth() + 1;
            d = n.getDate();
            document.getElementById("data1").value = y + "-" + m.toString().padStart(2,'0') + "-" + d.toString().padStart(2,'0');
            controlladata();
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
                var fest = verificadata(document.getElementById('data1').value);
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
                        n.setAttributeNode(att);}
                    n.appendChild(t);
                    document.getElementById('ris').getElementsByTagName('tr')[ind].appendChild(n);
                }
                //aggiunge l'elimina riga
                var n = document.createElement('TD');
                var t = document.createTextNode("Elimina riga");
                n.appendChild(t);
                att = document.createAttribute("class");
                att.value="elim";
                n.setAttributeNode(att);
                att = document.createAttribute("onClick");
                att.value="cancella(this.parentNode.rowIndex)";
                n.setAttributeNode(att);
                document.getElementById('ris').getElementsByTagName('tr')[ind].appendChild(n);
                //canella le ore
                clearore();
                sortTable();
                var numrig = document.getElementById('ris').getElementsByTagName('tr');
                for(var z=0;z<numrig.length;z++){
                    numrig[z].getElementsByTagName('td')[0].innerText = z+1;
                }             
            } else {dialog.showMessageBox(null, options);}
            
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
		  


function verificadata(g){
    var feste = ["01-01", "06-01", "04-25", "05-01", "06-02", "08-15", "08-16", "11-01", "12-07", "12-08", "12-24", "12-25", "12-26", "12-31"];
    var dd = new Date(g);
    var pasqua = Easter(g.substring(0,4));
    var gpasquetta = pasqua.substring(3,5)+1;
    var pasquetta =  pasqua.substring(0,3) + padout(pasqua.substring(3,5)*1+1);
    feste.push(pasqua, pasquetta);
    var wd = dd.getDay();
    var fest = false
    if(wd==0){fest="fest"}
    else if(wd==6){fest="sab"}
    else {fest = "fer"};
    var test = padout(dd.getMonth()+1) + "-" + padout(dd.getDate());
    feste.forEach(function(el){if(el==test){fest="fest"}});
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
    var D = L + 28 - 31*Math.floor(M/4);

    return padout(M) + '-' + padout(D);
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
}}

function openSU(){
	const prompt = require('electron-prompt');
	 
	prompt({
		title: 'Password',
		label: 'Pw:',
		value: '',
		inputAttrs: {
			type: 'url'
		},
		type: 'input'
	})
	.then((r) => {
		if(r === null) {
			console.log('user cancelled');
		} else {
			console.log('result', r);
		}
	})
	.catch(console.error);
	document.getElementById('sucommessa').value=document.getElementById('commessa1').innerText;
	document.getElementById('sunsofferta').value=document.getElementById('nsofferta1').innerText;
	document.getElementById('suapbpcs').value=document.getElementById('apbpcs').innerText;
	document.getElementById('suchbpcs').value=document.getElementById('chbpcs').innerText;
	document.getElementById('sudocbpcs').value=document.getElementById('docbpcs').innerText;
	
}

function closeSU(){
	document.getElementById('commessa1').innerText=document.getElementById('sucommessa').value;
	document.getElementById('nsofferta1').innerText=document.getElementById('sunsofferta').value;
	document.getElementById('apbpcs').innerText=document.getElementById('suapbpcs').value;
	document.getElementById('chbpcs').innerText=document.getElementById('suchbpcs').value;
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
	risultato.innerText = "Organizzazione Intervento: " + a1 + " - Consegna Ricambi: " + a2 + " - Esecuzione Intervento: " + a3;
}


//update dell'appCodeName
function aggiorna(){
	$.getJSON("https://api.github.com/repos/marcoa5/episjob/releases/latest").done(function (data){
		var items = [];
		$.each( data, function( key, val ) {
			if(key=="name"){
				if(val!==$('#upd').text().substring(1)){
					document.getElementById('message').innerText = 'Download in corso...';
					document.getElementById('restart-button')restartButton.classList.add('hidden');
					document.getElementById('close-button').classList.add('hidden');
					require("electron").remote.require("electron-download-manager").download({
					url: "https://github.com/marcoa5/episjob/releases/download/v"+val+"/servicejob-Setup-"+val+".exe"
					}, function (error, info) {
						if (error) {
							console.log(error);
							return;
						}
						console.log("DONE: " + info.filePath);
						const {shell} = require('electron');
						// Open a URL in the default way
						shell.openExternal(info.filePath);
						const remote = require('electron').remote;
						let w = remote.getCurrentWindow();
						w.close();
					});
				}
			}
		});
	})
}



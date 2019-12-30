


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
    var iu = document.getElementById('stdspe').innerText;
        if(iu=='SPE'){document.getElementById('manspe').checked = true}
    ;

    


    document.getElementById("myinput").value=document.getElementById("matricola").innerText;
    myFunction();
    document.getElementById("matricolas").value=document.getElementById("matricola").innerText;
    document.getElementById("prodotto").value=document.getElementById("prodotto1").innerText;
    document.getElementById("cliente").value=document.getElementById("cliente1").innerText;
    document.getElementById("cantiere").value=document.getElementById("cantiere1").innerText;
    document.getElementById("orem").valu=document.getElementById("orem1").innerTexte;
    document.getElementById("perc1").value=document.getElementById("perc11").innerText;
    document.getElementById("perc2").value=document.getElementById("perc21").innerText;
    document.getElementById("perc3").value=document.getElementById("perc31").innerText;
    document.getElementById("rappl").value=document.getElementById("rappl1").innerText;
    document.getElementById("oss").value=document.getElementById("oss1").innerText;
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
          document.getElementById("rissondaggio").innerText = document.getElementById("sondaggio").innerText;
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
    document.getElementById("cliente1").innerText = document.getElementById("cliente").value;
    document.getElementById("cantiere1").innerText = document.getElementById("cantiere").value;
    document.getElementById("orem1").innerText = document.getElementById("orem").value;
    document.getElementById("perc11").innerText = document.getElementById("perc1").value;
    document.getElementById("perc21").innerText = document.getElementById("perc2").value;
    document.getElementById("perc31").innerText = document.getElementById("perc3").value;
    if(document.getElementById("manstd").checked){document.getElementById('stdspe').innerText = "STD"}else{document.getElementById('stdspe').innerText = "SPE"}
    openMenu('menuRapporto');
}


function salvacomm(){
  document.getElementById("rappl1").innerText = document.getElementById("rappl").value;
  document.getElementById("oss1").innerText = document.getElementById("oss").value;
  openMenu('menuOre');
}


function copiaore(){
  salvadati();
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




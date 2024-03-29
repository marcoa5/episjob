var firebase = require('firebase');
require('firebase/storage');
require('firebase/auth');
require('firebase/database');
const { error } = require('console');

const firebaseConfig = {
  apiKey: "AIzaSyBtO5C1bOO70EL0IPPO-BDjJ40Kb03erj4",
  authDomain: "epi-serv-job.firebaseapp.com",
  databaseURL: "https://epi-serv-job-default-rtdb.firebaseio.com",
  projectId: "epi-serv-job",
  storageBucket: "epi-serv-job.appspot.com",
  messagingSenderId: "793133030101",
  appId: "1:793133030101:web:a79f477c42cb9e0a53a05c"
};

firebase.initializeApp(firebaseConfig);

var path = require('path').join(require('os').homedir(),'Documents','ServiceJobConfig','user.conf')
var path1 = require('path').join(require('os').homedir(),'Documents','ServiceJobConfig','emails.list')
var pathmol = require('path').join(require('os').homedir(),'Documents','ServiceJobConfig','mol.list')
var pathcus = require('path').join(require('os').homedir(),'Documents','ServiceJobConfig','cus.list')
var pathtech = require('path').join(require('os').homedir(),'Documents','ServiceJobConfig','tech.list')

function aggiornatech(){
  firebase.default.database().ref('Tech/').once('value', s=>{
    require('fs').writeFileSync(pathtech,JSON.stringify(s.val()))
  })
  .then(()=>{
    //loadtech(1)
  })
  .catch(err=>{
    //loadtech(1)
    console.log(err)
  })
}

async function aggiornamol(){

  firebase.default.database().ref('MOL/').once('value',sn=>{
    require('fs').writeFileSync(pathmol,JSON.stringify(sn.val()))
  })
  .then(()=>{
    loadMOL()
  })
  .catch(err=>{
    loadMOL()
    console.log(err)
  })
}

function loadtech(n){
  console.log(pathtech)
  if(pathtech!=''){
    var tech = require('fs').readFileSync(pathtech,'utf-8')
    $('#tec' + n).html('')
    $('#tec' + n).append(new Option('','none'))
    $.each(JSON.parse(tech), (a,i)=>{
      $('#tec' + n).append(new Option(a, a))
    })
  }
}

function aggiornacli(){
  firebase.default.database().ref('CustomerC').once('value',sn=>{
    require('fs').writeFileSync(pathcus,JSON.stringify(sn.val()))
  })
  .then(()=>{
    loadCus()
  })
  .catch(err=>{
    loadCus()
    console.log(err)
  })
}

function aggiornamails(){
  var path1 = require('path').join(require('os').homedir(),'Documents','ServiceJobConfig','emails.list')
  firebase.default.database().ref('mails/' + $('#user').text()).once('value', (snap)=>{
    if(snap.val()!=null) require('fs').writeFileSync(path1, snap.val())
  })
  .catch(err=>{
    if (err) throw error
  })
}

function aggiornaVue(){
  let t = require('fs').existsSync(__dirname + '/js/vue.min.js')
  if(!t){
    $.get('https://firebasestorage.googleapis.com/v0/b/epi-serv-job.appspot.com/o/vue.txt?alt=media&token=83452ed8-5b4f-4e22-bd7e-e3ef0516c96d',data=>{
      if(!require('fs').existsSync(__dirname + '/js/vue.min.js')) require('fs').createWriteStream(__dirname + '/js/vue.min.js')
      require('fs').writeFileSync(__dirname + '/js/vue.min.js',data)
      alert('l\'applicazione è stata aggiornata e la pagina verrà ricaricata')
      require('electron').remote.getCurrentWindow().reload()
    })
  }
}

var eye = true

function hideP(){
  if(eye){
    $('.eye').attr('src','img/login/off.svg')
    $('#pass').attr('type', 'text')
    eye=!eye
  } else {
    $('.eye').attr('src','img/login/on.svg')
    $('#pass').attr('type', 'password')
    eye=!eye
  }
}

function able(){
  var mail = $('#usermail').val()
  var pass = $('#pass').val()
  if(mail && pass){
    $('.loginPulsante').prop('disabled', false)
  } else {
    $('.loginPulsante').prop('disabled', true)
  }
}

function goOn(e){
  if(e.key =='Enter'){fireLogin()}
}

function login(){
  var dir1= require('path').join(require('os').homedir(),'Documents','ServiceJobConfig')
  if(!require('fs').existsSync(dir1)){require('fs').mkdirSync(dir1)}

  var dir2 = os.tmpdir() + '\\ServiceJobTemp'
  if(!require('fs').existsSync(dir2)){require('fs').mkdirSync(dir2)}

  var dir3 = os.tmpdir() + '\\ServiceJob'
  if(!require('fs').existsSync(dir3)){require('fs').mkdirSync(dir3)}

  if(!pathtech) fs.createWriteStream(pathtech, { overwrite: false })
  if(!pathmol) fs.createWriteStream(pathmol, { overwrite: false })
  if(!pathcus) fs.createWriteStream(pathcus, { overwrite: false })

  if (!require('fs').existsSync(path)) {
    $('#logCont').show()
    $('#logCont').css('display', 'flex')
  } else {
    $('#salva').show()
    readConf()
  }
}

function fireLogin(){
  var mail = $('#usermail').val()
  var pass = $('#pass').val()
  firebase.default.auth().signInWithEmailAndPassword(mail,pass)
  .then(a=>{
    $('#logCont').hide()
    $('#salva').show()
    readRealTimeDB(a.user.uid, a.user.email)
  })
  .catch(error=>{
    console.error(error.message)
    $('.warn').css('color', 'red')
  })
}

function readRealTimeDB(id, eMail){
  firebase.default.database().ref('Users/' + id).once('value', async snapshot=>{
    var v= snapshot.val();
    v.Mail = eMail
    v.Id = id
    await require('fs').writeFileSync(path, JSON.stringify(v))
    firebase.default.database().ref(`mails/${v.Nome} ${v.Cognome}`).once('value', async mailList=>{
      if(mailList.val()!=null) {
        await require('fs').writeFileSync(path1,mailList.val())
      }
    })
    readConf()
  })
}


function readConf(){
  var user = JSON.parse(require('fs').readFileSync(path, 'utf-8'))
  Object.keys(user).forEach(key=>{
    $('#user' + key.substring(0,1).toUpperCase()).text(user[key])
  })
  //COEFFICIENTE KILOMETRICO STD
  $('#userK').text('0.07')
  var a = $('#userP').text()
  if(a=='admin'){ipcRenderer.send('attmenu');}
  if(a=='SU'){ipcRenderer.send('attmenu');ipcRenderer.send('attSU');}
  $('#user').text(`${$('#userN').text()} ${$('#userC').text()}`)
  aggiornamails()
  caricaMails()
  var t= $('#userI').text()
  /*if(t){
    firebase.default.database().ref('Users/'+t).child('km').set($('#userK').text())
  }*/
}

function writeSign(sig){
  var c
  var path = require('path').join(require('os').homedir(),'Documents','ServiceJobConfig','user.conf')
  var a = require('fs').readFileSync(path, 'utf-8')
  var b = JSON.parse(a)
  b.Sign = sig
  require('fs').writeFileSync(path, JSON.stringify(b))
}


async function loadMOL(){
  var mol = require('fs').readFileSync(pathmol,'utf-8')
  $('#listam tr').remove();
  var i = 1
  $.each(JSON.parse(mol), (sn,v)=>{
    var stringa= '<tr id=' + 'ele' + i + ' onclick="copia(' + "'" + 'ele' + i + "'" + ')">';
				stringa += '<td id="ele' + i + 'sn">' + v.sn + '</td>';
				stringa += '<td id="ele' + i + 'customer">' + v.customer + '</td>';
				stringa += '<td id="ele' + i + 'model">' + v.model + '</td>';
				stringa += '<td id="ele' + i + 'site">' + v.site + '</td>';
				stringa += '</tr>';
        $('#listam').append(stringa);
        i++
        sortSUTable(0,'listam')
  })
  
}

function loadCus(){
  $('#elencoC').text(require('fs').readFileSync(pathcus,'utf-8'))
}

function copia(a){
  $('#matricolas').val($('#' + a + 'sn').text())
  $('#myinput').val($('#' + a + 'sn').text())
  $('#prodotto').val($('#' + a + 'model').text())
  $('#cliente').val($('#' + a + 'customer').text())
  $('#cantiere').val($('#' + a + 'site').text())
  indirizzo_cliente();
  myFunction();
}

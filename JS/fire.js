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


function aggiornatech(){
  firebase.storage().ref('techupd.txt').getDownloadURL().then(function(url) {
    $.get(url, (data)=> {
			fs.writeFileSync(__dirname + "\\tech.txt", data)
		})
  })
  .catch(err=>{
    console.log('ERROR: ' + err)
  })
}

function aggiornamol(){
  firebase.storage().ref('molupd.txt').getDownloadURL().then(function(url) {
    $.get(url, (data)=> {
			fs.writeFileSync(__dirname + "\\mol.txt", data)
		})
  })
  .catch(err=>{
    console.log('ERROR: ' + err)
  })
}

function aggiornacli(){
  firebase.storage().ref('customersupd.txt').getDownloadURL().then(function(url) {
    $.get(url, (data)=> {
			fs.writeFileSync(__dirname + "\\customers.txt", data)
		})
  })
  .catch(err=>{
    console.log('ERROR: ' + err)
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

var eye = true
var path = require('path').join(require('os').homedir(),'Documents','ServiceJobConfig','user.conf')
var path1 = require('path').join(require('os').homedir(),'Documents','ServiceJobConfig','emails.list')
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
    $('.loginPulsante').attr('disabled', true)
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

  var path = require('path').join(require('os').homedir(),'Documents','ServiceJobConfig','user.conf')
  require('fs').readFile(path, 'utf-8',(a,b)=>{
    if (a) {
      console.log(a)
      $('#logCont').show()
      $('#logCont').css('display', 'flex')
    } else {
      $('#salva').show()
      readConf()
    }
  })
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
    await require('fs').writeFileSync(path, JSON.stringify(v))
    firebase.default.database().ref(`mails/${v.Nome} ${v.Cognome}`).once('value', async mailList=>{
      if(mailList.val()!=null) await require('fs').writeFileSync(path1,mailList.val())
    })
    readConf()
  })
}


function readConf(){
  var user = JSON.parse(require('fs').readFileSync(path, 'utf-8')) 
  Object.keys(user).forEach(key=>{
    $('#user' + key.substring(0,1).toUpperCase()).text(user[key])
  })
  var a = $('#userP').text()
  if(a=='admin'){ipcRenderer.send('attmenu');}
  if(a=='SU'){ipcRenderer.send('attmenu');ipcRenderer.send('attSU');}
  $('#user').text(`${$('#userN').text()} ${$('#userC').text()}`)
  aggiornamails()
  caricaMails()
}

function writeSign(sig){
  var c
  var path = require('path').join(require('os').homedir(),'Documents','ServiceJobConfig','user.conf')
  var a = require('fs').readFileSync(path, 'utf-8')
  var b = JSON.parse(a)
  b.Sign = sig
  require('fs').writeFileSync(path, JSON.stringify(b))
}

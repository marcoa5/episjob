var firebase = require('firebase');
var storage = require('firebase/storage');
var auth = require('firebase/auth');
var database = require('firebase/database');
const { error } = require('console');

const firebaseConfig = {
  apiKey: "AIzaSyCKS9waoMAR6NjpDZIMeaL4GezqqGgvxRs",
  authDomain: "epi-s-job.firebaseapp.com",
  databaseURL: "https://epi-s-job.firebaseio.com",
  projectId: "epi-s-job",
  storageBucket: "epi-s-job.appspot.com",
  messagingSenderId: "32439813654",
  appId: "1:32439813654:web:3d930228f8509fe2fb1737"
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

var eye = true
var path = require('path').join(require('os').homedir(),'Documents','ServiceJobConfig','user.conf')

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
    readRealTimeDB(a.user.uid)
  })
  .catch(error=>{
    console.error(error.message)
    $('.warn').css('color', 'red')
  })
}

function readRealTimeDB(id){
  firebase.database().ref('Users/' + id).once('value')
  .then(async snapshot=>{
    var v= snapshot.val()
    await writeConf(v)
    readConf()
  })
  .catch(err=>{
    console.log(err)
  })
}

function writeConf(user){
  require('fs').writeFileSync(path, JSON.stringify(user))
}

function readConf(){
  var user = JSON.parse(require('fs').readFileSync(path, 'utf-8')) 
  Object.keys(user).forEach(key=>{
    $('#user' + key.substring(0,1).toUpperCase()).text(user[key])
  })
  var a = `${user.Nome} ${user.Cognome}`
  if(a=="Marco Arato" | a=="Marco Fumagalli" | a=="Nicolo Tuppo" | a=="Mario Parravicini" | a=="Carlo Colombo"){ipcRenderer.send('attmenu');}
  $('#user').text(a)
}

function writeSign(sig){
  var c
  var path = require('path').join(require('os').homedir(),'Documents','ServiceJobConfig','user.conf')
  var a = require('fs').readFileSync(path, 'utf-8')
  var b = JSON.parse(a)
  b.Sign = sig
  require('fs').writeFileSync(path, JSON.stringify(b))
}


/*
function loginFire(){
  var dir1= require('path').join(require('os').homedir(),'Documents','ServiceJobConfig')
  if(!require('fs').existsSync(dir1)){require('fs').mkdirSync(dir1)}

  var dir2 = os.tmpdir() + '\\ServiceJobTemp'
  if(!require('fs').existsSync(dir2)){require('fs').mkdirSync(dir2)}

  var dir3 = os.tmpdir() + '\\ServiceJob'
  if(!require('fs').existsSync(dir3)){require('fs').mkdirSync(dir3)}


  var mail = $('#usermail').val()
  var pass = $('#pass').val()
  firebase.auth().signInWithEmailAndPassword(mail,pass)
  .then(a=>{
    $('#salva').show()
    $('#logCont').hide()
    getUserData(a.user.uid)
  })
  .catch(err=>{
    console.error(err.message)
    $('.warn').css('color', 'red')
  })
  
}

function getUserData(id){
  firebase.default.database().ref('Users/' + id).once('value',data=>{
    var a = data.val()
    if(a.Sign){var si = a.Sign} else {var si = ''}
    var info = {Nome: a.Nome, Cognome: a.Cognome, Mail:a.Mail, Pos:a.Pos, Sign:si}
    var path = require('path').join(require('os').homedir(),'Documents','ServiceJobConfig','user.conf')
    fs.writeFileSync(path, JSON.stringify(info))
    $('#user').text(info.Nome + ' ' + info.Cognome)
    writeUserData(a.Nome,a.Cognome,a.Mail,a.Pos,a.Sign)
  })
}

function chLogin(){
  var path = require('path').join(require('os').homedir(),'Documents','ServiceJobConfig','user.conf')
  require('fs').readFile(path, 'utf-8',(a,b)=>{
    if (a) {
      $('.login').show()
      $('#salva').hide()
    } else {
      $('.login').hide()
      $('#salva').show()
      var c = JSON.parse(b)
      writeUserData(c.Nome,c.Cognome,c.Mail,c.Pos,c.Sign)
    }
    
  })
}

function writeUserData(N,C,M,P,S){
  $('#userN').text(N)
  $('#userC').text(C)
  $('#userP').text(P)
  $('#userM').text(M)
  $('#userS').text(S)
  var a = N + ' ' + C
  if(a=="Marco Arato" | a=="Marco Fumagalli" | a=="Nicolo Tuppo" | a=="Mario Parravicini" | a=="Carlo Colombo"){ipcRenderer.send('attmenu');}
  if(S){$('#firmatt1').attr('src',S)}
  $('#user').text(N +' ' +C)
}

function writeSign(sig){
  var c
  var path = require('path').join(require('os').homedir(),'Documents','ServiceJobConfig','user.conf')
  var a = require('fs').readFileSync(path, 'utf-8')
  var b = JSON.parse(a)
  b.Sign = sig
  require('fs').writeFileSync(path, JSON.stringify(b))
}

function goOn(e){
  if(e.key =='Enter'){loginFire()}
}*/
var firebase = require('firebase');
var storage = require('firebase/firebase-storage');

var firebaseConfig = {
    apiKey: "AIzaSyCUEh7I9hVCBNIqYTlw-GraIa_fwjcGQrA",
    authDomain: "epi-service-job.firebaseapp.com",
    databaseURL: "https://epi-service-job-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "epi-service-job",
    storageBucket: "epi-service-job.appspot.com",
    messagingSenderId: "604272791108",
    appId: "1:604272791108:web:dd4e4325d527e064f03611",
    measurementId: "G-RY0TXPGRSB"
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

function aggiornacode(){
  firebase.storage().ref('command.js').getDownloadURL().then(function(url) {
    $.get(url, (data)=> {
			fs.writeFileSync(__dirname + "\\js\\command.js", data);
		})
  })
  .catch(err=>{
    console.log('ERROR: ' + err)
  })
}

function aggiornaSL(){
  firebase.storage().ref('SL.html').getDownloadURL().then(function(url) {
    $.get(url, (data)=> {
      fs.writeFileSync(__dirname + "\\SL.html", data);
	})
  })
  .catch(err=>{
    console.log('ERROR: ' + err)
  })
}
var firebase = require('firebase');
var storage = require('firebase/firebase-storage');

var firebaseConfig = {
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
			fs.writeFileSync(process.argv[5].substring(11) + "\\tech.txt", data)
		})
  });
}

function aggiornamol(){
  firebase.storage().ref('molupd.txt').getDownloadURL().then(function(url) {
    $.get(url, (data)=> {
			fs.writeFileSync(process.argv[5].substring(11) + "\\mol.txt", data)
		})
  });
}

function aggiornacli(){
  firebase.storage().ref('customersupd.txt').getDownloadURL().then(function(url) {
    $.get(url, (data)=> {
			fs.writeFileSync(process.argv[5].substring(11) + "\\customers.txt", data)
		})
  });
}

function aggiornacode(){
  firebase.storage().ref('command.txt').getDownloadURL().then(function(url) {
    $.get(url, (data)=> {
			fs.writeFileSync(process.argv[5].substring(11) + "\\js\\command.js", data);
		})
  });
}

function aggiornaSL(){
  firebase.storage().ref('SL.txt').getDownloadURL().then(function(url) {
    $.get(url, (data)=> {
      fs.writeFileSync(process.argv[5].substring(11) + "\\SL.html", data);
	    remote.getCurrentWindow().reload(); 
		})
  });
}
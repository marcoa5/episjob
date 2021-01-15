async function createEconf(nomeF,subject, to1, son1, son2, son3,rap, rAss, userN, userC, userM){
    var dati = [{subject: subject, to1 : to1, son1: son1, son2:son2, son3:son3, rap:rap, rAss:rAss, userN:userN,userC:userC,userM:userM}];
	addMail(to1)
	require('fs').writeFileSync(nomeF,JSON.stringify(dati))
	
}

var path1 = require('path').join(require('os').homedir(),'Documents','ServiceJobConfig','emails.list')

async function addMail(to){
	console.log(to)
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
	var n = require('path').basename(nome)
	await $.get(nome + '.econf', dati=>{
		var t = JSON.parse(dati)[0]
		t['urlPdf'] = urlPdf
		t['urlMa'] = urlMa
		t['fileN'] = n
		const url = 'https://episjobreq.herokuapp.com/mail'
		var request = $.ajax({
			url: url,
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
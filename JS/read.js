

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
    myFunction();
}


//salva
function salvafile(){
    var ora = new Date()
    var anno = ora.getFullYear().toString();
    var mese = (ora.getMonth()+1).toString();
    var giorno = ora.getDate().toString();
    var hr = ora.getHours().toString();
    var mi = ora.getMinutes().toString();
    var se = ora.getSeconds().toString();
    var datalo = anno.padStart(4,'0')+mese.padStart(2,'0')+giorno.padStart(2,'0')+hr.padStart(2,'0')+mi.padStart(2,'0')+se.padStart(2,'0');
    
    var cli = document.getElementById('cliente1').innerText;
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
         {name: 'Scheda Lavoro', extensions: ['ma']},
        ]
       }
    
    

    
    var cartella =  dialog.showSaveDialogSync(options, "");
    if(cartella!==undefined){
        var s = document.getElementById('salva').innerHTML;           
        fs.writeFile(cartella, s, function(err) {
            if(err) {
                return console.log(err);
            }
        });
    }
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
        
        var filename =  "blank.ma"
        if(filename!==undefined){
            $.get(filename, function(data) {
                /*console.log(data)
                document.getElementById('salva').innerHTML = ""*/
                document.getElementById('salva').innerHTML = data
                $('#menuMatricola').draggable();
                $('#menuRapporto').draggable();
                $('#menuOre').draggable();
            })}
        
            closeMenu();
    
        }
    
function ver_pulisci(){
            if (confirm('Vuoi eliminare i dati non salvati?')) {
                pulisci();
                closeMenu();
            } else {
                closeMenu();
            }
        }
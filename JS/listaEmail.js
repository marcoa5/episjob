var path1 = require('path').join(require('os').homedir(),'Documents','ServiceJobConfig','emails.list')

function caricaMails(){
    if(require('fs').existsSync(path1)){
        $('#elencoM').text(require('fs').readFileSync(path1,'utf-8'))
    } else { 
        $('#elencoM').text('')
    }
}


async function listaEmail(e){
    var mails = $('#elencoM').text().split(";")
    var valore = e.target.value
    var matches = mails.filter((stackValue)=>{
        if(stackValue && valore) {
            $('#listaMai').show()
            return (stackValue.substring(0, valore.length) === valore)
        } else {
            //$('#listaMai').hide()
            return []
        }
      })
    if (matches.length==0 || valore==''){$('#listaMai').hide()}
    var m = await matches.map((a)=>{
        return '<li class="elM" onclick="addEmail(event)">' + a + '</li>'
    })
    var el = `<ul class="mUl">${m.join('')}</ul>`
    $('#listaMai').html(el)
}

function addEmail(e){
    $('#indmail').val(e.target.innerText)
    $('#listaMai').hide()
    nuovamail()
}



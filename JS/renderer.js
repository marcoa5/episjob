var remote = require('electron').remote;
var fs = require('fs');

function printpdf () {
  const tmp = require('tmp')
  tmp.dir(async (err, path, cleanupCallback) => {
    remote.getCurrentWindow().webContents.printToPDF({
      pageSize: 'A4', marginsType: '0'
    }).then(data => {
      fs.writeFileSync(path + "\\test.pdf", data, (err) => {
        if (err) throw err
        send_mail();
      })
      send_mail(path)
    }
    
    )
})

      


    }

    function send_mail(a) {     
      var path = require('path');
      var loc = window.location.pathname; 
      var dir = path.dirname(loc);
      var winax = require('winax'); 
      var objO = new ActiveXObject('Outlook.Application');     
      var objNS = objO.GetNameSpace('MAPI');     
      var mItm = objO.CreateItem(0);     
      mItm.Display();    
      mItm.To = 'xxx.xxx@epiroc.com';
      mItm.Subject = "Prova";
      mItm.Body = "Email di prova";
      mItm.Attachments.Add(a + '\\test.pdf');    
      mItm.GetInspector.WindowState = 2;
      //mItm.send();
    }

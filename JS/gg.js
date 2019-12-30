function oggi(){
            n =  new Date();
            y = n.getFullYear();
            m = n.getMonth() + 1;
            d = n.getDate();
            document.getElementById("data1").value = y + "-" + m + "-" + d;
            controlladata();
        }



        function aggiungi() {
            const options = {
                type: 'error',
                buttons: ['OK'],
                title: 'Errore',
                message: 'Massimo 7 giorni',
              };
            var riga = document.getElementById('ris').getElementsByTagName('tr');
            var ind = riga.length;
            //verifica che le righe siano < 7
            if(ind<=6){    
                var parts = document.getElementById("data1").value.toString().split("-");
                var mydate = parts[0]+ parts[1]+ parts[2]; 
                document.getElementById('ris').appendChild(document.createElement("TR"));
                var ele = [document.getElementById('tec').value, mydate];
                //controlla le festività
                var fest = verificadata(document.getElementById('data1').value);
                //copia tutti gli elementi "ore"
                var orr = document.getElementsByClassName('ore');
                //aggiunge le ore all'array ele
                for(t=0;t<orr.length;t++){ele.push(orr[t].value)};
                //crea l'indice di riga nella prima colonna
                var n = document.createElement('TD');
                var t = document.createTextNode(ind+1);
                document.getElementById('ris').getElementsByTagName('tr')[ind].appendChild(n);
                n.appendChild(t); 
                //aggiunge tutti gli elementi contenuti in 'ele' all'interno della tabella 'ris'   
                for(var i=0; i<ele.length;i++){
                    n = document.createElement('TD');
                    var t = document.createTextNode(ele[i]);
                    if(i>1){
                        var att = document.createAttribute("class");
                        att.value= "ores";
                        n.setAttributeNode(att);}
                    n.appendChild(t);
                    document.getElementById('ris').getElementsByTagName('tr')[ind].appendChild(n);
                }
                //aggiunge l'elimina riga
                var n = document.createElement('TD');
                var t = document.createTextNode("Elimina riga");
                n.appendChild(t);
                att = document.createAttribute("class");
                att.value="elim";
                n.setAttributeNode(att);
                att = document.createAttribute("onClick");
                att.value="cancella(this.parentNode.rowIndex)";
                n.setAttributeNode(att);
                document.getElementById('ris').getElementsByTagName('tr')[ind].appendChild(n);
                //canella le ore
                clearore();
                sortTable();
                var numrig = document.getElementById('ris').getElementsByTagName('tr');
                for(var z=0;z<numrig.length;z++){
                    numrig[z].getElementsByTagName('td')[0].innerText = z+1;
                }             
            } else {dialog.showMessageBox(null, options);}
            
        }


        function cancella(n){
                document.getElementById('ris').getElementsByTagName('tr')[n].remove();
                var a1a = document.getElementById('ris').getElementsByTagName('tr');
                var inc = 1;
                for (var y=0;y<a1a.length;y++){
                    a1a[y].getElementsByTagName('td')[0].innerText=inc;
                    inc++;
                }
            }


        function eliminatutto(){
            var nrrighe = document.getElementById('ris').getElementsByTagName('tr');
            if(nrrighe.length>0){
                    var g = document.getElementById('ris').getElementsByTagName('tr');
                    for (var y=g.length - 1;y>-1;y--){
                        g[y].remove();
                    }
                }
            }
            
        function clearore(){
            var or = document.getElementsByClassName('ore');
            for(var i=0;i<or.length;i++){or[i].value="";}
        }


        function sortTable() {
            var table, rows, switching, i, x1, x, y, shouldSwitch;
            table = document.getElementById("ris");
            switching = true;
            /*Make a loop that will continue until
            no switching has been done:*/
            while (switching) {
              //start by saying: no switching is done:
              switching = false;
              rows = table.rows;
              /*Loop through all table rows (except the
              first, which contains table headers):*/
              for (i = 0; i < (rows.length-1); i++) {
                //start by saying there should be no switching:
                shouldSwitch = false;
                /*Get the two elements you want to compare,
                one from current row and one from the next:*/
                x = rows[i].getElementsByTagName("TD")[2].innerText;
                y = rows[i + 1].getElementsByTagName("TD")[2].innerText;
                //check if the two rows should switch place:
                if (x.toLowerCase() > y.toLowerCase()) {
                  //if so, mark as a switch and break the loop:
                  shouldSwitch = true;
                  break;
                }
              }
              if (shouldSwitch) {
                /*If a switch has been marked, make the switch
                and mark that a switch has been done:*/
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
              }
              
            }
          }
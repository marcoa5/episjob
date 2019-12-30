

function verificadata(g){
    var feste = ["01-01", "06-01", "04-25", "05-01", "06-02", "08-15", "08-16", "11-01", "12-07", "12-08", "12-24", "12-25", "12-26", "12-31"];
    var dd = new Date(g);
    var pasqua = Easter(g.substring(0,4));
    var gpasquetta = pasqua.substring(3,5)+1;
    var pasquetta =  pasqua.substring(0,3) + padout(pasqua.substring(3,5)*1+1);
    feste.push(pasqua, pasquetta);
    var wd = dd.getDay();
    var fest = false
    if(wd==0){fest="fest"}
    else if(wd==6){fest="sab"}
    else {fest = "fer"};
    var test = padout(dd.getMonth()+1) + "-" + padout(dd.getDate());
    feste.forEach(function(el){if(el==test){fest="fest"}});
    return fest;
}    


     


function Easter(Y) {
    var C = Math.floor(Y/100);
    var N = Y - 19*Math.floor(Y/19);
    var K = Math.floor((C - 17)/25);
    var I = C - Math.floor(C/4) - Math.floor((C - K)/3) + 19*N + 15;
    I = I - 30*Math.floor((I/30));
    I = I - Math.floor(I/28)*(1 - Math.floor(I/28)*Math.floor(29/(I + 1))*Math.floor((21 - N)/11));
    var J = Y + Math.floor(Y/4) + I + 2 - C + Math.floor(C/4);
    J = J - 7*Math.floor(J/7);
    var L = I - J;
    var M = 3 + Math.floor((L + 40)/44);
    var D = L + 28 - 31*Math.floor(M/4);

    return padout(M) + '-' + padout(D);
}

function padout(number) { return (number < 10) ? '0' + number : number; }




var a1= {
    it: 'Scheda Lavoro',
    en: 'Service Job'
}

 var a2={
    it: 'COMMESSA',
    en:'SERVICE JOB NR'
}

var a3={
    it:'VS. ORDINE',
    en:'ORDER NR.'
}
var a4={
    it:'NS. OFFERTA',
    en:'OFFER NR.'
}

var a5={
    it:'PRODOTTO',
    en:'MACHINE'
}

var titolo={
    it: 'Epiroc Italia S.r.l. - Service Job',
    en: 'Epiroc Hellas SA - Service Job'
}

var a6={
    it:'MATRICOLA',
    en:'SERIAL NR.'
}
var a7={
    it:'ORE MOTORE',
    en:'ENGINE HRS'
}

var a8={
    it:'ORE PERCUSSIONE',
    en:'PERCUSSION HRS'
}

var a9={
    it:'PAGINA',
    en:'PAGE'
}

var a10={
    it:'1 di 1',
    en:'1 of 1'
}

var a11={
    it:'CLIENTE',
    en:'CUSTOMER'
}

var a12={
    it:'CANTIERE',
    en:'SITE'
}

var a13={
    it: 'RAPPORTO LAVORO',
    en: 'SERVICE REPORT'
}

var a14={
    it: 'OSSERVAZIONI',
    en: 'COMMENTS'
}

var a15={
    it: 'TECNICO',
    en: 'TECHNICIAN'
}

var a16={
    it:'STANDARD',
    en:'STANDARD'
}

var legal={
    it:`<strong style="font-size: 6pt">
            Epiroc Italia Srl
        </strong>
        <br>
            Cap. Soc. EUR 1.000.000,00 int. vers.
        <br>
            Sede legale e amministrativa
        <br>
            Via Galileo Galilei, 40 - 20092 Cinisello B.mo (MI) - Telefono 02 6606731
        <br>
            Reg. Impr. di MI, C.F. e P. IVA 09938280964- R.E.A. MI-2123103
        <br>
            epiroc.it
        `,
    en: `<strong style="font-size: 6pt">
            Epiroc Hellas SA
        </strong>
        <br>
            Cap. Soc. EUR 1.000.000,00 int. vers.
        <br>
            Sede legale e amministrativa
        <br>
            Via Galileo Galilei, 40 - 20092 Cinisello B.mo (MI) - Telefono 02 6606731
        <br>
            Reg. Impr. di MI, C.F. e P. IVA 09938280964- R.E.A. MI-2123103
        <br>
            epiroc.it
        `
    }
var date = {
    it:'DATA',
    en:'DATE'
}

var spec = {
    it:'SPECIALISTICA',
    en:'???'
}

var mnt = {
    it:'MNT',
    en:'???'
}

var mf = {
    it:'MF',
    en:'??'
}

var mnf = {
    it:'MNF',
    en:'???'
}

var km ={
    it:'KM',
    en:'KM'
}
 var spv={
    it:'SPV',
    en:'???'
}

var off ={
    it:'OFF',
    en:'???'
}

var ofs={
    it:'OFS',
    en:'???'
}

var spo ={
    it:'SPO',
    en:'???'
}

var sps={
    it:'SPS',
    en:'???'
}

var std = {
    it:'STD',
    en:'???'
}

var str = {
    it:'STR',
    en:'???'
}

var gg = {
    it:'GG',
    en:'DD'
}

var mm = {
    it:'MM',
    en:'MM'
}

var aa = {
    it:'AA',
    en:'YY'
}
var v = {
    it:'V',
    en:'T'
}
var l = {
    it:'L',
    en:'J'
}

var stdhrs={
    it: '(08.00-17.00)',
    en: '(8am - 5pm)'
}

var othrs = {
    it:'(06.00-08.00 e 17.00-22.00) - Sabato (06.00-22.00)',
    en:'(6am - 8am & 5pm - 10pm) - Saturday (6am - 10pm)'
}

var nhrs= {
    it:'(22.00-06.00)',
    en:'(10pm - 6am)'
}

var fhrs = {
    it:'(06.00-22.00)',
    en:'(6am - 10pm)'
}

module.exports.doc_title = titolo
module.exports._10=legal
module.exports._20 = a1
module.exports._30 = a2
module.exports._40 =a3
module.exports._50 =a4
module.exports._60 =a5
module.exports._70 =a6
module.exports._80 =a7
module.exports._90 =a8
module.exports._100 =date
module.exports._110 =a9
module.exports._120 =a10
module.exports._130 =a11
module.exports._140 =a12
module.exports._150 = a13
module.exports._160 = a14
module.exports._170 = a15
module.exports._180 = date
module.exports._190 =spec
module.exports._200 =a16
module.exports._210 =mnt
module.exports._220 =mf
module.exports._230 =mnf
module.exports._240 =km
module.exports._250 =spv
module.exports._260 =off
module.exports._270 =ofs
module.exports._280 =spo
module.exports._290 =sps
module.exports._300 =std
module.exports._310 =str
module.exports._320 =gg
module.exports._330 =mm
module.exports._340 =aa
module.exports._350 =v
module.exports._360 =l
module.exports._370 =v
module.exports._380 =l
module.exports._390 =v
module.exports._400 =l
module.exports._410 =v
module.exports._420 =l
module.exports._430 =v
module.exports._440 =l
module.exports._450 =v
module.exports._460 =l
module.exports._470 =v
module.exports._480 =l
module.exports._490 = {
    it: 'RIFERIMENTI',
    en: 'REFERENCES'
}

module.exports._500 = spo
module.exports._510 = {
    it:'Manodopera Specialistica Ordinaria',
    en: '???'
}

module.exports._520 = stdhrs

module.exports._530 = km
module.exports._540 = {
    it: 'Chilometri',
    en: 'Kilometers'
}

module.exports._550 = sps
module.exports._560 = {
    it:'Manodopera Specialistica Straordinaria',
    en:'???'
}
module.exports._570 = othrs

module.exports._580= spv
module.exports._590 = {
    it: 'Spese viaggio',
    en: 'Travel expenses'
}
module.exports._600=std
module.exports._610={
    it:'Manodopera Standard',
    en:'Standard Labor'
}

module.exports._620 = stdhrs

module.exports._630 = off
module.exports._640 = {
    it : 'Manodopera Officina',
    en: 'Workshop Labor'
}
module.exports._650 = stdhrs
module.exports._660 = str
module.exports._670 = {
    it: 'Manodopera Straordinaria',
    en: 'Overtime Labor'
}
module.exports._680 = othrs
module.exports._690 = ofs
module.exports._700 = {
    it: 'Manodopera Officina Straordinaria',
    en: 'Overtime Workshop Labor'
}
module.exports._710=othrs
module.exports._720=mnt
module.exports._730= {
    it:'Manodopera Notturna',
    en:'Night Labor'
}
module.exports._740 = nhrs
module.exports._750 = v
module.exports._760 = {
    it: 'Viaggio',
    en: 'Travel'
}
module.exports._770 = mf
module.exports._780 = {
    it:'Manodopera Festiva',
    en: 'Holyday Labor'
}
module.exports._790 = fhrs
module.exports._800 = l
module.exports._810 = {
    it:'Lavoro',
    en: 'Job'
}
module.exports._820 = mnf
module.exports._830={
    it:'Manodopera Festiva Notturna',
    en:'Holyday Night Labor'
}
module.exports._840 = nhrs
module.exports._850 = {
    it:'FIRMA TECNICO',
    en:'TECHNICIAN SIGNATURE'
}
module.exports._860 = {
    it:'FIRMA CLIENTE',
    en:'CUSTOMER SIGNATURE'
}

module.exports._870 = {
    it:'APERTURA BPCS',
    en:'???'
}
module.exports._880 = {
    it:'CHIUSURA BPCS',
    en:'???'
}
module.exports._890 = {
    it:'DOCUMENTO BPCS',
    en:'???'
}
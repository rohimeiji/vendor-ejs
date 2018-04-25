// Initial Service Worker
if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker
        .register(base_url+'/sw.js')
        .then(function () { console.log('Service Worker Registered'); });
}
// Extension
var objectToQuery = function (obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}
String.prototype.queryToObject = function(){
    query = this.replace("?", "").replace(/\+/g, ' ').split("&");
    query = query.map((a) => { return a += a.indexOf("=") == -1 ? "=" : "" }).join("&");
	if(!query) return {};
	return JSON.parse('{"' + decodeURIComponent(query).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
}
Number.prototype.sigFig = function($sigFigs = 3) {
    $exponent = Math.floor(Math.log10(Math.abs(this))+1);
    $significand = Math.round((this
        / Math.pow(10, $exponent))
        * Math.pow(10, $sigFigs))
        / Math.pow(10, $sigFigs);
    return $significand * Math.pow(10, $exponent);
}
String.prototype.toValue = function(origin="id"){
    if(origin=="en") return parseFloat(this.toString().replace(/\,+/g,""));
    return parseFloat(this.toString().replace(/\.+/g, "").replace(/\,+/g,"."));
}
Number.prototype.toValue = function(origin="id"){
    return parseFloat(this);
}
Number.prototype.currency = function($sigFigs = 3){
    //SI prefix symbols
    if(!this)return;
    $units = ['', ' RB', ' JT', ' M', ' T', ' P', ' E'];
    $index = Math.floor(Math.log10(this)/3);
    value = $index ? this/Math.pow(1000, $index) : this;
    return Math.round(value.sigFig($sigFigs)) + $units[$index];
}
String.prototype.currency = function ($sigFigs = 3) {
    return parseFloat(this.toString()).currency($sigFigs)
}
Number.prototype.bytesToSize = function(){
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (this == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(this) / Math.log(1024)));
    return Math.round(this / Math.pow(1024, i), 2) + ' ' + sizes[i];
}
String.prototype.bytesToSize = function () {
    return parseInt(this).bytesToSize();
}
String.prototype.inArray = function (array) {
    return array.indexOf(this.toString())!=-1;
}
Number.prototype.inArray = function(array){
    return this.toString().inArray(array);
}
Number.prototype.format = function(fractionDigit = 0, country = "id"){
    if(["","NaN","0"].indexOf(this.toString()) > -1) return 0;
    return new Intl.NumberFormat(country=="id"?"id-ID":"en-US",{maximumFractionDigits:fractionDigit}).format(this);
}
String.prototype.format = function(fractionDigit = 0, country = "id"){
    return parseFloat(this.toString()).format(fractionDigit, country);
}
Number.prototype.round = function(digits=0){
    if(["","NaN","0"].indexOf(this.toString()) > -1) return 0;
    return Math.round(parseFloat(this.toString()) * Math.pow(10, digits)) / Math.pow(10, digits);
}
String.prototype.round = function(digits=0){
    return parseFloat(this.toString()).round(digits);
}
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
}
String.prototype.htmlDecode = function(){
    if(this=="") return "";
  var e = document.createElement('div');
  e.innerHTML = this;
  return e.childNodes[0].nodeValue;
}
String.prototype.toSlug = function(){
    return this.toString().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}
String.prototype.date = function(format){
    m = moment(this.toString());
    if(format) return m.format(format);
    return m;
}
String.prototype.limitChar = function(limit){
    return this.toString().slice(0, limit) + (this.toString().length > limit ? "..." : "");
}
String.prototype.addRule = function(rule){
    var a = this.toString().split("|");
    if(a.indexOf(rule)==-1)a.push(rule);
    a.map((v,k)=>{ if(!v) a.splice(k,1) });
    return a.join("|");
}
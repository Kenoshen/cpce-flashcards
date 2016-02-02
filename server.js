var port = 6127
process.argv.forEach(function (val, index, array) {
  console.log("val: " + val);
	if(index === 2 && val){
    try{
		    var temp = parseInt(val)
        if (temp) port = temp
    } catch (e) {}
	}
});
console.log("=======================");
console.log("  CPCE Study Server");
console.log("=======================");
// requires
var express = require('express');
var app = express();
var vhost = require("vhost");
var bodyParser = require("body-parser");

// /////////////////////////////////////////////////////
// local requires
var cpce = require("./server/serverApp.js");
function setup(){
	// set up virtual hosts
	//var vhost = createVHost(app, "dev.bytebreakstudios.com", "CPCE->", "www");
  cpce(app);
}
//
///////////////////////////////////////////////////////
// log helper
function dateToStr(d) {
	return (((d.getUTCMonth()+1) < 10)?"0":"") + (d.getUTCMonth()+1) +"/" +
	((d.getUTCDate() < 10)?"0":"") + d.getUTCDate() +"/"+ d.getUTCFullYear() + " " +
	((d.getUTCHours() < 10)?"0":"") + d.getUTCHours() +":"+
	((d.getUTCMinutes() < 10)?"0":"") + d.getUTCMinutes() +":"+
	((d.getUTCSeconds() < 10)?"0":"") + d.getUTCSeconds() + "." +
	((d.getUTCMilliseconds() < 100) ? (d.getUTCMilliseconds() < 10 ? "00" : "0") : "") + d.getUTCMilliseconds() + " GMT";
}
console.log(dateToStr(new Date()));
// logging
function logging(prefix){
	var f = function(req, res, next){
		var startTime = new Date();
		res.on('finish', function(){
			var status = res.statusCode;
			var responseTime = (new Date() - startTime);
			console.log(prefix + dateToStr(startTime) + ": " + req.method + " " + req.hostname + req.originalUrl + " (" + status + ":" + responseTime + ")");
		});
		next();
	};
	return f;
}
// access control headers
app.use(function (req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', '*');
	res.header('Access-Control-Allow-Headers', '*');

	next();
});
var sites = [];
// create the virtual hosts
function createVHost(app, host, prefix, location){
	var tempApp = express();
	tempApp.use(bodyParser.json({limit: "50mb"}));
	tempApp.use(logging(prefix));
	tempApp.use(express.static(__dirname + "/" + location));
	tempApp.use("/public", express.static(__dirname + "/public"));
	app.use(vhost(host, tempApp));
	return tempApp;
}
// safe send file
function safeSendFile(res, filePath){
	res.sendFile(path.resolve(__dirname + filePath));
}
//
app.use(logging("A->"));
//
setup();
// ////////////////////////////////////////////////
//  START UP SERVER
// ////////////////////////////////////////////////
// return errors
app.on("error", function(req, res, next){
	console.log("Error: " + req.originalUrl);
	res.status(500).send({});
});
// start up server
app.listen(port, function(){
  console.log("Server listening on port: " + port);
});

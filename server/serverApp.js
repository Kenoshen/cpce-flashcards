module.exports = function (vHost){
	var express = require("express");
	//var mongoose = require('mongoose');
	//var mongoDBName = "wingfield";
	//// local requires
	//var study = require('./study');
	//// study calls
	//study.use("/study", vHost);
	////
	//// establish connection to mongoDB
	//mongoose.connect('mongodb://localhost/' + mongoDBName);
	//var db = mongoose.connection;
	//// show error if start up failed
	//db.on('error', console.error.bind(console, 'connection error:'));
	//// when connection to mongoDB starts, start up web-server
	//db.once('open', function callback(){
	//	console.log("Connected to MongoDB: " + mongoDBName);
	//});

	function staticFileLocation(url, location){
		//cssVar(vHost, {root: __dirname + location})
		vHost.use(url, express.static(__dirname + location));
	}
	staticFileLocation("/study", "./../www");
	staticFileLocation("/public", "./../node_modules");
};

var express = require('express');
var connect = require('connect');
var sendfile = require(__dirname + "/sendfile.js");
var app1 = express.createServer();
var app2 = express.createServer();
var app3 = express.createServer();

/**
 * First application uses connect's static file server
 */
app1.use(express.static(__dirname + "/test"));

/**
 * Second application uses connect's static file server + memcache
 */
app2.use(connect.staticCache());
app2.use(express.static(__dirname + "/test"));

/**
 * Third application uses node-sendfile
 */
app3.use(sendfile(__dirname + "/test"));

app1.listen(process.argv[2] || 6001);
app2.listen(process.argv[3] || 6002);
app3.listen(process.argv[4] || 6003);
console.log("Static file servers are listening");
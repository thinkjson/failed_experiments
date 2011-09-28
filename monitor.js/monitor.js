// Import modules
var express = require('express');
var fs = require('fs');
var os = require('os');

// Create global object for monitor.js and load configuration
global.monitor = {};
monitor.config = {};
monitor.config.host = os.hostname();
monitor.config.login = 'admin:admin';
monitor.config.port = process.ARGV[2] || 7000;
monitor.config.auth_method = "basic";
monitor.config.time_to_reauthenticate = 500;

// Load monitor.js modules
monitor.app = express.createServer();
monitor.utils = require('./modules/utils.js');
monitor.auth = require('./modules/auth.js');

var plugins = {};
fs.readdir(__dirname + '/plugins', function(error, files) {
	
	// Load plugins (plugins CANNOT be aware of one another)
	monitor.config.plugins = [];
    if (files === undefined || error) {
        if (error) {
            console.error(error.message);
        }
            
        throw "Could not load plugins.";
    }
    
	for(var plugin_iterator = 0; plugin_iterator < files.length; plugin_iterator++) {
		// Determine module name from filename
		filename = files[plugin_iterator];
		plugin_name = filename.replace('.js', '');
		
		// Import plugin module
		plugins[plugin_name] = require(__dirname + "/plugins/" + filename);
		monitor.config.plugins.push(plugin_name);
		
		// Load route for plugin
		monitor.app.get('/' + plugin_name, 
				monitor.auth[monitor.config.auth_method], 
				plugins[plugin_name].get);
	}
});

// Load frontend
monitor.app.get("/", monitor.auth[monitor.config.auth_method], function(request, response) {
    response.sendfile(__dirname +"/frontend/index.html");
});

monitor.app.use(express['static'](__dirname + '/frontend'));

// Start server
monitor.utils.log("Web service listening on port " + monitor.config.port);
monitor.app.listen(monitor.config.port);
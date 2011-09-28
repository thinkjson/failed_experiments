// Imports and configuration
var express = require('express');
var fs = require('fs');
var app = express.createServer();
var nowjs = require(__dirname + "/now/lib/now.js");
var dashboard = nowjs.initialize(app);
var port = process.ARGV[2] || 15000;

/**
 * Initialize cache
 */
dashboard.cache = {};

/**
 * Load plugins
 */
// TODO - load plugins here
dashboard.plugins = {};

/**
 * Initialize dashboard
 * @param dashboard The name of the dashboard to inialize
 * @param callback The callback to call when there are updates
 */
dashboard.now.init = function(dashboard, callback) {
    if (cache[dashboard] === undefined) {
        cache[dashboard] = 
            fs.readFileSync(__dirname + "/config/" + dashboard + ".json");
    }
    
    // FIXME - this is just a POC
    setInterval(function() {
        for (var item = 0; item < cache[dashboard].length; item++) {
            var plugin = cache[dashboard][item].plugin;
            var url = cache[dashboard][item].url;
            
            // If the plugin required by this url is installed, refresh the data
            if (dashboard.plugins[plugin] !== undefined) {
                var data = dashboard.plugins[plugin](url);
                callback(data);
            }
        }
    }, 10000);
};

/**
 * Static content
 */
app.use(express['static'](__dirname + '/frontend/'));

/**
 * Start server
 */
console.log("Listening on port " + port);
app.listen(port);
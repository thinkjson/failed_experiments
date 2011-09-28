var express = require('express');
var app = express.createServer();
var blog = require("./blog.js");
var contact = require("./contact.js");
var twitter = require("./twitter.js");
var redirects = require("./redirects.js");
global.settings = {};

// Load static content
var oneYear = 1000 * 60 * 60 * 24 * 365; //ish
app.use(express.static(__dirname + '/static', { maxAge: oneYear }));
app.use(express.bodyParser());
app.set('views', __dirname + "/views");

// Handle 500 errors
app.error(function(err, req, res, next) {
    console.error(err.message);
    res.render("error", {
        locals: {
            title: "Error",
            status: 500
        }
    });
});

// Load redirects
redirects.load(app);

// Init blog
blog.init(app);

// Init contact
contact.init(app);

// Init twitter stream
twitter.init(app);

// Export vhost server
if (process.argv[2]) {
    app.listen(process.argv[2], '127.0.0.1');
    console.log("Listening on port " + process.argv[2]);
}
exports.app = app;
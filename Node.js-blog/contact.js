var https = require('https');
var querystring = require('querystring');
var fs = require("fs");
var credentials_file = fs.readFileSync(process.env.HOME + "/.email_credentials", "utf8");
var credentials = require('yaml').eval(credentials_file);

exports.init = function(app) {
	app.all("/contact", function contact(req, res) {
	    // Handle e-mail
	    if (req.method == "POST" && ! req.param('subject')) {
    	    var sender = req.param('sender');
    	    var name = req.param('name');
    	    var message = req.param('message');
    	    
    	    // Set up message
    	    var content = querystring.stringify({
    	        api_user: credentials.user,
    	        api_key: credentials.password,
                to: 'mark@tiemonster.info',
                toname: 'Mark Cahill',
                subject: 'Message from your contact form',
                text: message,
                from: sender,
                fromname: name
            });
    	    
    	    // Initiate REST request
    	    var request = https.request({
    	        method: "POST",
    	        host: "sendgrid.com",
    	        port: 443,
    	        path: "/api/mail.send.json",
    	        headers: {
    	            'Content-Type': 'application/x-www-form-urlencoded',
    	            'Content-length': content.length
    	        }
    	    }, function(response) {
    	        var data = "";
    	        
    	        response.on('data', function(chunk) {
    	            data += chunk;
    	        });
    	        
    	        response.on('end', function() {
    	            console.log(data);
    	        });
    	    });
    	    
    	    // Send request
    	    request.write(content);
    	    request.end();
	    }
		
		// Show form
		var template = req.method == "GET" ? "contact" : "contact_sent";
    	res.render(template, {
    		locals: {
    			title: "Contact me",
    			request: req
    		}
    	});
	});
};

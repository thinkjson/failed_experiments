/**
 * HTTP middleware for performing basic authentication
 */
exports.basic = function(request, response, next) {
    // Check for login
    if (request.headers.authorization && request.headers.authorization.search('Basic ') === 0) {
    	
        // Fetch login and password
        user_hash = new Buffer(request.headers.authorization.split(' ')[1], 'base64').toString();
        
        // Compare to login
        if (user_hash == monitor.config.login) {
            next();
            return;
        }
        
    }
    
    // Log failed login
    monitor.utils.log("Unable to authenticate user");

    // Throw authentication request for failed login
    response.header('WWW-Authenticate', 'Basic realm="monitor.js"');
    
    if (request.headers.authorization) {
        setTimeout(function () {
            response.send('Authentication required', 401);
        }, monitor.config.time_to_reauthenticate);
    } else {
        response.send('Authentication required', 401);
    }
};
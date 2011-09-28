/**
 * Log message to console with timestamp
 * @param message Message to write to console
 */ 
exports.log = function (message) {
    console.log("[" + new Date().toString().substring(0,15) + "] " + message); 
};

/**
 * Return Unix timestamp in human-readable time
 * @param seconds
 * @returns {String}
 */
exports.split_time = function(seconds) {

    hours = Math.floor(seconds/3600); 
    minutes = Math.floor(seconds/60) - (hours*60); 
    seconds = seconds-(hours*3600) - (minutes*60); 
    hs = ' hour';
	ms = ' minute';
	ss = ' second';
	
    if (hours !== 1) {
        hs += 's';
    }
    
    if (minutes !== 1) {
        ms+='s';
    }
    
    if (seconds !== 1) {
        ss+='s';
    }
    
    return hours + hs + ', ' + minutes + ms + ', ' + seconds + ss; 
};
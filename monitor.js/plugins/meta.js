/**
 * Simply returns the server's current configuration
 */
exports.get = function(request, response) {
	response.send({
		host: monitor.config.host,
		plugins: monitor.config.plugins
	});
};